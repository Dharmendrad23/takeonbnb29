import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// WhatsApp/Twilio integration is currently disabled
// To enable, configure valid Twilio credentials in .env:
// - WHATSAPP_ACCOUNT_SID (must start with 'AC')
// - WHATSAPP_AUTH_TOKEN
// - WHATSAPP_PHONE_NUMBER

logger.info('WhatsApp route loaded (Twilio integration disabled)');

// POST /whatsapp/send - Send WhatsApp message (disabled)
router.post('/send', async (req, res) => {
  return res.status(503).json({
    error: 'WhatsApp service is not available',
    message: 'Twilio WhatsApp integration is currently disabled. Please contact administrator to enable this feature.',
  });
});

export default router;