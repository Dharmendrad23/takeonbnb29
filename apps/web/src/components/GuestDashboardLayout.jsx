import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Heart, MessageSquare, Star, Settings, CreditCard, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { Button } from '@/components/ui/button';

const SIDEBAR_LINKS = [
  { icon: Home, label: 'Dashboard', path: '/guest/dashboard' },
  { icon: Calendar, label: 'My Bookings', path: '/guest/bookings' },
  { icon: CreditCard, label: 'Payment History', path: '/guest/payments' },
  { icon: Heart, label: 'Favorites', path: '/guest/favorites' },
  { icon: MessageSquare, label: 'Messages', path: '/guest/messages' },
  { icon: Star, label: 'Reviews', path: '/guest/reviews' },
  { icon: Settings, label: 'Account Settings', path: '/guest/settings' },
];

const GuestDashboardLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-12 flex flex-col md:flex-row max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 gap-8">
      
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center justify-between bg-card p-4 rounded-2xl border border-border mt-4">
        <h2 className="font-bold text-foreground">Guest Menu</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-64 shrink-0 space-y-1 transition-all",
        isMobileMenuOpen ? "block" : "hidden md:block"
      )}>
        <nav className="flex flex-col gap-1.5 sticky top-28 bg-card md:bg-transparent p-4 md:p-0 rounded-2xl border border-border md:border-none shadow-sm md:shadow-none z-10">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:mt-4">
        <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8 min-h-[70vh]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default GuestDashboardLayout;