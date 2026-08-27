import React from "react";
import { Helmet } from "react-helmet";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Take on BnB</title>
        <meta name="description" content="Privacy Policy for Take on BnB" />
      </Helmet>

      <main className="min-h-screen bg-white">
        <section className="bg-[#111111] px-6 py-20 text-white">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 font-bold uppercase tracking-[0.2em] text-[#E8750A]">
              Take on BnB
            </p>

            <h1 className="text-4xl font-extrabold md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">
              Your privacy matters to us. This Privacy Policy explains how Take
              on BnB collects, uses, stores, and protects your information when
              you use our website and services.
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl space-y-10">
            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                1. Information We Collect
              </h2>
              <p className="leading-8 text-gray-600">
                We may collect information that you provide when you create an
                account, make a booking, contact us, register a property, or
                otherwise use Take on BnB services. This may include your name,
                email address, phone number, booking details, property
                information, and payment-related information.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                2. How We Use Your Information
              </h2>
              <p className="leading-8 text-gray-600">
                We use information to provide and improve our services, process
                bookings and payments, communicate with guests and hosts,
                provide customer support, maintain security, and comply with
                applicable legal requirements.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                3. Booking and Payment Information
              </h2>
              <p className="leading-8 text-gray-600">
                Payment transactions may be processed through third-party
                payment providers. Take on BnB does not need to store complete
                card information when payment processing is handled by an
                authorized payment provider.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                4. Cookies and Similar Technologies
              </h2>
              <p className="leading-8 text-gray-600">
                We may use cookies and similar technologies to keep the website
                functioning, understand usage, improve performance, and provide
                a better experience.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                5. Sharing of Information
              </h2>
              <p className="leading-8 text-gray-600">
                We may share relevant information with hosts, guests, service
                providers, payment processors, technology providers, or
                authorities where necessary to provide our services, protect
                users, or comply with the law.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">6. Data Security</h2>
              <p className="leading-8 text-gray-600">
                We use reasonable technical and organizational measures to
                protect information against unauthorized access, loss, misuse,
                or disclosure. However, no internet-based service can guarantee
                absolute security.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">7. Your Choices</h2>
              <p className="leading-8 text-gray-600">
                Depending on applicable law, you may have rights relating to
                your personal information, including requesting access,
                correction, or deletion of certain information.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                8. Third-Party Services
              </h2>
              <p className="leading-8 text-gray-600">
                Our website may contain links or integrations with third-party
                services. Their privacy practices are governed by their own
                policies, and we encourage you to review those policies.
              </p>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-extrabold">
                9. Changes to This Policy
              </h2>
              <p className="leading-8 text-gray-600">
                We may update this Privacy Policy from time to time. Any updated
                version will be made available on this page.
              </p>
            </article>

            <article className="rounded-3xl bg-orange-50 p-6">
              <h2 className="mb-3 text-2xl font-extrabold">10. Contact Us</h2>
              <p className="leading-8 text-gray-700">
                If you have questions about this Privacy Policy or how your
                information is handled, please contact Take on BnB through the
                Contact Us section of our website.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
