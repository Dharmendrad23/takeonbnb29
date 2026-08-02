import React from 'react';
import { Helmet } from 'react-helmet';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';

const HostBookingsPage = () => {
  return (
    <HostDashboardLayout>
      <Helmet><title>Bookings | Take On BnB</title></Helmet>
      <h1 className="text-2xl font-bold text-foreground mb-6">Property Bookings</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Manage reservations</h3>
        <p className="text-muted-foreground">Approve, decline, or manage guest bookings from here.</p>
      </div>
    </HostDashboardLayout>
  );
};

export default HostBookingsPage;