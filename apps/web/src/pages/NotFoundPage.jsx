import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Helmet>
        <title>Page Not Found | Take On BnB</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-primary/20 font-serif text-9xl font-bold tracking-tighter">
            404
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Page not found</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The luxury escape you're looking for seems to have moved or doesn't exist. Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="outline" asChild className="w-full sm:w-auto h-12 px-6">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
              </button>
            </Button>
            <Button asChild className="w-full sm:w-auto h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" /> Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;