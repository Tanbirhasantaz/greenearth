import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Users,
  Heart,
  Mail,
  TreePine,
  TrendingUp,
  Clock,
  ArrowUpRight,
  UserCheck2,
  Calendar
} from 'lucide-react';

export const revalidate = 0; // Dynamic on request

async function getDashboardData() {
  const supabase = createClient();
  
  let stats = {
    volunteersCount: 0,
    donationsCount: 0,
    donationsSum: 0,
    messagesCount: 0
  };
  let recentVolunteers: any[] = [];
  let recentDonations: any[] = [];
  let recentMessages: any[] = [];

  try {
    // 1. Fetch counts
    const { count: vCount } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });
    const { count: mCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
    
    const { data: donData } = await supabase.from('donations').select('amount');
    const dSum = donData ? donData.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0;
    const dCount = donData ? donData.length : 0;

    stats = {
      volunteersCount: vCount || 0,
      donationsCount: dCount || 0,
      donationsSum: dSum,
      messagesCount: mCount || 0
    };

    // 2. Fetch lists
    const { data: dbVols } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false }).limit(3);
    const { data: dbDons } = await supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(3);
    const { data: dbMsgs } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(3);

    recentVolunteers = dbVols || [];
    recentDonations = dbDons || [];
    recentMessages = dbMsgs || [];

  } catch (error) {
    console.warn('Dashboard fetch failed. Utilizing default empty array fallbacks.', error);
  }

  return { stats, recentVolunteers, recentDonations, recentMessages };
}

export default async function AdminDashboardPage() {
  const { stats, recentVolunteers, recentDonations, recentMessages } = await getDashboardData();

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor your ecological statistics, public submissions, and donation audits in real-time.
        </p>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Volunteers</span>
            <span className="text-3xl font-sans font-extrabold text-neutral-900 mt-1 block">
              {stats.volunteersCount}
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-[#2E7D32] rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Audited Funds</span>
            <span className="text-3xl font-sans font-extrabold text-neutral-900 mt-1 block">
              ৳{stats.donationsSum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center">
            <Heart size={20} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donors Logged</span>
            <span className="text-3xl font-sans font-extrabold text-neutral-900 mt-1 block">
              {stats.donationsCount}
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Inbox Messages</span>
            <span className="text-3xl font-sans font-extrabold text-neutral-900 mt-1 block">
              {stats.messagesCount}
            </span>
          </div>
          <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center">
            <Mail size={20} />
          </div>
        </div>
      </div>

      {/* Lists split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Volunteers List */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-sans font-extrabold text-neutral-950 flex items-center gap-2">
              <Users className="text-emerald-600" size={18} />
              <span>Recent Volunteers</span>
            </h2>
            <Link href="/admin/volunteers" className="text-xs font-black text-[#2E7D32] hover:underline flex items-center gap-1">
              <span>Manage All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentVolunteers.length === 0 ? (
            <p className="text-xs text-gray-400 font-mono italic py-4 text-center">No recent volunteer submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {recentVolunteers.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 bg-[#FAFAF7] rounded-xl border border-gray-200/50">
                  <div>
                    <span className="text-sm font-sans font-bold text-neutral-900 block">{v.name}</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">{v.email} • {v.phone}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {v.area_of_interest.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Donations List */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-sans font-extrabold text-neutral-950 flex items-center gap-2">
              <Heart className="text-rose-500" size={18} />
              <span>Recent Donation Audits</span>
            </h2>
            <Link href="/admin/donations" className="text-xs font-black text-[#2E7D32] hover:underline flex items-center gap-1">
              <span>Manage All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentDonations.length === 0 ? (
            <p className="text-xs text-gray-400 font-mono italic py-4 text-center">No recent donation transactions logged.</p>
          ) : (
            <div className="space-y-4">
              {recentDonations.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 bg-[#FAFAF7] rounded-xl border border-gray-200/50">
                  <div>
                    <span className="text-sm font-sans font-bold text-neutral-900 block">{d.donor_name}</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">Via {d.method.toUpperCase()} • ID: {d.transaction_id || 'N/A'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-sans font-black text-neutral-900 block">৳{Number(d.amount).toLocaleString('en-IN')}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1 ${
                      d.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-500'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inbox section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-sans font-extrabold text-neutral-950 flex items-center gap-2">
            <Mail className="text-blue-500" size={18} />
            <span>Latest Inbox Messages</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">{stats.messagesCount} total messages</span>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-xs text-gray-400 font-mono italic py-4 text-center">No contact messages received.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMessages.map((m) => (
              <div key={m.id} className="border border-gray-200 p-6 rounded-2xl bg-[#FAFAF7] flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase text-[#6B4226] tracking-wider mb-1">{m.subject}</h4>
                  <p className="text-xs text-gray-500 font-semibold mb-3">{m.name} • {m.email}</p>
                  <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-4">"{m.message}"</p>
                </div>
                <span className="text-[10px] text-gray-400 font-mono block mt-4 border-t border-gray-200/50 pt-2 flex items-center gap-1">
                  <Clock size={10} />
                  <span>{new Date(m.created_at).toLocaleDateString('en-GB')}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
