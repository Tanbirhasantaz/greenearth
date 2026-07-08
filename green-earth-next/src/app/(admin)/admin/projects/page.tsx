'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Project, ProjectCategory, ProjectStatus } from '@/types';
import { TreePine, Plus, Edit, Trash, RefreshCw, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('tree_plantation');
  const [location, setLocation] = useState('');
  const [locationBn, setLocationBn] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('ongoing');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [impactSummaryBn, setImpactSummaryBn] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbErr) throw dbErr;
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddForm = () => {
    setEditId(null);
    setTitle('');
    setTitleBn('');
    setSlug('');
    setCategory('tree_plantation');
    setLocation('');
    setLocationBn('');
    setStatus('ongoing');
    setDescription('');
    setDescriptionBn('');
    setImpactSummary('');
    setImpactSummaryBn('');
    setCoverImageUrl('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');
    setFormOpen(true);
  };

  const openEditForm = (proj: Project) => {
    setEditId(proj.id);
    setTitle(proj.title);
    setTitleBn(proj.title_bn || '');
    setSlug(proj.slug);
    setCategory(proj.category);
    setLocation(proj.location);
    setLocationBn(proj.location_bn || '');
    setStatus(proj.status);
    setDescription(proj.description);
    setDescriptionBn(proj.description_bn || '');
    setImpactSummary(proj.impact_summary);
    setImpactSummaryBn(proj.impact_summary_bn || '');
    setCoverImageUrl(proj.cover_image_url);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this project Campaign? This action is irreversible.')) return;
    
    setSuccessMsg('');
    setError('');
    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;

      setSuccessMsg('Project campaign deleted successfully.');
      setProjects(prev => prev.filter(p => p.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete project.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setError('');

    const payload = {
      title,
      title_bn: titleBn,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      location,
      location_bn: locationBn,
      status,
      description,
      description_bn: descriptionBn,
      impact_summary: impactSummary,
      impact_summary_bn: impactSummaryBn,
      cover_image_url: coverImageUrl
    };

    try {
      const supabase = createClient();

      if (editId) {
        // Edit mode
        const { data, error: patchErr } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editId)
          .select();

        if (patchErr) throw patchErr;

        setSuccessMsg('Project campaign updated successfully.');
        setProjects(prev =>
          prev.map(p => p.id === editId ? { ...p, ...payload } : p)
        );
      } else {
        // Add mode
        const { data, error: postErr } = await supabase
          .from('projects')
          .insert([payload])
          .select();

        if (postErr) throw postErr;

        setSuccessMsg('New project campaign registered successfully.');
        if (data && data[0]) {
          setProjects(prev => [data[0], ...prev]);
        }
      }

      setFormOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving the project campaign.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <TreePine size={32} className="text-forest-green" />
            <span>Campaign Projects Manager</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Conduct full CRUD operations to document planting campaigns, solar micro-grids, and water purity filtration units.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
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
            <span>Add Campaign</span>
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

      {/* Listing Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <RefreshCw className="animate-spin" size={16} />
          <span>Loading campaigns database...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto">
          <TreePine size={44} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-sans font-extrabold text-lg text-neutral-800">No projects recorded</h3>
          <p className="text-gray-400 text-xs mt-2">Click "Add Campaign" to seed the first environmental project record.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="p-6">Project Title</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Location</th>
                  <th className="p-6">Impact Summary</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF7]/50 transition-colors">
                    {/* Title */}
                    <td className="p-6">
                      <span className="font-sans font-bold text-neutral-900 block">{p.title}</span>
                      <span className="text-xs text-gray-400 font-semibold block mt-0.5">{p.title_bn || 'N/A'}</span>
                    </td>

                    {/* Category */}
                    <td className="p-6">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {p.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="p-6">
                      <span className="font-semibold block">{p.location}</span>
                      <span className="text-xs text-gray-400 block mt-0.5">{p.location_bn || 'N/A'}</span>
                    </td>

                    {/* Impact */}
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-forest-green block">{p.impact_summary}</span>
                    </td>

                    {/* Status */}
                    <td className="p-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(p)}
                        className="p-2 text-gray-500 hover:text-forest-green hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Add/Edit Overlay Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-neutral-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAFAF7] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-sans font-extrabold text-neutral-900">
                {editId ? 'Modify Project Campaign' : 'Register New Campaign'}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 flex-1 text-sm">
              
              {/* Title group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Campaign Title (English)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Mangrove Plantation Satkhira"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Campaign Title (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    required
                    placeholder="যেমন: উপকূলীয় ম্যানগ্রোভ বনায়ন"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
              </div>

              {/* Category, slug and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green cursor-pointer"
                  >
                    <option value="tree_plantation">Tree Plantation</option>
                    <option value="renewable_energy">Renewable Energy</option>
                    <option value="water_sanitation">Water Sanitation</option>
                    <option value="waste_management">Waste Management</option>
                    <option value="awareness_campaign">Awareness Campaign</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Campaign Slug (Url)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. satkhira-mangrove"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green cursor-pointer"
                  >
                    <option value="ongoing">Ongoing (চলমান)</option>
                    <option value="completed">Completed (সম্পন্ন)</option>
                  </select>
                </div>
              </div>

              {/* Location group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Location Name (English)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="e.g. Satkhira, Sundarbans"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Location Name (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={locationBn}
                    onChange={(e) => setLocationBn(e.target.value)}
                    required
                    placeholder="যেমন: সাতক্ষীরা, সুন্দরবন"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
              </div>

              {/* Impact summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Impact Slogan (English)</label>
                  <input
                    type="text"
                    value={impactSummary}
                    onChange={(e) => setImpactSummary(e.target.value)}
                    required
                    placeholder="e.g. 25,000+ Saplings Planted"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Impact Slogan (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={impactSummaryBn}
                    onChange={(e) => setImpactSummaryBn(e.target.value)}
                    required
                    placeholder="যেমন: ২৫,০০০+ রোপিত চারাগাছ"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Campaign Description (English)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Provide multi-paragraph insights..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Campaign Description (Bangla / বাংলা)</label>
                <textarea
                  rows={4}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  required
                  placeholder="বিস্তারিত বর্ণনা বাংলায় লিখুন..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                />
              </div>

              {/* Footer Operations */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-full font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-forest-green hover:bg-deep-forest text-white rounded-full font-bold text-xs uppercase tracking-wide shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{editId ? 'Save Campaign' : 'Register Campaign'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
