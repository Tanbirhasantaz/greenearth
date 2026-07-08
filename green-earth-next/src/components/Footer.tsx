'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Logo from './Logo';
import { Facebook, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Footer() {
  const { isBangla, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Duplicate unique key
          setStatus('success'); // Silently succeed if already subscribed
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(
        t(
          'An error occurred. Please try again.',
          'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
        )
      );
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8 border-t-4 border-[#6BBF3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand/About */}
          <div className="flex flex-col gap-4">
            <Logo size="sm" showWordmark={true} />
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              {t(
                'Green Earth is a leading non-profit environmental organization in Bangladesh dedicated to restoring ecosystems, advocating for clean renewable energy, and educating local communities for a safer, carbon-neutral tomorrow.',
                'গ্রিন আর্থ বাংলাদেশের একটি অগ্রগামী অলাভজনক পরিবেশবাদী সংগঠন যা বাস্তুতন্ত্র পুনরুদ্ধার, নবায়নযোগ্য শক্তির প্রসার এবং একটি নিরাপদ, কার্বন-মুক্ত ভবিষ্যতের জন্য কাজ করে।'
              )}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.facebook.com/greenearthbd.25/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-neutral-800 hover:bg-[#6BBF3A] hover:text-white transition-colors text-neutral-300"
                aria-label="Facebook Page"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:info@greenearth-bd.org"
                className="p-2.5 rounded-full bg-neutral-800 hover:bg-[#6BBF3A] hover:text-white transition-colors text-neutral-300"
                aria-label="Email Us"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-sans font-bold text-lg mb-6 border-b border-neutral-800 pb-2">
              {t('Quick Links', 'দ্রুত লিংক')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#6BBF3A] transition-colors">
                  {t('About Us', 'আমাদের সম্পর্কে')}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#6BBF3A] transition-colors">
                  {t('Our Projects', 'আমাদের প্রকল্পসমূহ')}
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="hover:text-[#6BBF3A] transition-colors">
                  {t('Get Involved', 'অংশ নিন')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#6BBF3A] transition-colors">
                  {t('Latest News & Blog', 'সর্বশেষ ব্লগ ও খবর')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#6BBF3A] transition-colors">
                  {t('Media Gallery', 'মিডিয়া গ্যালারি')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#6BBF3A] transition-colors">
                  {t('Contact Us', 'যোগাযোগ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-sans font-bold text-lg mb-6 border-b border-neutral-800 pb-2">
              {t('Headquarters', 'প্রধান কার্যালয়')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#6BBF3A] shrink-0 mt-0.5" />
                <span>{t('42, Road 11, Banani, Dhaka-1213, Bangladesh.', '৪২, রোড ১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ।')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#6BBF3A] shrink-0" />
                <span className="ltr">+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#6BBF3A] shrink-0" />
                <span>info@greenearth-bd.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Newsletter */}
          <div>
            <h4 className="text-white font-sans font-bold text-lg mb-6 border-b border-neutral-800 pb-2">
              {t('Newsletter', 'নিউজলেটার')}
            </h4>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              {t(
                'Subscribe to receive environmental alerts, campaign calls, and monthly summaries from Green Earth.',
                'পরিবেশগত সচেতনতা বার্তা, অভিযানের ডাক এবং আমাদের মাসিক কার্যক্রমের খবরাখবর জানতে সাবস্ক্রাইব করুন।'
              )}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('Enter your email', 'আপনার ইমেইল দিন')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#6BBF3A] disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="absolute right-1 top-1 p-2 bg-[#2E7D32] hover:bg-[#1F5E2E] disabled:bg-neutral-700 text-white rounded-full transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-1 font-semibold">
                  <CheckCircle2 size={12} />
                  <span>{t('Thank you for subscribing!', 'সাবস্ক্রাইব করার জন্য ধন্যবাদ!')}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-1 font-semibold">
                  <AlertCircle size={12} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© 2026 Green Earth. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/admin/login" className="hover:text-[#6BBF3A] transition-colors font-semibold">
              {t('Admin Login', 'অ্যাডমিন লগইন')}
            </Link>
            <span>|</span>
            <span>{t('Cleaner, Greener & Sustainable Future', 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
