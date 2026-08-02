
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building, Tent, Tractor, Ship, Trees, Building2, Palmtree } from 'lucide-react';

const categories = [
  { name: 'Villas', count: '1,245', icon: Home },
  { name: 'Apartments', count: '2,156', icon: Building },
  { name: 'Cabins', count: '892', icon: Tent },
  { name: 'Farm Houses', count: '567', icon: Tractor },
  { name: 'Houseboats', count: '234', icon: Ship },
  { name: 'Treehouses', count: '445', icon: Trees },
  { name: 'Penthouses', count: '678', icon: Building2 },
  { name: 'Cottages', count: '1,123', icon: Palmtree },
];

const PropertyCategories = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="relative inline-block pb-2">
            Browse by Category
            <span className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-primary rounded-full"></span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card hover:bg-primary group cursor-pointer border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-muted group-hover:bg-white/20 rounded-full transition-colors">
                  <Icon className="w-8 h-8 text-foreground group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-white transition-colors">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors mt-1">{cat.count}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;
