import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, Shield, Star, Users } from 'lucide-react';

const values = [
  { icon: Star, title: "Premium Quality", text: "Every property is handpicked and inspected to meet our strict quality standards before it goes live." },
  { icon: Shield, title: "Absolute Security", text: "Verified hosts, secure payments, and a 24/7 support team ensure your peace of mind." },
  { icon: Globe, title: "Local Experiences", text: "We connect you with authentic local stays that let you experience destinations like never before." },
  { icon: Users, title: "Community First", text: "Building lasting relationships between hosts and guests is at the heart of everything we do." }
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | TakeOn BnB</title>
        <meta name="description" content="Learn more about TakeOn BnB, our mission, values, and the team behind your perfect stays." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1570126618953-d437176e8c79?q=80&w=2070&auto=format&fit=crop" 
            alt="Beautiful modern home exterior" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Redefining the way <br /> you experience travel.
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              At TakeOn BnB, we believe that where you stay is just as important as where you go. Our mission is to provide spaces that feel like home, anywhere in the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision (Zig-Zag Layout) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We started with a simple idea: to make premium, authentic stays accessible to everyone without the stress of unpredictability. 
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we empower thousands of travelers to discover unique accommodations that combine the comfort of a private home with the standards of a high-end hotel.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
          >
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop" 
              alt="Luxurious interior living room" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
          >
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
              alt="Modern architectural home" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Vision</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We envision a world where travel is seamless and every journey brings a sense of belonging.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By continuously innovating our platform and supporting our dedicated hosts, we're building a trusted global network of remarkable properties.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Bento Grid */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Drives Us</h2>
            <p className="text-lg text-muted-foreground">The core principles that guide our decisions and shape the TakeOn BnB experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-8 lg:p-10 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{value.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;