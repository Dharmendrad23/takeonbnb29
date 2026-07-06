import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Mail, MessageSquare, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "How do I cancel a booking?",
    answer: "You can cancel your booking by going to 'My Bookings' in your dashboard. Select the booking you wish to cancel and click 'Cancel Booking'. Please refer to the specific property's cancellation policy for refund details."
  },
  {
    question: "When will I be charged for my reservation?",
    answer: "You will be charged the full amount at the time of booking confirmation. We securely hold these funds and release them to the host only after your successful check-in."
  },
  {
    question: "How do I contact my host?",
    answer: "Once your booking is confirmed, you can use the 'Messages' tab in your dashboard to communicate directly with your host regarding check-in times and special requests."
  },
  {
    question: "What is the TakeOn BnB verified guarantee?",
    answer: "Our verified guarantee means every property is physically or virtually inspected by our team to ensure it meets our quality and safety standards. If a property severely misrepresents itself, we will help rebook you or issue a full refund."
  },
  {
    question: "How do I become a host?",
    answer: "Click on 'Admin Area' or 'Host Portal' in the footer to register as a host. Once registered, you can submit your property details. Our team will review your application within 48 hours."
  }
];

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Help Center | TakeOn BnB</title>
        <meta name="description" content="Find answers to common questions and contact our support team." />
      </Helmet>

      {/* Header Search */}
      <section className="bg-primary/5 py-20 px-4 border-b border-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">How can we help?</h1>
          <div className="relative max-w-xl mx-auto shadow-lg rounded-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-12 bg-card border-border text-foreground rounded-2xl text-lg focus-visible:ring-primary shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
        
        <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg">Our dedicated support team is available 24/7 to assist you with any inquiries or issues during your stay.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-primary/50 transition-colors">
              <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-slate-400 mb-4">+91 90586 82991</p>
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white">Call Now</Button>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-primary/50 transition-colors">
              <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-slate-400 mb-4">takeonbnb@gmail.com</p>
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white">Send Email</Button>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-primary/50 transition-colors">
              <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-slate-400 mb-4">Available 24/7</p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">Start Chat</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;