import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-4">{children}</div>
  </div>
);

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service | Take On BnB</title>
        <meta name="description" content="Read the terms and conditions for using Take On BnB's platform as a guest or a host." />
      </Helmet>

      <section className="bg-primary/10 py-20 px-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section title="1. Acceptance of Terms">
          <p>By creating an account or using Take On BnB, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
        </Section>
        <Section title="2. Bookings">
          <p>All bookings are subject to host availability and confirmation. Prices displayed are per night unless otherwise stated and may include applicable service fees.</p>
        </Section>
        <Section title="3. Host Responsibilities">
          <p>Hosts are responsible for ensuring the accuracy of their property listings, maintaining the property in a safe and habitable condition, and honoring confirmed bookings.</p>
        </Section>
        <Section title="4. Guest Responsibilities">
          <p>Guests agree to treat properties with care, follow house rules set by the host, and report any issues promptly to the host or our support team.</p>
        </Section>
        <Section title="5. Payments & Fees">
          <p>Payments are processed securely through our payment partners. Service fees, where applicable, are disclosed prior to booking confirmation.</p>
        </Section>
        <Section title="6. Cancellations">
          <p>Cancellation terms vary by listing and are outlined on the property page prior to booking. Please review our Cancellation Policy for more details.</p>
        </Section>
        <Section title="7. Limitation of Liability">
          <p>Take On BnB acts as a platform connecting guests and hosts and is not liable for disputes, damages, or losses arising from a booking, to the extent permitted by law.</p>
        </Section>
        <Section title="8. Changes to Terms">
          <p>We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised Terms.</p>
        </Section>
      </section>
    </div>
  );
};

export default TermsPage;
