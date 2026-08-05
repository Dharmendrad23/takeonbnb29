import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { toast } from 'sonner';

export const usePaymentAutoDetect = (bookingId) => {
  const [isVerified, setIsVerified] = useState(false);
  const [booking, setBooking] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!bookingId || isVerified) return;

    setIsPolling(true);

    const checkPaymentStatus = async () => {
      try {
        const response = await api.get(`/api/bookings/${bookingId}`);
        const record = response.data;
        
        if (record.paymentStatus === 'verified') {
          setIsVerified(true);
          setBooking(record);
          setIsPolling(false);
          
          if (record.status !== 'confirmed') {
            await api.put(`/api/bookings/${bookingId}`, { status: 'confirmed' });
          }
          
          toast.success('Payment Confirmed!', {
            description: 'Your booking has been successfully verified and confirmed.'
          });
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    };

    checkPaymentStatus();

    const intervalId = setInterval(checkPaymentStatus, 5000);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [bookingId, isVerified]);

  return { isVerified, booking, isPolling };
};