import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_BLOGS } from '@/lib/fallbacks';
import BlogClientSection from './BlogClientSection';

export const revalidate = 600; // Cache for 10 minutes

async function getBlogs() {
  const supabase = createClient();
  let blogs = FALLBACK_BLOGS;

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (data && data.length > 0) {
      blogs = data as any;
    }
  } catch (error) {
    console.warn('Database fetch for blog posts failed, using fallback arrays.', error);
  }

  return blogs;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { slug?: string; category?: string };
}) {
  const blogs = await getBlogs();

  return (
    <div className="py-12 md:py-16">
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#EBF5EC] to-[#FAFAF7] border-b border-gray-200/50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            Ecology & Field Updates
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-900">
            Green Earth Blog & News
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Read our scientific reviews, field reflections, household eco-guides, and periodic dispatches from our conservation fronts in Bangladesh.
          </p>
        </div>
      </section>

      {/* Interactive Blog List & Details overlay */}
      <BlogClientSection blogs={blogs} initialSlug={searchParams.slug} initialCategory={searchParams.category} />
    </div>
  );
}
