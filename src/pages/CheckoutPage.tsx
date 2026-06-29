import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreditCard, Upload, Check, ChevronRight, Globe, Shield, User, Phone, Mail, MapPin, FileText, AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  country: z.string().min(2, 'Please select a country'),
  city: z.string().min(2, 'Please enter your city'),
  address: z.string().min(5, 'Please enter your address'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, paymentMethods, siteSettings, currentUser, addOrder, clearCart, coupons } = useStore();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const symbol = siteSettings.currencySymbol || '$';
  const taxRate = siteSettings.taxRate || 10;
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const activePaymentMethods = paymentMethods.filter(p => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      country: currentUser?.country || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
    },
  });

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onInfoSubmit = () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method', { style: { background: '#1e293b', color: '#fff' } });
      return;
    }
    setStep(2);
  };

  const onPaymentSubmit = async () => {
    if (!screenshot) {
      toast.error('Please upload payment screenshot', { style: { background: '#1e293b', color: '#fff' } });
      return;
    }
    if (!transactionNumber.trim()) {
      toast.error('Please enter transaction number', { style: { background: '#1e293b', color: '#fff' } });
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);

    addOrder({
      id: newOrderId,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest',
      userEmail: currentUser?.email || '',
      items: cart,
      subtotal,
      discount: 0,
      tax,
      total,
      status: 'pending',
      paymentMethod: selectedPayment,
      paymentStatus: 'pending',
      transactionNumber,
      notes: paymentNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    clearCart();
    setIsSubmitting(false);
    setOrderPlaced(true);
    setStep(3);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3">Order Placed!</h2>
          <p className="text-slate-400 mb-2">Your order <span className="text-indigo-400 font-bold">{orderId}</span> has been submitted successfully.</p>
          <p className="text-slate-400 mb-8">Our team will verify your payment and activate your domains within <span className="text-white font-semibold">30 minutes</span>.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all">
              View My Orders
            </button>
            <button onClick={() => navigate('/search')} className="px-8 py-4 border border-slate-700 text-white font-semibold rounded-2xl hover:border-slate-500 transition-all">
              Register Another Domain
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-10">
          {[
            { n: 1, label: 'Information & Payment' },
            { n: 2, label: 'Upload Proof' },
            { n: 3, label: 'Confirmation' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s.n ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {step > s.n ? <Check size={16} /> : s.n}
                </div>
                <span className={`hidden sm:block text-sm font-medium ${step >= s.n ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
              </div>
              {i < 2 && (
                <ChevronRight size={18} className="text-slate-600 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleSubmit(onInfoSubmit)}>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <User size={18} className="text-indigo-400" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register('name')} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Doe" />
                      </div>
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register('email')} type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="john@example.com" />
                      </div>
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number *</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register('phone')} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="+1 555 000 0000" />
                      </div>
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Country *</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select {...register('country')} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                          <option value="">Select country</option>
                          <option value="Egypt">Egypt</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="UAE">UAE</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {errors.country && <p className="text-xs text-red-400 mt-1">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">City *</label>
                      <input {...register('city')} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Cairo" />
                      {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Address *</label>
                      <input {...register('address')} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="123 Street Name" />
                      {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes (optional)</label>
                      <textarea {...register('notes')} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Any additional notes..." />
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <CreditCard size={18} className="text-indigo-400" />
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activePaymentMethods.map(method => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{method.logo}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{method.name}</p>
                            <p className="text-xs text-slate-400">{method.accountNumber}</p>
                          </div>
                          {selectedPayment === method.id && (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Instructions */}
                  {selectedPayment && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-400 mb-1">Payment Instructions:</p>
                          <p className="text-xs text-slate-400 whitespace-pre-line">
                            {activePaymentMethods.find(m => m.id === selectedPayment)?.instructions}
                          </p>
                          <p className="text-sm text-white mt-2 font-semibold">
                            Send {symbol}{total.toFixed(2)} to: {activePaymentMethods.find(m => m.id === selectedPayment)?.accountNumber}
                          </p>
                          <p className="text-xs text-slate-400">Receiver: {activePaymentMethods.find(m => m.id === selectedPayment)?.receiverName}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg text-base flex items-center justify-center gap-2">
                  Continue to Upload Proof
                  <ChevronRight size={18} />
                </button>
              </form>
            )}

            {step === 2 && (
              <div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Upload size={18} className="text-indigo-400" />
                    Upload Payment Proof
                  </h3>

                  <div className="space-y-5">
                    {/* Screenshot Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Payment Screenshot *</label>
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${screenshotPreview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-600 hover:border-indigo-500 hover:bg-indigo-500/5'}`}
                        onClick={() => document.getElementById('screenshot-upload')?.click()}
                      >
                        {screenshotPreview ? (
                          <div>
                            <img src={screenshotPreview} alt="Payment proof" className="max-h-48 mx-auto rounded-lg object-contain" />
                            <p className="text-sm text-emerald-400 mt-3">✓ Screenshot uploaded. Click to change.</p>
                          </div>
                        ) : (
                          <div>
                            <Upload size={40} className="text-slate-500 mx-auto mb-3" />
                            <p className="text-white font-semibold mb-1">Drop screenshot here or click to upload</p>
                            <p className="text-xs text-slate-500">JPG, PNG, PDF up to 10MB</p>
                          </div>
                        )}
                        <input
                          id="screenshot-upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleScreenshot}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Transaction Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Transaction / Reference Number *</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={transactionNumber}
                          onChange={e => setTransactionNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                          placeholder="e.g., TXN1234567890"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Additional Notes (optional)</label>
                      <textarea
                        value={paymentNotes}
                        onChange={e => setPaymentNotes(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="Any additional notes about your payment..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-slate-700 text-white font-semibold rounded-2xl hover:border-slate-500 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={onPaymentSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                    ) : (
                      <><Check size={18} />Place Order</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="sticky top-24 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-indigo-400" />
                      <span className="text-slate-300 font-mono">{item.domain}{item.extension}</span>
                    </div>
                    <span className="text-white font-semibold">{symbol}{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">{symbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax ({taxRate}%)</span>
                  <span className="text-white">{symbol}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-700">
                  <span className="text-white">Total</span>
                  <span className="text-white text-xl">{symbol}{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Shield size={12} className="text-emerald-400" />
                Secured & Encrypted Transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
