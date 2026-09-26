import Razorpay from "razorpay";

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const createRazorpayOrder = async (options) => {
  return getRazorpay().orders.create(options);
};

export const fetchRazorpayOrder = async (orderId) => {
  return getRazorpay().orders.fetch(orderId);
};

export const createRazorpayPaymentLink = async (options) => {
  return getRazorpay().paymentLink.create(options);
};

export const fetchRazorpayPaymentLink = async (paymentLinkId) => {
  return getRazorpay().paymentLink.fetch(paymentLinkId);
};

export const fetchRazorpayPayment = async (paymentId) => {
  return getRazorpay().payments.fetch(paymentId);
};

export default {
  orders: {
    create: createRazorpayOrder,
    fetch: fetchRazorpayOrder,
  },
  paymentLink: {
    create: createRazorpayPaymentLink,
    fetch: fetchRazorpayPaymentLink,
  },
  payments: {
    fetch: fetchRazorpayPayment,
  },
};
