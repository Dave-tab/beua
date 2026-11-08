import React, { useState } from 'react';
import { Page } from '../types';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Repeat,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Sliders,
  Check,
  CheckCircle2,
  Layers,
  Lock,
  FileText
} from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

interface AboutViewProps {
  onNavigate: (page: Page) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [selectedCharterTab, setSelectedCharterTab] = useState<'discretion' | 'ratio' | 'security'>('discretion');

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#57615b]">
                <span>About BEUA · Private Practice & Advisory</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14231e] font-normal tracking-tight leading-[1.12]">
                Crafting space, clarity, and time through <br className="hidden sm:inline" />
                <span className="italic">considerate support.</span>
              </h1>
            </div>

            <div className="md:max-w-xs space-y-3 pt-2 text-left md:text-right">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#717b75] block">
                Mayfair & St James's · London W1
              </span>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                A dedicated concierge and administrative practice founded on discretion, bespoke attention, and effortless organisation.
              </p>
              <div className="text-xs font-mono text-[#16382c] font-semibold">
                Strictly Capped Client Roster (1 : 4 Ratio)
              </div>
            </div>
          </div>

          {/* Studio Photography & Business Model Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            {/* Studio Photo with Lazy Loading & High-Fidelity Local Asset */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] shadow-xl group min-h-[420px]">
              <LazyImage
                src="/src/assets/images/hero_mayfair_study_1793552648741.jpg"
                alt="The Private Studio - London"
                className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#e2ddd0] text-xs font-mono uppercase tracking-widest text-[#14231e] font-semibold shadow-md">
                The Private Studio · Mayfair London
              </div>
            </div>

            {/* Business Model & Purpose */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-2xl border border-[#e2ddd0] flex flex-col justify-between shadow-sm">
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#69746e]">
                  <Layers className="w-4 h-4 text-[#16382c]" />
                  <span>The Business Model & Purpose</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-medium leading-tight">
                  A fluid extension of your private office.
                </h2>
                <p className="text-xs sm:text-sm text-[#4d5751] font-sans leading-relaxed">
                  BEUA operates as an agile, highly intuitive layer of concierge leadership. Designed specifically for senior executives, venture founders, independent creatives, and discerning households, we bridge the gap between traditional estate management and executive administration.
                </p>
                <p className="text-xs sm:text-sm text-[#4d5751] font-sans leading-relaxed">
                  Rather than absorbing the encumbrance, tax structures, and onboarding drag of full-time direct employees, members enjoy dedicated, senior-grade coordination tailored dynamically around fluctuating demands.
                </p>

                {/* Founding Principle Quote */}
                <div className="bg-[#fcfbf7] border-l-2 border-[#16382c] p-4 my-4 rounded-r-xl">
                  <p className="font-serif italic text-sm text-[#14231e] leading-snug">
                    "True discretion is not merely silence; it is the instinctive anticipation of what should never require asking twice."
                  </p>
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-[#717b75] mt-2 font-medium">
                    — Founding Principle · BEUA Directorate
                  </span>
                </div>
              </div>

              {/* Stats & Link */}
              <div className="pt-6 border-t border-[#f0ece2] space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8] shadow-xs">
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#14231e] block">
                      100%
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746e]">
                      UK Non-Disclosure
                    </span>
                  </div>
                  <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8] shadow-xs">
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#14231e] block">
                      1 : 4
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746e]">
                      Coordinator Cap
                    </span>
                  </div>
                  <div className="p-4 bg-[#faf9f5] rounded-xl border border-[#eae5d8] shadow-xs">
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#14231e] block">
                      &lt; 30m
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746e]">
                      Priority Response
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#646e68] flex items-center gap-1.5">
                    <span>Agile Monthly Allocations</span>
                  </span>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-[#16382c] font-semibold hover:opacity-80 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Service Tiers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE BEUA STANDARD VS VOLUME AGENCIES (COMPARISON TABLE) */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
              The Structural Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight mb-3">
              Why volume concierge models fail discerning clients.
            </h2>
            <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
              When concierge services scale to thousands of cardholders, service collapses into call centers, ticket queues, and canned scripts. BEUA was built as an antidote.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden border border-[#e2ddd0] shadow-sm">
              <thead>
                <tr className="border-b border-[#e2ddd0] bg-[#faf8f2] text-xs font-mono uppercase tracking-wider text-[#69746e]">
                  <th className="py-4 px-6 font-semibold">Service Dimension</th>
                  <th className="py-4 px-6 text-[#717b75]">Mass Concierge Agencies</th>
                  <th className="py-4 px-6 bg-[#edf4f0] text-[#16382c] font-bold">The BEUA Practice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece2] text-xs font-sans text-[#4d5751]">
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#14231e]">Principal-to-Staff Ratio</td>
                  <td className="py-4 px-6 text-[#717b75]">1 : 35+ (Rotating call-center operators)</td>
                  <td className="py-4 px-6 bg-[#faf9f5] font-semibold text-[#16382c]">Strictly 1 : 4 (Dedicated named coordinator)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#14231e]">Institutional Memory</td>
                  <td className="py-4 px-6 text-[#717b75]">CRM notes read by strangers each session</td>
                  <td className="py-4 px-6 bg-[#faf9f5] font-semibold text-[#16382c]">Deep familiarity; zero repeating instructions</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#14231e]">Communication Channel</td>
                  <td className="py-4 px-6 text-[#717b75]">Web portal tickets, automated chatbots, 1-800 lines</td>
                  <td className="py-4 px-6 bg-[#faf9f5] font-semibold text-[#16382c]">Direct private line, Signal, or WhatsApp Business</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#14231e]">Data Security & NDAs</td>
                  <td className="py-4 px-6 text-[#717b75]">Standard online terms; data analyzed for marketing</td>
                  <td className="py-4 px-6 bg-[#faf9f5] font-semibold text-[#16382c]">Mutual UK non-disclosure covenants; zero marketing data</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#14231e]">Operational Proactivity</td>
                  <td className="py-4 px-6 text-[#717b75]">Reactive order-taking only after you request</td>
                  <td className="py-4 px-6 bg-[#faf9f5] font-semibold text-[#16382c]">Anticipatory vigilance; disruptions resolved before you wake</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICE PHILOSOPHY & ELEANOR VANCE BIO */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Photo of Eleanor Vance with Local High-Fidelity Asset */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative"
            >
              <div className="rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] shadow-xl group">
                <LazyImage
                  src="/src/assets/images/concierge_director_portrait_1793552650187.jpg"
                  alt="Eleanor Vance, Director of Concierge Operations"
                  className="w-full h-[500px] object-cover filter brightness-[0.98] contrast-[1.02]"
                />
                <div className="p-4 bg-white border-t border-[#e2ddd0] flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-[#14231e]">Eleanor Vance</h4>
                    <p className="text-xs text-[#66726c]">Director of Concierge Operations</p>
                  </div>
                  <span className="text-xs text-[#717b75] font-mono bg-[#f4f1e9] px-2.5 py-1 rounded-md">
                    BEUA / LDN W1
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Philosophy Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block">
                Our Service Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight leading-tight">
                Why quiet calm is the ultimate form of modern luxury.
              </h2>
              <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
                In an era dominated by relentless digital notifications, automated chatbots, and endless project boards, mental bandwidth has become the rarest luxury asset. High achievement frequently brings an avalanche of administrative static: coordinating tradespeople, untangling airline re-routings, vetting gifts, or aligning family schedules.
              </p>
              <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
                BEUA was constructed on an ethos of quiet competence. We believe superior assistance is felt in the sudden return of mental serenity rather than the noise of frantic exchanges.
              </p>
              <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
                By treating your priorities as our own, we create expansive pockets of calm, allowing you to direct your complete presence toward high-leverage decisions, creative endeavours, and the moments that matter most.
              </p>

              {/* Data Visualization Widget */}
              <div className="bg-white p-7 rounded-2xl border border-[#e2ddd0] shadow-sm space-y-4 pt-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#69746e]">
                  <span className="font-semibold text-[#14231e]">Average Client Time Reclaimed</span>
                  <span className="text-[#16382c] font-bold bg-[#edf4f0] px-3 py-1 rounded-full">26.5 hrs / month</span>
                </div>

                {/* Progress bar split */}
                <div className="h-4 w-full bg-[#f0ece2] rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-[#8ca398] w-[35%]" title="Travel & Itineraries (35%)" />
                  <div className="h-full bg-[#16382c] w-[45%]" title="Administrative Operations (45%)" />
                  <div className="h-full bg-[#466a5b] w-[20%]" title="Personal Logistics (20%)" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#646e68] font-sans pt-1">
                  <span>Travel & Itineraries (35%)</span>
                  <span>Administrative Operations (45%)</span>
                  <span>Personal Logistics (20%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHARTER OF GOVERNANCE & DISCRETION */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2] bg-[#f7f5ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
              Governance & Integrity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight mb-3">
              The Charter of Discretion & Data Sovereignty
            </h2>
            <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
              Discretion is not an afterthought at BEUA—it is embedded in our physical and digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-[#e2ddd0] shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#14231e] font-medium">
                Mutual Non-Disclosure
              </h3>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                Every member engagement is protected by binding UK non-disclosure covenants. All coordinators undergo extensive background vetting and signing before accessing client files.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#e2ddd0] shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#14231e] font-medium">
                Siloed Client Repositories
              </h3>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                Client preferences, passport scans, and payment tokens reside in dedicated, 256-bit encrypted vaults with zero cross-client exposure and zero third-party telemetry.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#e2ddd0] shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#14231e] font-medium">
                Right to Data Purge
              </h3>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                Upon project completion or conclusion of a retainer, members can request a permanent, cryptographically verified purge of all personal files and correspondence records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#122b22] text-white rounded-3xl p-8 sm:p-14 border border-[#1e4436] shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9fc4b2] block font-semibold">
                Confidential Introduction
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
                Begin with a conversation.
              </h2>
              <p className="text-sm text-[#c0d4ca] font-sans leading-relaxed">
                Book a 30-minute introductory call to explore how bespoke concierge and administrative coordination can simplify your routine and return focus to your primary goals.
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3 text-xs text-[#a5cbba]">
                <span>London W1 Desk</span>
                <span aria-hidden="true">·</span>
                <span>Sub-30m response</span>
                <span aria-hidden="true">·</span>
                <span>Mutual confidentiality guaranteed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                onClick={() => onNavigate('book')}
                className="px-8 py-3.5 bg-white text-[#122b22] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#ede8dc] transition-all cursor-pointer shadow-md text-center"
              >
                Book a Consultation (30 min · Free)
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 border border-[#487362] text-white text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#1b4335] transition-colors text-center cursor-pointer"
              >
                Submit Written Brief
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
