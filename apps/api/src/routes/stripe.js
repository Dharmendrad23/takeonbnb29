import express from 'express';
import Stripe from 'stripe';
import logger from '../utils/logger.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /stripe/create-checkout
router.post('/create-checkout', async (req, res) => {
  try {
    const {
      amount,
      productName,
      successUrl,
      cancelUrl,
      bookingId,
    } = req.body;

    if (!amount || !productName || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        error:
          'amount, productName, successUrl, and cancelUrl are required',
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment amount',
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'inr',

            product_data: {
              name: productName,
            },

            // Stripe INR amount is in paise
            unit_amount: Math.round(numericAmount * 100),
          },

          quantity: 1,
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,

      metadata: {
        bookingId: bookingId ? String(bookingId) : '',
      },
    });

    logger.info(
      `Stripe Checkout Session created: ${session.id}`
    );

    return res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);

    logger.error(
      `Stripe checkout error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        'Failed to create Stripe checkout session',
    });
  }
});

// GET /stripe/session/:sessionId
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required',
      });
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    logger.info(
      `Stripe session retrieved: ${sessionId}`
    );

    return res.json({
      success: true,

      id: session.id,

      status: session.payment_status,

      paymentStatus: session.payment_status,

      amountTotal: session.amount_total,

      currency: session.currency,

      customerEmail:
        session.customer_details?.email || '',

      bookingId:
        session.metadata?.bookingId || null,

      metadata: session.metadata || {},
    });
  } catch (error) {
    console.error(
      'Stripe session verification error:',
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        'Failed to verify Stripe session',
    });
  }
});

export default router;