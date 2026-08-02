import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, TrendingUp, Calendar, Activity } from 'lucide-react';

const HostEarningsCard = ({ earningsData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-border">
            <CardContent className="p-6 h-32 bg-muted/20" />
          </Card>
        ))}
      </div>
    );
  }

  const { totalEarnings = 0, monthlyEarnings = 0, activeBookings = 0 } = earningsData || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-primary text-primary-foreground border-none shadow-dashboard-card relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-primary-foreground/90">Total Earnings</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-4xl font-bold tracking-tight">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-sm text-primary-foreground/80 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Lifetime revenue
          </p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-dashboard-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-muted-foreground">This Month</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            ₹{monthlyEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Current month estimated</p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-dashboard-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-muted-foreground">Active Bookings</h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {activeBookings}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Upcoming & current stays</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostEarningsCard;