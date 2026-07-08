'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Project, BlogPost } from '@/types';
import { ArrowRight, TreePine, FlameKindling, Droplets, Users, Heart, Sparkles, MapPin } from 'lucide-react';

interface HomeClientSectionProps {
  projects: Project[];
  blogs: BlogPost[];
  stats: {
    planted_saplings: string;
    schools_powered: string;
    clean_water_users: string;
    active_volunteers: string;
  };
  settings?: Record<string, string>;
}

export default function HomeClientSection({ projects, blogs, stats, settings = {} }: HomeClientSectionProps) {
  const { isBangla, t } = useLanguage();

  const heroImage = settings.home_hero_image || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80";
  const heroTitle = isBangla
    ? (settings.home_hero_title_bn || 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ')
    : (settings.home_hero_title_en || 'Cleaner, Greener & Sustainable Future');
  const heroSubtitle = isBangla
    ? (settings.home_hero_subtitle_bn || 'উপকূলীয় বনায়ন, চরাঞ্চলে সৌর বিদ্যুৎ, নদী পরিচ্ছন্নতা এবং নিরাপদ পানীয় জলের প্ল্যান্ট স্থাপনের মাধ্যমে জলবায়ু সুরক্ষায় আমরা অঙ্গীকারবদ্ধ।')
    : (settings.home_hero_subtitle_en || 'Protecting the ecology of Bangladesh through tree plantation drives, rural solar grids, clean river campaigns, and arsenic water filtration solutions.');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div>
      {/* Hero Block */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-neutral-900 overflow-hidden py-16" id="home-hero">
        {/* Environmental Hero Image Canvas Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Bangladesh beautiful landscape"
            fill
            priority
            className="object-cover opacity-35 filter brightness-75 scale-105"
            sizes="100vw"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-neutral-900/60 to-neutral-900/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-transparent to-transparent z-10 hidden md:block" />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center md:text-left pt-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl flex flex-col items-center md:items-start"
          >
            {/* Tagline/Organization Identifier */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-6"
            >
              <Sparkles size={14} className="text-[#6BBF3A]" />
              <span>{t('GREEN EARTH BANGLADESH', 'গ্রিন আর্থ বাংলাদেশ')}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight mb-6"
            >
              {heroTitle}
            </motion.h1>

            {/* Secondary Paragraph */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-neutral-300 mb-10 leading-relaxed max-w-2xl"
            >
              {heroSubtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4"
            >
              <Link href="/get-involved">
                <div className="px-8 py-4 bg-[#6BBF3A] hover:bg-[#5aa131] text-neutral-900 font-sans font-bold text-base rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2">
                  <span>{t('Support Our Work', 'আমাদের সমর্থন করুন')}</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
              <Link href="/projects">
                <div className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans font-semibold text-base rounded-full transition-all cursor-pointer">
                  {t('View Projects', 'প্রকল্পসমূহ দেখুন')}
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Metric Floating Counter Grid */}
      <section className="relative z-30 -mt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl grid grid-cols-2 lg:grid-cols-4 p-8 md:p-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-gray-100">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <TreePine className="text-[#2E7D32] mb-3" size={32} />
              <span className="text-3xl md:text-4xl font-sans font-extrabold text-neutral-900 leading-none">
                {stats.planted_saplings}
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase mt-2.5">
                {t('Planted Saplings', 'রোপিত চারাগাছ')}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <FlameKindling className="text-amber-600 mb-3" size={32} />
              <span className="text-3xl md:text-4xl font-sans font-extrabold text-neutral-900 leading-none">
                {stats.schools_powered}
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase mt-2.5">
                {t('Schools Powered', 'বিদ্যুতায়িত স্কুল')}
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Droplets className="text-blue-600 mb-3" size={32} />
              <span className="text-3xl md:text-4xl font-sans font-extrabold text-neutral-900 leading-none">
                {stats.clean_water_users}
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase mt-2.5">
                {t('Water Recipients', 'বিশুদ্ধ পানি উপভোক্তা')}
              </span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Users className="text-[#6BBF3A] mb-3" size={32} />
              <span className="text-3xl md:text-4xl font-sans font-extrabold text-neutral-900 leading-none">
                {stats.active_volunteers}
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase mt-2.5">
                {t('Active Volunteers', 'সক্রিয় ভলান্টিয়ার')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects section */}
      <section className="py-24" id="featured-projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-mono font-black text-[#6B4226] uppercase tracking-widest block mb-2">
                {t('Our Initiatives', 'আমাদের কার্যক্রম')}
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-neutral-900">
                {t('Featured Ecological Campaigns', 'বিশিষ্ট পরিবেশগত প্রকল্পসমূহ')}
              </h2>
            </div>
            <Link href="/projects" className="mt-4 md:mt-0 flex items-center gap-2 group text-forest-green hover:text-leaf-green font-bold transition-colors">
              <span>{t('Browse All Projects', 'সবগুলো প্রকল্প দেখুন')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full bg-gray-100 shrink-0">
                  <Image
                    src={proj.cover_image_url}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#FAFAF7]/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-forest-green shadow-sm flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{t(proj.location, proj.location_bn)}</span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    {proj.category.replace('_', ' ')}
                  </span>
                  <h3 className="font-sans font-extrabold text-xl text-neutral-900 leading-snug mb-3">
                    {t(proj.title, proj.title_bn)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                    {t(proj.description, proj.description_bn)}
                  </p>
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs font-bold text-forest-green">
                      {t(proj.impact_summary, proj.impact_summary_bn)}
                    </div>
                    <Link href={`/projects?slug=${proj.slug}`}>
                      <div className="text-neutral-800 hover:text-forest-green text-sm font-black transition-colors cursor-pointer">
                        {t('Read More', 'বিস্তারিত')} →
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-24 bg-neutral-50/50 border-t border-gray-100" id="latest-blogs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest">
              {t('RESOURCES & ADVOCACY', 'নথি ও পরিবেশ সচেতনতা')}
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-neutral-900 mt-2">
              {t('Latest Insights & News', 'সর্বশেষ খবর ও নিবন্ধ')}
            </h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              {t(
                'Stay updated with technical deep-dives and field dispatches from our conservation campaigns.',
                'আমাদের মাঠ পর্যায়ের কাজের ছবি, বৈজ্ঞানিক তথ্য এবং জলবায়ু পরিবর্তন বিষয়ক নিয়মিত আপডেট জানুন।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full bg-gray-100 shrink-0">
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <span className="text-xs font-bold text-[#6B4226] uppercase tracking-wider block mb-2">
                    {t(blog.category, blog.category_bn)}
                  </span>
                  <h3 className="font-sans font-extrabold text-lg text-neutral-900 leading-snug mb-3 hover:text-forest-green transition-colors">
                    <Link href={`/blog?slug=${blog.slug}`}>
                      {t(blog.title, blog.title_bn)}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                    {t(blog.excerpt, blog.excerpt_bn)}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(blog.published_at).toLocaleDateString('en-GB')}</span>
                    <Link href={`/blog?slug=${blog.slug}`} className="font-bold text-forest-green hover:underline">
                      {t('Read Post', 'নিবন্ধটি পড়ুন')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
