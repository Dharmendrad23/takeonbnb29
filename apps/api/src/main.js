import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.js";
import { globalRateLimit } from "./middleware/global-rate-limit.js";
import logger from "./utils/logger.js";
import { BodyLimit } from "./constants/common.js";
import connectDB from "./config/database.js";

const app = express();

app.set("trust proxy", true);

/* =========================================
   ERROR HANDLING
========================================= */

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    "Unhandled rejection at:",
    promise,
    "reason:",
    reason
  );
});

process.on("SIGINT", async () => {
  logger.info("Interrupted");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received");

  await new Promise((resolve) =>
    setTimeout(resolve, 3000)
  );

  logger.info("Exiting");
  process.exit(0);
});

/* =========================================
   SECURITY
========================================= */

app.use(helmet());

/* =========================================
   CORS
========================================= */

const ALLOWED_ORIGINS = Array.from(
  new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    "https://takeonbnb.com",
    "https://www.takeonbnb.com",

    "https://takeonbnb29.netlify.app",
    "https://takeonbnb29.onrender.com",

    ...(process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN
          .split(",")
          .map((origin) => origin.trim())
          .filter(Boolean)
      : []),
  ])
);

console.log(
  "[CORS] Allowed origins:",
  ALLOWED_ORIGINS
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `[CORS] Blocked origin: ${origin}`
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

/* =========================================
   MIDDLEWARE
========================================= */

app.use(morgan("combined"));

app.use(globalRateLimit);

app.use(
  express.json({
    limit: BodyLimit,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: BodyLimit,
  })
);

/* =========================================
   API ROUTES
========================================= */

app.use(
  "/api",
  (req, res, next) => {
    console.log(
      `[API] ${req.method} ${req.path}`
    );

    next();
  },
  routes()
);

/* =========================================
   HCGI API ROUTES
========================================= */

app.use(
  "/hcgi/api",
  (req, res, next) => {
    console.log(
      `[HCGI API] ${req.method} ${req.path}`
    );

    next();
  },
  routes()
);

/* =========================================
   ERROR MIDDLEWARE
========================================= */

app.use(errorMiddleware);

/* =========================================
   404
========================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* =========================================
   START SERVER
========================================= */

const port = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(
        `🚀 API Server running on http://localhost:${port}`
      );
    });
  })
  .catch((err) => {
    logger.error(
      "❌ Failed to connect to MongoDB:",
      err
    );

    process.exit(1);
  });

export default app;