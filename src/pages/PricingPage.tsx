import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Award, Search, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { extensions, siteSettings } = useStore();
  const symbol = siteSettings.currencySymbol || '$';
  const activeExtensions = extensions.filter(e => e.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const features = ['Free WHOIS Privacy', 'Domain Lock', 'DNS Management', 'Email Forwarding', '24/7 Support'];

  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No hidden fees. No surprises. Just straightforward domain pricing that makes sense.
          </p>
        </motion.div>

        {/* What's Included */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 mb-12">
          <p className="text-white font-semibold mb-3 text-center">Every domain includes:</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <Check size={14} className="text-emerald-400" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Extension Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeExtensions.map((ext, i) => (
            <motion.div
              key={ext.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative bg-slate-800/60 border rounded-2xl p-6 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 ${ext.isFeatured ? 'border-indigo-500/30' : 'border-slate-700/50'}`}
            >
              {ext.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-bold text-white flex items-center gap-1 whitespace-nowrap">
                  <Star size={10} /> Most Popular
                </div>
              )}
              {ext.isFeatured && !ext.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1 whitespace-nowrap">
                  <Award size={10} /> Featured
                </div>
              )}

              <div className="text-center mb-5">
                <div className="text-3xl font-black text-indigo-400 font-mono mb-3">{ext.name}</div>
                <div className="text-4xl font-black text-white">
                  {symbol}{ext.price}
                  <span className="text-lg font-normal text-slate-400">/yr</span>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Renewal</span>
                  <span className="text-slate-300">{symbol}{ext.renewPrice}/yr</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Transfer</span>
                  <span className="text-slate-300">{symbol}{ext.transferPrice}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Period</span>
                  <span className="text-slate-300">{ext.registrationPeriod} year</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/search?ext=${ext.name}`)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25"
              >
                <Search size={14} />
                Search {ext.name}
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 p-10 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-slate-950 border border-indigo-500/20 rounded-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-5">
            <Zap size={30} className="text-white" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4">Ready to Get Started?</h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Search your perfect domain now and join thousands of businesses who trust DomainHub.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2 mx-auto"
          >
            <Search size={20} />
            Search Your Domain
          </button>
        </motion.div>
      </div>
    </div>
  );
};
