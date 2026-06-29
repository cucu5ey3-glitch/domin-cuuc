import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Check, X, RotateCcw, Download, Globe, ExternalLink } from 'lucide-react';
import { useStore, Order } from '../../store/useStore';
import { formatDate, statusColor } from '../../utils/helpers';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrder, siteSettings } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const symbol = siteSettings.currencySymbol || '$';

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.userName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const handleApprovePayment = (orderId: string) => {
    updateOrder(orderId, { paymentStatus: 'approved', status: 'paid' });
    toast.success('Payment approved!', { style: { background: '#1e293b', color: '#fff' } });
    setViewOrder(null);
  };

  const handleRejectPayment = (orderId: string) => {
    updateOrder(orderId, { paymentStatus: 'rejected' });
    toast.error('Payment rejected', { style: { background: '#1e293b', color: '#fff' } });
    setViewOrder(null);
  };

  const handleRequestScreenshot = (orderId: string) => {
    updateOrder(orderId, { paymentStatus: 'review' });
    toast('Requested new screenshot', { icon: '📎', style: { background: '#1e293b', color: '#fff' } });
    setViewOrder(null);
  };

  const handleComplete = (orderId: string) => {
    updateOrder(orderId, { status: 'completed' });
    toast.success('Order marked as completed!', { style: { background: '#1e293b', color: '#fff' } });
  };

  const statuses = ['all', 'pending', 'paid', 'completed', 'cancelled', 'refunded'];
  const paymentStatuses = ['all', 'pending', 'approved', 'rejected', 'review'];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Orders</h2>
          <p className="text-slate-400 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-64 bg-slate-800 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {paymentStatuses.map(s => (
            <button
              key={s}
              onClick={() => setPaymentFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${paymentFilter === s ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
            >
              {s === 'all' ? 'Payment: All' : `Pay: ${s}`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {statuses.slice(1).map(s => (
          <div key={s} className={`p-3 rounded-xl border ${statusColor(s)} border-current/20 text-center cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setStatusFilter(s)}>
            <div className="text-2xl font-black">{orders.filter(o => o.status === s).length}</div>
            <div className="text-xs capitalize font-medium mt-0.5">{s}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                {['Order', 'Customer', 'Domains', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">No orders found</td>
                </tr>
              ) : (
                filtered.map(order => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-400">{order.id}</td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{order.userName}</p>
                        <p className="text-xs text-slate-500">{order.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {order.items.slice(0, 2).map(item => (
                          <p key={item.id} className="text-xs font-mono text-slate-300">{item.domain}{item.extension}</p>
                        ))}
                        {order.items.length > 2 && <p className="text-xs text-slate-500">+{order.items.length - 2}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-white">{symbol}{order.total.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {order.paymentStatus === 'pending' && (
                          <>
                            <button onClick={() => handleApprovePayment(order.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Approve">
                              <Check size={14} />
                            </button>
                            <button onClick={() => handleRejectPayment(order.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Reject">
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {order.status === 'paid' && (
                          <button onClick={() => handleComplete(order.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Mark Complete">
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder.id}`} size="lg">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-white font-semibold">{viewOrder.userName}</p>
                <p className="text-slate-400 text-sm">{viewOrder.userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Payment Method</p>
                <p className="text-white font-semibold">{viewOrder.paymentMethod}</p>
                {viewOrder.transactionNumber && (
                  <p className="text-slate-400 text-sm">TXN: {viewOrder.transactionNumber}</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Domains Ordered</p>
              <div className="space-y-2">
                {viewOrder.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-indigo-400" />
                      <span className="font-mono text-white">{item.domain}{item.extension}</span>
                    </div>
                    <span className="text-white font-semibold">{symbol}{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">Subtotal</p>
                <p className="text-white font-semibold">{symbol}{viewOrder.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tax</p>
                <p className="text-white font-semibold">{symbol}{viewOrder.tax.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-white font-black text-lg">{symbol}{viewOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Order Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(viewOrder.status)}`}>{viewOrder.status}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Payment Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(viewOrder.paymentStatus)}`}>{viewOrder.paymentStatus}</span>
              </div>
            </div>

            {viewOrder.notes && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-slate-300 text-sm">{viewOrder.notes}</p>
              </div>
            )}

            {viewOrder.paymentStatus === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button onClick={() => handleApprovePayment(viewOrder.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors">
                  <Check size={14} /> Approve Payment
                </button>
                <button onClick={() => handleRejectPayment(viewOrder.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">
                  <X size={14} /> Reject Payment
                </button>
                <button onClick={() => handleRequestScreenshot(viewOrder.id)} className="flex items-center gap-2 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm transition-colors">
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
