import React from "react";

const HostPayoutsPage = () => {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold">
        Payouts
      </h1>

      <p className="text-muted-foreground mt-2">
        Track your upcoming and completed payouts.
      </p>

      <div className="mt-6 bg-card border border-border rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold">
          No payouts yet
        </h2>

        <p className="text-muted-foreground mt-2">
          Your payout history will appear here.
        </p>
      </div>
    </div>
  );
};

export default HostPayoutsPage;
