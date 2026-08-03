import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, Home, Calendar, IndianRupee, Activity, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRealtimeDashboardStats } from '@/hooks/useRealtimeDashboardStats.js';
import { formatCurrencyINR, formatDate } from '@/lib/bookingUtils.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import api from '@/lib/api.js';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, icon: Icon, colorClass, isLoading, trend }) => (
  <div className="bg-card border border-border p-6 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${colorClass}`}></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-background shadow-sm border border-border`}>
        <Icon className={`w-7 h-7 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-lg">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2 relative z-10">{title}</h3>
    {isLoading ? (
      <Skeleton className="h-10 w-2/3 mt-1 relative z-10" />
    ) : (
      <p className="text-4xl font-extrabold text-foreground relative z-10 tracking-tight">
        {value}
      </p>
    )}
  </div>
);

const AdminDashboard = () => {
  const { stats, isLoading } = useRealtimeDashboardStats();
  const [recentBookings, setRecentBookings] = useState([]);
  
  // Mock chart data for UI
  const mockChartData = [
    { name: 'Jan', revenue: 120000 }, { name: 'Feb', revenue: 150000 },
    { name: 'Mar', revenue: 180000 }, { name: 'Apr', revenue: 160000 },
    { name: 'May', revenue: 210000 }, { name: 'Jun', revenue: 250000 },
  ];

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const records = await pb.collection('bookings').getList(1, 5, {
          sort: '-created',
          $autoCancel: false
        });
        setRecentBookings(records.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in-up">
      <Helmet><title>Dashboard | TakeOn Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">Platform Overview</h1>
          <p className="text-muted-foreground font-medium">Real-time metrics and operational status.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/bookings" className="px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-brand hover:scale-105 transition-transform text-sm">
            View All Bookings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrencyINR(stats.totalRevenue)} 
          icon={IndianRupee} 
          colorClass="bg-primary" 
          isLoading={isLoading} 
          trend="+12%"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon={Calendar} 
          colorClass="bg-blue-500" 
          isLoading={isLoading} 
          trend="+8%"
        />
        <StatCard 
          title="Active Properties" 
          value={stats.totalProperties} 
          icon={Home} 
          colorClass="bg-emerald-500" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          colorClass="bg-purple-500" 
          isLoading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">Revenue Overview</h2>
            <Link to="/admin/analytics" className="text-primary font-semibold text-sm hover:underline flex items-center">
              Full Report <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} dx={-10} />
                <RechartsTooltip 
                  formatter={(value) => [formatCurrencyINR(value), 'Revenue']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontWeight: 600 }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings List */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Bookings</h2>
          </div>
          
          <div className="space-y-5 flex-1">
            {recentBookings.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <Calendar className="w-10 h-10 mx-auto mb-3" />
                <p className="font-semibold">No recent bookings</p>
              </div>
            ) : (
              recentBookings.map(booking => {
                const status = booking.bookingStatus || booking.status;
                const isPending = status === 'pending_verification';
                return (
                  <div key={booking.id} className="flex items-start justify-between group">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{booking.propertyName}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1 truncate">{booking.guestFullName}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{formatDate(booking.created)}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-3">
                      <span className="font-extrabold text-sm text-foreground">{formatCurrencyINR(booking.totalAmount || booking.totalPrice)}</span>
                      <Badge variant="outline" className={`mt-1 text-[10px] uppercase ${isPending ? 'badge-pending' : 'badge-confirmed'}`}>
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          <Link to="/admin/bookings" className="w-full text-center mt-6 pt-4 border-t border-border text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            View All History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;