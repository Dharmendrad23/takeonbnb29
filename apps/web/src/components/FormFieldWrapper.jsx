import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const FormFieldWrapper = ({ 
  label, 
  error, 
  icon: Icon, 
  required, 
  children, 
  className,
  htmlFor
}) => {
  return (
    <div className={cn("space-y-2 relative group", className)}>
      <Label 
        htmlFor={htmlFor} 
        className={cn(
          "text-sm font-semibold uppercase tracking-wider",
          error ? "text-destructive" : "text-foreground/80 group-focus-within:text-primary transition-colors"
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className={cn("relative", Icon && "[&>input]:pl-11 [&>select]:pl-11 [&>button]:pl-11 [&>textarea]:pl-11")}>
          {children}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-xs text-destructive font-medium m-0"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};