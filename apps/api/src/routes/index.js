import { Router } from 'express';
import healthCheck from './health-check.js';
import bookingsRouter from './bookings.js';
import adminRouter from './admin.js';
import invoicesRouter from './invoices.js';
import whatsappRouter from './whatsapp.js';
import notificationsRouter from './notifications.js';
import stripeRouter from './stripe.js';
import logger from '../utils/logger.js';

const router = Router();

export default () => {
  const appRouter = Router();
  appRouter.get('/health', healthCheck);
  appRouter.use('/bookings', bookingsRouter);
  appRouter.use('/admin', adminRouter);
  appRouter.use('/invoices', invoicesRouter);
  appRouter.use('/whatsapp', whatsappRouter);
  appRouter.use('/notifications', notificationsRouter);
  appRouter.use('/stripe', stripeRouter);

  return appRouter;
};