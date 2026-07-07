/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Image, Video, Calendar, Eye, Filter } from 'lucide-react';
import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data';

interface GalleryProps {
  isBangla: boolean;
  onImageClick: (items: GalleryItem[], index: number) => void;
}

export default function Gallery({ isBangla, onImageClick }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(GALLERY_ITEMS);

  // Dynamic fetch on mount
  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Server returned non-ok status');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryList(data);
        }
      })
      .catch((err) => console.log('Using static gallery fallback:', err));
  }, []);

  const categories = [
    { id: 'all', label: 'All Photos', labelBn: 'সব ছবি' },
    { id: 'plantation', label: 'Plantations', labelBn: 'বৃক্ষরোপণ' },
    { id: 'renewable', label: 'Solar Power', labelBn: 'সৌর শক্তি' },
    { id: 'water', label: 'Clean Water', labelBn: 'বিশুদ্ধ পানি' },
    { id: 'campaign', label: 'Campaigns', labelBn: 'অভিযানসমূহ' }
  ];

  // Filter gallery items
  const filteredItems = activeCategory === 'all'
    ? galleryList
    : galleryList.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col w-full bg-[#FAFAF7] pt-24 pb-20" id="gallery-view">
      {/* 1. HERO HEADER */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-b from-[#1F5E2E]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block">
            {isBangla ? 'ক্যাম্পেইন ফটো' : 'Visual History'}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F5E2E]">
            {isBangla ? 'আমাদের কাজের গ্যালারি' : 'Green Earth Field Gallery'}
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isBangla
              ? 'আমাদের পরিচালিত বৃক্ষরোপণ, গ্রামে গ্রামে সৌরশক্তি স্থাপন এবং প্রত্যন্ত অঞ্চলে গভীর বিশুদ্ধ নলকূপ স্থাপনের বাস্তব চিত্র।'
              : 'Real documentation of volunteer actions, engineering installs, and school events across local communities.'
            }
          </p>
          <div className="h-1 w-16 bg-[#6BBF3A] rounded-full mt-2" />
        </div>
      </section>

      {/* 2. COMPACT PORTFOLIO GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 self-center border border-gray-200 bg-white p-1 rounded-full shadow-sm max-w-full overflow-x-auto whitespace-nowrap scrollbar-none" id="gallery-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans font-extrabold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1F5E2E] text-white shadow'
                  : 'text-gray-500 hover:bg-[#6BBF3A]/5 hover:text-[#1F5E2E]'
              }`}
            >
              {isBangla ? cat.labelBn : cat.label}
            </button>
          ))}
        </div>

        {/* Responsive Photo grid with Lightbox triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid">
          {filteredItems.map((item, index) => {
            // Find its index in the filtered array for proper lightbox swipe navigation!
            const filteredIndex = filteredItems.findIndex((fi) => fi.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => onImageClick(filteredItems, filteredIndex)}
                className="group relative aspect-square sm:aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200/40 bg-white shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-zoom-in"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={isBangla ? item.titleBn : item.title}
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left" id={`gallery-item-overlay-${item.id}`}>
                  {/* Category tag */}
                  <span className="bg-[#6BBF3A] text-white text-[9px] font-mono font-black uppercase tracking-widest py-1 px-2.5 rounded-full w-fit mb-2">
                    {isBangla ? item.categoryLabelBn : item.categoryLabel}
                  </span>

                  {/* Title */}
                  <h4 className="font-sans text-base sm:text-lg font-black text-white leading-snug mb-1">
                    {isBangla ? item.titleBn : item.title}
                  </h4>

                  {/* Date and Indicator */}
                  <div className="flex items-center justify-between text-xs text-gray-300 mt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-white bg-white/20 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                      <Eye size={12} />
                      Zoom
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
