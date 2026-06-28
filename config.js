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
    monday:    { start: "10:10", end: "21:00" },
    tuesday:   { start: "10:10", end: "21:00" },
    wednesday: { start: "10:10", end: "21:00" },
    thursday:  { start: "10:10", end: "21:00" },
    friday:    { start: "10:10", end: "21:00" },
    saturday:  { start: "10:10", end: "21:00" },
    sunday:    null
  },

  /* ─────────────────────────────────────────
     BLOCKED SLOTS
     Days or time ranges you are NOT available.
     Format: "YYYY-MM-DD" for full-day blocks,
     or { date, start, end } for partial blocks.

     YOUR SCHOOL SCHEDULE:
     Tuesday, Thursday, Saturday: 7:30 AM - 10:10 AM
     (already reflected — working hours start at 10:10)

     Add one-off blocks here as needed.
     Example: internship days, personal appointments.
  ───────────────────────────────────────── */
  blockedSlots: [
    // Example: block a specific afternoon
    // { date: "2026-07-04", start: "13:00", end: "17:00" },

    // Example: block a full day
    // "2026-07-10",

    // Your class schedule is already handled by workingHours
    // (all days start at 10:10 to account for Tue/Thu/Sat classes)
  ],

  /* ─────────────────────────────────────────
     SERVICES
     duration is in minutes.
     price 0 = free.
  ───────────────────────────────────────── */
  services: [
    {
      name: "Discovery Call",
      duration: 30,
      price: 0,
      currency: "PHP",
      description: "Free 30-minute intro call to talk about your project needs."
    },
    {
      name: "AI Receptionist Setup",
      duration: 60,
      price: 8000,
      currency: "PHP",
      description: "Full setup of an AI chatbot for your business website. Handles FAQs, inquiries, and bookings. Supports English and Tagalog."
    },
    {
      name: "Website Build",
      duration: 60,
      price: 12000,
      currency: "PHP",
      description: "Clean, fast static website. Portfolio, landing page, or small business site."
    },
    {
      name: "Messenger / WhatsApp Bot",
      duration: 60,
      price: 7000,
      currency: "PHP",
      description: "AI-powered bot for your Facebook Page or WhatsApp Business. Responds to customers automatically 24/7."
    },
    {
      name: "Consultation Call",
      duration: 60,
      price: 1500,
      currency: "PHP",
      description: "1-hour paid consultation for technical questions, project planning, or code review."
    }
  ],

  /* ─────────────────────────────────────────
     BOT PERSONALITY
     Edit the intro and the quick replies.
  ───────────────────────────────────────── */
  botName: "Aria",
  botIntro: "Hi! I'm Aria, Oswi's AI assistant 👋 I can tell you about his services, check when he's free, or help you book a call. How can I help?",
  quickReplies: [
    "What services do you offer?",
    "How much does it cost?",
    "When are you available?",
    "Book a discovery call"
  ],

};