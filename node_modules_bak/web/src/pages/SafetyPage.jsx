import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, UserCheck, Key, Eye } from 'lucide-react';

const SafetyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Safety & Trust | TakeOn BnB</title>
        <meta name="description" content="Learn about our commitment to host and guest safety at TakeOn BnB." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary/10 py-20 px-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">Trust & Safety First</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you are hosting a property or booking a stay, your safety and security are our top priorities. We employ strict verification standards for total peace of mind.
          </p>
        </div>
      </section>

      {/* Guest Safety Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-foreground mb-6">Safety for Guests</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Verified Hosts & Properties</h3>
                  <p className="text-muted-foreground leading-relaxed">Every property on our platform goes through a rigorous identity check and quality inspection before accepting reservations.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground leading-relaxed">Payments are processed securely via our trusted payment gateway. We hold your payment and only release it to the host upon successful check-in.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
            <img 
              src="https://images.unsplash.com/photo-1568384858396-1d6d95043f52?q=80&w=2070&auto=format&fit=crop" 
              alt="Guest relaxing safely" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Host Safety Section */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1567768085959-db40eb7e7539?q=80&w=2070&auto=format&fit=crop" 
                alt="Host managing property securely" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Safety for Hosts</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Guest Verification</h3>
                    <p className="text-muted-foreground leading-relaxed">We require guests to provide a verified phone number, email address, and payment method before they can book your property.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Host Protection Program</h3>
                    <p className="text-muted-foreground leading-relaxed">Our comprehensive damage protection covers your property in the rare event of accidental guest damage during a stay.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyPage;