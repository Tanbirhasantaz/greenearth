'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { BlogPost } from '@/types';
import { Calendar, User, X, AlertCircle, Sparkles } from 'lucide-react';

interface BlogClientSectionProps {
  blogs: BlogPost[];
  initialSlug?: string;
  initialCategory?: string;
}

export default function BlogClientSection({
  blogs,
  initialSlug,
  initialCategory
}: BlogClientSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isBangla, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Parse query parameters to open specific post in modal overlay
  useEffect(() => {
    const slug = searchParams.get('slug') || initialSlug;
    if (slug) {
      const match = blogs.find((b) => b.slug === slug);
      if (match) {
        setSelectedPost(match);
      }
    } else {
      setSelectedPost(null);
    }
  }, [searchParams, blogs, initialSlug]);

  const categories = [
    { id: 'all', label: 'All Articles', labelBn: 'সকল নিবন্ধ' },
    { id: 'Ecology', label: 'Ecology', labelBn: 'পরিবেশবিদ্যা' },
    { id: 'Energy', label: 'Energy', labelBn: 'জ্বালানি' },
    { id: 'Waste Management', label: 'Waste Management', labelBn: 'বর্জ্য ব্যবস্থাপনা' }
  ];

  const filteredBlogs = activeCategory === 'all'
    ? blogs
    : blogs.filter((b) => b.category === activeCategory);

  const openPostDetail = (post: BlogPost) => {
    setSelectedPost(post);
    const params = new URLSearchParams(searchParams.toString());
    params.set('slug', post.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('slug');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Categories Switch Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              const params = new URLSearchParams();
              if (cat.id !== 'all') params.set('category', cat.id);
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-forest-green border-forest-green text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-600 hover:border-leaf-green hover:text-forest-green'
            }`}
          >
            {isBangla ? cat.labelBn : cat.label}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto">
          <AlertCircle size={44} className="mx-auto text-amber-500 mb-4" />
          <h3 className="font-sans font-extrabold text-xl text-neutral-800">
            {t('No Articles Found', 'কোনো নিবন্ধ পাওয়া যায়নি')}
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            {t('Select another category tab to view posts.', 'অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বেছে নিয়ে দেখুন।')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              onClick={() => openPostDetail(post)}
              className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="relative h-52 w-full bg-gray-100 shrink-0 overflow-hidden">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <span className="text-xs font-bold text-[#6B4226] uppercase tracking-wider block mb-2">
                  {t(post.category, post.category_bn)}
                </span>
                <h3 className="font-sans font-extrabold text-xl text-neutral-900 group-hover:text-forest-green leading-snug mb-3 transition-colors">
                  {t(post.title, post.title_bn)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {t(post.excerpt, post.excerpt_bn)}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  <span className="font-bold text-forest-green group-hover:underline">
                    {t('Read Post', 'সম্পূর্ণ পড়ুন')} →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Full Reader Overlay Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-neutral-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAFAF7] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-250">
            {/* Cover image banner */}
            <div className="relative h-64 md:h-80 w-full shrink-0">
              <Image
                src={selectedPost.cover_image_url}
                alt={selectedPost.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={closePostDetail}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer z-10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#6BBF3A] text-neutral-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-3">
                  {t(selectedPost.category, selectedPost.category_bn)}
                </span>
                <h2 className="text-xl md:text-3xl font-sans font-extrabold tracking-tight leading-tight">
                  {t(selectedPost.title, selectedPost.title_bn)}
                </h2>
              </div>
            </div>

            {/* Scrolling Body */}
            <div className="p-8 md:p-10 overflow-y-auto space-y-6 flex-1">
              <div className="flex items-center gap-6 text-xs text-gray-400 border-b border-gray-100 pb-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#6BBF3A]" />
                  <span>{t('Published on: ', 'প্রকাশিত: ')} {new Date(selectedPost.published_at || selectedPost.created_at).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-[#6BBF3A]" />
                  <span>{t('By: Green Earth Officers', 'দ্বারা: গ্রিন আর্থ কর্মকর্তা')}</span>
                </div>
              </div>

              {/* Rich Content Area */}
              <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-line">
                {t(selectedPost.content, selectedPost.content_bn)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
