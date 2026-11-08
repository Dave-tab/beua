export type Page = 'home' | 'about' | 'services' | 'faqs' | 'contact' | 'book' | 'admin';

export interface FaqItem {
  id: string;
  category: 'getting-started' | 'scope' | 'pricing' | 'security';
  categoryNumber: string;
  categoryTitle: string;
  categoryBadge: string;
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  categoryKey: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  categoryTag: string;
  iconName: string;
  attributes: string[];
  deliverables: string[];
  vignette?: {
    tag: string;
    title: string;
    quote?: string;
    author?: string;
    flightSample?: {
      route: string;
      chauffeur: string;
      airTransfer: string;
      status: string;
    };
    metric?: {
      reclaimHours: string;
      highValueFocus: number;
      delegated: number;
      annotation: string;
    };
    diagnostic?: {
      steps: { number: number; title: string; desc: string }[];
    };
  };
}

export interface AppointmentSlot {
  id: string;
  time: string;
  period: string;
  label: string;
}

export interface BookingState {
  step: 1 | 2 | 3;
  date: string;
  slot: AppointmentSlot | null;
  timezone: string;
  fullName: string;
  email: string;
  phone: string;
  primaryArea: string;
  notes: string;
  bookingRef?: string;
}

export interface BookingRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  scheduledDate: string;
  slotTime: string;
  timezone: string;
  primaryInterest: string;
  notes?: string;
  meetUrl: string;
  calendarOption: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface DayAvailability {
  date: string;
  blockedSlots: string[];
  isDayBlocked: boolean;
  updatedAt?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  scope: string;
  message: string;
  ndaAccepted: boolean;
}
