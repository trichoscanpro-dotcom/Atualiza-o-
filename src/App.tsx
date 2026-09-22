import React from 'react';
import { CMSProvider, useCMS } from './context/CMSContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { BigodeAIAssistant } from './components/BigodeAIAssistant';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CatalogPage } from './pages/CatalogPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { LegalPages } from './pages/LegalPages';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useCMS();

  // If in admin panel, render without standard public navbar/footer for full-focus view
  if (currentRoute === 'admin-panel') {
    return (
      <div className="min-h-screen bg-[#090A0C] text-[#F3F4F6] flex flex-col font-sans">
        <SEOHead />
        <AdminPanelPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#E5A93C] selection:text-black">
      <SEOHead />
      <Navbar />
      
      <main className="flex-1">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'catalog' && <CatalogPage />}
        {currentRoute === 'item-detail' && <ItemDetailPage />}
        {currentRoute === 'portfolio' && <PortfolioPage />}
        {currentRoute === 'testimonials' && <TestimonialsPage />}
        {currentRoute === 'faq' && <FAQPage />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'track' && <TrackOrderPage />}
        {currentRoute === 'privacy' && <LegalPages type="privacy" />}
        {currentRoute === 'terms' && <LegalPages type="terms" />}
        {currentRoute === 'admin-login' && <AdminLoginPage />}
      </main>

      <Footer />

      {/* Global Interactive Elements */}
      <CartDrawer />
      <ProductModal />
      <MobileBottomBar />
      <BigodeAIAssistant />
    </div>
  );
};

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}
