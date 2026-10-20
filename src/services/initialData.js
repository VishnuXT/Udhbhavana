export const initialSiteConfig = {
  // Hero & Core Branding
  eventName: "Udhbhavana 2026",
  tagline: "Aim IT..Win IT",
  awarenessMessage: "Say No To Drugs..Say Yes to Life..!",
  institutionName: "Sree Buddha College of Engineering, Autonomous",
  associationName: "Operation Toofan",
  registrationUrl: "https://forms.gle/ZK8JZ86X24HNUHgm8",
  heroExploreBtnText: "Explore Competitions",
  heroRegisterBtnText: "Register Now",
  logoUrl: "/logo.png",
  posterUrl: "/poster.jpg",

  // About Section
  aboutTag: "Background & Purpose",
  aboutHeading: "About Udhbhavana",
  aboutSubtitle: "Uniting technical excellence with social empowerment",
  aboutDescription: "Udhbhavana is the premier state-level technical, creative, and innovation fest organized by Sree Buddha College of Engineering (Autonomous), Pattoor, in proud association with Operation Toofan. Carrying forward a vibrant message of social consciousness — 'No to drugs, Yes to life' — the event convenes aspiring minds, technologists, artists, and innovators across Kerala for an exhilarating celebration of talent, intellect, and community spirit.",
  aboutSubDescription: "Organized with precision and passion, this symposium offers young minds an open platform to present working prototypes, pitch breakthrough startup ideas, demonstrate creative visual storytelling, and engage in high-octane academic quizzing.",
  aboutHighlight1Title: "Autonomous Excellence",
  aboutHighlight1Desc: "Organized under the academic rigor of Sree Buddha College of Engineering (Autonomous).",
  aboutHighlight2Title: "Operation Toofan Alliance",
  aboutHighlight2Desc: "In partnership with Operation Toofan, driving meaningful youth engagement.",
  aboutHighlight3Title: "Social Commitment",
  aboutHighlight3Desc: "Promoting clean living, mental well-being, and active youth leadership across campus communities.",

  // Competitions Section Header
  competitionsTag: "Events & Contests",
  competitionsHeading: "Explore Competitions",
  competitionsSubtitle: "Compete across five signature tracks designed to test your technical ingenuity, artistic expression, and leadership.",

  // Competition Rules & Instructions (Classroom Blackboard)
  competitionRulesVisible: true,
  competitionRulesTag: "COMPETITION RULES & INSTRUCTIONS",
  competitionRulesHeading: "Read Before You Participate",
  competitionRulesList: [
    {
      id: "rule-1",
      title: "Register Properly",
      description: "Complete registration before participating."
    },
    {
      id: "rule-2",
      title: "Follow Guidelines",
      description: "Read the rules for your chosen competition."
    },
    {
      id: "rule-3",
      title: "Maintain Fairness",
      description: "Submit original work and follow ethical practices."
    },
    {
      id: "rule-4",
      title: "Be Respectful",
      description: "Respect participants, coordinators, and judges."
    }
  ],
  competitionRule1Title: "Register Properly",
  competitionRule1Desc: "Complete registration before participating.",
  competitionRule2Title: "Follow Guidelines",
  competitionRule2Desc: "Read the rules for your chosen competition.",
  competitionRule3Title: "Maintain Fairness",
  competitionRule3Desc: "Submit original work and follow ethical practices.",
  competitionRule4Title: "Be Respectful",
  competitionRule4Desc: "Respect participants, coordinators, and judges.",

  // Prize Pool Section
  prizeTag: "Rewarding Innovation & Brilliance",
  prizePoolText: "Prizes over ₹1 lakh",
  prizeDesc: "Grand cash prizes, trophies of recognition, and merit certificates await top-performing innovators, artists, and problem solvers across all competitive categories.",

  // Chief Guest & Inauguration
  inaugurationTag: "Dignitary & Inaugural Address",
  inaugurationHeading: "Inauguration",
  inaugurationSubtitle: "Honoring our esteemed chief guest for the official opening ceremony",
  guestLabel: "Inauguration by",
  guestName: "Sri. Ramesh Chennithala",
  guestDesignation: "Hon'ble Home Minister of Kerala",
  guestConfirmed: false,
  guestImage: "",
  guestUnconfirmedNote: "(Designation as printed on official event poster; itinerary subject to official confirmation)",

  // Schedule, Venue & Map
  eventInfoTag: "Location & Schedule",
  eventInfoHeading: "Event Information & Venue",
  eventInfoSubtitle: "Everything you need to know about reaching the venue and timing.",
  eventDate: "09 November 2026",
  eventDateSub: "Mark your calendar",
  eventTime: "09:30 AM IST",
  eventTimeSub: "Inauguration begins promptly",
  venue: "College Auditorium & Campus Labs",
  eventVenueSub: "Sree Buddha College of Engineering (Autonomous)",
  address: "Pattoor P.O., Nooranad, Alappuzha District, Kerala – 690507",
  mapsUrl: "https://maps.google.com/?q=Sree+Buddha+College+of+Engineering+Pattoor",
  mapsLinkText: "Get Directions",

  // Contact Desk & Channels
  contactTag: "Get in Touch",
  contactHeading: "Contact & Inquiries",
  contactSubtitle: "Have questions regarding competition guidelines, registration, or travel accommodation?",
  contactDeskTitle: "Official Event Desk",
  contactDeskDesc: "Reach out to the organizing student coordinators and faculty convener committee.",
  contactCampusTitle: "Institution Campus",
  contactAccreditations: "NAAC 'A' Grade Accredited • NBA Accredited Programmes • Autonomous Institution",
  contactEmail: "udhbhavana@sbce.ac.in",
  contactPhone: "",
  socialLinks: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com"
  },

  // Footer & Publishing
  footerText: "© Udhbhavana. Sree Buddha College of Engineering (Autonomous) in association with Operation Toofan. All rights reserved.",
  published: true,
  sectionVisibility: {
    hero: true,
    about: true,
    competitions: true,
    competitionRules: true,
    prizes: true,
    inauguration: true,
    eventInfo: true,
    announcements: true,
    contact: true
  }
};

export const initialCompetitions = [
  {
    id: "comp-1",
    title: "Painting Competition",
    slug: "painting-competition",
    category: "Creative Arts",
    description: "Unleash your artistic expression on canvas around themes of life, innovation, and social consciousness.",
    imageUrl: "",
    registrationUrl: "https://forms.google.com",
    rules: "1. Time limit: 2.5 hours.\n2. Materials: Chart paper provided; bring your own colors and brushes.\n3. Theme will be announced on the spot.",
    eventDate: "09 Nov 2026",
    eventTime: "10:30 AM",
    venue: "Drawing Hall 1, Main Block",
    prizeDetails: "Cash prizes for 1st and 2nd positions with certificates of excellence.",
    registrationStatus: "Open Soon",
    published: true,
    displayOrder: 1
  },
  {
    id: "comp-2",
    title: "Working Model Presentation",
    slug: "working-model-presentation",
    category: "Engineering & Tech",
    description: "Showcase functioning engineering prototypes, automation setups, and inventive hardware solutions addressing real-world problems.",
    imageUrl: "",
    registrationUrl: "https://forms.google.com",
    rules: "1. Team size: 2 to 4 members.\n2. Model must be functional and demonstrated live before the jury.\n3. Bring necessary power cables and equipment.",
    eventDate: "09 Nov 2026",
    eventTime: "11:00 AM",
    venue: "Mechanical & Robotics Labs",
    prizeDetails: "Exciting cash prizes and trophies for best technical innovation.",
    registrationStatus: "Open Soon",
    published: true,
    displayOrder: 2
  },
  {
    id: "comp-3",
    title: "Reel Making Competition",
    slug: "reel-making-competition",
    category: "Media & Creativity",
    description: "Capture the vibrant energy of Udhbhavana and champion the message 'No to drugs, Yes to life' through captivating short video reels.",
    imageUrl: "",
    registrationUrl: "https://forms.google.com",
    rules: "1. Duration: 30 to 60 seconds.\n2. Format: 9:16 vertical video.\n3. Must incorporate the event tagline and awareness message.",
    eventDate: "09 Nov 2026",
    eventTime: "Whole Day Event",
    venue: "Campus Wide",
    prizeDetails: "Prizes awarded for top engagement, visual storytelling, and jury score.",
    registrationStatus: "Open Soon",
    published: true,
    displayOrder: 3
  },
  {
    id: "comp-4",
    title: "Ideathon",
    slug: "ideathon",
    category: "Innovation & Startup",
    description: "Pitch revolutionary startup ideas, sustainable tech solutions, and community problem statements to a panel of industry veterans.",
    imageUrl: "",
    registrationUrl: "https://forms.google.com",
    rules: "1. Maximum 8 slides presentation.\n2. 7 minutes pitch + 3 minutes Q&A.\n3. Feasibility, novelty, and societal impact will be evaluated.",
    eventDate: "09 Nov 2026",
    eventTime: "01:30 PM",
    venue: "Seminar Hall 2",
    prizeDetails: "Special startup mentorship grants and cash rewards for top 3 teams.",
    registrationStatus: "Open Soon",
    published: true,
    displayOrder: 4
  },
  {
    id: "comp-5",
    title: "Quiz Competition",
    slug: "quiz-competition",
    category: "General & Tech",
    description: "Battle of the brains covering technology, science, current affairs, and general awareness across multiple rapid-fire rounds.",
    imageUrl: "",
    registrationUrl: "https://forms.google.com",
    rules: "1. Team of 2 members.\n2. Preliminary written screening round followed by live stage finals.\n3. Quiz master's decision is final.",
    eventDate: "09 Nov 2026",
    eventTime: "02:00 PM",
    venue: "Auditorium Main Stage",
    prizeDetails: "Cash awards and certificates for winning finalists.",
    registrationStatus: "Open Soon",
    published: true,
    displayOrder: 5
  }
];

export const initialAnnouncements = [
  {
    id: "ann-1",
    title: "Udhbhavana Portal Officially Launched!",
    message: "Welcome to the official web portal for Udhbhavana. Registration links and detailed schedules for all 5 competitions are now available.",
    imageUrl: "",
    published: true,
    publishedAt: "2026-10-18",
    expiresAt: "",
    displayOrder: 1
  }
];
