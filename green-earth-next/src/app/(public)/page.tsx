import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PROJECTS, FALLBACK_BLOGS, FALLBACK_STATS } from '@/lib/fallbacks';
import { ArrowRight, TreePine, FlameKindling, Droplets, Trash2, Heart, Award, ArrowUpRight } from 'lucide-react';
import HomeClientSection from './HomeClientSection'; // To handle client-side animation and state triggers smoothly

export const revalidate = 3600; // Cache for 1 hour

async function getHomeData() {
  const supabase = createClient();
  
  let projects = FALLBACK_PROJECTS;
  let blogs = FALLBACK_BLOGS;
  let stats = FALLBACK_STATS;
  let settings: Record<string, string> = {};

  try {
    // Fetch active projects
    const { data: dbProjects } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (dbProjects && dbProjects.length > 0) {
      projects = dbProjects as any;
    }

    // Fetch latest blogs
    const { data: dbBlogs } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(3);

    if (dbBlogs && dbBlogs.length > 0) {
      blogs = dbBlogs as any;
    }

    // Fetch ALL site settings
    const { data: dbSettings } = await supabase
      .from('site_settings')
      .select('key, value');

    if (dbSettings && dbSettings.length > 0) {
      const statsMap: any = {};
      dbSettings.forEach(s => {
        settings[s.key] = s.value;
        if (s.key.startsWith('stat_')) {
          const cleanKey = s.key.replace('stat_', '');
          statsMap[cleanKey] = s.value;
        }
      });
      stats = { ...FALLBACK_STATS, ...statsMap };
    }
  } catch (error) {
    console.warn('Database fetch failed during server-render. Falling back to local seed values safely.', error);
  }

  return { projects, blogs, stats, settings };
}

export default async function HomePage() {
  const { projects, blogs, stats, settings } = await getHomeData();

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION (Dynamic Language toggle supported via HomeClientSection) */}
      <HomeClientSection projects={projects} blogs={blogs} stats={stats} settings={settings} />

      {/* 2. THEMATIC AREAS (Our Mission across Bangladesh) */}
      <section className="py-20 bg-white border-y border-gray-100" id="thematic-areas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block">
              Core Pillars
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-neutral-900 mt-4">
              Restoring ecosystems, empowering people
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              We focus on localized, high-impact environmental projects that empower grassroots communities in Bangladesh to actively fight climate degradation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1: Mangrove & Tree Plantation */}
            <div className="bg-[#FAFAF7] border border-gray-200/60 rounded-3xl p-8 hover:border-leaf-green hover:shadow-xl transition-all group duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TreePine size={28} />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-neutral-900 mb-3">
                Tree Plantation
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Reforesting vulnerable coastlines of Satkhira and Sundarbans to resist cyclones and prevent coastal soil erosion.
              </p>
            </div>

            {/* Pillar 2: Renewable Energy */}
            <div className="bg-[#FAFAF7] border border-gray-200/60 rounded-3xl p-8 hover:border-leaf-green hover:shadow-xl transition-all group duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FlameKindling size={28} />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-neutral-900 mb-3">
                Solar Electrification
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Installing reliable solar micro-grids in off-grid riverine char schools and community clinics.
              </p>
            </div>

            {/* Pillar 3: Water Conservation */}
            <div className="bg-[#FAFAF7] border border-gray-200/60 rounded-3xl p-8 hover:border-leaf-green hover:shadow-xl transition-all group duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Droplets size={28} />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-neutral-900 mb-3">
                Water & Sanitation
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mitigating groundwater arsenic contamination in Chandpur and providing deep-well filtration structures.
              </p>
            </div>

            {/* Pillar 4: Waste Management */}
            <div className="bg-[#FAFAF7] border border-gray-200/60 rounded-3xl p-8 hover:border-leaf-green hover:shadow-xl transition-all group group duration-300">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Trash2 size={28} />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-neutral-900 mb-3">
                Waste Recycling
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Organizing systematic plastic collection drives to extract polythene from the Buriganga river and urban canals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VOLUNTEER CTA BANNER */}
      <section className="bg-gradient-to-br from-forest-green to-deep-forest text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Award size={48} className="mx-auto mb-6 text-leaf-green animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight">
            Want to lead change in your local neighborhood?
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mt-4 leading-relaxed">
            Become a certified environmental protector with Green Earth. Join over 1,200 active volunteers across Bangladesh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/get-involved">
              <div className="px-8 py-3.5 bg-[#6BBF3A] hover:bg-[#5aa131] text-neutral-900 font-sans font-bold rounded-full shadow hover:shadow-lg transition-all cursor-pointer flex items-center gap-2">
                <span>Sign Up as a Volunteer</span>
                <ArrowRight size={16} />
              </div>
            </Link>
            <Link href="/contact">
              <div className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-sans font-semibold rounded-full transition-all cursor-pointer">
                Contact Our Officers
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
