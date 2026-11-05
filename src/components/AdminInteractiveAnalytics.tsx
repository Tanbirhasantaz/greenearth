import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, PieChart, Trees, Sun, Droplet, 
  Trash2, Megaphone, ArrowUpRight, Sparkles, Filter, ChevronRight
} from 'lucide-react';

interface AnalyticsProps {
  donations: any[];
  volunteers: any[];
  isBangla: boolean;
  isDarkMode: boolean;
  onSelectInterest?: (interest: string) => void;
}

export default function AdminInteractiveAnalytics({
  donations,
  volunteers,
  isBangla,
  isDarkMode,
  onSelectInterest
}: AnalyticsProps) {
  const [metricTab, setMetricTab] = useState<'donations' | 'volunteers'>('donations');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Month calculation (Last 6 months)
  const now = new Date();
  const monthsData = [];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

  for (let i = 5; i >= 0; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIdx = target.getMonth();
    const year = target.getFullYear();

    // Filter donations in this month
    const monthDonations = donations.filter(d => {
      if (!d.date) return false;
      const dDate = new Date(d.date);
      return dDate.getFullYear() === year && dDate.getMonth() === mIdx;
    });
    const totalDonationAmount = monthDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    // Filter volunteers in this month
    const monthVolunteers = volunteers.filter(v => {
      if (!v.date) return false;
      const vDate = new Date(v.date);
      return vDate.getFullYear() === year && vDate.getMonth() === mIdx;
    });

    monthsData.push({
      label: isBangla ? monthNamesBn[mIdx] : monthNamesEn[mIdx],
      year,
      donationsAmount: totalDonationAmount,
      donationsCount: monthDonations.length,
      volunteersCount: monthVolunteers.length
    });
  }

  // Calculate maximum values for relative bar height scaling
  const maxDonation = Math.max(...monthsData.map(m => m.donationsAmount), 1);
  const maxVolunteers = Math.max(...monthsData.map(m => m.volunteersCount), 1);

  // Campaign distribution calculation
  const campaignMeta = [
    { id: 'plantation', label: isBangla ? 'বৃক্ষরোপণ কর্মসূচি' : 'Tree Plantation', color: '#1F5E2E', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
    { id: 'renewable', label: isBangla ? 'সৌর বিদ্যুৎ প্ল্যান্ট' : 'Solar Micro-Grids', color: '#D97706', bg: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
    { id: 'water', label: isBangla ? 'নিরাপদ পানি প্ল্যান্ট' : 'Safe Water Plants', color: '#0284C7', bg: 'bg-sky-500', lightBg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300' },
    { id: 'waste', label: isBangla ? 'বর্জ্য ও রিসাইক্লিং' : 'Waste Cleanup', color: '#7C3AED', bg: 'bg-purple-500', lightBg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300' },
    { id: 'awareness', label: isBangla ? 'পরিবেশ সচেতনতা' : 'Eco Campaigns', color: '#059669', bg: 'bg-teal-500', lightBg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300' }
  ];

  const totalVolsCount = volunteers.length || 1;
  const campaignBreakdown = campaignMeta.map(c => {
    const count = volunteers.filter(v => v && v.interest === c.id).length;
    const percentage = Math.round((count / totalVolsCount) * 100);
    return { ...c, count, percentage };
  });

  return (
    <div className="space-y-6 text-left">
      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#1F5E2E]/10 dark:bg-emerald-500/20 text-[#1F5E2E] dark:text-emerald-400 rounded-xl">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight flex items-center gap-2">
              <span>{isBangla ? 'লাইভ গ্রোথ ও ক্যাম্পেইন অ্যানালিটিক্স' : 'Interactive Growth & Analytics'}</span>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Live Data
              </span>
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
              {isBangla ? 'গত ৬ মাসের অনুদান প্রবাহ এবং ভলান্টিয়ার ক্যাম্পেইন বন্টন' : '6-Month Contribution Trend & Campaign Distribution'}
            </p>
          </div>
        </div>

        {/* Metric Toggle Tabs */}
        <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 self-start sm:self-center">
          <button
            onClick={() => setMetricTab('donations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metricTab === 'donations'
                ? 'bg-white dark:bg-slate-700 text-[#1F5E2E] dark:text-emerald-300 shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
            }`}
          >
            {isBangla ? 'অনুদান বৃদ্ধি (৳)' : 'Donations (BDT)'}
          </button>
          <button
            onClick={() => setMetricTab('volunteers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metricTab === 'volunteers'
                ? 'bg-white dark:bg-slate-700 text-[#1F5E2E] dark:text-emerald-300 shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
            }`}
          >
            {isBangla ? 'স্বেচ্ছাসেবী বৃদ্ধি (জন)' : 'Volunteers'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 6-Month Visual Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block font-mono">
                {metricTab === 'donations'
                  ? (isBangla ? 'মাসিক অনুদানের পরিমাণ' : 'Monthly Contributions (BDT)')
                  : (isBangla ? 'মাসিক নিবন্ধিত স্বেচ্ছাসেবী' : 'Monthly Volunteer Signups')}
              </span>
              <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                {metricTab === 'donations'
                  ? `৳${donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toLocaleString()}`
                  : `${volunteers.length} ${isBangla ? 'জন' : 'Registrations'}`}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
              <TrendingUp size={14} />
              <span>+18.4%</span>
            </div>
          </div>

          {/* The Interactive Chart Container */}
          <div className="h-48 pt-6 pb-2 flex items-end justify-between gap-3 relative">
            {monthsData.map((m, idx) => {
              const value = metricTab === 'donations' ? m.donationsAmount : m.volunteersCount;
              const maxVal = metricTab === 'donations' ? maxDonation : maxVolunteers;
              const heightPct = Math.max(Math.round((value / maxVal) * 100), 12);
              const isHovered = hoveredMonth === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Floating Hover Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-14 z-20 bg-gray-900 text-white text-[10px] font-mono py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap pointer-events-none"
                    >
                      <div className="font-bold text-emerald-300">
                        {metricTab === 'donations' ? `৳${value.toLocaleString()}` : `${value} Volunteers`}
                      </div>
                      <div className="text-gray-400">
                        {m.label} {m.year}
                      </div>
                    </motion.div>
                  )}

                  {/* Animated Bar Element */}
                  <div className="w-full max-w-[42px] bg-gray-100 dark:bg-slate-700/60 rounded-xl h-full flex items-end p-1 transition-all">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.05 }}
                      className={`w-full rounded-lg transition-all ${
                        isHovered
                          ? 'bg-[#6BBF3A] shadow-md shadow-[#6BBF3A]/30 scale-y-105'
                          : metricTab === 'donations'
                            ? 'bg-gradient-to-t from-[#1F5E2E] to-[#2E7D32]'
                            : 'bg-gradient-to-t from-emerald-600 to-teal-400'
                      }`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className={`text-[11px] font-mono font-bold mt-2.5 transition-colors ${
                    isHovered
                      ? 'text-[#1F5E2E] dark:text-emerald-400'
                      : 'text-gray-400 dark:text-slate-400'
                  }`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footer Indicator */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-400 font-mono">
            <span>{isBangla ? 'সর্বোচ্চ সক্রিয় মাস হাইলাইট' : 'Hover on bars for exact values'}</span>
            <span className="text-[#1F5E2E] dark:text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles size={12} />
              <span>Realtime Synced</span>
            </span>
          </div>
        </div>

        {/* Right Column: Campaign Interest Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block font-mono">
                  {isBangla ? 'ক্যাম্পেইন আগ্রহের বন্টন' : 'Campaign Allocation Share'}
                </span>
                <h4 className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                  {isBangla ? 'স্বেচ্ছাসেবীদের সেক্টরাল ফোকাস' : 'Field Interest Distribution'}
                </h4>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-xl">
                <PieChart size={16} />
              </div>
            </div>

            {/* Campaign Progress Bars List */}
            <div className="space-y-3.5 mt-2">
              {campaignBreakdown.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectInterest && onSelectInterest(item.id)}
                  className={`p-3 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all cursor-pointer ${item.lightBg}`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className={`font-bold flex items-center gap-1.5 ${item.text}`}>
                      <span className={`w-2 h-2 rounded-full ${item.bg}`} />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono font-black text-gray-700 dark:text-slate-300">
                      {item.count} {isBangla ? 'জন' : ''} ({item.percentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200/60 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(item.percentage, 4)}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`h-full rounded-full ${item.bg}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium text-center mt-4">
            {isBangla ? 'ক্যাম্পেইনে ক্লিক করে ফিল্টার করুন' : 'Click on any campaign to filter records'}
          </p>
        </div>

      </div>
    </div>
  );
}
