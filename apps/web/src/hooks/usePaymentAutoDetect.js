import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getBooking, updateBooking } from '@/lib/dataApi.js';

export const usePaymentAutoDetect = (bookingId) => {
  const [isVerified, setIsVerified] = useState(false);
  const [booking, setBooking] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!bookingId || isVerified) return;

    setIsPolling(true);

    const checkPaymentStatus = async () => {
      try {
        const record = await getBooking(bookingId);
        
        if (record.paymentStatus === 'verified') {
          setIsVerified(true);
          setBooking(record);
          setIsPolling(false);
          
          // Automatically update bookingStatus to confirmed if not already done by the backend hook
          if (record.bookingStatus !== 'confirmed') {
            await updateBooking(bookingId, { 
              bookingStatus: 'confirmed' 
            });
          }
          
          toast.success('Payment Confirmed!', {
            description: 'Your booking has been successfully verified and confirmed.'
          });
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    };

    // Initial check
    checkPaymentStatus();

    // Poll every 5 seconds
    const intervalId = setInterval(checkPaymentStatus, 5000);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [bookingId, isVerified]);

  return { isVerified, booking, isPolling };
};