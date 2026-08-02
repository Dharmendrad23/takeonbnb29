import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';
import logger from '../utils/logger.js';
import { sendEmail, isEmailServiceConfigured } from '../utils/mailer.js';

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Check if Twilio credentials are valid
let twilioClient = null;
let isTwilioConfigured = false;

if (accountSid && authToken && twilioPhoneNumber) {
  // Validate that accountSid looks like a valid Twilio SID (starts with 'AC')
  if (accountSid.startsWith('AC') && accountSid.length === 34) {
    try {
      twilioClient = twilio(accountSid, authToken);
      isTwilioConfigured = true;
      logger.info('Twilio SMS client initialized successfully');
    } catch (error) {
      logger.warn('Failed to initialize Twilio client:', error.message);
      isTwilioConfigured = false;
    }
  } else {
    logger.warn(
      'Invalid Twilio credentials: TWILIO_ACCOUNT_SID must be a valid SID starting with "AC" and be 34 characters long. SMS service will be unavailable.'
    );
    isTwilioConfigured = false;
  }
} else {
  logger.warn(
    'Twilio credentials not configured. SMS service will be unavailable. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env'
  );
  isTwilioConfigured = false;
}

// POST /notifications/send-sms - Send SMS notification
router.post('/send-sms', async (req, res) => {
  if (!isTwilioConfigured) {
    throw new Error('SMS service is not configured. Please configure valid Twilio credentials.');
  }

  const { recipientPhone, messageBody } = req.body;

  if (!recipientPhone || !messageBody) {
    return res.status(400).json({ error: 'recipientPhone and messageBody are required' });
  }

  const message = await twilioClient.messages.create({
    body: messageBody,
    from: twilioPhoneNumber,
    to: recipientPhone,
  });

  logger.info(`SMS sent successfully to ${recipientPhone}. Message SID: ${message.sid}`);
  res.json({ success: true, messageSid: message.sid });
});

// POST /notifications/send-email - Send Email notification  ⬅️ YEH NAYA ADD HUA
router.post('/send-email', async (req, res) => {
  if (!isEmailServiceConfigured()) {
    return res.status(500).json({ error: 'Email service is not configured. Please configure valid SMTP credentials.' });
  }

  const { recipientEmail, subject, messageBody } = req.body;

  if (!recipientEmail || !messageBody) {
    return res.status(400).json({ error: 'recipientEmail and messageBody are required' });
  }

  try {
    const info = await sendEmail({ to: recipientEmail, subject: subject || 'Notification', text: messageBody });
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    logger.error(`Failed to send email to ${recipientEmail}:`, error.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;