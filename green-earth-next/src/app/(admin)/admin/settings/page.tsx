'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings, RefreshCw, CheckCircle2, AlertCircle, Save, Home, Info, Heart, Mail, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'core' | 'home' | 'about' | 'involved' | 'contact'>('core');
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states mapped by key
  const [formState, setFormState] = useState<Record<string, string>>({});

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('site_settings')
        .select('*');

      if (dbErr) throw dbErr;

      setSettings(data || []);
      
      // Initialize form values
      const initialForm: Record<string, string> = {};
      
      // Load standard keys with default fallbacks if they aren't in the database yet
      const standardKeys = [
        'stat_planted_saplings',
        'stat_schools_powered',
        'stat_clean_water_users',
        'stat_active_volunteers',
        'contact_phone',
        'contact_email',
        'contact_address',
        'facebook_url',
        'tagline_en',
        'tagline_bn',
        // Home
        'home_hero_title_en',
        'home_hero_title_bn',
        'home_hero_subtitle_en',
        'home_hero_subtitle_bn',
        'home_hero_image',
        // About
        'about_intro_en',
        'about_intro_bn',
        'about_vision_en',
        'about_vision_bn',
        // Get Involved
        'get_involved_intro_en',
        'get_involved_intro_bn',
        // Contact
        'contact_intro_en',
        'contact_intro_bn'
      ];

      standardKeys.forEach(k => {
        initialForm[k] = '';
      });

      data?.forEach((s) => {
        initialForm[s.key] = s.value;
      });

      // Set fallback values for empty ones
      const fallbacks: Record<string, string> = {
        'stat_planted_saplings': '25,000+',
        'stat_schools_powered': '15',
        'stat_clean_water_users': '8,000+',
        'stat_active_volunteers': '1,200+',
        'contact_phone': '+880 1712-345678',
        'contact_email': 'info@greenearth-bd.org',
        'contact_address': '42, Road 11, Banani, Dhaka-1213, Bangladesh.',
        'facebook_url': 'https://www.facebook.com/greenearthbd.25/',
        'tagline_en': 'Cleaner, Greener & Sustainable Future',
        'tagline_bn': 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ',
        'home_hero_title_en': 'Cleaner, Greener & Sustainable Future',
        'home_hero_title_bn': 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ',
        'home_hero_subtitle_en': 'Protecting the ecology of Bangladesh through tree plantation drives, rural solar grids, clean river campaigns, and arsenic water filtration solutions.',
        'home_hero_subtitle_bn': 'উপকূলীয় বনায়ন, চরাঞ্চলে সৌর বিদ্যুৎ, নদী পরিচ্ছন্নতা এবং নিরাপদ পানীয় জলের প্ল্যান্ট স্থাপনের মাধ্যমে জলবায়ু সুরক্ষায় আমরা অঙ্গীকারবদ্ধ।',
        'home_hero_image': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80',
        'about_intro_en': 'Leading community-centric ecological restoration, tree plantations, and water purity across Bangladesh since 2025.',
        'about_intro_bn': '২০২৫ সাল থেকে বাংলাদেশে পরিবেশগত ভারসাম্য রক্ষা, সামাজিক বনায়ন এবং বিশুদ্ধ পানি নিশ্চিতকরণ প্রকল্পে কাজ করছে গ্রিন আর্থ।',
        'about_vision_en': 'Bangladesh is uniquely vulnerable to climate change. Rising sea levels threaten coastal areas, cyclones recur with greater fury, and river char communities remain severely isolated. Green Earth was founded to deliver tangible, scientific, and community-owned solutions on the ground.',
        'about_vision_bn': 'বাংলাদেশ জলবায়ু পরিবর্তনের কারণে বিশেষভাবে ঝুঁকিপূর্ণ। সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি উপকূলীয় অঞ্চলকে হুমকির মুখে ফেলছে, ঘূর্ণিঝড় তীব্র থেকে তীব্রতর হচ্ছে এবং চরাঞ্চল বিদ্যুৎ বিচ্ছিন্ন থাকছে। গ্রিন আর্থ এই কঠিন পরিস্থিতিতে মাঠ পর্যায়ে টেকসই বৈজ্ঞানিক ও জনবান্ধব সমাধান প্রদানের লক্ষ্যে প্রতিষ্ঠিত হয়েছিল।',
        'get_involved_intro_en': 'Whether you donate funds to plant saplings or dedicate your time in the field, your contribution drives active environmental survival.',
        'get_involved_intro_bn': 'চারাগাছ রোপণের জন্য তহবিল প্রদান হোক বা সরাসরি মাঠে এসে কাজ করা—আপনার অবদান আমাদের পরিবেশ রক্ষায় গুরুত্বপূর্ণ ভূমিকা রাখবে।',
        'contact_intro_en': 'Have questions about our operations, want to suggest a cleanup drive, or coordinate a CSR campaign? Write to us directly.',
        'contact_intro_bn': 'আমাদের কার্যক্রম সম্পর্কে কোনো প্রশ্ন থাকলে, কোনো এলাকা পরিচ্ছন্নতার জন্য পরামর্শ দিতে চাইলে কিংবা স্পনসরশিপের জন্য সরাসরি আমাদের লিখুন।'
      };

      Object.keys(initialForm).forEach(k => {
        if (!initialForm[k]) {
          initialForm[k] = fallbacks[k] || '';
        }
      });

      setFormState(initialForm);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch site settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (key: string, val: string) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setError('');

    try {
      const supabase = createClient();

      // Upsert/Update settings in batch
      const promises = Object.entries(formState).map(([key, value]) => {
        return supabase
          .from('site_settings')
          .upsert({ key, value, description: `Dynamic key ${key} from admin panel` }, { onConflict: 'key' });
      });

      const results = await Promise.all(promises);
      const failed = results.find((r) => r.error);
      if (failed) throw failed.error;

      setSuccessMsg('All site parameters and dynamic layout texts saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while saving configuration variables.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Settings size={32} className="text-forest-green" />
            <span>Unified Page Content & Settings</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit text headers, layout paragraphs, hero banners, and statistics dynamically across all public pages.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold shadow-sm">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold shadow-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Segment Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto pb-px gap-2">
        <button
          onClick={() => setActiveTab('core')}
          className={`flex items-center gap-2 px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'core'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Shield size={14} />
          <span>Core Stats & Contacts</span>
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={14} />
          <span>Home Page</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Info size={14} />
          <span>About Page</span>
        </button>
        <button
          onClick={() => setActiveTab('involved')}
          className={`flex items-center gap-2 px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'involved'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart size={14} />
          <span>Get Involved</span>
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Mail size={14} />
          <span>Contact Page</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <RefreshCw className="animate-spin" size={16} />
          <span>Loading dynamic key values...</span>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* TAB 1: CORE STATS & CONTACT COORDS */}
          {activeTab === 'core' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-sans font-extrabold text-neutral-950 border-b border-gray-100 pb-3">
                  Home Page Impact Metrics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Planted Saplings Stat
                    </label>
                    <input
                      type="text"
                      value={formState['stat_planted_saplings'] || ''}
                      onChange={(e) => handleInputChange('stat_planted_saplings', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Solar Schools Powered Stat
                    </label>
                    <input
                      type="text"
                      value={formState['stat_schools_powered'] || ''}
                      onChange={(e) => handleInputChange('stat_schools_powered', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Clean Water Users Stat
                    </label>
                    <input
                      type="text"
                      value={formState['stat_clean_water_users'] || ''}
                      onChange={(e) => handleInputChange('stat_clean_water_users', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Active Volunteers Stat
                    </label>
                    <input
                      type="text"
                      value={formState['stat_active_volunteers'] || ''}
                      onChange={(e) => handleInputChange('stat_active_volunteers', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-sans font-extrabold text-neutral-950 border-b border-gray-100 pb-3">
                  Official Contact Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Official Phone
                    </label>
                    <input
                      type="text"
                      value={formState['contact_phone'] || ''}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={formState['contact_email'] || ''}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={formState['facebook_url'] || ''}
                      onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Banani Office Address Description
                  </label>
                  <textarea
                    rows={2}
                    value={formState['contact_address'] || ''}
                    onChange={(e) => handleInputChange('contact_address', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOME PAGE HERO & BANNER */}
          {activeTab === 'home' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-sans font-extrabold text-neutral-950 border-b border-gray-100 pb-3">
                Home Page Hero & Visuals
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Hero Main Headline (English)
                  </label>
                  <input
                    type="text"
                    value={formState['home_hero_title_en'] || ''}
                    onChange={(e) => handleInputChange('home_hero_title_en', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Hero Main Headline (Bangla / বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formState['home_hero_title_bn'] || ''}
                    onChange={(e) => handleInputChange('home_hero_title_bn', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Hero Subtitle Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={formState['home_hero_subtitle_en'] || ''}
                    onChange={(e) => handleInputChange('home_hero_subtitle_en', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Hero Subtitle Description (Bangla / বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    value={formState['home_hero_subtitle_bn'] || ''}
                    onChange={(e) => handleInputChange('home_hero_subtitle_bn', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Hero Cover Image URL
                </label>
                <input
                  type="url"
                  value={formState['home_hero_image'] || ''}
                  onChange={(e) => handleInputChange('home_hero_image', e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT PAGE CONTENT */}
          {activeTab === 'about' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-sans font-extrabold text-neutral-950 border-b border-gray-100 pb-3">
                About Us Editorial Section
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Organization Intro Slogan (English)
                  </label>
                  <input
                    type="text"
                    value={formState['about_intro_en'] || ''}
                    onChange={(e) => handleInputChange('about_intro_en', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Organization Intro Slogan (Bangla / বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formState['about_intro_bn'] || ''}
                    onChange={(e) => handleInputChange('about_intro_bn', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Our Vision paragraph (English)
                  </label>
                  <textarea
                    rows={5}
                    value={formState['about_vision_en'] || ''}
                    onChange={(e) => handleInputChange('about_vision_en', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Our Vision paragraph (Bangla / বাংলা)
                  </label>
                  <textarea
                    rows={5}
                    value={formState['about_vision_bn'] || ''}
                    onChange={(e) => handleInputChange('about_vision_bn', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GET INVOLVED PAGE CONTENT */}
          {activeTab === 'involved' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-sans font-extrabold text-neutral-950 border-b border-gray-100 pb-3">
                Get Involved Intro Messages
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Campaign Invitation Slogan (English)
                  </label>
                  <textarea
                    rows={4}
                    value={formState['get_involved_intro_en'] || ''}
                    onChange={(e) => handleInputChange('get_involved_intro_en', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Campaign Invitation Slogan (Bangla / বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={formState['get_involved_intro_bn'] || ''}
                    onChange={(e) => handleInputChange('get_involved_intro_bn', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT PAGE CONTENT */}
          {activeTab === 'contact' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-sans font-extrabold text-neutral-950 border-b border-gray-100 pb-3">
                Contact Form Intro Messages
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Contact Description (English)
                  </label>
                  <textarea
                    rows={4}
                    value={formState['contact_intro_en'] || ''}
                    onChange={(e) => handleInputChange('contact_intro_en', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Contact Description (Bangla / বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={formState['contact_intro_bn'] || ''}
                    onChange={(e) => handleInputChange('contact_intro_bn', e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-forest-green hover:bg-deep-forest text-white rounded-full font-bold text-sm tracking-wide shadow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
              <span>{saving ? 'Saving Changes...' : 'Save Configuration Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
