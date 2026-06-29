import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Globe, FileText, Calendar } from 'lucide-react';
import { useStore, BlogPost } from '../../store/useStore';
import { generateId, formatDate } from '../../utils/helpers';
import { Toggle } from '../../components/ui/Toggle';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export const AdminBlog: React.FC = () => {
  const { blogPosts, setBlogPosts } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: 'General',
    tags: '', image: '', author: 'Admin', isPublished: false,
  });

  const handleSave = () => {
    if (!form.title) { toast.error('Title is required'); return; }
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (editing) {
      setBlogPosts(blogPosts.map(p => p.id === editing.id ? { ...p, ...form, slug, tags: form.tags.split(',').map(t => t.trim()) } : p));
    } else {
      setBlogPosts([...blogPosts, {
        ...form,
        slug,
        id: generateId(),
        tags: form.tags.split(',').map(t => t.trim()),
        createdAt: new Date().toISOString(),
        views: 0,
      }]);
    }
    toast.success(editing ? 'Updated!' : 'Created!', { style: { background: '#1e293b', color: '#fff' } });
    setIsOpen(false);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ ...post, tags: post.tags.join(', ') });
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', category: 'General', tags: '', image: '', author: 'Admin', isPublished: false });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Blog Posts</h2>
          <p className="text-slate-400 text-sm mt-1">{blogPosts.length} articles</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={15} /> New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-white">{blogPosts.length}</div>
          <div className="text-xs text-slate-400 mt-1">Total Posts</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-emerald-400">{blogPosts.filter(p => p.isPublished).length}</div>
          <div className="text-xs text-slate-400 mt-1">Published</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-yellow-400">{blogPosts.filter(p => !p.isPublished).length}</div>
          <div className="text-xs text-slate-400 mt-1">Drafts</div>
        </div>
      </div>

      <div className="space-y-4">
        {blogPosts.map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all"
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-semibold text-white">{post.title}</h4>
                  <Badge variant={post.isPublished ? 'success' : 'warning'} size="sm">
                    {post.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                  <Badge variant="default" size="sm">{post.category}</Badge>
                </div>
                <p className="text-slate-400 text-sm line-clamp-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{post.views} views</span>
                  <span className="flex items-center gap-1"><Globe size={10} />/{post.slug}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Toggle
                checked={post.isPublished}
                onChange={() => setBlogPosts(blogPosts.map(p => p.id === post.id ? { ...p, isPublished: !p.isPublished } : p))}
                size="sm"
              />
              <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                <Edit2 size={14} />
              </button>
              <button onClick={() => setBlogPosts(blogPosts.filter(p => p.id !== post.id))} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {blogPosts.length === 0 && (
          <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
            <FileText size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">No blog posts yet</p>
            <p className="text-slate-400 mb-6">Create your first blog post</p>
            <button onClick={openCreate} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm transition-colors">
              Create Post
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Post' : 'New Blog Post'} size="xl" footer={
        <>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Save Post</button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug (auto-generated)</label>
              <input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="my-post-title" className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                {['General', 'Tips', 'News', 'Trends', 'Education', 'Tutorials'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Content (Markdown)</label>
            <textarea value={form.content} onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))} rows={8} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none font-mono" placeholder="# Heading&#10;&#10;Your content here..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} placeholder="domain, tips, tech" className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Author</label>
              <input value={form.author} onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <Toggle checked={form.isPublished} onChange={v => setForm(prev => ({ ...prev, isPublished: v }))} label="Publish immediately" />
        </div>
      </Modal>
    </div>
  );
};
