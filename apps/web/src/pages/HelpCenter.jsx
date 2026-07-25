import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, CreditCard, Shield, BookOpen, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'booking',
      title: 'Booking Support',
      description: 'Manage your reservations, view itineraries, and handle cancellations.',
      icon: CalendarCheck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      description: 'Understand pricing, resolve payment issues, and track your refunds.',
      icon: CreditCard,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      description: 'Learn how we protect your information and handle emergencies.',
      icon: Shield,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'policies',
      title: 'Policies & Rules',
      description: 'Review our house rules, terms of service, and guest expectations.',
      icon: BookOpen,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Helmet>
        <title>Help Center | Take On BnB</title>
        <meta name="description" content="Find answers to your questions and get support anytime at Take On BnB." />
      </Helmet>
      
      <Header />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1578898886175-fa538133191d?q=80&w=2000&auto=format&fit=crop" 
              alt="Luxury room interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-3xl px-4 text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 text-balance">
              How can we help?
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 text-balance max-w-2xl mx-auto">
              Find answers to your questions and get support anytime.
            </p>
            
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-white/70 group-focus-within:text-white transition-colors" />
              </div>
              <Input 
                type="text" 
                placeholder="Search for articles, guides, or questions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-14 pr-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 text-lg shadow-lg focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:bg-white/20 transition-all duration-300"
              />
              <Button className="absolute right-2 top-2 bottom-2 rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-base">
                Search
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Content Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            
            {/* Main Categories */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">Browse Topics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {helpCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link 
                      to="#" 
                      className="block h-full p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${category.bgColor}`}>
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                      <div className="mt-6 flex items-center text-sm font-medium text-primary">
                        View articles <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Support */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 bg-secondary rounded-2xl p-8 border border-border">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  <MessageSquare className="w-7 h-7 text-primary-foreground" />
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                  Still Need Help?
                </h3>
                <p className="text-muted-foreground mb-8 text-balance">
                  Our luxury support team is available around the clock to assist you with any inquiries or special requests.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-card p-3 rounded-full border border-border shrink-0 mt-1">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Email Support</p>
                      <a href="mailto:takeonbnb@gmail.com" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        takeonbnb@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-card p-3 rounded-full border border-border shrink-0 mt-1">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Call Us</p>
                      <a href="tel:+9190586829911" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        +91 90586829911
                      </a>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-xl text-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg">
                  Contact Support
                </Button>
              </div>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};


export default HelpCenter;