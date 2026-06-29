import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Check, X, ShoppingCart, Heart, Star, Filter,
  ArrowRight, Sparkles, SortAsc, DollarSign, RefreshCw
} from 'lucide-react';
import { useStore, Domain } from '../store/useStore';
import { searchDomains, generateSuggestions } from '../utils/domainSearch';
import { DomainSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { extensions, cart, addToCart, toggleFavorite, isFavorite, siteSettings } = useStore();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Domain[]>([]);
  const [suggestions, setSuggestions] = useState<Domain[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'alpha'>('default');
  const [selectedExts, setSelectedExts] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);

  const handleSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setIsSearching(true);
    setResults([]);
    setSuggestions([]);

    const cleanQ = q.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    setTimeout(() => {
      const searchRes = searchDomains(cleanQ, extensions);
      setResults(searchRes);

      const takenCount = searchRes.filter(r => r.status === 'taken').length;
      if (takenCount > 0) {
        const sugg = generateSuggestions(cleanQ, extensions);
        setSuggestions(sugg);
      }
      setIsSearching(false);
    }, 800);
  }, [extensions]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setInputValue(q);
      handleSearch(q);
    }
  }, [searchParams, handleSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQ = inputValue.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (cleanQ) {
      navigate(`/search?q=${cleanQ}`);
      setQuery(cleanQ);
      handleSearch(cleanQ);
    }
  };

  const handleAddToCart = (domain: Domain) => {
    const ext = extensions.find(e => e.name === domain.extension);
    addToCart({
      id: domain.id,
      domain: domain.name,
      extension: domain.extension,
      price: domain.price,
      period: ext?.registrationPeriod || 1,
    });
    toast.success(`${domain.fullName} added to cart! 🎉`, { style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
  };

  const handleFavorite = (domain: Domain) => {
    toggleFavorite(domain.fullName);
    if (isFavorite(domain.fullName)) {
      toast('Removed from favorites', { icon: '💔', style: { background: '#1e293b', color: '#fff' } });
    } else {
      toast.success('Added to favorites! ❤️', { style: { background: '#1e293b', color: '#fff' } });
    }
  };

  const symbol = siteSettings.currencySymbol || '$';

  const activeExtensions = extensions.filter(e => e.isActive);

  let filteredResults = [...results];
  if (filter === 'available') filteredResults = filteredResults.filter(r => r.status === 'available');
  if (selectedExts.length > 0) filteredResults = filteredResults.filter(r => selectedExts.includes(r.extension));
  filteredResults = filteredResults.filter(r => r.price <= maxPrice);

  if (sortBy === 'price-asc') filteredResults.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filteredResults.sort((a, b) => b.price - a.price);
  if (sortBy === 'alpha') filteredResults.sort((a, b) => a.fullName.localeCompare(b.fullName));

  const availableCount = results.filter(r => r.status === 'available').length;
  const inCart = (domain: Domain) => cart.some(c => c.domain + c.extension === domain.name + domain.extension);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Search Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="Search your perfect domain..."
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-2xl text-white placeholder-slate-500 pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-base font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 whitespace-nowrap justify-center"
            >
              <Search size={18} />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-4 rounded-2xl border transition-all flex items-center gap-2 whitespace-nowrap ${showFilters ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
            >
              <Filter size={18} />
              Filters
            </button>
          </form>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-5 bg-slate-800/60 border border-slate-700 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {/* Availability */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Availability</label>
                      <div className="flex gap-2">
                        {['all', 'available'].map(f => (
                          <button
                            key={f}
                            onClick={() => setFilter(f as 'all' | 'available')}
                            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                          >
                            {f === 'all' ? 'All' : 'Available Only'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl text-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                      >
                        <option value="default">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="alpha">Alphabetically</option>
                      </select>
                    </div>

                    {/* Max Price */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Max Price: {symbol}{maxPrice}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    {/* Extensions Filter */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Extensions</label>
                      <div className="flex flex-wrap gap-1">
                        {activeExtensions.slice(0, 6).map(ext => (
                          <button
                            key={ext.id}
                            onClick={() => setSelectedExts(prev =>
                              prev.includes(ext.name) ? prev.filter(e => e !== ext.name) : [...prev, ext.name]
                            )}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all ${selectedExts.includes(ext.name) ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                          >
                            {ext.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => { setFilter('all'); setSortBy('default'); setSelectedExts([]); setMaxPrice(100); }}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <RefreshCw size={14} /> Reset Filters
                    </button>
                    <span className="text-sm text-slate-500">{filteredResults.length} results</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {isSearching ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-400">Checking availability for <span className="text-white font-semibold">{query}</span>...</span>
            </div>
            <div className="space-y-3">
              {[...Array(7)].map((_, i) => <DomainSkeleton key={i} />)}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            {/* Summary */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Results for "<span className="text-indigo-400">{query}</span>"
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  <span className="text-emerald-400 font-semibold">{availableCount}</span> available out of {results.length} extensions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc size={16} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="alpha">A-Z</option>
                </select>
              </div>
            </div>

            {/* Domain List */}
            <div className="space-y-3 mb-12">
              <AnimatePresence>
                {filteredResults.map((domain, i) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      domain.status === 'available'
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 domain-available'
                        : 'bg-slate-800/30 border-slate-700/30 domain-taken opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${domain.status === 'available' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {domain.status === 'available'
                          ? <Check size={18} className="text-emerald-400" />
                          : <X size={18} className="text-red-400" />
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white font-mono">
                            {domain.name}<span className="text-indigo-400">{domain.extension}</span>
                          </span>
                          {domain.isPopular && (
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${domain.status === 'available' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {domain.status === 'available' ? '✓ Available' : '✗ Taken'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {domain.status === 'available' && (
                        <div className="text-right">
                          <div className="text-xl font-black text-white">
                            {symbol}{domain.price}
                          </div>
                          <div className="text-xs text-slate-500">/year</div>
                        </div>
                      )}

                      {domain.status === 'available' && (
                        <>
                          <button
                            onClick={() => handleFavorite(domain)}
                            className={`p-2 rounded-xl transition-all ${isFavorite(domain.fullName) ? 'text-pink-400 bg-pink-500/10' : 'text-slate-500 hover:text-pink-400 hover:bg-pink-500/10'}`}
                          >
                            <Heart size={16} className={isFavorite(domain.fullName) ? 'fill-pink-400' : ''} />
                          </button>
                          <button
                            onClick={() => !inCart(domain) && handleAddToCart(domain)}
                            disabled={inCart(domain)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              inCart(domain)
                                ? 'bg-emerald-500/20 text-emerald-400 cursor-default border border-emerald-500/30'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25'
                            }`}
                          >
                            {inCart(domain) ? (
                              <><Check size={14} /> In Cart</>
                            ) : (
                              <><ShoppingCart size={14} /> Buy Now</>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Smart Suggestions</h3>
                    <p className="text-slate-400 text-sm">Alternative domain names you might love</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.slice(0, 12).map((domain, i) => (
                    <motion.div
                      key={domain.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.03 }}
                      className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/30 rounded-xl group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Check size={14} className="text-emerald-400" />
                        <span className="font-semibold text-white font-mono text-sm">
                          {domain.name}<span className="text-purple-400">{domain.extension}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{symbol}{domain.price}</span>
                        <button
                          onClick={() => !inCart(domain) && handleAddToCart(domain)}
                          disabled={inCart(domain)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            inCart(domain)
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {inCart(domain) ? '✓' : 'Add'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <Search size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-slate-400">Try a different search term</p>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30"
            >
              <Search size={40} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">Search for your domain</h3>
            <p className="text-slate-400 text-lg mb-8">
              Type your desired domain name and we'll check all available extensions
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['startup', 'mybrand', 'techapp', 'shopnow', 'mystore'].map(ex => (
                <button
                  key={ex}
                  onClick={() => { setInputValue(ex); navigate(`/search?q=${ex}`); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-sm text-slate-300 hover:text-white transition-all flex items-center gap-1"
                >
                  <ArrowRight size={12} className="text-indigo-400" />
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
