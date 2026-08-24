import React from "react";

const HostNotificationsPage = () => {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold">
        Notifications
      </h1>

      <p className="text-muted-foreground mt-2">
        Stay updated with your hosting activity.
      </p>

      <div className="mt-6 bg-card border border-border rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold">
          No new notifications
        </h2>

        <p className="text-muted-foreground mt-2">
          Important updates will appear here.
        </p>
      </div>
    </div>
  );
};

export default HostNotificationsPage;
