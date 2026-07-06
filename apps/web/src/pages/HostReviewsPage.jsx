import React from 'react';
import { Helmet } from 'react-helmet';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';

const HostReviewsPage = () => {
  return (
    <HostDashboardLayout>
      <Helmet><title>Reviews | Take On BnB</title></Helmet>
      <h1 className="text-2xl font-bold text-foreground mb-6">Guest Reviews</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Feedback overview</h3>
        <p className="text-muted-foreground">See what guests are saying about your properties.</p>
      </div>
    </HostDashboardLayout>
  );
};

export default HostReviewsPage;