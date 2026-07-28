import { Router } from "express";

import healthCheck from "./health-check.js";
import bookingsRouter from "./bookingsMongo.js";
import propertyRouter from "./propertyRoutes.js";
import adminRouter from "./admin.js";
import whatsappRouter from "./whatsapp.js";
import notificationsRouter from "./notifications.js";
import stripeRouter from "./stripe.js";

export default () => {
  const appRouter = Router();

  // Health
  appRouter.get("/health", healthCheck);

  // API Routes
  appRouter.use("/bookings", bookingsRouter);
  appRouter.use("/properties", propertyRouter);
  appRouter.use("/admin", adminRouter);
  appRouter.use("/whatsapp", whatsappRouter);
  appRouter.use("/notifications", notificationsRouter);
  appRouter.use("/stripe", stripeRouter);

  return appRouter;
};