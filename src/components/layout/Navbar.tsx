import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Globe, Sun, Moon, ShoppingCart, Heart, Bell, User,
  Menu, X, ChevronDown, LogOut, Settings, LayoutDashboard, Search
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, language, setLanguage, isAuthenticated, currentUser, logout, cart, notifications, favorites } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navLinks = [
    { label: language === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
    { label: language === 'ar' ? 'البحث' : 'Domains', href: '/search' },
    { label: language === 'ar' ? 'الأسعار' : 'Pricing', href: '/pricing' },
    { label: language === 'ar' ? 'المدونة' : 'Blog', href: '/blog' },
    { label: language === 'ar' ? 'اتصل بنا' : 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-white">
              Domain<span className="text-indigo-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex"
            >
              <Search size={18} />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-slate-700 hover:border-slate-500"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Favorites */}
            <Link to="/favorites" className="p-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors relative hidden sm:flex">
              <Heart size={18} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors relative">
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Notifications - only if logged in */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && (
                    <span className="notification-dot" />
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                        <span className="font-semibold text-white">Notifications</span>
                        <span className="text-xs text-indigo-400 cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.slice(0, 5).map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer ${!n.isRead ? 'bg-indigo-500/5' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                              <div>
                                <p className="text-sm font-medium text-white">{n.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center">
                        <Link to="/dashboard/notifications" className="text-xs text-indigo-400 hover:underline" onClick={() => setNotifOpen(false)}>
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {currentUser?.name?.[0] || 'U'}
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-12 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-700">
                        <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                        <p className="text-xs text-slate-400">{currentUser?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                          <User size={16} /> My Account
                        </Link>
                        {currentUser?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors">
                            <LayoutDashboard size={16} /> Admin Panel
                          </Link>
                        )}
                        <Link to="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                          <Settings size={16} /> Settings
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-slate-700/50"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition-all">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
