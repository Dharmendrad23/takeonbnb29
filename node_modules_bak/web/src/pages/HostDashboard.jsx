
import React from 'react';
import { Helmet } from 'react-helmet';
import { useHostDashboardData } from '@/hooks/useHostDashboardData.js';
import { DashboardCard, RevenueChart, BookingsTable } from '@/components/host/HostDashboardComponents.jsx';
import { Wallet, CalendarCheck, TrendingUp, Star, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HostDashboard = () => {
  const { properties, bookings, reviews, metrics, loading, error } = useHostDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <h3 className="font-bold text-xl">Error loading dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <Helmet><title>Host Dashboard | Take on BnB</title></Helmet>

      {/* Dashboard Header */}
      <header className="bg-background border-b border-border py-8 mb-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Welcome back, Host!</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">Here's what's happening with your properties today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-brand font-semibold">
              <Link to="/host/property/new"><Plus className="w-4 h-4 mr-2" /> Add Listing</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard 
            title="Total Earnings" 
            value={`₹${metrics.earnings.toLocaleString('en-IN')}`} 
            trend="up" 
            trendValue="12.5" 
            icon={Wallet} 
          />
          <DashboardCard 
            title="Total Bookings" 
            value={metrics.totalBookings} 
            trend="up" 
            trendValue="8.2" 
            icon={CalendarCheck} 
          />
          <DashboardCard 
            title="Occupancy Rate" 
            value={`${metrics.occupancyRate}%`} 
            trend="up" 
            trendValue="4.1" 
            icon={TrendingUp} 
          />
          <DashboardCard 
            title="Average Rating" 
            value={metrics.averageRating} 
            trend="up" 
            trendValue="0.2" 
            icon={Star} 
          />
        </div>

        {/* Charts & Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RevenueChart />
        </div>

        <div>
          <BookingsTable bookings={bookings} />
        </div>

      </main>
    </div>
  );
};

export default HostDashboard;
