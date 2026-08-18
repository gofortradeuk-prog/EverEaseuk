import { ModuleDefinition } from '../types';

export const MODULES: ModuleDefinition[] = [
  {
    id: 'scam-protection',
    title: 'Scam Protection',
    plainEnglishQuestion: 'Is this message safe?',
    shortDescription: 'Check suspicious text messages, emails, letters, or phone callers before you reply.',
    detailedDescription: 'EverEase Scam Protection analyses suspicious UK messages (such as fake Royal Mail delivery alerts, HMRC tax rebates, bank security notices, and energy grant texts) using secure AI and verified anti-fraud databases to tell you in clear English if something is a dangerous scam.',
    primaryActionLabel: 'Check a Suspicious Message',
    iconName: 'ShieldAlert',
    route: '/scam-protection',
    accentColor: 'rose',
    badge: 'High Priority Safety',
    category: 'Safety',
    featuresPlanned: [
      'Paste text or upload a screenshot of a suspicious message or email',
      'Plain English risk rating (Safe, Caution, Danger)',
      'Immediate actionable advice ("Do not click the link", "Call your bank on 159")',
      'Automated alert sent to your trusted family members/carers if high danger is detected',
      'UK Scam Library with common current fraud patterns (Royal Mail, HMRC, NHS, TV Licence)'
    ]
  },
  {
    id: 'digital-help',
    title: 'Digital Help',
    plainEnglishQuestion: 'How do I do this?',
    shortDescription: 'Step-by-step simple guides for using your phone, iPad, WhatsApp, NHS app, and online services.',
    detailedDescription: 'Get gentle, jargon-free instructions for modern technology. From making a WhatsApp video call to booking a GP appointment or downloading a photo of your grandchildren, everything is explained with large pictures and simple steps.',
    primaryActionLabel: 'Ask a Tech Question',
    iconName: 'HelpCircle',
    route: '/digital-help',
    accentColor: 'blue',
    badge: 'Gentle Guides',
    category: 'Guidance',
    featuresPlanned: [
      'Voice or typed search in natural plain English (e.g., "How do I send a picture on WhatsApp?")',
      'Step-by-step visual cards with large tap-through buttons',
      'Printable one-page cheatsheets for your fridge or desk',
      'Option to request remote guidance from your linked family carer',
      'Jargon Buster dictionary (explains "Bluetooth", "Cloud", "Wi-Fi", "App" in plain words)'
    ]
  },
  {
    id: 'reminders',
    title: 'Life Reminders',
    plainEnglishQuestion: 'What appointments and renewals are coming up?',
    shortDescription: 'Keep track of GP appointments, medication times, MOT dates, passport renewals, and family birthdays.',
    detailedDescription: 'A clear, high-contrast calendar designed specifically for seniors and carers. You will never miss an MOT, blue badge renewal, boiler service date, hospital visit, or loved one\'s birthday.',
    primaryActionLabel: 'Add a New Reminder',
    iconName: 'CalendarClock',
    route: '/reminders',
    accentColor: 'amber',
    badge: 'Daily & Annual Organiser',
    category: 'Organiser',
    featuresPlanned: [
      'Senior-friendly daily agenda view with large time stamps and clear icons',
      'Important UK annual renewals (Car MOT, Car Tax, Insurance, Passport, TV Licence, Blue Badge)',
      'Gentle phone call, SMS, or high-contrast screen notification reminders',
      'Shared visibility with family carers so loved ones can assist with transport',
      'Repeat schedules (daily, weekly, monthly, annual)'
    ]
  },
  {
    id: 'document-vault',
    title: 'Document Vault',
    plainEnglishQuestion: 'Where are my important papers and expiry dates?',
    shortDescription: 'Safely store photos of your driving licence, NHS number, insurance policies, and will details.',
    detailedDescription: 'An ultra-secure, encrypted vault for your vital papers. Keep your insurance policy numbers, NHS number, council tax records, and power of attorney documents safe and easily accessible for both you and your trusted family in an emergency.',
    primaryActionLabel: 'Store an Important Document',
    iconName: 'FileLock2',
    route: '/document-vault',
    accentColor: 'emerald',
    badge: 'Encrypted Storage',
    category: 'Security',
    featuresPlanned: [
      'One-tap camera upload to photograph paper letters and certificates',
      'Automatic expiry tracking (e.g. driving licence photo renewal at 70, passport validity)',
      'Organised folders: Medical & NHS, Legal & Wills, Home & Insurance, Identification',
      'Emergency Access protocol: instantly share critical details with carers if needed',
      'Clear UK data residency and bank-grade encryption'
    ]
  },
  {
    id: 'home-manager',
    title: 'Home Manager',
    plainEnglishQuestion: 'When is my boiler due for service and who do I call?',
    shortDescription: 'Keep track of your boiler, appliances, trade contacts, gas safety certificates, and home warranties.',
    detailedDescription: 'Manage your home without stress. Keep trusted plumber, electrician, and handyman numbers in one place, log appliance warranty details, and track annual boiler servicing and gas safety checks.',
    primaryActionLabel: 'Add Home Item or Contact',
    iconName: 'Home',
    route: '/home-manager',
    accentColor: 'indigo',
    badge: 'Household Care',
    category: 'Household',
    featuresPlanned: [
      'Trusted Trades directory with one-tap emergency call buttons for local verified technicians',
      'Boiler & heating log with service history and upcoming winter check reminders',
      'Major appliances list (washing machine, fridge, cooker) with model numbers and warranty dates',
      'Stopcock, fuse box, and smart meter location notes with photos for family assistance',
      'Council collection and garden waste bin day reminders'
    ]
  },
  {
    id: 'subscriptions',
    title: 'Subscription Manager',
    plainEnglishQuestion: 'What am I paying for each month?',
    shortDescription: 'Track your recurring bills, magazine subscriptions, broadband contracts, and streaming fees.',
    detailedDescription: 'EverEase helps you review what money leaves your bank account each month for services (e.g. British Gas HomeCare, TV packages, broadband, newspaper subscriptions, roadside cover). Identify duplicate or forgotten direct debits and know when contract end-dates approach to avoid price hikes.',
    primaryActionLabel: 'Add a Recurring Bill',
    iconName: 'Receipt',
    route: '/subscriptions',
    accentColor: 'teal',
    badge: 'Monthly Outgoings',
    category: 'Finances',
    featuresPlanned: [
      'Clear breakdown of monthly and annual direct debits and recurring card charges',
      'Contract end-date alerts (prompts you before broadband, mobile, or insurance auto-renews at higher rates)',
      'UK Cancellation Guidance: step-by-step instructions and template letters to cancel unwanted services',
      'Total monthly spending summary in large, clear figures with UK pound (£) formatting',
      'Carer review mode: allows family to help check for accidental multiple charges or overpayments'
    ]
  },
  {
    id: 'family-connect',
    title: 'Family Connect',
    plainEnglishQuestion: 'Who has access to help me?',
    shortDescription: 'Invite trusted children, relatives, or carers with custom permission controls for each module.',
    detailedDescription: 'Stay connected with the people who love and support you. You choose exactly what your family members can see — give your son access to Reminders and Scam alerts, while keeping your Document Vault private, or grant full carer assistance with granular permissions.',
    primaryActionLabel: 'Invite a Family Member or Carer',
    iconName: 'Users',
    route: '/family-connect',
    accentColor: 'purple',
    badge: 'Care Network',
    category: 'Family',
    featuresPlanned: [
      'Granular per-module permission toggles (View only, Can Edit, No Access)',
      'Invite via simple SMS link or 6-digit family invitation code',
      'Multi-senior switcher for carers looking after both mum and dad or multiple relatives',
      'Activity audit log showing when a carer helped update a reminder or viewed a document',
      'Emergency broadcast button: notifies all linked family members at once'
    ]
  }
];
