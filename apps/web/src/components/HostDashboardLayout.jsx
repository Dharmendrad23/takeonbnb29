import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, CalendarCheck, Home } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/host/dashboard' },
  { icon: PlusCircle, label: 'Add Property', path: '/host/property/new' },
];

const HostDashboardLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 flex flex-col md:flex-row max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-1">
        <h2 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-4 px-3">Host Portal</h2>
        <nav className="flex flex-col gap-1">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 px-3">
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <Home className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm text-foreground">Need Help?</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Contact our host support team.</p>
            <a href="mailto:hosts@takeonbnb.com" className="text-xs font-bold text-primary hover:underline">Contact Support</a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default HostDashboardLayout;