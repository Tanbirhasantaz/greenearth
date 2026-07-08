'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/types';
import { BookOpen, Plus, Edit, Trash, RefreshCw, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Ecology');
  const [categoryBn, setCategoryBn] = useState('পরিবেশবিদ্যা');
  const [excerpt, setExcerpt] = useState('');
  const [excerptBn, setExcerptBn] = useState('');
  const [content, setContent] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (dbErr) throw dbErr;
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddForm = () => {
    setEditId(null);
    setTitle('');
    setTitleBn('');
    setSlug('');
    setCategory('Ecology');
    setCategoryBn('পরিবেশবিদ্যা');
    setExcerpt('');
    setExcerptBn('');
    setContent('');
    setContentBn('');
    setCoverImageUrl('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80');
    setFormOpen(true);
  };

  const openEditForm = (post: BlogPost) => {
    setEditId(post.id);
    setTitle(post.title);
    setTitleBn(post.title_bn || '');
    setSlug(post.slug);
    setCategory(post.category);
    setCategoryBn(post.category_bn || '');
    setExcerpt(post.excerpt);
    setExcerptBn(post.excerpt_bn || '');
    setContent(post.content);
    setContentBn(post.content_bn || '');
    setCoverImageUrl(post.cover_image_url);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this blog post? This is irreversible.')) return;

    setSuccessMsg('');
    setError('');
    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;

      setSuccessMsg('Blog article deleted successfully.');
      setBlogs(prev => prev.filter(b => b.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete blog post.');
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
      category_bn: categoryBn,
      excerpt,
      excerpt_bn: excerptBn,
      content,
      content_bn: contentBn,
      cover_image_url: coverImageUrl,
      published_at: new Date().toISOString()
    };

    try {
      const supabase = createClient();

      if (editId) {
        const { error: patchErr } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editId);

        if (patchErr) throw patchErr;

        setSuccessMsg('Blog article updated successfully.');
        setBlogs(prev =>
          prev.map(b => b.id === editId ? { ...b, ...payload } : b)
        );
      } else {
        const { data, error: postErr } = await supabase
          .from('blog_posts')
          .insert([payload])
          .select();

        if (postErr) throw postErr;

        setSuccessMsg('New blog article published successfully.');
        if (data && data[0]) {
          setBlogs(prev => [data[0], ...prev]);
        }
      }

      setFormOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving the blog article.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <BookOpen size={32} className="text-forest-green" />
            <span>Blog Editor Panel</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Publish, edit, and moderate ecological reviews, household green-living guidelines, and coastal field notes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBlogs}
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
            <span>Write Article</span>
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
          <span>Loading articles list...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto">
          <BookOpen size={44} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-sans font-extrabold text-lg text-neutral-800">No blog posts found</h3>
          <p className="text-gray-400 text-xs mt-2">Click "Write Article" to publish your first informational piece.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="p-6">Article Details</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Excerpt Summary</th>
                  <th className="p-6">Published on</th>
                  <th className="p-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAFAF7]/50 transition-colors">
                    {/* Title */}
                    <td className="p-6">
                      <span className="font-sans font-bold text-neutral-900 block">{b.title}</span>
                      <span className="text-xs text-gray-400 font-semibold block mt-1">{b.title_bn || 'N/A'}</span>
                    </td>

                    {/* Category */}
                    <td className="p-6">
                      <span className="px-2.5 py-1 bg-[#6B4226]/5 text-[#6B4226] border border-[#6B4226]/10 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {b.category}
                      </span>
                    </td>

                    {/* Excerpt */}
                    <td className="p-6 max-w-xs">
                      <span className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{b.excerpt}</span>
                    </td>

                    {/* Published At */}
                    <td className="p-6">
                      <span className="text-xs text-gray-400 font-mono block">
                        {new Date(b.published_at || b.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(b)}
                        className="p-2 text-gray-500 hover:text-forest-green hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
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

      {/* Write / Edit form Modal Overlay */}
      {formOpen && (
        <div className="fixed inset-0 bg-neutral-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAFAF7] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-sans font-extrabold text-neutral-900">
                {editId ? 'Edit Article Details' : 'Write New Article'}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 flex-1 text-sm">
              
              {/* Title group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Article Title (English)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Household Recycling Guide"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Article Title (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    required
                    placeholder="যেমন: গৃহস্থালি বর্জ্য রিসাইকেল গাইড"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
              </div>

              {/* Category, URL slug and cover image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Category (English)</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="e.g. Ecology, Energy"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Category (Bangla / বাংলা)</label>
                  <input
                    type="text"
                    value={categoryBn}
                    onChange={(e) => setCategoryBn(e.target.value)}
                    required
                    placeholder="যেমন: পরিবেশবিদ্যা"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. domestic-waste-recycling"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Cover Photo URL</label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green"
                />
              </div>

              {/* Excerpt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Short Summary / Excerpt (English)</label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    placeholder="Quick hook summary for lists..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Short Summary / Excerpt (Bangla / বাংলা)</label>
                  <textarea
                    rows={2}
                    value={excerptBn}
                    onChange={(e) => setExcerptBn(e.target.value)}
                    required
                    placeholder="সংক্ষিপ্ত সারাংশ বাংলায়..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                  />
                </div>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Detailed Content (English)</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Provide deep multi-paragraph article body here..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-green resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Detailed Content (Bangla / বাংলা)</label>
                <textarea
                  rows={6}
                  value={contentBn}
                  onChange={(e) => setContentBn(e.target.value)}
                  required
                  placeholder="বিস্তারিত নিবন্ধ বাংলায় লিখুন..."
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
                  <span>{editId ? 'Save Post' : 'Publish Post'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
