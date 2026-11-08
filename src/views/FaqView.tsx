import React, { useState, useMemo } from 'react';
import { Page } from '../types';
import { FAQS_DATA } from '../data/faqs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Shield,
  Clock,
  HelpCircle
} from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

interface FaqViewProps {
  onNavigate: (page: Page) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [openFaqs, setOpenFaqs] = useState<{ [key: string]: boolean }>({
    'faq-1': true,
  });

  const categories = [
    { id: 'all', label: 'All Questions (11)' },
    { id: 'getting-started', label: 'Getting Started & Consultations' },
    { id: 'scope', label: 'Service Scope & Customisation' },
    { id: 'pricing', label: 'Retainers & Pricing' },
    { id: 'security', label: 'Discretion & Security' },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      const matchesFilter =
        selectedFilter === 'all' || item.category === selectedFilter;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, selectedFilter]);

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categoryGroups = [
    {
      category: 'getting-started',
      number: '01',
      title: 'Getting Started & Consultations',
      badge: 'DISCOVERY PHASE',
    },
    {
      category: 'scope',
      number: '02',
      title: 'Service Scope & Capabilities',
      badge: 'EXECUTION',
    },
    {
      category: 'pricing',
      number: '03',
      title: 'Retainers, Pricing & Flexibility',
      badge: 'COMMERCIAL TERMS',
    },
    {
      category: 'security',
      number: '04',
      title: 'Discretion, Privacy & Security',
      badge: 'GOVERNANCE',
    },
  ];

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. HEADER */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2efe6] border border-[#e2ddd0] text-xs uppercase tracking-[0.2em] font-semibold text-[#57615b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16382c]" />
                <span>Frequently Asked Questions / Client Onboarding & Practices</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14231e] font-normal tracking-tight leading-[1.12]">
                Clarity before commitment.
              </h1>
              <p className="text-sm sm:text-base text-[#4d5751] font-sans leading-relaxed">
                Clear, transparent answers regarding our concierge standards, consultation format, retainer arrangements, confidentiality, and day-to-day coordination.
              </p>
            </div>

            {/* Right Meta Info */}
            <div className="p-5 bg-white border border-[#e2ddd0] rounded-2xl text-left lg:text-right shrink-0 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block font-semibold">
                Active Client Cadence
              </span>
              <p className="font-serif italic text-lg text-[#14231e]">
                Cap: 4 Principals per Coordinator
              </p>
              <span className="text-[11px] font-mono text-[#66726c]">
                London Desk • GMT / CET / EST
              </span>
            </div>
          </div>

          {/* Search Bar with Rounded-Full */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-5 top-4 text-[#79847d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by topic, retainer terms, security, or remote workflows..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#cfc8b8] rounded-full text-xs focus:outline-none focus:border-[#16382c] shadow-sm text-[#191c1b]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-xs text-[#717b75] hover:text-[#191c1b] px-3 py-1 rounded-full bg-[#f4f1e9]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => {
              const isActive = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#16382c] text-white font-semibold shadow-xs'
                      : 'bg-white border border-[#cfc8b8] text-[#525d57] hover:border-[#16382c]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. MAIN ACCORDION & SIDEBAR GRID */}
      <section className="py-16 sm:py-20 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left FAQ Accordion List */}
            <div className="lg:col-span-8 space-y-12">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-[#e2ddd0] shadow-sm">
                  <HelpCircle className="w-10 h-10 text-[#717b75] mx-auto mb-3" />
                  <h3 className="font-serif text-2xl text-[#14231e] mb-1">
                    No matching answers found
                  </h3>
                  <p className="text-xs text-[#646e68] mb-5">
                    Try searching another term, or email our coordinator desk directly for an immediate reply.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    }}
                    className="px-6 py-2.5 bg-[#16382c] text-white text-xs uppercase tracking-wider rounded-full font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                categoryGroups.map((group) => {
                  const groupFaqs = filteredFaqs.filter(
                    (item) => item.category === group.category
                  );
                  if (groupFaqs.length === 0) return null;

                  return (
                    <div key={group.category} className="space-y-4">
                      {/* Section Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd2]">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#f4f1e9] text-[#16382c] text-xs font-mono font-bold flex items-center justify-center border border-[#ded8c8]">
                            {group.number}
                          </span>
                          <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                            {group.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] bg-[#faf8f2] px-2.5 py-1 rounded-full">
                          {group.badge}
                        </span>
                      </div>

                      {/* Accordion Items in Group */}
                      <div className="space-y-3.5">
                        {groupFaqs.map((faq) => {
                          const isOpen = !!openFaqs[faq.id];
                          return (
                            <div
                              key={faq.id}
                              className="bg-white border border-[#e2ddd0] rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:border-[#16382c]/40"
                            >
                              <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf9f5]"
                              >
                                <span className="font-serif text-lg text-[#14231e] font-medium">
                                  {faq.question}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-[#f4f1e9] flex items-center justify-center shrink-0">
                                  <ChevronDown
                                    className={`w-4 h-4 text-[#636c66] transition-transform duration-200 ${
                                      isOpen ? 'rotate-180 text-[#16382c]' : ''
                                    }`}
                                  />
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-6 text-xs sm:text-sm text-[#525d57] font-sans leading-relaxed border-t border-[#f0ece2] pt-4 animate-in fade-in">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Sidebar Columns */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Operating Doctrine */}
              <div className="bg-[#16382c] text-white p-8 rounded-3xl shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#9fc4b2]">
                  <span>Operating Doctrine</span>
                  <div className="w-8 h-8 rounded-full bg-[#275342] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#e5dfc9]" />
                  </div>
                </div>
                <div className="font-serif text-5xl font-medium text-white">
                  1 : 4
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#c0d4ca]">
                  Strict Coordinator-to-Principal Ratio
                </p>
                <p className="text-xs text-[#c0d4ca] font-sans leading-relaxed">
                  Unlike volume-based lifestyle agencies that assign 30+ accounts to junior call handlers, BEUA caps all coordinators at four private principals. This ensures deep familiarity, proactive oversight, and immediate availability.
                </p>
                <div className="pt-4 border-t border-[#275342] flex items-center justify-between text-[11px] text-[#a5cbba] font-mono">
                  <span>• Sub-30m Response</span>
                  <span>• Encrypted Vaults</span>
                </div>
              </div>

              {/* Card 2: A Note on Discretion */}
              <div className="bg-[#f7f5ee] border border-[#ded8c8] p-7 rounded-2xl space-y-3 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block">
                  A Note on Discretion
                </span>
                <p className="font-serif italic text-xs sm:text-sm text-[#14231e] leading-relaxed">
                  "The most valuable concierge service is the one nobody knows you employ. Our work is designed to feel like an extension of your own intuition, leaving no external footprint."
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#636c66] font-mono">
                  <span>Private Office Directorate</span>
                  <span>London W1</span>
                </div>
              </div>

              {/* Card 3: Image Desk card with Lazy Loading */}
              <div className="bg-white border border-[#e2ddd0] rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-44">
                  <LazyImage
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                    alt="Private Member Lounge"
                    className="w-full h-full object-cover filter brightness-[0.95]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4">
                    <p className="font-serif italic text-xs text-white">
                      Tailored for individuals who value time above all else.
                    </p>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between text-xs text-[#525d57]">
                  <div>
                    <span className="font-mono uppercase text-[10px] text-[#717b75] block">Direct Desk Hours</span>
                    <span className="font-semibold text-[#14231e]">Mon–Fri 08:30 – 18:30 GMT</span>
                    <p className="text-[10px] text-[#717b75]">(Priority 24/7 on Retainer)</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f4f1e9] flex items-center justify-center text-[#16382c]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STILL HAVE A QUESTION? + ONBOARDING CALLOUT */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Box: Unanswered Inquiries */}
            <div className="lg:col-span-5 bg-white border border-[#e2ddd0] p-8 rounded-3xl flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center shadow-xs">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block">
                  Unanswered Inquiries
                </span>
                <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                  Still have a specific question?
                </h3>
                <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                  Every client requirement has unique nuances. If your inquiry spans multi-jurisdiction affairs or specialized asset oversight, reach our senior coordinator directly.
                </p>

                <div className="pt-2 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#717b75] block">Direct Coordinator Email</span>
                    <a
                      href="mailto:concierge@beua-support.com"
                      className="text-xs sm:text-sm text-[#16382c] font-semibold underline underline-offset-2"
                    >
                      concierge@beua-support.com ↗
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#717b75] block">Mayfair Advisory Desk</span>
                    <a
                      href="tel:+442079460188"
                      className="text-xs sm:text-sm text-[#16382c] font-mono font-semibold"
                    >
                      +44 (0) 20 7946 0188
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-[#f0ece2] text-[11px] text-[#636c66] flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Average confidential reply: under 2 hours</span>
              </div>
            </div>

            {/* Right Box: Ready to reclaim personal bandwidth */}
            <div className="lg:col-span-7 bg-[#f6f4ee] border border-[#ded8c8] p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75]">
                    Private Onboarding
                  </span>
                  <span className="bg-[#e4dfd0] text-[#16382c] px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold">
                    Complimentary Discovery
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#14231e] font-medium">
                  Ready to reclaim your personal bandwidth?
                </h3>
                <p className="text-xs sm:text-sm text-[#4d5751] font-sans leading-relaxed">
                  Reserve a quiet 30-minute private discovery conversation. We will listen to your lifestyle pain points, audit administrative friction, and provide candid advice on structuring your personal support.
                </p>

                {/* 3 Step Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-4 rounded-2xl border border-[#e2ddd0] text-xs shadow-xs">
                    <span className="text-[10px] font-mono text-[#717b75] uppercase block">Step 01</span>
                    <p className="font-semibold text-[#14231e] mt-0.5">30–Min Discovery</p>
                    <p className="text-[10px] text-[#646e68]">Confidential audio/video</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#e2ddd0] text-xs shadow-xs">
                    <span className="text-[10px] font-mono text-[#717b75] uppercase block">Step 02</span>
                    <p className="font-semibold text-[#14231e] mt-0.5">Scoping Memo</p>
                    <p className="text-[10px] text-[#646e68]">Delivered in 24 hours</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#e2ddd0] text-xs shadow-xs">
                    <span className="text-[10px] font-mono text-[#717b75] uppercase block">Step 03</span>
                    <p className="font-semibold text-[#14231e] mt-0.5">48h Integration</p>
                    <p className="text-[10px] text-[#646e68]">Encrypted direct line</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onNavigate('book')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-md text-center"
                >
                  Book a Consultation (30 min • Free) ➔
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-7 py-3.5 border border-[#cfc8b8] text-[#14231e] text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#efebe1] transition-colors cursor-pointer text-center"
                >
                  Submit Written Brief 
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
