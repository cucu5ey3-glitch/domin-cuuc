import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Globe, Shield, Zap, Star, ChevronDown, ChevronUp,
  Check, TrendingUp, Users, Package, Clock, Award, ArrowRight
} from 'lucide-react';
import { useStore } from '../store/useStore';

const CountUpNumber: React.FC<{ end: number; suffix?: string; prefix?: string }> = ({ end, suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref} className="text-4xl font-black text-white">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { extensions, reviews, faqs, siteSettings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeExtensions = extensions.filter(e => e.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeReviews = reviews.filter(r => r.isActive);
  const activeFaqs = faqs.filter(f => f.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const features = [
    { icon: <Zap size={24} />, title: 'Instant Registration', desc: 'Your domain goes live within minutes of payment confirmation.', color: 'text-yellow-400' },
    { icon: <Shield size={24} />, title: 'Secure & Reliable', desc: 'Enterprise-grade security with SSL, DNSSEC, and 99.9% uptime.', color: 'text-emerald-400' },
    { icon: <Globe size={24} />, title: 'Global Coverage', desc: 'Register domains from any country, support for 500+ TLDs.', color: 'text-blue-400' },
    { icon: <Clock size={24} />, title: '24/7 Support', desc: 'Round-the-clock expert support via WhatsApp, email, and chat.', color: 'text-purple-400' },
  ];

  const stats = [
    { label: 'Domains Registered', end: 47250, suffix: '+', icon: <Globe size={20} /> },
    { label: 'Happy Customers', end: 12800, suffix: '+', icon: <Users size={20} /> },
    { label: 'Extensions Available', end: activeExtensions.length, suffix: '', icon: <Package size={20} /> },
    { label: 'Uptime Guarantee', end: 99, suffix: '.9%', icon: <TrendingUp size={20} /> },
  ];

  const popularDomains = ['startup.com', 'mybrand.ai', 'shopnow.store', 'techapp.io', 'mysite.online', 'brandco.xyz'];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 animated-bg opacity-80" />
        <div className="absolute inset-0">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          {/* Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-indigo-300 font-medium">🔥 Limited Time: .com for only $8.99/yr</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Find Your{' '}
              <span className="gradient-text">Perfect Domain</span>
              <br />
              Name Today
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Register premium domains at unbeatable prices. Instant activation, complete control, and 24/7 support included.
            </p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search your perfect domain..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-400 pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-indigo-500 focus:bg-white/15 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 whitespace-nowrap flex items-center gap-2 justify-center"
              >
                <Search size={20} />
                Search
              </button>
            </motion.form>

            {/* Popular searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-5"
            >
              <span className="text-slate-500 text-sm">Popular:</span>
              {popularDomains.map(d => (
                <button
                  key={d}
                  onClick={() => navigate(`/search?q=${d.split('.')[0]}`)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                >
                  {d}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} className="text-slate-500" />
        </motion.div>
      </section>

      {/* Extension Prices Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-white mb-4">Popular Extensions</h2>
            <p className="text-slate-400 text-lg">Start from just $0.99/year. Find the perfect TLD for your brand.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {activeExtensions.slice(0, 10).map((ext, i) => (
              <motion.div
                key={ext.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/search?ext=${ext.name}`)}
                className="relative group bg-slate-800/60 border border-slate-700 hover:border-indigo-500/50 rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 hover:bg-slate-800"
              >
                {ext.isPopular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-bold text-white whitespace-nowrap">
                    Popular
                  </div>
                )}
                {ext.isFeatured && !ext.isPopular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white whitespace-nowrap">
                    Featured
                  </div>
                )}
                <div className="text-2xl font-black text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors font-mono">
                  {ext.name}
                </div>
                <div className="text-xl font-bold text-white">${ext.price}</div>
                <div className="text-xs text-slate-500 mt-1">/year</div>
                <div className="mt-3 text-xs text-slate-500">Renew: ${ext.renewPrice}/yr</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-2 px-6 py-3 text-indigo-400 border border-indigo-500/50 hover:border-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all text-sm font-semibold"
            >
              View All Extensions <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                  {stat.icon}
                </div>
                <CountUpNumber end={stat.end} suffix={stat.suffix} />
                <p className="text-slate-400 mt-2 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">Why Choose DomainHub?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with exceptional service to give you the best domain experience possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-5 ${f.color} group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Get your domain in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600" />

            {[
              { step: '01', title: 'Search', desc: 'Type your desired domain name. We check all extensions instantly.', icon: <Search size={28} /> },
              { step: '02', title: 'Choose & Buy', desc: 'Select your preferred extension, add to cart, and complete checkout.', icon: <Package size={28} /> },
              { step: '03', title: 'Launch!', desc: 'Your domain goes live instantly after payment is confirmed.', icon: <Zap size={28} /> },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center text-xs font-black text-indigo-400">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-white font-bold ml-2">4.9/5</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">What Our Customers Say</h2>
            <p className="text-slate-400 text-lg">Trusted by 12,800+ businesses worldwide</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.country}</p>
                  </div>
                  <Award size={16} className="text-yellow-400 ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-lg">Everything you need to know about domain registration</p>
          </motion.div>

          <div className="space-y-3">
            {activeFaqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-700/20 transition-colors"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {openFaq === faq.id
                    ? <ChevronUp size={18} className="text-indigo-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Claim Your Domain?
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join 12,800+ businesses who trust DomainHub for their online presence. Start for as low as $0.99/year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/search')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/40 flex items-center gap-2 justify-center"
              >
                <Search size={20} />
                Search Domain Now
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 border-2 border-slate-600 hover:border-slate-400 text-white text-lg font-semibold rounded-2xl transition-all flex items-center gap-2 justify-center"
              >
                View Pricing
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              {['No hidden fees', 'Instant setup', '24/7 Support', 'Money-back guarantee'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Check size={14} className="text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
