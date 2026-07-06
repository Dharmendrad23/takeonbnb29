
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import AdminProtectedRoute from '@/components/AdminProtectedRoute.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';
import PaymentSuccessModal from '@/components/PaymentSuccessModal.jsx';

// Public Pages
import HomePage from '@/pages/HomePage.jsx';
import PropertyList from '@/pages/PropertyList.jsx';
import PropertyDetailPage from '@/pages/PropertyDetailPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import HostRegisterPage from '@/pages/HostRegisterPage.jsx';
import DestinationPage from '@/pages/DestinationPage.jsx';

// Advanced Search
import SearchPage from '@/pages/SearchPage.jsx';
import SearchResultsPage from '@/pages/SearchResultsPage.jsx';

// Static / Info Pages
import AboutUsPage from '@/pages/AboutUsPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

// Guest Dashboards
import GuestDashboardHome from '@/pages/GuestDashboardHome.jsx';
import GuestBookingsPage from '@/pages/GuestBookingsPage.jsx';
import GuestWishlistPage from '@/pages/GuestWishlistPage.jsx';

// Host Pages
import HostDashboardPage from '@/pages/HostDashboardPage.jsx';
import HostPropertyListingForm from '@/pages/HostPropertyListingForm.jsx';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';

// Wrapping layout for general pages
const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [successBookingId, setSuccessBookingId] = React.useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    const bookingId = params.get('booking_id');
    
    if (sessionId && bookingId && location.pathname === '/guest/dashboard') {
      setSuccessBookingId(bookingId);
      setSuccessModalOpen(true);
      navigate('/guest/dashboard', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 w-full relative flex flex-col pt-0">
        {children}
      </main>
      <Footer />
      <PaymentSuccessModal 
        isOpen={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)} 
        bookingId={successBookingId} 
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <AdminAuthProvider>
              <ScrollToTop />
              <Routes>
                
                {/* Public Routes */}
                <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
                <Route path="/properties" element={<AppLayout><PropertyList /></AppLayout>} />
                <Route path="/search" element={<AppLayout><SearchResultsPage /></AppLayout>} />
                <Route path="/property/:id" element={<AppLayout><PropertyDetailPage /></AppLayout>} />
                <Route path="/destination/:location" element={<AppLayout><DestinationPage /></AppLayout>} />
                <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
                <Route path="/signup" element={<AppLayout><SignupPage /></AppLayout>} />
                <Route path="/host/register" element={<AppLayout><HostRegisterPage /></AppLayout>} />
                
                {/* Static Pages */}
                <Route path="/about" element={<AppLayout><AboutUsPage /></AppLayout>} />
                <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />

                {/* Guest Protected Routes */}
                <Route path="/guest/dashboard" element={<ProtectedRoute requireGuest><AppLayout><GuestDashboardHome /></AppLayout></ProtectedRoute>} />
                <Route path="/guest/bookings" element={<ProtectedRoute requireGuest><AppLayout><GuestBookingsPage /></AppLayout></ProtectedRoute>} />
                <Route path="/guest/wishlist" element={<ProtectedRoute requireGuest><AppLayout><GuestWishlistPage /></AppLayout></ProtectedRoute>} />
                
                {/* Host Protected Routes */}
                <Route path="/host/dashboard" element={<ProtectedRoute requireHost><AppLayout><HostDashboardPage /></AppLayout></ProtectedRoute>} />
                <Route path="/host/property/new" element={<ProtectedRoute requireHost><AppLayout><HostPropertyListingForm /></AppLayout></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                </Route>

                {/* Catch-all 404 */}
                <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
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
