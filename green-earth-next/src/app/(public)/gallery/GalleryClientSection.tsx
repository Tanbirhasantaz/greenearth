'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { GalleryItem } from '@/types';
import { ZoomIn, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface GalleryClientSectionProps {
  items: GalleryItem[];
}

export default function GalleryClientSection({ items }: GalleryClientSectionProps) {
  const { isBangla, t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % items.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
  };

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image Canvas */}
            <div className="relative h-64 md:h-72 w-full bg-gray-100 overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover Zoom-in Icon Layer */}
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-3.5 bg-white/20 border border-white/20 text-white rounded-full backdrop-blur-sm scale-90 group-hover:scale-100 transition-transform">
                  <ZoomIn size={24} />
                </div>
              </div>
            </div>

            {/* Caption Area */}
            <div className="p-6">
              {item.event_name && (
                <span className="text-[10px] font-bold text-forest-green uppercase tracking-widest block mb-1">
                  {t(item.event_name, item.event_name_bn || "")}
                </span>
              )}
              <h3 className="font-sans font-extrabold text-base text-neutral-900 line-clamp-1">
                {t(item.title, item.title_bn || "")}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentItem && lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Close Trigger */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X size={20} />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-6 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors cursor-pointer hidden md:block"
            aria-label="Previous Image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Core Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200"
          >
            <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={currentItem.image_url}
                alt={currentItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Bottom Caption Info */}
            <div className="text-center text-white mt-2 max-w-xl">
              {currentItem.event_name && (
                <span className="text-xs font-bold text-[#6BBF3A] uppercase tracking-widest block mb-1">
                  {t(currentItem.event_name, currentItem.event_name_bn || "")}
                </span>
              )}
              <h2 className="text-lg md:text-xl font-sans font-extrabold">
                {t(currentItem.title, currentItem.title_bn || "")}
              </h2>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-6 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors cursor-pointer hidden md:block"
            aria-label="Next Image"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
