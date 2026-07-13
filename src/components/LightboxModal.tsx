/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  isBangla: boolean;
}

export default function LightboxModal({
  isOpen,
  onClose,
  items,
  activeIndex,
  onIndexChange,
  isBangla
}: LightboxModalProps) {
  const [isZoomed, setIsZoomed] = React.useState(false);

  // Key bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, items]);

  useEffect(() => {
    setIsZoomed(false);
  }, [activeIndex]);

  if (!isOpen || items.length === 0 || activeIndex < 0 || activeIndex >= items.length) {
    return null;
  }

  const currentItem = items[activeIndex];

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % items.length;
    onIndexChange(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    onIndexChange(prevIndex);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
        {/* Close trigger overlay */}
        <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} id="lightbox-backdrop" />

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
            id="lightbox-close-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform -translate-y-1/2 top-1/2 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous Image"
            id="lightbox-prev-btn"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Active Image and details */}
        <div className="relative max-w-5xl max-h-[80vh] px-2 sm:px-12 flex flex-col justify-center items-center pointer-events-none">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.25 : 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto transition-shadow duration-300 ${
              isZoomed ? 'cursor-zoom-out shadow-black/80 ring-2 ring-[#6BBF3A]/40' : 'cursor-zoom-in hover:shadow-black/60'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          >
            <img
              src={currentItem.image}
              alt={isBangla ? currentItem.titleBn : currentItem.title}
              className="max-w-full max-h-[55vh] sm:max-h-[70vh] object-contain rounded-2xl select-none"
              referrerPolicy="no-referrer"
              id="lightbox-main-img"
            />
          </motion.div>

          {/* Label Card */}
          <div className="mt-4 text-center pointer-events-auto bg-black/60 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/5 max-w-sm sm:max-w-lg mx-4">
            <span className="inline-block bg-[#6BBF3A] text-white text-[9px] sm:text-[10px] uppercase font-mono font-black tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full mb-1">
              {isBangla ? currentItem.categoryLabelBn : currentItem.categoryLabel}
            </span>
            <h4 className="text-white text-xs sm:text-base font-sans font-bold leading-tight" id="lightbox-title">
              {isBangla ? currentItem.titleBn : currentItem.title}
            </h4>
            <div className="flex justify-center items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 mt-1 font-mono">
              <Calendar size={10} className="sm:size-3" />
              <span>{currentItem.date}</span>
              <span className="mx-1 sm:mx-2">•</span>
              <span>{activeIndex + 1} / {items.length}</span>
            </div>
          </div>
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform -translate-y-1/2 top-1/2 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next Image"
            id="lightbox-next-btn"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>
    </AnimatePresence>
  );
}
