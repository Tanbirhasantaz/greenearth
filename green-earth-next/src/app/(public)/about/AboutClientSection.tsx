'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { TeamMember } from '@/types';
import { Heart, Globe, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface AboutClientSectionProps {
  team: TeamMember[];
  settings?: Record<string, string>;
}

export default function AboutClientSection({ team, settings = {} }: AboutClientSectionProps) {
  const { isBangla, t } = useLanguage();

  const aboutIntro = isBangla
    ? (settings.about_intro_bn || '২০২৫ সাল থেকে বাংলাদেশে পরিবেশগত ভারসাম্য রক্ষা, সামাজিক বনায়ন এবং বিশুদ্ধ পানি নিশ্চিতকরণ প্রকল্পে কাজ করছে গ্রিন আর্থ।')
    : (settings.about_intro_en || 'Leading community-centric ecological restoration, tree plantations, and water purity across Bangladesh since 2025.');

  const aboutVision = isBangla
    ? (settings.about_vision_bn || 'বাংলাদেশ জলবায়ু পরিবর্তনের কারণে বিশেষভাবে ঝুঁকিপূর্ণ। সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি উপকূলীয় অঞ্চলকে হুমকির মুখে ফেলছে, ঘূর্ণিঝড় তীব্র থেকে তীব্রতর হচ্ছে এবং চরাঞ্চল বিদ্যুৎ বিচ্ছিন্ন থাকছে। গ্রিন আর্থ এই কঠিন পরিস্থিতিতে মাঠ পর্যায়ে টেকসই বৈজ্ঞানিক ও জনবান্ধব সমাধান প্রদানের লক্ষ্যে প্রতিষ্ঠিত হয়েছিল।')
    : (settings.about_vision_en || 'Bangladesh is uniquely vulnerable to climate change. Rising sea levels threaten coastal areas, cyclones recur with greater fury, and river char communities remain severely isolated. Green Earth was founded to deliver tangible, scientific, and community-owned solutions on the ground.');

  const values = [
    {
      icon: <Globe className="text-emerald-700" size={24} />,
      title: 'Local Empowerment',
      titleBn: 'স্থানীয় ক্ষমতায়ন',
      desc: 'We believe that the best guardians of ecosystems are the local residents. We employ and empower local communities to manage and protect our plantation sites.',
      descBn: 'আমরা বিশ্বাস করি যে প্রকৃতির সেরা অভিভাবক হলেন স্থানীয় বাসিন্দারা। আমরা আমাদের বনায়ন সাইটগুলো পরিচালনা করতে স্থানীয়দের যুক্ত ও ক্ষমতায়ন করি।'
    },
    {
      icon: <Heart className="text-rose-600" size={24} />,
      title: 'Scientific Care',
      titleBn: 'বৈজ্ঞানিক যত্ন',
      desc: 'Every tree planted, and every well dug is backed by environmental research, hydrological mapping, and continuous quality monitoring.',
      descBn: 'রোপণ করা প্রতিটি গাছ এবং খনন করা প্রতিটি নলকূপ পরিবেশগত গবেষণা, জলবিদ্যা ম্যাপিং এবং গুণমান পর্যবেক্ষণের দ্বারা সমর্থিত।'
    },
    {
      icon: <ShieldAlert className="text-amber-700" size={24} />,
      title: 'Radical Integrity',
      titleBn: 'অখণ্ড সততা',
      desc: '100% of public donations are directly channeled into purchasing saplings, sand filters, and solar grids. We maintain public ledgers of our expenditures.',
      descBn: 'জনসাধারণের অনুদানের ১০০% সরাসরি চারাগাছ, স্যান্ড ফিল্টার এবং সৌর প্যানেল কিনতে ব্যবহৃত হয়। আমরা খরচের স্বচ্ছ হিসাব রক্ষা করি।'
    }
  ];

  return (
    <div>
      {/* Dynamic Title Header banner */}
      <section className="bg-gradient-to-br from-[#EBF5EC] to-[#FAFAF7] border-b border-gray-200/50 py-16 text-center -mt-12 md:-mt-16 mb-8">
        <div className="max-w-4xl mx-auto px-4 animate-fade-in">
          <span className="text-xs font-mono font-black text-forest-green uppercase tracking-widest bg-forest-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            {t('Our Identity', 'আমাদের পরিচয়')}
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-900">
            {t('About Green Earth', 'গ্রিন আর্থ সম্পর্কে')}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            {aboutIntro}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 1. Vision & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 mb-6">
              {t('Our Green Vision for Bangladesh', 'বাংলাদেশের জন্য আমাদের সবুজ ভাবনা')}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                {aboutVision}
              </p>
              <p>
                {t(
                  'Through our mangrove planting networks in Satkhira, deep tube wells in Chandpur, solar initiatives in Kurigram, and river cleanups in Dhaka, we are building a multi-front defense against ecological degradation.',
                  'সাতক্ষীরায় আমাদের ম্যানগ্রোভ রোপণ নেটওয়ার্ক, চাঁদপুরে গভীর নলকূপ স্থাপন, কুড়িগ্রামে সৌরশক্তি উদ্যোগ এবং ঢাকায় নদী পরিচ্ছন্নতা অভিযানের মাধ্যমে আমরা পরিবেশগত অবক্ষয়ের বিরুদ্ধে বহুমুখী প্রতিরোধ গড়ে তুলছি।'
                )}
              </p>
            </div>
          </div>
        <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
          <Image
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80"
            alt="Nursery seedlings"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 2. Core Values Grid */}
      <div className="mb-24">
        <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 mb-12 text-center">
          {t('Our Core Value Systems', 'আমাদের মূল নীতিমালা')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6">
                {v.icon}
              </div>
              <h3 className="font-sans font-extrabold text-lg text-neutral-900 mb-3">
                {isBangla ? v.titleBn : v.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {isBangla ? v.descBn : v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Team Grid */}
      <div id="team">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-black text-[#6B4226] uppercase tracking-widest bg-[#6B4226]/10 px-3 py-1.5 rounded-full inline-block mb-3">
            {t('OFFICERS & SCIENTISTS', 'কর্মকর্তা ও গবেষকবৃন্দ')}
          </span>
          <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900">
            {t('Meet Our Leadership Team', 'আমাদের পরিচালনা পর্ষদ')}
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {t(
              'A passionate group of environmental scientists, climate engineers, and community activists leading change.',
              'পরিবেশ বিজ্ঞানী, জলবায়ু প্রকৌশলী এবং সামাজিক সংগঠকদের একটি দল যারা অগ্রভাগে থেকে নেতৃত্ব দিচ্ছেন।'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {team.map((m) => (
            <div key={m.id} className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col text-center">
              <div className="relative h-64 w-full bg-gray-100">
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-sans font-black text-lg text-neutral-900">
                  {isBangla ? m.name_bn : m.name}
                </h3>
                <span className="text-xs font-bold text-forest-green tracking-wider uppercase block mt-1 mb-4">
                  {isBangla ? m.role_bn : m.role}
                </span>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isBangla ? m.bio_bn : m.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
