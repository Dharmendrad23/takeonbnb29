import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, BedDouble, ArrowRight, Compass, Calendar, Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// Mock data as requested
const delhiProperties = [
  { id: 'del-1', name: 'Luxury Villa in South Delhi', price: 12000, rating: 4.8, bedrooms: 4, guests: 8, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { id: 'del-2', name: 'Modern Farmhouse in Gurugram', price: 10500, rating: 4.7, bedrooms: 3, guests: 6, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
  { id: 'del-3', name: 'Premium Apartment in Connaught Place', price: 8500, rating: 4.6, bedrooms: 2, guests: 4, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80' },
  { id: 'del-4', name: 'Boutique Villa in Vasant Kunj', price: 11000, rating: 4.9, bedrooms: 3, guests: 6, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { id: 'del-5', name: 'Luxury Penthouse in Aerocity', price: 13500, rating: 4.8, bedrooms: 4, guests: 8, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
  { id: 'del-6', name: 'Garden Villa in Chhatarpur', price: 9500, rating: 4.7, bedrooms: 3, guests: 7, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
];

const DestinationPropertyCard = ({ property }) => (
  <Link to={`/property/${property.id}`} className="group block">
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 h-full border border-border">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.image} 
          alt={property.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#C8A96B] text-[#C8A96B]" />
          {property.rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-[#C8A96B] transition-colors line-clamp-1">{property.name}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> {property.bedrooms} Beds</div>
          <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {property.guests} Guests</div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-lg text-foreground">₹{property.price.toLocaleString('en-IN')}</span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F5F2EC] flex items-center justify-center group-hover:bg-[#C8A96B] group-hover:text-[#0F0F0F] transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const DelhiDestinationPage = () => {
  return (
    <div className="bg-[#F5F2EC] min-h-screen font-sans text-[#0F0F0F]">
      <Helmet>
        <title>Luxury Villas in Delhi | Take on BNB</title>
        <meta name="description" content="Premium stays in Delhi with modern amenities. Book exclusive luxury villas and apartments in Delhi NCR." />
      </Helmet>
      
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1670589953903-b4e2f17a70a9?w=1920&q=80" 
          alt="Luxury Villas in Delhi" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-[#F5F2EC] max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 uppercase tracking-widest border border-white/30">
              <MapPin className="w-4 h-4 text-[#C8A96B]" /> Delhi NCR
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-balance">
              Luxury Villas in <span className="text-[#C8A96B]">Delhi</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md font-light leading-relaxed">
              Premium stays in the capital with modern amenities, blending urban sophistication with ultimate comfort.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-3">Featured Stays</h2>
              <p className="text-muted-foreground text-lg">Curated collection of the finest properties in Delhi NCR</p>
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Showing {delhiProperties.length} properties</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {delhiProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DestinationPropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-[#0F0F0F] text-[#F5F2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-[#C8A96B]">Discover Delhi</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">Experience the perfect blend of rich heritage and cosmopolitan luxury.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#C8A96B]/50 transition-colors">
              <div className="w-14 h-14 bg-[#C8A96B]/10 rounded-xl flex items-center justify-center text-[#C8A96B] mb-6">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Nearby Attractions</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Qutub Minar Complex</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Hauz Khas Village</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> India Gate & Rajpath</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Cyber Hub Aerocity</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#C8A96B]/50 transition-colors">
              <div className="w-14 h-14 bg-[#C8A96B]/10 rounded-xl flex items-center justify-center text-[#C8A96B] mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Best Time to Visit</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                October to March offers the most pleasant weather for exploring the city's outdoor attractions, heritage sites, and vibrant café culture.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[#C8A96B]">
                Peak Season: Nov - Feb
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#C8A96B]/50 transition-colors">
              <div className="w-14 h-14 bg-[#C8A96B]/10 rounded-xl flex items-center justify-center text-[#C8A96B] mb-6">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Local Experiences</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Fine Dining at Connaught Place</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Heritage Walks in Old Delhi</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Luxury Shopping in Emporio</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" /> Art Galleries in Lado Sarai</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DelhiDestinationPage;