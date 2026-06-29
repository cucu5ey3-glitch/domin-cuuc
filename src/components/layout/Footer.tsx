import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, Phone, MapPin, Heart, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Footer: React.FC = () => {
  const { siteSettings } = useStore();
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const extensions = ['.com', '.net', '.org', '.online', '.store', '.xyz', '.ai', '.io'];
  const company = [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ];
  const support = [
    { label: 'Help Center', href: '/help' },
    { label: 'Domain Search', href: '/search' },
    { label: 'Transfer Domain', href: '/transfer' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Status', href: '/status' },
  ];
  const legal = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
    { label: 'Refund Policy', href: '/refund' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-slate-400">Get the latest deals, news, and domain tips delivered to your inbox.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-72">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {subscribed ? '✓ Subscribed!' : (
                  <>
                    <Send size={14} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Globe size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                Domain<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted domain partner. Register, transfer, and manage domains at unbeatable prices. Instant activation, 24/7 support, and complete control.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail size={14} className="text-indigo-400" />
                {siteSettings.contactEmail}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone size={14} className="text-indigo-400" />
                {siteSettings.contactPhone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin size={14} className="text-indigo-400" />
                {siteSettings.contactAddress}
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map(item => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-5">Support</h4>
            <ul className="space-y-3">
              {support.map(item => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-5">Legal</h4>
            <ul className="space-y-3">
              {legal.map(item => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Extensions */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-4">Popular Extensions:</p>
          <div className="flex flex-wrap gap-2">
            {extensions.map(ext => (
              <Link
                key={ext}
                to={`/search?q=${ext}`}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-mono text-slate-300 hover:text-white transition-all"
              >
                {ext}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2024 DomainHub. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            Made with <Heart size={14} className="text-red-400 mx-1" /> by DomainHub Team
          </div>
          <div className="flex items-center gap-4">
            {siteSettings.facebookUrl && (
              <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {siteSettings.twitterUrl && (
              <a href={siteSettings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {siteSettings.instagramUrl && (
              <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {siteSettings.telegramUrl && (
              <a href={siteSettings.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
