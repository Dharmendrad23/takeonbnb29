import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import AmenityIcon from '@/components/AmenityIcon.jsx';

export const AmenitiesModal = ({ isOpen, onClose, amenities = [] }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-2xl bg-card border-border">
        <DialogHeader className="p-6 border-b border-border sticky top-0 bg-card z-10">
          <DialogTitle className="text-2xl font-semibold">What this place offers</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            {amenities.length > 0 ? (
              amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-0.5 text-primary">
                    <AmenityIcon name={amenity.name || amenity} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-base">{amenity.name || amenity}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {amenity.description || 'Included with your stay.'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback default amenities if none provided
              ['High-speed WiFi', 'Private Pool', 'Air Conditioning', 'Free Parking', 'Kitchen', 'Smart TV'].map((am, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-0.5 text-primary">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-base">{am}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Standard amenity included for all guests.</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};