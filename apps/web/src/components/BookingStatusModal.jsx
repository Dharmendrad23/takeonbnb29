import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const BookingStatusModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const history = Array.isArray(booking.statusHistory) ? booking.statusHistory : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-luxury">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Booking Status History</DialogTitle>
          <DialogDescription>
            Timeline for {booking.guestFullName}'s reservation ({booking.id.slice(0, 8)})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6 flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge className={getStatusColor(booking.status || booking.bookingStatus)}>{booking.status || booking.bookingStatus}</Badge>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No history recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {history.map((event, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-primary text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline" className={`capitalize ${getStatusColor(event.status)}`}>{event.status}</Badge>
                        <time className="text-xs text-muted-foreground font-medium">
                          {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </time>
                      </div>
                      
                      {event.reason && (
                        <div className="mt-2 text-sm text-foreground flex items-start gap-2 bg-muted/30 p-2 rounded-md">
                          <FileText className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                          <p className="leading-snug">{event.reason}</p>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>Changed by {event.adminName || 'System'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};