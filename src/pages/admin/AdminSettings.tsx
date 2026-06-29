import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Globe, Mail, Shield, Palette, Search, Hash,
  Save, AlertTriangle, Plus, Trash2, Edit2, Check, X, Star, HelpCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Toggle } from '../../components/ui/Toggle';
import { Modal } from '../../components/ui/Modal';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useStore();
  const [form, setForm] = useState(siteSettings);
  const [activeSection, setActiveSection] = useState('general');

  const handleSave = () => {
    updateSiteSettings(form);
    toast.success('Settings saved!', { style: { background: '#1e293b', color: '#fff' } });
  };

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'smtp', label: 'SMTP', icon: Mail },
    { id: 'tax', label: 'Tax & Currency', icon: Hash },
    { id: 'maintenance', label: 'Maintenance', icon: Shield },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Site Settings</h2>
          <p className="text-slate-400 text-sm mt-1">Configure your website settings</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg">
          <Save size={15} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-2 space-y-1">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                >
                  <Icon size={15} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            {/* General */}
            {activeSection === 'general' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">General Settings</h3>
                {[
                  { key: 'siteName', label: 'Site Name', placeholder: 'DomainHub' },
                  { key: 'tagline', label: 'Tagline', placeholder: 'Find Your Perfect Domain' },
                  { key: 'logo', label: 'Logo (emoji or URL)', placeholder: '🌐' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{f.label}</label>
                    <input
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Language</label>
                  <select
                    value={form.language}
                    onChange={e => setForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="en">English (LTR)</option>
                    <option value="ar">Arabic (RTL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Timezone</label>
                  <select
                    value={form.timezone}
                    onChange={e => setForm(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                    <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact */}
            {activeSection === 'contact' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">Contact Information</h3>
                {[
                  { key: 'contactEmail', label: 'Contact Email' },
                  { key: 'contactPhone', label: 'Phone Number' },
                  { key: 'contactAddress', label: 'Address' },
                  { key: 'mapUrl', label: 'Google Maps URL' },
                  { key: 'whatsappNumber', label: 'WhatsApp Number (international format)' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{f.label}</label>
                    <input
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Social */}
            {activeSection === 'social' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">Social Media Links</h3>
                {[
                  { key: 'facebookUrl', label: 'Facebook URL' },
                  { key: 'twitterUrl', label: 'Twitter/X URL' },
                  { key: 'instagramUrl', label: 'Instagram URL' },
                  { key: 'telegramUrl', label: 'Telegram URL' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{f.label}</label>
                    <input
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder="https://"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SEO */}
            {activeSection === 'seo' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">SEO Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Meta Title</label>
                  <input value={form.metaTitle} onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                  <p className="text-xs text-slate-500 mt-1">{form.metaTitle.length}/60 chars</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value }))} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
                  <p className="text-xs text-slate-500 mt-1">{form.metaDescription.length}/160 chars</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Keywords</label>
                  <input value={form.metaKeywords} onChange={e => setForm(prev => ({ ...prev, metaKeywords: e.target.value }))} placeholder="domain, register domain, .com" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Analytics ID (Google Analytics)</label>
                  <input value={form.analyticsId} onChange={e => setForm(prev => ({ ...prev, analyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            )}

            {/* SMTP */}
            {activeSection === 'smtp' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">Email / SMTP Settings</h3>
                {[
                  { key: 'smtpHost', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
                  { key: 'smtpPort', label: 'SMTP Port', placeholder: '587' },
                  { key: 'smtpEmail', label: 'SMTP Email', placeholder: 'noreply@yoursite.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                ))}
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-sm text-yellow-400 font-medium flex items-center gap-2">
                    <AlertTriangle size={14} /> SMTP credentials are stored securely
                  </p>
                  <p className="text-xs text-slate-400 mt-1">In production, store passwords in environment variables</p>
                </div>
              </div>
            )}

            {/* Tax & Currency */}
            {activeSection === 'tax' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">Tax & Currency</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Currency</label>
                  <select value={form.currency} onChange={e => setForm(prev => ({ ...prev, currency: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EGP">EGP - Egyptian Pound</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Currency Symbol</label>
                  <input value={form.currencySymbol} onChange={e => setForm(prev => ({ ...prev, currencySymbol: e.target.value }))} placeholder="$" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tax Rate (%)</label>
                  <input type="number" min="0" max="100" step="0.5" value={form.taxRate} onChange={e => setForm(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            )}

            {/* Maintenance */}
            {activeSection === 'maintenance' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-5">Maintenance Mode</h3>
                <div className={`p-5 rounded-2xl border-2 transition-all ${form.maintenanceMode ? 'border-red-500/50 bg-red-500/5' : 'border-slate-700 bg-slate-800/30'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">Maintenance Mode</p>
                      <p className="text-sm text-slate-400">When enabled, visitors see a maintenance page</p>
                    </div>
                    <Toggle
                      checked={form.maintenanceMode}
                      onChange={v => setForm(prev => ({ ...prev, maintenanceMode: v }))}
                    />
                  </div>
                  {form.maintenanceMode && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertTriangle size={14} className="text-red-400" />
                      <p className="text-sm text-red-400 font-medium">Site is currently in maintenance mode!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-700">
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminPaymentMethods: React.FC = () => {
  const { paymentMethods, setPaymentMethods } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', logo: '💳', accountNumber: '', receiverName: '', description: '', instructions: '', qrCode: '', isActive: true, sortOrder: 0 });

  const handleSave = () => {
    if (editing) {
      setPaymentMethods(paymentMethods.map(p => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      setPaymentMethods([...paymentMethods, { ...form, id: generateId() }]);
    }
    toast.success(editing ? 'Updated!' : 'Created!', { style: { background: '#1e293b', color: '#fff' } });
    setIsOpen(false);
  };

  const openEdit = (pm: any) => { setEditing(pm); setForm(pm); setIsOpen(true); };
  const openCreate = () => { setEditing(null); setForm({ name: '', logo: '💳', accountNumber: '', receiverName: '', description: '', instructions: '', qrCode: '', isActive: true, sortOrder: paymentMethods.length + 1 }); setIsOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Payment Methods</h2>
          <p className="text-slate-400 text-sm mt-1">Configure payment options for customers</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={15} /> Add Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map(pm => (
          <motion.div key={pm.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pm.logo}</span>
                <div>
                  <h4 className="font-bold text-white">{pm.name}</h4>
                  <p className="text-xs text-slate-400">{pm.accountNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Toggle checked={pm.isActive} onChange={() => setPaymentMethods(paymentMethods.map(p => p.id === pm.id ? { ...p, isActive: !p.isActive } : p))} size="sm" />
                <button onClick={() => openEdit(pm)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => setPaymentMethods(paymentMethods.filter(p => p.id !== pm.id))} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400">{pm.description}</p>
            <p className="text-xs text-slate-500 mt-2">Receiver: {pm.receiverName}</p>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Payment Method' : 'Add Payment Method'} footer={
        <>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Save</button>
        </>
      }>
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Name', placeholder: 'InstaPay' },
            { key: 'logo', label: 'Logo (emoji)', placeholder: '💳' },
            { key: 'accountNumber', label: 'Account Number / ID', placeholder: '01012345678' },
            { key: 'receiverName', label: 'Receiver Name', placeholder: 'Your Name' },
            { key: 'description', label: 'Short Description', placeholder: 'Pay via...' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-300 mb-1">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Instructions</label>
            <textarea value={form.instructions} onChange={e => setForm(prev => ({ ...prev, instructions: e.target.value }))} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <Toggle checked={form.isActive} onChange={v => setForm(prev => ({ ...prev, isActive: v }))} label="Active" />
        </div>
      </Modal>
    </div>
  );
};

export const AdminSupportLinks: React.FC = () => {
  const { supportLinks, setSupportLinks } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', icon: 'whatsapp', link: '', isActive: true, sortOrder: 0, color: '#25D366' });

  const handleSave = () => {
    if (editing) {
      setSupportLinks(supportLinks.map(s => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      setSupportLinks([...supportLinks, { ...form, id: generateId() }]);
    }
    toast.success('Saved!', { style: { background: '#1e293b', color: '#fff' } });
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Support Links</h2>
          <p className="text-slate-400 text-sm mt-1">Manage customer support channels</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: '', icon: 'whatsapp', link: '', isActive: true, sortOrder: supportLinks.length + 1, color: '#25D366' }); setIsOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">
          <Plus size={15} /> Add Link
        </button>
      </div>

      <div className="space-y-3">
        {supportLinks.map(sl => (
          <div key={sl.id} className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: sl.color }}>
                {sl.icon?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <p className="font-semibold text-white">{sl.title}</p>
                <p className="text-xs text-slate-400 truncate max-w-xs">{sl.link}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Toggle checked={sl.isActive} onChange={() => setSupportLinks(supportLinks.map(s => s.id === sl.id ? { ...s, isActive: !s.isActive } : s))} size="sm" />
              <button onClick={() => { setEditing(sl); setForm(sl); setIsOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit2 size={13} /></button>
              <button onClick={() => setSupportLinks(supportLinks.filter(s => s.id !== sl.id))} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Support Link' : 'Add Support Link'} footer={
        <>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Save</button>
        </>
      }>
        <div className="space-y-4">
          {[{ key: 'title', label: 'Title', placeholder: 'WhatsApp' }, { key: 'icon', label: 'Icon (name)', placeholder: 'whatsapp' }, { key: 'link', label: 'Link/URL', placeholder: 'https://wa.me/...' }, { key: 'color', label: 'Color', placeholder: '#25D366' }].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-300 mb-1">{f.label}</label>
              <input type={f.key === 'color' ? 'color' : 'text'} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          ))}
          <Toggle checked={form.isActive} onChange={v => setForm(prev => ({ ...prev, isActive: v }))} label="Active" />
        </div>
      </Modal>
    </div>
  );
};

export const AdminReviews: React.FC = () => {
  const { reviews, setReviews } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', avatar: '', rating: 5, comment: '', country: '', isActive: true });

  const handleSave = () => {
    if (editing) {
      setReviews(reviews.map(r => r.id === editing.id ? { ...r, ...form } : r));
    } else {
      setReviews([...reviews, { ...form, id: generateId(), createdAt: new Date().toISOString() }]);
    }
    toast.success('Saved!', { style: { background: '#1e293b', color: '#fff' } });
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Reviews</h2>
          <p className="text-slate-400 text-sm mt-1">{reviews.length} reviews</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', avatar: '', rating: 5, comment: '', country: '', isActive: true }); setIsOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">
          <Plus size={15} /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(review => (
          <div key={review.id} className={`p-5 rounded-2xl border transition-all ${review.isActive ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-900/30 border-slate-800/30 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {review.avatar || review.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Toggle checked={review.isActive} onChange={() => setReviews(reviews.map(r => r.id === review.id ? { ...r, isActive: !r.isActive } : r))} size="sm" />
                <button onClick={() => { setEditing(review); setForm(review); setIsOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg"><Edit2 size={12} /></button>
                <button onClick={() => setReviews(reviews.filter(r => r.id !== review.id))} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={12} /></button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />)}
            </div>
            <p className="text-slate-400 text-sm line-clamp-2">"{review.comment}"</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Review' : 'Add Review'} footer={
        <>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Save</button>
        </>
      }>
        <div className="space-y-4">
          {[{ key: 'name', label: 'Name' }, { key: 'avatar', label: 'Avatar Initials (e.g., AH)' }, { key: 'country', label: 'Country (with flag, e.g., Egypt 🇪🇬)' }].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-300 mb-1">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setForm(prev => ({ ...prev, rating: n }))} className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${form.rating >= n ? 'bg-yellow-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Review Comment</label>
            <textarea value={form.comment} onChange={e => setForm(prev => ({ ...prev, comment: e.target.value }))} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <Toggle checked={form.isActive} onChange={v => setForm(prev => ({ ...prev, isActive: v }))} label="Active" />
        </div>
      </Modal>
    </div>
  );
};

export const AdminFAQ: React.FC = () => {
  const { faqs, setFaqs } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General', isActive: true, sortOrder: 0 });

  const handleSave = () => {
    if (editing) {
      setFaqs(faqs.map(f => f.id === editing.id ? { ...f, ...form } : f));
    } else {
      setFaqs([...faqs, { ...form, id: generateId() }]);
    }
    toast.success('Saved!', { style: { background: '#1e293b', color: '#fff' } });
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">FAQ Management</h2>
          <p className="text-slate-400 text-sm mt-1">{faqs.length} FAQ items</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ question: '', answer: '', category: 'General', isActive: true, sortOrder: faqs.length + 1 }); setIsOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">
          <Plus size={15} /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map(faq => (
          <div key={faq.id} className={`p-5 rounded-2xl border ${faq.isActive ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-900/30 border-slate-800/30 opacity-60'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle size={14} className="text-indigo-400" />
                  <p className="font-semibold text-white text-sm">{faq.question}</p>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{faq.answer}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-700 text-slate-400 rounded-full text-xs">{faq.category}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Toggle checked={faq.isActive} onChange={() => setFaqs(faqs.map(f => f.id === faq.id ? { ...f, isActive: !f.isActive } : f))} size="sm" />
                <button onClick={() => { setEditing(faq); setForm(faq); setIsOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg"><Edit2 size={12} /></button>
                <button onClick={() => setFaqs(faqs.filter(f => f.id !== faq.id))} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'} footer={
        <>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Save</button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Question</label>
            <input value={form.question} onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Answer</label>
            <textarea value={form.answer} onChange={e => setForm(prev => ({ ...prev, answer: e.target.value }))} rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
              {['General', 'Payment', 'Transfer', 'Billing', 'Security', 'Technical'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Toggle checked={form.isActive} onChange={v => setForm(prev => ({ ...prev, isActive: v }))} label="Active" />
        </div>
      </Modal>
    </div>
  );
};
