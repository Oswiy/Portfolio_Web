const CONFIG = {
  name: "Oswi",
  timezone: "Asia/Manila",

  /* ─────────────────────────────────────────
     WORKING HOURS
     Set to null for days you never work.
     These are your DEFAULT hours.
     Specific blocked times go in BLOCKED_SLOTS.
  ───────────────────────────────────────── */
  workingHours: {
    monday: { start: "10:10", end: "21:00" },
    tuesday: { start: "10:10", end: "21:00" },
    wednesday: { start: "10:10", end: "21:00" },
    thursday: { start: "10:10", end: "21:00" },
    friday: { start: "10:10", end: "21:00" },
    saturday: { start: "10:10", end: "21:00" },
    sunday: null,
  },

  /* ─────────────────────────────────────────
     BLOCKED SLOTS
     Format: "YYYY-MM-DD" for full-day blocks,
     or { date, start, end } for partial blocks.
  ───────────────────────────────────────── */
  blockedSlots: [
    // { date: "2026-07-04", start: "13:00", end: "17:00" },
    // "2026-07-10",
  ],

  /* ─────────────────────────────────────────
     SERVICES
     No prices shown — bot directs to discovery
     call for all pricing discussions.
     duration = discovery call length in minutes.
  ───────────────────────────────────────── */
  services: [
    {
      name: "Static Websites",
      duration: 30,
      description:
        "Clean, fast websites for businesses, personal brands, and landing pages. Built to load fast and look great on any device.",
    },
    {
      name: "Portfolio Sites",
      duration: 30,
      description:
        "Custom portfolio websites for creatives, developers, and professionals who want to stand out.",
    },
    {
      name: "Web Applications",
      duration: 30,
      description:
        "Functional web apps with real backends — dashboards, booking systems, data tools, and more.",
    },
    {
      name: "AI Chatbots",
      duration: 30,
      description:
        "AI-powered chatbots for websites, Facebook Messenger, and WhatsApp. Handles inquiries, FAQs, and bookings automatically in English and Tagalog.",
    },
    {
      name: "Discovery Call",
      duration: 30,
      description:
        "Free 30-minute call to talk through your project, scope, and next steps. No commitment required.",
    },
  ],

  /* ─────────────────────────────────────────
     BOT PERSONALITY
  ───────────────────────────────────────── */
  botName: "Aria",
  botIntro:
    "Hi! I'm Aria, Oswi's AI assistant 👋 I can tell you about what he builds, or help you book a free discovery call. What can I help you with?",
  quickReplies: [
    "What do you build?",
    "Book a discovery call",
    "When are you available?",
  ],
};
