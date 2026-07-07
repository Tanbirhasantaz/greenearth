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
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform -translate-y-1/2 top-1/2 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous Image"
            id="lightbox-prev-btn"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Active Image and details */}
        <div className="relative max-w-5xl max-h-[80vh] px-12 flex flex-col justify-center items-center pointer-events-none">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src={currentItem.image}
              alt={isBangla ? currentItem.titleBn : currentItem.title}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
              id="lightbox-main-img"
            />
          </motion.div>

          {/* Label Card */}
          <div className="mt-4 text-center pointer-events-auto bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 max-w-lg">
            <span className="inline-block bg-[#6BBF3A] text-white text-[10px] uppercase font-mono font-black tracking-widest px-2.5 py-1 rounded-full mb-1">
              {isBangla ? currentItem.categoryLabelBn : currentItem.categoryLabel}
            </span>
            <h4 className="text-white text-base font-sans font-bold leading-tight" id="lightbox-title">
              {isBangla ? currentItem.titleBn : currentItem.title}
            </h4>
            <div className="flex justify-center items-center gap-1.5 text-xs text-gray-400 mt-1 font-mono">
              <Calendar size={12} />
              <span>{currentItem.date}</span>
              <span className="mx-2">•</span>
              <span>{activeIndex + 1} / {items.length}</span>
            </div>
          </div>
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform -translate-y-1/2 top-1/2 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next Image"
            id="lightbox-next-btn"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </AnimatePresence>
  );
}
