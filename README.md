# TakeOnBnb

A full-stack property rental platform (Airbnb-style) built with React, Node.js/Express, and MongoDB.

## Project Structure

```
takeonbnb29/
├── apps/
│   ├── web/        # React + Vite frontend (port 3000)
│   ├── api/        # Node.js + Express backend (port 3001)
│   └── pocketbase/ # PocketBase instance (port 8090)
├── dist/           # Production build output
└── package.json    # Root workspace config
```

## Prerequisites

- [Node.js](https://nodejs.org/) v22 (see `.nvmrc`)
- [npm](https://www.npmjs.com/) v10+
- A [MongoDB](https://www.mongodb.com/) database (Atlas or local)

If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in the project root to switch to the correct Node version.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Dharmendrad23/takeonbnb29.git
cd takeonbnb29
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

**Backend** — create or edit `apps/api/.env`:

```env
PORT=3001
CORS_ORIGIN=http://127.0.0.1:3000,http://localhost:3000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

# Optional — email (Nodemailer / SMTP)
SMTP_EMAIL=<your-email>
SMTP_PASSWORD=<your-email-app-password>

# Optional — payments
STRIPE_SECRET_KEY=<your-stripe-secret-key>

# Optional — SMS/WhatsApp
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
```

**Frontend** — the development server automatically proxies `/api` requests to `http://localhost:8090`. No extra `.env` file is required for local development.

### 4. Start development servers

Run both the frontend and backend together from the project root:

```bash
npm run dev
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://127.0.0.1:3000        |
| Backend  | http://localhost:3001        |

---

## Building for Production

```bash
npm run build
```

The compiled frontend is placed in `dist/apps/web/`.

---

## Running in Production

### Backend

```bash
npm start
```

This runs `apps/api/src/main.js` using the environment variables defined in `apps/api/.env`.

### Frontend

After building, serve the static files from `dist/apps/web/` with any static file host (Nginx, Apache, Caddy, Vercel, Netlify, etc.).

Set the environment variable `VITE_API_URL` (in `apps/web/.env.production`) to point to your deployed API:

```env
VITE_API_URL=https://your-api-domain.com
```

Then rebuild:

```bash
npm run build
```

---

## Deploying to the Cloud

### Frontend — Vercel / Netlify

1. Connect your GitHub repository.
2. Set the **root directory** to `apps/web` (or configure the build command to `npm run build --prefix apps/web`).
3. Add the `VITE_API_URL` environment variable pointing to your API.
4. Deploy.

### Backend — Render / Railway / Fly.io

1. Connect your GitHub repository.
2. Set the **root directory** to `apps/api`.
3. Set the **start command** to `node --env-file=.env src/main.js` (or use the platform's environment variable settings instead of `--env-file`).
4. Add all required environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
5. Deploy.

> **Tip:** The live API is currently hosted at `https://takeonbnb-api.onrender.com`.

---

## Linting

```bash
npm run lint
```

---

## CI / CD

A GitHub Actions workflow (`.github/workflows/node.js.yml`) automatically installs dependencies and builds the project on every push/PR to `main`.
