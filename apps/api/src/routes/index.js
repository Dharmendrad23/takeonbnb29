import { Router } from "express";
import authRouter from "./authRoutes.js";
import otpRouter from "./otpRoutes.js";
import healthCheck from "./health-check.js";
import bookingsRouter from "./bookingsMongo.js";
import propertyRouter from "./propertyRoutes.js";
import dashboardRouter from "./dashboard.js";
import adminRouter from "./admin.js";
import whatsappRouter from "./whatsapp.js";
import notificationsRouter from "./notifications.js";
import stripeRouter from "./stripe.js";

export default () => {
  const appRouter = Router();

  appRouter.get("/health", healthCheck);

  appRouter.use("/auth", authRouter);
  appRouter.use("/otp", otpRouter);
  appRouter.use("/bookings", bookingsRouter);
  appRouter.use("/properties", propertyRouter);
appRouter.use("/dashboard", dashboardRouter);
  appRouter.use("/admin", adminRouter);
  appRouter.use("/whatsapp", whatsappRouter);
  appRouter.use("/notifications", notificationsRouter);
  appRouter.use("/stripe", stripeRouter);

  return appRouter;
};
