import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminExtensions } from './AdminExtensions';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';
import {
  AdminSettings,
  AdminPaymentMethods,
  AdminSupportLinks,
  AdminReviews,
  AdminFAQ,
} from './AdminSettings';
import { AdminCoupons } from './AdminCoupons';
import { AdminBlog } from './AdminBlog';
import { Modal } from '../../components/ui/Modal';

export const AdminPage: React.FC = () => {
  const { isAuthenticated, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'analytics':
        return <AdminDashboard />;
      case 'extensions':
        return <AdminExtensions />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      case 'coupons':
        return <AdminCoupons />;
      case 'payment-methods':
        return <AdminPaymentMethods />;
      case 'support-links':
        return <AdminSupportLinks />;
      case 'reviews':
        return <AdminReviews />;
      case 'faq':
        return <AdminFAQ />;
      case 'blog':
        return <AdminBlog />;
      case 'settings':
      case 'seo':
      case 'smtp':
        return <AdminSettings />;
      case 'notifications':
        return <AdminNotifications />;
      default:
        return (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-5xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-slate-400">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

// Inline Notifications Admin
const AdminNotifications: React.FC = () => {
  const { notifications, addNotification, markAllNotificationsRead } = useStore();
  const [form, setForm] = useState({ title: '', message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    addNotification({
      id: Date.now().toString(),
      ...form,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setIsOpen(false);
    setForm({ title: '', message: '', type: 'info' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Notifications</h2>
          <p className="text-slate-400 text-sm mt-1">{notifications.filter(n => !n.isRead).length} unread</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllNotificationsRead} className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl hover:text-white transition-colors">
            Mark All Read
          </button>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
            Send Notification
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`p-5 rounded-2xl border transition-all ${!n.isRead ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-slate-800/60 border-slate-700/50'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${!n.isRead ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                  <p className="font-semibold text-white">{n.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                    n.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    n.type === 'error' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{n.type}</span>
                </div>
                <p className="text-slate-400 text-sm">{n.message}</p>
                <p className="text-xs text-slate-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
            <p className="text-slate-400">No notifications</p>
          </div>
        )}
      </div>

      {isOpen && (
        <Modal title="Send Notification" isOpen={isOpen} onClose={() => setIsOpen(false)} footer={
          <>
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-sm">Cancel</button>
            <button onClick={handleSend} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">Send</button>
          </>
        }>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
              <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as any }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
