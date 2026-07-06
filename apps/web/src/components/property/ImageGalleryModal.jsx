import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageGalleryModal = ({ isOpen, onClose, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => setCurrentIndex((prev) => (prev + 1) % images.length), [images.length]);
  const handlePrev = useCallback(() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
      >
        <div className="flex justify-between items-center p-4 md:p-6 text-white absolute top-0 left-0 right-0 z-50">
          <span className="text-sm font-medium tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <button 
            onClick={onClose} 
            className="p-2.5 bg-black/50 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center px-4 md:px-20 overflow-hidden">
          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-sm hidden md:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50) {
                handleNext();
              } else if (swipe > 50) {
                handlePrev();
              }
            }}
          />

          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-sm hidden md:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        <div className="h-24 md:h-32 p-4 flex justify-center gap-2 overflow-x-auto no-scrollbar bg-gradient-to-t from-black/80 to-transparent">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-full aspect-video rounded-md overflow-hidden transition-all shrink-0 ${
                idx === currentIndex ? 'ring-2 ring-primary opacity-100 scale-105' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGalleryModal;