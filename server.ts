import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper function to build RFC 5545 .ics calendar invitation
function generateIcsContent(params: {
  bookingRef: string;
  fullName: string;
  email: string;
  dateStr: string; // e.g. "2026-11-21"
  slotTime: string; // e.g. "11:00 AM"
  timezone: string;
  meetUrl: string;
  notes?: string;
}): string {
  const { bookingRef, fullName, email, dateStr, slotTime, meetUrl, notes } = params;

  // Clean date & time to approximate UTC/local timestamp
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const cleanDate = dateStr.replace(/[^0-9]/g, '').slice(0, 8); // YYYYMMDD
  
  // Parse hour & minute
  let hour = 11;
  let minute = 0;
  const match = slotTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    hour = parseInt(match[1], 10);
    minute = parseInt(match[2], 10);
    if (match[3] && match[3].toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (match[3] && match[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
  }

  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const startTimeStr = `${cleanDate || '20261121'}T${pad(hour)}${pad(minute)}00Z`;
  
  // 30-minute duration
  const endMin = minute + 30;
  const endHour = hour + Math.floor(endMin / 60);
  const endTimeStr = `${cleanDate || '20261121'}T${pad(endHour)}${pad(endMin % 60)}00Z`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BEUA Concierge & Support//Bespoke Advisory//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:beua-${bookingRef.toLowerCase()}@beua-support.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startTimeStr}`,
    `DTEND:${endTimeStr}`,
    'SUMMARY:BEUA Concierge — Private Consultation (30 min)',
    `DESCRIPTION:Confidential consultation for ${fullName} (${email}).\\nReference: ${bookingRef}\\n\\nNotes: ${notes || 'Bespoke lifestyle and administrative coordination.'}\\n\\nDirect Video Suite: ${meetUrl}`,
    `LOCATION:${meetUrl}`,
    'ORGANIZER;CN=BEUA Private Client Directorate:mailto:concierge@beua-support.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${fullName}:mailto:${email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Helper to generate Google Calendar Web Add-Event URL
function generateGoogleCalendarUrl(params: {
  bookingRef: string;
  fullName: string;
  dateStr: string;
  slotTime: string;
  meetUrl: string;
  notes?: string;
}): string {
  const { bookingRef, fullName, dateStr, slotTime, meetUrl, notes } = params;

  let hour = 11;
  let minute = 0;
  const match = slotTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    hour = parseInt(match[1], 10);
    minute = parseInt(match[2], 10);
    if (match[3] && match[3].toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (match[3] && match[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
  }

  const cleanDate = dateStr.replace(/[^0-9]/g, '').slice(0, 8) || '20261121';
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const start = `${cleanDate}T${pad(hour)}${pad(minute)}00Z`;
  const endMin = minute + 30;
  const endHour = hour + Math.floor(endMin / 60);
  const end = `${cleanDate}T${pad(endHour)}${pad(endMin % 60)}00Z`;

  const title = encodeURIComponent('BEUA Concierge — Private Discovery Consultation');
  const details = encodeURIComponent(
    `Confidential consultation with BEUA Concierge Directorate for ${fullName}.\nReference: ${bookingRef}\nScope notes: ${notes || 'Bespoke coordination evaluation.'}\nDirect Video Meeting: ${meetUrl}`
  );
  const location = encodeURIComponent(meetUrl);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

// Helper to dispatch webhook or simulated email transport
async function dispatchEmailWebhook(subject: string, payload: Record<string, unknown>): Promise<boolean> {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
  const targetEmail = process.env.CONCIERGE_NOTIFICATION_EMAIL || 'concierge@beua-support.com';

  console.log(`\n=======================================================`);
  console.log(`[BEUA DESK DISPATCH] ✉️ TO: ${targetEmail}`);
  console.log(`[SUBJECT]: ${subject}`);
  console.log(`[PAYLOAD]:`, JSON.stringify(payload, null, 2));
  console.log(`=======================================================\n`);

  if (!webhookUrl) {
    // Graceful local handling when no external webhook is configured
    return true;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        subject,
        recipient: targetEmail,
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[BEUA EMAIL DISPATCH WARN] Webhook call failed:', err);
    return false;
  }
}

// API Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'BEUA Concierge & Support API',
    desk: 'London W1 Desk Active',
    timestamp: new Date().toISOString(),
  });
});

// POST /api/book - Handle Consultation Booking
app.post('/api/book', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      selectedDate,
      selectedSlot,
      timezone,
      primaryInterest,
      notes,
      calendarOption,
    } = req.body;

    if (!fullName || !email || !selectedSlot) {
      return res.status(400).json({
        error: 'Missing essential booking parameters (fullName, email, selectedSlot).',
      });
    }

    const bookingRef = `BEUA-DS-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = selectedDate || '2026-11-21';
    const slotTime = typeof selectedSlot === 'object' ? selectedSlot.time : String(selectedSlot);
    const selectedOption = calendarOption === 'option-a' ? 'Option A: Google Calendar Sync' : 'Option C: Private Desk & .ics';
    const cleanRef = bookingRef.toLowerCase().replace(/[^a-z0-9]/g, '');
    const meetUrl = `https://meet.google.com/beua-${cleanRef}`;

    // 1. Generate RFC 5545 .ics invite content
    const icsContent = generateIcsContent({
      bookingRef,
      fullName,
      email,
      dateStr,
      slotTime,
      timezone: timezone || 'GMT',
      meetUrl,
      notes,
    });

    // 2. Generate Google Calendar Direct Web URL
    const googleCalendarUrl = generateGoogleCalendarUrl({
      bookingRef,
      fullName,
      dateStr,
      slotTime,
      meetUrl,
      notes,
    });

    // 3. Dispatch structured notification to team email/webhook
    await dispatchEmailWebhook(`[NEW CONSULTATION BOOKING] ${fullName} — ${bookingRef} (${selectedOption})`, {
      type: 'CONSULTATION_BOOKING',
      bookingRef,
      calendarOption: selectedOption,
      meetUrl,
      fullName,
      email,
      phone: phone || 'Not provided',
      date: dateStr,
      timeSlot: slotTime,
      timezone: timezone || 'GMT+0 London',
      primaryInterest: primaryInterest || 'Personal Concierge',
      notes: notes || 'None specified',
    });

    return res.json({
      success: true,
      bookingRef,
      meetUrl,
      calendarOption: selectedOption,
      googleCalendarUrl,
      icsContent,
      message: `Consultation booked via ${selectedOption} and dispatched to concierge desk.`,
    });
  } catch (err: unknown) {
    console.error('Error handling booking request:', err);
    return res.status(500).json({ error: 'Internal server error processing consultation booking.' });
  }
});

// POST /api/contact - Handle Confidential Service Brief
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, interest, scope, message, ndaAccepted } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields (fullName, email, message).',
      });
    }

    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomDigits = Math.floor(10 + Math.random() * 89);
    const dossierCode = `2026-${randomLetter}${randomDigits}`;

    // Dispatch to email webhook
    await dispatchEmailWebhook(`[CONFIDENTIAL SERVICE BRIEF] ${fullName} — REF ${dossierCode}`, {
      type: 'SERVICE_BRIEF',
      dossierCode,
      fullName,
      email,
      phone: phone || 'Not provided',
      interest: interest || 'General Advisory',
      scope: scope || 'Upcoming This Month',
      message,
      ndaAccepted: Boolean(ndaAccepted),
    });

    return res.json({
      success: true,
      dossierCode,
      message: 'Confidential service brief received and queued for senior coordinator review within 4 business hours.',
    });
  } catch (err: unknown) {
    console.error('Error handling service brief:', err);
    return res.status(500).json({ error: 'Internal server error processing service brief.' });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BEUA Concierge server operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
