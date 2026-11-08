import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, User, Phone, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenPortal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'FAQs', page: 'faqs' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f5]/95 backdrop-blur-md border-b border-[#e7e3d8] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#14231e] group-hover:text-[#1d4335] transition-colors">
              BEUA
            </span>
            <div className="h-4 w-[1px] bg-[#cfc8b8]" />
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#636c66] font-medium hidden sm:inline-block">
              Concierge & Support
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-sm tracking-wide transition-all relative py-1 cursor-pointer font-sans ${
                    isActive
                      ? 'text-[#14231e] font-semibold'
                      : 'text-[#56605b] hover:text-[#14231e] font-normal'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#14231e] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('book')}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 rounded-full cursor-pointer shadow-xs ${
                currentPage === 'book'
                  ? 'bg-[#1b3d32] text-white ring-2 ring-[#1b3d32] ring-offset-2'
                  : 'bg-[#16382c] text-white hover:bg-[#1f483b] active:scale-[0.98]'
              }`}
            >
              Book a Consultation
            </button>
            <button
              onClick={onOpenPortal}
              title="Private Client Portal Access"
              className="w-10 h-10 rounded-full border border-[#cfc8b8] flex items-center justify-center text-[#2e3732] hover:text-[#16382c] hover:border-[#16382c] hover:bg-[#efebe0] transition-colors cursor-pointer"
              aria-label="Private Client Access"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenPortal}
              className="p-2.5 rounded-full border border-[#cfc8b8] text-[#2e3732]"
              aria-label="Client Portal"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1c221f] hover:text-[#16382c] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e7e3d8] bg-[#f8f6f0] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left px-4 py-3 rounded-xl text-base font-sans tracking-wide transition-colors ${
                    isActive
                      ? 'bg-[#eae5d8] text-[#14231e] font-semibold'
                      : 'text-[#4e5852] hover:bg-[#efebe1]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#e2ddd0] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('book')}
              className="w-full text-center py-3.5 bg-[#16382c] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-xs"
            >
              Book a Consultation
            </button>
            <div className="flex items-center justify-between text-xs text-[#5e6661] pt-2 px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16382c]" /> Strictly Confidential
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#16382c]" /> +44 (0) 20 7946 0188
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
