import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Calendar, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { formatCurrencyINR, formatDate } from '@/lib/bookingUtils.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const PaymentSuccessModal = ({ bookingId, isOpen, onClose }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && bookingId) {
      const fetchBooking = async () => {
        try {
          const record = await pb.collection('bookings').getOne(bookingId, {
            expand: 'propertyId',
            $autoCancel: false
          });
          setBooking(record);
        } catch (error) {
          console.error('Error fetching booking:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [isOpen, bookingId]);

  const handleDownloadReceipt = async () => {
    try {
      const response = await apiServerClient.fetch(`/invoices/${bookingId}`);
      if (!response.ok) throw new Error('Failed to generate receipt');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Could not download receipt. Please try again later.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-emerald-500 p-8 text-center relative overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-white relative z-10">Payment Successful!</h2>
          <p className="text-emerald-50 font-medium mt-2 relative z-10">
            {booking ? `${formatCurrencyINR(booking.totalAmount || booking.totalPrice)} has been deducted from your account.` : 'Your payment has been processed.'}
          </p>
          
          {/* Simple CSS Confetti effect */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: "50%", opacity: 1 }}
                animate={{ 
                  y: 200, 
                  x: `${Math.random() * 100}%`,
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute top-0 w-2 h-2 bg-white rounded-sm"
                style={{ left: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 bg-card">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-24 bg-muted rounded-xl"></div>
              <div className="h-10 bg-muted rounded-xl"></div>
            </div>
          ) : booking ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Confirmation Number</p>
                <p className="font-mono text-lg font-bold text-foreground">{booking.id.toUpperCase()}</p>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                    {booking.expand?.propertyId?.coverImage && (
                      <img 
                        src={pb.files.getUrl(booking.expand.propertyId, booking.expand.propertyId.coverImage)} 
                        alt="Property" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground line-clamp-1">{booking.propertyName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> {booking.expand?.propertyId?.location || 'Location'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-background p-3 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground font-bold mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Dates</p>
                    <p className="font-semibold">{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div className="bg-background p-3 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground font-bold mb-1 flex items-center"><Users className="w-3 h-3 mr-1"/> Guests</p>
                    <p className="font-semibold">{booking.guestCount} Guests</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={handleDownloadReceipt} variant="outline" className="w-full rounded-xl h-12 font-bold border-border hover:bg-muted">
                  <Download className="w-4 h-4 mr-2" /> Download Receipt
                </Button>
                <Button onClick={() => { onClose(); navigate(`/guest/bookings/${booking.id}`); }} className="w-full rounded-xl h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand">
                  View Booking Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Could not load booking details.</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;