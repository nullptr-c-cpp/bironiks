import React, { useState, useEffect } from 'react';
import { SpecificationProvider } from './context/SpecificationContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SpecificationDrawer } from './components/SpecificationDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ContactsPage } from './pages/ContactsPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { SitemapPage } from './pages/SitemapPage';

// Helper to extract clean internal route
function getInitialRoute(): string {
  try {
    // 1. Check hash first (e.g. #/catalog)
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }

    // 2. Check for redirect param ?p=/route (from 404.html)
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('p');
    if (redirectPath) {
      const cleanRedirect = redirectPath.replace(/~and~/g, '&');
      return cleanRedirect;
    }

    // 3. Extract path relative to base repository path
    const rawPath = window.location.pathname;
    const knownPrefixes = ['/catalog', '/news', '/contacts', '/logistics', '/sitemap'];
    for (const prefix of knownPrefixes) {
      const idx = rawPath.indexOf(prefix);
      if (idx !== -1) {
        return rawPath.substring(idx) + window.location.search;
      }
    }
  } catch {
    // Fallback safely
  }
  return '/';
}

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => getInitialRoute());
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);

  // Sync with browser history and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getInitialRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    // On GitHub Pages (or static hosting), hash routing prevents 404 and white-screen issues
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    if (isGitHubPages || window.location.hash.startsWith('#/')) {
      window.location.hash = path;
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simple Router Matcher
  const renderCurrentPage = () => {
    const [pathname, searchStr] = currentPath.split('?');
    const searchParams = new URLSearchParams(searchStr || '');

    if (pathname === '/' || pathname === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (pathname === '/catalog' || pathname === '/catalog/') {
      const cat = searchParams.get('category') || undefined;
      const col = searchParams.get('collection') || undefined;
      return <CatalogPage key={`${cat}-${col}`} initialCategory={cat} initialCollection={col} onNavigate={navigate} />;
    }

    if (pathname.startsWith('/catalog/')) {
      const slug = pathname.replace('/catalog/', '').replace(/\/$/, '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (pathname === '/news' || pathname === '/news/') {
      return <NewsListPage onNavigate={navigate} />;
    }

    if (pathname.startsWith('/news/')) {
      const slug = pathname.replace('/news/', '').replace(/\/$/, '');
      return <NewsDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (pathname === '/contacts' || pathname === '/contacts/') {
      return <ContactsPage onNavigate={navigate} />;
    }

    if (pathname === '/logistics' || pathname === '/logistics/') {
      return <LogisticsPage onNavigate={navigate} />;
    }

    if (pathname === '/sitemap' || pathname === '/sitemap/') {
      return <SitemapPage onNavigate={navigate} />;
    }

    // Default fallback to Home
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <SpecificationProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white font-sans antialiased">
        
        {/* Header */}
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSpecification={() => setIsSpecDrawerOpen(true)}
        />

        {/* Main Routed Page Content */}
        <main className="flex-1">
          {renderCurrentPage()}
        </main>

        {/* Footer */}
        <Footer onNavigate={navigate} />

        {/* Specification Drawer Modal */}
        <SpecificationDrawer
          isOpen={isSpecDrawerOpen}
          onClose={() => setIsSpecDrawerOpen(false)}
          onNavigate={navigate}
        />
      </div>
    </SpecificationProvider>
  );
}

export default App;
