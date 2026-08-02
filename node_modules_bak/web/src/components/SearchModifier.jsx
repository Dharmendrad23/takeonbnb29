import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchModifier = ({ criteria, onEditClick }) => {
  if (!criteria) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Any week';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const datesText = (criteria.checkIn && criteria.checkOut) 
    ? `${formatDate(criteria.checkIn)} - ${formatDate(criteria.checkOut)}` 
    : 'Add dates';

  return (
    <motion.button 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onEditClick}
      className="flex items-center max-w-md mx-auto bg-card hover:bg-muted/50 border border-border shadow-sm rounded-full py-2.5 px-4 transition-all hover:shadow-md cursor-pointer w-full group"
    >
      <div className="flex-1 flex items-center justify-between text-sm px-2 overflow-hidden">
        <span className="font-semibold text-foreground truncate max-w-[100px]">
          {criteria.where || 'Anywhere'}
        </span>
        <span className="w-1 h-1 bg-border rounded-full mx-2 shrink-0" />
        <span className="font-medium text-foreground truncate max-w-[120px]">
          {datesText}
        </span>
        <span className="w-1 h-1 bg-border rounded-full mx-2 shrink-0" />
        <span className="font-medium text-muted-foreground whitespace-nowrap">
          {criteria.guests} guest{criteria.guests > 1 ? 's' : ''}
        </span>
      </div>
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors ml-2">
        <Search className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
    </motion.button>
  );
};

export default SearchModifier;