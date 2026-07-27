
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-[#F5F5F5] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                Take on <span className="text-primary">BnB</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Curated luxury vacation rentals and unique experiences. We make booking your perfect getaway simple, secure, and unforgettable.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/properties" className="text-sm text-gray-400 hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/host/register" className="text-sm text-gray-400 hover:text-white transition-colors">Become a Host</Link></li>
              <li><Link to="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/help-center" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/safety" className="text-sm text-gray-400 hover:text-white transition-colors">Safety</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6 text-white">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe for the latest deals and travel inspiration.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold group">
                Subscribe <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Take on BnB. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cancellation" className="text-sm text-gray-500 hover:text-white transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
