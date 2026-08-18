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

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);

  // Sync with browser history back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
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
