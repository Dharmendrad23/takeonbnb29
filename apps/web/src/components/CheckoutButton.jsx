import React, { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiServerClient from "@/lib/apiServerClient.js";
import { toast } from "sonner";
import { formatCurrencyINR } from "@/lib/bookingUtils.js";

const CheckoutButton = ({
  amount: propAmount,
  bookingData,
  className = "",
}) => {
  const [isProcessing, setIsProcessing] =
    useState(false);

  const amount = Number(
    propAmount ??
      bookingData?.totalPrice ??
      bookingData?.totalAmount ??
      bookingData?.amount ??
      0
  );

  const handleCheckout = async () => {
    if (isProcessing) return;

    if (!bookingData?.propertyId) {
      toast.error(
        "Property information is missing."
      );
      return;
    }

    if (
      !bookingData?.checkInDate ||
      !bookingData?.checkOutDate
    ) {
      toast.error(
        "Please select valid check-in and check-out dates."
      );
      return;
    }

    setIsProcessing(true);

    try {
      console.log(
        "[PAYMENT] Creating Razorpay hosted Payment Link..."
      );

      const response =
        await apiServerClient.fetch(
          "/razorpay/create-payment-link",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              propertyId:
                bookingData.propertyId,

              checkInDate:
                bookingData.checkInDate,

              checkOutDate:
                bookingData.checkOutDate,

              guestCount: Number(
                bookingData.guests ??
                  bookingData.guestCount ??
                  1
              ),

              guestFullName:
                bookingData.guestFullName ||
                "",

              guestEmail:
                bookingData.guestEmail ||
                "",

              guestMobileNumber:
                bookingData.guestMobileNumber ||
                "",

              specialRequests:
                bookingData.specialRequests ||
                "",
            }),
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      console.log(
        "[PAYMENT] Payment Link response:",
        data
      );

      if (response.status === 401) {
        toast.error(
          "Please login before making a payment."
        );

        setIsProcessing(false);

        setTimeout(() => {
          window.location.href =
            `/guest/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;
        }, 700);

        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to create payment link."
        );
      }

      if (!data.bookingId) {
        throw new Error(
          "Booking ID missing."
        );
      }

      if (!data.paymentUrl) {
        throw new Error(
          "Razorpay payment link missing."
        );
      }

      if (
        !Number(data.amount) ||
        Number(data.amount) <= 0
      ) {
        throw new Error(
          "Invalid payment amount."
        );
      }

      console.log(
        "[PAYMENT] Redirecting to Razorpay:",
        {
          bookingId:
            data.bookingId,

          paymentLinkId:
            data.paymentLinkId,

          amount:
            data.amount,

          paymentUrl:
            data.paymentUrl,
        }
      );

      /*
       * No Razorpay iframe.
       * No checkout.js.
       * No popup/watchdog/CSS hack.
       *
       * Browser goes directly to Razorpay's
       * hosted checkout page.
       */
      window.location.assign(
        data.paymentUrl
      );
    } catch (error) {
      console.error(
        "[PAYMENT] Checkout error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to start payment."
      );

      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Button
        type="button"
        onClick={handleCheckout}
        disabled={
          isProcessing ||
          amount <= 0
        }
        className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg rounded-xl transition-all shadow-md hover:shadow-brand active:scale-[0.98] ${className}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Opening Secure Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay {formatCurrencyINR(amount)}
          </>
        )}
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground pt-2">
        <span>UPI</span>
        <span>Credit/Debit Cards</span>
        <span>Net Banking</span>
        <span>Wallets</span>
      </div>
    </div>
  );
};

export default CheckoutButton;
