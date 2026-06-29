import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const ContactPage: React.FC = () => {
  const { siteSettings, supportLinks } = useStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll get back to you within 24 hours.', { style: { background: '#1e293b', color: '#fff' } });
    setForm({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: siteSettings.contactEmail, href: `mailto:${siteSettings.contactEmail}` },
    { icon: Phone, label: 'Phone', value: siteSettings.contactPhone, href: `tel:${siteSettings.contactPhone}` },
    { icon: MapPin, label: 'Address', value: siteSettings.contactAddress, href: siteSettings.mapUrl },
    { icon: Clock, label: 'Business Hours', value: 'Mon–Fri: 9AM–6PM EST', href: null },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-400">We're here to help. Reach out through any channel below.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={22} className="text-indigo-400" />
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                  <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={6} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" placeholder="Tell us how we can help you..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={16} />Send Message</>}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map(info => {
                const Icon = info.icon;
                const content = (
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                      <Icon size={18} className="text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{info.label}</p>
                    <p className="text-white font-medium text-sm">{info.value}</p>
                  </div>
                );
                return info.href ? (
                  <a key={info.label} href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    {content}
                  </a>
                ) : <div key={info.label}>{content}</div>;
              })}
            </div>

            {/* Support Links */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Support</h3>
              <div className="grid grid-cols-2 gap-3">
                {supportLinks.filter(s => s.isActive).map(sl => (
                  <a
                    key={sl.id}
                    href={sl.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform" style={{ background: sl.color }}>
                      {sl.icon?.[0]?.toUpperCase() || sl.title[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{sl.title}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-indigo-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Map View</p>
                <a href={siteSettings.mapUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-xs hover:underline">
                  View on Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
