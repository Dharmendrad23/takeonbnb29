import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';
import { Home, CalendarCheck, DollarSign, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/bookingUtils.js';
import pb from '@/lib/pocketbaseClient';

const HostDashboardHome = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ props: 0, bookings: 0, earnings: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsRes, bookingsRes] = await Promise.all([
          pb.collection('properties').getList(1, 100, { filter: `hostId="${currentUser.id}"`, $autoCancel: false }),
          pb.collection('bookings').getList(1, 1000, { filter: `propertyId.hostId="${currentUser.id}"`, $autoCancel: false })
        ]);
        
        const totalEarnings = bookingsRes.items.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        const activeBookings = bookingsRes.items.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length;
        
        setStats({
          props: propsRes.totalItems,
          bookings: activeBookings,
          earnings: totalEarnings,
          rating: 4.8 // Mock average for display
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentUser]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-16 mt-1" /> : value}</p>
      </div>
    </div>
  );

  return (
    <HostDashboardLayout>
      <Helmet><title>Host Dashboard | Take On BnB</title></Helmet>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hosting Overview</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your properties today.</p>
        </div>
        <a href="/host/add-property" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-center shadow-sm hover:shadow-md">
          Add New Property
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Home} label="Total Properties" value={stats.props} color="bg-blue-500" />
        <StatCard icon={CalendarCheck} label="Active Bookings" value={stats.bookings} color="bg-emerald-500" />
        <StatCard icon={DollarSign} label="Total Earnings (INR)" value={formatCurrency(stats.earnings)} color="bg-primary" />
        <StatCard icon={Star} label="Average Rating" value={stats.rating} color="bg-amber-500" />
      </div>

      <div className="bg-muted/30 border border-border rounded-2xl p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Ready to expand?</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">Add more properties to increase your visibility and potential earnings on the platform.</p>
      </div>
    </HostDashboardLayout>
  );
};

export default HostDashboardHome;