import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ClientAccessModal } from './components/ClientAccessModal';
import { EmergencyModal } from './components/EmergencyModal';
import { LegalModal } from './components/LegalModal';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ServicesView } from './views/ServicesView';
import { BookingView } from './views/BookingView';
import { FaqView } from './views/FaqView';
import { ContactView } from './views/ContactView';
import { AdminPortalView } from './views/AdminPortalView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Scroll to top upon page navigation
  const handleNavigate = (page: Page) => {
    setCurrentPage(page); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1c221f] flex flex-col font-sans selection:bg-[#16382c] selection:text-[#faf9f5]">
      {/* Top Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenPortal={() => setIsPortalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutView onNavigate={handleNavigate} />}
        {currentPage === 'services' && <ServicesView onNavigate={handleNavigate} />}
        {currentPage === 'book' && <BookingView onNavigate={handleNavigate} />}
        {currentPage === 'faqs' && <FaqView onNavigate={handleNavigate} />}
        {currentPage === 'contact' && (
          <ContactView
            onNavigate={handleNavigate}
            onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
          />
        )}
        {currentPage === 'admin' && <AdminPortalView onNavigate={handleNavigate} />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Modals */}
      <ClientAccessModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onNavigateToAdmin={() => handleNavigate('admin')}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onNavigateToBooking={() => handleNavigate('book')}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
