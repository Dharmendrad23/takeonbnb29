import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/bookingUtils.js';

const PriceBreakdown = ({ pricePerNight, nights, subtotal, serviceFee, taxes, total }) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service fee (6%)</span>
          <span className="font-medium">{formatCurrency(serviceFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxes (5%)</span>
          <span className="font-medium">{formatCurrency(taxes)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-2xl text-primary">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;