'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Project, ProjectCategory } from '@/types';
import { MapPin, CheckCircle2, AlertCircle, X, ExternalLink, Sparkles } from 'lucide-react';

interface ProjectsClientSectionProps {
  projects: Project[];
  initialSlug?: string;
  initialCategory?: string;
}

export default function ProjectsClientSection({
  projects,
  initialSlug,
  initialCategory
}: ProjectsClientSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isBangla, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Set selected project based on initialSlug on mount or URL changes
  useEffect(() => {
    const slug = searchParams.get('slug') || initialSlug;
    if (slug) {
      const match = projects.find((p) => p.slug === slug);
      if (match) {
        setSelectedProject(match);
      }
    } else {
      setSelectedProject(null);
    }
  }, [searchParams, projects, initialSlug]);

  const categories = [
    { id: 'all', label: 'All Projects', labelBn: 'সকল প্রকল্প' },
    { id: 'tree_plantation', label: 'Tree Plantation', labelBn: 'বৃক্ষরোপণ' },
    { id: 'renewable_energy', label: 'Solar & Wind', labelBn: 'সৌর ও বায়ু বিদ্যুৎ' },
    { id: 'water_sanitation', label: 'Safe Water', labelBn: 'নিরাপদ পানি' },
    { id: 'waste_management', label: 'Waste Management', labelBn: 'বর্জ্য ব্যবস্থাপনা' }
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const openProjectDetail = (proj: Project) => {
    setSelectedProject(proj);
    // Update URL query parameters without full reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('slug', proj.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('slug');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              // Clear slug if changing category
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

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto">
          <AlertCircle size={44} className="mx-auto text-amber-500 mb-4" />
          <h3 className="font-sans font-extrabold text-xl text-neutral-800">
            {t('No Campaigns Found', 'কোনো প্রকল্প পাওয়া যায়নি')}
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            {t('Try searching for another category.', 'অনুগ্রহ করে অন্য কোনো ক্যাটাগরি নির্বাচন করুন।')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => openProjectDetail(proj)}
              className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="relative h-56 w-full bg-gray-100 shrink-0 overflow-hidden">
                <Image
                  src={proj.cover_image_url}
                  alt={proj.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-forest-green shadow-sm flex items-center gap-1 z-10">
                  <MapPin size={12} />
                  <span>{t(proj.location, proj.location_bn)}</span>
                </div>
                {/* Status tag */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${
                  proj.status === 'ongoing'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {t(proj.status, proj.status === 'ongoing' ? 'চলমান' : 'সম্পন্ন')}
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  {proj.category.replace('_', ' ')}
                </span>
                <h3 className="font-sans font-extrabold text-xl text-neutral-900 group-hover:text-forest-green leading-snug mb-3 transition-colors">
                  {t(proj.title, proj.title_bn)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {t(proj.description, proj.description_bn)}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-forest-green">
                    {t(proj.impact_summary, proj.impact_summary_bn)}
                  </div>
                  <span className="text-xs font-black text-neutral-800 group-hover:text-forest-green transition-colors flex items-center gap-1">
                    <span>{t('View Details', 'বিস্তারিত দেখুন')}</span>
                    <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 bg-neutral-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAFAF7] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-250">
            {/* Modal Header */}
            <div className="relative h-72 md:h-96 w-full shrink-0">
              <Image
                src={selectedProject.cover_image_url}
                alt={selectedProject.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={closeProjectDetail}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer z-10"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-leaf-green text-neutral-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {selectedProject.category.replace('_', ' ')}
                  </span>
                  <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <MapPin size={12} />
                    <span>{t(selectedProject.location, selectedProject.location_bn)}</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-4xl font-sans font-extrabold tracking-tight">
                  {t(selectedProject.title, selectedProject.title_bn)}
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-8 md:p-10 overflow-y-auto space-y-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Description & Details */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-sans font-extrabold text-xl text-neutral-900 border-b border-gray-200 pb-2">
                    {t('Project Overview', 'প্রকল্পের বিবরণ')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {t(selectedProject.description, selectedProject.description_bn)}
                  </p>
                </div>

                {/* Impact Highlight Card */}
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="font-mono text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">
                    {t('Active Impact', 'বাস্তব প্রভাব')}
                  </h4>
                  <div className="font-sans font-black text-lg text-emerald-950 leading-snug">
                    {t(selectedProject.impact_summary, selectedProject.impact_summary_bn)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase mt-4">
                    {t('Verified Field Record', 'মাঠ পর্যায় থেকে সরাসরি')}
                  </div>
                </div>
              </div>

              {/* Gallery Slider if images exist */}
              {selectedProject.gallery_image_urls && selectedProject.gallery_image_urls.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-sans font-extrabold text-lg text-neutral-900 border-b border-gray-200 pb-2">
                    {t('Field Gallery', 'মাঠ পর্যায়ের ছবিসমূহ')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedProject.gallery_image_urls.map((imgUrl, i) => (
                      <div key={i} className="relative h-32 md:h-40 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                        <Image
                          src={imgUrl}
                          alt={`Field photo ${i + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
