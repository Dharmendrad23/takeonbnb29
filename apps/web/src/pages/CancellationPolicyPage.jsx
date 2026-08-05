import React from 'react';
import { Helmet } from 'react-helmet';
import { RefreshCcw } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-4">{children}</div>
  </div>
);

const CancellationPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Cancellation Policy | Take On BnB</title>
        <meta name="description" content="Learn about Take On BnB's cancellation and refund policy for guest bookings." />
      </Helmet>

      <section className="bg-primary/10 py-20 px-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <RefreshCcw className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Cancellation Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section title="1. Standard Cancellation Terms">
          <p>Unless a specific listing states otherwise, guests may cancel a confirmed booking free of charge up to 7 days before check-in. Cancellations made within 7 days of check-in may be subject to a partial or full charge.</p>
        </Section>
        <Section title="2. No-Shows">
          <p>Bookings where the guest does not check in and does not notify the host or our support team are treated as no-shows and are non-refundable.</p>
        </Section>
        <Section title="3. Host-Initiated Cancellations">
          <p>If a host cancels a confirmed booking, guests will receive a full refund. Repeated host cancellations may result in the property being removed from the platform.</p>
        </Section>
        <Section title="4. Refund Processing">
          <p>Approved refunds are processed back to the original payment method and may take 5-10 business days to reflect, depending on your bank or payment provider.</p>
        </Section>
        <Section title="5. Exceptional Circumstances">
          <p>In cases of extenuating circumstances (natural disasters, government travel restrictions, etc.), our support team will review cancellation requests on a case-by-case basis.</p>
        </Section>
        <Section title="6. Questions">
          <p>For help with a specific booking cancellation, please contact our support team through the Contact page with your booking reference.</p>
        </Section>
      </section>
    </div>
  );
};

export default CancellationPolicyPage;
