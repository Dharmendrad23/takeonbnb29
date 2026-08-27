import React, { useEffect } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext.jsx";
import { NotificationProvider } from "@/contexts/NotificationContext.jsx";

import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AdminProtectedRoute from "@/components/AdminProtectedRoute.jsx";

import AdminLayout from "@/components/AdminLayout.jsx";
import HostDashboardLayout from "@/components/HostDashboardLayout.jsx";

import PaymentSuccessModal from "@/components/PaymentSuccessModal.jsx";

/* =========================
   PUBLIC PAGES
========================= */

import HomePage from "@/pages/HomePage.jsx";
import PropertyList from "@/pages/PropertyList.jsx";
import PropertyDetailPage from "@/pages/PropertyDetailPage.jsx";

import LoginPage from "@/pages/LoginPage.jsx";
import SignupPage from "@/pages/SignupPage.jsx";

import HostRegisterPage from "@/pages/HostRegisterPage.jsx";
import HostAuthPage from "@/pages/HostAuthPage.jsx";

import DestinationPage from "@/pages/DestinationPage.jsx";
import SearchPage from "@/pages/SearchPage.jsx";

import AboutUsPage from "@/pages/AboutUsPage.jsx";
import ContactPage from "@/pages/ContactPage.jsx";
import ExplorePage from "@/pages/ExplorePage.jsx";
import BlogPage from "@/pages/BlogPage.jsx";
import HelpCenterPage from "@/pages/HelpCenterPage.jsx";
import SafetyPage from "@/pages/SafetyPage.jsx";
import FAQPage from "@/pages/FAQPage.jsx";
import NotFoundPage from "@/pages/NotFoundPage.jsx";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.jsx";
import TermsPage from "@/pages/TermsPage.jsx";
import CancellationPolicyPage from "@/pages/CancellationPolicyPage.jsx";

import CheckoutPage from "@/pages/CheckoutPage.jsx";

/* =========================
   GUEST PAGES
========================= */

import GuestDashboardHome from "@/pages/GuestDashboardHome.jsx";
import GuestBookingsPage from "@/pages/GuestBookingsPage.jsx";
import GuestWishlistPage from "@/pages/GuestWishlistPage.jsx";
import GuestPaymentHistoryPage from "@/pages/GuestPaymentHistoryPage.jsx";
import GuestFavoritesPage from "@/pages/GuestFavoritesPage.jsx";
import GuestMessagesPage from "@/pages/GuestMessagesPage.jsx";
import GuestReviewsPage from "@/pages/GuestReviewsPage.jsx";
import GuestSettingsPage from "@/pages/GuestSettingsPage.jsx";

/* =========================
   HOST PAGES
========================= */

import HostDashboardPage from "@/pages/HostDashboardPage.jsx";
import HostAddPropertyPage from "@/pages/HostAddPropertyPage.jsx";
import HostPropertiesPage from "@/pages/HostPropertiesPage.jsx";
import HostSettingsPage from "@/pages/HostSettingsPage.jsx";
import HostBookingsPage from "@/pages/HostBookingsPage.jsx";
import HostEarningsPage from "@/pages/HostEarningsPage.jsx";
import HostMessagesPage from "@/pages/HostMessagesPage.jsx";
import HostReviewsPage from "@/pages/HostReviewsPage.jsx";
import HostPayoutsPage from "@/pages/HostPayoutsPage.jsx";
import HostNotificationsPage from "@/pages/HostNotificationsPage.jsx";
import HostBookingCalendar from "@/components/HostBookingCalendar.jsx";
import EditPropertyPage from "@/pages/EditPropertyPage.jsx";

/* =========================
   ADMIN PAGES
========================= */

import AdminLoginPage from "@/pages/admin/AdminLoginPage.jsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.jsx";

import AdminPropertyManagement from "@/pages/admin/AdminPropertyManagement.jsx";
import AdminPropertyApprovalPage from "@/pages/admin/AdminPropertyApprovalPage.jsx";

import AdminBookingManagement from "@/pages/admin/AdminBookingManagement.jsx";

import AdminGuestManagement from "@/pages/admin/AdminGuestManagement.jsx";

import AdminRevenueTracking from "@/pages/admin/AdminRevenueTracking.jsx";

import AdminActivityLogs from "@/pages/admin/AdminActivityLogs.jsx";

import AdminBookingCalendar from "@/pages/admin/AdminBookingCalendar.jsx";

import AdminHostManagement from "@/pages/admin/AdminHostManagement.jsx";

import AdminReviewManagement from "@/pages/admin/AdminReviewManagement.jsx";

import AdminDisputes from "@/pages/admin/AdminDisputes.jsx";

import AdminMessageCenter from "@/pages/admin/AdminMessageCenter.jsx";

import AdminNotifications from "@/pages/admin/AdminNotifications.jsx";

import AdminReports from "@/pages/admin/AdminReports.jsx";

import AdminRoles from "@/pages/admin/AdminRoles.jsx";

import AdminSettings from "@/pages/admin/AdminSettings.jsx";

/* =====================================================
   PUBLIC APP LAYOUT
===================================================== */

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [successModalOpen, setSuccessModalOpen] = React.useState(false);

  const [successBookingId, setSuccessBookingId] = React.useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const sessionId = params.get("session_id");

    const bookingId = params.get("booking_id");

    if (sessionId && bookingId && location.pathname === "/guest/dashboard") {
      setSuccessBookingId(bookingId);

      setSuccessModalOpen(true);

      navigate("/guest/dashboard", {
        replace: true,
      });
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <Header />

      <main className="relative flex flex-1 flex-col w-full">{children}</main>

      <Footer />

      <PaymentSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        bookingId={successBookingId}
      />
    </div>
  );
};

/* =====================================================
   HOST APP LAYOUT
===================================================== */

const HostLayout = ({ children }) => {
  return <HostDashboardLayout>{children}</HostDashboardLayout>;
};

/* =====================================================
   HOST DASHBOARD ROUTE
===================================================== */

const HostDashboardRoute = () => {
  return (
    <ProtectedRoute requireHost>
      <HostDashboardPage />
    </ProtectedRoute>
  );
};

/* =====================================================
   HOST PROPERTIES ROUTE
===================================================== */

const HostPropertiesRoute = () => {
  return (
    <ProtectedRoute requireHost>
      <HostPropertiesPage />
    </ProtectedRoute>
  );
};

/* =====================================================
   HOST ADD PROPERTY ROUTE
===================================================== */

const HostFormRoute = () => {
  return (
    <ProtectedRoute requireHost>
      <HostAddPropertyPage />
    </ProtectedRoute>
  );
};

/* =====================================================
   HOST EDIT PROPERTY ROUTE
===================================================== */

const HostEditPropertyRoute = () => {
  return (
    <ProtectedRoute requireHost>
      <EditPropertyPage />
    </ProtectedRoute>
  );
};

/* =====================================================
   SIMPLE HOST PAGE PLACEHOLDER
   Temporary routes so sidebar does not go to 404
===================================================== */

const HostPlaceholderPage = ({ title, description }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <AdminAuthProvider>
              <ScrollToTop />

              <Routes>
                {/* ===============================
                    PUBLIC ROUTES
                =============================== */}

                <Route
                  path="/"
                  element={
                    <AppLayout>
                      <HomePage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/properties"
                  element={
                    <AppLayout>
                      <PropertyList />
                    </AppLayout>
                  }
                />

                <Route
                  path="/search"
                  element={
                    <AppLayout>
                      <SearchPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/property/:id"
                  element={
                    <AppLayout>
                      <PropertyDetailPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/properties/:id"
                  element={
                    <AppLayout>
                      <PropertyDetailPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/destination/:location"
                  element={
                    <AppLayout>
                      <DestinationPage />
                    </AppLayout>
                  }
                />

                {/* ===============================
                    AUTH
                =============================== */}

                <Route
                  path="/login"
                  element={
                    <AppLayout>
                      <LoginPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/signup"
                  element={
                    <AppLayout>
                      <SignupPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/host/login"
                  element={
                    <AppLayout>
                      <HostAuthPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/host/register"
                  element={
                    <AppLayout>
                      <HostRegisterPage />
                    </AppLayout>
                  }
                />

                {/* ===============================
                    INFORMATION PAGES
                =============================== */}

                <Route
                  path="/about"
                  element={
                    <AppLayout>
                      <AboutUsPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/explore"
                  element={
                    <AppLayout>
                      <ExplorePage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/blog"
                  element={
                    <AppLayout>
                      <BlogPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/help-center"
                  element={
                    <AppLayout>
                      <HelpCenterPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/faq"
                  element={
                    <AppLayout>
                      <FAQPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/safety"
                  element={
                    <AppLayout>
                      <SafetyPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/contact"
                  element={
                    <AppLayout>
                      <ContactPage />
                    </AppLayout>
                  }
                />

                {/* ===============================
                    CHECKOUT
                =============================== */}

                <Route
                  path="/checkout"
                  element={
                    <AppLayout>
                      <CheckoutPage />
                    </AppLayout>
                  }
                />

                <Route
                  path="/checkout/:propertyId"
                  element={
                    <AppLayout>
                      <CheckoutPage />
                    </AppLayout>
                  }
                />

                {/* ===============================
                    GUEST DASHBOARD
                =============================== */}

                <Route
                  path="/guest/dashboard"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestDashboardHome />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/bookings"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestBookingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/wishlist"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestWishlistPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/payments"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestPaymentHistoryPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/favorites"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestFavoritesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/messages"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestMessagesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/reviews"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestReviewsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guest/settings"
                  element={
                    <ProtectedRoute requireGuest>
                      <AppLayout>
                        <GuestSettingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* ===============================
                    HOST DASHBOARD
                =============================== */}

                <Route
                  path="/host/dashboard"
                  element={<HostDashboardRoute />}
                />

                {/* ===============================
                    HOST PROPERTIES
                =============================== */}

                <Route
                  path="/host/properties"
                  element={<HostPropertiesRoute />}
                />

                {/* ===============================
                    HOST ADD PROPERTY
                =============================== */}

                <Route path="/host/add-property" element={<HostFormRoute />} />

                <Route path="/host/property/new" element={<HostFormRoute />} />

                <Route
                  path="/host/create-listing"
                  element={<HostFormRoute />}
                />

                <Route path="/host/listing/new" element={<HostFormRoute />} />

                {/* ===============================
                    HOST EDIT PROPERTY
                =============================== */}

                <Route
                  path="/host/edit-property/:id"
                  element={<HostEditPropertyRoute />}
                />
                {/* HOST BOOKINGS */}
                <Route
                  path="/host/bookings"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostBookingsPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* HOST EARNINGS */}
                <Route
                  path="/host/earnings"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostEarningsPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* HOST PAYOUTS */}
                <Route
                  path="/host/payouts"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostPayoutsPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* HOST NOTIFICATIONS */}
                <Route
                  path="/host/notifications"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostNotificationsPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* HOST MESSAGES */}
                <Route
                  path="/host/messages"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostMessagesPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* HOST REVIEWS */}
                <Route
                  path="/host/reviews"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostReviewsPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* ===============================
                    HOST CALENDAR
                =============================== */}

                <Route
                  path="/host/calendar"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostBookingCalendar />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* ===============================
                    HOST SETTINGS
                =============================== */}

                <Route
                  path="/host/settings"
                  element={
                    <ProtectedRoute requireHost>
                      <HostLayout>
                        <HostSettingsPage />
                      </HostLayout>
                    </ProtectedRoute>
                  }
                />

                {/* ===============================
                    ADMIN LOGIN
                =============================== */}

                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* ===============================
                    ADMIN PANEL
                =============================== */}

                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />

                  <Route
                    path="properties"
                    element={<AdminPropertyManagement />}
                  />

                  <Route
                    path="properties/pending"
                    element={<AdminPropertyApprovalPage />}
                  />

                  <Route path="bookings" element={<AdminBookingManagement />} />

                  <Route path="users" element={<AdminHostManagement />} />

                  <Route path="guests" element={<AdminGuestManagement />} />

                  <Route path="reviews" element={<AdminReviewManagement />} />

                  <Route path="payouts" element={<AdminRevenueTracking />} />

                  <Route path="disputes" element={<AdminDisputes />} />

                  <Route path="messages" element={<AdminMessageCenter />} />

                  <Route
                    path="notifications"
                    element={<AdminNotifications />}
                  />

                  <Route path="analytics" element={<AdminReports />} />

                  <Route path="roles" element={<AdminRoles />} />

                  <Route path="audit-logs" element={<AdminActivityLogs />} />

                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="/privacy" element={<PrivacyPolicyPage />} />

                <Route path="/terms" element={<TermsPage />} />

                <Route
                  path="/cancellation"
                  element={<CancellationPolicyPage />}
                />

                {/* ===============================
                    404
                =============================== */}

                <Route
                  path="*"
                  element={
                    <AppLayout>
                      <NotFoundPage />
                    </AppLayout>
                  }
                />
              </Routes>

              <Toaster position="top-center" richColors theme="light" />
            </AdminAuthProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
