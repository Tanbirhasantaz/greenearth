/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  isBangla: boolean;
  onSubscribeSuccess: (title: string, msg: string) => void;
  settings?: any;
}

export default function Footer({
  setCurrentPage,
  isBangla,
  onSubscribeSuccess,
  settings
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleNavClick = (pageId: Page) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(isBangla ? 'অনুগ্রহ করে ইমেইল দিন' : 'Please enter an email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(isBangla ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Please enter a valid email address');
      return;
    }

    setError('');

    fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then((res) => {
        setEmail('');
        onSubscribeSuccess(
          isBangla ? 'নিবন্ধিত হয়েছে!' : 'Subscribed Successfully!',
          isBangla 
            ? 'গ্রিন আর্থ নিউজলেটারে যুক্ত হওয়ার জন্য আপনাকে ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে পরিবেশবান্ধব আপডেট শেয়ার করব!' 
            : 'Thank you for joining the Green Earth family. We will share clean, green updates and community milestones directly to your inbox!'
        );
      })
      .catch((err) => {
        console.error(err);
        setError(isBangla ? 'সাবস্ক্রাইব করতে সমস্যা হয়েছে।' : 'Error subscribing. Please try again.');
      });
  };

  const quickLinks = [
    { id: 'home', label: 'Home', labelBn: 'হোম' },
    { id: 'about', label: 'About Us', labelBn: 'আমাদের সম্পর্কে' },
    { id: 'projects', label: 'Projects & Campaigns', labelBn: 'প্রকল্প ও অভিযানসমূহ' },
    { id: 'involved', label: 'Join as Volunteer', labelBn: 'স্বেচ্ছাসেবী হোন' },
    { id: 'blog', label: 'Blog & Articles', labelBn: 'নিবন্ধ ও ব্লগ' },
    { id: 'gallery', label: 'Photo Gallery', labelBn: 'ছবি গ্যালারি' },
    { id: 'contact', label: 'Contact Us', labelBn: 'যোগাযোগ' },
    { id: 'admin', label: 'Admin Portal', labelBn: 'অ্যাডমিন প্যানেল' }
  ];

  return (
    <footer className="bg-[#1F5E2E] text-white pt-16 pb-8 border-t-8 border-[#6BBF3A]" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Col 1: Bio & Socials */}
        <div className="flex flex-col gap-5">
          <Logo size="sm" showWordmark={true} lightMode={true} settings={settings} />
          <p className="text-green-100 font-sans text-sm leading-relaxed">
            {isBangla 
              ? (settings?.aboutTextBn || 'গ্রিন আর্থ হলো বাংলাদেশে জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবিলা ও পরিবেশ সংরক্ষণে নিয়োজিত একটি তৃণমূল সামাজিক সংস্থা।') 
              : (settings?.aboutText || 'Green Earth is a grassroots, non-profit environmental organization based in Bangladesh, driving sustainable reforestation, solar transition, and water safety.')
            }
          </p>

          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            <a
              href="https://www.facebook.com/greenearthbd.25/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#6BBF3A] hover:text-white transition-all transform hover:-translate-y-1 shadow cursor-pointer"
              aria-label="Facebook Page"
              title="Visit our Facebook Page"
            >
              <Facebook size={18} fill="currentColor" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#6BBF3A] hover:text-white transition-all transform hover:-translate-y-1 shadow cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#6BBF3A] hover:text-white transition-all transform hover:-translate-y-1 shadow cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} fill="currentColor" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#6BBF3A] hover:text-white transition-all transform hover:-translate-y-1 shadow cursor-pointer"
              aria-label="YouTube"
            >
              <Youtube size={18} fill="currentColor" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-sans text-lg font-bold text-green-200 mb-6 border-b border-white/10 pb-2">
            {isBangla ? 'সহজ লিঙ্ক' : 'Quick Navigation'}
          </h4>
          <ul className="grid grid-cols-1 gap-2.5 text-sm font-medium">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id as Page)}
                  className="hover:text-green-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left w-full"
                >
                  <Leaf size={12} className="text-[#6BBF3A]" />
                  <span>{isBangla ? link.labelBn : link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact Info & Support */}
        <div className="flex flex-col gap-5">
          <h4 className="font-sans text-lg font-bold text-green-200 border-b border-white/10 pb-2">
            {isBangla ? 'প্রধান কার্যালয়' : 'Headquarters'}
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-sans">
            <li className="flex gap-3 items-start">
              <MapPin size={18} className="text-[#6BBF3A] shrink-0 mt-0.5" />
              <span>
                {isBangla 
                  ? (settings?.addressBn || '৪২, রোড ১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ।') 
                  : (settings?.address || '42, Road 11, Banani, Dhaka-1213, Bangladesh.')
                }
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={18} className="text-[#6BBF3A] shrink-0" />
              <span>{settings?.phone || '+880 1712-345678'}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={18} className="text-[#6BBF3A] shrink-0" />
              <span className="break-all">{settings?.email || 'info@greenearth-bd.org'}</span>
            </li>
          </ul>

          {/* Localized payment logos placeholder */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className="text-xs font-mono font-bold text-green-300 block mb-2 uppercase tracking-wider">
              {isBangla ? 'সহযোগী গেটওয়ে' : 'Supported Channels'}
            </span>
            <div className="flex gap-2">
              <span className="bg-white/10 border border-white/5 py-1 px-3 rounded-lg text-[10px] font-black font-mono text-[#D81B60] flex items-center gap-1" title="bKash">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
                bKash
              </span>
              <span className="bg-white/10 border border-white/5 py-1 px-3 rounded-lg text-[10px] font-black font-mono text-[#FF6D00] flex items-center gap-1" title="Nagad">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D00]" />
                Nagad
              </span>
              <span className="bg-white/10 border border-white/5 py-1 px-3 rounded-lg text-[10px] font-black font-mono text-green-300 flex items-center gap-1">
                Cards
              </span>
            </div>
          </div>
        </div>

        {/* Col 4: Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans text-lg font-bold text-green-200 border-b border-white/10 pb-2">
            {isBangla ? 'নিউজলেটার সাবস্ক্রাইব' : 'Subscribe to Eco-News'}
          </h4>
          <p className="text-green-100 font-sans text-sm leading-relaxed">
            {isBangla 
              ? 'নতুন প্রকল্প ও বৃক্ষরোপণ অভিযানের খবরাখবর সবার আগে জানতে আপনার ইমেইল দিয়ে সংযুক্ত থাকুন।' 
              : 'Sign up to receive timely updates on planting drives, solar microgrid operations, and ecological guidelines in Bangladesh.'
            }
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBangla ? 'আপনার ইমেইল...' : 'Your email address...'}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-green-200/60 font-sans text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] focus:border-transparent transition-all"
                id="footer-newsletter-email"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-2 bg-[#6BBF3A] hover:bg-[#81C784] text-white rounded-full transition-all cursor-pointer"
                aria-label="Subscribe"
                id="footer-newsletter-submit"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            {error && <p className="text-red-300 text-xs font-semibold pl-2 mt-1">{error}</p>}
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono font-bold text-green-200">
        <p>© 2026 Green Earth Bangladesh. All Rights Reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
