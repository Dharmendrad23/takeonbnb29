import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async ({
  amount,
  receipt,
  notes = {},
}) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("RAZORPAY_KEY_ID is not configured");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: String(receipt),
    notes,
  });

  return order;
};

export const fetchRazorpayOrder = async (orderId) => {
  return razorpay.orders.fetch(orderId);
};

export const fetchRazorpayPayment = async (paymentId) => {
  return razorpay.payments.fetch(paymentId);
};

export default razorpay;
