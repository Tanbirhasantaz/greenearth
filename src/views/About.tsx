/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Users, Shield, Lightbulb, Landmark, Award, BookOpen, X, TrendingUp } from 'lucide-react';
import { TEAM_MEMBERS, MILESTONES, CORE_VALUES } from '../data';

interface AboutProps {
  isBangla: boolean;
  settings?: any;
}

export default function About({ isBangla, settings }: AboutProps) {
  const [teamList, setTeamList] = React.useState<any[]>(TEAM_MEMBERS);
  const [milestonesList, setMilestonesList] = React.useState<any[]>(MILESTONES);
  const [coreValuesList, setCoreValuesList] = React.useState<any[]>(CORE_VALUES);
  const [selectedMember, setSelectedMember] = React.useState<any | null>(null);

  React.useEffect(() => {
    fetch('/api/team')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Team fail');
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTeamList(data);
        }
      })
      .catch((err) => console.log('Using static team leaders fallback:', err));

    fetch('/api/milestones')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Milestones fail');
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setMilestonesList(data);
        }
      })
      .catch((err) => console.log('Using static milestones fallback:', err));

    fetch('/api/corevalues')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Core values fail');
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCoreValuesList(data);
        }
      })
      .catch((err) => console.log('Using static core values fallback:', err));
  }, []);

  // Map core values to their respective icons
  const iconMap: { [key: string]: React.ReactNode } = {
    Leaf: <Leaf size={24} />,
    Users: <Users size={24} />,
    TrendingUp: <TrendingUp size={24} />,
    Award: <Award size={24} />
  };

  return (
    <div className="flex flex-col w-full bg-[#FAFAF7] pt-24 pb-20" id="about-view">
      {/* 1. HERO HEADER */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-[#1F5E2E]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block">
            {isBangla ? (settings?.aboutHeroLabelBn || 'আমাদের পরিচয়') : (settings?.aboutHeroLabel || 'Who We Are')}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F5E2E]">
            {isBangla ? (settings?.aboutHeroTitleBn || 'আমাদের গল্প ও শক্তি') : (settings?.aboutHeroTitle || 'Our Story, Mission & Values')}
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isBangla
              ? (settings?.aboutHeroSubBn || 'গ্রিন আর্থ হলো স্থানীয় সম্প্রদায়ের নেতৃত্বাধীন পরিবেশ উন্নয়নমূলক জোট, যা মাঠ পর্যায়ে সবুজ রূপান্তর আনয়ন করছে।')
              : (settings?.aboutHeroSub || 'Empowering local custodians to combat sea level rise, manage single-use waste, and establish off-grid solar-powered schools.')
            }
          </p>
          <div className="h-1 w-16 bg-[#6BBF3A] rounded-full mt-2" />
        </div>
      </section>

      {/* 2. OUR STORY & MISSION/VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Text */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#1F5E2E]">
              {isBangla ? (settings?.aboutStoryTitleBn || 'আমাদের প্রতিষ্ঠার প্রেক্ষাপট') : (settings?.aboutStoryTitle || 'How We Started')}
            </h2>
            <div className="font-sans text-gray-600 leading-relaxed space-y-4 text-sm md:text-base">
              <p>
                {isBangla 
                  ? (settings?.aboutStory1Bn || 'জলবায়ু পরিবর্তনের ঝুঁকিতে থাকা বাংলাদেশ বিশ্বের অন্যতম ঝুঁকিপূর্ণ অঞ্চলের একটি। বঙ্গোপসাগরের ঘূর্ণিঝড়, ক্রমাগত লবণাক্ত পানি প্রবেশ, আর উত্তরবঙ্গের নদীভাঙন ধ্বংস করছে মানুষের স্বপ্ন ও জীবন। ঠিক এই ক্রান্তিলগ্নে ২০২৪ সালে ঢাকা বিশ্ববিদ্যালয়ের একদল পরিবেশ বিজ্ঞানী ও ছাত্র স্বেচ্ছাসেবীদের হাত ধরে গ্রিন আর্থের বীজ রোপণ করা হয়।')
                  : (settings?.aboutStory1 || 'Bangladesh is on the immediate frontline of the global climate crisis. Rising sea levels, salinity in drinking water, and severe riverbanks erosion displacement are displacement risks that threaten millions of lives in this low-lying delta. Founded in early 2024 by a passionate group of university environmental scientists and student groups, Green Earth was born to create pragmatic, local ecological responses.')
                }
              </p>
              <p>
                {isBangla
                  ? (settings?.aboutStory2Bn || 'আমরা বিশ্বাস করি, ঠান্ডা কর্পোরেট অফিস বা সেমিনার কক্ষে পরিবেশ সুরক্ষা অসম্ভব। প্রকৃত পরিবেশবান্ধব বাংলাদেশ গড়তে আমাদের মাঠ পর্যায়ে মানুষের সাথে কাজ করতে হবে। তাই আমরা সুন্দরবন ও উত্তরের নদী চরাঞ্চলে সরাসরি মানুষের কাছে পৌঁছাই এবং তাদের সহায়তায় প্রকল্পসমূহ সচল রাখি।')
                  : (settings?.aboutStory2 || 'Our design philosophy is centered around bottom-up community action. We believe that true conservation happens when local villagers own and protect the projects. Over the past years, our projects have bridged scientific groundwater tests with grassroot plantation drives, setting a blueprint for localized delta conservation.')
                }
              </p>
            </div>
          </div>

          {/* Mission & Vision blocks */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Mission */}
            <div className="bg-[#1F5E2E] text-white p-6 rounded-3xl shadow-lg border-b-8 border-[#6BBF3A] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-white/10 rounded-xl text-[#6BBF3A]">
                  <Landmark size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-sans text-lg font-extrabold tracking-wide mb-1 uppercase">
                    {isBangla ? 'আমাদের লক্ষ্য' : 'Our Mission'}
                  </h3>
                  <p className="font-sans text-sm text-green-100 leading-relaxed">
                    {isBangla
                      ? (settings?.aboutMissionBn || 'স্থানীয় অংশীদারিত্বের মাধ্যমে বৃক্ষরোপণ, নবায়নযোগ্য জ্বালানির ব্যবহার এবং আর্সেনিকমুক্ত নিরাপদ পানির টেকসই সংস্থান নিশ্চিত করা।')
                      : (settings?.aboutMission || 'To restore coastal eco-barriers, deliver clean solar energy grids, and guarantee safe, arsenic-free drinking water through community ownership.')
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm border-b-8 border-[#1F5E2E] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#6BBF3A]/10 rounded-xl text-[#2E7D32]">
                  <BookOpen size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-sans text-lg font-extrabold tracking-wide mb-1 uppercase text-[#1F5E2E]">
                    {isBangla ? 'আমাদের স্বপ্ন' : 'Our Vision'}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {isBangla
                      ? (settings?.aboutVisionBn || 'এমন এক বাংলাদেশের সবুজ রূপান্তর, যেখানে প্রতিটি মানুষের জন্য থাকবে বিশুদ্ধ পানি, পরিচ্ছন্ন বায়ু এবং পরিবেশবান্ধব জ্বালানি।')
                      : (settings?.aboutVision || 'A climate-resilient Bangladesh where every household shares clean air, pure drinking water, and infinite solar electricity.')
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="bg-gradient-to-b from-[#FAFAF7] to-[#F1F4EE] py-16" id="core-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
              {isBangla ? (settings?.aboutPrinciplesLabelBn || 'আমাদের আদর্শ') : (settings?.aboutPrinciplesLabel || 'Our Principles')}
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1F5E2E]">
              {isBangla ? (settings?.aboutPrinciplesTitleBn || 'যে মূল্যবোধের ওপর আমরা দাঁড়িয়ে') : (settings?.aboutPrinciplesTitle || 'Our Core Organizational Values')}
            </h2>
            <div className="h-1 w-12 bg-[#6BBF3A] mx-auto rounded-full mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValuesList.map((val) => (
              <div key={val.id} className="bg-white border border-gray-100 rounded-3xl p-6 text-left shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-[#6BBF3A]/10 text-[#1F5E2E] rounded-2xl w-fit mb-5">
                  {iconMap[val.iconName] || <Leaf size={24} />}
                </div>
                <h3 className="font-sans text-lg font-bold text-[#1F5E2E] mb-2">
                  {isBangla ? val.titleBn : val.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {isBangla ? val.descriptionBn : val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE MILESTONES SECTION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="journey-timeline">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
            {isBangla ? (settings?.aboutMilestonesLabelBn || 'আমাদের অর্জন') : (settings?.aboutMilestonesLabel || 'Our Milestones')}
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1F5E2E]">
            {isBangla ? (settings?.aboutMilestonesTitleBn || 'আজ পর্যন্ত আমাদের পথচলা') : (settings?.aboutMilestonesTitle || 'The Milestones of Our Journey')}
          </h2>
          <div className="h-1 w-12 bg-[#6BBF3A] mx-auto rounded-full mt-3" />
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-4 border-[#6BBF3A]/20 ml-4 sm:ml-32 pl-8 space-y-12 py-4 text-left">
          {milestonesList.map((mile) => (
            <div key={mile.id} className="relative">
              {/* Year Marker */}
              <div className="absolute -left-20 sm:-left-44 top-0.5 bg-[#6BBF3A] text-white font-mono font-extrabold text-sm sm:text-base py-1 px-3 sm:px-4 rounded-full shadow tracking-wider text-center w-16 sm:w-28">
                {isBangla ? mile.yearBn : mile.year}
              </div>

              {/* Bullet node */}
              <div className="absolute -left-[42px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-[#1F5E2E] shadow" />

              {/* Card info */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-sans text-xl font-bold text-[#1F5E2E] mb-2">
                  {isBangla ? mile.titleBn : mile.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
                  {isBangla ? mile.descriptionBn : mile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="bg-gradient-to-b from-[#FAFAF7] to-[#F1F4EE] py-20" id="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-black text-[#6BBF3A] uppercase tracking-widest block mb-2">
              {isBangla ? (settings?.aboutTeamLabelBn || 'আমাদের অভিভাবক') : (settings?.aboutTeamLabel || 'Our Team Leaders')}
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#1F5E2E]">
              {isBangla ? (settings?.aboutTeamTitleBn || 'সবুজ আন্দোলনের পেছনের মুখ') : (settings?.aboutTeamTitle || 'The Visionaries Behind Green Earth')}
            </h2>
            <div className="h-1 w-12 bg-[#6BBF3A] mx-auto rounded-full mt-3" />
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamList.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all text-left flex flex-col h-full"
              >
                {/* Photo */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden group">
                  <img
                    src={member.image}
                    alt={isBangla ? (member.nameBn || member.name) : member.name}
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1F5E2E]/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Info details */}
                <div className="p-6 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3 className="font-sans text-lg font-extrabold text-gray-900 leading-tight">
                      {isBangla ? (member.nameBn || member.name) : member.name}
                    </h3>
                    <p className="font-mono text-xs font-bold text-[#6BBF3A] uppercase tracking-wider mt-0.5">
                      {isBangla ? (member.roleBn || member.role) : member.role}
                    </p>
                  </div>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed mt-2 border-t border-gray-100 pt-3 line-clamp-3">
                    {isBangla ? (member.bioBn || member.bio) : member.bio}
                  </p>
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="mt-2 text-xs font-bold text-[#1F5E2E] hover:text-[#6BBF3A] transition-colors flex items-center gap-1 cursor-pointer self-start"
                  >
                    {isBangla ? 'বিস্তারিত দেখুন' : 'View Profile'} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="team-member-modal">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full relative shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto text-left"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 md:bg-gray-100 md:hover:bg-gray-200 text-white md:text-gray-500 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Profile Image */}
            <div className="w-full md:w-2/5 aspect-square md:aspect-auto md:min-h-full bg-gray-100 relative shrink-0">
              <img
                src={selectedMember.image}
                alt={isBangla ? (selectedMember.nameBn || selectedMember.name) : selectedMember.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#1F5E2E]/10" />
            </div>

            {/* Profile Details */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="bg-[#6BBF3A]/20 text-[#1F5E2E] text-[10px] font-mono font-black uppercase py-1 px-2.5 rounded-full inline-block mb-3 tracking-wider">
                  {isBangla ? 'দলনেতা পরিচিতি' : 'Team Leader Profile'}
                </span>
                <h3 className="font-sans text-2xl font-black text-gray-900 leading-tight">
                  {isBangla ? (selectedMember.nameBn || selectedMember.name) : selectedMember.name}
                </h3>
                <p className="font-mono text-xs font-bold text-[#6BBF3A] uppercase tracking-wider mt-1">
                  {isBangla ? (selectedMember.roleBn || selectedMember.role) : selectedMember.role}
                </p>
                <div className="h-1 w-10 bg-[#6BBF3A] rounded-full mt-4 mb-6" />
                
                <p className="font-sans text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {isBangla ? (selectedMember.bioBn || selectedMember.bio) : selectedMember.bio}
                </p>
              </div>

              {/* Footer row of modal */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="bg-[#1F5E2E] hover:bg-[#2E7D32] text-white font-sans font-bold text-xs py-2 px-5 rounded-full transition-colors cursor-pointer"
                >
                  {isBangla ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
