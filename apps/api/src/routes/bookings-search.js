import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /bookings/search - Search bookings with filters
router.get('/', async (req, res) => {
  const { guestName, propertyId, status, dateFrom, dateTo } = req.query;

  const filters = [];

  if (guestName) {
    filters.push(`guestFullName ~ "${guestName}"`);
  }

  if (propertyId) {
    filters.push(`propertyId = "${propertyId}"`);
  }

  if (status) {
    filters.push(`status = "${status}"`);
  }

  if (dateFrom) {
    filters.push(`checkInDate >= "${dateFrom}"`);
  }

  if (dateTo) {
    filters.push(`checkOutDate <= "${dateTo}"`);
  }

  const filterString = filters.length > 0 ? filters.join(' && ') : '';

  const result = await pb.collection('bookings').getList(1, 50, {
    filter: filterString,
    sort: '-created',
  });

  logger.info(`Bookings search executed with filters: ${filterString}`);
  res.json(result);
});

export default router;