/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, Trees, Wind, Sun, Droplet, Trash2, Heart, Award, Users, TrendingUp, Calendar, ArrowRight, Star,
  Shield, Lightbulb, Landmark, BookOpen, Globe, Activity, Target, Scale, Zap, HeartHandshake, Eye, Flag, ShieldCheck, MapPin
} from 'lucide-react';
import { Page, Project, BlogPost, Testimonial } from '../types';
import { PROJECTS, BLOG_POSTS, TESTIMONIALS, IMAGES } from '../data';

// Stat Counter component to handle incremental numbers cleanly on load
function StatCounter({ target, suffix = '', label, isBangla }: { target: number, suffix: string, label: string, isBangla: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // ms
    const increment = Math.ceil(target / (duration / 16)); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  // Translate numbers to Bangla if needed
  const toBengaliNumber = (num: number | string) => {
    const numbers: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return num.toString().split('').map(char => numbers[char] || char).join('');
  };

  const displayCount = count.toLocaleString('en-US');
  const formattedCount = isBangla ? toBengaliNumber(displayCount) : displayCount;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl border border-white/5 shadow-inner backdrop-blur-sm">
      <div className="text-3xl md:text-4xl lg:text-5xl font-sans font-black text-white flex items-center mb-1">
        <span>{formattedCount}</span>
        <span className="text-[#6BBF3A] ml-0.5">{suffix}</span>
      </div>
      <div className="text-xs md:text-sm text-green-100 font-mono font-bold uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
}

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  isBangla: boolean;
  onProjectClick: (project: Project) => void;
  onBlogClick: (post: BlogPost) => void;
  onDonateClick: () => void;
  settings?: any;
}

export default function Home({
  setCurrentPage,
  isBangla,
  onProjectClick,
  onBlogClick,
  onDonateClick,
  settings
}: HomeProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [blogsList, setBlogsList] = useState<BlogPost[]>(BLOG_POSTS);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS);

  const defaultFocusAreas = [
    {
      id: "focus-1",
      iconName: "Trees",
      title: "Tree Plantation",
      titleBn: "বৃক্ষরোপণ কর্মসূচি",
      description: "Planting native trees and coastal mangroves in erosion-prone belts of Sundarbans and northern riverbanks.",
      descriptionBn: "সুন্দরবন উপকূল এবং উত্তরাঞ্চলের নদীভাঙন কবলিত এলাকায় দেশীয় চারা রোপণ ও ম্যানগ্রোভ বনায়ন তৈরি করা।",
      color: "emerald"
    },
    {
      id: "focus-2",
      iconName: "Sun",
      title: "Renewable Energy",
      titleBn: "নবায়নযোগ্য জ্বালানি",
      description: "Sponsoring reliable off-grid solar micro-grids for isolated schools and homes in northern river chars.",
      descriptionBn: "চরাঞ্চলের গ্রিডহীন প্রত্যন্ত এলাকায় সৌর প্যানেল ও হোম সিস্টেমের মাধ্যমে বিদ্যুৎ ও আলোর ব্যবস্থা করা।",
      color: "amber"
    },
    {
      id: "focus-3",
      iconName: "Droplet",
      title: "Water Conservation",
      titleBn: "বিশুদ্ধ পানি সরবরাহ",
      description: "Drilling deep, arsenic-free tube wells and setting rainwater purification structures in contaminated hubs.",
      descriptionBn: "আর্সেনিক ও স্যালাইন কবলিত এলাকায় গভীর বিশুদ্ধ নলকূপ এবং বৃষ্টির পানি ফিল্টারিং প্ল্যান্ট স্থাপন করা।",
      color: "sky"
    },
    {
      id: "focus-4",
      iconName: "Trash2",
      title: "Waste & Recycling",
      titleBn: "বর্জ্য ও রিসাইক্লিং",
      description: "Organizing riverbank plastic cleanups and teaching households smart eco-friendly recycling habits.",
      descriptionBn: "বুড়িগঙ্গাসহ বিভিন্ন নদী তীরবর্তী প্লাস্টিক অপসারণ এবং বাসাবাড়ির রিসাইক্লিং অভ্যাসের প্রশিক্ষণ দেওয়া।",
      color: "purple"
    }
  ];

  const [focusAreasList, setFocusAreasList] = useState<any[]>(defaultFocusAreas);

  // Dynamic fetch on mount
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Projects fail');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        }
      })
      .catch((err) => console.log('Using static projects fallback:', err));

    fetch('/api/blogs')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Blogs fail');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogsList(data);
        }
      })
      .catch((err) => console.log('Using static blogs fallback:', err));

    fetch('/api/testimonials')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Testimonials fail');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonialsList(data);
        }
      })
      .catch((err) => console.log('Using static testimonials fallback:', err));

    fetch('/api/focusareas')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Focus areas fail');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFocusAreasList(data);
        }
      })
      .catch((err) => console.log('Using static focus areas fallback:', err));
  }, []);

  // Auto scroll testimonials
  useEffect(() => {
    if (testimonialsList.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonialsList.length]);

  const iconMap: { [key: string]: React.ReactNode } = {
    Leaf: <Leaf size={28} />,
    Users: <Users size={28} />,
    TrendingUp: <TrendingUp size={28} />,
    Award: <Award size={28} />,
    Shield: <Shield size={28} />,
    Lightbulb: <Lightbulb size={28} />,
    Landmark: <Landmark size={28} />,
    BookOpen: <BookOpen size={28} />,
    Heart: <Heart size={28} />,
    Globe: <Globe size={28} />,
    Activity: <Activity size={28} />,
    Droplet: <Droplet size={28} />,
    Sun: <Sun size={28} />,
    Target: <Target size={28} />,
    Scale: <Scale size={28} />,
    Zap: <Zap size={28} />,
    Trees: <Trees size={28} />,
    HeartHandshake: <HeartHandshake size={28} />,
    Eye: <Eye size={28} />,
    Flag: <Flag size={28} />,
    ShieldCheck: <ShieldCheck size={28} />,
    MapPin: <MapPin size={28} />,
    Trash2: <Trash2 size={28} />
  };

  const getColorClasses = (colorName: string) => {
    switch (colorName?.toLowerCase()) {
      case 'emerald':
      case 'green':
        return 'bg-emerald-50 text-emerald-700 hover:border-emerald-500';
      case 'amber':
      case 'yellow':
        return 'bg-amber-50 text-amber-700 hover:border-amber-500';
      case 'sky':
      case 'blue':
        return 'bg-sky-50 text-sky-700 hover:border-sky-500';
      case 'purple':
      case 'violet':
        return 'bg-purple-50 text-purple-700 hover:border-purple-500';
      case 'rose':
      case 'red':
        return 'bg-rose-50 text-rose-700 hover:border-rose-500';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 hover:border-indigo-500';
      case 'orange':
        return 'bg-orange-50 text-orange-700 hover:border-orange-500';
      default:
        if (colorName && colorName.includes('bg-')) {
          return colorName;
        }
        return 'bg-emerald-50 text-emerald-700 hover:border-emerald-500';
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden" id="home-view">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#FAFAF7] via-[#F4F6F0] to-[#E3EAE0]">
        {/* Sunburst background effect */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-65">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square bg-[radial-gradient(circle,_rgba(253,216,53,0.15)_0%,_rgba(255,255,255,0)_60%)]" />
        </div>

        {/* Hero image background overlay */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0 pointer-events-none">
          {/* Main Hero Image */}
          <img
            src={(settings?.heroImgUrl && !settings.heroImgUrl.startsWith('/src/')) ? settings.heroImgUrl : IMAGES.hero}
            alt="Bangladesh Landscape"
            className="w-full h-full object-cover opacity-65 sm:opacity-80 lg:opacity-100"
            referrerPolicy="no-referrer"
          />
          {/* Subtle diagonal split for modern composition on desktop */}
          <div className="hidden lg:block absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-[#F4F6F0] to-transparent z-10" />
          
          {/* Mobile-only gradient overlays to blend image into background and ensure legibility */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-transparent via-[#F4F6F0]/50 to-[#F4F6F0]/90 z-10" />
          <div className="lg:hidden absolute inset-0 bg-gradient-to-r from-[#F4F6F0]/90 via-[#F4F6F0]/40 to-transparent z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12">
          <div className="max-w-xl flex flex-col items-start gap-6">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6BBF3A]/10 text-[#1F5E2E] border border-[#6BBF3A]/20 text-xs font-mono font-bold tracking-wider uppercase"
            >
              <Leaf size={14} className="text-[#6BBF3A]" />
              <span>
                {isBangla 
                  ? (settings?.heroTaglineBn || 'একটি সুন্দর ভবিষ্যৎ গড়তে') 
                  : (settings?.heroTagline || 'For a sustainable tomorrow')
                }
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black text-[#1F5E2E] leading-tight"
            >
              {isBangla 
                ? (settings?.heroTitleBn || 'পরিচ্ছন্ন, সবুজ এবং টেকসই বাংলাদেশ') 
                : (settings?.heroTitle || 'Cleaner, Greener & Sustainable Future')
              }
            </motion.h1>

            {/* Paragraph Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed"
            >
              {isBangla 
                ? (settings?.heroBioBn || 'আমরা বাংলাদেশের পরিবেশ সুরক্ষায় নিবেদিত একদল স্বেচ্ছাসেবী। উপকূলীয় ম্যানগ্রোভ বনায়ন, প্রত্যন্ত চরাঞ্চলে সৌরবিদ্যুৎ এবং বিশুদ্ধ খাবার পানির সংস্থানে আমরা কাজ করছি তৃণমূল পর্যায়ে।') 
                : (settings?.heroBio || 'Empowering communities across Bangladesh to restore coastal mangrove shield walls, light up remote rivers islands with clean solar power, and access safe drinking water.')
              }
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onDonateClick}
                className="flex-1 sm:flex-initial bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-donate-cta"
              >
                <Heart size={18} fill="currentColor" className="text-red-300 animate-pulse" />
                <span>{isBangla ? 'অনুদান দিন' : 'Donate Now'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage('involved');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-initial py-4 px-8 rounded-full border-2 border-[#1F5E2E] text-[#1F5E2E] font-sans font-bold hover:bg-[#1F5E2E]/5 transition-colors text-center cursor-pointer"
                id="hero-volunteer-cta"
              >
                {isBangla ? 'স্বেচ্ছাসেবী হোন' : 'Join as Volunteer'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR SECTION */}
      <section className="bg-[#1F5E2E] relative py-12 z-10" id="stats-section">
        {/* Overlay subtle waves */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-300 via-green-600 to-green-900" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCounter
              target={Number(settings?.statTreesTarget) || 12450}
              suffix="+"
              label={isBangla ? 'রোপণকৃত চারাগাছ' : 'Trees Planted'}
              isBangla={isBangla}
            />
            <StatCounter
              target={Number(settings?.statVillagesTarget) || 68}
              suffix="+"
              label={isBangla ? 'উপকৃত গ্রাম' : 'Villages Powered'}
              isBangla={isBangla}
            />
            <StatCounter
              target={Number(settings?.statVolunteersTarget) || 850}
              suffix="+"
              label={isBangla ? 'সক্রিয় স্বেচ্ছাসেবী' : 'Active Volunteers'}
              isBangla={isBangla}
            />
            <StatCounter
              target={Number(settings?.statWaterTarget) || 35}
              suffix="+"
              label={isBangla ? 'বিশুদ্ধ পানির প্ল্যান্ট' : 'Safe Water Projects'}
              isBangla={isBangla}
            />
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DO SECTION */}
      <section className="py-20 bg-[#FAFAF7]" id="what-we-do-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
              {isBangla ? 'আমাদের কার্যক্রম' : 'Our Focus Areas'}
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#1F5E2E] mb-4">
              {isBangla ? 'সবুজ বাংলাদেশ গঠনে আমাদের পদক্ষেপ' : 'Actions We Take for Green Bangladesh'}
            </h2>
            <div className="h-1 w-20 bg-[#6BBF3A] mx-auto rounded-full" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {focusAreasList.map((item, index) => (
              <motion.div
                key={item.id || index}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-[#6BBF3A] flex flex-col gap-5 text-left"
              >
                <div className={`p-4 rounded-2xl w-fit ${getColorClasses(item.color)}`}>
                  {iconMap[item.iconName] || <Trees size={28} />}
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-[#1F5E2E] mb-2">
                    {isBangla ? item.titleBn : item.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {isBangla ? item.descriptionBn || item.descBn : item.description || item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#FAFAF7] to-[#F1F4EE]" id="featured-projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
                {isBangla ? 'সফল কার্যক্রম' : 'Active Initiatives'}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#1F5E2E]">
                {isBangla ? 'আমাদের সাম্প্রতিক প্রকল্পসমূহ' : 'Our Featured Impact Projects'}
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentPage('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#1F5E2E] hover:text-[#6BBF3A] font-sans font-bold flex items-center gap-1.5 text-sm cursor-pointer whitespace-nowrap"
              id="view-all-projects-btn"
            >
              <span>{isBangla ? 'সব প্রকল্প দেখুন' : 'Explore All Projects'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Projects Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsList.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={isBangla ? project.titleBn : project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category overlay badge */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#1F5E2E] text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase shadow">
                    {isBangla ? project.categoryLabelBn : project.categoryLabel}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-1 gap-4 justify-between">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-[#1F5E2E] group-hover:text-[#2E7D32] transition-colors leading-snug mb-2">
                      {isBangla ? project.titleBn : project.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {isBangla ? project.shortDescriptionBn : project.shortDescription}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-400">
                      📍 {isBangla ? project.locationBn : project.location}
                    </span>
                    <button
                      onClick={() => onProjectClick(project)}
                      className="text-[#2E7D32] hover:text-[#1F5E2E] font-sans font-extrabold text-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isBangla ? 'বিস্তারিত' : 'Read More'}</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GET INVOLVED BANNER */}
      <section className="relative py-20 bg-[#1F5E2E] overflow-hidden" id="get-involved-cta">
        {/* Background blobs / circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6BBF3A]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <Award size={48} className="text-[#6BBF3A]" />
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-white leading-tight">
            {isBangla ? 'আসুন একসাথে আমাদের নদী ও প্রকৃতি বাঁচাই' : 'Restore Bangladesh’s Fragile Delta with Us'}
          </h2>
          <p className="font-sans text-base sm:text-lg text-green-100 max-w-2xl">
            {isBangla
              ? 'জলবায়ু পরিবর্তনের ঝুঁকিতে থাকা উপকূলীয় মানুষকে সুরক্ষা দিতে এবং নবায়নযোগ্য জ্বালানির আলো ছড়াতে আপনার সহযোগিতা প্রয়োজন। স্বেচ্ছাসেবী হিসেবে আজই যুক্ত হোন বা অনুদান দিয়ে পাশে দাঁড়ান।'
              : 'Our climate protection campaigns are funded entirely by grassroots citizens. Whether you plant seeds or volunteer deep in the chars, you are writing future ecological defense.'
            }
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <button
              onClick={() => {
                setCurrentPage('involved');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#6BBF3A] hover:bg-[#81C784] text-white font-sans font-bold py-3.5 px-8 rounded-full shadow-lg transition-all cursor-pointer"
              id="involved-volunteer-action"
            >
              {isBangla ? 'স্বেচ্ছাসেবী হোন' : 'Join as Volunteer'}
            </button>
            <a
              href={settings?.membershipFormUrl || 'https://forms.gle/51Kt57CfRuAnAGy88'}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-sans font-bold py-3.5 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              id="home-membership-cta-action"
            >
              <Award size={16} className="text-[#6BBF3A]" />
              <span>{isBangla ? 'সদস্য হোন (গুগল ফরম)' : 'Become a Member'}</span>
            </a>
            <button
              onClick={onDonateClick}
              className="bg-white hover:bg-gray-100 text-[#1F5E2E] font-sans font-bold py-3.5 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              id="involved-donate-action"
            >
              <Heart size={16} fill="currentColor" className="text-red-500 animate-pulse" />
              <span>{isBangla ? 'সহায়তা করুন' : 'Donate Today'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-20 bg-[#FAFAF7]" id="testimonials-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
            {isBangla ? 'উপকারভোগীদের মন্তব্য' : 'Voice of the Communities'}
          </span>
          <h2 className="font-sans text-3xl font-extrabold text-[#1F5E2E] mb-12">
            {isBangla ? 'মানুষ আমাদের সম্পর্কে যা বলছেন' : 'What Local Beneficiaries are Saying'}
          </h2>

          <div className="relative min-h-[220px]">
            {testimonialsList.map((t, index) => (
              <div
                key={t.id}
                className={`transition-all duration-500 absolute inset-0 flex flex-col items-center justify-center ${
                  index === activeTestimonial ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {/* Quote Icon styling */}
                <span className="text-6xl text-[#6BBF3A]/20 font-serif leading-none select-none">“</span>
                <p className="font-sans text-base sm:text-lg lg:text-xl text-gray-600 italic leading-relaxed max-w-3xl mb-6">
                  {isBangla ? t.quoteBn : t.quote}
                </p>
                <div>
                  <h4 className="font-sans font-black text-gray-900 text-sm sm:text-base leading-tight">
                    {isBangla ? t.authorBn : t.author}
                  </h4>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {isBangla ? t.roleBn : t.role} — {isBangla ? t.locationBn : t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots controller */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonialsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  idx === activeTestimonial ? 'bg-[#1F5E2E] w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST BLOG PREVIEW */}
      <section className="py-20 bg-gradient-to-b from-[#FAFAF7] to-[#F1F4EE]" id="latest-news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
                {isBangla ? 'পরিবেশ বার্তা' : 'Ecological Updates'}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#1F5E2E]">
                {isBangla ? 'আমাদের পরিবেশ বিষয়ক কলাম ও খবর' : 'Latest Environmental News & Columns'}
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentPage('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#1F5E2E] hover:text-[#6BBF3A] font-sans font-bold flex items-center gap-1.5 text-sm cursor-pointer whitespace-nowrap"
              id="view-all-blogs-btn"
            >
              <span>{isBangla ? 'সব খবর দেখুন' : 'Explore Eco-Blog'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogsList.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full group cursor-pointer"
                onClick={() => onBlogClick(post)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={isBangla ? post.titleBn : post.title}
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#1F5E2E]">
                    {isBangla ? post.categoryBn : post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold mb-2">
                      <Calendar size={12} />
                      <span>{isBangla ? post.dateBn : post.date}</span>
                    </div>
                    <h3 className="font-sans text-lg font-bold text-[#1F5E2E] leading-snug group-hover:text-[#2E7D32] transition-colors mb-2">
                      {isBangla ? post.titleBn : post.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {isBangla ? post.excerptBn : post.excerpt}
                    </p>
                  </div>
                  <span className="text-[#6BBF3A] font-sans font-black text-xs uppercase tracking-wider flex items-center gap-1 mt-auto">
                    {isBangla ? 'পড়ুন' : 'Read Article'}
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
