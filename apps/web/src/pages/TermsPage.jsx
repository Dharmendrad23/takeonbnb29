import React from "react";
import { Helmet } from "react-helmet";

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Take on BnB</title>
        <meta name="description" content="Take on BnB Terms of Service" />
      </Helmet>

      <main className="min-h-screen w-full bg-white">
        <iframe
          title="Take on BnB Terms of Service"
          src="/terms.html"
          className="block min-h-screen w-full border-0"
          style={{
            minHeight: "100vh",
            height: "100vh",
          }}
        />
      </main>
    </>
  );
};

export default TermsPage;
