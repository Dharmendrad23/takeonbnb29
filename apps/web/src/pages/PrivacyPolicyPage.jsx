import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-4">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Take On BnB</title>
        <meta name="description" content="Read Take On BnB's privacy policy to learn how we collect, use, and protect your personal information." />
      </Helmet>

      <section className="bg-primary/10 py-20 px-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section title="1. Information We Collect">
          <p>We collect information you provide directly to us, such as your name, email address, phone number, and payment details when you create an account, book a property, or list a property as a host.</p>
        </Section>
        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to process bookings, communicate with you about your account or reservations, verify host and property listings, prevent fraud, and improve our services.</p>
        </Section>
        <Section title="3. Sharing of Information">
          <p>We share the minimum necessary information between guests and hosts to facilitate a booking (such as name and contact details). We do not sell your personal information to third parties.</p>
        </Section>
        <Section title="4. Payment Information">
          <p>Payments are processed through secure, PCI-compliant payment providers. We do not store your full card details on our servers.</p>
        </Section>
        <Section title="5. Data Security">
          <p>We take reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
        </Section>
        <Section title="6. Your Rights">
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team.</p>
        </Section>
        <Section title="7. Contact Us">
          <p>If you have any questions about this Privacy Policy, please reach out to us via our Contact page.</p>
        </Section>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
