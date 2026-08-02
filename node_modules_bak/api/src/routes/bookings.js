import express from 'express';
import twilio from 'twilio';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = `${phone}`.replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return cleaned;
};

// Initialize Twilio client
let twilioClient = null;
let isTwilioConfigured = false;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  if (process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && process.env.TWILIO_ACCOUNT_SID.length === 34) {
    try {
      twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      isTwilioConfigured = true;
      logger.info('Twilio client initialized for bookings');
    } catch (error) {
      logger.warn('Failed to initialize Twilio client:', error.message);
      isTwilioConfigured = false;
    }
  } else {
    logger.warn('Invalid Twilio credentials: TWILIO_ACCOUNT_SID must start with "AC" and be 34 characters long');
    isTwilioConfigured = false;
  }
} else {
  logger.warn('Twilio credentials not configured for bookings');
  isTwilioConfigured = false;
}

// GET /bookings/search - Search bookings with filters
router.get('/search', async (req, res) => {
  const { guestName, propertyId, status, dateFrom, dateTo, page = 1, perPage = 50 } = req.query;

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

  const result = await pb.collection('bookings').getList(parseInt(page), parseInt(perPage), {
    filter: filterString,
    sort: '-created',
  });

  logger.info(`Bookings search executed with filters: ${filterString || 'none'}`);
  res.json(result);
});

// POST /bookings/create - Create a new booking
router.post('/create', async (req, res) => {
  const {
    propertyId,
    guestId,
    guestFullName,
    guestMobileNumber,
    guestEmail,
    propertyName,
    checkInDate,
    checkOutDate,
    guestCount,
    totalAmount,
    specialRequests,
  } = req.body;

  // Validate all required fields
  const requiredFields = [
    'propertyId',
    'guestFullName',
    'guestMobileNumber',
    'guestEmail',
    'propertyName',
    'checkInDate',
    'checkOutDate',
    'guestCount',
    'totalAmount',
  ];

  for (const field of requiredFields) {
    const value = req.body[field];
    if (value === undefined || value === null || value === '') {
      throw new Error(`Missing or empty required field: ${field}`);
    }
  }

  // Check for duplicate bookings
  const existingBookings = await pb.collection('bookings').getList(1, 1, {
    filter: `propertyId="${propertyId}" && ((checkInDate >= "${checkInDate}" && checkInDate < "${checkOutDate}") || (checkOutDate > "${checkInDate}" && checkOutDate <= "${checkOutDate}"))`,
  });

  if (existingBookings.items && existingBookings.items.length > 0) {
    throw new Error('Property already booked for these dates');
  }

  // Create booking record
  const booking = await pb.collection('bookings').create({
    propertyId,
    guestId: guestId || null,
    guestFullName,
    guestMobileNumber,
    guestEmail,
    propertyName,
    checkInDate,
    checkOutDate,
    guestCount,
    totalAmount,
    specialRequests: specialRequests || '',
    status: 'pending',
    paymentStatus: 'pending',
  });

  logger.info(`Booking created: ${booking.id}`);
  res.status(201).json(booking);
});

// GET /bookings/:bookingId - Retrieve booking details
router.get('/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  const booking = await pb.collection('bookings').getOne(bookingId);

  res.json(booking);
});

// PATCH /bookings/:bookingId/status - Update booking status
router.patch('/:bookingId/status', async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const booking = await pb.collection('bookings').update(bookingId, { status });

  // Log action to activity_logs
  await pb.collection('activity_logs').create({
    actionType: 'status_update',
    targetId: bookingId,
    targetType: 'booking',
    details: `Status changed to ${status}`,
  });

  logger.info(`Booking ${bookingId} status updated to ${status}`);
  res.json(booking);
});

// PATCH /bookings/:bookingId/payment - Update payment status
router.patch('/:bookingId/payment', async (req, res) => {
  const { bookingId } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({ error: 'Payment status is required' });
  }

  const validPaymentStatuses = ['pending', 'paid', 'failed'];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({ error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}` });
  }

  const booking = await pb.collection('bookings').update(bookingId, { paymentStatus });

  // If payment is marked as paid, trigger invoice generation
  if (paymentStatus === 'paid') {
    // Trigger invoice generation (will be handled by separate endpoint)
    logger.info(`Payment marked as paid for booking ${bookingId}. Invoice generation triggered.`);
  }

  // Log action to activity_logs
  await pb.collection('activity_logs').create({
    actionType: 'payment_update',
    targetId: bookingId,
    targetType: 'booking',
    details: `Payment status changed to ${paymentStatus}`,
  });

  logger.info(`Booking ${bookingId} payment status updated to ${paymentStatus}`);
  res.json(booking);
});

// POST /bookings/send-booking-confirmation-message - Send booking confirmation message to the guest
router.post('/send-booking-confirmation-message', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  const booking = await pb.collection('bookings').getOne(bookingId, {
    expand: 'propertyId,guestId',
  });

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const sentChannels = [];
  const confirmationText = `Hello ${booking.guestFullName || 'guest'}, your booking request for ${booking.propertyName || 'TakeOnBnB'} has been received. We will verify the payment and confirm your stay shortly. Booking ID: ${booking.id}`;

  if (booking.guestEmail) {
    try {
      await pb.sendMail({
        to: booking.guestEmail,
        subject: `Booking Received - ${booking.propertyName || 'TakeOnBnB'}`,
        html: `<p>Hello ${booking.guestFullName || 'guest'},</p><p>Your booking request has been received and is being processed.</p><p>Booking ID: ${booking.id}</p><p>Thank you for choosing TakeOnBnB.</p>`,
      });
      sentChannels.push('email');
    } catch (emailError) {
      logger.warn(`Failed to send confirmation email to ${booking.guestEmail}:`, emailError.message);
    }
  }

  if (booking.guestMobileNumber && isTwilioConfigured) {
    const normalizedPhone = normalizePhoneNumber(booking.guestMobileNumber);
    if (normalizedPhone) {
      try {
        await twilioClient.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: normalizedPhone,
          body: confirmationText,
        });
        sentChannels.push('sms');
      } catch (smsError) {
        logger.warn(`Failed to send confirmation SMS to ${booking.guestMobileNumber}:`, smsError.message);
      }
    }
  }

  res.json({
    success: true,
    sentChannels,
    message: sentChannels.length > 0 ? 'Confirmation message sent' : 'No confirmation channels were available',
  });
});

// POST /bookings/send-booking-confirmation-email - Send booking confirmation email
router.post('/send-booking-confirmation-email', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  // Fetch booking with expanded relations
  const booking = await pb.collection('bookings').getOne(bookingId, {
    expand: 'propertyId,guestId',
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Generate professional HTML email template
  const confirmationNumber = booking.id.substring(0, 8).toUpperCase();
  const checkInDate = new Date(booking.checkInDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px 20px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 12px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 500;
          color: #666;
        }
        .info-value {
          color: #333;
          text-align: right;
        }
        .highlight {
          background-color: #f0f4ff;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 15px 0;
          border-radius: 4px;
        }
        .highlight-title {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 8px;
        }
        .amount-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
        }
        .amount-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .amount-total {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 2px solid #ddd;
          margin-top: 8px;
          font-size: 18px;
          font-weight: 600;
          color: #667eea;
        }
        .instructions {
          background-color: #fffbf0;
          padding: 15px;
          border-left: 4px solid #ff9800;
          border-radius: 4px;
          margin: 15px 0;
        }
        .instructions-title {
          font-weight: 600;
          color: #ff9800;
          margin-bottom: 8px;
        }
        .instructions ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        .instructions li {
          margin: 5px 0;
          font-size: 14px;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .footer-link {
          color: #667eea;
          text-decoration: none;
        }
        .confirmation-badge {
          display: inline-block;
          background-color: #4caf50;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Booking Confirmed</h1>
          <p>Your reservation has been successfully confirmed</p>
          <div class="confirmation-badge">Confirmation #${confirmationNumber}</div>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Property Details</div>
            <div class="info-row">
              <span class="info-label">Property Name:</span>
              <span class="info-value">${booking.propertyName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Property ID:</span>
              <span class="info-value">${booking.propertyId}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Guest Information</div>
            <div class="info-row">
              <span class="info-label">Guest Name:</span>
              <span class="info-value">${booking.guestFullName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${booking.guestEmail}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${booking.guestMobileNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of Guests:</span>
              <span class="info-value">${booking.guestCount}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Booking Dates</div>
            <div class="highlight">
              <div class="highlight-title">Check-in</div>
              <div>${checkInDate}</div>
              <div style="font-size: 12px; color: #666; margin-top: 5px;">After 3:00 PM</div>
            </div>
            <div class="highlight">
              <div class="highlight-title">Check-out</div>
              <div>${checkOutDate}</div>
              <div style="font-size: 12px; color: #666; margin-top: 5px;">Before 11:00 AM</div>
            </div>
          </div>

          ${booking.specialRequests ? `
          <div class="section">
            <div class="section-title">Special Requests</div>
            <div style="padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
              ${booking.specialRequests}
            </div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Amount Details</div>
            <div class="amount-section">
              <div class="amount-row">
                <span>Subtotal:</span>
                <span>₹${booking.totalAmount}</span>
              </div>
              <div class="amount-row">
                <span>Taxes & Fees:</span>
                <span>₹${(booking.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div class="amount-total">
                <span>Total Amount:</span>
                <span>₹${(booking.totalAmount * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="instructions">
              <div class="instructions-title">📋 Check-in & Check-out Instructions</div>
              <ul>
                <li><strong>Early Check-in:</strong> Available upon request (subject to availability)</li>
                <li><strong>Late Check-out:</strong> Available upon request (subject to availability)</li>
                <li><strong>Key Collection:</strong> Keys will be provided at check-in</li>
                <li><strong>House Rules:</strong> Please review the property rules before arrival</li>
                <li><strong>Emergency Contact:</strong> Available 24/7 for any assistance</li>
              </ul>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="info-row">
              <span class="info-label">Support Email:</span>
              <span class="info-value">support@takeonbnb.com</span>
            </div>
            <div class="info-row">
              <span class="info-label">Support Phone:</span>
              <span class="info-value">+91 9058682991</span>
            </div>
            <div class="info-row">
              <span class="info-label">WhatsApp:</span>
              <span class="info-value">+91 9058682991</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">Thank you for choosing TakeOnBnB!</p>
          <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this email.</p>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #999;">
            © 2024 TakeOnBnB. All rights reserved. | 
            <a href="#" class="footer-link">Privacy Policy</a> | 
            <a href="#" class="footer-link">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email using PocketBase
  await pb.sendMail({
    to: booking.guestEmail,
    subject: `Booking Confirmation - ${booking.propertyName}`,
    html: emailTemplate,
  });

  logger.info(`Confirmation email sent to ${booking.guestEmail} for booking ${bookingId}`);
  res.json({ success: true, message: 'Confirmation email sent' });
});

// POST /bookings/send-booking-whatsapp - Send booking WhatsApp notification
router.post('/send-booking-whatsapp', async (req, res) => {
  const { bookingId, businessPhone } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  if (!businessPhone) {
    return res.status(400).json({ error: 'businessPhone is required' });
  }

  if (!isTwilioConfigured) {
    throw new Error('Twilio is not configured. Please set valid Twilio credentials in .env');
  }

  // Fetch booking with expanded relations
  const booking = await pb.collection('bookings').getOne(bookingId, {
    expand: 'propertyId,guestId',
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Format professional WhatsApp message
  const messageText = `🏠 *New Booking Notification*

📍 *Property:* ${booking.propertyName}
👤 *Guest:* ${booking.guestFullName}
📅 *Check-in:* ${booking.checkInDate}
📅 *Check-out:* ${booking.checkOutDate}
👥 *Guests:* ${booking.guestCount}
💰 *Total:* ₹${booking.totalAmount}
🔑 *Booking ID:* ${booking.id}
📞 *Contact:* ${booking.guestMobileNumber}

✅ Please confirm the booking in the admin panel.`;

  // Send via Twilio
  const result = await twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: businessPhone,
    body: messageText,
  });

  logger.info(`WhatsApp notification sent to ${businessPhone} for booking ${bookingId}. Message SID: ${result.sid}`);
  res.json({ success: true, messageSid: result.sid });
});

export default router;