import React from 'react';
import { Helmet } from 'react-helmet';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';
import { IndianRupee } from 'lucide-react';

const HostEarningsPage = () => {
  return (
    <HostDashboardLayout>
      <Helmet><title>Earnings | Take On BnB</title></Helmet>
      <h1 className="text-3xl font-bold text-foreground mb-6">Earnings Dashboard</h1>
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border text-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
          <IndianRupee className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">Financial tracking</h3>
        <p className="text-muted-foreground max-w-md">Track payouts in INR, breakdown by property, and download your local tax statements.</p>
      </div>
    </HostDashboardLayout>
  );
};

export default HostEarningsPage;