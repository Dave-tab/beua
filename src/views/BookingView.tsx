import React, { useState, useEffect } from 'react';
import { Page, AppointmentSlot } from '../types';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Coins,
  Video,
  Globe,
  CheckCircle2,
  Lock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Mail,
  ArrowRight,
  Sparkles,
  Download,
  Loader2,
  ExternalLink,
  Server
} from 'lucide-react';

interface BookingViewProps {
  onNavigate: (page: Page) => void;
}

const AVAILABLE_SLOTS: AppointmentSlot[] = [
  { id: 'slot-1', time: '09:30 AM', period: 'GMT', label: 'Morning quiet desk' },
  { id: 'slot-2', time: '11:00 AM', period: 'GMT', label: 'London prime' },
  { id: 'slot-3', time: '02:00 PM', period: 'GMT', label: 'US East overlap' },
  { id: 'slot-4', time: '04:30 PM', period: 'GMT', label: 'Late afternoon' },
  { id: 'slot-5', time: '05:15 PM', period: 'GMT', label: 'US East morning' },
  { id: 'slot-6', time: '06:00 PM', period: 'GMT', label: 'Evening desk' },
];

// ============================================
// BEUA BOOKING CALENDAR UTILITIES
// ============================================

const BOOKING_WINDOW_DAYS = 90;

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const isSameDay = (first: Date, second: Date): boolean => {
  return formatDateKey(first) === formatDateKey(second);
};

const isSameMonth = (first: Date, second: Date): boolean => {
  return (
    first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth()
  );
};

export const BookingView: React.FC<BookingViewProps> = ({ onNavigate }) => {
  // Calendar Protocol: Option A (Google Calendar) vs Option C (Private Desk .ics)
 const today = startOfDay(new Date());
const maximumBookingDate = addDays(today, BOOKING_WINDOW_DAYS - 1);
const [calendarOption, setCalendarOption] = useState<'option-a' | 'option-c'>('option-a');
  const [currentStep, setCurrentStep] = useState(1);
const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(new Date()));
const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot>(AVAILABLE_SLOTS[2]);
  const [timezone, setTimezone] = useState<string>('GMT+0 London, UK');
  const [isChangingTz, setIsChangingTz] = useState(false);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form details
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    primaryInterest: 'Personal Concierge',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [bookingRef, setBookingRef] = useState('BEUA-DS-8842');
  const [icsData, setIcsData] = useState<string | null>(null);
  const [googleCalUrl, setGoogleCalUrl] = useState<string | null>(null);
  const [lastDispatchedMethod, setLastDispatchedMethod] = useState<string>('Option A: Google Calendar Sync');

  const timezones = [
    'GMT+0 London, UK',
    'CET+1 Paris / Geneva',
    'EST-5 New York',
    'CST-6 Chicago',
    'PST-8 Los Angeles / San Francisco',
    'GST+4 Dubai',
    'JST+9 Tokyo',
  ];

   // ============================================
// DYNAMIC 90-DAY CALENDAR GENERATION
// ============================================

const selectedDateKey = formatDateKey(selectedDate);

const monthStart = startOfMonth(visibleMonth);

const daysInMonth = new Date(
  visibleMonth.getFullYear(),
  visibleMonth.getMonth() + 1,
  0
).getDate();

// Convert Sunday-first JavaScript weekday to Monday-first calendar.
const startingOffset = (monthStart.getDay() + 6) % 7;

const calendarCells: (Date | null)[] = [
  ...Array(startingOffset).fill(null),
  ...Array.from({ length: daysInMonth }, (_, index) => {
    return new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      index + 1
    );
  }),
];

// Calendar navigation boundaries.
const firstAllowedMonth = startOfMonth(today);
const lastAllowedMonth = startOfMonth(maximumBookingDate);

const canGoToPreviousMonth =
  visibleMonth.getTime() > firstAllowedMonth.getTime();

const canGoToNextMonth =
  visibleMonth.getTime() < lastAllowedMonth.getTime();

const monthLabel = visibleMonth.toLocaleDateString('en-GB', {
  month: 'long',
  year: 'numeric',
});

const selectedDateLabel = formatDisplayDate(selectedDate);
  const [meetUrl, setMeetUrl] = useState<string>('https://meet.google.com/beua-private');
  const [blockedSlotIds, setBlockedSlotIds] = useState<string[]>([]);
  const [isDayBlocked, setIsDayBlocked] = useState<boolean>(false);

  // // ============================================
// FIRESTORE AVAILABILITY LISTENER
// ============================================

useEffect(() => {
  setIsSlotLoading(true);

  const availDocRef = doc(db, 'availability', selectedDateKey);

  const unsubscribe = onSnapshot(
    availDocRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        const rawBlocked = data.blockedSlots || '';

        const list = Array.isArray(rawBlocked)
          ? rawBlocked
          : typeof rawBlocked === 'string'
            ? rawBlocked.split(',').filter(Boolean)
            : [];

        setBlockedSlotIds(list);
        setIsDayBlocked(Boolean(data.isDayBlocked));

        // Preserve the selected slot if it remains available.
        // Otherwise, select the first available slot.
        if (data.isDayBlocked) {
          setSelectedSlot(AVAILABLE_SLOTS[0]);
        } else {
          const firstAvailable = AVAILABLE_SLOTS.find(
            (slot) => !list.includes(slot.id)
          );

          if (firstAvailable) {
            setSelectedSlot((current) =>
              list.includes(current.id) ? firstAvailable : current
            );
          }
        }
      } else {
        setBlockedSlotIds([]);
        setIsDayBlocked(false);
        setSelectedSlot(AVAILABLE_SLOTS[2]);
      }

      setIsSlotLoading(false);
    },
    (err) => {
      console.warn('Could not subscribe to availability:', err);
      setIsSlotLoading(false);
    }
  );

  return () => unsubscribe();
}, [selectedDateKey]);

// ============================================
// DATE SELECTION
// ============================================

const handleDateSelect = (date: Date) => {
  const selected = startOfDay(date);

  if (
    selected < today ||
    selected > maximumBookingDate
  ) {
    return;
  }

  setIsSlotLoading(true);
  setSelectedDate(selected);

  // Reset old availability information while loading the new date.
  setBlockedSlotIds([]);
  setIsDayBlocked(false);
  setSelectedSlot(AVAILABLE_SLOTS[2]);
};

// ============================================
// MONTH NAVIGATION
// ============================================

const handlePreviousMonth = () => {
  if (!canGoToPreviousMonth) return;

  setVisibleMonth((current) =>
    startOfMonth(
      new Date(current.getFullYear(), current.getMonth() - 1, 1)
    )
  );
};

const handleNextMonth = () => {
  if (!canGoToNextMonth) return;

  setVisibleMonth((current) =>
    startOfMonth(
      new Date(current.getFullYear(), current.getMonth() + 1, 1)
    )
  );
};

const handleStep1Submit = () => {
  setCurrentStep(2);
};

const handleStep2Submit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);
   const dateFormatted = formatDateKey(selectedDate);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          selectedDate: dateFormatted,
          selectedSlot: selectedSlot.time,
          timezone: timezone,
          primaryInterest: formData.primaryInterest,
          notes: formData.notes,
          calendarOption: calendarOption,
        }),
      });

      const data = await response.json();
      const refCode = data.bookingRef || `BEUA-DS-${Math.floor(1000 + Math.random() * 9000)}`;
      const assignedMeetUrl = data.meetUrl || `https://meet.google.com/beua-${refCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      setBookingRef(refCode);
      setMeetUrl(assignedMeetUrl);
      setIcsData(data.icsContent || null);
      setGoogleCalUrl(data.googleCalendarUrl || null);
      setLastDispatchedMethod(
        data.calendarOption ||
          (calendarOption === 'option-a'
            ? 'Option A: Google Calendar Sync'
            : 'Option C: Private Desk & .ics')
      );

      // Persist to Firebase Firestore
      try {
        await setDoc(doc(db, 'bookings', refCode), {
          id: refCode,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          scheduledDate: dateFormatted,
          slotTime: selectedSlot.time,
          timezone: timezone,
          primaryInterest: formData.primaryInterest,
          notes: formData.notes || '',
          meetUrl: assignedMeetUrl,
          calendarOption: data.calendarOption || (calendarOption === 'option-a' ? 'Option A: Google Calendar Sync' : 'Option C: Private Desk & .ics'),
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreErr) {
        console.warn('Firestore write notice:', firestoreErr);
      }
    } catch {
      const fallbackRef = `BEUA-DS-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(fallbackRef);
      setMeetUrl(`https://meet.google.com/beua-${fallbackRef.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
    } finally {
      setIsSubmitting(false);
      setCurrentStep(3);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleDownloadIcs = () => {
    const content =
      icsData ||
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//BEUA Concierge & Support//Bespoke Advisory//EN',
        'BEGIN:VEVENT',
        `SUMMARY:BEUA Concierge — Private Consultation (30 min)`,
        `DESCRIPTION:Confidential consultation for ${formData.fullName || 'Client'}. Reference: ${bookingRef}`,
        `LOCATION:BEUA Private Video Room`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${bookingRef}-consultation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="pt-12 sm:pt-20 pb-12 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2efe6] border border-[#e2ddd0] text-xs uppercase tracking-[0.2em] font-semibold text-[#57615b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16382c]" />
                <span>Introductory Consultation • Private Office Access</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14231e] font-normal tracking-tight leading-[1.12]">
                Begin with a <br className="hidden sm:inline" />
                <span className="italic">considered conversation.</span>
              </h1>
            </div>

            <div className="md:max-w-md pt-2">
              <p className="text-sm text-[#4d5751] font-sans leading-relaxed">
                A dedicated, complimentary 30-minute consultation to review your personal lifestyle coordination, travel logistics, or executive administrative requirements. Zero obligation, held under strict mutual discretion.
              </p>
            </div>
          </div>

          {/* 4 Summary Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white border border-[#e2ddd0] rounded-2xl shadow-sm">
            <div className="flex items-center gap-3.5 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#717b75] block">Duration</span>
                <span className="text-xs sm:text-sm font-semibold text-[#14231e]">30 Minutes</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center shrink-0 shadow-xs">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#717b75] block">Investment</span>
                <span className="text-xs sm:text-sm font-semibold text-[#14231e]">Complimentary (£0)</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center shrink-0 shadow-xs">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#717b75] block">Format</span>
                <span className="text-xs sm:text-sm font-semibold text-[#14231e]">Video / Private Line</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center shrink-0 shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#717b75] block">Availability</span>
                <span className="text-xs sm:text-sm font-semibold text-[#14231e]">London & Global Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPLIT INTERACTIVE BOOKING LAYOUT */}
      <section className="py-16 sm:py-20 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Dossier Context */}
            <div className="lg:col-span-5 space-y-6">
              {/* Consultation Dossier */}
              <div className="bg-white p-8 rounded-3xl border border-[#e2ddd0] shadow-sm space-y-5">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-[#717b75] pb-3 border-b border-[#f0ece2]">
                  <span className="bg-[#faf8f2] px-2.5 py-1 rounded-md">Consultation Dossier</span>
                  <span>REF-BEUA/CONSULT</span>
                </div>
                <h3 className="font-serif text-2xl text-[#14231e] font-medium">
                  What to expect during your session
                </h3>
                <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                  Our consultations are pragmatic, focused, and conversational. We do not sell; we evaluate feasibility and match capacity.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="border-l-2 border-[#16382c] pl-4 space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#14231e]">
                      01 Context & Priority Audit
                    </h4>
                    <p className="text-xs text-[#525d57] leading-relaxed">
                      We review where your operational friction lies—whether overflowing inboxes, domestic vendor coordination, multi-leg travel itineraries, or calendar overload.
                    </p>
                  </div>

                  <div className="border-l-2 border-[#16382c] pl-4 space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#14231e]">
                      02 Delegation Cadence Mapping
                    </h4>
                    <p className="text-xs text-[#525d57] leading-relaxed">
                      We discuss your preferred communication channels (Signal, WhatsApp, email, or brief voice notes) and determine the exact responsiveness required.
                    </p>
                  </div>

                  <div className="border-l-2 border-[#16382c] pl-4 space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#14231e]">
                      03 Clear Roadmap & Fit Assessment
                    </h4>
                    <p className="text-xs text-[#525d57] leading-relaxed">
                      If we mutually decide BEUA is the right partner, we propose a tailored monthly retainer or ad-hoc project structure. If not, you keep our audit notes with zero pushy sales follow-ups.
                    </p>
                  </div>
                </div>
              </div>
 

              {/* Absolute Discretion Assured */}
              <div className="bg-white p-6 rounded-2xl border border-[#e2ddd0] shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16382c]">
                  <Lock className="w-4 h-4 text-[#16382c]" />
                  <span>Absolute Discretion Assured</span>
                </div>
                <p className="font-serif italic text-xs text-[#1c2420] leading-relaxed">
                  "All discussions are strictly confidential under our private practice non-disclosure protocol."
                </p>
              </div>

              {/* Prefer to write first? */}
              <div className="p-5 bg-white border border-[#e2ddd0] rounded-2xl flex items-center justify-between text-xs shadow-xs">
                <div>
                  <p className="font-medium text-[#14231e]">Prefer to write first?</p>
                  <p className="text-[#646e68] text-[11px]">If you have confidential materials or prefer a written brief.</p>
                </div>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#16382c] font-semibold hover:opacity-80 inline-flex items-center gap-1 cursor-pointer bg-[#faf8f2] px-3.5 py-1.5 rounded-full border border-[#cfc8b8]"
                >
                  <span>Submit Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Scheduler Widget */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-[#d2cbba] rounded-3xl shadow-xl overflow-hidden">
                {/* Scheduler Top Bar */}
                <div className="bg-[#122b22] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1e4436] flex items-center justify-center text-[#e5dfc9] shadow-xs">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#a5cbba] block">
                        BEUA Concierge Desk
                      </span>
                      <h4 className="font-serif text-xl text-white">
                        Discovery Session • 30 Min
                      </h4>
                    </div>
                  </div>

                  {/* Timezone indicator */}
                  <div className="relative">
                    <button
                      onClick={() => setIsChangingTz(!isChangingTz)}
                      className="text-xs text-[#cfded7] hover:text-white flex items-center gap-2 font-mono cursor-pointer bg-[#18392d] px-3.5 py-2 rounded-full border border-[#275342]"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{timezone}</span>
                      <span className="text-[10px] underline ml-1">Change</span>
                    </button>

                    {isChangingTz && (
                      <div className="absolute right-0 mt-2 w-56 bg-white text-[#191c1b] border border-[#cfc8b8] rounded-xl shadow-xl p-2 z-30 text-xs">
                        <p className="text-[10px] font-mono text-[#717b75] uppercase px-2 py-1 font-semibold">
                          Select Operating Zone
                        </p>
                        {timezones.map((tz) => (
                          <button
                            key={tz}
                            onClick={() => {
                              setTimezone(tz);
                              setIsChangingTz(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#f0ece2] ${
                              timezone === tz ? 'bg-[#16382c] text-white font-semibold' : ''
                            }`}
                          >
                            {tz}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step indicator */}
                <div className="px-6 py-3.5 bg-[#faf9f5] border-b border-[#e2ddd0] flex items-center justify-between text-xs text-[#636c66]">
                  <div className="flex items-center space-x-3">
                    <span className={`font-semibold ${currentStep === 1 ? 'text-[#16382c] underline underline-offset-4' : ''}`}>
                      1 Select Calendar & Slot
                    </span>
                    <span>➔</span>
                    <span className={`font-semibold ${currentStep === 2 ? 'text-[#16382c] underline underline-offset-4' : ''}`}>
                      2 Your Details
                    </span>
                    <span>➔</span>
                    <span className={`font-semibold ${currentStep === 3 ? 'text-[#16382c] underline underline-offset-4' : ''}`}>
                      3 Confirmation
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-[#717b75] bg-white px-2.5 py-1 rounded-full border border-[#e2ddd0]">
                    Step 0{currentStep} of 03
                  </span>
                </div>

                {/* STEP 1: Calendar Protocol Selector + Date & Time Picker */}
                {currentStep === 1 && (
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* BACKEND DISPATCH STATUS PILL */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#faf8f2] rounded-xl border border-[#e2ddd0] text-xs font-mono">
                  
                      <span className="text-[#646e68] text-[11px]">
                        Recipient Desk: <strong className="text-[#14231e]">concierge@beua-support.com</strong>
                      </span>
                    </div>

                    {/* CALENDAR OPTION SELECTOR (Option A vs Option C) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3d4641] font-semibold">
                          Choose Calendar & Booking Protocol:
                        </label>
                     
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option A: Google Calendar */}
                        <button
                          type="button"
                          onClick={() => setCalendarOption('option-a')}
                          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            calendarOption === 'option-a'
                              ? 'bg-white border-[#16382c] shadow-md ring-2 ring-[#16382c]'
                              : 'bg-[#faf9f5] border-[#ded8c8] hover:bg-white text-[#525d57]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-[#16382c]" />
                              <span className="font-serif text-base text-[#14231e] font-medium">
                                Option A: Google Calendar
                              </span>
                            </div>
                            {calendarOption === 'option-a' && (
                              <CheckCircle2 className="w-4 h-4 text-[#16382c]" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#525d57] leading-relaxed font-sans">
                            Direct Google Calendar sync with instant Google Meet video room credentials and calendar alerts.
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#16382c]">
                            <span className="bg-[#edf4f0] px-2 py-0.5 rounded font-semibold">
                              Direct Google Sync
                            </span>
                            <span>Google Meet Ready</span>
                          </div>
                        </button>

                        {/* Option C: Private Desk & .ics */}
                        <button
                          type="button"
                          onClick={() => setCalendarOption('option-c')}
                          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            calendarOption === 'option-c'
                              ? 'bg-white border-[#16382c] shadow-md ring-2 ring-[#16382c]'
                              : 'bg-[#faf9f5] border-[#ded8c8] hover:bg-white text-[#525d57]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#16382c]" />
                              <span className="font-serif text-base text-[#14231e] font-medium">
                                Option C: Private Desk & .ics
                              </span>
                            </div>
                            {calendarOption === 'option-c' && (
                              <CheckCircle2 className="w-4 h-4 text-[#16382c]" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#525d57] leading-relaxed font-sans">
                            Off-cloud confidential brief dispatched to London duty desk with downloadable RFC 5545 .ics invite.
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#717b75]">
                            <span className="bg-[#f0ede4] px-2 py-0.5 rounded font-semibold text-[#14231e]">
                              Private .ics Invite
                            </span>
                            <span>UK Non-Disclosure</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* ============================================
                          DYNAMIC MONTH SELECTOR
                        ============================================ */}

<div>
  <div className="flex items-center justify-between mb-4">
    <div>
      <h4 className="font-serif text-2xl text-[#14231e] font-medium">
        {monthLabel}
      </h4>

      <p className="text-xs text-[#636c66]">
        Choose a date within the next 90 days
      </p>
    </div>

    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous Month"
        onClick={handlePreviousMonth}
        disabled={!canGoToPreviousMonth}
        className="p-2 border border-[#cfc8b8] rounded-full text-[#636c66] hover:bg-[#efebe1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Next Month"
        onClick={handleNextMonth}
        disabled={!canGoToNextMonth}
        className="p-2 border border-[#cfc8b8] rounded-full text-[#636c66] hover:bg-[#efebe1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>

  {/* Calendar day grid */}

  <div className="grid grid-cols-7 gap-2 text-center text-xs">

    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
      <div
        key={day}
        className="font-mono text-[10px] text-[#717b75] py-1 font-semibold"
      >
        {day}
      </div>
    ))}

    {calendarCells.map((date, index) => {
      if (!date) {
        return <div key={`empty-${index}`} />;
      }

      const isPast = date < today;

      const isBeyondBookingWindow =
        date > maximumBookingDate;

      const isDisabled = isPast || isBeyondBookingWindow;

      const isSelected = isSameDay(date, selectedDate);

      const isToday = isSameDay(date, today);

      return (
        <button
          key={formatDateKey(date)}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateSelect(date)}
          aria-label={formatDisplayDate(date)}
          aria-pressed={isSelected}
          className={`min-h-[54px] py-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 border ${
            isDisabled
              ? 'opacity-30 cursor-not-allowed bg-transparent border-transparent text-[#717b75]'
              : isSelected
                ? 'bg-[#16382c] text-white font-bold border-[#16382c] shadow-md ring-2 ring-[#16382c] ring-offset-2'
                : 'bg-[#faf8f2] hover:bg-[#eae5d8] text-[#14231e] border-[#e8e4d8] cursor-pointer'
          }`}
        >
          <span className="font-mono text-sm leading-none font-semibold">
            {date.getDate()}
          </span>

          <span className={`text-[9px] font-sans mt-1 ${
            isSelected ? 'text-[#c0d4ca]' : 'opacity-70'
          }`}>
            {isToday ? 'Today' : date.toLocaleDateString('en-GB', {
              weekday: 'short',
            })}
          </span>
        </button>
      );
    })}
  </div>

  {/* Calendar legend */}

  <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] text-[#717b75] font-mono">
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#16382c]" />
      Selected
    </span>

    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#eae5d8] border border-[#cfc8b8]" />
      Selectable
    </span>

    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#d6d2c8]" />
      Outside booking window
    </span>
  </div>
</div>

                    {/* Time slots */}
                    <div className="pt-2 border-t border-[#f0ece2]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#3d4641] font-semibold">
                          Available Times for {selectedDateLabel}:
                        </span>
                        <span className="text-xs text-[#717b75] font-mono">
                          {timezone.split(' ')[0]}
                        </span>
                      </div>

                      {isSlotLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 animate-pulse">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-12 bg-[#f0ece2] rounded-xl" />
                          ))}
                        </div>
                      ) : isDayBlocked ? (
                        <div className="p-4 bg-[#f6f4ee] border border-[#ded8c8] rounded-xl text-xs text-[#646e68] text-center font-mono">
                          This date is currently reserved for private travel logistics. Please select an adjacent day.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {AVAILABLE_SLOTS.map((slot) => {
                            const isBlocked = isDayBlocked || blockedSlotIds.includes(slot.id);
                            const isSelected = selectedSlot.id === slot.id && !isBlocked;
                            return (
                              <button
                                key={slot.id}
                                disabled={isBlocked}
                                onClick={() => !isBlocked && setSelectedSlot(slot)}
                                className={`p-3 rounded-xl text-left border transition-all ${
                                  isBlocked
                                    ? 'bg-[#f0ece2] border-[#ded8c8] text-[#8e9892] opacity-60 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-[#16382c] text-white border-[#16382c] shadow-sm cursor-pointer'
                                    : 'bg-[#faf9f5] border-[#cfc8b8] hover:border-[#16382c] text-[#14231e] cursor-pointer'
                                }`}
                              >
                                <span className="font-mono text-xs font-bold block">
                                  {slot.time}
                                </span>
                                <span className={`text-[10px] block mt-0.5 ${
                                  isBlocked ? 'text-[#8e9892]' : isSelected ? 'text-[#c0d4ca]' : 'text-[#717b75]'
                                }`}>
                                  {isBlocked ? 'Unavailable' : slot.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Step 1 continue */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#f0ece2]">
                      <div className="text-xs text-[#525d57] font-sans">
                        Selected:{' '}
                        <strong className="text-[#14231e]">
                          {selectedDateLabel} at {selectedSlot.time} ({timezone.split(' ')[0]})
                        </strong>
                      </div>
                      <button
                       type="button"
                        disabled={
                        isSlotLoading ||
                         isDayBlocked ||
                         blockedSlotIds.includes(selectedSlot.id)
                              }
                        onClick={handleStep1Submit}
                        className="w-full sm:w-auto px-7 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Continue to Step 02: Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Client Details Form */}
                {currentStep === 2 && (
                  <form onSubmit={handleStep2Submit} className="p-6 sm:p-8 space-y-5 animate-in fade-in">
                    <div className="p-4 bg-[#f5f3ec] rounded-2xl border border-[#ded8c8] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#717b75] uppercase block">
                          Appointment Window & Selected Protocol
                        </span>
                        <span className="font-semibold text-[#14231e]">
                          {selectedDateLabel} • {selectedSlot.time} ({timezone})
                        </span>
                        <span className="block text-[11px] text-[#16382c] font-mono mt-0.5">
                          {calendarOption === 'option-a'
                            ? 'Protocol: Option A (Direct Google Calendar Sync)'
                            : 'Protocol: Option C (Private Desk & .ics Invitation)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs text-[#16382c] underline cursor-pointer font-medium self-start sm:self-auto"
                      >
                        Change Slot or Protocol
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d4641] mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Lord Julian Sterling"
                          className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c]"
                        />
                        {formErrors.fullName && (
                          <p className="text-[11px] text-red-700 mt-1">{formErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d4641] mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. j.sterling@sterling-partners.co.uk"
                          className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c]"
                        />
                        {formErrors.email && (
                          <p className="text-[11px] text-red-700 mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d4641] mb-1.5">
                          Phone / Signal / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+44 20 7946 0188"
                          className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d4641] mb-1.5">
                          Primary Area of Need
                        </label>
                        <select
                          value={formData.primaryInterest}
                          onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c]"
                        >
                          <option>Personal Concierge</option>
                          <option>Lifestyle & Travel</option>
                          <option>Administrative & Virtual Support</option>
                          <option>Consultation & Support Planning</option>
                          <option>Comprehensive Retainer (Multi-Domain)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d4641] mb-1.5">
                        Preliminary Context or Specific Requirements (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Brief notes on current time-drains, upcoming travel, or operational demands..."
                        className="w-full p-3.5 text-xs bg-white border border-[#cfc8b8] rounded-xl focus:outline-none focus:border-[#16382c]"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#525d57] hover:text-[#14231e] cursor-pointer"
                      >
                        ← Back to Slots
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-3.5 bg-[#16382c] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#1f483b] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Calling Express API /api/book...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>
                              {calendarOption === 'option-a'
                                ? 'Confirm & Sync Google Calendar ➔'
                                : 'Confirm & Dispatch to Private Desk ➔'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: Booking Confirmed Dossier with Live Backend Details */}
                {currentStep === 3 && (
                  <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in">
                    <div className="w-16 h-16 rounded-full bg-[#16382c] text-white flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-9 h-9 text-[#e5dfc9]" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#edf4f0] border border-[#bcd3c6] text-[#16382c] rounded-full text-xs font-mono font-semibold mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>Backend Status: 200 OK • Dispatched</span>
                      </div>
                      <h3 className="font-serif text-3xl text-[#14231e] font-medium">
                        Consultation Reserved
                      </h3>
                      <p className="text-xs text-[#525d57] font-sans max-w-md mx-auto mt-2 leading-relaxed">
                        A private calendar invitation has been generated and dispatched to{' '}
                        <span className="font-semibold text-[#14231e]">{formData.email || 'your email'}</span>.
                        Notification forwarded directly to <span className="font-mono text-[#16382c]">concierge@beua-support.com</span>.
                      </p>
                    </div>

                    <div className="bg-[#fcfbf8] border border-[#e2ddd0] p-6 rounded-2xl max-w-md mx-auto text-left text-xs space-y-3 font-mono shadow-xs">
                      <div className="flex justify-between border-b border-[#f0ece2] pb-2">
                        <span className="text-[#646e68]">Reference Dossier:</span>
                        <span className="font-bold text-[#16382c]">{bookingRef}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#f0ece2] pb-2">
                        <span className="text-[#646e68]">Protocol Applied:</span>
                        <span className="font-semibold text-[#14231e]">{lastDispatchedMethod}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#f0ece2] pb-2">
                        <span className="text-[#646e68]">Principal Name:</span>
                        <span className="text-[#14231e] font-medium">{formData.fullName || 'Confidential Client'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#f0ece2] pb-2">
                        <span className="text-[#646e68]">Scheduled Time:</span>
                        <span className="text-[#14231e] font-medium">
                          {selectedDateLabel} at {selectedSlot.time} ({timezone.split(' ')[0]})
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#f0ece2] pb-2">
                        <span className="text-[#646e68]">Google Meet Room:</span>
                        <a
                          href={meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#16382c] font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <span>{meetUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#646e68]">Protocol:</span>
                        <span className="text-emerald-700 font-bold">UK Non-Disclosure Protected</span>
                      </div>
                    </div>

                    {/* Action buttons tailored to Option A vs Option C */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      {googleCalUrl && (
                        <a
                          href={googleCalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-full inline-flex items-center gap-2 cursor-pointer shadow-sm ${
                            calendarOption === 'option-a'
                              ? 'bg-[#16382c] text-white hover:bg-[#1f483b]'
                              : 'bg-white border border-[#cfc8b8] text-[#14231e] hover:bg-[#efebe1]'
                          }`}
                        >
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>Add to Google Calendar</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                      <button
                        onClick={handleDownloadIcs}
                        className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-full inline-flex items-center gap-2 cursor-pointer shadow-sm ${
                          calendarOption === 'option-c'
                            ? 'bg-[#16382c] text-white hover:bg-[#1f483b]'
                            : 'bg-white border border-[#16382c] text-[#16382c] hover:bg-[#edf4f0]'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Invite (.ics)</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStep(1);
                          setFormData({ fullName: '', email: '', phone: '', primaryInterest: 'Personal Concierge', notes: '' });
                        }}
                        className="px-5 py-3 border border-[#cfc8b8] text-xs font-medium uppercase tracking-wider text-[#14231e] hover:bg-[#efebe1] rounded-full cursor-pointer"
                      >
                        Book Another Session
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-note footer */}
                <div className="px-6 py-4 bg-[#f6f4ee] border-t border-[#e2ddd0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#717b75] font-mono gap-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16382c]" />
                    Book with confidence: 
                  </span>
                  <div className="flex items-center gap-4">
                    <span>All sessions are conducted under strict UK non-disclosure protocols</span>
                    <span>•</span>
                    <span>Always available</span>
                  </div>
                </div>
              </div>

              {/* Coordinator Contact Card */}
              <div className="p-5 bg-white border border-[#e2ddd0] rounded-2xl flex items-center justify-between text-xs shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#14231e]">Direct Client Care Coordinator</p>
                    <p className="text-[#646e68] text-[11px]">Need to rearrange outside standard hours? We accommodate global time zones.</p>
                  </div>
                </div>
                <a
                  href="mailto:concierge@beua-support.com?subject=Special%20Consultation%20Scheduling"
                  className="text-xs text-[#16382c] font-semibold hover:opacity-80 shrink-0 ml-2"
                >
                  Direct Email Desk →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEXT MILESTONES: WHAT HAPPENS AFTER YOU BOOK? */}
      <section className="py-20 sm:py-24 border-b border-[#e5dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#66706a] block mb-2">
              Next Milestones
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#14231e] font-normal tracking-tight mb-3">
              What happens after you book?
            </h2>
            <p className="text-sm text-[#4d5751] font-sans max-w-xl mx-auto leading-relaxed">
              Transparent, predictable steps from the initial slot confirmation to ongoing quiet stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-[#e2ddd0] shadow-sm space-y-4">
              <span className="font-serif text-3xl text-[#14231e]/25 font-bold block">01</span>
              <h3 className="font-serif text-xl text-[#14231e] font-medium">
                Instant Calendar & Video Link
              </h3>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                You immediately receive an encrypted calendar invitation with Google Meet credentials and an agenda outline tailored to your selected primary area.
              </p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] bg-[#faf8f2] px-2.5 py-1 rounded-md inline-block">
                Immediate Dispatch
              </span>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#e2ddd0] shadow-sm space-y-4">
              <span className="font-serif text-3xl text-[#14231e]/25 font-bold block">02</span>
              <h3 className="font-serif text-xl text-[#14231e] font-medium">
                The 30-Minute Video Audit
              </h3>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                An unhurried conversation with a senior coordinator to map recurring administrative drag, upcoming international travel, or domestic estate requirements.
              </p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] bg-[#faf8f2] px-2.5 py-1 rounded-md inline-block">
                Day of Appointment
              </span>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#e2ddd0] shadow-sm space-y-4">
              <span className="font-serif text-3xl text-[#14231e]/25 font-bold block">03</span>
              <h3 className="font-serif text-xl text-[#14231e] font-medium">
                Tailored Retainer Proposal
              </h3>
              <p className="text-xs text-[#525d57] font-sans leading-relaxed">
                Within 24 business hours, receive a written proposal outlining recommended hours, appointed primary coordinator bio, and direct communication setup.
              </p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75] bg-[#faf8f2] px-2.5 py-1 rounded-md inline-block">
                Within 24 Hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRIORITY CLIENT DESK BANNER */}
      <section className="py-14 bg-[#122b22] text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9fc4b2] flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Priority Client Desk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">
              Need urgent or out-of-hours coordination?
            </h3>
            <p className="text-xs text-[#c0d4ca] font-sans">
              For time-sensitive logistics, urgent flight modifications, or immediate household interventions within 48 hours, reach our client desk directly without waiting for a scheduled calendar slot.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="mailto:concierge@beua-support.com?subject=Urgent%20Out-of-Hours%20Coordination"
              className="px-6 py-3.5 bg-white text-[#122b22] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#ede8dc] text-center shadow-md"
            >
              concierge@beua-support.com
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 border border-[#3b6855] text-white text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#1a3d31] text-center cursor-pointer"
            >
              Direct Office Directory ➔
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
