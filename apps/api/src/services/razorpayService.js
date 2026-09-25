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

export const createRazorpayPaymentLink = async ({
  amount,
  referenceId,
  description,
  customer = {},
  notes = {},
  callbackUrl,
}) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("RAZORPAY_KEY_ID is not configured");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }

  if (!callbackUrl) {
    throw new Error(
      "RAZORPAY_CALLBACK_URL is not configured"
    );
  }

  const paymentLink =
    await razorpay.paymentLink.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      accept_partial: false,
      reference_id: String(referenceId),
      description: String(description || "TakeOnBnB Booking"),
      customer: {
        name: String(customer.name || ""),
        email: String(customer.email || ""),
        contact: String(customer.contact || ""),
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: false,
      notes,
      callback_url: callbackUrl,
      callback_method: "get",
    });

  return paymentLink;
};

export const fetchRazorpayOrder = async (orderId) => {
  return razorpay.orders.fetch(orderId);
};

export const fetchRazorpayPayment = async (paymentId) => {
  return razorpay.payments.fetch(paymentId);
};

export const fetchRazorpayPaymentLink = async (
  paymentLinkId
) => {
  return razorpay.paymentLink.fetch(paymentLinkId);
};

export default razorpay;
