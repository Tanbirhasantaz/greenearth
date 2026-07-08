/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Youtube, Info, CheckCircle } from 'lucide-react';

interface ContactProps {
  isBangla: boolean;
  onFormSuccess: (title: string, msg: string) => void;
  settings?: any;
}

export default function Contact({ isBangla, onFormSuccess, settings }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = isBangla ? 'আপনার নাম দিন' : 'Please enter your name';
    }
    if (!email.trim()) {
      newErrors.email = isBangla ? 'আপনার ইমেইল দিন' : 'Please enter your email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = isBangla ? 'সঠিক ইমেইল দিন' : 'Please enter a valid email';
      }
    }
    if (!subject.trim()) {
      newErrors.subject = isBangla ? 'বিষয় দিন' : 'Please enter a subject';
    }
    if (!message.trim()) {
      newErrors.message = isBangla ? 'বার্তা দিন' : 'Please enter your message';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');

        onFormSuccess(
          isBangla ? 'বার্তা পাঠানো হয়েছে!' : 'Message Sent Successfully!',
          isBangla 
            ? 'আপনার বার্তাটি সফলভাবে রেকর্ড করা হয়েছে। আমাদের টিম ২৪ ঘণ্টার মধ্যে ইমেইলের মাধ্যমে উত্তর দেবে!' 
            : 'Your message has been received! Our support coordinators will review your query and respond via email within 24 hours.'
        );
      })
      .catch((err) => {
        console.error(err);
        alert(isBangla ? 'বার্তা পাঠাতে সমস্যা হয়েছে।' : 'Error sending your message. Please try again.');
      });
  };

  return (
    <div className="flex flex-col w-full bg-[#FAFAF7] pt-24 pb-20" id="contact-view">
      {/* 1. HERO HEADER */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-b from-[#1F5E2E]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block">
            {isBangla ? 'যোগাযোগ করুন' : 'Get in Touch'}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F5E2E]">
            {isBangla ? 'আমাদের সাথে যোগাযোগ' : 'Contact Green Earth'}
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isBangla
              ? 'যেকোনো মতামত, স্বেচ্ছাসেবী সংক্রান্ত জিজ্ঞাসা বা অনুদান সংক্রান্ত অনুসন্ধানের জন্য আমাদের লিখুন।'
              : 'Have questions about volunteering, CSR partnerships, or need to verify a donation? Drop us a line.'
            }
          </p>
          <div className="h-1 w-16 bg-[#6BBF3A] rounded-full mt-2" />
        </div>
      </section>

      {/* 2. CONTACT OPTIONS & MAP GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Left Side: Info & Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Card Info Details row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <MapPin size={24} className="text-[#6BBF3A] mb-3" />
              <h3 className="font-sans text-sm font-extrabold text-[#1F5E2E] uppercase mb-1">
                {isBangla ? 'কার্যালয়' : 'Headquarters'}
              </h3>
              <p className="font-sans text-xs text-gray-500 leading-relaxed">
                {isBangla 
                  ? (settings?.addressBn || '৪২, রোড ১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ।') 
                  : (settings?.address || '42, Road 11, Banani, Dhaka-1213, Bangladesh.')
                }
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <Phone size={24} className="text-[#6BBF3A] mb-3" />
              <h3 className="font-sans text-sm font-extrabold text-[#1F5E2E] uppercase mb-1">
                {isBangla ? 'ফোন করুন' : 'Call Us'}
              </h3>
              <p className="font-sans text-xs text-gray-500 leading-relaxed">
                {settings?.phone || '+880 1712-345678'}<br />+880 2-9876543
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <Mail size={24} className="text-[#6BBF3A] mb-3" />
              <h3 className="font-sans text-sm font-extrabold text-[#1F5E2E] uppercase mb-1">
                {isBangla ? 'ইমেইল লিখুন' : 'Email Us'}
              </h3>
              <p className="font-sans text-xs text-gray-500 leading-relaxed break-all">
                {settings?.email || 'info@greenearth-bd.org'}<br />support@greenearth-bd.org
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-sans text-xl font-extrabold text-[#1F5E2E] mb-6">
              {isBangla ? 'আমাদের সরাসরি বার্তা পাঠান' : 'Send Us a Direct Message'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                    {isBangla ? 'আপনার নাম' : 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBangla ? 'যেমন: আরিফ রহমান' : 'e.g. Arif Rahman'}
                    className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold pl-1 mt-0.5">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                    {isBangla ? 'ইমেইল ঠিকানা' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold pl-1 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                  {isBangla ? 'বার্তার বিষয়' : 'Subject'} *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isBangla ? 'যে বিষয়ে যোগাযোগ করতে চান...' : 'What is this regarding?'}
                  className={`bg-gray-50 border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all`}
                />
                {errors.subject && <p className="text-red-500 text-xs font-bold pl-1 mt-0.5">{errors.subject}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                  {isBangla ? 'আপনার বার্তা' : 'Your Message'} *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isBangla ? 'আপনার প্রশ্ন বা বার্তা বিস্তারিত লিখুন...' : 'Write your detailed message here...'}
                  className={`bg-gray-50 border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6BBF3A] text-sm text-gray-800 transition-all resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs font-bold pl-1 mt-0.5">{errors.message}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold py-3.5 rounded-full shadow transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                id="contact-form-submit"
              >
                <Send size={16} />
                <span>{isBangla ? 'বার্তা পাঠান' : 'Send Message'}</span>
              </motion.button>
            </form>
          </div>
        </div>

        {/* Right Side: Map & Social Handles (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Map box */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-fit" id="map-mockup-card">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <span className="font-sans font-bold text-[#1F5E2E] text-sm">
                📍 {isBangla ? 'মানচিত্রে আমাদের অবস্থান' : 'HQ Map Location'}
              </span>
              <span className="bg-[#6BBF3A]/20 text-[#1F5E2E] text-[10px] font-mono font-bold uppercase py-1 px-2 rounded-full">
                Dhaka, BD
              </span>
            </div>

            {/* Styled vector SVG map representing Dhaka street grid */}
            <div className="relative aspect-[4/3] bg-[#E8ECE9] overflow-hidden" id="map-canvas">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Background layout */}
                <rect width="400" height="300" fill="#E8ECE9" />

                {/* River layout */}
                <path d="M -50,150 Q 80,140 200,220 T 450,230" fill="none" stroke="#B2EBF2" strokeWidth="32" strokeLinecap="round" opacity="0.6" />

                {/* Major street grid */}
                <g stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.9">
                  {/* Vertical streets */}
                  <line x1="80" y1="-50" x2="80" y2="350" />
                  <line x1="220" y1="-50" x2="220" y2="350" />
                  <line x1="340" y1="-50" x2="340" y2="350" />
                  {/* Horizontal streets */}
                  <line x1="-50" y1="60" x2="450" y2="60" />
                  <line x1="-50" y1="180" x2="450" y2="180" />
                  <line x1="-50" y1="260" x2="450" y2="260" />
                  {/* Diagonal streets */}
                  <line x1="-50" y1="0" x2="450" y2="300" strokeWidth="6" />
                </g>

                {/* Street names */}
                <g fill="#A1A8A3" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                  <text x="90" y="20" transform="rotate(90 90 20)">Gulshan Avenue</text>
                  <text x="230" y="20" transform="rotate(90 230 20)">Kemal Ataturk Ave</text>
                  <text x="10" y="52">Road No. 11 (Banani)</text>
                  <text x="10" y="172">Airport Road</text>
                </g>

                {/* Green Earth HQ Active pin */}
                <g transform="translate(220, 60)">
                  {/* Radar pulse */}
                  <circle cx="0" cy="0" r="14" fill="#6BBF3A" opacity="0.3">
                    <animate attributeName="r" values="6;22;6" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Pin drop */}
                  <path d="M 0 -18 C -6 -18 -10 -14 -10 -8 C -10 -2 0 10 0 10 C 0 10 10 -2 10 -8 C 10 -14 6 -18 0 -18 Z" fill="#1F5E2E" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="0" cy="-8" r="4.5" fill="#6BBF3A" />
                </g>
              </svg>

              {/* Floating Map card details */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow flex items-start gap-2.5">
                <div className="p-1.5 bg-[#6BBF3A]/20 rounded-lg text-[#1F5E2E] shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div className="text-xs font-sans">
                  <div className="font-extrabold text-[#1F5E2E] mb-0.5">Green Earth HQ</div>
                  <div className="text-gray-500 leading-snug">
                    {isBangla ? 'রোড ১১, বনানী (প্রাইম ব্যাংক ভবনের নিকটে), ঢাকা।' : 'Road 11, Banani (Near Prime Bank Block), Dhaka.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections block */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm text-left">
            <h3 className="font-sans text-base font-extrabold text-[#1F5E2E] mb-4 uppercase tracking-wider">
              {isBangla ? 'সোশ্যাল মিডিয়ায় সংযোগ' : 'Follow Our Active Campaigns'}
            </h3>
            <p className="font-sans text-xs text-gray-500 leading-relaxed mb-4">
              {isBangla
                ? 'আমাদের কার্যক্রম, প্রতিদিনের স্বেচ্ছাসেবক আহ্বান এবং রোপণ উৎসবের ছবি সরাসরি আমাদের ফেসবুক পেজে শেয়ার করা হয়।'
                : 'Join our digital eco-allies. We publish live pictures of coastal tree plantation drives and community metrics on social media daily.'
              }
            </p>

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/greenearthbd.25/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border border-gray-200 hover:border-[#6BBF3A] hover:bg-[#6BBF3A]/5 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-gray-600 hover:text-[#1F5E2E] transition-all font-sans font-bold text-xs cursor-pointer"
              >
                <Facebook size={16} fill="currentColor" className="text-blue-600" />
                <span>Facebook Page</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border border-gray-200 hover:border-[#6BBF3A] hover:bg-[#6BBF3A]/5 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-gray-600 hover:text-[#1F5E2E] transition-all font-sans font-bold text-xs cursor-pointer"
              >
                <Instagram size={16} className="text-pink-600" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
