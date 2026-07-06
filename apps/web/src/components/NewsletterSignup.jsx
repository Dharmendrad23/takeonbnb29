import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast.success('Thanks for subscribing! Check your inbox for updates.');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-full">
      <div className="relative flex items-center w-full">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="pr-12 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
          aria-label="Email address for newsletter"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading}
          className="absolute right-1 w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
          aria-label="Subscribe"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 -ml-0.5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-slate-500 font-medium">
        Subscribe to receive curated property collections and exclusive offers. No spam, ever.
      </p>
    </form>
  );
};

export default NewsletterSignup;