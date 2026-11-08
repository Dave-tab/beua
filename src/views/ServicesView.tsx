import React, { useState, useRef } from 'react';
import { Page, ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/services';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Plane,
  CheckCircle2,
  Calendar,
  Lock,
  Clock,
  FileText,
  Briefcase,
  Home as HomeIcon,
  Laptop,
  Compass,
  Check
} from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

interface ServicesViewProps {
  onNavigate: (page: Page) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [activeDossierTab, setActiveDossierTab] = useState<'aviation' | 'estate' | 'executive'>('aviation');
  const frameworkRef = useRef<HTMLDivElement | null>(null);

  const filters = [
    { id: 'all', label: 'All Services' },
    { id: 'personal', label: 'Personal Concierge' },
    { id: 'travel', label: 'Lifestyle & Travel' },
    { id: 'admin', label: 'Administrative & Virtual' },
    { id: 'advisory', label: 'Consultation & Planning' },
  ];

  const handleFilterChange = (id: string) => {
    if (id === selectedFilter) return;
    setIsFilterLoading(true);
    setSelectedFilter(id);
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 200);
  };

  const filteredServices =
    selectedFilter === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.categoryKey === selectedFilter);

  const scrollToFramework = () => {
    frameworkRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. HEADER DIRECTORY */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#57615b]">
                <span>Capabilities & Service Directory</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14231e] font-normal tracking-tight leading-[1.12]">
                Thoughtful assistance, <br className="hidden sm:inline" />
                <span className="italic">calibrated to your life.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#4d5751] font-sans leading-relaxed">
                A bespoke suite of lifestyle management, private aviation coordination, and executive administrative support—delivered with absolute discretion and meticulous human oversight.
              </p>
            </div>

            {/* Top Right Capped Roster Badge */}
            <div className="bg-white p-6 rounded-2xl border border-[#e2ddd0] max-w-xs shrink-0 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] mb-1 font-semibold">
                Private Office Standard
              </div>
              <div className="font-serif text-2xl text-[#14231e] font-medium mb-1">
                Strictly 1 : 4 Ratio
              </div>
              <p className="text-xs text-[#525d57] leading-relaxed font-sans">
                Ensuring sub-30m response latency, contextual memory, and zero rotating call-center agents.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 pb-6 border-b border-[#e5dfd2]">
            {filters.map((filter) => {
              const isActive = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`px-5 py-2.5 text-xs font-sans tracking-wide rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#16382c] text-white font-medium shadow-sm'
                      : 'bg-white border border-[#cfc8b8] text-[#4d5751] hover:border-[#16382c] hover:text-[#16382c]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Visual Showcase Banners with Local High-Res Photography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="relative rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] h-64 group shadow-sm">
              <LazyImage
                src="/src/assets/images/travel_dossier_flatlay_1793552651377.jpg"
                alt="Private Travel & Itinerary Coordination"
                className="w-full h-full object-cover filter brightness-[0.97] group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9fc4b2] font-semibold">
                  Lifestyle & Mobility
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium mt-1">
                  Private Aviation & Curated Itineraries
                </h3>
                <p className="text-xs text-[#c0d4ca] font-sans mt-1 line-clamp-1">
                  Bespoke flight charters, tarmac transfers, and confidential European travel.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] h-64 group shadow-sm">
              <LazyImage
                src="/src/assets/images/private_member_lounge_1793552650720.jpg"
                alt="Private Member Lounges & Executive Care"
                className="w-full h-full object-cover filter brightness-[0.97] group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9fc4b2] font-semibold">
                  Personal Concierge
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium mt-1">
                  Member Clubs & Estate Stewardship
                </h3>
                <p className="text-xs text-[#c0d4ca] font-sans mt-1 line-clamp-1">
                  Exclusive reservations, Mayfair salons, and confidential residential upkeep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES LIST */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <AnimatePresence mode="wait">
            {isFilterLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-[#e2ddd0] p-8 sm:p-12 animate-pulse space-y-6">
                    <div className="h-4 bg-[#f0ece2] rounded-full w-48" />
                    <div className="h-8 bg-[#f0ece2] rounded-xl w-3/4" />
                    <div className="h-4 bg-[#f0ece2] rounded-full w-full" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="h-28 bg-[#faf8f2] rounded-xl" />
                      <div className="h-28 bg-[#faf8f2] rounded-xl" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={selectedFilter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {filteredServices.map((service: ServiceItem) => {
                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-3xl border border-[#e2ddd0] p-8 sm:p-12 shadow-sm space-y-8 hover:border-[#16382c]/40 transition-colors"
                    >
                      {/* Top Header of Suite */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#f0ece2]">
                        <div className="space-y-2">
                          <span className="text-xs font-mono uppercase tracking-widest text-[#717b75] block font-semibold">
                            {service.categoryTag}
                          </span>
                          <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight">
                            {service.title}
                          </h2>
                          <p className="text-sm text-[#4d5751] font-sans leading-relaxed max-w-2xl">
                            {service.shortDesc}
                          </p>
                        </div>
                        <span className="font-serif text-3xl sm:text-4xl font-light text-[#14231e]/20 self-start md:self-auto">
                          {service.index}
                        </span>
                      </div>

                      {/* 2-Column Split: Detailed Scope & Vignette */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Scope & Deliverables */}
                        <div className="lg:col-span-7 space-y-6">
                          <p className="text-xs sm:text-sm text-[#525d57] font-sans leading-relaxed">
                            {service.longDesc}
                          </p>

                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider text-[#14231e] font-semibold mb-3">
                              Key Deliverables & Responsibilities:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {service.deliverables.map((item, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="p-3.5 rounded-xl bg-[#faf8f2] border border-[#eee9db] flex items-start gap-2.5 text-xs text-[#3a443f]"
                                >
                                  <Check className="w-4 h-4 text-[#16382c] shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-[#14231e] font-semibold">
                              Governance & Standards:
                            </h4>
                            <ul className="space-y-2 text-xs text-[#525d57] font-sans">
                              {service.attributes.map((attr, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <span className="text-[#16382c]">•</span>
                                  <span>{attr}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Vignette / Real-World Case */}
                        {service.vignette ? (
                          <div className="lg:col-span-5 bg-[#f8f6f0] p-6 sm:p-7 rounded-2xl border border-[#ded8c8] space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#717b75] pb-3 border-b border-[#e8e4d8]">
                              <span>{service.vignette.tag}</span>
                              <span>VERIFIED RECORD</span>
                            </div>

                            <h4 className="font-serif text-lg text-[#14231e] font-medium leading-snug">
                              {service.vignette.title}
                            </h4>

                            {service.vignette.quote && (
                              <blockquote className="font-serif italic text-xs text-[#2a342f] leading-relaxed">
                                "{service.vignette.quote}"
                                {service.vignette.author && (
                                  <footer className="font-sans not-italic text-[10px] text-[#717b75] mt-2 block font-medium">
                                    — {service.vignette.author}
                                  </footer>
                                )}
                              </blockquote>
                            )}

                            {service.vignette.flightSample && (
                              <div className="space-y-2 text-xs font-mono bg-white p-4 rounded-xl border border-[#ded8c8]">
                                <div className="text-[#16382c] font-semibold">
                                  {service.vignette.flightSample.route}
                                </div>
                                <div className="text-[11px] text-[#525d57]">
                                  • {service.vignette.flightSample.chauffeur}
                                </div>
                                <div className="text-[11px] text-[#525d57]">
                                  • {service.vignette.flightSample.airTransfer}
                                </div>
                                <div className="text-[10px] text-[#717b75] pt-1 border-t border-[#f0ece2]">
                                  Status: {service.vignette.flightSample.status}
                                </div>
                              </div>
                            )}

                            {service.vignette.metric && (
                              <div className="bg-white p-4 rounded-xl border border-[#ded8c8] space-y-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-serif text-3xl font-medium text-[#16382c]">
                                    {service.vignette.metric.reclaimHours}
                                  </span>
                                  <span className="text-xs font-mono text-[#717b75]">Hours / Week Saved</span>
                                </div>
                                <p className="text-[11px] text-[#525d57] leading-relaxed">
                                  {service.vignette.metric.annotation}
                                </p>
                              </div>
                            )}

                            {service.vignette.diagnostic && (
                              <div className="space-y-2.5">
                                {service.vignette.diagnostic.steps.map((st) => (
                                  <div key={st.number} className="text-xs bg-white p-3 rounded-xl border border-[#ded8c8]">
                                    <div className="font-mono text-[#16382c] font-semibold text-[11px]">
                                      Step 0{st.number}: {st.title}
                                    </div>
                                    <div className="text-[11px] text-[#525d57] mt-0.5">{st.desc}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => onNavigate('book')}
                              className="w-full py-2.5 bg-[#16382c] text-white text-xs uppercase tracking-wider font-semibold rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-xs mt-2"
                            >
                              Inquire for This Suite ➔
                            </button>
                          </div>
                        ) : (
                          <div className="lg:col-span-5 bg-[#f8f6f0] p-6 rounded-2xl border border-[#ded8c8] flex items-center justify-center text-xs text-[#717b75]">
                            Custom scope arranged upon consultation.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. INTERACTIVE SAMPLE DELIVERABLE DOSSIERS */}
      <section className="py-20 sm:py-24 border-t border-[#e5dfd2] bg-[#f5f2e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
              Deliverables Preview
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight mb-3">
              What you receive: The BEUA Dossier
            </h2>
            <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
              Every coordinated mission yields a crisp, beautifully assembled dossier. Explore interactive sample deliverables below.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e2ddd0] shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#e5dfd2] bg-[#faf8f2] overflow-x-auto">
              <button
                onClick={() => setActiveDossierTab('aviation')}
                className={`py-4 px-6 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeDossierTab === 'aviation'
                    ? 'bg-white text-[#16382c] font-bold border-b-2 border-[#16382c]'
                    : 'text-[#69746e] hover:text-[#14231e]'
                }`}
              >
                1. Private Aviation & Journey Manifest
              </button>
              <button
                onClick={() => setActiveDossierTab('estate')}
                className={`py-4 px-6 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeDossierTab === 'estate'
                    ? 'bg-white text-[#16382c] font-bold border-b-2 border-[#16382c]'
                    : 'text-[#69746e] hover:text-[#14231e]'
                }`}
              >
                2. Estate Stewardship & Contractor Audit
              </button>
              <button
                onClick={() => setActiveDossierTab('executive')}
                className={`py-4 px-6 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeDossierTab === 'executive'
                    ? 'bg-white text-[#16382c] font-bold border-b-2 border-[#16382c]'
                    : 'text-[#69746e] hover:text-[#14231e]'
                }`}
              >
                3. Executive Friday Briefing Digest
              </button>
            </div>

            {/* Dossier Content Panel */}
            <div className="p-8 sm:p-10 font-sans text-[#2a342f]">
              {activeDossierTab === 'aviation' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ece2] gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#717b75]">
                        DOSSIER REF: BEUA-AV-884 · PRIVILEGED
                      </span>
                      <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                        Farnborough (FAB) ➔ Nice Côte d'Azur (NCE) · Falcon 7X
                      </h3>
                    </div>
                    <span className="font-mono text-xs bg-[#edf4f0] text-[#16382c] px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
                      All Clearance Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8]">
                      <span className="font-mono uppercase text-[10px] text-[#717b75] block">FBO & Tarmac Link</span>
                      <strong className="block text-sm text-[#14231e] mt-1">Signature Flight Support FAB</strong>
                      <p className="text-[11px] text-[#525d57] mt-0.5">Direct tarmac boarding; tail number G-BEUA; chauffeur tarmac clearance active.</p>
                    </div>
                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8]">
                      <span className="font-mono uppercase text-[10px] text-[#717b75] block">Customs & Passports</span>
                      <strong className="block text-sm text-[#14231e] mt-1">Pre-Cleared Diplomatic Fast-Track</strong>
                      <p className="text-[11px] text-[#525d57] mt-0.5">Manifest filed with French border police; zero terminal queuing required.</p>
                    </div>
                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8]">
                      <span className="font-mono uppercase text-[10px] text-[#717b75] block">Arrival Transit</span>
                      <strong className="block text-sm text-[#14231e] mt-1">Heli Transfer standing by NCE ➔ Monaco</strong>
                      <p className="text-[11px] text-[#525d57] mt-0.5">Monacair pilot briefed; baggage transferred directly to Monte-Carlo villa.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDossierTab === 'estate' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ece2] gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#717b75]">
                        ESTATE REPORT: BEUA-EST-104 · KENSINGTON & CHELSEA
                      </span>
                      <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                        Townhouse Mechanical & Heritage Plaster Conservation
                      </h3>
                    </div>
                    <span className="font-mono text-xs bg-[#edf4f0] text-[#16382c] px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
                      Audit Approved & Verified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <strong className="text-[#14231e] text-sm block">Heritage Lime Plastering Inspection</strong>
                        <p className="text-[#525d57] text-[11px]">Specialist conservator finished morning cure. No cracks; 100% compliant with English Heritage guidelines.</p>
                      </div>
                      <span className="text-xs font-mono text-[#16382c] font-bold shrink-0">Sign-off Verified · £3,450 approved</span>
                    </div>

                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <strong className="text-[#14231e] text-sm block">HVAC & Wine Cellar Temperature Telemetry</strong>
                        <p className="text-[#525d57] text-[11px]">Cellar sensor calibrated to 12.8°C with 65% humidity. Secondary compressor serviced and tested.</p>
                      </div>
                      <span className="text-xs font-mono text-[#16382c] font-bold shrink-0">Optimal Readings</span>
                    </div>
                  </div>
                </div>
              )}

              {activeDossierTab === 'executive' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ece2] gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#717b75]">
                        EXECUTIVE BRIEFING: FRIDAY 17:00 GMT · PRIVATE DIGEST
                      </span>
                      <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                        Weekly Operational Summary & Next Week Forward Look
                      </h3>
                    </div>
                    <span className="font-mono text-xs bg-[#edf4f0] text-[#16382c] px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
                      Zero Open Action Items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8]">
                      <span className="font-mono uppercase text-[10px] text-[#16382c] font-bold block mb-1">Decisions Resolved This Week</span>
                      <ul className="space-y-1 text-[#525d57]">
                        <li>• 82 non-essential emails filtered out of primary inbox</li>
                        <li>• Board dinner venue shifted to The Connaught with private salon</li>
                        <li>• 3 contractor invoices audited, disputing £680 duplicate labor charge</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8]">
                      <span className="font-mono uppercase text-[10px] text-[#16382c] font-bold block mb-1">Preview for Next Week</span>
                      <ul className="space-y-1 text-[#525d57]">
                        <li>• Mon 09:00: Chauffeur positioned for St. Pancras Eurostar to Paris</li>
                        <li>• Wed 14:00: Private viewing at Sotheby's impressionist preview</li>
                        <li>• Thu 18:00: Zurich wealth counsel zoom links pre-tested</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FRAMEWORK OF ENGAGEMENT */}
      <section ref={frameworkRef} className="py-20 sm:py-24 border-t border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
            Framework of Engagement
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight mb-3">
            How We Deliver Our Services
          </h2>
          <p className="text-sm text-[#4d5751] font-sans max-w-xl mx-auto leading-relaxed mb-16">
            Engineered for agility, discretion, and reliable continuity across ongoing retainers and focused episodic projects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                model: 'Primary Model',
                icon: Lock,
                title: 'Dedicated Monthly Retainer',
                desc: 'Continuous, high-touch support with guaranteed hours and deep contextual knowledge of your preferences.',
                features: [
                  'Dedicated single coordinator (1:4 ratio)',
                  'Sub-30m priority response window',
                  'Encrypted direct Signal & WhatsApp channel',
                  'Rollover allowance for unused hours',
                ],
                btnText: 'Inquire About Retainers',
                btnPrimary: false,
                target: 'contact' as Page,
              },
              {
                model: 'Ad-Hoc & Sprints',
                icon: Plane,
                title: 'Flexible Project Allocation',
                desc: 'Focused coordination for discrete milestones such as international relocations, multi-leg journeys, or private events.',
                features: [
                  'Defined scope and clear deliverables',
                  'Comprehensive itinerary & vendor dossiers',
                  'On-call concierge during travel execution',
                  'Post-project archive and handoff',
                ],
                btnText: 'Scope a Specific Project',
                btnPrimary: false,
                target: 'contact' as Page,
              },
              {
                model: 'Discovery Step',
                icon: Calendar,
                title: 'Advisory Discovery Session',
                desc: 'A preliminary diagnostic conversation to review current bottlenecks and evaluate alignment without financial commitment.',
                features: [
                  'Complimentary 30-minute private call',
                  'Analysis of time leaks and friction',
                  'Written scope recommendation',
                  'Direct consultation with lead principal',
                ],
                btnText: 'Book Discovery (Free)',
                btnPrimary: true,
                target: 'book' as Page,
              },
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-[#e2ddd0] flex flex-col justify-between shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-[#f0ece2]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#16382c] font-bold bg-[#f4f1e9] px-2.5 py-1 rounded-full">
                        {card.model}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#f4f1e9] flex items-center justify-center text-[#16382c]">
                        <IconComp className="w-4 h-4 text-[#16382c]" />
                      </div>
                    </div>
                    <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#525d57] leading-relaxed font-sans">
                      {card.desc}
                    </p>
                    <ul className="space-y-2.5 text-xs text-[#434d47] font-sans pt-2">
                      {card.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#16382c]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => onNavigate(card.target)}
                    className={`mt-8 w-full py-3 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-xs ${
                      card.btnPrimary
                        ? 'bg-[#16382c] text-white hover:bg-[#1f483b]'
                        : 'border border-[#cfc8b8] text-[#14231e] hover:bg-[#efebe1]'
                    }`}
                  >
                    {card.btnText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#e5dfd2]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight">
            Ready to discuss your requirements?
          </h2>
          <p className="text-sm text-[#4d5751] font-sans max-w-lg mx-auto leading-relaxed">
            Every client partnership begins with a complimentary 30-minute introductory call. No obligation, no generic packages—just a thoughtful conversation about where you need space and support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('book')}
              className="px-8 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              Book a Consultation (30 min · Free) ➔
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 border border-[#cfc8b8] text-[#14231e] text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#efebe1] transition-colors cursor-pointer"
            >
              Submit a Written Enquiry →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
