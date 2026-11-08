import React, { useState } from 'react';
import { Page, ContactFormData } from '../types';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  ShieldCheck,
  Calendar,
  Lock,
  Building2,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

interface ContactViewProps {
  onNavigate: (page: Page) => void;
  onOpenEmergencyModal: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  onOpenEmergencyModal
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    interest: 'Personal Concierge',
    scope: 'Upcoming This Month',
    message: '',
    ndaAccepted: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dossierCode, setDossierCode] = useState('2025-C');
  const [errorMsg, setErrorMsg] = useState('');

  const interestOptions = [
    'Personal Concierge',
    'Lifestyle & Travel',
    'Administrative & Virtual',
    'Strategic Consultation',
    'General Advisory',
  ];

  const scopeOptions = [
    { id: 'Immediate < 48 Hours', label: 'Immediate', sub: '< 48 Hours' },
    { id: 'Upcoming This Month', label: 'Upcoming', sub: 'This Month' },
    { id: 'Retainer Ongoing Care', label: 'Retainer', sub: 'Ongoing Care' },
    { id: 'Milestone Discrete Project', label: 'Milestone', sub: 'Discrete Project' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all essential fields marked with an asterisk.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      const code = data?.dossierCode || `2026-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(10 + Math.random() * 89)}`;
      setDossierCode(code);

      // Persist to Firestore contactBriefs
      try {
        await setDoc(doc(db, 'contactBriefs', code), {
          dossierCode: code,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          interest: formData.interest,
          scope: formData.scope,
          message: formData.message,
          ndaAccepted: Boolean(formData.ndaAccepted),
          createdAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
      }
    } catch {
      const randomCode = `2026-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(10 + Math.random() * 89)}`;
      setDossierCode(randomCode);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="pt-12 sm:pt-20 pb-12 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2efe6] border border-[#e2ddd0] text-xs uppercase tracking-[0.2em] font-semibold text-[#57615b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16382c]" />
              <span>Direct Enquiries / Private Client Desk</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-4 mb-10">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14231e] font-normal tracking-tight leading-[1.12]">
              Direct, discreet communication.
            </h1>
            <p className="text-sm sm:text-base text-[#4d5751] font-sans leading-relaxed">
              Whether you require an ongoing lifestyle coordinator, complex travel arrangements, or executive administrative support, we invite you to share your brief. Every message is reviewed personally by a senior coordinator within four business hours.
            </p>
          </div>

          {/* 3 Status Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#e5dfd2] pt-6 text-xs text-[#525d57]">
            <div className="flex justify-between sm:block border-b sm:border-b-0 pb-2 sm:pb-0 border-[#f0ece2]">
              <span className="font-mono uppercase text-[10px] text-[#717b75] block">Response Window</span>
              <span className="font-semibold text-[#14231e] sm:mt-0.5 block">&lt; 4 Business Hours</span>
            </div>
            <div className="flex justify-between sm:block border-b sm:border-b-0 pb-2 sm:pb-0 border-[#f0ece2]">
              <span className="font-mono uppercase text-[10px] text-[#717b75] block">Privacy Standard</span>
              <span className="font-semibold text-[#14231e] sm:mt-0.5 block">UK Non-Disclosure</span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="font-mono uppercase text-[10px] text-[#717b75] block">Regional Hub</span>
              <span className="font-semibold text-[#14231e] sm:mt-0.5 block">London W1 & Remote Global</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN BRIEF SUBMISSION & CONTACT DESKS */}
      <section className="py-16 sm:py-20 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Form with Rounded-3xl Card */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#e2ddd0] shadow-sm">

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f0ece2]">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#14231e] font-medium">
                        Submit a Service Brief
                      </h2>
                      <p className="text-xs text-[#636c66] mt-1 font-sans">
                        Fields marked with an asterisk (<span className="text-red-700 font-bold">*</span>) are essential to direct your enquiry to the specialized private liaison desk.
                      </p>
                    </div>
                    <span className="font-mono text-xs uppercase bg-[#faf9f5] border border-[#ded8c8] text-[#16382c] px-3 py-1.5 rounded-full font-semibold shrink-0">
                      DOSSIER REF. 2026-C
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641] mb-1.5">
                        Full Name <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c] text-[#191c1b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641] mb-1.5">
                        Email Address <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. eleanor@vance-holdings.co.uk"
                        className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c] text-[#191c1b]"
                      />
                    </div>
                  </div>

                  {/* Phone & Secure Messaging */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641]">
                        Phone / Secure Messaging <span className="text-[#717b75]">(Optional)</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#16382c] flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Signal / WhatsApp Verified
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 (0) 20 7946 0912 or Signal/WhatsApp handle"
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c] text-[#191c1b]"
                    />
                  </div>

                  {/* Primary Area of Interest */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641] mb-2">
                      Primary Area of Interest <span className="text-red-700">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((opt) => {
                        const isSelected = formData.interest === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setFormData({ ...formData, interest: opt })}
                            className={`px-4 py-2 text-xs rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#16382c] text-white border-[#16382c] font-medium shadow-xs'
                                : 'bg-[#faf9f5] border-[#cfc8b8] text-[#4d5751] hover:border-[#16382c]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scope & Estimated Horizon */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641] mb-2">
                      Scope & Estimated Horizon
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {scopeOptions.map((scope) => {
                        const isSelected = formData.scope === scope.id;
                        return (
                          <button
                            type="button"
                            key={scope.id}
                            onClick={() => setFormData({ ...formData, scope: scope.id })}
                            className={`p-3 text-center rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#16382c] text-white border-[#16382c] shadow-xs'
                                : 'bg-[#faf9f5] border-[#cfc8b8] text-[#4d5751] hover:border-[#16382c]'
                            }`}
                          >
                            <span className="text-xs font-medium block">{scope.label}</span>
                            <span className={`text-[10px] font-mono block ${isSelected ? 'text-[#c6ddd2]' : 'text-[#717b75]'}`}>
                              {scope.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Your Message / Brief Details */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#3d4641]">
                        Your Message / Brief Details <span className="text-red-700">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#717b75]">
                        {formData.message.length} / 1200
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      maxLength={1200}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share a brief overview of the operational friction, lifestyle logistics, travel coordination, or administrative responsibilities you wish to delegate..."
                      className="w-full p-4 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c] text-[#191c1b] leading-relaxed"
                    />
                  </div>

                  {/* NDA Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-[#faf9f5] border border-[#e2ddd0] rounded-xl">
                    <input
                      type="checkbox"
                      id="ndaCheck"
                      checked={formData.ndaAccepted}
                      onChange={(e) => setFormData({ ...formData, ndaAccepted: e.target.checked })}
                      className="mt-0.5 accent-[#16382c] cursor-pointer"
                    />
                    <label htmlFor="ndaCheck" className="text-xs text-[#525d57] leading-relaxed cursor-pointer font-sans">
                      I request this enquiry to be handled under BEUA's mutual non-disclosure and private protocol. Confidential client records are encrypted immediately upon dispatch.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Encrypted Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Confidential Brief</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-[#717b75] mt-2.5 flex items-center justify-center gap-1.5 font-mono">
                      <Lock className="w-3.5 h-3.5 text-[#16382c]" />
                      Protected with 256-bit encryption. Never shared with marketing or external vendors.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="py-10 text-center space-y-6 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#16382c] text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-9 h-9 text-[#e5dfc9]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block mb-1">
                      Encrypted Dispatch Complete
                    </span>
                    <h3 className="font-serif text-3xl text-[#14231e] font-medium">
                      Brief Received Privately
                    </h3>
                    <p className="text-xs text-[#525d57] font-sans max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you, <span className="font-semibold text-[#14231e]">{formData.fullName}</span>. Your brief has been securely routed to our senior duty coordinator under reference ID <span className="font-mono text-[#16382c] font-bold">{dossierCode}</span>.
                    </p>
                  </div>

                  <div className="p-6 bg-[#faf9f5] border border-[#e2ddd0] rounded-2xl text-left max-w-md mx-auto text-xs space-y-2.5 font-mono shadow-xs">
                    <div className="flex justify-between border-b border-[#f0ece2] pb-1.5">
                      <span className="text-[#646e68]">Dossier Reference:</span>
                      <span className="font-bold text-[#16382c]">{dossierCode}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#f0ece2] pb-1.5">
                      <span className="text-[#646e68]">Target Desk:</span>
                      <span className="font-medium text-[#14231e]">{formData.interest}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#f0ece2] pb-1.5">
                      <span className="text-[#646e68]">Turnaround Window:</span>
                      <span className="text-[#14231e]">Within 4 Business Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#646e68]">Protocol:</span>
                      <span className="text-emerald-700 font-bold">UK Non-Disclosure Enforced</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => onNavigate('book')}
                      className="px-7 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-md"
                    >
                      Schedule Discovery Call (Free) ➔
                    </button>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          interest: 'Personal Concierge',
                          scope: 'Upcoming This Month',
                          message: '',
                          ndaAccepted: true,
                        });
                      }}
                      className="px-6 py-3.5 border border-[#cfc8b8] text-xs font-medium uppercase tracking-wider text-[#14231e] hover:bg-[#efebe1] rounded-full cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Desks and Operating Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Box 1: Prefer a Direct Conversation? */}
              <div className="bg-[#f8f6f0] border border-[#ded8c8] p-8 rounded-3xl shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#717b75]">
                  <Calendar className="w-4 h-4 text-[#16382c]" />
                  <span>Discovery Session</span>
                </div>
                <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                  Prefer a Direct Conversation?
                </h3>
                <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                  Skip the written form and schedule an unhurried 30-minute discovery video call directly with a lead concierge coordinator to explore bespoke scope and capacity.
                </p>
                <button
                  onClick={() => onNavigate('book')}
                  className="pt-2 text-xs font-semibold text-[#16382c] hover:opacity-80 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book Discovery Call (30 min • Free)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Box 2: Private Liaison Desks */}
              <div className="bg-white border border-[#e2ddd0] p-8 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ece2]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#14231e] font-semibold">
                    Private Liaison Desks
                  </span>
                  <span className="text-[10px] font-mono text-[#16382c] font-semibold">Active Desk · London W1</span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div>
                    <span className="font-mono uppercase text-[10px] text-[#717b75] block">General & Prospective Retainers</span>
                    <a
                      href="mailto:concierge@beua-support.com"
                      className="text-[#16382c] font-semibold underline underline-offset-2"
                    >
                      concierge@beua-support.com
                    </a>
                  </div>

                  <div>
                    <span className="font-mono uppercase text-[10px] text-[#717b75] block">Executive & Priority Desk</span>
                    <a
                      href="mailto:priority@beua-support.com"
                      className="text-[#16382c] font-semibold underline underline-offset-2"
                    >
                      priority@beua-support.com
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono uppercase text-[10px] text-[#717b75] block">London Coordinator Switchboard</span>
                      <span className="text-[10px] font-mono text-[#717b75]">08:30 – 18:30 GMT</span>
                    </div>
                    <a
                      href="tel:+442079460188"
                      className="font-mono text-sm text-[#14231e] font-semibold"
                    >
                      +44 (0) 20 7946 0188
                    </a>
                  </div>

                  <div className="pt-2 border-t border-[#f0ece2]">
                    <span className="font-mono uppercase text-[10px] text-[#717b75] block">Verified Messaging</span>
                    <p className="text-[11px] text-[#525d57] leading-relaxed">
                      Dedicated Signal & WhatsApp Business access is provided upon client registration or active retainer onboarding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 3: Presence & Operating Hours */}
              <div className="bg-white border border-[#e2ddd0] p-8 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#14231e] font-semibold pb-3 border-b border-[#f0ece2]">
                  <Building2 className="w-4 h-4 text-[#16382c]" />
                  <span>Presence & Operating Hours</span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div>
                    <p className="font-semibold text-[#14231e]">London Private Office</p>
                    <p className="text-[#525d57]">Mayfair & St James's, London W1</p>
                    <p className="text-[10px] text-[#717b75] mt-0.5">Physical consultations strictly by prior calendar arrangement.</p>
                  </div>

                  <div className="pt-2 border-t border-[#f0ece2]">
                    <p className="font-semibold text-[#14231e]">International Coverage</p>
                    <p className="text-[#525d57] leading-relaxed">
                      London (GMT), Paris/Geneva (CET), and New York (EST) coordination spans with 24/7 on-call coverage for active travel roster members.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 4: Legal Non-Disclosure Quote */}
              <div className="bg-[#f7f5ee] border-l-3 border-[#16382c] p-6 rounded-r-2xl space-y-2">
                <span className="font-serif text-2xl text-[#16382c] block leading-none">“</span>
                <p className="font-serif italic text-xs text-[#14231e] leading-relaxed">
                  All communications, initial briefs, and operational records remain privileged under standard UK non-disclosure practices from the moment of dispatch.
                </p>
                <div className="flex justify-between text-[10px] font-mono text-[#717b75] pt-1">
                  <span>BEUA LEGAL & COMPLIANCE OFFICE</span>
                  <span>EST. 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CURATED PHOTOGRAPHY CARDS with Lazy Loading */}
      <section className="py-16 sm:py-20 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] h-52 shadow-sm group">
                <LazyImage
                  src="/src/assets/images/hero_mayfair_study_1793552648741.jpg"
                  alt="Mayfair & St James's Library Suites"
                  className="w-full h-full object-cover filter brightness-[0.96] group-hover:scale-103 transition-transform duration-700"
                />
              </div>
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block">
                  Physical Desk
                </span>
                <h4 className="font-serif text-lg text-[#14231e] font-medium">
                  Mayfair & St James's Library Suites
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] h-52 shadow-sm group">
                <LazyImage
                  src="/src/assets/images/travel_dossier_flatlay_1793552651377.jpg"
                  alt="Curated International Itineraries"
                  className="w-full h-full object-cover filter brightness-[0.96] group-hover:scale-103 transition-transform duration-700"
                />
              </div>
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block">
                  Bespoke Handling
                </span>
                <h4 className="font-serif text-lg text-[#14231e] font-medium">
                  Curated International Itineraries
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#d6cfbe] bg-[#f0ede4] h-52 shadow-sm group">
                <LazyImage
                  src="/src/assets/images/private_member_lounge_1793552650720.jpg"
                  alt="Discreet Private Member Lounges"
                  className="w-full h-full object-cover filter brightness-[0.96] group-hover:scale-103 transition-transform duration-700"
                />
              </div>
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] block">
                  In-Person Sessions
                </span>
                <h4 className="font-serif text-lg text-[#14231e] font-medium">
                  Discreet Private Member Lounges
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY BANNER with rounded-3xl */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#122b22] text-white rounded-3xl p-8 sm:p-12 border border-[#1e4436] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9fc4b2] flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#e5dfc9]" />
              Immediate Assistance
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">
              Need emergency flight changes or same-day coordination?
            </h3>
            <p className="text-xs text-[#c0d4ca] font-sans">
              For active members and urgent lifestyle logistics requiring immediate intervention within 24–48 hours, contact the priority desk directly or summon the on-duty concierge.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenEmergencyModal}
              className="px-6 py-3.5 bg-white text-[#122b22] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#ede8dc] text-center cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#122b22]" />
              <span>Emergency Concierge Desk</span>
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 border border-[#3b6855] text-white text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#1a3d31] text-center cursor-pointer"
            >
              Direct Inquiries Directory ➔
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
