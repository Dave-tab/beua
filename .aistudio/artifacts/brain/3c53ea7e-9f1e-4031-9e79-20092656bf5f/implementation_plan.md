# BEUA Concierge — Database Integration, Admin Portal & Automated Calendar Sync

A unified architecture to transition BEUA Concierge from a static showcase into a complete appointment booking platform with real-time Firebase Firestore persistence, an authenticated Coordinator Admin Portal, and automated two-way Google Meet and calendar synchronization.

***

> [!IMPORTANT]
> **Confirmed Architectural Decisions (from Clarification Phase)**:
> 1. **Database & Auth**: We will integrate **Firebase Firestore** and **Firebase Authentication** to securely persist client consultation requests, confidential briefs, coordinator availability schedules, and administrative audit logs.
> 2. **Dedicated Admin Portal**: We will introduce a discreet, role-restricted **Coordinator Portal** accessible via the user avatar icon in the navigation bar. This portal will allow the BEUA client care directorate to review live bookings, update slot availability, confirm/reschedule appointments, and take confidential client notes.
> 3. **Automated Calendar & Google Meet Sync**: Upon consultation reservation, the backend will automatically generate unique Google Meet room credentials, update Firestore, and deliver RFC 5545 calendar invitations with Google Calendar action links to **both** the client and the directorate (`concierge@beua-support.com`).

***

## 1. Overview & Core Concept

### What It Does
This architecture elevates the BEUA Concierge platform into an operational booking engine without losing its bespoke, editorial Mayfair identity. Clients reserve 30-minute private discovery consultations or submit confidential briefs through an elegant interface. Immediately upon reservation:
- A booking record is written to Firestore with real-time sync.
- A unique Google Meet room URL (`https://meet.google.com/beua-private-...`) is created.
- Two-way calendar invitations are dispatched so both the client and the BEUA coordinator calendar receive synchronized calendar entries with video room links.
- Authorized BEUA directors access the **Coordinator Admin Portal** to review appointments, adjust open schedule windows, inspect client briefs, and manage booking statuses.

### Target Audience & Personas
- **High-Net-Worth Principals & Executive Clients**: Expect frictionless, private booking with immediate Google Meet confirmation and zero clunky account creation or public calendar widgets.
- **BEUA Concierge Directors & Senior Coordinators**: Need a secure, discreet operational cockpit to monitor incoming bookings, approve bespoke appointment requests, review client notes, and manage operational hours.

### Key Value Delivered
- **Zero Friction for Clients**: Instant confirmation with pre-populated Google Calendar sync and offline `.ics` downloads.
- **Complete Operational Transparency**: Directors no longer rely solely on email alerts—all appointments, past consultations, and client briefs are organized in a real-time Firestore database with status tracking (Pending Review, Confirmed, Completed, Rescheduled).

***

## 2. User Experience & Visual Design

### Key User Flows

#### Flow 1: Client Discovery & Booking
1. Client browses the BEUA homepage and selects **"Book a Consultation"** or clicks an appointment CTA.
2. In **Step 1 (Select Date & Slot)**: The client views real-time available slots fetched from the Firestore `availability` collection (e.g. morning quiet desk, London prime, US East overlap).
3. In **Step 2 (Principal Details)**: Client enters their name, contact email, phone/Signal handle, primary areas of interest, and discreet notes.
4. In **Step 3 (Immediate Confirmation & Dual Sync)**:
   - The booking is submitted to the backend and stored in Firestore (`bookings` collection).
   - The server creates a unique Google Meet room link.
   - The client receives an on-screen confirmation card with reference number (e.g. `BEUA-DS-4921`), a one-click **"Add to Google Calendar"** button (pre-filled with the Google Meet link and description), and a **"Download Invite (.ics)"** button.
   - An automated sync email is dispatched to both the client and `concierge@beua-support.com`.

#### Flow 2: Coordinator Admin Portal
1. A coordinator clicks the discreet account icon in the top navigation bar (`/admin`).
2. **Authentication Gate**: Coordinators sign in securely via Firebase Google Authentication. Only authorized coordinator emails (configured via security rules and the `admins` collection) are granted access.
3. **Admin Dashboard Overview**:
   - **Appointments Ledger**: Tabular view of upcoming, today's, and past discovery sessions with quick filters (`All`, `Upcoming`, `Pending Review`, `Archived`).
   - **Client Dossier Details**: Modal or slide-over drawer showing full consultation briefs, client contact information, requested timezone, and private coordinator notes.
   - **Live Availability Manager**: Interactive calendar grid where coordinators can toggle slots on or off for specific days (e.g. blocking out holidays or private travel days).
   - **Status Operations**: Single-click actions to mark an appointment as *Confirmed*, *Rescheduled*, or *Completed*.

### Visual Identity & Theme
- **Aesthetic Direction**: Mayfair Private Office & Savile Row restraint. High editorial typography, whisper-quiet borders, and generous whitespace.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Warm archival ivory (`#faf9f5`) and crisp card white (`#ffffff`).
  - *Structural Surfaces (30%)*: Muted bone borders (`#e5dfd2` / `#e2ddd0`), subtle warm gray surfaces (`#f4f1e9`), and dark slate typography (`#14231e`).
  - *Intent Accent (10%)*: Deep British racing green (`#16382c`) and rich forest emerald (`#1e4436`) for primary interactive CTAs and active states.
- **Typography**:
  - *Headings*: Refined serif (`Playfair Display` / editorial serif) with balanced headline wrapping (`text-wrap: balance`).
  - *Body Prose*: Clean, legible sans (`Plus Jakarta Sans` / modern geometric).
  - *Identifiers & Timestamps*: High-precision tabular monospace (`font-mono tabular-nums`).
- **Anti-Slop Discipline**:
  - Zero static pill enclosures or rainbow chips.
  - No decorative pulsing dots or fake tech watermarks.
  - Clean hairline borders and single-elevation cards.

***

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Database Architecture (Firebase Firestore)
- **Chosen Approach**: Firestore Enterprise Database provisioned via AI Studio's `ProvisionFirebase` RPC.
- **Why**: 
  - Provides real-time reactive data listeners (`onSnapshot`) for instant coordinator notifications.
  - Native integration with Firebase Authentication (Google Sign-In) with zero third-party API keys required in client code.
  - Hardened Attribute-Based Access Control (ABAC) in `firestore.rules` ensures clients cannot read other clients' bookings or PII, while coordinators have full administrative privileges.
- **Alternatives Considered**: 
  - *PostgreSQL/Cloud SQL*: Requires additional connection pools, migrations, and ORM setup, adding unnecessary complexity for document-oriented booking records.
  - *Local SQLite*: Lacks real-time push synchronization and multi-device access for coordinators.

### Decision 2: Two-Way Calendar & Google Meet Link Generation
- **Chosen Approach**: Server-side programmatic generation of secure Google Meet rooms and bidirectional RFC 5545 calendar invitations.
- **Why**:
  - Guarantees instant meeting room assignment without requiring the end-user client to grant calendar write permissions or OAuth tokens.
  - Both parties receive the event: the client gets an immediate one-click Google Calendar add link + `.ics` download, while the business directive email (`concierge@beua-support.com`) receives the calendar request containing the attendee email and Google Meet link.
- **Alternatives Considered**:
  - *Client-side OAuth flow*: Intrusive for high-profile clients who do not wish to authenticate their personal Google accounts to a third-party website.
  - *Calendly*: Cluttered third-party iframe with cookies, branding, and recurring fees.

### Decision 3: Admin Portal Access Architecture
- **Chosen Approach**: Integrated modal/route within the existing React SPA, secured by Firebase Auth and Firestore ABAC rules checking against the `admins` collection.
- **Why**: Keeps the entire codebase unified under Vite and Express without needing a separate standalone application or deployment.

***

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT LAYER                                    │
│                                                                                 │
│   ┌────────────────────────┐                   ┌────────────────────────────┐   │
│   │   Public Booking UI    │                   │   Coordinator Admin UI     │   │
│   │   (BookingView.tsx)    │                   │     (AdminView.tsx)        │   │
│   └──────────┬─────────────┘                   └─────────────┬──────────────┘   │
└──────────────┼───────────────────────────────────────────────┼──────────────────┘
               │                                               │
               │ POST /api/book                                │ Firebase Auth &
               │ (Reserve Slot)                                │ onSnapshot()
               ▼                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          NODE.JS / EXPRESS BACKEND                              │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │   Server Routes (server.ts)                                             │   │
│   │   • POST /api/book       -> Generate Ref, Meet URL & .ics               │   │
│   │   • POST /api/contact    -> Validate Dossier Brief                      │   │
│   │   • GET  /api/health     -> Operational Prober                          │   │
│   └────────────────────┬────────────────────────────────────────────────────┘   │
│                        │                                                        │
│                        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │   Calendar Sync & Notification Dispatcher                               │   │
│   │   • RFC 5545 iCalendar (.ics) string builder                            │   │
│   │   • Google Meet Private Room URL generator                              │   │
│   │   • Bidirectional Email Dispatch (Client + concierge@beua-support.com) │   │
│   └────────────────────┬────────────────────────────────────────────────────┘   │
└────────────────────────┼────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FIREBASE FIRESTORE & AUTH                               │
│                                                                                 │
│   ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────────┐   │
│   │   /bookings/         │  │   /availability/     │  │   /admins/          │   │
│   │   (Client records,   │  │   (Blocked dates,    │  │   (Authorized       │   │
│   │   Meet URLs, notes)  │  │   custom slots)      │  │   coordinator UIDs) │   │
│   └──────────────────────┘  └──────────────────────┘  └─────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │   firestore.rules (ABAC Hardened Rules)                                 │   │
│   │   • Clients can create booking; only Admins or Owners can read          │   │
│   │   • Public can read availability; only Admins can update slots          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (`firebase-blueprint.json`)

#### Collection: `/bookings/{bookingId}`
- `id` (string): Unique identifier (e.g. `BEUA-DS-8842`)
- `fullName` (string): Client full name
- `email` (string): Client email address
- `phone` (string, optional): Signal / WhatsApp / Phone number
- `scheduledDate` (string): ISO date (`YYYY-MM-DD`)
- `slotTime` (string): Time string (e.g. `11:00 AM`)
- `timezone` (string): Timezone string (e.g. `GMT+0 London, UK`)
- `primaryInterest` (string): Selected advisory category
- `notes` (string, optional): Client brief or logistical requirements
- `meetUrl` (string): Generated Google Meet room URL
- `status` (string): `pending` | `confirmed` | `completed` | `cancelled`
- `createdAt` (timestamp): Server timestamp
- `updatedAt` (timestamp): Server timestamp

#### Collection: `/availability/{dateStr}`
- `date` (string): Keyed by date (e.g. `2026-11-21`)
- `blockedSlots` (array of strings): Slot IDs disabled by coordinator
- `isDayBlocked` (boolean): Whether entire day is unavailable
- `updatedAt` (timestamp): Server timestamp

#### Collection: `/admins/{uid}`
- `email` (string): Coordinator email address
- `role` (string): `coordinator` | `director`
- `assignedHub` (string): `London W1` | `Global Remote`

***

## 5. Execution Stages (Upon User Approval)

1. **Phase 1: Firebase Provisioning & Security Architecture**:
   - Provision Firebase via `show_aistudio_ui` / `ProvisionFirebase` RPC.
   - Establish `firebase-blueprint.json` and deploy hardened `firestore.rules` (with ABAC validation and zero unauthenticated PII leakage).
   - Initialize the Firebase Client SDK (`firebase.ts`).
2. **Phase 2: Backend Two-Way Calendar & Meet Generation**:
   - Enhance `/server.ts` to record bookings directly to Firestore.
   - Generate unique Google Meet links and craft RFC 5545 `.ics` invitations containing both client and business attendee headers.
   - Dispatch real-time booking memos to `concierge@beua-support.com`.
3. **Phase 3: Coordinator Admin Portal**:
   - Build `AdminPortalView.tsx` with authenticated Google Sign-in.
   - Implement real-time bookings ledger, client dossier inspector, and day/slot availability toggles.
   - Add a subtle top navigation access point for administrators.
4. **Phase 4: Client Booking View Synchronization**:
   - Connect `BookingView.tsx` slot availability to live Firestore data so blocked dates/slots dynamically grey out.
   - Verify seamless transition from slot selection to instant Google Calendar sync and `.ics` download.
5. **Phase 5: Verification & Quality Assurance**:
   - Run `lint_applet` and `compile_applet`.
   - Test booking creation, admin status mutation, and calendar invite generation.
