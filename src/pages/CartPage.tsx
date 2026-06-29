import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Tag, ArrowRight, Globe,
  Shield, Clock, Plus, Minus, Package
} from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, coupons, siteSettings, isAuthenticated } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const symbol = siteSettings.currencySymbol || '$';
  const taxRate = siteSettings.taxRate || 10;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }
  const afterDiscount = subtotal - discount;
  const tax = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + tax;

  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive);
    if (!coupon) {
      setCouponError('Invalid or expired coupon code');
      setAppliedCoupon(null);
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order amount is ${symbol}${coupon.minOrder}`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(coupon);
    toast.success(`Coupon applied! You saved ${coupon.type === 'percentage' ? coupon.value + '%' : symbol + coupon.value}`, {
      style: { background: '#1e293b', color: '#fff' }
    });
  };

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast(`${name} removed from cart`, { icon: '🗑️', style: { background: '#1e293b', color: '#fff' } });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingCart size={40} className="text-slate-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Start searching for your perfect domain name</p>
          <Link to="/search" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg">
            <Globe size={18} />
            Search Domains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Shopping Cart</h1>
          <p className="text-slate-400 mt-1">{cart.length} domain{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl group hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
                      <Globe size={22} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white font-mono">
                        {item.domain}<span className="text-indigo-400">{item.extension}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> {item.period} year registration
                        </span>
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <Shield size={10} /> Includes WHOIS Privacy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-black text-white">{symbol}{item.price.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">/year</div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.domain + item.extension)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Security Info */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: <Shield size={16} />, text: 'SSL Secured' },
                { icon: <Clock size={16} />, text: 'Instant Activation' },
                { icon: <Package size={16} />, text: 'Free Transfer Lock' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <span className="text-emerald-400">{item.icon}</span>
                  <span className="text-xs text-slate-400">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <Link to="/search" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                <Plus size={14} />
                Add More Domains
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Tag size={16} className="text-yellow-400" />
                Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-red-400 mt-2">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <span className="text-xs text-emerald-400 font-semibold">✓ {appliedCoupon.code} applied</span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-xs text-slate-500 hover:text-red-400">Remove</button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal ({cart.length} domains)</span>
                  <span className="text-white font-semibold">{symbol}{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Discount</span>
                    <span className="text-emerald-400 font-semibold">-{symbol}{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax ({taxRate}%)</span>
                  <span className="text-white">{symbol}{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-black text-white">{symbol}{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 text-base"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-xs text-slate-500 mt-3">
                🔒 Secured by SSL. Your data is safe.
              </p>
            </div>

            {/* Try coupon hint */}
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <p className="text-xs text-yellow-400 font-medium mb-1">💡 Have a promo code?</p>
              <p className="text-xs text-slate-500">Try <code className="text-indigo-400">WELCOME10</code> for 10% off your first order!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
