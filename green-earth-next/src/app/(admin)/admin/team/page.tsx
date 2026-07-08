'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TeamMember } from '@/types';
import { Briefcase, Plus, Edit, Trash, RefreshCw, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [role, setRole] = useState('');
  const [roleBn, setRoleBn] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [bioBn, setBioBn] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const fetchTeam = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbErr) throw dbErr;
      setTeam(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddForm = () => {
    setEditId(null);
    setName('');
    setNameBn('');
    setRole('');
    setRoleBn('');
    setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80');
    setBio('');
    setBioBn('');
    setDisplayOrder(team.length + 1);
    setFormOpen(true);
  };

  const openEditForm = (member: TeamMember) => {
    setEditId(member.id);
    setName(member.name);
    setNameBn(member.name_bn || '');
    setRole(member.role);
    setRoleBn(member.role_bn || '');
    setPhotoUrl(member.photo_url);
    setBio(member.bio);
    setBioBn(member.bio_bn || '');
    setDisplayOrder(member.display_order);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    setSuccessMsg('');
    setError('');
    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;

      setSuccessMsg('Team member deleted successfully.');
      setTeam(prev => prev.filter(m => m.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete team member.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setError('');

    const payload = {
      name,
      name_bn: nameBn,
      role,
      role_bn: roleBn,
      photo_url: photoUrl,
      bio,
      bio_bn: bioBn,
      display_order: displayOrder
    };

    try {
      const supabase = createClient();

      if (editId) {
        // Edit mode
        const { error: patchErr } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editId);

        if (patchErr) throw patchErr;

        setSuccessMsg('Team member updated successfully.');
        setTeam(prev =>
          prev.map(m => m.id === editId ? { ...m, ...payload } : m).sort((a, b) => a.display_order - b.display_order)
        );
      } else {
        // Add mode
        const { data, error: postErr } = await supabase
          .from('team_members')
          .insert([payload])
          .select();

        if (postErr) throw postErr;

        setSuccessMsg('New team member registered successfully.');
        if (data && data[0]) {
          setTeam(prev => [...prev, data[0]].sort((a, b) => a.display_order - b.display_order));
        }
      }

      setFormOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving the team member.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Briefcase size={32} className="text-forest-green" />
            <span>Team Members Manager</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage officers, climate engineers, conservation biologists, and board members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTeam}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openAddForm}
            className="flex items-center gap-1 px-4 py-2 bg-forest-green text-white rounded-full text-xs font-black hover:bg-deep-forest transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Slide-out/Modal Form Panel */}
      {formOpen && (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-sans font-extrabold text-neutral-950">
              {editId ? 'Modify Team Member Credentials' : 'Register New Organization Member'}
            </h2>
            <button
              onClick={() => setFormOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Member Name (English)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                  placeholder="e.g. Dr. Anisur Rahman"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Member Name (Bangla / বাংলা)
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  placeholder="যেমন: ড. আনিসুর রহমান"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Official Role / Designation (English)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                  placeholder="e.g. Founder & Executive Director"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Official Role / Designation (Bangla / বাংলা)
                </label>
                <input
                  type="text"
                  value={roleBn}
                  onChange={(e) => setRoleBn(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  placeholder="যেমন: প্রতিষ্ঠাতা ও নির্বাহী পরিচালক"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Display Order Weight (Ascending)
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                Short Biography (English)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                required
                placeholder="Brief summary of their contribution..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                Short Biography (Bangla / বাংলা)
              </label>
              <textarea
                rows={3}
                value={bioBn}
                onChange={(e) => setBioBn(e.target.value)}
                className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                placeholder="সংক্ষিপ্ত বিবরণ বাংলায়..."
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-8 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white rounded-full text-xs font-black transition-colors shadow cursor-pointer"
              >
                <Save size={14} />
                <span>Save credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table Grid of Members */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <RefreshCw className="animate-spin" size={16} />
          <span>Retrieving team registry from Supabase...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <Briefcase size={48} className="text-gray-300 mx-auto" />
          <h3 className="font-sans font-extrabold text-lg text-neutral-900">No Team Members Found</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Get started by registering officers and scientists using the "Add Member" button.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-gray-100">
                  <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider">Member Details</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider">Role</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider">Biography Summary</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider text-center">Display Order</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={member.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <span className="text-sm font-sans font-extrabold text-neutral-900 block">{member.name}</span>
                          <span className="text-xs text-emerald-700 block mt-0.5">{member.name_bn || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-semibold text-neutral-700 block">{member.role}</span>
                      <span className="text-xs text-gray-400 block mt-0.5">{member.role_bn || 'N/A'}</span>
                    </td>
                    <td className="p-5 max-w-xs">
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed" title={member.bio}>
                        {member.bio}
                      </p>
                    </td>
                    <td className="p-5 text-center">
                      <span className="px-2.5 py-1 bg-neutral-100 border border-gray-200 rounded-full text-xs font-semibold text-neutral-700">
                        {member.display_order}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(member)}
                          className="p-1.5 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                          title="Edit credentials"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Remove from registry"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
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
