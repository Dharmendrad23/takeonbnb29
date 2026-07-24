import React from 'react';
import { Helmet } from 'react-helmet';
import FAQ from '@/components/FAQ.jsx';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ | TakeOn BnB</title>
        <meta name="description" content="Frequently asked questions about booking, hosting, and travel with TakeOn BnB." />
      </Helmet>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-4">Help Center</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Find quick answers to the most common questions about booking, hosting, safety, and more.
          </p>
        </div>

        <FAQ />
      </main>
    </div>
  );
};

export default FAQPage;
