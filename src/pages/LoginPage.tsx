import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { authService } from "../services/authService";
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
    const { login } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);

        try {
            const response = await authService.login({
                email: data.email,
                password: data.password,
            });

            localStorage.setItem("token", response.token);

            login(
                {
                    id: response.user.id.toString(),
                    name: response.user.fullName,
                    email: response.user.email,
                    phone: "",
                    country: "",
                    city: "",
                    address: "",
                    role: response.user.role.toLowerCase() as "admin" | "user",
                    isVerified: true,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                },
                response.token
            );

            toast.success("Login successful");

            if (response.user.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error: any) {
            toast.error(error.response?.data || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

  // Demo accounts
  const demoAccounts = [
    { label: 'Admin', email: 'admin@domainhub.com', role: 'admin' },
    { label: 'User', email: 'john@example.com', role: 'user' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white">Domain<span className="text-indigo-400">Hub</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back!</h1>
          <p className="text-slate-400 mb-8">Sign in to manage your domains</p>

          {/* Demo Accounts */}
          <div className="flex gap-2 mb-6">
            {demoAccounts.map(acc => (
              <button
                key={acc.email}
                onClick={() => {
                  const event = { target: { value: acc.email } };
                  // Auto-fill
                  toast(`Demo ${acc.role}: ${acc.email}`, { style: { background: '#1e293b', color: '#fff' } });
                }}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl text-xs text-slate-400 hover:text-white transition-all text-left"
              >
                <div className="font-semibold text-white">{acc.role === 'admin' ? '🛡️' : '👤'} {acc.label}</div>
                <div className="text-slate-500 truncate">{acc.email}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-6 text-center">↑ Click demo account, use any password</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                {...register('rememberMe')}
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-400">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create account
            </Link>
          </p>

          <div className="flex items-center gap-2 mt-6 p-3 bg-slate-800/50 rounded-xl">
            <Shield size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-400">Protected by JWT authentication & SSL encryption</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Globe size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Manage Your Digital Empire</h2>
          <p className="text-indigo-200 text-lg max-w-sm">
            Access all your domains, orders, and settings from one powerful dashboard.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { icon: '🌐', text: 'Domain Management' },
              { icon: '📊', text: 'Usage Analytics' },
              { icon: '🔒', text: 'Security Controls' },
              { icon: '⚡', text: 'Instant Activation' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2 bg-white/10 rounded-xl p-3 text-left">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
