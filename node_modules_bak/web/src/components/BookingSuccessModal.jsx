import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const BookingSuccessModal = ({ isOpen, onClose, booking, property, onBookAnother }) => {
  const navigate = useNavigate();

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border border-border shadow-luxury overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Booking Successful</DialogTitle>
          <DialogDescription>Your luxury reservation is confirmed.</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center pt-8 pb-4 px-4 relative">
          
          <div className="absolute top-[-50px] w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative z-10"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <h2 className="text-3xl font-serif font-bold text-foreground mb-2 relative z-10">Reservation Confirmed</h2>
          <p className="text-muted-foreground text-sm max-w-[280px] mb-8 relative z-10">
            We've sent a detailed confirmation email to <span className="font-medium text-foreground">{booking.guestEmail}</span>.
          </p>

          <div className="w-full bg-muted/30 rounded-xl border border-border p-5 mb-8 text-left space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-sm text-muted-foreground uppercase tracking-wide">Ref ID</span>
              <span className="font-mono font-medium text-primary bg-primary/10 px-2 py-1 rounded">{booking.id.slice(0, 8).toUpperCase()}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{property?.title || booking.propertyName}</p>
                  <p className="text-xs text-muted-foreground">{property?.location || 'Premium Location'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.guestCount} Guest{booking.guestCount > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-border/50">
                <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-foreground">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 relative z-10">
            <Button 
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold shadow-lg transition-all"
              onClick={() => {
                onClose();
                navigate('/guest/dashboard');
              }}
            >
              View My Bookings <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 border-border text-foreground hover:bg-muted font-medium transition-all"
              onClick={() => {
                onClose();
                if (onBookAnother) onBookAnother();
              }}
            >
              Book Another Property
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};