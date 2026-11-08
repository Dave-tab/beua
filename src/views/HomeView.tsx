import React, { useState } from 'react';
import { Page } from '../types';
import { motion, Variants } from 'framer-motion';
import {
  Shield,
  Eye,
  Globe,
  Briefcase,
  Plane,
  Laptop,
  Compass,
  ArrowRight,
  Clock,
  PhoneCall,
  CheckCircle,
  ChevronDown,
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';
import { FAQS_DATA } from '../data/faqs';
import { LazyImage } from '../components/LazyImage';
import heroMayfairStudy from '../assets/images/hero_mayfair_study_1793552648741.jpg';
import conciergeDirectorPortrait from '../assets/images/concierge_director_portrait_1793552650187.jpg';

interface HomeViewProps {
  onNavigate: (page: Page) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  // Calculator State
  const [calcHours, setCalcHours] = useState<number>(14);
  const [selectedPains, setSelectedPains] = useState<string[]>([
    'travel',
    'admin',
    'domestic',
  ]);

  // Timeline Tab
  const [activeTimelineTab, setActiveTimelineTab] = useState<number>(0);

  const painPoints = [
    { id: 'travel', label: 'Private Aviation & International Travel' },
    { id: 'domestic', label: 'Estate Operations & Domestic Contractors' },
    { id: 'admin', label: 'Executive Diary, Scheduling & Inbox' },
    { id: 'dining', label: 'Private Members Clubs & Fine Dining' },
    { id: 'procurement', label: 'Rare Sourcing, Gifting & Relocations' },
  ];

  const togglePain = (id: string) => {
    if (selectedPains.includes(id)) {
      if (selectedPains.length > 1) {
        setSelectedPains(selectedPains.filter((p) => p !== id));
      }
    } else {
      setSelectedPains([...selectedPains, id]);
    }
  };

  // Monthly reclaimed hours ~ 75% of wasted hours
  const reclaimedMonthlyHours = Math.round(calcHours * 4.2 * 0.75);
  const annualReclaimedHours = Math.round(reclaimedMonthlyHours * 12);

  const getRecommendedTier = () => {
    if (reclaimedMonthlyHours <= 20) {
      return {
        name: 'Private Associate',
        allocation: '15–20 Hours / Month',
        fit: 'Tailored for personal lifestyle, dining access, and routine domestic coordination.',
      };
    } else if (reclaimedMonthlyHours <= 45) {
      return {
        name: 'Dedicated Coordinator',
        allocation: '30–40 Hours / Month',
        fit: 'Optimal for active international travel schedules, executive administration, and estate stewardship.',
      };
    } else {
      return {
        name: 'Private Office Lead',
        allocation: '60+ Hours / Month',
        fit: 'Comprehensive private office wing for multi-residence families and venture principals.',
      };
    }
  };

  const timelineEvents = [
    {
      time: '08:15 GMT',
      location: 'Mayfair Desk · London W1',
      title: 'Aviation Slot & Chauffeur Handover',
      desc: 'Severe weather re-route over the Alps handled preemptively. Private charter rerouted to Geneva with curbside Mercedes-Maybach transfer waiting tarmac-side at Cointrin.',
      category: 'Lifestyle & Aviation',
      ref: 'REF / GVA-0815',
    },
    {
      time: '12:30 CET',
      location: 'Place de la Fusterie · Geneva',
      title: 'Private Salon & Document Courier',
      desc: 'Notarized acquisition agreements couriered securely via bonded messenger to Swiss legal counsel. Private dining room secured at Hôtel des Bergues for 6 principals.',
      category: 'Executive Administration',
      ref: 'REF / CHE-1230',
    },
    {
      time: '16:00 GMT',
      location: 'Chester Square · Belgravia',
      title: 'Heritage Estate Restoration Oversight',
      desc: 'Specialist stone mason and art conservator admitted and supervised during library fireplace restoration. Work audited, verified, and signed off with photographic log.',
      category: 'Estate Stewardship',
      ref: 'REF / BEL-1600',
    },
    {
      time: '19:45 GMT',
      location: 'St James\'s · London SW1',
      title: 'Private Member Club Dining Reservation',
      desc: 'Preferred discreet corner table confirmed at 5 Hertford Street, sommelier briefed on client’s Burgundy preference, and post-dinner chauffeur positioned 10 minutes prior.',
      category: 'Private Concierge',
      ref: 'REF / STJ-1945',
    },
  ];

  const previewFaqs = FAQS_DATA.slice(0, 3);

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#e5dfd2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content with Staggered Entrance */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#57615b]"
              >
                <span>Bespoke Concierge & Executive Coordination</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14231e] font-normal tracking-tight leading-[1.12]"
              >
                More time for <br className="hidden sm:inline" />
                <span className="italic">what matters.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-[#4a544f] font-sans leading-relaxed max-w-xl"
              >
                Thoughtful concierge and administrative support to help you stay organised,
                manage complex details, and protect your mental bandwidth with absolute discretion.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <button
                  onClick={() => onNavigate('book')}
                  className="px-6 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] active:scale-[0.98] transition-all text-center cursor-pointer shadow-md hover:shadow-lg"
                >
                  Book a Consultation <span className="font-normal opacity-85">(30 min · Free)</span>
                </button>
                <button
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3.5 border border-[#cfc8b8] text-[#1e2722] text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#efebe1] hover:border-[#16382c] transition-all text-center cursor-pointer shadow-xs"
                >
                  Explore Our Services
                </button>
              </motion.div>

              {/* Editorial bullet highlights without fake dots */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3 text-xs text-[#5e6762] font-sans"
              >
                <span>30-minute introductory diagnostic</span>
                <span aria-hidden="true">·</span>
                <span>London & global remote presence</span>
                <span aria-hidden="true">·</span>
                <span>Tailored monthly allocations</span>
              </motion.div>
            </motion.div>

            {/* Right Editorial Visual with Local High-Fidelity Asset */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] shadow-xl group">
                <LazyImage
                  src={heroMayfairStudy}
                  alt="BEUA Private Study in Mayfair London"
                  className="w-full h-[400px] sm:h-[480px] object-cover filter brightness-[0.98] contrast-[1.02] group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Dossier Note in the bottom right corner */}
                <div className="absolute bottom-5 right-5 max-w-[270px] bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#e2ddd0] shadow-lg text-left">
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-[#717b75] font-semibold mb-1">
                    Dossier Note · London W1
                  </span>
                  <p className="font-serif italic text-xs text-[#1c2420] leading-snug">
                    "Private study & residential living coordination with calm, unhurried diligence."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. BANDWIDTH RECLAIM & DELEGATION CALCULATOR */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2] bg-[#f5f2e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
              Bandwidth Assessment
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#14231e] font-normal tracking-tight mb-4">
              How much time is friction costing you?
            </h2>
            <p className="text-sm sm:text-base text-[#4d5751] font-sans leading-relaxed">
              High achievement generates an avalanche of operational static. Calibrate your weekly
              administrative and lifestyle friction to see how many hours BEUA can return to your focus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive Inputs */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-[#e2ddd0] shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641] mb-2 font-semibold">
                    1. Select your primary friction domains:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {painPoints.map((item) => {
                      const isSelected = selectedPains.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => togglePain(item.id)}
                          className={`text-left p-3.5 rounded-xl text-xs font-sans border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#16382c] text-white border-[#16382c] shadow-xs'
                              : 'bg-[#faf9f6] text-[#4d5751] border-[#ded8c8] hover:border-[#16382c]'
                          }`}
                        >
                          <span className="pr-2">{item.label}</span>
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? 'text-[#9fc4b2]' : 'text-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f0ece2]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#3d4641] font-semibold">
                      2. Estimated hours spent weekly managing personal logistics:
                    </label>
                    <span className="font-mono text-base font-bold text-[#16382c] bg-[#edf4f0] px-3 py-1 rounded-lg">
                      {calcHours} Hours / Week
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="1"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="w-full accent-[#16382c] cursor-pointer h-2 bg-[#e2ddd0] rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#717b75] mt-2">
                    <span>5 hrs (Minor friction)</span>
                    <span>20 hrs (Heavy load)</span>
                    <span>35+ hrs (Severe drain)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#f0ece2] text-xs text-[#636c66] font-sans flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#16382c] shrink-0" />
                <span>Zero obligation. Estimates derived from 40+ active private client mandates.</span>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="lg:col-span-5 bg-[#122b22] text-white p-8 sm:p-10 rounded-2xl border border-[#1e4436] shadow-xl flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#9fc4b2]">
                  <span>Your Bandwidth Forecast</span>
                  <span className="bg-[#1b4335] px-2.5 py-1 rounded-md text-[10px]">75% Reclaim Rate</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-sans text-[#a5cbba]">Annual Time Returned</span>
                  <div className="font-serif text-5xl sm:text-6xl text-white tracking-tight">
                    {annualReclaimedHours}{' '}
                    <span className="text-xl font-sans text-[#9fc4b2] font-normal">hrs / year</span>
                  </div>
                  <p className="text-xs text-[#c0d4ca] font-sans">
                    Equivalent to <strong className="text-white font-medium">{Math.round(annualReclaimedHours / 8)} full working days</strong> returned to strategic focus, family presence, or restorative leisure.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#17382d] border border-[#214e3e] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9fc4b2] block">
                    Recommended Retainer Structure
                  </span>
                  <h4 className="font-serif text-xl text-white font-medium">
                    {getRecommendedTier().name}
                  </h4>
                  <p className="text-xs text-[#a5cbba] font-sans leading-relaxed">
                    {getRecommendedTier().fit}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('book')}
                  className="w-full py-3.5 bg-white text-[#122b22] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#ede8dc] transition-all cursor-pointer shadow-md text-center"
                >
                  Book Discovery to Discuss This Scope ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE BEUA PRINCIPLE */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-3">
            The BEUA Principle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#14231e] font-normal tracking-tight mb-4">
            Quiet authority, unhurried care.
          </h2>
          <p className="text-sm sm:text-base text-[#4d5751] font-sans max-w-2xl mx-auto leading-relaxed mb-16">
            Modern life comes with an abundance of moving parts. BEUA provides a dedicated,
            discreet layer of coordination—taking care of personal responsibilities and
            administrative workflow with meticulous precision.
          </p>

          {/* 3 Value Cards with Refined Radius */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: Shield,
                title: 'Absolute Discretion',
                desc: 'Every engagement operates under rigorous mutual non-disclosure, protecting private client matters and executive agendas with 256-bit data isolation.',
                delay: 0,
              },
              {
                icon: Eye,
                title: 'Proactive Attention',
                desc: 'Anticipating friction points before they unfold. From flight connections to household contractors, no detail is left unvetted.',
                delay: 0.1,
              },
              {
                icon: Globe,
                title: 'Remote Flexibility',
                desc: 'High-touch support tailored across European and global time zones (London, Geneva, New York), working in seamless parallel with your lifestyle.',
                delay: 0.2,
              },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white p-8 rounded-2xl border border-[#e2ddd0] hover:border-[#16382c]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center mb-6 shadow-xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#14231e] font-medium mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#525d57] leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TYPICAL 48-HOUR COORDINATION DOSSIER (TIMELINE) */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
                Operational Dispatch
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight">
                A 48-Hour Coordination Dossier
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#525d57] max-w-md font-sans">
              Real-world examples of how our appointed coordinators resolve friction seamlessly behind the scenes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Timeline Selector Column */}
            <div className="lg:col-span-5 space-y-3">
              {timelineEvents.map((event, idx) => {
                const isActive = activeTimelineTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineTab(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-[#16382c] shadow-md ring-1 ring-[#16382c]'
                        : 'bg-[#faf8f2] border-[#e2ddd0] hover:bg-white text-[#525d57]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-[#16382c]">{event.time}</span>
                      <span className="text-[10px] text-[#717b75]">{event.category}</span>
                    </div>
                    <h4 className="font-serif text-lg text-[#14231e] font-medium leading-snug">
                      {event.title}
                    </h4>
                    <span className="text-xs text-[#717b75] font-sans mt-1 block">
                      {event.location}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Timeline Detail View */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-[#e2ddd0] shadow-sm relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0ece2] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block">
                    {timelineEvents[activeTimelineTab].ref}
                  </span>
                  <span className="text-xs font-mono text-[#16382c] font-semibold">
                    {timelineEvents[activeTimelineTab].location}
                  </span>
                </div>
                <span className="font-serif italic text-xs text-[#717b75]">
                  Executed without principal friction
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#14231e] font-medium mb-4">
                {timelineEvents[activeTimelineTab].title}
              </h3>

              <p className="text-sm text-[#4d5751] font-sans leading-relaxed mb-8">
                {timelineEvents[activeTimelineTab].desc}
              </p>

              <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#ded8c8] flex items-center justify-between text-xs text-[#525d57]">
                <span>Senior Coordinator Assigned: Eleanor Vance</span>
                <span className="font-mono text-[#16382c] font-medium">Dispatched via Encrypted Signal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE CAPABILITIES: TAILORED ASSISTANCE SUITES */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
                Core Capabilities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight">
                Tailored Assistance Suites
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#16382c] hover:opacity-80 transition-opacity cursor-pointer group bg-white px-4 py-2 rounded-full border border-[#cfc8b8] shadow-xs"
            >
              <span>View full service directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 / Personal Concierge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8 rounded-2xl border border-[#e2ddd0] flex flex-col justify-between hover:border-[#16382c]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono uppercase text-[#69746e] pb-4 mb-5 border-b border-[#f0ece2]">
                  <span className="px-2.5 py-1 rounded-md bg-[#faf8f2] border border-[#eee9db]">01 / Personal</span>
                  <div className="w-8 h-8 rounded-lg bg-[#f4f1e9] flex items-center justify-center text-[#16382c]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-[#14231e] font-medium mb-3">
                  Personal Concierge
                </h3>
                <p className="text-xs text-[#525d57] leading-relaxed font-sans mb-6">
                  Seamless lifestyle coordination designed to handle domestic logistics, vendor vetting, and bespoke private procurement.
                </p>
                <ul className="space-y-2.5 text-xs text-[#434d47] font-sans mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Domestic vendor supervision & household upkeep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Priority dining reservations & member club bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Artisan gift sourcing & personalized deliveries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Private relocation & seasonal transitions</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-1.5 text-xs text-[#16382c] font-semibold hover:opacity-80 cursor-pointer pt-4 border-t border-[#f0ece2]"
              >
                <span>Discover details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* 02 / Lifestyle & Travel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8 rounded-2xl border border-[#e2ddd0] flex flex-col justify-between hover:border-[#16382c]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono uppercase text-[#69746e] pb-4 mb-5 border-b border-[#f0ece2]">
                  <span className="px-2.5 py-1 rounded-md bg-[#faf8f2] border border-[#eee9db]">02 / Journey</span>
                  <div className="w-8 h-8 rounded-lg bg-[#f4f1e9] flex items-center justify-center text-[#16382c]">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-[#14231e] font-medium mb-3">
                  Lifestyle & Travel
                </h3>
                <p className="text-xs text-[#525d57] leading-relaxed font-sans mb-6">
                  Comprehensive itinerary curation, private aviation liaison, and culturally elevated experiences.
                </p>
                <ul className="space-y-2.5 text-xs text-[#434d47] font-sans mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Hand-crafted door-to-door journey itineraries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Private flight charter handling & VIP tarmac transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Private villa & heritage estate bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Curated cultural access & exhibition viewings</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-1.5 text-xs text-[#16382c] font-semibold hover:opacity-80 cursor-pointer pt-4 border-t border-[#f0ece2]"
              >
                <span>Discover details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* 03 / Administrative & Virtual */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8 rounded-2xl border border-[#e2ddd0] flex flex-col justify-between hover:border-[#16382c]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono uppercase text-[#69746e] pb-4 mb-5 border-b border-[#f0ece2]">
                  <span className="px-2.5 py-1 rounded-md bg-[#faf8f2] border border-[#eee9db]">03 / Executive</span>
                  <div className="w-8 h-8 rounded-lg bg-[#f4f1e9] flex items-center justify-center text-[#16382c]">
                    <Laptop className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-[#14231e] font-medium mb-3">
                  Administrative & Virtual
                </h3>
                <p className="text-xs text-[#525d57] leading-relaxed font-sans mb-6">
                  Senior executive assistance for founders and principals balancing complex agendas and correspondence.
                </p>
                <ul className="space-y-2.5 text-xs text-[#434d47] font-sans mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Complex diary coordination & calendar protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Inbox triage & Friday briefing memo synthesis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Monthly expense audits & accounting handoffs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16382c] mt-0.5">•</span>
                    <span>Confidential document management & records</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-1.5 text-xs text-[#16382c] font-semibold hover:opacity-80 cursor-pointer pt-4 border-t border-[#f0ece2]"
              >
                <span>Discover details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. WHY DISCERNING CLIENTS DELEGATE TO BEUA */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image of Eleanor Vance with Bespoke Portrait Asset */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] shadow-xl relative group">
                <LazyImage
                  src={conciergeDirectorPortrait}
                  alt="Direct Client Coordination - Eleanor Vance"
                  className="w-full h-[460px] object-cover filter brightness-[0.98] contrast-[1.02]"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-[#e2ddd0] flex justify-between items-center text-xs shadow-md">
                  <div>
                    <span className="font-medium text-[#1c2420] block">Eleanor Vance</span>
                    <span className="text-[11px] text-[#636c66]">Director of Concierge Operations</span>
                  </div>
                  <span className="font-mono text-[#717b75] text-[10px] bg-[#f4f1e9] px-2 py-0.5 rounded-sm">
                    LONDON W1
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Pillars List */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block">
                Our Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight">
                Why discerning clients delegate to BEUA
              </h2>
              <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
                We don't operate as a detached call center or algorithmic booking bot. Every member is paired with dedicated human oversight, maintaining continuity, discretion, and institutional memory.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  {
                    title: '1 : 4 Coordinator-to-Principal Ratio',
                    desc: 'Unlike volume agencies assigning 30+ accounts to rotating junior staff, BEUA strictly caps coordinators at four principals, guaranteeing deep familiarity and instant response.',
                  },
                  {
                    title: 'Personalised Operating Calibration',
                    desc: 'Support is calibrated precisely to your working habits, communication cadences, and idiosyncratic preferences—without having to repeat instructions.',
                  },
                  {
                    title: 'Unwavering Discretion & Non-Disclosure',
                    desc: 'All communications, family details, and operational records remain privileged under standard UK non-disclosure practices from the moment of dispatch.',
                  },
                  {
                    title: 'Crisp, Noise-Free Briefings',
                    desc: 'No unnecessary back-and-forth. Only crisp, digest-style briefing notes delivered through your preferred channel (Signal, WhatsApp, or Email).',
                  },
                ].map((pillar, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-white border border-[#e2ddd0] hover:border-[#16382c]/40 transition-colors shadow-xs"
                  >
                    <h4 className="font-serif text-lg text-[#14231e] font-medium mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                      {pillar.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. READY TO RECLAIM YOUR TIME? CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#122b22] text-white rounded-3xl p-8 sm:p-14 border border-[#1e4436] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9fc4b2] block font-semibold">
              Introductory Step
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
              Ready to reclaim your time?
            </h2>
            <p className="text-sm text-[#c0d4ca] font-sans leading-relaxed max-w-lg">
              Schedule a complimentary 30-minute introductory consultation to review your personal and professional support needs. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('book')}
                className="px-7 py-3.5 bg-[#fbfaf5] text-[#122b22] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#ede8dc] transition-all cursor-pointer shadow-md"
              >
                Book Your 30-Minute Consultation
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 text-xs text-white hover:text-[#9fc4b2] transition-colors py-2 font-medium cursor-pointer"
              >
                <span>Or: Send Direct Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Subtle decorative circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#1b4335]/30 pointer-events-none blur-2xl" />
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (PREVIEW) */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
              Common Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 mb-10">
            {previewFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-[#e2ddd0] rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:border-[#16382c]/40"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf9f6]"
                  >
                    <span className="font-serif text-lg sm:text-xl text-[#14231e] font-medium">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#636c66] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#16382c]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-xs text-[#525d57] font-sans leading-relaxed border-t border-[#f0ece2] pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('faqs')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#16382c] hover:opacity-80 transition-opacity cursor-pointer group bg-white px-5 py-2.5 rounded-full border border-[#cfc8b8] shadow-xs"
            >
              <span>View all questions & onboarding guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
