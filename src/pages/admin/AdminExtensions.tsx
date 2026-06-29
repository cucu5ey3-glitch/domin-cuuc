import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, Award, Globe, Search, GripVertical } from 'lucide-react';
import { useStore, Extension } from '../../store/useStore';
import { generateId } from '../../utils/helpers';
import { Toggle } from '../../components/ui/Toggle';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const AdminExtensions: React.FC = () => {
  const { extensions, setExtensions } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExt, setEditingExt] = useState<Extension | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '.', price: 12.99, renewPrice: 14.99, transferPrice: 12.99,
    registrationPeriod: 1, isPopular: false, isFeatured: false, isActive: true, sortOrder: 0,
  });

  const filtered = extensions.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditingExt(null);
    setForm({ name: '.', price: 12.99, renewPrice: 14.99, transferPrice: 12.99, registrationPeriod: 1, isPopular: false, isFeatured: false, isActive: true, sortOrder: extensions.length + 1 });
    setIsModalOpen(true);
  };

  const openEdit = (ext: Extension) => {
    setEditingExt(ext);
    setForm({ name: ext.name, price: ext.price, renewPrice: ext.renewPrice, transferPrice: ext.transferPrice, registrationPeriod: ext.registrationPeriod, isPopular: ext.isPopular, isFeatured: ext.isFeatured, isActive: ext.isActive, sortOrder: ext.sortOrder });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.startsWith('.') || form.name.length < 2) {
      toast.error('Extension must start with . (e.g., .com)', { style: { background: '#1e293b', color: '#fff' } });
      return;
    }
    if (editingExt) {
      setExtensions(extensions.map(e => e.id === editingExt.id ? { ...e, ...form, currency: 'USD' } : e));
      toast.success('Extension updated!', { style: { background: '#1e293b', color: '#fff' } });
    } else {
      const exists = extensions.find(e => e.name.toLowerCase() === form.name.toLowerCase());
      if (exists) {
        toast.error('Extension already exists', { style: { background: '#1e293b', color: '#fff' } });
        return;
      }
      setExtensions([...extensions, { ...form, id: generateId(), currency: 'USD' }]);
      toast.success('Extension created!', { style: { background: '#1e293b', color: '#fff' } });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setExtensions(extensions.filter(e => e.id !== id));
    setDeleteConfirm(null);
    toast.success('Extension deleted', { style: { background: '#1e293b', color: '#fff' } });
  };

  const toggleActive = (id: string) => {
    setExtensions(extensions.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Domain Extensions</h2>
          <p className="text-slate-400 text-sm mt-1">{extensions.length} extensions configured</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg"
        >
          <Plus size={16} /> Add Extension
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search extensions..."
          className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Extension</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Register</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Renew</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Transfer</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Badges</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Sort</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.sort((a, b) => a.sortOrder - b.sortOrder).map(ext => (
                <motion.tr
                  key={ext.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-lg font-black text-indigo-400 font-mono">{ext.name}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">${ext.price}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">${ext.renewPrice}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">${ext.transferPrice}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {ext.isPopular && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs">
                          <Star size={10} /> Popular
                        </span>
                      )}
                      {ext.isFeatured && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs">
                          <Award size={10} /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Toggle checked={ext.isActive} onChange={() => toggleActive(ext.id)} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">#{ext.sortOrder}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(ext)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(ext.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExt ? `Edit ${editingExt.name}` : 'Add New Extension'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
              {editingExt ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Extension *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder=".com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">Must start with . (e.g., .com, .online)</p>
          </div>
          {[
            { key: 'price', label: 'Registration Price ($)' },
            { key: 'renewPrice', label: 'Renewal Price ($)' },
            { key: 'transferPrice', label: 'Transfer Price ($)' },
            { key: 'registrationPeriod', label: 'Registration Period (years)' },
            { key: 'sortOrder', label: 'Sort Order' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{field.label}</label>
              <input
                type="number"
                step={field.key === 'price' || field.key === 'renewPrice' || field.key === 'transferPrice' ? '0.01' : '1'}
                value={(form as any)[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
          <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
            <Toggle checked={form.isPopular} onChange={v => setForm(f => ({ ...f, isPopular: v }))} label="Popular Badge" />
            <Toggle checked={form.isFeatured} onChange={v => setForm(f => ({ ...f, isFeatured: v }))} label="Featured Badge" />
            <Toggle checked={form.isActive} onChange={v => setForm(f => ({ ...f, isActive: v }))} label="Active" />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Extension" size="sm">
        <p className="text-slate-400 mb-6">Are you sure you want to delete this extension? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-sm hover:border-slate-500 transition-colors">Cancel</button>
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
};
