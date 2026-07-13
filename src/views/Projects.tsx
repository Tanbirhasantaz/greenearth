/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Filter, Clock, CheckCircle, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data';

interface ProjectsProps {
  isBangla: boolean;
  onProjectClick: (project: Project) => void;
}

type ProjectCategoryFilter = string;

export default function Projects({ isBangla, onProjectClick }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ge_db_projects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return PROJECTS;
  });

  // Dynamic fetch on mount
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Server returned non-ok status');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        }
      })
      .catch((err) => console.log('Using static projects fallback:', err));
  }, []);

  const defaultCategories = [
    { id: 'all', label: 'All', labelBn: 'সব প্রকল্প' },
    { id: 'plantation', label: 'Tree Plantation', labelBn: 'বৃক্ষরোপণ' },
    { id: 'renewable', label: 'Solar & Renewable', labelBn: 'সৌর ও নবায়নযোগ্য' },
    { id: 'water', label: 'Water & Sanitation', labelBn: 'নিরাপদ পানি' },
    { id: 'waste', label: 'Waste Management', labelBn: 'বর্জ্য অপসারণ' },
    { id: 'awareness', label: 'Awareness Campaigns', labelBn: 'সচেতনতা অভিযান' }
  ];

  const categories = [...defaultCategories];
  projectsList.forEach((proj) => {
    if (proj.category && !categories.some(c => c.id === proj.category)) {
      categories.push({
        id: proj.category,
        label: proj.categoryLabel || proj.category,
        labelBn: proj.categoryLabelBn || proj.categoryLabel || proj.category
      });
    }
  });

  // Filter projects based on choice
  const filteredProjects = activeCategory === 'all'
    ? projectsList
    : projectsList.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col w-full bg-[#FAFAF7] pt-24 pb-20" id="projects-view">
      {/* 1. HERO HEADER */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-b from-[#1F5E2E]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block">
            {isBangla ? 'আমাদের পদক্ষেপ' : 'Actions on Ground'}
          </span>
          <h1 className="font-sans text-fluid-hero font-black text-[#1F5E2E]">
            {isBangla ? 'আমাদের প্রকল্প ও কার্যক্রম' : 'Our Environmental Projects'}
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isBangla
              ? 'আমরা বাংলাদেশের ঝুঁকিপূর্ণ জেলাগুলোতে টেকসই দীর্ঘমেয়াদী পরিবেশবান্ধব প্রকল্প বাস্তবায়ন করছি।'
              : 'Discover how we turn community commitment into concrete, verifiable eco-restoration and clean utility projects.'
            }
          </p>
          <div className="h-1 w-16 bg-[#6BBF3A] rounded-full mt-2" />
        </div>
      </section>

      {/* 2. FILTER & PORTFOLIO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10 overflow-hidden w-full">
        
        {/* Category filtering list (Desktop + Mobile responsive) */}
        <div className="w-full px-4 flex flex-col items-center z-30" id="projects-filter-container">
          {/* Mobile view: Elegant Custom Dropdown */}
          <div className="relative w-full max-w-sm md:hidden" id="projects-mobile-filter">
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
                        setActiveCategory(cat.id as ProjectCategoryFilter);
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
          <div className="hidden md:flex items-center gap-2 border border-gray-200 bg-white/60 p-1.5 rounded-full shadow-sm" id="projects-filter-bar">
            <div className="px-3 text-gray-400 border-r border-gray-200 flex items-center gap-1.5">
              <Filter size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Filter</span>
            </div>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as ProjectCategoryFilter)}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-bold tracking-wide transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#1F5E2E] text-white shadow'
                      : 'text-gray-600 hover:bg-[#6BBF3A]/10 hover:text-[#1F5E2E]'
                  }`}
                >
                  {isBangla ? cat.labelBn : cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Project Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full" id="projects-grid">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl md:rounded-3xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full text-left w-full max-w-md mx-auto md:max-w-none"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-video overflow-hidden bg-gray-900 flex items-center justify-center">
                  {/* Blurred Ambient Cover Background */}
                  <img
                    src={project.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-30 select-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Fully Visible Foreground Image */}
                  <img
                    src={project.image}
                    alt={isBangla ? project.titleBn : project.title}
                    className="relative z-10 max-w-full max-h-full object-contain transform group-hover:scale-[1.02] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#1F5E2E] text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase shadow border border-gray-100 z-20">
                    {isBangla ? project.categoryLabelBn : project.categoryLabel}
                  </span>

                  {/* Status Overlay Badge */}
                  <span className={`absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full shadow z-20 ${
                    project.status === 'ongoing' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {project.status === 'ongoing' ? <Clock size={10} /> : <CheckCircle size={10} />}
                    <span className="uppercase tracking-wider font-mono">
                      {isBangla ? project.statusLabelBn : project.statusLabel}
                    </span>
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                  <div className="flex flex-col gap-2">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                      <MapPin size={12} className="text-[#6BBF3A]" />
                      <span>{isBangla ? project.locationBn : project.location}</span>
                    </div>
                    {/* Title */}
                    <h3 className="font-sans text-xl font-extrabold text-[#1F5E2E] group-hover:text-[#2E7D32] transition-colors leading-tight">
                      {isBangla ? project.titleBn : project.title}
                    </h3>
                    {/* Short Description */}
                    <p className="font-sans text-sm text-gray-500 leading-relaxed line-clamp-3 mt-1">
                      {isBangla ? project.shortDescriptionBn : project.shortDescription}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                    {/* Tiny impact highlight */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">Impact</span>
                      <span className="text-xs font-black text-[#1F5E2E]">
                        {isBangla ? project.impactMetricBn : project.impactMetric}
                      </span>
                    </div>

                    {/* View trigger */}
                    <button
                      onClick={() => onProjectClick(project)}
                      className="bg-[#1F5E2E]/5 hover:bg-[#1F5E2E] hover:text-white text-[#1F5E2E] font-sans font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{isBangla ? 'বিস্তারিত' : 'View Impact'}</span>
                      <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/50 shadow-sm max-w-lg mx-auto" id="no-projects-found">
            <Filter size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-bold text-gray-600 mb-2">
              {isBangla ? 'কোন প্রকল্প খুঁজে পাওয়া যায়নি' : 'No Projects Found'}
            </h3>
            <p className="font-sans text-sm text-gray-400 leading-relaxed mb-6">
              {isBangla
                ? 'এই ক্যাটাগরিতে এই মুহূর্তে কোনো কার্যক্রম নেই। শীঘ্রই এখানে নতুন কার্যক্রম যুক্ত হবে।'
                : 'There are currently no active projects under this category. We are preparing to deploy new campaigns soon.'
              }
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-2.5 px-6 rounded-full text-xs cursor-pointer"
            >
              {isBangla ? 'সব প্রকল্প দেখুন' : 'Reset Filters'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
