'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Heart } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { isBangla, setIsBangla, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor page scrolling to add background blur/shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: '/', label: 'Home', labelBn: 'হোম' },
    { id: '/about', label: 'About Us', labelBn: 'আমাদের সম্পর্কে' },
    { id: '/projects', label: 'Projects', labelBn: 'প্রকল্পসমূহ' },
    { id: '/get-involved', label: 'Get Involved', labelBn: 'অংশ নিন' },
    { id: '/blog', label: 'Blog & News', labelBn: 'ব্লগ ও খবর' },
    { id: '/gallery', label: 'Gallery', labelBn: 'গ্যালারি' },
    { id: '/contact', label: 'Contact', labelBn: 'যোগাযোগ' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled || pathname !== '/'
          ? 'bg-[#FAFAF7]/95 backdrop-blur-md shadow-md py-2 border-b border-gray-200'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="focus:outline-none">
          <Logo size="sm" showWordmark={true} />
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.id);
            return (
              <Link
                key={link.id}
                href={link.id}
                className={`px-3 py-2 rounded-full text-sm font-sans font-semibold tracking-wide transition-all relative ${
                  active
                    ? 'text-[#1F5E2E]'
                    : 'text-gray-600 hover:text-[#1F5E2E] hover:bg-[#6BBF3A]/5'
                }`}
              >
                <span>{isBangla ? link.labelBn : link.label}</span>
                {active && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-[#6BBF3A]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Translation Toggle & Donate Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Selector */}
          <button
            onClick={() => setIsBangla(!isBangla)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300/80 bg-white/50 hover:bg-white text-gray-700 hover:text-[#1F5E2E] hover:border-[#6BBF3A] transition-all text-xs font-semibold shadow-sm cursor-pointer"
          >
            <Globe size={14} className="text-[#6BBF3A]" />
            <span>{isBangla ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Sticky Donate Trigger */}
          <Link href="/get-involved?donate=true">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2E7D32] hover:bg-[#1F5E2E] text-white font-sans font-bold py-2.5 px-6 rounded-full flex items-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer"
            >
              <Heart size={14} fill="currentColor" className="text-red-300 animate-pulse" />
              <span>{isBangla ? 'অনুদান দিন' : 'Donate'}</span>
            </motion.div>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Lang Selector Mobile */}
          <button
            onClick={() => setIsBangla(!isBangla)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-300/80 bg-[#FAFAF7] text-gray-700 text-xs font-bold cursor-pointer"
          >
            <Globe size={12} className="text-[#6BBF3A]" />
            <span>{isBangla ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Hamburger trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-200/50 text-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-In Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[60px] bg-black z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-[60px] right-0 bottom-0 w-4/5 max-w-sm bg-[#FAFAF7] shadow-2xl border-l border-gray-200 p-6 flex flex-col z-40 lg:hidden overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="mb-6">
                <span className="text-xs font-mono font-black text-gray-400 uppercase tracking-widest block mb-1">
                  {isBangla ? 'মেনু' : 'Navigation'}
                </span>
                <div className="h-0.5 bg-[#6BBF3A]/30 rounded-full" />
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 flex-1">
                {navLinks.map((link) => {
                  const active = isActive(link.id);
                  return (
                    <Link
                      key={link.id}
                      href={link.id}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full text-left py-3 px-4 rounded-xl font-sans font-bold text-base transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1F5E2E] text-white'
                          : 'text-gray-700 hover:bg-[#6BBF3A]/10 hover:text-[#1F5E2E]'
                      }`}
                    >
                      {isBangla ? link.labelBn : link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Footer inside mobile menu */}
              <div className="pt-6 border-t border-gray-200 mt-auto flex flex-col gap-4">
                <Link href="/get-involved?donate=true" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-full bg-[#2E7D32] hover:bg-[#1F5E2E] text-white font-sans font-bold py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow cursor-pointer">
                    <Heart size={16} fill="currentColor" className="text-red-300 animate-pulse" />
                    <span>{isBangla ? 'অনুদান দিন' : 'Donate Now'}</span>
                  </div>
                </Link>
                <div className="text-center text-xs text-gray-400 font-medium">
                  © 2026 Green Earth. Bangladesh.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
