/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Image, Video, Calendar, Eye, Filter, ChevronDown, CheckCircle } from 'lucide-react';
import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data';

interface GalleryProps {
  isBangla: boolean;
  onImageClick: (items: GalleryItem[], index: number) => void;
}

export default function Gallery({ isBangla, onImageClick }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ge_db_gallery');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return GALLERY_ITEMS;
  });

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
          <h1 className="font-sans text-fluid-hero font-black text-[#1F5E2E]">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 overflow-hidden w-full">
        
        {/* Category Tabs (Desktop + Mobile responsive) */}
        <div className="w-full px-4 flex flex-col items-center z-30" id="gallery-filter-container">
          {/* Mobile view: Elegant Custom Dropdown */}
          <div className="relative w-full max-w-sm md:hidden" id="gallery-mobile-filter">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white px-5 py-3 rounded-2xl shadow-sm text-xs font-sans font-extrabold text-gray-700 hover:border-gray-300 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2 text-[#1F5E2E]">
                <Filter size={15} />
                <span>{isBangla ? 'ক্যাটাগরি: ' : 'Category: '}</span>
                <span className="text-gray-900 font-black">
                  {isBangla 
                    ? (categories.find(c => c.id === activeCategory)?.labelBn || categories.find(c => c.id === activeCategory)?.label) 
                    : categories.find(c => c.id === activeCategory)?.label}
                </span>
              </span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                {/* Click outside backdrop */}
                <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-40 max-h-72 overflow-y-auto font-sans">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-[#1F5E2E]/10 text-[#1F5E2E]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{isBangla ? cat.labelBn : cat.label}</span>
                      {activeCategory === cat.id && (
                        <CheckCircle size={14} className="text-[#1F5E2E]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop view: Elegant Horizontal Pill Bar */}
          <div className="hidden md:flex items-center gap-1.5 border border-gray-200 bg-white p-1 rounded-full shadow-sm" id="gallery-filter-bar">
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
        </div>

        {/* Responsive Photo grid with Lightbox triggers */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full" id="gallery-grid">
          {filteredItems.map((item, index) => {
            // Find its index in the filtered array for proper lightbox swipe navigation!
            const filteredIndex = filteredItems.findIndex((fi) => fi.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => onImageClick(filteredItems, filteredIndex)}
                className="group relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200/40 bg-gray-900 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-zoom-in flex items-center justify-center"
              >
                {/* Blurred Ambient Cover Background */}
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-30 select-none"
                  referrerPolicy="no-referrer"
                />
                {/* Image */}
                <img
                  src={item.image}
                  alt={isBangla ? item.titleBn : item.title}
                  className="relative z-10 max-w-full max-h-full object-contain transform group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-6 text-left" id={`gallery-item-overlay-${item.id}`}>
                  {/* Category tag */}
                  <span className="bg-[#6BBF3A] text-white text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-widest py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-full w-fit mb-1.5">
                    {isBangla ? item.categoryLabelBn : item.categoryLabel}
                  </span>

                  {/* Title */}
                  <h4 className="font-sans text-xs sm:text-base md:text-lg font-black text-white leading-snug mb-0.5 sm:mb-1">
                    {isBangla ? item.titleBn : item.title}
                  </h4>

                  {/* Date and Indicator */}
                  <div className="flex items-center justify-between text-[9px] sm:text-xs text-gray-300 mt-1.5 sm:mt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} className="sm:size-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1 text-white bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">
                      <Eye size={10} className="sm:size-3" />
                      {isBangla ? 'দেখুন' : 'Zoom'}
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
