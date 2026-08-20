import React from "react";
import { Helmet } from "react-helmet";

const AdminHostManagement = () => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in-up">
      <Helmet>
        <title>Host Management | Take On BnB Admin</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Host Management
        </h1>

        <p className="text-muted-foreground mt-2">
          Manage and monitor your Take On BnB platform.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <p className="text-muted-foreground">
          Host Management page is ready.
        </p>
      </div>
    </div>
  );
};

export default AdminHostManagement;
