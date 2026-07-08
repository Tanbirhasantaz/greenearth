import React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_TEAM } from '@/lib/fallbacks';
import AboutClientSection from './AboutClientSection';

export const revalidate = 3600;

async function getAboutData() {
  const supabase = createClient();
  let team = FALLBACK_TEAM;
  let settings: Record<string, string> = {};

  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data && data.length > 0) {
      team = data as any;
    }

    const { data: dbSettings } = await supabase
      .from('site_settings')
      .select('key, value');

    if (dbSettings) {
      dbSettings.forEach(s => {
        settings[s.key] = s.value;
      });
    }
  } catch (error) {
    console.warn('Database fetch for about page failed, using fallback.', error);
  }

  return { team, settings };
}

export default async function AboutPage() {
  const { team, settings } = await getAboutData();

  return (
    <div className="py-12 md:py-16">
      {/* Main Core Values, Mission, Header and Leadership Grid */}
      <AboutClientSection team={team} settings={settings} />
    </div>
  );
}
