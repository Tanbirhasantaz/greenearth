/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

function BlogSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm animate-pulse flex flex-col h-full text-left">
      <div className="relative aspect-video bg-gray-200" />
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-1/3" />
          <div className="h-6 bg-gray-200 rounded-lg w-5/6" />
          <div className="space-y-2 pt-1">
            <div className="h-4 bg-gray-200 rounded-md w-full" />
            <div className="h-4 bg-gray-200 rounded-md w-5/6" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between mt-auto">
          <div className="h-4 bg-gray-200 rounded-md w-1/4" />
          <div className="h-4 bg-gray-200 rounded-md w-1/4" />
        </div>
      </div>
    </div>
  );
}

interface BlogProps {
  isBangla: boolean;
  onBlogClick: (post: BlogPost) => void;
}

export default function Blog({ isBangla, onBlogClick }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic fetch on mount
  useEffect(() => {
    fetch(`/api/blogs?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Server returned non-ok status');
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogsList(data);
        }
      })
      .catch((err) => console.log('Error loading blogs:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Articles', labelBn: 'সব লেখা' },
    { id: 'Ecology', label: 'Ecology & Climate', labelBn: 'পরিবেশ ও জলবায়ু' },
    { id: 'Energy', label: 'Renewable Energy', labelBn: 'নবায়নযোগ্য জ্বালানি' },
    { id: 'Waste', label: 'Waste Management', labelBn: 'বর্জ্য ব্যবস্থাপনা' }
  ];

  // Filter and search logic
  const filteredPosts = blogsList.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query) || post.titleBn.includes(query);
    const contentMatch = post.content.toLowerCase().includes(query) || post.contentBn.includes(query);
    const authorMatch = post.author.toLowerCase().includes(query) || post.authorBn.includes(query);
    
    return matchesCategory && (titleMatch || contentMatch || authorMatch);
  });

  return (
    <div className="flex flex-col w-full bg-[#FAFAF7] pt-24 pb-20" id="blog-view">
      {/* 1. HERO HEADER */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-b from-[#1F5E2E]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block">
            {isBangla ? 'সবুজ কলাম' : 'Eco-News & Insights'}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F5E2E]">
            {isBangla ? 'পরিবেশ বার্তা ও আমাদের নিবন্ধ' : 'Green Earth Blog & News'}
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isBangla
              ? 'জলবায়ু পরিবর্তনের প্রভাব, উপকূলীয় সংকট, নবায়নযোগ্য শক্তির অগ্রগতি এবং সাধারণ নাগরিকদের ভূমিকা সম্পর্কে প্রয়োজনীয় নিবন্ধসমূহ।'
              : 'Educational resources, scientific analyses, and updates on Bangladesh’s ecosystem directly from conservationists.'
            }
          </p>
          <div className="h-1 w-16 bg-[#6BBF3A] rounded-full mt-2" />
        </div>
      </section>

      {/* 2. BLOG LISTING GRID WITH SEARCH SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar / Left Column: Search & Filters (Desktop spans 4) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 text-left order-first lg:order-last" id="blog-sidebar">
          {/* Search Box */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-sans text-base font-extrabold text-[#1F5E2E] mb-4 uppercase tracking-wider">
              {isBangla ? 'অনুসন্ধান করুন' : 'Search Articles'}
            </h3>
            <div className="relative font-sans">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBangla ? 'লেখা, লেখক বা বিষয় খুঁজুন...' : 'Search posts, categories...'}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all"
                id="blog-search-input"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Categories list */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-sans text-base font-extrabold text-[#1F5E2E] mb-4 uppercase tracking-wider">
              {isBangla ? 'ক্যাটাগরি সমূহ' : 'Categories'}
            </h3>
            <div className="flex flex-col gap-1.5 font-sans font-semibold text-sm">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex justify-between items-center ${
                    selectedCategory === cat.id
                      ? 'bg-[#1F5E2E] text-white font-bold'
                      : 'text-gray-600 hover:bg-[#6BBF3A]/5 hover:text-[#1F5E2E]'
                  }`}
                >
                  <span>{isBangla ? cat.labelBn : cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Blog Listing (Desktop spans 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8 order-last lg:order-first" id="blog-listing">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onBlogClick(post)}
                  className="bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all flex flex-col h-full group cursor-pointer text-left"
                >
                  {/* Photo thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={isBangla ? post.titleBn : post.title}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#1F5E2E] shadow-sm">
                      {isBangla ? post.categoryBn : post.category}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 font-bold mb-2">
                        <Calendar size={12} className="text-[#6BBF3A]" />
                        <span>{isBangla ? post.dateBn : post.date}</span>
                        <span>•</span>
                        <User size={12} className="text-[#6BBF3A]" />
                        <span>{isBangla ? post.authorBn : post.author}</span>
                      </div>

                      <h3 className="font-sans text-lg font-extrabold text-[#1F5E2E] leading-snug group-hover:text-[#2E7D32] transition-colors mb-2">
                        {isBangla ? post.titleBn : post.title}
                      </h3>
                      <p className="font-sans text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {isBangla ? post.excerptBn : post.excerpt}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs mt-auto font-sans font-bold">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {isBangla ? post.readTimeBn : post.readTime}
                      </span>
                      <span className="text-[#6BBF3A] uppercase tracking-wider flex items-center gap-1">
                        {isBangla ? 'পড়ুন' : 'Read Post'}
                        <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/50 shadow-sm max-w-lg mx-auto" id="no-blogs-found">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-sans text-lg font-bold text-gray-600 mb-2">
                {isBangla ? 'কোন নিবন্ধ পাওয়া যায়নি' : 'No Articles Found'}
              </h3>
              <p className="font-sans text-sm text-gray-400 leading-relaxed mb-6">
                {isBangla
                  ? 'আপনার অনুসন্ধানের বিষয়ের সাথে মেলে এমন কোনো নিবন্ধ এই মুহূর্তে পাওয়া যায়নি। অন্য কিছু চেষ্টা করুন।'
                  : 'We could not find any matching articles for your search query. Try typing another environmental term.'
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-2.5 px-6 rounded-full text-xs cursor-pointer"
              >
                {isBangla ? 'সব লেখা দেখুন' : 'Reset Search'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
