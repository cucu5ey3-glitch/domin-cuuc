import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Tag, Copy } from 'lucide-react';
import { useStore, Coupon } from '../../store/useStore';
import { generateId, formatDate } from '../../utils/helpers';
import { Toggle } from '../../components/ui/Toggle';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export const AdminCoupons: React.FC = () => {
  const { coupons, setCoupons } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '', type: 'percentage' as 'percentage' | 'fixed', value: 10,
    minOrder: 0, maxUses: 100, isActive: true, expiresAt: ''
  });

  const handleSave = () => {
    if (!form.code) { toast.error('Please enter a coupon code'); return; }
    if (editing) {
      setCoupons(coupons.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const exists = coupons.find(c => c.code.toLowerCase() === form.code.toLowerCase());
      if (exists) { toast.error('Coupon code already exists'); return; }
      setCoupons([...coupons, { ...form, id: generateId(), usedCount: 0 }]);
    }
    toast.success(editing ? 'Updated!' : 'Created!', { style: { background: '#1e293b', color: '#fff' } });
    setIsOpen(false);
  };

  const openEdit = (c: Coupon) => { setEditing(c); setForm(c); setIsOpen(true); };
  const openCreate = () => { setEditing(null); setForm({ code: '', type: 'percentage', value: 10, minOrder: 0, maxUses: 100, isActive: true, expiresAt: '' }); setIsOpen(true); };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied!', { style: { background: '#1e293b', color: '#fff' } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Coupons</h2>
          <p className="text-slate-400 text-sm mt-1">{coupons.length} coupon codes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-slate-800/60 border rounded-2xl p-5 transition-all ${coupon.isActive ? 'border-slate-700/50' : 'border-slate-800/30 opacity-60'}`}
          >
            {/* Coupon Code */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-indigo-400" />
                <code className="text-xl font-black text-white tracking-wider">{coupon.code}</code>
              </div>
              <button onClick={() => handleCopy(coupon.code)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <Copy size={13} />
              </button>
            </div>

            {/* Value */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl font-black text-indigo-400">
                {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
              </span>
              <span className="text-slate-400 text-sm">off</span>
              <Badge variant={coupon.type === 'percentage' ? 'purple' : 'info'} size="sm">
                {coupon.type}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-1.5 mb-4 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Min. Order</span>
                <span className="text-white">${coupon.minOrder}</span>
              </div>
              <div className="flex justify-between">
                <span>Uses</span>
                <span className="text-white">{coupon.usedCount} / {coupon.maxUses}</span>
              </div>
              {coupon.expiresAt && (
                <div className="flex justify-between">
                  <span>Expires</span>
                  <span className="text-white">{formatDate(coupon.expiresAt)}</span>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="h-1.5 bg-slate-700 rounded-full">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Toggle checked={coupon.isActive} onChange={() => setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))} size="sm" />
              <div className="flex gap-1">
                <button onClick={() => openEdit(coupon)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => setCoupons(coupons.filter(c => c.id !== coupon.id))} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Coupon' : 'Create Coupon'} footer={
        <>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Save</button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Coupon Code *</label>
            <input
              value={form.code}
              onChange={e => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="WELCOME10"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as any }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Value</label>
              <input type="number" min="0" value={form.value} onChange={e => setForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Min. Order ($)</label>
              <input type="number" min="0" value={form.minOrder} onChange={e => setForm(prev => ({ ...prev, minOrder: parseFloat(e.target.value) || 0 }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Max Uses</label>
              <input type="number" min="1" value={form.maxUses} onChange={e => setForm(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 1 }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Expires At</label>
            <input type="date" value={form.expiresAt} onChange={e => setForm(prev => ({ ...prev, expiresAt: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <Toggle checked={form.isActive} onChange={v => setForm(prev => ({ ...prev, isActive: v }))} label="Active" />
        </div>
      </Modal>
    </div>
  );
};
