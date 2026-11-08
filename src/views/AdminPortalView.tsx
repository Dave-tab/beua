import React, { useState, useEffect, useRef } from 'react';
import { Page, BookingRecord, AppointmentSlot } from '../types';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import {
  ShieldCheck,
  Video,
  LogOut,
  LogIn,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  X,
  Mail,
  User as UserIcon,
  Phone,
  RefreshCw,
  Eye,
  Sliders,
  AlertTriangle
} from 'lucide-react';

interface AdminPortalViewProps {
  onNavigate: (page: Page) => void;
}

const AUTHORIZED_ADMIN_EMAILS = ['ayantadedavid73@gmail.com'];

const DEFAULT_SLOTS: AppointmentSlot[] = [
  { id: 'slot-1', time: '09:30 AM', period: 'GMT', label: 'Morning quiet desk' },
  { id: 'slot-2', time: '11:00 AM', period: 'GMT', label: 'London prime' },
  { id: 'slot-3', time: '02:00 PM', period: 'GMT', label: 'US East overlap' },
  { id: 'slot-4', time: '04:30 PM', period: 'GMT', label: 'Late afternoon' },
  { id: 'slot-5', time: '05:15 PM', period: 'GMT', label: 'US East morning' },
  { id: 'slot-6', time: '06:00 PM', period: 'GMT', label: 'Evening desk' },
];

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isSigningInRef = useRef(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [inspectingBooking, setInspectingBooking] = useState<BookingRecord | null>(null);
  
  // Availability management state
  const [activeTab, setActiveTab] = useState<'bookings' | 'availability'>('bookings');
  const [selectedManageDate, setSelectedManageDate] = useState('2026-11-21');
  const [blockedSlotsForDate, setBlockedSlotsForDate] = useState<string[]>([]);
  const [isDayBlocked, setIsDayBlocked] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  const isAuthorized = Boolean(
    user && user.email && AUTHORIZED_ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
  );

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Bookings Listener (only runs for authorized coordinator)
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    if (!isAuthorized) {
      setIsLoadingBookings(false);
      return;
    }

    setIsLoadingBookings(true);
    const bookingsCollection = collection(db, 'bookings');

    const unsubscribe = onSnapshot(
      bookingsCollection,
      (snapshot) => {
        const items: BookingRecord[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as BookingRecord);
        });
        // Sort newest first
        items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setBookings(items);
        setIsLoadingBookings(false);
      },
      (error) => {
        setIsLoadingBookings(false);
        console.warn('Bookings listener notice:', error?.message || error);
      }
    );

    return () => unsubscribe();
  }, [user, isAuthorized]);

  // Real-time Availability Listener for selected date
  useEffect(() => {
    if (!user || !selectedManageDate || !isAuthorized) return;
    const availDocRef = doc(db, 'availability', selectedManageDate);
    const unsubscribe = onSnapshot(
      availDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const rawBlocked = data.blockedSlots || '';
          setBlockedSlotsForDate(
            Array.isArray(rawBlocked) ? rawBlocked : rawBlocked ? rawBlocked.split(',').filter(Boolean) : []
          );
          setIsDayBlocked(Boolean(data.isDayBlocked));
        } else {
          setBlockedSlotsForDate([]);
          setIsDayBlocked(false);
        }
      },
      (error) => {
        console.warn('Availability load notice:', error);
      }
    );
    return () => unsubscribe();
  }, [user, selectedManageDate, isAuthorized]);

  // Auth Handlers
  const handleSignIn = async () => {
    // Prevent concurrent/duplicate popup requests which trigger auth/cancelled-popup-request
    if (isSigningInRef.current) return;
    isSigningInRef.current = true;
    setIsSigningIn(true);
    setAuthError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      const code = errorObj?.code || '';

      if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
        // Pop-up was closed by user or a duplicate trigger was suppressed cleanly
        console.info('Sign-in pop-up interaction closed or dismissed.');
      } else if (code === 'auth/popup-blocked') {
        console.warn('Google sign-in pop-up was blocked by browser.');
        setAuthError('Pop-up window was blocked by your browser settings. Please allow pop-ups for this site and retry.');
      } else if (code === 'auth/unauthorized-domain') {
        console.warn('Firebase unauthorized domain:', errorObj.message);
        setAuthError('Preview domain authorization pending in Firebase Authentication.');
      } else {
        console.warn('Sign-in notification:', errorObj.message || err);
        setAuthError(
          errorObj.message
            ? errorObj.message.replace(/^Firebase:\s*/, '')
            : 'Authentication could not be completed. Please try again.'
        );
      }
    } finally {
      isSigningInRef.current = false;
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setInspectingBooking(null);
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await signOut(auth);
      handleSignIn();
    } catch (err) {
      console.warn('Switch account notice:', err);
    }
  };

  // Status Mutation Handler
  const handleUpdateStatus = async (bookingId: string, newStatus: BookingRecord['status']) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      if (inspectingBooking && inspectingBooking.id === bookingId) {
        setInspectingBooking({ ...inspectingBooking, status: newStatus });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  };

  // Availability Save Handler
  const handleToggleSlotBlock = async (slotId: string) => {
    const updated = blockedSlotsForDate.includes(slotId)
      ? blockedSlotsForDate.filter((id) => id !== slotId)
      : [...blockedSlotsForDate, slotId];
    
    setBlockedSlotsForDate(updated);
    setSavingAvailability(true);
    setAvailabilityMessage(null);

    try {
      const docRef = doc(db, 'availability', selectedManageDate);
      await setDoc(
        docRef,
        {
          date: selectedManageDate,
          blockedSlots: updated.join(','),
          isDayBlocked: isDayBlocked,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setAvailabilityMessage('Availability schedule updated.');
      setTimeout(() => setAvailabilityMessage(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `availability/${selectedManageDate}`);
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleToggleDayBlock = async () => {
    const updated = !isDayBlocked;
    setIsDayBlocked(updated);
    setSavingAvailability(true);

    try {
      const docRef = doc(db, 'availability', selectedManageDate);
      await setDoc(
        docRef,
        {
          date: selectedManageDate,
          blockedSlots: blockedSlotsForDate.join(','),
          isDayBlocked: updated,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setAvailabilityMessage(`Date ${selectedManageDate} marked ${updated ? 'blacked out' : 'open'}.`);
      setTimeout(() => setAvailabilityMessage(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `availability/${selectedManageDate}`);
    } finally {
      setSavingAvailability(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (selectedFilter === 'all') return true;
    return b.status === selectedFilter;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="bg-[#faf9f5] min-h-screen text-[#14231e]">
      {/* Top Directorate Navigation */}
      <header className="border-b border-[#e5dfd2] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-lg font-serif tracking-tight font-medium hover:text-[#16382c] transition-colors cursor-pointer"
            >
              BEUA
            </button>
            <span className="text-[#a5b0a9]" aria-hidden="true">·</span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#57615b]">
              Directorate Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#525d57] font-mono hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-[#cfc8b8] hover:bg-[#f2efe6] text-[#14231e] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('home')}
                className="text-xs font-medium text-[#525d57] hover:text-[#14231e] cursor-pointer"
              >
                Return to Site
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {authLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#16382c]" />
            <p className="text-xs font-mono text-[#717b75]">Verifying coordinator credentials...</p>
          </div>
        ) : !user ? (
          /* LOGIN SCREEN */
          <div className="max-w-md mx-auto my-12 bg-white p-8 sm:p-10 rounded-3xl border border-[#e2ddd0] shadow-sm text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f1e9] text-[#16382c] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-normal text-[#14231e]">
                Coordinator Access Only
              </h2>
              <p className="text-xs text-[#525d57] leading-relaxed">
                This portal provides authorized BEUA coordinators with direct access to client appointment schedules, confidential dossier briefs, and live calendar availability.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full py-3.5 px-6 rounded-full bg-[#16382c] hover:bg-[#1f483b] disabled:bg-[#16382c]/60 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              {isSigningIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate with Google</span>
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] font-mono text-[#717b75] border-t border-[#f0ece2]">
              Configured Coordinator: {AUTHORIZED_ADMIN_EMAILS[0]}
            </div>
          </div>
        ) : !isAuthorized ? (
          /* RESTRICTED ACCESS SCREEN (Signed in with non-coordinator account) */
          <div className="max-w-md mx-auto my-12 bg-white p-8 sm:p-10 rounded-3xl border border-[#e2ddd0] shadow-sm text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-normal text-[#14231e]">
                Restricted Access
              </h2>
              <p className="text-xs text-[#525d57] leading-relaxed">
                You are currently signed in as <strong className="font-mono text-[#14231e]">{user.email}</strong>. This Directorate Portal is strictly restricted to designated BEUA coordinators (<span className="font-mono font-semibold">{AUTHORIZED_ADMIN_EMAILS[0]}</span>).
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleSwitchAccount}
                disabled={isSigningIn}
                className="w-full py-3 px-6 rounded-full bg-[#16382c] hover:bg-[#1f483b] disabled:bg-[#16382c]/60 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                {isSigningIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Switch to {AUTHORIZED_ADMIN_EMAILS[0]}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-full border border-[#d6cfbe] hover:bg-[#f6f3eb] text-xs font-medium text-[#525d57] cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="space-y-8">
            {/* Title & Tabs Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
                  Consultation Ledger & Operations
                </h1>
                <p className="text-xs text-[#525d57] mt-1">
                  Real-time synchronization with Firestore and automated Google Meet calendar pipelines.
                </p>
              </div>

              {/* Segmented View Switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#f0ede4] rounded-full border border-[#ded8c8] self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-white text-[#14231e] shadow-xs font-semibold'
                      : 'text-[#646e68] hover:text-[#14231e]'
                  }`}
                >
                  Bookings Ledger ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    activeTab === 'availability'
                      ? 'bg-white text-[#14231e] shadow-xs font-semibold'
                      : 'text-[#646e68] hover:text-[#14231e]'
                  }`}
                >
                  Manage Availability
                </button>
              </div>
            </div>

            {/* TAB 1: BOOKINGS LEDGER */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#e2ddd0] shadow-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#717b75] block">
                      Total Consultations
                    </span>
                    <span className="text-2xl font-serif font-semibold text-[#14231e] tabular-nums">
                      {bookings.length}
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-[#e2ddd0] shadow-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block">
                      Pending Review
                    </span>
                    <span className="text-2xl font-serif font-semibold text-amber-900 tabular-nums">
                      {pendingCount}
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-[#e2ddd0] shadow-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 block">
                      Confirmed Sessions
                    </span>
                    <span className="text-2xl font-serif font-semibold text-emerald-900 tabular-nums">
                      {confirmedCount}
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-[#e2ddd0] shadow-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#717b75] block">
                      Completed Audits
                    </span>
                    <span className="text-2xl font-serif font-semibold text-[#14231e] tabular-nums">
                      {completedCount}
                    </span>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2ddd0]">
                  <div className="flex items-center gap-1.5 text-xs text-[#525d57]">
                    <Filter className="w-3.5 h-3.5 text-[#16382c]" />
                    <span className="font-mono uppercase text-[11px] font-semibold text-[#14231e]">
                      Filter Ledger:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 text-xs">
                    {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setSelectedFilter(filterKey)}
                        className={`px-3 py-1 rounded-full capitalize transition-colors cursor-pointer ${
                          selectedFilter === filterKey
                            ? 'bg-[#16382c] text-white font-medium'
                            : 'bg-[#faf8f2] text-[#525d57] hover:bg-[#ede8db]'
                        }`}
                      >
                        {filterKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-3xl border border-[#e2ddd0] shadow-sm overflow-hidden">
                  {isLoadingBookings ? (
                    <div className="py-16 text-center space-y-2">
                      <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#16382c]" />
                      <p className="text-xs font-mono text-[#717b75]">Streaming latest records from Firestore...</p>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <Calendar className="w-8 h-8 mx-auto text-[#b0baa7]" />
                      <h3 className="font-serif text-lg text-[#14231e]">No bookings found</h3>
                      <p className="text-xs text-[#646e68] max-w-sm mx-auto">
                        {selectedFilter === 'all'
                          ? 'No client bookings have been submitted yet. Once a client books via the website, it will stream here in real time.'
                          : `There are currently no bookings with status "${selectedFilter}".`}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f7f5ee] border-b border-[#e2ddd0] text-[#57615b] font-mono uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3.5 px-6">Reference</th>
                            <th className="py-3.5 px-4">Principal / Contact</th>
                            <th className="py-3.5 px-4">Date & Slot</th>
                            <th className="py-3.5 px-4">Meeting Room</th>
                            <th className="py-3.5 px-4">Protocol</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0ece2]">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-[#fcfbf9] transition-colors">
                              <td className="py-4 px-6 font-mono font-semibold text-[#16382c] whitespace-nowrap">
                                {b.id}
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-[#14231e]">{b.fullName}</div>
                                <div className="text-[11px] text-[#646e68] font-mono">{b.email}</div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="text-[#14231e] font-medium">{b.scheduledDate}</div>
                                <div className="text-[11px] text-[#646e68] font-mono">{b.slotTime} ({b.timezone?.split(' ')[0] || 'GMT'})</div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                {b.meetUrl ? (
                                  <a
                                    href={b.meetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-[#16382c] hover:underline font-mono"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Join Meet</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                  </a>
                                ) : (
                                  <span className="text-[#717b75] font-mono">Private Audio Desk</span>
                                )}
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="text-[11px] font-mono text-[#525d57]">
                                  {b.calendarOption?.includes('Option A') ? 'Option A (Google)' : 'Option C (.ics)'}
                                </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                                    b.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.status === 'pending'
                                      ? 'bg-amber-100 text-amber-800'
                                      : b.status === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                                <button
                                  onClick={() => setInspectingBooking(b)}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#f4f1e9] hover:bg-[#eae6db] text-[#14231e] rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Details</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: AVAILABILITY & BLACKOUT MANAGER */}
            {activeTab === 'availability' && (
              <div className="bg-white p-8 rounded-3xl border border-[#e2ddd0] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ece2] pb-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#14231e] font-normal">
                      Operational Calendar & Blackout Rules
                    </h3>
                    <p className="text-xs text-[#525d57] mt-1">
                      Override open consultation windows. Blocked slots will automatically disappear or show unavailable to clients on the booking page.
                    </p>
                  </div>

                  {availabilityMessage && (
                    <div className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                      ✓ {availabilityMessage}
                    </div>
                  )}
                </div>

                {/* Date Picker Selector */}
                <div className="flex flex-wrap items-center gap-4">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#14231e]">
                    Select Operating Date:
                  </label>
                  <input
                    type="date"
                    value={selectedManageDate}
                    onChange={(e) => setSelectedManageDate(e.target.value)}
                    className="px-3.5 py-2 text-xs font-mono bg-[#faf8f2] border border-[#cfc8b8] rounded-xl focus:outline-hidden focus:border-[#16382c]"
                  />
                  <button
                    onClick={handleToggleDayBlock}
                    disabled={savingAvailability}
                    className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                      isDayBlocked
                        ? 'bg-red-700 text-white hover:bg-red-800'
                        : 'bg-[#faf8f2] border border-[#cfc8b8] text-[#14231e] hover:bg-[#ede8db]'
                    }`}
                  >
                    {isDayBlocked ? 'Day Currently Blacked Out (Click to Re-open)' : 'Blackout Entire Day'}
                  </button>
                </div>

                {/* Slots Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[#717b75] font-semibold tracking-wider">
                    Individual Slots for {selectedManageDate} ({isDayBlocked ? 'All Blocked by Day Rule' : 'Click to Toggle Status'}):
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {DEFAULT_SLOTS.map((slot) => {
                      const isBlocked = isDayBlocked || blockedSlotsForDate.includes(slot.id);
                      return (
                        <div
                          key={slot.id}
                          onClick={() => !isDayBlocked && handleToggleSlotBlock(slot.id)}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between select-none ${
                            isBlocked
                              ? 'bg-[#f7f5f0] border-[#ded8c8] text-[#919c96] opacity-75'
                              : 'bg-white border-[#16382c] text-[#14231e] hover:shadow-xs cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="font-serif text-lg font-medium">{slot.time}</div>
                            <div className="text-[11px] font-sans text-[#646e68]">{slot.label}</div>
                          </div>

                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-semibold ${
                              isBlocked
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isBlocked ? 'Blocked' : 'Available'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SLIDE-OVER / MODAL: INSPECT BOOKING DOSSIER */}
        {inspectingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-[#cfc8b8] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setInspectingBooking(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#f0ede4] text-[#646e68] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#16382c] block">
                  Confidential Consultation Dossier
                </span>
                <h3 className="font-serif text-2xl text-[#14231e]">
                  {inspectingBooking.fullName}
                </h3>
                <p className="text-xs font-mono text-[#646e68]">
                  REF: {inspectingBooking.id} • Registered {inspectingBooking.createdAt?.slice(0, 10)}
                </p>
              </div>

              {/* Dossier Details Grid */}
              <div className="bg-[#faf9f5] border border-[#e2ddd0] rounded-2xl p-4 text-xs space-y-3 font-mono">
                <div className="flex justify-between border-b border-[#ede9df] pb-2">
                  <span className="text-[#646e68]">Email Contact:</span>
                  <span className="text-[#14231e] font-semibold">{inspectingBooking.email}</span>
                </div>
                <div className="flex justify-between border-b border-[#ede9df] pb-2">
                  <span className="text-[#646e68]">Phone / Signal:</span>
                  <span className="text-[#14231e] font-semibold">{inspectingBooking.phone || 'None provided'}</span>
                </div>
                <div className="flex justify-between border-b border-[#ede9df] pb-2">
                  <span className="text-[#646e68]">Scheduled Time:</span>
                  <span className="text-[#14231e] font-semibold">
                    {inspectingBooking.scheduledDate} at {inspectingBooking.slotTime}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#ede9df] pb-2">
                  <span className="text-[#646e68]">Timezone:</span>
                  <span className="text-[#14231e]">{inspectingBooking.timezone || 'GMT'}</span>
                </div>
                <div className="flex justify-between border-b border-[#ede9df] pb-2">
                  <span className="text-[#646e68]">Primary Interest:</span>
                  <span className="text-[#14231e]">{inspectingBooking.primaryInterest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646e68]">Google Meet Room:</span>
                  <a
                    href={inspectingBooking.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#16382c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Launch Video Suite</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Client Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-[#717b75] font-semibold tracking-wider">
                  Client Brief & Advisory Requirements:
                </label>
                <div className="p-4 bg-[#fcfbf9] border border-[#e2ddd0] rounded-xl text-xs text-[#3d4641] leading-relaxed">
                  {inspectingBooking.notes || 'No preliminary notes submitted. Direct discovery session.'}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#f0ece2]">
                <label className="text-[11px] font-mono uppercase text-[#717b75] font-semibold tracking-wider block">
                  Update Appointment Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(inspectingBooking.id, 'confirmed')}
                    className={`py-2 px-3 text-xs rounded-xl font-medium cursor-pointer transition-colors ${
                      inspectingBooking.status === 'confirmed'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#faf8f2] border border-[#cfc8b8] text-[#14231e] hover:bg-[#ede8db]'
                    }`}
                  >
                    ✓ Confirmed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(inspectingBooking.id, 'completed')}
                    className={`py-2 px-3 text-xs rounded-xl font-medium cursor-pointer transition-colors ${
                      inspectingBooking.status === 'completed'
                        ? 'bg-blue-700 text-white'
                        : 'bg-[#faf8f2] border border-[#cfc8b8] text-[#14231e] hover:bg-[#ede8db]'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(inspectingBooking.id, 'cancelled')}
                    className={`py-2 px-3 text-xs rounded-xl font-medium cursor-pointer transition-colors ${
                      inspectingBooking.status === 'cancelled'
                        ? 'bg-red-700 text-white'
                        : 'bg-[#faf8f2] border border-[#cfc8b8] text-[#14231e] hover:bg-[#ede8db]'
                    }`}
                  >
                    ✕ Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
