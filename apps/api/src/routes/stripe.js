import express from 'express';
import Stripe from 'stripe';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /stripe/create-checkout - Create Stripe Checkout Session
router.post('/create-checkout', async (req, res) => {
  const { amount, productName, successUrl, cancelUrl } = req.body;

  if (!amount || !productName || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'amount, productName, successUrl, and cancelUrl are required' });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: productName,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  logger.info(`Stripe Checkout Session created: ${session.id}`);
  res.json({ url: session.url });
});

// GET /stripe/session/:sessionId - Retrieve Stripe Checkout Session
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  logger.info(`Stripe session retrieved: ${sessionId}`);
  res.json({
    id: session.id,
    status: session.payment_status,
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
  });
});

export default router;
