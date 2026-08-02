
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Headphones as HeadphonesIcon, Lock } from 'lucide-react';

const features = [
  {
    title: 'Verified Hosts',
    description: 'Every host and property undergoes a strict vetting process to ensure your safety and comfort.',
    icon: ShieldCheck
  },
  {
    title: 'Best Price Guarantee',
    description: 'We match any lower price found online so you always get the best deal for your stay.',
    icon: TrendingUp
  },
  {
    title: '24/7 Support',
    description: 'Our global concierge team is available around the clock to assist you before, during, and after your trip.',
    icon: HeadphonesIcon
  },
  {
    title: 'Secure Payments',
    description: 'Industry-leading encryption keeps your payment details and personal information completely safe.',
    icon: Lock
  }
];

const WhyChooseTakeOnBnB = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-primary-gradient text-white">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white"
          >
            Why Choose Take on BnB
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            We set the standard for luxury travel with uncompromising quality and service.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTakeOnBnB;
