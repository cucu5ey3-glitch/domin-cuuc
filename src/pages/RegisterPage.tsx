import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check } from 'lucide-react';
import { authService } from "../services/authService";
import { useStore } from "../store/useStore";
import toast from 'react-hot-toast';
import { any } from 'zod/v3';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');
    const passwordStrength =
        password.length >= 8
            ? password.match(/[A-Z]/) && password.match(/[0-9]/)
                ? 'strong'
                : 'medium'
            : 'weak';

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            await authService.register({
                fullName: data.name,
                email: data.email,
                password: data.password,
            }); // أو عدّل RegisterRequest في authService يضيف name
            toast.success('Account created successfully! Welcome to DomainHub! 🎉', {
                style: { background: '#1e293b', color: '#fff' },
            });
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Left Visual */}
            <div className="hidden lg:flex w-96 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="relative z-10 text-center px-10">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                        <Globe size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">Start Your Journey</h2>
                    <p className="text-purple-200 mb-8">Create your account and get your first domain today.</p>
                    <div className="space-y-3">
                        {[
                            'Instant domain registration',
                            'Competitive pricing',
                            '24/7 customer support',
                            'Easy management dashboard',
                        ].map(item => (
                            <div key={item} className="flex items-center gap-2 text-left">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-emerald-400" />
                                </div>
                                <span className="text-sm text-white">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-24 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <Globe size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-white">Domain<span className="text-indigo-400">Hub</span></span>
                    </Link>

                    <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
                    <p className="text-slate-400 mb-8">Join 12,800+ businesses on DomainHub</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('name')}
                                    placeholder="John Doe"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                        </div>

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

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('phone')}
                                    placeholder="+1 555 000 0000"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-2 flex items-center gap-1">
                                    {['weak', 'medium', 'strong'].map((level, i) => (
                                        <div
                                            key={level}
                                            className={`flex-1 h-1 rounded-full transition-all ${passwordStrength === 'strong'
                                                    ? 'bg-emerald-500'
                                                    : passwordStrength === 'medium' && i < 2
                                                        ? 'bg-yellow-500'
                                                        : i === 0
                                                            ? 'bg-red-500'
                                                            : 'bg-slate-700'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-xs text-slate-500 ml-2">{passwordStrength}</span>
                                </div>
                            )}
                            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                {...register('agreeToTerms')}
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 rounded accent-indigo-600 mt-0.5"
                            />
                            <label htmlFor="terms" className="text-sm text-slate-400">
                                I agree to the{' '}
                                <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="text-xs text-red-400">{errors.agreeToTerms.message}</p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};