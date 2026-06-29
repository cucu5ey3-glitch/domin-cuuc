import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Extension {
  id: string;
  name: string; // .com
  price: number;
  renewPrice: number;
  transferPrice: number;
  registrationPeriod: number;
  isPopular: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  currency: string;
}

export interface Domain {
  id: string;
  name: string;
  extension: string;
  fullName: string;
  price: number;
  status: 'available' | 'taken';
  isPopular?: boolean;
}

export interface CartItem {
  id: string;
  domain: string;
  extension: string;
  price: number;
  period: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'review';
  paymentScreenshot?: string;
  transactionNumber?: string;
  notes?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  accountNumber: string;
  receiverName: string;
  description: string;
  instructions: string;
  qrCode?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SupportLink {
  id: string;
  title: string;
  icon: string;
  link: string;
  isActive: boolean;
  sortOrder: number;
  color: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  author: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  analyticsId: string;
  taxRate: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  smtpHost: string;
  smtpPort: string;
  smtpEmail: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  mapUrl: string;
  whatsappNumber: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  telegramUrl: string;
}

interface AppState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Language
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;

  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  token: string | null;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // Favorites
  favorites: string[];
  toggleFavorite: (domain: string) => void;
  isFavorite: (domain: string) => boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Domain[];
  setSearchResults: (results: Domain[]) => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;

  // Extensions (from admin)
  extensions: Extension[];
  setExtensions: (ext: Extension[]) => void;

  // Payment Methods
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;

  // Support Links
  supportLinks: SupportLink[];
  setSupportLinks: (links: SupportLink[]) => void;

  // Reviews
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;

  // FAQ
  faqs: FAQ[];
  setFaqs: (faqs: FAQ[]) => void;

  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;

  // Users
  users: User[];
  setUsers: (users: User[]) => void;

  // Coupons
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Blog Posts
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Admin active tab
  adminTab: string;
  setAdminTab: (tab: string) => void;
}

// Default data
const defaultExtensions: Extension[] = [
  { id: '1', name: '.com', price: 12.99, renewPrice: 14.99, transferPrice: 12.99, registrationPeriod: 1, isPopular: true, isFeatured: true, isActive: true, sortOrder: 1, currency: 'USD' },
  { id: '2', name: '.net', price: 11.99, renewPrice: 13.99, transferPrice: 11.99, registrationPeriod: 1, isPopular: true, isFeatured: false, isActive: true, sortOrder: 2, currency: 'USD' },
  { id: '3', name: '.org', price: 13.99, renewPrice: 15.99, transferPrice: 13.99, registrationPeriod: 1, isPopular: true, isFeatured: false, isActive: true, sortOrder: 3, currency: 'USD' },
  { id: '4', name: '.online', price: 1.99, renewPrice: 9.99, transferPrice: 8.99, registrationPeriod: 1, isPopular: false, isFeatured: true, isActive: true, sortOrder: 4, currency: 'USD' },
  { id: '5', name: '.store', price: 3.99, renewPrice: 12.99, transferPrice: 10.99, registrationPeriod: 1, isPopular: false, isFeatured: true, isActive: true, sortOrder: 5, currency: 'USD' },
  { id: '6', name: '.xyz', price: 0.99, renewPrice: 8.99, transferPrice: 7.99, registrationPeriod: 1, isPopular: false, isFeatured: false, isActive: true, sortOrder: 6, currency: 'USD' },
  { id: '7', name: '.ai', price: 79.99, renewPrice: 89.99, transferPrice: 79.99, registrationPeriod: 1, isPopular: false, isFeatured: true, isActive: true, sortOrder: 7, currency: 'USD' },
  { id: '8', name: '.io', price: 39.99, renewPrice: 49.99, transferPrice: 39.99, registrationPeriod: 1, isPopular: false, isFeatured: false, isActive: true, sortOrder: 8, currency: 'USD' },
  { id: '9', name: '.co', price: 19.99, renewPrice: 24.99, transferPrice: 19.99, registrationPeriod: 1, isPopular: false, isFeatured: false, isActive: true, sortOrder: 9, currency: 'USD' },
  { id: '10', name: '.app', price: 14.99, renewPrice: 18.99, transferPrice: 14.99, registrationPeriod: 1, isPopular: false, isFeatured: false, isActive: true, sortOrder: 10, currency: 'USD' },
];

const defaultPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'InstaPay', logo: '💳', accountNumber: '01012345678', receiverName: 'DomainHub Egypt', description: 'Pay via InstaPay mobile app', instructions: '1. Open InstaPay\n2. Send to: 01012345678\n3. Upload screenshot', isActive: true, sortOrder: 1 },
  { id: '2', name: 'Vodafone Cash', logo: '📱', accountNumber: '01234567890', receiverName: 'DomainHub', description: 'Transfer via Vodafone Cash', instructions: '1. Open Vodafone Cash\n2. Transfer to: 01234567890\n3. Upload proof', isActive: true, sortOrder: 2 },
  { id: '3', name: 'Bank Transfer', logo: '🏦', accountNumber: 'EG380019000500000012345678901', receiverName: 'DomainHub LLC', description: 'Bank transfer (IBAN)', instructions: '1. Transfer to IBAN: EG380019...\n2. Reference: Your order ID\n3. Upload receipt', isActive: true, sortOrder: 3 },
  { id: '4', name: 'Fawry', logo: '🟡', accountNumber: '1234567', receiverName: 'DomainHub', description: 'Pay at any Fawry outlet', instructions: '1. Go to any Fawry\n2. Use code: 1234567\n3. Upload receipt', isActive: true, sortOrder: 4 },
];

const defaultSupportLinks: SupportLink[] = [
  { id: '1', title: 'WhatsApp', icon: 'whatsapp', link: 'https://wa.me/201012345678', isActive: true, sortOrder: 1, color: '#25D366' },
  { id: '2', title: 'Telegram', icon: 'telegram', link: 'https://t.me/domainhub', isActive: true, sortOrder: 2, color: '#0088cc' },
  { id: '3', title: 'Email', icon: 'email', link: 'mailto:support@domainhub.com', isActive: true, sortOrder: 3, color: '#6366f1' },
  { id: '4', title: 'Facebook', icon: 'facebook', link: 'https://facebook.com/domainhub', isActive: true, sortOrder: 4, color: '#1877f2' },
];

const defaultReviews: Review[] = [
  { id: '1', name: 'Ahmed Hassan', avatar: 'AH', rating: 5, comment: 'Amazing service! Got my domain in minutes. Very smooth experience and great prices.', country: 'Egypt 🇪🇬', isActive: true, createdAt: '2024-01-15' },
  { id: '2', name: 'Sarah Johnson', avatar: 'SJ', rating: 5, comment: 'Best domain registrar I have used. The admin panel is incredibly powerful and easy to use.', country: 'USA 🇺🇸', isActive: true, createdAt: '2024-02-01' },
  { id: '3', name: 'Mohammed Ali', avatar: 'MA', rating: 5, comment: 'الخدمة ممتازة وسريعة جداً. أسعار منافسة وفريق دعم احترافي. أنصح به بشدة!', country: 'KSA 🇸🇦', isActive: true, createdAt: '2024-02-15' },
  { id: '4', name: 'Elena Rodriguez', avatar: 'ER', rating: 4, comment: 'Great platform with excellent domain suggestions. The UI is beautiful and responsive.', country: 'Spain 🇪🇸', isActive: true, createdAt: '2024-03-01' },
  { id: '5', name: 'Karim Mansour', avatar: 'KM', rating: 5, comment: 'تجربة رائعة! سهولة في البحث والشراء. سأعود مرة أخرى بالتأكيد.', country: 'Egypt 🇪🇬', isActive: true, createdAt: '2024-03-10' },
  { id: '6', name: 'David Chen', avatar: 'DC', rating: 5, comment: 'Incredibly fast domain activation. The .ai domains at these prices are unbeatable!', country: 'Singapore 🇸🇬', isActive: true, createdAt: '2024-03-20' },
];

const defaultFAQs: FAQ[] = [
  { id: '1', question: 'How long does it take to register a domain?', answer: 'Domain registration is instant! As soon as your payment is verified, your domain will be active within minutes.', category: 'General', isActive: true, sortOrder: 1 },
  { id: '2', question: 'Can I transfer my domain from another registrar?', answer: 'Yes! We support domain transfers from all major registrars. The process is simple and usually takes 5-7 days.', category: 'Transfer', isActive: true, sortOrder: 2 },
  { id: '3', question: 'What payment methods do you accept?', answer: 'We accept InstaPay, Vodafone Cash, Bank Transfer, Fawry, and more. All payments are manually verified for security.', category: 'Payment', isActive: true, sortOrder: 3 },
  { id: '4', question: 'Do you offer refunds?', answer: 'We offer refunds within 7 days of purchase if the domain has not been used or transferred.', category: 'Billing', isActive: true, sortOrder: 4 },
  { id: '5', question: 'How do I renew my domain?', answer: 'Log into your account, go to "My Domains", and click "Renew". You\'ll receive email reminders 90, 60, and 30 days before expiry.', category: 'General', isActive: true, sortOrder: 5 },
  { id: '6', question: 'Is my personal information secure?', answer: 'Absolutely. We use industry-standard SSL encryption, JWT authentication, and never share your data with third parties.', category: 'Security', isActive: true, sortOrder: 6 },
];

const defaultOrders: Order[] = [
  { id: 'ORD-001', userId: '2', userName: 'John Doe', userEmail: 'john@example.com', items: [{ id: '1', domain: 'myapp', extension: '.com', price: 12.99, period: 1 }], subtotal: 12.99, discount: 0, tax: 1.30, total: 14.29, status: 'completed', paymentMethod: 'InstaPay', paymentStatus: 'approved', transactionNumber: 'TXN123456', createdAt: '2024-03-01T10:00:00', updatedAt: '2024-03-01T11:00:00' },
  { id: 'ORD-002', userId: '3', userName: 'Ahmed Ali', userEmail: 'ahmed@example.com', items: [{ id: '2', domain: 'techstore', extension: '.online', price: 1.99, period: 1 }, { id: '3', domain: 'techstore', extension: '.store', price: 3.99, period: 1 }], subtotal: 5.98, discount: 0.60, tax: 0.54, total: 5.92, status: 'paid', paymentMethod: 'Vodafone Cash', paymentStatus: 'approved', transactionNumber: 'TXN789012', createdAt: '2024-03-10T14:00:00', updatedAt: '2024-03-10T15:00:00' },
  { id: 'ORD-003', userId: '2', userName: 'John Doe', userEmail: 'john@example.com', items: [{ id: '4', domain: 'startup', extension: '.ai', price: 79.99, period: 1 }], subtotal: 79.99, discount: 0, tax: 8.00, total: 87.99, status: 'pending', paymentMethod: 'Bank Transfer', paymentStatus: 'pending', createdAt: '2024-03-20T09:00:00', updatedAt: '2024-03-20T09:00:00' },
];

const defaultUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@domainhub.com', phone: '+20 100 000 0000', country: 'Egypt', city: 'Cairo', address: '123 Admin St', role: 'admin', isVerified: true, isActive: true, createdAt: '2024-01-01' },
  { id: '2', name: 'John Doe', email: 'john@example.com', phone: '+1 555 000 0001', country: 'USA', city: 'New York', address: '456 User Ave', role: 'user', isVerified: true, isActive: true, createdAt: '2024-02-01' },
  { id: '3', name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '+20 111 000 0002', country: 'Egypt', city: 'Alexandria', address: '789 Customer Rd', role: 'user', isVerified: true, isActive: true, createdAt: '2024-02-15' },
  { id: '4', name: 'Sara Mohamed', email: 'sara@example.com', phone: '+20 122 000 0003', country: 'Egypt', city: 'Giza', address: '321 New St', role: 'user', isVerified: false, isActive: true, createdAt: '2024-03-01' },
];

const defaultCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 5, maxUses: 100, usedCount: 23, isActive: true, expiresAt: '2024-12-31' },
  { id: '2', code: 'SAVE5', type: 'fixed', value: 5, minOrder: 20, maxUses: 50, usedCount: 12, isActive: true, expiresAt: '2024-12-31' },
  { id: '3', code: 'AI50OFF', type: 'percentage', value: 50, minOrder: 50, maxUses: 20, usedCount: 5, isActive: false, expiresAt: '2024-06-30' },
];

const defaultBlogPosts: BlogPost[] = [
  { id: '1', title: 'How to Choose the Perfect Domain Name', slug: 'how-to-choose-perfect-domain', excerpt: 'Your domain name is your digital identity. Here are the top tips for choosing the right one...', content: '', category: 'Tips', tags: ['domain', 'tips', 'branding'], image: '/blog/1.jpg', author: 'Admin', isPublished: true, createdAt: '2024-03-01', views: 1234 },
  { id: '2', title: 'Why .AI Domains Are the Future', slug: 'ai-domains-future', excerpt: 'Artificial intelligence is transforming every industry, and .AI domains are leading the digital revolution...', content: '', category: 'Trends', tags: ['ai', 'domain', 'tech'], image: '/blog/2.jpg', author: 'Admin', isPublished: true, createdAt: '2024-03-10', views: 892 },
  { id: '3', title: 'Domain vs Hosting: What You Need to Know', slug: 'domain-vs-hosting', excerpt: 'Many beginners confuse domain names with web hosting. Let us clarify the difference once and for all...', content: '', category: 'Education', tags: ['domain', 'hosting', 'basics'], image: '/blog/3.jpg', author: 'Admin', isPublished: true, createdAt: '2024-03-20', views: 567 },
];

const defaultSiteSettings: SiteSettings = {
  siteName: 'DomainHub',
  tagline: 'Find Your Perfect Domain',
  logo: '🌐',
  favicon: '/favicon.svg',
  primaryColor: '#6366f1',
  currency: 'USD',
  currencySymbol: '$',
  timezone: 'Africa/Cairo',
  language: 'en',
  maintenanceMode: false,
  analyticsId: '',
  taxRate: 10,
  metaTitle: 'DomainHub - Find Your Perfect Domain',
  metaDescription: 'Best domain registrar with lowest prices. Register .com, .net, .org, .ai domains instantly.',
  metaKeywords: 'domain, register domain, buy domain, .com, .net, .org',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpEmail: 'noreply@domainhub.com',
  contactEmail: 'support@domainhub.com',
  contactPhone: '+20 100 123 4567',
  contactAddress: '123 Digital Street, Cairo, Egypt',
  mapUrl: 'https://maps.google.com',
  whatsappNumber: '201012345678',
  facebookUrl: 'https://facebook.com/domainhub',
  twitterUrl: 'https://twitter.com/domainhub',
  instagramUrl: 'https://instagram.com/domainhub',
  telegramUrl: 'https://t.me/domainhub',
};

const defaultNotifications: Notification[] = [
  { id: '1', title: 'New Order', message: 'ORD-003 is pending payment verification', type: 'info', isRead: false, createdAt: '2024-03-20T09:00:00', link: '/admin/orders' },
  { id: '2', title: 'Payment Approved', message: 'Payment for ORD-002 has been approved', type: 'success', isRead: false, createdAt: '2024-03-10T15:00:00', link: '/admin/payments' },
  { id: '3', title: 'New User Registered', message: 'Sara Mohamed just created an account', type: 'info', isRead: true, createdAt: '2024-03-01T09:00:00', link: '/admin/users' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Language
      language: 'en',
      setLanguage: (lang) => {
        set({ language: lang });
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
      },

      // Auth
      currentUser: null,
      isAuthenticated: false,
      token: null,
      login: (user, token) => set({ currentUser: user, isAuthenticated: true, token }),
      logout: () => set({ currentUser: null, isAuthenticated: false, token: null }),

      // Cart
      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        const exists = cart.find(c => c.domain + c.extension === item.domain + item.extension);
        if (!exists) set({ cart: [...cart, item] });
      },
      removeFromCart: (id) => set({ cart: get().cart.filter(c => c.id !== id) }),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, item) => sum + item.price, 0),

      // Favorites
      favorites: [],
      toggleFavorite: (domain) => {
        const favs = get().favorites;
        if (favs.includes(domain)) {
          set({ favorites: favs.filter(f => f !== domain) });
        } else {
          set({ favorites: [...favs, domain] });
        }
      },
      isFavorite: (domain) => get().favorites.includes(domain),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),
      isSearching: false,
      setIsSearching: (val) => set({ isSearching: val }),

      // Extensions
      extensions: defaultExtensions,
      setExtensions: (ext) => set({ extensions: ext }),

      // Payment Methods
      paymentMethods: defaultPaymentMethods,
      setPaymentMethods: (methods) => set({ paymentMethods: methods }),

      // Support Links
      supportLinks: defaultSupportLinks,
      setSupportLinks: (links) => set({ supportLinks: links }),

      // Reviews
      reviews: defaultReviews,
      setReviews: (reviews) => set({ reviews }),

      // FAQs
      faqs: defaultFAQs,
      setFaqs: (faqs) => set({ faqs }),

      // Orders
      orders: defaultOrders,
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateOrder: (id, updates) => set({ orders: get().orders.map(o => o.id === id ? { ...o, ...updates } : o) }),

      // Users
      users: defaultUsers,
      setUsers: (users) => set({ users }),

      // Coupons
      coupons: defaultCoupons,
      setCoupons: (coupons) => set({ coupons }),

      // Notifications
      notifications: defaultNotifications,
      addNotification: (n) => set({ notifications: [n, ...get().notifications] }),
      markNotificationRead: (id) => set({ notifications: get().notifications.map(n => n.id === id ? { ...n, isRead: true } : n) }),
      markAllNotificationsRead: () => set({ notifications: get().notifications.map(n => ({ ...n, isRead: true })) }),

      // Blog Posts
      blogPosts: defaultBlogPosts,
      setBlogPosts: (posts) => set({ blogPosts: posts }),

      // Site Settings
      siteSettings: defaultSiteSettings,
      updateSiteSettings: (settings) => set({ siteSettings: { ...get().siteSettings, ...settings } }),

      // Admin tab
      adminTab: 'dashboard',
      setAdminTab: (tab) => set({ adminTab: tab }),
    }),
    {
      name: 'domainhub-store',
      partialize: (state: any) => ({
        theme: state.theme,
        language: state.language,
        cart: state.cart,
        favorites: state.favorites,
        token: state.token,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    } as any
  )
);
