
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the booking process work?',
    answer: 'Once you find a property you love, select your dates and guests, then click "Book Now". For Instant Book properties, your reservation is confirmed immediately upon payment. For requested bookings, the host has 24 hours to accept.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation policies vary by property and are set by the host (Flexible, Moderate, or Strict). You can review the specific policy on the property listing page before booking.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, Amex), PayPal, Apple Pay, Google Pay, and specific local payment methods like UPI in India via secure gateways.'
  },
  {
    question: 'How do refunds work?',
    answer: 'If you cancel a booking within the eligible refund window, the amount is automatically processed back to your original payment method within 5-7 business days.'
  },
  {
    question: 'How are properties verified?',
    answer: 'Our trust and safety team manually reviews property photos, ownership documents, and location data. Look for the "Verified" badge for stays that have passed our rigorous 15-point inspection.'
  },
  {
    question: 'What are the requirements to become a host?',
    answer: 'To host, you must provide government ID, proof of property ownership or permission to sublet, and adhere to our strict hospitality standards. Click "Become a Host" at the top to start the process.'
  }
];

const FAQ = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about booking with us.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full bg-card border border-border rounded-2xl p-2 shadow-sm">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 border-border/50 px-4">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
