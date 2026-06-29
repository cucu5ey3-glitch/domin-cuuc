import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Globe, Heart, FileText, CreditCard, Bell, User,
  Shield, LogOut, ChevronRight, Clock, Check, X, Eye,
  TrendingUp, Download, Settings, Star, AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDate, statusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'domains', label: 'My Domains', icon: Globe },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'payments', label: 'Payment History', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, orders, favorites, notifications, markNotificationRead, markAllNotificationsRead, siteSettings } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">Please sign in to access your dashboard</p>
          <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === currentUser?.id || o.userEmail === currentUser?.email);
  const symbol = siteSettings.currencySymbol || '$';

  const handleLogout = () => {
    logout();
    navigate('/');
    toast('Signed out successfully', { icon: '👋', style: { background: '#1e293b', color: '#fff' } });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed top-16 bottom-0 left-0 overflow-y-auto">
          {/* User Info */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {currentUser?.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{currentUser?.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
          {/* Mobile Tab Selector */}
          <div className="md:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {sidebarItems.slice(0, 6).map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon size={12} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">
                  Welcome back, <span className="text-indigo-400">{currentUser?.name?.split(' ')[0]}</span>! 👋
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Orders', value: userOrders.length, icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Active Domains', value: userOrders.filter(o => o.status === 'completed').length, icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                    { label: 'Total Spent', value: `${symbol}${userOrders.reduce((s, o) => s + o.total, 0).toFixed(2)}`, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  ].map(stat => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                          <Icon size={18} />
                        </div>
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      View all <ChevronRight size={14} />
                    </button>
                  </div>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-10">
                      <Package size={36} className="text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No orders yet</p>
                      <Link to="/search" className="inline-flex items-center gap-1 mt-3 text-sm text-indigo-400 hover:underline">
                        Start searching for domains
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
                              <Package size={16} className="text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{order.id}</p>
                              <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="text-sm font-bold text-white">{symbol}{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">My Orders</h1>
                {userOrders.length === 0 ? (
                  <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <Package size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">No orders found</p>
                    <p className="text-slate-400 mb-6">You haven't placed any orders yet</p>
                    <Link to="/search" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                      Search Domains
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map(order => (
                      <div key={order.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{order.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-white">{symbol}{order.total.toFixed(2)}</div>
                            <div className={`text-xs font-semibold ${statusColor(order.paymentStatus)}`}>
                              Payment: {order.paymentStatus}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Globe size={13} className="text-indigo-400" />
                                <span className="text-slate-300 font-mono">{item.domain}{item.extension}</span>
                              </div>
                              <span className="text-slate-400">{symbol}{item.price.toFixed(2)}/yr</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                          <span className="text-xs text-slate-500">via {order.paymentMethod}</span>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors">
                              <Eye size={12} /> View Invoice
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors">
                              <Download size={12} /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Domains */}
            {activeTab === 'domains' && (
              <motion.div key="domains" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">My Domains</h1>
                {userOrders.filter(o => o.status === 'completed').length === 0 ? (
                  <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <Globe size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">No active domains</p>
                    <p className="text-slate-400 mb-6">Register your first domain to get started</p>
                    <Link to="/search" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                      Search Domains
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.filter(o => o.status === 'completed').flatMap(o => o.items).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Globe size={18} className="text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white font-mono">{item.domain}{item.extension}</p>
                            <p className="text-xs text-emerald-400 flex items-center gap-1"><Check size={10} /> Active</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right text-sm">
                            <p className="text-slate-400">Expires</p>
                            <p className="text-white font-semibold">Dec 31, 2025</p>
                          </div>
                          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition-colors">
                            Renew
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Favorites */}
            {activeTab === 'favorites' && (
              <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">Saved Favorites</h1>
                {favorites.length === 0 ? (
                  <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <Heart size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">No favorites saved</p>
                    <p className="text-slate-400 mb-6">Save domains you love to come back to them later</p>
                    <Link to="/search" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                      Browse Domains
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((domain, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Heart size={16} className="text-pink-400 fill-pink-400" />
                          <span className="font-mono font-semibold text-white">{domain}</span>
                        </div>
                        <Link to={`/search?q=${domain.split('.')[0]}`} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors">
                          Register
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-black text-white">Notifications</h1>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-sm text-indigo-400 hover:text-indigo-300">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                      <Bell size={48} className="text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${!notif.isRead ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                            notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {notif.type === 'success' ? <Check size={16} /> :
                             notif.type === 'error' ? <X size={16} /> :
                             <AlertCircle size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{notif.title}</p>
                            <p className="text-sm text-slate-400 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-slate-600 mt-1">{formatDate(notif.createdAt)}</p>
                          </div>
                          {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">My Profile</h1>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-700">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
                      {currentUser?.name?.[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentUser?.name}</h3>
                      <p className="text-slate-400">{currentUser?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold">
                          {currentUser?.role}
                        </span>
                        {currentUser?.isVerified && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Check size={10} /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Full Name', value: currentUser?.name },
                      { label: 'Email', value: currentUser?.email },
                      { label: 'Phone', value: currentUser?.phone || 'Not set' },
                      { label: 'Country', value: currentUser?.country || 'Not set' },
                      { label: 'City', value: currentUser?.city || 'Not set' },
                      { label: 'Address', value: currentUser?.address || 'Not set' },
                      { label: 'Member Since', value: formatDate(currentUser?.createdAt || '') },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="text-xs text-slate-500 uppercase tracking-wider">{field.label}</label>
                        <p className="text-white font-medium mt-1">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-sm font-semibold">
                      <Settings size={16} /> Edit Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">Security Settings</h1>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <Lock size={18} className="text-indigo-400" /> Change Password
                    </h3>
                    <div className="space-y-4 max-w-sm">
                      <input type="password" placeholder="Current Password" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                      <input type="password" placeholder="New Password" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                      <input type="password" placeholder="Confirm New Password" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                      <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-sm font-semibold">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-emerald-400" /> Account Security
                    </h3>
                    <p className="text-slate-400 text-sm mb-5">Your account security status</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Email Verified', status: currentUser?.isVerified, icon: Check },
                        { label: 'Password Set', status: true, icon: Check },
                        { label: 'Two-Factor Auth', status: false, icon: X },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                <Icon size={14} />
                              </div>
                              <span className="text-sm text-slate-300">{item.label}</span>
                            </div>
                            <span className={`text-xs font-semibold ${item.status ? 'text-emerald-400' : 'text-red-400'}`}>
                              {item.status ? 'Active' : 'Not Set'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Invoices / Payments - placeholder */}
            {(activeTab === 'invoices' || activeTab === 'payments') && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black text-white mb-6">
                  {activeTab === 'invoices' ? 'Invoices' : 'Payment History'}
                </h1>
                <div className="space-y-3">
                  {userOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                          <FileText size={16} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{order.id}</p>
                          <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <span className="font-bold text-white">{symbol}{order.total.toFixed(2)}</span>
                        <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {userOrders.length === 0 && (
                    <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                      <FileText size={48} className="text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No records found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Missing import fix
const Lock = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
