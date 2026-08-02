import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full overflow-x-auto no-scrollbar border-b border-border bg-background/95 backdrop-blur-md pt-4 pb-2"
    >
      <div className="flex items-center gap-6 sm:gap-8 min-w-max px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          const Icon = category.icon;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 pb-3 text-sm font-medium transition-colors duration-200 outline-none min-h-[48px] group",
                isSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {Icon && <Icon className={cn("w-6 h-6 transition-colors duration-300", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
              </div>
              <span>{category.label}</span>
              
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryTabs;