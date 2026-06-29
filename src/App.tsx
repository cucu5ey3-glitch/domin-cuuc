import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/admin/AdminPage';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper - hide navbar/footer on admin pages
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const isAuth = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {!isAuth && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuth && <Footer />}
      <WhatsAppButton />
    </div>
  );
};

// Simple placeholder pages
const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite } = useStore();
  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-white mb-8">❤️ Favorite Domains</h1>
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
            <div className="text-5xl mb-4">💔</div>
            <p className="text-white font-semibold mb-2">No favorites yet</p>
            <p className="text-slate-400">Search for domains and heart the ones you love</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((domain, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl">
                <span className="font-mono font-semibold text-white">{domain}</span>
                <div className="flex gap-2">
                  <button onClick={() => toggleFavorite(domain)} className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 text-xs rounded-lg hover:bg-red-500/30 transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPage: React.FC = () => {
  const { blogPosts } = useStore();
  const published = blogPosts.filter(p => p.isPublished);
  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-white mb-3">Blog & News</h1>
        <p className="text-slate-400 mb-10">Domain tips, industry news, and more</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {published.map(post => (
            <div key={post.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all hover:-translate-y-1 duration-200">
              <div className="h-40 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center text-4xl">
                📝
              </div>
              <div className="p-5">
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">{post.category}</span>
                <h3 className="font-bold text-white mt-2 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>By {post.author}</span>
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          ))}
          {published.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <p className="text-slate-400">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="text-8xl font-black text-indigo-600 mb-4">404</div>
      <h1 className="text-3xl font-black text-white mb-3">Page Not Found</h1>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors">
        Go Home
      </a>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { theme, language } = useStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  return (
    <LayoutWrapper>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </LayoutWrapper>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </Router>
  );
};

export default App;
