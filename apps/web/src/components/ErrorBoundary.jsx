
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service or console
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-background">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
            We encountered an unexpected error while loading this page. Our team has been notified.
          </p>
          <Button 
            onClick={this.handleRetry} 
            size="lg"
            className="gap-2 rounded-xl shadow-brand"
          >
            <RefreshCcw className="w-5 h-5" />
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children; 
  }
}
