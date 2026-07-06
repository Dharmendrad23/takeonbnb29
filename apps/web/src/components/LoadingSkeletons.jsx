import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export const StatCardSkeleton = () => (
  <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="w-16 h-4 rounded" />
    </div>
    <Skeleton className="w-24 h-4 rounded mb-2" />
    <Skeleton className="w-32 h-8 rounded" />
  </div>
);

export const BookingRowSkeleton = () => (
  <tr className="border-b border-border/50">
    <td className="px-6 py-4">
      <Skeleton className="w-32 h-5 rounded mb-2" />
      <Skeleton className="w-24 h-3 rounded" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="w-28 h-4 rounded mb-1" />
      <Skeleton className="w-24 h-3 rounded" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="w-20 h-5 rounded mb-1" />
      <Skeleton className="w-16 h-3 rounded" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="w-20 h-6 rounded-full" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end gap-2">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </td>
  </tr>
);

export const ChartSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl shadow-sm p-6 h-96 flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="w-40 h-6 rounded" />
      <Skeleton className="w-24 h-8 rounded" />
    </div>
    <div className="flex-1 flex items-end gap-4">
      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export const CalendarSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl shadow-sm p-4 h-[500px] flex flex-col">
    <div className="flex justify-between mb-4">
      <Skeleton className="w-32 h-8 rounded" />
      <Skeleton className="w-48 h-8 rounded" />
    </div>
    <Skeleton className="w-full h-10 rounded mb-2" />
    <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-1">
      {Array(35).fill(0).map((_, i) => (
        <Skeleton key={i} className="w-full h-full rounded-sm opacity-50" />
      ))}
    </div>
  </div>
);

export const FadeInWrapper = ({ children, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};