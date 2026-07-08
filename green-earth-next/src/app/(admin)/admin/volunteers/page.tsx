'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Volunteer } from '@/types';
import { Users, AlertCircle, RefreshCw, CheckCircle2, UserCheck, MessageSquare } from 'lucide-react';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchVolunteers = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbErr) throw dbErr;
      setVolunteers(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch volunteers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'active') => {
    setSuccessMsg('');
    try {
      const supabase = createClient();
      const { error: patchErr } = await supabase
        .from('volunteers')
        .update({ status: newStatus })
        .eq('id', id);

      if (patchErr) throw patchErr;

      setSuccessMsg('Volunteer status updated successfully.');
      // Refresh local list state
      setVolunteers(prev =>
        prev.map(v => v.id === id ? { ...v, status: newStatus } : v)
      );

      // Dismiss success message
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update volunteer status.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Users size={32} className="text-[#2E7D32]" />
            <span>Volunteers List</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and manage registrations from individuals seeking to support tree plantations, solar transitions, and recycling events.
          </p>
        </div>
        <button
          onClick={fetchVolunteers}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>
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
          <span>Fetching volunteer records...</span>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto">
          <Users size={44} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-sans font-extrabold text-lg text-neutral-800">No volunteers registered yet</h3>
          <p className="text-gray-400 text-xs mt-2">Volunteer registrations from the "Get Involved" page will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="p-6">Volunteer Info</th>
                  <th className="p-6">Interest Area</th>
                  <th className="p-6">Statement</th>
                  <th className="p-6">Current Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {volunteers.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FAFAF7]/50 transition-colors">
                    {/* Info */}
                    <td className="p-6">
                      <span className="font-sans font-bold text-neutral-900 block">{v.name}</span>
                      <span className="text-xs text-gray-500 mt-1 block">{v.email} • {v.phone}</span>
                      <span className="text-[10px] text-gray-400 font-mono block mt-2">
                        Registered: {new Date(v.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </td>

                    {/* Interest Area */}
                    <td className="p-6">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {v.area_of_interest.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Message */}
                    <td className="p-6 max-w-xs">
                      {v.message ? (
                        <div className="flex items-start gap-1.5 text-xs text-gray-600 italic">
                          <MessageSquare size={12} className="shrink-0 mt-0.5 text-gray-400" />
                          <span className="line-clamp-3">"{v.message}"</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">No statement provided</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="p-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        v.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right">
                      <select
                        value={v.status}
                        onChange={(e: any) => handleUpdateStatus(v.id, e.target.value)}
                        className="bg-[#FAFAF7] border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-forest-green cursor-pointer"
                      >
                        <option value="new">Mark New (নতুন)</option>
                        <option value="contacted">Mark Contacted (যোগাযোগকৃত)</option>
                        <option value="active">Mark Active (সক্রিয়)</option>
                      </select>
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
