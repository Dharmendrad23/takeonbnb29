import React from 'react';
import { Helmet } from 'react-helmet';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';

const GuestMessagesPage = () => {
  return (
    <GuestDashboardLayout>
      <Helmet><title>Messages | Take On BnB</title></Helmet>
      <h1 className="text-2xl font-bold text-foreground mb-6">Messages</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Your messages</h3>
        <p className="text-muted-foreground">When you contact a host, your messages will appear here.</p>
      </div>
    </GuestDashboardLayout>
  );
};

export default GuestMessagesPage;