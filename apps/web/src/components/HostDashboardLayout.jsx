import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  CalendarDays,
  Bell,
  Gift,
  Settings,
  CircleHelp,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  CheckCheck,
} from 'lucide-react';

import { cn } from '@/lib/utils.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const LOGO_URL =
  'https://horizons-cdn.hostinger.com/2ceef933-42f9-4bf3-b184-5d8c655ff5d5/0cbd9e7f2fa675b1aaff550ff98f8777.jpg';

const SIDEBAR_LINKS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/host/dashboard',
  },
  {
    icon: Home,
    label: 'My Properties',
    path: '/host/properties',
  },
  {
    icon: PlusCircle,
    label: 'Add Property',
    path: '/host/property/new',
    highlight: true,
  },
  {
    icon: CalendarDays,
    label: 'Calendar',
    path: '/host/calendar',
  },
];

const BOTTOM_LINKS = [
  {
    icon: Settings,
    label: 'Host Settings',
    path: '/host/settings',
  },
  {
    icon: CircleHelp,
    label: 'Help & Support',
    path: '/host/support',
  },
];

const HostDashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Welcome to Take On BnB',
      message: 'Your host dashboard is ready.',
      time: 'Just now',
    },
  ];

  const unreadCount = notifications.length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    if (path === '/host/dashboard') {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const userName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.username ||
    'Host';

  const userInitial = userName.charAt(0).toUpperCase();

const profileImage =
  currentUser?.profileImage ||
  currentUser?.avatar ||
  currentUser?.image ||
  localStorage.getItem("hostProfileImage") ||
  "";

  return (
    <div className="min-h-screen bg-muted/30">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={cn(
          `
          fixed
          top-0
          left-0
          h-screen
          w-[280px]
          bg-slate-950
          text-white
          z-50
          flex
          flex-col
          transition-transform
          duration-300
          shadow-2xl
          `,
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        )}
      >

        {/* SAME WEBSITE LOGO */}

        <div className="h-24 flex items-center px-7 border-b border-white/10">

          <Link
            to="/"
            className="flex items-center"
          >
            <img
              src={LOGO_URL}
              alt="Take On BnB"
              className="h-14 w-auto max-w-[210px] object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white"
          >
            <X className="w-6 h-6" />
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <nav className="space-y-2">

            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    `
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-2xl
                    font-semibold
                    transition-all
                    duration-200
                    `,
                    link.highlight
                      ? `
                        bg-primary
                        text-primary-foreground
                        shadow-lg
                        hover:opacity-90
                        `
                      : active
                        ? `
                          bg-white/10
                          text-white
                          border-r-4
                          border-primary
                          `
                        : `
                          text-slate-300
                          hover:bg-white/10
                          hover:text-white
                          `
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  <span>
                    {link.label}
                  </span>

                </Link>
              );
            })}

          </nav>

          {/* REFER & EARN */}

          <div className="mt-10">

            <div className="rounded-3xl border border-white/10 bg-slate-800/80 p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center">

                  <Gift className="w-6 h-6 text-primary" />

                </div>

                <div>

                  <h3 className="font-bold">
                    Refer & Earn
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Invite other hosts and earn up to â‚¹10,000.
                  </p>

                </div>

              </div>

              <Link
                to="/host/refer"
                onClick={() => setSidebarOpen(false)}
                className="
                  mt-5
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-primary-foreground
                  transition
                  hover:opacity-90
                "
              >
                Refer Now â†’
              </Link>

            </div>

          </div>

        </div>

        {/* BOTTOM MENU */}

        <div className="border-t border-white/10 p-4 space-y-2">

          {BOTTOM_LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  `
                  flex
                  items-center
                  gap-4
                  px-5
                  py-3
                  rounded-xl
                  font-medium
                  transition
                  `,
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >

                <Icon className="w-5 h-5" />

                {link.label}

              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-4
              px-5
              py-3
              rounded-xl
              text-red-400
              font-semibold
              hover:bg-red-500/10
              transition
            "
          >

            <LogOut className="w-5 h-5" />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN AREA */}

      <div className="lg:ml-[280px] min-h-screen">

        {/* TOP HEADER */}

        <header
          className="
            sticky
            top-0
            z-30
            h-20
            bg-background/95
            backdrop-blur
            border-b
            border-border
            flex
            items-center
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="
              lg:hidden
              mr-4
              w-10
              h-10
              rounded-xl
              border
              flex
              items-center
              justify-center
            "
          >

            <Menu className="w-5 h-5" />

          </button>

          {/* SEARCH */}

          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              max-w-md
              w-full
              border
              border-border
              rounded-2xl
              px-4
              py-3
              bg-muted/30
            "
          >

            <Search className="w-5 h-5 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search anything..."
              className="
                bg-transparent
                outline-none
                flex-1
                text-sm
              "
            />

            <span className="text-xs text-muted-foreground">
              Ctrl + K
            </span>

          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">

            {/* NOTIFICATIONS */}

            <div className="relative">

              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileOpen(false);
                }}
                className="
                  relative
                  w-11
                  h-11
                  rounded-xl
                  hover:bg-muted
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      min-w-5
                      h-5
                      px-1
                      rounded-full
                      bg-primary
                      text-primary-foreground
                      text-[10px]
                      font-bold
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {unreadCount}
                  </span>
                )}

              </button>

              {notificationOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-14
                    w-80
                    max-w-[90vw]
                    bg-background
                    border
                    border-border
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                  "
                >

                  <div className="p-4 border-b flex items-center justify-between">

                    <h3 className="font-bold">
                      Notifications
                    </h3>

                    <CheckCheck className="w-5 h-5 text-primary" />

                  </div>

                  <div className="max-h-80 overflow-y-auto">

                    {notifications.length === 0 ? (

                      <div className="p-8 text-center text-muted-foreground text-sm">
                        No new notifications
                      </div>

                    ) : (

                      notifications.map((notification) => (

                        <div
                          key={notification.id}
                          className="p-4 border-b hover:bg-muted/50 transition"
                        >

                          <div className="flex justify-between gap-4">

                            <div>

                              <p className="font-semibold text-sm">
                                {notification.title}
                              </p>

                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>

                            </div>

                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>

                          </div>

                        </div>

                      ))

                    )}

                  </div>

                  <Link
                    to="/host/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="
                      block
                      text-center
                      p-4
                      border-t
                      text-primary
                      text-sm
                      font-bold
                      hover:bg-muted
                    "
                  >
                    View all notifications
                  </Link>

                </div>

              )}

            </div>

            {/* HOST PROFILE */}

            <div className="relative">

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
                className="
                  flex
                  items-center
                  gap-3
                  border-l
                  border-border
                  pl-3
                  sm:pl-4
                  hover:opacity-80
                  transition
                "
              >

                <div
  className="
    w-11
    h-11
    rounded-full
    bg-primary/10
    text-primary
    flex
    items-center
    justify-center
    font-bold
    text-lg
    overflow-hidden
  "
>
  {profileImage ? (
    <img
      src={profileImage}
      alt={userName}
      className="w-full h-full object-cover"
    />
  ) : (
    userInitial
  )}
</div>

                <div className="hidden sm:block text-left">

                  <p className="font-bold text-sm">
                    {userName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Property Owner
                  </p>

                </div>

                <ChevronDown className="hidden sm:block w-4 h-4" />

              </button>

              {profileOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-14
                    w-56
                    bg-background
                    border
                    border-border
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                    p-2
                  "
                >

                  <Link
                    to="/host/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="
                      block
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      hover:bg-muted
                    "
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/host/settings"
                    onClick={() => setProfileOpen(false)}
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      hover:bg-muted
                    "
                  >
                    <Settings className="w-4 h-4" />
                    Host Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      text-red-500
                      hover:bg-red-500/10
                    "
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >

          <div className="max-w-[1600px] mx-auto">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
};

export default HostDashboardLayout; 


