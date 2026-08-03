import { Router } from "express";

import authRouter from "./auth.js";
import healthCheck from "./health-check.js";
import bookingsRouter from "./bookingsMongo.js";
import propertyRouter from "./propertyRoutes.js";
import adminRouter from "./admin.js";
import whatsappRouter from "./whatsapp.js";
import notificationsRouter from "./notifications.js";
import stripeRouter from "./stripe.js";
import reviewsRouter from "./reviews.js";
import wishlistRouter from "./wishlist.js";
import usersRouter from "./users.js";
import amenitiesRouter from "./amenities.js";

export default () => {
  const appRouter = Router();

  // Health
  appRouter.get("/health", healthCheck);

  // API Routes
  appRouter.use("/auth", authRouter);
  appRouter.use("/bookings", bookingsRouter);
  appRouter.use("/properties", propertyRouter);
  appRouter.use("/admin", adminRouter);
  appRouter.use("/whatsapp", whatsappRouter);
  appRouter.use("/notifications", notificationsRouter);
  appRouter.use("/stripe", stripeRouter);
  appRouter.use("/reviews", reviewsRouter);
  appRouter.use("/wishlist", wishlistRouter);
  appRouter.use("/favorites", wishlistRouter);
  appRouter.use("/users", usersRouter);
  appRouter.use("/amenities", amenitiesRouter);

  return appRouter;
};
