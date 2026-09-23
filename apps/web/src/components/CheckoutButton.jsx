import React, { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import apiServerClient from "@/lib/apiServerClient.js";
import { formatCurrencyINR } from "@/lib/bookingUtils.js";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const CheckoutButton = ({ bookingData, className = "" }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!bookingData) {
      toast.error("Booking information is missing");
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay checkout could not be loaded");
      }

      const response = await apiServerClient.fetch(
        "/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: bookingData.propertyId,
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            guestCount: bookingData.guests,
            guestFullName: bookingData.guestFullName || "",
            guestEmail: bookingData.guestEmail || "",
            guestMobileNumber:
              bookingData.guestMobileNumber || "",
            specialRequests:
              bookingData.specialRequests || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create payment order"
        );
      }

      const options = {
        key: data.razorpayKeyId,
        amount: Math.round(Number(data.amount) * 100),
        currency: data.currency || "INR",
        name: "TakeOnBnB",
        description:
          bookingData.property?.title || "Property Booking",
        order_id: data.razorpayOrderId,

        prefill: {
          name: data.customer?.name || "",
          email: data.customer?.email || "",
          contact: data.customer?.phone || "",
        },

        notes: {
          bookingId: data.bookingId,
        },

        theme: {
          color: "#F59E0B",
        },

        handler: async function (paymentResponse) {
          try {
            const verifyResponse =
              await apiServerClient.fetch(
                "/razorpay/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(paymentResponse),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed"
              );
            }

            toast.success(
              "Payment successful! Booking confirmed."
            );

            window.location.href =
              `/booking-confirmation/${verifyData.bookingId}`;
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            toast.error(
              error.message ||
                "Payment completed but verification failed. Please contact support."
            );

            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment window closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          toast.error(
            response.error?.description ||
              "Payment failed"
          );

          setIsProcessing(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay checkout error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to start payment"
      );

      setIsProcessing(false);
    }
  };

  const amount =
    bookingData?.totalPrice ||
    bookingData?.totalAmount ||
    0;

  return (
    <Button
      type="button"
      onClick={handleCheckout}
      disabled={isProcessing || !bookingData}
      className={`w-full ${className}`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay {formatCurrencyINR(amount)}
        </>
      )}
    </Button>
  );
};

export default CheckoutButton;


