import React from 'react';
import { Project } from '../types';

interface Props {
  project: Project;
  isBangla: boolean;
  compact?: boolean;
}

export default function ProjectFundingProgress({ project, isBangla, compact = false }: Props) {
  // Compute target and collected sums with realistic fallback values
  const defaultGoals: Record<string, { goal: number; raised: number }> = {
    'proj-1': { goal: 500000, raised: 385000 },
    'proj-2': { goal: 350000, raised: 350000 },
    'proj-3': { goal: 450000, raised: 310000 },
  };

  const defaults = defaultGoals[project.id] || {
    goal: project.status === 'completed' ? 300000 : 450000,
    raised: project.status === 'completed' ? 300000 : 280000,
  };

  const goal = (project as any).goalAmount || defaults.goal;
  const raised = (project as any).raisedAmount || defaults.raised;
  const percent = Math.min(100, Math.round((raised / goal) * 100));

  const formatTk = (amount: number) => {
    return '৳' + amount.toLocaleString(isBangla ? 'bn-BD' : 'en-US');
  };

  if (compact) {
    return (
      <div className="w-full bg-gray-50/80 rounded-xl p-3 border border-gray-100/80 my-2">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-[#1F5E2E] font-extrabold">{formatTk(raised)} <span className="text-gray-400 font-normal text-[11px]">{isBangla ? 'সংগৃহীত' : 'raised'}</span></span>
          <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6BBF3A] to-[#1F5E2E] rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 font-semibold">
          <span>{isBangla ? 'লক্ষ্যমাত্রা: ' : 'Goal: '}{formatTk(goal)}</span>
          <span className="text-gray-500 font-medium">
            {project.status === 'completed' ? (isBangla ? '✓ সম্পন্ন' : '✓ Completed') : (isBangla ? 'চলমান প্রকল্প' : 'Active Drive')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAF7] rounded-2xl p-5 border border-gray-200/80 my-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div>
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            {isBangla ? 'ক্যাম্পেইন ফান্ডিং অগ্রগতি' : 'Campaign Funding Status'}
          </div>
          <div className="text-2xl font-black text-[#1F5E2E]">
            {formatTk(raised)} <span className="text-sm font-semibold text-gray-400">/ {formatTk(goal)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {percent}% {isBangla ? 'অর্জিত' : 'Funded'}
          </span>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6BBF3A] via-[#2E7D32] to-[#1F5E2E] rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-2 font-medium">
        <span>{isBangla ? 'কমিউনিটি অনুদানের মাধ্যমে চালিত' : 'Driven by Community Donations'}</span>
        <span className="font-bold text-[#1F5E2E]">
          {project.status === 'completed'
            ? (isBangla ? '✓ লক্ষ্য সম্পূর্ণভাবে অর্জিত' : '✓ 100% Fully Funded')
            : (isBangla ? 'আপনার ক্ষুদ্র অনুদান পরিবর্তন আনে' : 'Every contribution counts')}
        </span>
      </div>
    </div>
  );
}
