import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Package,
    DollarSign,
    ArrowUp,
    ArrowDown,
    Eye,
    Clock
} from 'lucide-react'; import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useStore } from '../../store/useStore';
import { formatDate, statusColor } from '../../utils/helpers';

const revenueData = [
  { month: 'Jan', revenue: 2400, orders: 18 },
  { month: 'Feb', revenue: 3200, orders: 24 },
  { month: 'Mar', revenue: 2800, orders: 21 },
  { month: 'Apr', revenue: 4100, orders: 31 },
  { month: 'May', revenue: 3700, orders: 28 },
  { month: 'Jun', revenue: 5200, orders: 39 },
  { month: 'Jul', revenue: 4800, orders: 36 },
  { month: 'Aug', revenue: 6100, orders: 46 },
  { month: 'Sep', revenue: 5600, orders: 42 },
  { month: 'Oct', revenue: 7200, orders: 54 },
  { month: 'Nov', revenue: 6800, orders: 51 },
  { month: 'Dec', revenue: 8900, orders: 67 },
];

const extensionData = [
  { name: '.com', value: 45, color: '#6366f1' },
  { name: '.net', value: 15, color: '#8b5cf6' },
  { name: '.org', value: 12, color: '#06b6d4' },
  { name: '.online', value: 10, color: '#10b981' },
  { name: '.store', value: 8, color: '#f59e0b' },
  { name: '.ai', value: 10, color: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminDashboard: React.FC = () => {
  const { orders, users, extensions, siteSettings } = useStore();
  const symbol = siteSettings.currencySymbol || '$';

  const totalRevenue = orders.filter(o => o.paymentStatus === 'approved').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeUsers = users.filter(u => u.isActive).length;
  const activeExtensions = extensions.filter(e => e.isActive).length;

  const stats = [
    {
      label: 'Total Revenue',
      value: `${symbol}${totalRevenue.toFixed(2)}`,
      change: '+23.5%',
      up: true,
      icon: DollarSign,
      color: 'from-indigo-600 to-purple-600',
      bg: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      change: '+12.8%',
      up: true,
      icon: Package,
      color: 'from-emerald-600 to-green-600',
      bg: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Active Users',
      value: activeUsers,
      change: '+8.1%',
      up: true,
      icon: Users,
      color: 'from-blue-600 to-cyan-600',
      bg: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      change: '-3.2%',
      up: false,
      icon: Clock,
      color: 'from-yellow-600 to-orange-600',
      bg: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center ${stat.textColor}`}>
                  <Icon size={20} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {stat.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
              <p className="text-sm text-slate-400">Monthly revenue & orders</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Orders</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Extension Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-2">Domain Extensions</h3>
          <p className="text-sm text-slate-400 mb-4">Sales by extension</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={extensionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                {extensionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs">
                  <span className="text-white font-semibold">{payload[0].name}: {payload[0].value}%</span>
                </div>
              ) : null} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-4">
            {extensionData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Orders Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-1">Monthly Orders</h3>
        <p className="text-sm text-slate-400 mb-6">Order volume throughout the year</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orders" name="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <span className="text-sm text-indigo-400 cursor-pointer hover:underline">View All</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Domains</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-400">{order.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {order.userName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{order.userName}</p>
                        <p className="text-xs text-slate-500">{order.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      {order.items.slice(0, 2).map(item => (
                        <p key={item.id} className="text-xs font-mono text-slate-300">{item.domain}{item.extension}</p>
                      ))}
                      {order.items.length > 2 && <p className="text-xs text-slate-500">+{order.items.length - 2} more</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-white">{symbol}{order.total.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quick Stats */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Active Extensions', value: activeExtensions, total: extensions.length, color: 'bg-indigo-500' },
              { label: 'Active Users', value: activeUsers, total: users.length, color: 'bg-emerald-500' },
              { label: 'Completed Orders', value: orders.filter(o => o.status === 'completed').length, total: orders.length, color: 'bg-blue-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}/{item.total}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${(item.value / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4">Payment Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', count: orders.filter(o => o.paymentStatus === 'pending').length, color: 'text-yellow-400' },
              { label: 'Approved', count: orders.filter(o => o.paymentStatus === 'approved').length, color: 'text-emerald-400' },
              { label: 'Rejected', count: orders.filter(o => o.paymentStatus === 'rejected').length, color: 'text-red-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className={`text-2xl font-black ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Extension */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4">Top Extensions</h3>
          <div className="space-y-2.5">
            {extensionData.slice(0, 4).map((ext, i) => (
              <div key={ext.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-mono text-white">{ext.name}</span>
                    <span className="text-xs text-slate-400">{ext.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full">
                    <div className="h-full rounded-full transition-all" style={{ width: `${ext.value}%`, background: ext.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Clock SVG component (avoiding conflict with lucide imports)
const ClockIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
