import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit2, Trash2, Ban, Check, Eye, UserCheck, ShieldOff, Mail } from 'lucide-react';
import { useStore, User } from '../../store/useStore';
import { formatDate, statusColor } from '../../utils/helpers';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export const AdminUsers: React.FC = () => {
  const { users, setUsers, orders } = useStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [viewUser, setViewUser] = useState<User | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggleActive = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    const user = users.find(u => u.id === userId);
    toast.success(`User ${user?.isActive ? 'deactivated' : 'activated'}`, { style: { background: '#1e293b', color: '#fff' } });
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User deleted', { style: { background: '#1e293b', color: '#fff' } });
    setViewUser(null);
  };

  const handleMakeAdmin = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
    toast.success('Role updated', { style: { background: '#1e293b', color: '#fff' } });
  };

  const getUserOrders = (userId: string) => orders.filter(o => o.userId === userId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Users</h2>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', count: users.length, color: 'text-white' },
          { label: 'Active', count: users.filter(u => u.isActive).length, color: 'text-emerald-400' },
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'text-indigo-400' },
          { label: 'Verified', count: users.filter(u => u.isVerified).length, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-60 bg-slate-800 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        {['all', 'user', 'admin'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${roleFilter === r ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}>
            {r === 'all' ? 'All Roles' : r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Verified', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No users found</td></tr>
              ) : (
                filtered.map(user => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.name[0]}
                        </div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{user.phone || '-'}</td>
                    <td className="px-5 py-4">
                      <Badge variant={user.role === 'admin' ? 'purple' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.isVerified ? 'info' : 'warning'}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewUser(user)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleToggleActive(user.id)} className={`p-1.5 rounded-lg transition-all ${user.isActive ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`} title={user.isActive ? 'Deactivate' : 'Activate'}>
                          {user.isActive ? <Ban size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button onClick={() => handleMakeAdmin(user.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all" title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}>
                          {user.role === 'admin' ? <ShieldOff size={14} /> : <Check size={14} />}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {viewUser && (
        <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title={viewUser.name} size="lg">
          <div className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                {viewUser.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{viewUser.name}</h3>
                <p className="text-slate-400">{viewUser.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={viewUser.role === 'admin' ? 'purple' : 'default'}>{viewUser.role}</Badge>
                  <Badge variant={viewUser.isActive ? 'success' : 'danger'}>{viewUser.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Badge variant={viewUser.isVerified ? 'info' : 'warning'}>{viewUser.isVerified ? 'Verified' : 'Unverified'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Phone', value: viewUser.phone || 'Not set' },
                { label: 'Country', value: viewUser.country || 'Not set' },
                { label: 'City', value: viewUser.city || 'Not set' },
                { label: 'Joined', value: formatDate(viewUser.createdAt) },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-slate-500 mb-1">{f.label}</p>
                  <p className="text-white font-medium">{f.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-white mb-3">Order History ({getUserOrders(viewUser.id).length} orders)</p>
              {getUserOrders(viewUser.id).length === 0 ? (
                <p className="text-slate-500 text-sm">No orders placed</p>
              ) : (
                <div className="space-y-2">
                  {getUserOrders(viewUser.id).slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-xs font-mono text-indigo-400">{order.id}</span>
                      <span className={`text-xs font-semibold ${statusColor(order.status)}`}>{order.status}</span>
                      <span className="text-xs text-white font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button onClick={() => handleToggleActive(viewUser.id)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${viewUser.isActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
                {viewUser.isActive ? 'Deactivate User' : 'Activate User'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm transition-colors">
                <Mail size={14} /> Email
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
