import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /admin/activity-log - Create activity log
router.post('/activity-log', async (req, res) => {
  const { actionType, targetId, targetType, details } = req.body;

  if (!actionType || !targetId || !targetType) {
    return res.status(400).json({ error: 'actionType, targetId, and targetType are required' });
  }

  const activityLog = await pb.collection('activity_logs').create({
    actionType,
    targetId,
    targetType,
    details: details || '',
  });

  logger.info(`Activity log created: ${activityLog.id}`);
  res.status(201).json(activityLog);
});

// GET /admin/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  // Get total bookings
  const allBookings = await pb.collection('bookings').getList(1, 1, {
    filter: '',
  });
  const totalBookings = allBookings.totalItems;

  // Get pending bookings
  const pendingBookings = await pb.collection('bookings').getList(1, 1, {
    filter: 'status = "pending"',
  });

  // Get confirmed bookings
  const confirmedBookings = await pb.collection('bookings').getList(1, 1, {
    filter: 'status = "confirmed"',
  });

  // Get total revenue (sum of totalAmount where paymentStatus = 'paid')
  const paidBookings = await pb.collection('bookings').getFullList({
    filter: 'paymentStatus = "paid"',
  });
  const totalRevenue = paidBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

  // Calculate occupancy rate (simplified: booked nights / total possible nights)
  // This is a basic calculation - adjust based on your business logic
  const allBookingsForOccupancy = await pb.collection('bookings').getFullList({
    filter: 'status = "confirmed" || status = "completed"',
  });

  let totalBookedNights = 0;
  allBookingsForOccupancy.forEach((booking) => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    totalBookedNights += nights;
  });

  // Assuming 365 days per year and average property count
  const occupancyRate = totalBookedNights > 0 ? ((totalBookedNights / 365) * 100).toFixed(2) : 0;

  const stats = {
    totalBookings,
    pendingBookings: pendingBookings.totalItems,
    confirmedBookings: confirmedBookings.totalItems,
    totalRevenue,
    occupancyRate: parseFloat(occupancyRate),
  };

  logger.info('Dashboard stats retrieved');
  res.json(stats);
});

export default router;