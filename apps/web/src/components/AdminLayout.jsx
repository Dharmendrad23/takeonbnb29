import React, { useState } from 'react';
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Home,
  LogOut,
  BarChart3,
  Menu,
  X,
  CheckSquare,
  Settings,
  Bell,
  Mail,
  CircleDollarSign,
  Star,
  Wallet,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ScrollText,
  UserCog,
  ChevronDown,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { NotificationCenter } from '@/components/NotificationCenter.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { adminUser, logoutAdmin } = useAdminAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navSections = [
    {
      title: '',
      items: [
        {
          name: 'Dashboard',
          path: '/admin',
          exact: true,
          icon: LayoutDashboard,
        },
      ],
    },

    {
      title: 'MANAGEMENT',
      items: [
        {
          name: 'Properties',
          path: '/admin/properties',
          icon: Home,
        },
        {
          name: 'Bookings',
          path: '/admin/bookings',
          icon: CalendarDays,
        },
        {
          name: 'Users / Hosts',
          path: '/admin/users',
          icon: Users,
        },
        {
          name: 'Guests',
          path: '/admin/guests',
          icon: Users,
        },
        {
          name: 'Reviews',
          path: '/admin/reviews',
          icon: Star,
        },
        {
          name: 'Payouts',
          path: '/admin/payouts',
          icon: Wallet,
        },
        {
          name: 'Approvals',
          path: '/admin/properties/pending',
          icon: CheckSquare,
        },
      ],
    },

    {
      title: 'OPERATIONS',
      items: [
        {
          name: 'Disputes',
          path: '/admin/disputes',
          icon: AlertTriangle,
        },
        {
          name: 'Message Center',
          path: '/admin/messages',
          icon: MessageSquare,
        },
        {
          name: 'Notifications',
          path: '/admin/notifications',
          icon: Bell,
        },
      ],
    },

    {
      title: 'ANALYTICS',
      items: [
        {
          name: 'Reports',
          path: '/admin/analytics',
          icon: BarChart3,
        },
      ],
    },

    {
      title: 'SETTINGS',
      items: [
        {
          name: 'Roles & Permissions',
          path: '/admin/roles',
          icon: UserCog,
        },
        {
          name: 'Audit Logs',
          path: '/admin/audit-logs',
          icon: ScrollText,
        },
        {
          name: 'System Settings',
          path: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logoutAdmin();
      navigate('/admin/login');
    }
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard';

    const currentItem = navSections
      .flatMap((section) => section.items)
      .find((item) =>
        item.exact
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path)
      );

    return currentItem?.name || 'Admin Panel';
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-[74px] items-center border-b border-white/10 px-5">
        <Link
          to="/admin"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-orange-500">
            <Home className="h-5 w-5" />
          </div>

          <div>
            <div className="text-[15px] font-extrabold leading-tight text-white">
              Take On BNB
            </div>

            <div className="text-[9px] font-medium text-slate-400">
              Admin Panel
            </div>
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-white/10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section, sectionIndex) => (
          <div
            key={`${section.title}-${sectionIndex}`}
            className={cn(
              sectionIndex !== 0 && 'mt-5'
            )}
          >
            {section.title && (
              <div className="mb-2 px-3 text-[9px] font-bold tracking-[0.16em] text-slate-500">
                {section.title}
              </div>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex h-10 items-center gap-3 rounded-lg px-3 text-[12px] font-semibold transition-all duration-200',

                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-950/20'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[15px] w-[15px] shrink-0',
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-white'
                      )}
                    />

                    <span className="truncate">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <NotificationProvider>
      <div className="flex h-screen overflow-hidden bg-[#f7f8fa] text-foreground">

        {/* Desktop Sidebar */}
        <aside className="hidden h-screen w-[220px] shrink-0 flex-col bg-[#071522] lg:flex">
          <SidebarContent />
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#071522] shadow-2xl transition-transform duration-300 lg:hidden',

            isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          )}
        >
          <SidebarContent />
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Header */}
          <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">

            <div className="flex min-w-0 items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
                  {getPageTitle()}
                </h1>

                <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                  Admin Panel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">

              <button
                onClick={() => navigate('/admin/notifications')}
                title="Notifications"
                className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 sm:flex"
              >
                <Bell className="h-4 w-4" />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
              </button>

              <button
                onClick={() => navigate('/admin/messages')}
                title="Message Center"
                className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 sm:flex"
              >
                <Mail className="h-4 w-4" />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
              </button>

              <div className="h-8 w-px bg-slate-200" />

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white shadow-sm">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-[100px] truncate text-[12px] font-bold text-slate-800">
                    {adminUser?.name || 'Admin'}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Super Admin
                  </p>
                </div>

                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </div>

            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[#f7f8fa] p-4 sm:p-6 lg:p-7">
            <Outlet />
          </div>

        </main>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;