import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
      />
      <div className="space-y-3 w-full max-w-xs">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <Skeleton className="h-4 w-4/6 rounded-lg" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">Loading...</p>
    </div>
  );
}