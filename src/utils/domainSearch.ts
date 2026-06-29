import { Extension, Domain } from '../store/useStore';

// Simulated domain availability check
// In production, this would call the backend API
const takenDomains: string[] = [
  'google.com', 'facebook.com', 'apple.com', 'amazon.com', 'microsoft.com',
  'netflix.com', 'twitter.com', 'instagram.com', 'youtube.com', 'github.com',
  'google.net', 'facebook.net', 'amazon.net', 'microsoft.net',
  'example.com', 'example.net', 'example.org',
  'test.com', 'test.net', 'demo.com',
  'shop.com', 'store.com', 'app.com', 'web.com',
  'cucu.net', 'cucu.org', 'cucu.com',
  'hello.com', 'world.com', 'news.com',
];

export function checkDomainAvailability(domain: string, extension: string): boolean {
  const fullDomain = `${domain.toLowerCase()}${extension}`;
  // Simulate: some domains are taken
  if (takenDomains.includes(fullDomain)) return false;
  // Randomly mark some as taken for demo (consistent per domain name)
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const extIndex = parseInt(extension.replace('.', '').slice(0, 1), 36) || 0;
  return (hash + extIndex) % 4 !== 0; // ~25% taken
}

export function searchDomains(query: string, extensions: Extension[]): Domain[] {
  const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  if (!cleanQuery) return [];

  const activeExtensions = extensions.filter(e => e.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  return activeExtensions.map(ext => {
    const available = checkDomainAvailability(cleanQuery, ext.name);
    return {
      id: `${cleanQuery}${ext.name}`,
      name: cleanQuery,
      extension: ext.name,
      fullName: `${cleanQuery}${ext.name}`,
      price: ext.price,
      status: available ? 'available' : 'taken',
      isPopular: ext.isPopular,
    };
  });
}

export function generateSuggestions(query: string, extensions: Extension[]): Domain[] {
  const prefixes = ['get', 'my', 'the', 'try', 'go', 'use', 'best'];
  const suffixes = ['app', 'hub', 'store', 'ai', 'pro', 'plus', 'now', 'io', 'hq', 'co'];

  const suggestions: string[] = [];

  // Prefix suggestions
  prefixes.forEach(prefix => {
    suggestions.push(`${prefix}${query}`);
  });

  // Suffix suggestions
  suffixes.forEach(suffix => {
    suggestions.push(`${query}${suffix}`);
  });

  // Combined
  suggestions.push(`${query}online`, `${query}web`, `${query}digital`, `${query}agency`);

  const activeExtensions = extensions.filter(e => e.isActive).slice(0, 3);
  const results: Domain[] = [];

  suggestions.slice(0, 12).forEach(suggestion => {
    activeExtensions.forEach(ext => {
      const available = checkDomainAvailability(suggestion, ext.name);
      if (available) {
        results.push({
          id: `${suggestion}${ext.name}`,
          name: suggestion,
          extension: ext.name,
          fullName: `${suggestion}${ext.name}`,
          price: ext.price,
          status: 'available',
          isPopular: ext.isPopular,
        });
      }
    });
  });

  return results.slice(0, 16);
}

export function formatCurrency(amount: number, currency = 'USD', symbol = '$'): string {
  return `${symbol}${amount.toFixed(2)}`;
}
