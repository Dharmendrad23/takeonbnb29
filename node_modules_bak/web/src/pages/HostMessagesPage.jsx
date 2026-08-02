import React from 'react';
import { Helmet } from 'react-helmet';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';

const HostMessagesPage = () => {
  return (
    <HostDashboardLayout>
      <Helmet><title>Messages | Take On BnB</title></Helmet>
      <h1 className="text-2xl font-bold text-foreground mb-6">Guest Messages</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Inbox zero!</h3>
        <p className="text-muted-foreground">Respond quickly to guests to maintain a high host rating.</p>
      </div>
    </HostDashboardLayout>
  );
};

export default HostMessagesPage;