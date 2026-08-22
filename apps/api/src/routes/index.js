import { Router } from "express";

import authRouter from "./authRoutes.js";
import otpRouter from "./otpRoutes.js";
import healthCheck from "./health-check.js";
import bookingsRouter from "./bookingsMongo.js";
import calendarRouter from "./calendarRoutes.js";
import propertyRouter from "./propertyRoutes.js";
import dashboardRouter from "./dashboard.js";
import adminRouter from "./admin.js";
import whatsappRouter from "./whatsapp.js";
import notificationsRouter from "./notifications.js";
import stripeRouter from "./stripe.js";
import userRouter from "./userRoutes.js";

export default () => {
  const appRouter = Router();

  /* =========================================
     HEALTH CHECK
  ========================================= */

  appRouter.get("/health", healthCheck);

  /* =========================================
     AUTH
  ========================================= */

  appRouter.use("/auth", authRouter);
  appRouter.use("/otp", otpRouter);

  /* =========================================
     USERS
  ========================================= */

  appRouter.use("/users", userRouter);

  /* =========================================
     BOOKINGS
  ========================================= */

  appRouter.use("/bookings", bookingsRouter);

  /* =========================================
     CALENDAR
  ========================================= */

  appRouter.use("/calendar", calendarRouter);

  /* =========================================
     PROPERTIES
  ========================================= */

  appRouter.use("/properties", propertyRouter);

  /* =========================================
     DASHBOARD
  ========================================= */

  appRouter.use("/dashboard", dashboardRouter);

  /* =========================================
     ADMIN
  ========================================= */

  appRouter.use("/admin", adminRouter);

  /* =========================================
     WHATSAPP
  ========================================= */

  appRouter.use("/whatsapp", whatsappRouter);

  /* =========================================
     NOTIFICATIONS
  ========================================= */

  appRouter.use("/notifications", notificationsRouter);

  /* =========================================
     PAYMENTS
  ========================================= */

  appRouter.use("/stripe", stripeRouter);

  return appRouter;
};
