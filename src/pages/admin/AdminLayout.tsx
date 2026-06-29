import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Users, Package, CreditCard, Settings,
  Tag, MessageSquare, Star, HelpCircle, Bell, FileText, Image,
  Globe2, Link2, ChevronDown, LogOut, Menu, X, Palette, Shield,
  BarChart3, Zap, Hash
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navSections = [
  {
    title: 'Dashboard',
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Domain Management',
    items: [
      { id: 'extensions', label: 'Extensions', icon: Globe },
      { id: 'domains', label: 'All Domains', icon: Globe2 },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { id: 'orders', label: 'Orders', icon: Package },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'coupons', label: 'Coupons', icon: Tag },
    ],
  },
  {
    title: 'Users',
    items: [
      { id: 'users', label: 'All Users', icon: Users },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Content',
    items: [
      { id: 'blog', label: 'Blog', icon: FileText },
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
      { id: 'banners', label: 'Banners', icon: Image },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
      { id: 'support-links', label: 'Support Links', icon: MessageSquare },
      { id: 'social-links', label: 'Social Links', icon: Link2 },
      { id: 'currencies', label: 'Currencies', icon: Hash },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Site Settings', icon: Settings },
      { id: 'seo', label: 'SEO', icon: Zap },
      { id: 'theme', label: 'Theme', icon: Palette },
      { id: 'security', label: 'Security', icon: Shield },
    ],
  },
];

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onTabChange, children }) => {
  const navigate = useNavigate();
  const { currentUser, logout, notifications, theme, toggleTheme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSection = (title: string) => {
    setCollapsedSections(prev =>
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-black text-white">Domain<span className="text-indigo-400">Hub</span></span>
            <div className="text-xs text-slate-500 -mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map(section => {
          const isCollapsed = collapsedSections.includes(section.title);
          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between mb-2 group"
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                  {section.title}
                </span>
                <ChevronDown size={12} className={`text-slate-500 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
              </button>
              {!isCollapsed && (
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeTab === item.id
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon size={15} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {currentUser?.name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white capitalize">
                {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Admin Panel'}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">DomainHub Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
            >
              <Globe size={13} />
              View Site
            </Link>
            <div className="relative">
              <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-dot" />}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
