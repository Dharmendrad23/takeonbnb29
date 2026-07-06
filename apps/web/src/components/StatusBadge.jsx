import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusStyles = (s) => {
    switch (s?.toLowerCase()) {
      case 'draft':
        return 'bg-muted text-muted-foreground border-muted-foreground/20';
      case 'submitted':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
      case 'live':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      default:
        return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusStyles(status)} ${className}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;