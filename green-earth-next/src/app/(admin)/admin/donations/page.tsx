'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Donation } from '@/types';
import { Heart, AlertCircle, RefreshCw, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbErr) throw dbErr;
      setDonations(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donation records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'pending' | 'confirmed') => {
    setSuccessMsg('');
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';
    
    try {
      const supabase = createClient();
      const { error: patchErr } = await supabase
        .from('donations')
        .update({ status: newStatus })
        .eq('id', id);

      if (patchErr) throw patchErr;

      setSuccessMsg(`Donation status marked as ${newStatus} successfully.`);
      setDonations(prev =>
        prev.map(d => d.id === id ? { ...d, status: newStatus } : d)
      );

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update donation status.');
    }
  };

  const totalConfirmedBDT = donations
    .filter(d => d.status === 'confirmed')
    .reduce((sum, curr) => sum + Number(curr.amount), 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Heart size={32} className="text-rose-500 fill-rose-500" />
            <span>Donations Auditor</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Audit public donations, verify transaction hash IDs against bKash or Nagad, and toggle validation records.
          </p>
        </div>
        <button
          onClick={fetchDonations}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Confirmed Sum Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-850 text-white rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md border border-neutral-800">
        <div>
          <span className="text-xs font-mono font-bold text-[#6BBF3A] uppercase tracking-wider block">Audited & Confirmed Treasury</span>
          <span className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight mt-2 block">
            ৳{totalConfirmedBDT.toLocaleString('en-IN')} BDT
          </span>
        </div>
        <div className="px-6 py-3 bg-white/10 border border-white/15 rounded-2xl flex items-center gap-2 max-w-xs backdrop-blur-sm self-start sm:self-center">
          <TrendingUp className="text-[#6BBF3A]" size={18} />
          <span className="text-xs text-neutral-300 font-semibold leading-relaxed">
            100% of these funds purchase organic saplings, deep tube wells, and solar converters.
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <RefreshCw className="animate-spin" size={16} />
          <span>Fetching donation records...</span>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto">
          <Heart size={44} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-sans font-extrabold text-lg text-neutral-800">No donations logged yet</h3>
          <p className="text-gray-400 text-xs mt-2">Transactions submitted by supporters on the "Get Involved" page will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="p-6">Donor Details</th>
                  <th className="p-6">Amount (BDT)</th>
                  <th className="p-6">Method & Gateway</th>
                  <th className="p-6">Transaction hash ID</th>
                  <th className="p-6">Status Record</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAFAF7]/50 transition-colors">
                    {/* Donor Details */}
                    <td className="p-6">
                      <span className="font-sans font-bold text-neutral-900 block">{d.donor_name}</span>
                      <span className="text-xs text-gray-400 mt-1 block">{d.email}</span>
                      <span className="text-[10px] text-gray-400 font-mono block mt-2">
                        Submitted: {new Date(d.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-6">
                      <span className="font-sans font-black text-base text-neutral-900">
                        ৳{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="p-6">
                      <span className="px-3 py-1 bg-neutral-100 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">
                        {d.method}
                      </span>
                    </td>

                    {/* Trx Hash */}
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-[#6B4226] bg-[#6B4226]/5 px-2.5 py-1 rounded-md border border-[#6B4226]/10">
                        {d.transaction_id || 'N/A'}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="p-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        d.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {d.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(d.id, d.status)}
                        className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm ${
                          d.status === 'pending'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-neutral-900'
                        }`}
                      >
                        {d.status === 'pending' ? 'Confirm Transaction' : 'Mark Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
