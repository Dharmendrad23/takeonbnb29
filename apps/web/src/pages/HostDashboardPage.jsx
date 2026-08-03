import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, IndianRupee, Users, Calendar, PlusCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HostDashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ properties: 0, bookings: 0, revenue: 0 });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        setLoading(true);
        // Fetch host properties
       const { data: props } = await axios.get(
  `http://localhost:3001/properties?hostId=${currentUser.id}`
);

setProperties(props);

        // Fetch bookings for these properties (simplified aggregate)
        const bookings = await pb.collection('bookings').getList(1, 1, {
          filter: `propertyId.hostId="${currentUser?.id}" && status="completed"`,
          $autoCancel: false
        });

        // Calculate Revenue (mocking exact aggregate for this demo)
        const totalRev = props.items.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
        const totalBookings = props.items.reduce((acc, curr) => acc + (curr.totalBookings || 0), 0);

        setStats({
          properties: props.length,
          bookings: totalBookings || bookings.totalItems || 0,
          revenue: totalRev
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchHostData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center bg-muted/20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pt-28 pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <Helmet><title>Host Dashboard | TakeOn BnB</title></Helmet>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Welcome back, {currentUser?.name || 'Host'}</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your hosting performance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl shadow-brand font-bold gap-2">
              <Link to="/host/property/new">
                <PlusCircle className="w-5 h-5" />
                Add New Property
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl font-bold gap-2">
              <Link to="/host/properties">
                <Home className="w-5 h-5" />
                View Properties
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-foreground">₹{stats.revenue.toLocaleString('en-IN')}</h3>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Total Bookings</p>
                  <h3 className="text-3xl font-bold text-foreground">{stats.bookings}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Live Properties</p>
                  <h3 className="text-3xl font-bold text-foreground">{stats.properties}</h3>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Properties</h2>
          </div>
          
          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No properties listed</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't added any properties yet. Start your hosting journey by creating your first listing.
              </p>
              <Button asChild>
                <Link to="/host/property/new">Add Your First Property</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Property</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Price/Night</th>
                    <th className="px-6 py-4 font-semibold">Bookings</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{prop.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          prop.status === 'Live' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          prop.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">₹{prop.pricePerNight?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">{prop.totalBookings || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="font-semibold text-primary">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboardPage;
