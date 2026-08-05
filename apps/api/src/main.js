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

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection at:", promise, "reason:", reason);
});

process.on("SIGINT", async () => {
  logger.info("Interrupted");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  logger.info("Exiting");
  process.exit(0);
});

app.use(helmet());

// Parse comma-separated CORS origins into an array
function getCorsOrigins() {
  const corsEnv = process.env.CORS_ORIGIN || "*";
  if (corsEnv === "*") return "*";
  
  // Parse comma-separated values
  const origins = corsEnv.split(',').map(o => o.trim()).filter(Boolean);
  console.log('[CORS] Configured origins:', origins);
  return origins;
}

const corsOrigin = getCorsOrigins();

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

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

// API Routes
app.use("/api", (req, res, next) => {
  console.log('[API Middleware]', req.method, req.path);
  next();
}, routes());
app.use("/hcgi/api", (req, res, next) => {
  console.log('[HCGI Middleware]', req.method, req.path);
  next();
}, routes());

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

const port = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`🚀 API Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

export default app;