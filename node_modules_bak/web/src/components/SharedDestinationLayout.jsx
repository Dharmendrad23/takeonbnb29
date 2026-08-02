import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sun, CheckCircle2, Compass, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PropertyCard from '@/components/PropertyCard.jsx';

const SharedDestinationLayout = ({
  title,
  destinationName,
  description,
  overview,
  image,
  sampleProperties,
  highlights = [],
  whyVisit = [],
  bestTime
}) => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{title} | Take On BNB</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <Header />

      <main className="flex-1 pb-24">
        {/* HERO SECTION */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={image} 
              alt={destinationName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-4xl px-4 text-center mt-20"
          >
            <div className="inline-flex items-center rounded-full bg-black/30 px-4 py-1.5 backdrop-blur-md border border-white/20 text-white mb-6">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold tracking-wide uppercase">Destination Guide</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 text-balance leading-tight">
              {destinationName}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 text-balance max-w-2xl mx-auto font-medium">
              {description}
            </p>
          </motion.div>
        </section>

        {/* OVERVIEW & BEST TIME */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl font-serif font-bold text-foreground">Overview</h2>
              <div className="prose prose-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                <p>{overview}</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-secondary/50 rounded-2xl p-8 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sun className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground">Best Time to Visit</h3>
                </div>
                <p className="text-muted-foreground">{bestTime}</p>
              </div>

              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Compass className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground">Highlights</h3>
                </div>
                <ul className="space-y-4">
                  {highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHY VISIT ZIG-ZAG */}
        {whyVisit.length > 0 && (
          <section className="py-20 bg-muted/30 border-y border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Why Visit {destinationName}?</h2>
              </div>
              
              <div className="space-y-16">
                {whyVisit.map((reason, index) => (
                  <motion.div 
                    key={index}
                    {...fadeIn}
                    className={`flex flex-col gap-10 ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
                  >
                    <div className="w-full md:w-1/2">
                      <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-luxury">
                        <img src={reason.image} alt={reason.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-6 px-4 md:px-8">
                      <div className="text-6xl font-bold text-primary/10 font-serif leading-none">0{index + 1}</div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{reason.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{reason.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED PROPERTIES */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
                Featured Properties in {destinationName}
              </h2>
              <p className="text-lg text-muted-foreground">Handpicked luxury stays curated for your perfect getaway.</p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <Link to={`/properties?search=${encodeURIComponent(destinationName)}`}>
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-luxury">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to experience {destinationName}?</h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                Discover our full collection of verified luxury properties and secure your dates today.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-10 h-14 text-lg shadow-md" asChild>
                <Link to={`/properties?search=${encodeURIComponent(destinationName)}`}>
                  Explore {destinationName} Properties
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default SharedDestinationLayout;