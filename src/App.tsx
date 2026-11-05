/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ArrowUp } from 'lucide-react';

// Reusable Global Components
import Header from './components/Header';
import Footer from './components/Footer';

// Reusable Modals
import SuccessModal from './components/SuccessModal';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import BlogDetailsModal from './components/BlogDetailsModal';
import LightboxModal from './components/LightboxModal';
import AnnouncementPopup from './components/AnnouncementPopup';

// Views
import Home from './views/Home';
import About from './views/About';
import Projects from './views/Projects';
import Involved from './views/Involved';
import Blog from './views/Blog';
import Gallery from './views/Gallery';
import Contact from './views/Contact';
import Admin from './views/Admin';

// Types & Data
import { Page, Project, BlogPost, GalleryItem } from './types';

export default function App() {
  // Helper to resolve hash router location
  const getPageFromHash = (hash: string): Page => {
    const p = hash.replace(/^#\/?/, '') as Page;
    const validPages: Page[] = ['home', 'about', 'projects', 'involved', 'blog', 'gallery', 'contact', 'admin'];
    if (validPages.includes(p)) {
      return p;
    }
    return 'home';
  };

  // Page states initialized directly from URL hash
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      return getPageFromHash(window.location.hash);
    }
    return 'home';
  });
  const [isBangla, setIsBangla] = useState(false);
  const [settings, setSettings] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ge_db_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return null;
  });

  // Sync hash routing on window backward/forward navigations
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash(window.location.hash);
      setCurrentPage(page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state transitions to browser URL hash, page titles, and dynamic SEO Meta tags
  useEffect(() => {
    // 1. Sync URL hash
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (currentHash !== currentPage) {
      window.location.hash = `#/${currentPage}`;
    }

    // 2. Sync Dynamic Document Tab Title
    const siteName = isBangla 
      ? (settings?.orgNameBn || 'গ্রিন আর্থ') 
      : (settings?.orgName || 'Green Earth');

    const pageNamesEn: Record<Page, string> = {
      home: 'Home',
      about: 'About Us',
      projects: 'Projects',
      involved: 'Get Involved',
      blog: 'Blog & News',
      gallery: 'Gallery',
      contact: 'Contact Us',
      admin: 'Admin Panel',
    };

    const pageNamesBn: Record<Page, string> = {
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      projects: 'প্রকল্পসমূহ',
      involved: 'অংশ নিন',
      blog: 'ব্লগ ও খবর',
      gallery: 'গ্যালারি',
      contact: 'যোগাযোগ',
      admin: 'অ্যাডমিন প্যানেল',
    };

    const pageTitle = isBangla ? pageNamesBn[currentPage] : pageNamesEn[currentPage];
    const fullTitle = `${siteName} | ${pageTitle}`;
    document.title = fullTitle;

    // 3. Dynamic Meta Descriptions & Social Open Graph Tags for complete SEO
    const pageDescEn: Record<Page, string> = {
      home: 'Green Earth is a grassroots non-profit environmental organization in Bangladesh driving sustainable coastal reforestation, solar micro-grid installations, and safe water plants.',
      about: 'Learn about Green Earth\'s mission, our core values of sustainability and radical transparency, our timeline milestones, and our dedicated team.',
      projects: 'Explore our featured impact projects, including the Sundarbans Mangrove Reforestation, off-grid Solar Electrification, and Safe Drinking Water Solutions.',
      involved: 'Join our green mission. Register as a volunteer, apply for lifetime membership, or make a tax-deductible contribution to accelerate climate action in Bangladesh.',
      blog: 'Read the latest environmental articles, news updates, and scientific insights on ecology, renewable energy, and waste management from Green Earth experts.',
      gallery: 'Browse photos from our field operations, community tree nurseries, solar panel installations, and active river cleanups across Bangladesh.',
      contact: 'Get in touch with Green Earth. Reach out for corporate sponsorship opportunities, partnerships, volunteering queries, or support.',
      admin: 'Green Earth internal administrative panel.',
    };

    const pageDescBn: Record<Page, string> = {
      home: 'গ্রিন আর্থ হলো বাংলাদেশে জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবিলা ও পরিবেশ সংরক্ষণে নিয়োজিত একটি সামাজিক সংস্থা। আমাদের ম্যানগ্রোভ বনায়ন, সৌর বিদ্যুৎ ও নিরাপদ বিশুদ্ধ পানি প্রকল্প সম্পর্কে জানুন।',
      about: 'গ্রিন আর্থের লক্ষ্য, স্থায়িত্ব ও স্বচ্ছতার মূল নীতিসমূহ, আমাদের অর্জিত মাইলফলক এবং ডেডিকেটেড টিম সদস্যদের সম্পর্কে বিস্তারিত জানুন।',
      projects: 'সুন্দরবন উপকূলীয় ম্যানগ্রোভ বনায়ন, অফ-গ্রিড বিদ্যালয়ে সৌর বিদ্যুতায়ন এবং চাঁদপুর জেলায় নিরাপদ বিশুদ্ধ পানি সরবরাহসহ আমাদের সব প্রকল্পের প্রভাব সম্পর্কে জানুন।',
      involved: 'জলবায়ু মোকাবিলায় অংশ নিন। স্বেচ্ছাসেবক হিসেবে নিবন্ধন করুন, আজীবন সদস্যপদের আবেদন করুন অথবা আমাদের পরিবেশবান্ধব উদ্যোগে অবদান রাখুন।',
      blog: 'পরিবেশবিদ্যা, নবায়নযোগ্য জ্বালানি ও বর্জ্য ব্যবস্থাপনা নিয়ে গ্রিন আর্থ-এর বিশেষজ্ঞদের সাম্প্রতিক নিবন্ধ ও খবর পড়ুন।',
      gallery: 'আমাদের উপকূলীয় বৃক্ষরোপণ, সৌর প্যানেল ইনস্টলেশন ও বুড়িগঙ্গা নদী পরিচ্ছন্নতা অভিযানসহ মাঠপর্যায়ের কার্যক্রমের ছবি দেখুন।',
      contact: 'আমাদের সাথে যোগাযোগ করুন। কর্পোরেট স্পন্সরশিপ, পরিবেশবান্ধব পার্টনারশিপ বা কোনো জিজ্ঞাসার জন্য মেসেজ পাঠান।',
      admin: 'গ্রিন আর্থ অ্যাডমিন প্যানেল।',
    };

    const currentDesc = isBangla ? pageDescBn[currentPage] : pageDescEn[currentPage];

    // Helper function to update/create meta tags dynamically
    const updateMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentVal);
    };

    // Update primary tags
    updateMetaTag('name', 'description', currentDesc);
    updateMetaTag('name', 'title', fullTitle);

    // Update Open Graph tags for Facebook / LinkedIn / Slack
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', currentDesc);
    updateMetaTag('property', 'og:url', window.location.href);

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', currentDesc);

    // Update canonical link
    let canonical = document.getElementById('canonical-link') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.id = 'canonical-link';
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [currentPage, isBangla, settings]);

  // Modal active states
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Success Modal states
  const [successOpen, setSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [successFbLink, setSuccessFbLink] = useState<string | undefined>(undefined);

  // Floating back-to-top trigger state
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch settings dynamically
  const fetchSettings = () => {
    fetch('/api/settings')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load settings');
      })
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => console.log('Using default settings:', err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Monitor scroll height for back-to-top trigger
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback triggers for child form completions
  const handleSuccessTrigger = (title: string, message: string, fbLink?: string) => {
    setSuccessTitle(title);
    setSuccessMsg(message);
    setSuccessFbLink(fbLink);
    setSuccessOpen(true);
  };

  // Helper trigger to handle "Donate Now" headers
  const handleDonateTrigger = () => {
    setCurrentPage('involved');
    // Give a short delay to let react render, then scroll to the donation block
    setTimeout(() => {
      const panel = document.getElementById('donation-panel-container');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }, 100);
  };

  // Render active view under Orchestration
  const renderActiveView = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={setCurrentPage}
            isBangla={isBangla}
            onProjectClick={setActiveProject}
            onBlogClick={setActiveBlog}
            onDonateClick={handleDonateTrigger}
            settings={settings}
          />
        );
      case 'about':
        return <About isBangla={isBangla} settings={settings} />;
      case 'projects':
        return <Projects isBangla={isBangla} onProjectClick={setActiveProject} />;
      case 'involved':
        return <Involved isBangla={isBangla} onFormSuccess={handleSuccessTrigger} settings={settings} />;
      case 'blog':
        return <Blog isBangla={isBangla} onBlogClick={setActiveBlog} />;
      case 'gallery':
        return (
          <Gallery
            isBangla={isBangla}
            onImageClick={(items, idx) => {
              setLightboxItems(items);
              setLightboxIndex(idx);
            }}
          />
        );
      case 'contact':
        return <Contact isBangla={isBangla} onFormSuccess={handleSuccessTrigger} settings={settings} />;
      case 'admin':
        return <Admin isBangla={isBangla} settings={settings} onSettingsSaved={fetchSettings} />;
      default:
        return (
          <Home
            setCurrentPage={setCurrentPage}
            isBangla={isBangla}
            onProjectClick={setActiveProject}
            onBlogClick={setActiveBlog}
            onDonateClick={handleDonateTrigger}
            settings={settings}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-gray-800" id="green-earth-app">
      
      {/* 1. Header (Common across all views) */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isBangla={isBangla}
        setIsBangla={setIsBangla}
        onDonateClick={handleDonateTrigger}
        settings={settings}
      />

      {/* 2. Main Page Container with smooth Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            id="page-transition-wrapper"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer (Common across all views) */}
      <Footer
        setCurrentPage={setCurrentPage}
        isBangla={isBangla}
        onSubscribeSuccess={handleSuccessTrigger}
        settings={settings}
      />

      {/* --- FLOATING CONTROLS --- */}

      {/* Floating Back to Top Button (Leaf-shaped green node) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackToTop}
            className="fixed bottom-6 right-6 z-30 p-4 bg-[#1F5E2E] hover:bg-[#6BBF3A] text-white shadow-xl rounded-br-none rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl transition-all cursor-pointer border border-[#6BBF3A]/20 flex items-center justify-center"
            title="Back to Top / ওপরে যান"
            aria-label="Back to top"
            id="back-to-top-floating-btn"
          >
            {/* Custom organic leaf-shaped icon paired with arrow */}
            <div className="relative">
              <Leaf size={18} fill="currentColor" className="opacity-30 absolute -top-1 -left-1" />
              <ArrowUp size={16} className="relative z-10 stroke-[3]" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- SYSTEM MODALS --- */}

      {/* Success Banner popup */}
      <SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          setSuccessFbLink(undefined);
        }}
        title={successTitle}
        message={successMsg}
        isBangla={isBangla}
        facebookLink={successFbLink}
      />

      {/* Project detailed metadata modal */}
      <ProjectDetailsModal
        key={activeProject?.id || 'empty'}
        isOpen={activeProject !== null}
        onClose={() => setActiveProject(null)}
        project={activeProject}
        isBangla={isBangla}
        onSupportClick={handleDonateTrigger}
        onImageClick={(items, idx) => {
          setLightboxItems(items);
          setLightboxIndex(idx);
        }}
      />

      {/* Blog reading modal */}
      <BlogDetailsModal
        isOpen={activeBlog !== null}
        onClose={() => setActiveBlog(null)}
        post={activeBlog}
        isBangla={isBangla}
        onImageClick={(items, idx) => {
          setLightboxItems(items);
          setLightboxIndex(idx);
        }}
      />

      {/* Photo lightbox popup */}
      <LightboxModal
        isOpen={lightboxIndex !== -1}
        onClose={() => {
          setLightboxIndex(-1);
          setLightboxItems([]);
        }}
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        isBangla={isBangla}
      />

      {/* Dynamic Pop-Up notice/announcement of upcoming events */}
      <AnnouncementPopup
        settings={settings}
        isBangla={isBangla}
      />
    </div>
  );
}
