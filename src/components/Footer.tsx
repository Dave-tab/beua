import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f5f3ec] border-t border-[#e2ddd0] text-[#1c221f] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#e2ddd0]">
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-10">
            <div
              onClick={() => handleNav('home')}
              className="inline-block cursor-pointer select-none"
            >
              <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#14231e]">
                BEUA
              </span>
            </div>
            <p className="text-sm text-[#4f5953] leading-relaxed max-w-sm font-sans">
              Thoughtful concierge assistance and lifestyle coordination for busy professionals,
              entrepreneurs, and discerning individuals.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717b75] font-medium">
                Private Office & Advisory
              </span>
            </div>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-[0.18em] text-[#14231e] font-semibold">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#525d57] font-sans">
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  Personal Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  Lifestyle & Travel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  Administrative Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  Consultation Planning
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-[0.18em] text-[#14231e] font-semibold">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-[#525d57] font-sans">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  About BEUA
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faqs')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('book')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  Book Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-[#16382c] transition-colors cursor-pointer text-left font-mono text-[11px] text-[#717b75]"
                >
                  Coordinator Portal ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-[0.18em] text-[#14231e] font-semibold">
              Client Care
            </h4>
            <div className="space-y-2.5 text-xs text-[#525d57] font-sans">
              <div>
                <p className="font-medium text-[#2d3631]">Direct Inquiries</p>
                <a
                  href="mailto:concierge@beua-support.com"
                  className="text-[#16382c] underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  concierge@beua-support.com
                </a>
              </div>
              <p className="text-[#646e68]">
                London & Remote Global Support
              </p>
              <p className="text-[#646e68]">
                Mon–Fri 08:30 – 18:30 GMT
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#76807a] gap-4">
          <p>© 2026 BEUA Concierge & Support.</p>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#14231e] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#14231e] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
