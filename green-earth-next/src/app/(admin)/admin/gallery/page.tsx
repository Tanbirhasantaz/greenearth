'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Camera, Plus, Edit, Trash, RefreshCw, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventNameBn, setEventNameBn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const fetchGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbErr) throw dbErr;
      setGallery(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddForm = () => {
    setEditId(null);
    setTitle('');
    setTitleBn('');
    setEventName('');
    setEventNameBn('');
    setImageUrl('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');
    setMediaType('image');
    setFormOpen(true);
  };

  const openEditForm = (item: any) => {
    setEditId(item.id);
    setTitle(item.title);
    setTitleBn(item.title_bn || '');
    setEventName(item.event_name || '');
    setEventNameBn(item.event_name_bn || '');
    setImageUrl(item.image_url);
    setMediaType(item.media_type || 'image');
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    
    setSuccessMsg('');
    setError('');
    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;

      setSuccessMsg('Gallery item deleted successfully.');
      setGallery(prev => prev.filter(item => item.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete gallery item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setError('');

    const payload = {
      title,
      title_bn: titleBn,
      event_name: eventName,
      event_name_bn: eventNameBn,
      image_url: imageUrl,
      media_type: mediaType
    };

    try {
      const supabase = createClient();

      if (editId) {
        // Edit mode
        const { error: patchErr } = await supabase
          .from('gallery_items')
          .update(payload)
          .eq('id', editId);

        if (patchErr) throw patchErr;

        setSuccessMsg('Gallery item updated successfully.');
        setGallery(prev =>
          prev.map(item => item.id === editId ? { ...item, ...payload } : item)
        );
      } else {
        // Add mode
        const { data, error: postErr } = await supabase
          .from('gallery_items')
          .insert([payload])
          .select();

        if (postErr) throw postErr;

        setSuccessMsg('New gallery item added successfully.');
        if (data && data[0]) {
          setGallery(prev => [data[0], ...prev]);
        }
      }

      setFormOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving the gallery item.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Camera size={32} className="text-forest-green" />
            <span>Media Gallery Manager</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage media assets, photos, event highlights, and eco-campaign documentation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGallery}
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
            <span>Add Media Item</span>
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
              {editId ? 'Modify Gallery Asset' : 'Publish New Gallery Asset'}
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
                  Image/Video Title (English)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                  placeholder="e.g. Coastal Mangrove Plantation"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Image/Video Title (Bangla / বাংলা)
                </label>
                <input
                  type="text"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  placeholder="যেমন: উপকূলীয় ম্যানগ্রোভ রোপণ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Event/Campaign Name (English)
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  placeholder="e.g. Mangrove Drive 2025"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Event/Campaign Name (Bangla / বাংলা)
                </label>
                <input
                  type="text"
                  value={eventNameBn}
                  onChange={(e) => setEventNameBn(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  placeholder="যেমন: ম্যানগ্রোভ অভিযান ২০২৫"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Media Source URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  required
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Media Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                  className="w-full bg-[#FAFAF7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green cursor-pointer"
                >
                  <option value="image">Still Image</option>
                  <option value="video">Motion Video link</option>
                </select>
              </div>
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
                <span>Publish Item</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <RefreshCw className="animate-spin" size={16} />
          <span>Retrieving media gallery from Supabase...</span>
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <Camera size={48} className="text-gray-300 mx-auto" />
          <h3 className="font-sans font-extrabold text-lg text-neutral-900">No Gallery Items Found</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Get started by adding photos or videos of campaigns to show the public.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-forest-green transition-all duration-300">
              <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 text-white rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {item.media_type || 'image'}
                </span>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-2">
                    {item.event_name || 'General Event'}
                  </span>
                  <h3 className="font-sans font-extrabold text-base text-neutral-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.title_bn || 'বাংলা শিরোনাম নেই'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-1.5 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                    title="Edit item details"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
