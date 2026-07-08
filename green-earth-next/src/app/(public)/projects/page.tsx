import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PROJECTS } from '@/lib/fallbacks';
import ProjectsClientSection from './ProjectsClientSection';

export const revalidate = 600; // Cache for 10 minutes

async function getProjects() {
  const supabase = createClient();
  let projects = FALLBACK_PROJECTS;

  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      projects = data as any;
    }
  } catch (error) {
    console.warn('Database fetch for projects failed, using fallback arrays.', error);
  }

  return projects;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { slug?: string; category?: string };
}) {
  const projects = await getProjects();

  return (
    <div className="py-12 md:py-16">
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#EBF5EC] to-[#FAFAF7] border-b border-gray-200/50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            Our Work in the Field
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-900">
            Green Earth Projects
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Explore our continuous ecological, water safety, recycling, and solar installations preserving Bangladesh''s natural landscapes.
          </p>
        </div>
      </section>

      {/* Interactive Catalog and Detail Modal */}
      <ProjectsClientSection projects={projects} initialSlug={searchParams.slug} initialCategory={searchParams.category} />
    </div>
  );
}
