import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_GALLERY } from '@/lib/fallbacks';
import GalleryClientSection from './GalleryClientSection';

export const revalidate = 600;

async function getGalleryItems() {
  const supabase = createClient();
  let items = FALLBACK_GALLERY;

  try {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      items = data as any;
    }
  } catch (error) {
    console.warn('Database fetch for gallery items failed, using fallbacks.', error);
  }

  return items;
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="py-12 md:py-16">
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#EBF5EC] to-[#FAFAF7] border-b border-gray-200/50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            Conservation Lens
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-900">
            Green Earth Media Gallery
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Photographic dispatches capturing coastal planting days, solar array assemblies, pure well pumps, and active community workshops.
          </p>
        </div>
      </section>

      {/* Interactive Bento Grid and Fullscreen Lightbox */}
      <GalleryClientSection items={items} />
    </div>
  );
}
