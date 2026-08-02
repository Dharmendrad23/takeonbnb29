
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Grid, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1562188208-a02e9abcda84?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1565995274853-2345d4d29177?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1676615026612-8d7642335476?auto=format&fit=crop&q=80&w=800',
];

export const PropertyImageGallery = ({ photos = [] }) => {
  const images = photos.length > 0 ? photos : DEFAULT_IMAGES;
  const isMobile = useIsMobile();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (isMobile) {
    return (
      <div className="relative w-full aspect-square md:hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
          <Button variant="secondary" size="icon" className="rounded-full pointer-events-auto shadow-md" onClick={prevImg}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full pointer-events-auto shadow-md" onClick={nextImg}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide backdrop-blur">
          {currentIdx + 1} / {images.length}
        </div>
      </div>
    );
  }

  // Desktop Bento Layout
  return (
    <div className="relative pt-6">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden relative group">
        <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
          <img src={images[0]} className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" alt="Main property view" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => { setCurrentIdx(i + 1); setLightboxOpen(true); }}>
            <img src={img} className="w-full h-full object-cover hover:scale-105 hover:brightness-90 transition-all duration-500" alt={`Property view ${i+2}`} />
          </div>
        ))}

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="absolute bottom-6 right-6 font-semibold shadow-soft rounded-lg gap-2 bg-white hover:bg-gray-100">
              <Grid className="w-4 h-4" /> Show all photos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black border-none rounded-none flex flex-col justify-center items-center">
            <Button variant="ghost" size="icon" className="absolute top-6 left-6 text-white hover:bg-white/20 rounded-full z-50" onClick={() => setLightboxOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
            <div className="relative w-full max-w-5xl aspect-[16/9] flex items-center justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentIdx}
                  src={images[currentIdx]}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[85vh] w-auto object-contain"
                />
              </AnimatePresence>
              
              <div className="absolute inset-x-0 flex items-center justify-between px-4 md:-mx-16">
                <Button variant="outline" size="icon" className="rounded-full bg-white/10 hover:bg-white text-white hover:text-black border-none w-12 h-12" onClick={prevImg}>
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-white/10 hover:bg-white text-white hover:text-black border-none w-12 h-12" onClick={nextImg}>
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div className="absolute bottom-6 text-white/70 font-medium">
              {currentIdx + 1} / {images.length}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
