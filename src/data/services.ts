import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'personal-concierge',
    index: '01',
    categoryKey: 'personal',
    categoryTag: '01 / PRIVATE LIVING & HOUSEHOLD',
    title: 'Personal Concierge Services',
    shortDesc: 'Seamless lifestyle coordination designed to handle domestic logistics, vendor vetting, and bespoke private procurement.',
    longDesc: 'Designed for individuals and families managing complex residences, relocations, and high-frequency personal demands without the friction of micro-managing vendors. Your dedicated coordinator maintains continuity across every nuance of private life.',
    iconName: 'Home',
    attributes: [
      'Uncompromised confidentiality across all personal and family matters under binding NDAs.',
      'Pre-vetted artisan and domestic specialist network spanning London, Paris, and Geneva.',
      'Direct encrypted messaging (Signal, WhatsApp, or private phone) with your appointed primary coordinator.'
    ],
    deliverables: [
      'Domestic vendor & trade supervision',
      'Relocation & seasonal home transitions',
      'Private club hospitality & table reservations',
      'Bespoke gifting & rare item procurement'
    ],
    vignette: {
      tag: 'CASE VIGNETTE',
      title: 'Seasonal Residence Transition • Knightsbridge to St. Moritz',
      quote: 'BEUA assumed full stewardship of our Kensington house renovation, managing four separate artisan contractors while we were overseas without a single dropped stitch.',
      author: 'Private Client, London & Zurich'
    }
  },
  {
    id: 'lifestyle-travel',
    index: '02',
    categoryKey: 'travel',
    categoryTag: '02 / ITINERARIES & MOBILITY',
    title: 'Lifestyle & Travel Assistance',
    shortDesc: 'Comprehensive itinerary curation, private transport management, and culturally elevated experiences.',
    longDesc: 'Complete door-to-door itinerary planning and logistical coordination for leisure, business travel, and multi-destination engagements. We manage disruptions proactively before they surface, safeguarding your peace of mind.',
    iconName: 'Plane',
    attributes: [
      'Frictionless global travel with real-time proactive flight and transfer adjustments.',
      'Direct coordination with private aviation charters, superyacht brokers, and luxury heritage estates.',
      'Privileged access to museum curators, private salons, and sold-out cultural performances.'
    ],
    deliverables: [
      'Minute-by-minute serene travel schedules',
      'Private charter vetting & VIP handling',
      'Bespoke estate & villa portfolio rental',
      'Curated cultural guides & private viewings'
    ],
    vignette: {
      tag: 'ITINERARY DOSSIER',
      title: 'Bespoke Multi-Leg Transit • Tokyo, Kyoto & Naoshima',
      flightSample: {
        route: 'FBO Paris Le Bourget ➔ Samedan St. Moritz',
        chauffeur: '08:15 Chauffeur curbside link',
        airTransfer: 'Helicopter air-transfer standing by',
        status: 'Active Vigilance'
      }
    }
  },
  {
    id: 'admin-virtual',
    index: '03',
    categoryKey: 'admin',
    categoryTag: '03 / EXECUTIVE & OPERATIONAL',
    title: 'Administrative & Virtual Support',
    shortDesc: 'Discrete executive assistance for founders, creatives, and independent professionals balancing complex calendars and high-volume correspondence.',
    longDesc: 'Offload the operational drag of overflowing inboxes, complex diary coordination, expense tracking, and digital archives with a senior-grade coordinator who understands executive protocol and nuanced diplomacy.',
    iconName: 'Laptop',
    attributes: [
      'Reclaim 15–25 hours per week of uninterrupted deep work and strategic focus.',
      'Trained career coordinators versed in senior corporate etiquette and board correspondence.',
      'Rigorous 256-bit encrypted data silos and zero multi-client cross-exposure.'
    ],
    deliverables: [
      'Master calendar gating & conflict triage',
      'Inbox zero workflows & priority digests',
      'Monthly expense reconciliations & CPA handoffs',
      'Encrypted cloud repositories & digital records'
    ],
    vignette: {
      tag: 'METRIC REPORT',
      title: 'Average Client Weekly Reclaim',
      metric: {
        reclaimHours: '18.5',
        highValueFocus: 74,
        delegated: 26,
        annotation: 'Every appointment vetted, email triaged, and receipt filed before you begin your working day.'
      }
    }
  },
  {
    id: 'consultation-planning',
    index: '04',
    categoryKey: 'advisory',
    categoryTag: '04 / ADVISORY & ARCHITECTURE',
    title: 'Consultation & Support Planning',
    shortDesc: 'For individuals and family offices seeking to optimize their routine operational rhythms and outsource recurring time sinks.',
    longDesc: 'Diagnostic workflow mapping and structured routine delegation for busy leaders. For professionals and family offices seeking to audit their daily time sinks, design bespoke operational cadences, and establish ongoing delegation frameworks before committing to a permanent retainer.',
    iconName: 'Compass',
    attributes: [
      'A structured 360-degree audit of personal and professional time leaks.',
      'Bespoke delegation playbook tailored strictly to your mental bandwidth.',
      'Zero commitment required; clear standalone takeaways from the initial session.'
    ],
    deliverables: [
      '1-on-1 operational rhythm audit workshop',
      'Vendor relationship master consolidation',
      'Communication cadence & review protocol',
      'Custom delegation playbook documentation'
    ],
    vignette: {
      tag: 'DISCOVERY ARCHITECTURE',
      title: 'The 30-Minute Diagnostic',
      diagnostic: {
        steps: [
          {
            number: 1,
            title: 'Time Drain Audit',
            desc: 'Identify repetitive micro-stewarding and vendor bottlenecks.'
          },
          {
            number: 2,
            title: 'Communication Preference Mapping',
            desc: 'Determine frequency, encrypted channels, and escalation bounds.'
          },
          {
            number: 3,
            title: 'Custom Allocation Proposal',
            desc: 'Receive a tailored scope recommendation within 24 hours.'
          }
        ]
      }
    }
  }
];
