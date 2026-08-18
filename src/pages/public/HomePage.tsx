import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  CalendarClock, 
  FolderLock, 
  Home, 
  CreditCard, 
  Users, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Headphones,
  FileCheck2,
  Volume2,
  HeartHandshake,
  Smartphone,
  MessageCircle,
  Video,
  Mail,
  BellRing,
  FileText,
  Smile,
  Shield,
  Clock,
  Building,
  Check,
  ChevronRight,
  Laptop,
  HeartHandshake as CompassionIcon,
  ShieldQuestion,
  BookOpen,
  FileLock2,
  Receipt,
  UserCheck,
  LifeBuoy,
  FileKey
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { MODULES } from '../../lib/modulesData';

// New High-Quality Generated Photography Assets
import seniorTechConfidenceImg from '../../assets/images/senior_tech_confidence_1786862843178.jpg';
import familyCareImg from '../../assets/images/family_care_support_1786862858335.jpg';
import seniorLearningImg from '../../assets/images/senior_learning_devices_1786862872707.jpg';
import ukAdvisorImg from '../../assets/images/uk_support_advisor_1786862884101.jpg';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();
  const [activeFeatureTab, setActiveFeatureTab] = useState<string>('all');

  // Helper mapping icon string to actual Lucide component
  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'scam-protection':
        return <ShieldAlert className="w-7 h-7 text-rose-600" />;
      case 'digital-help':
        return <HelpCircle className="w-7 h-7 text-blue-600" />;
      case 'reminders':
        return <CalendarClock className="w-7 h-7 text-amber-600" />;
      case 'document-vault':
        return <FolderLock className="w-7 h-7 text-emerald-600" />;
      case 'home-manager':
        return <Home className="w-7 h-7 text-indigo-600" />;
      case 'subscriptions':
        return <CreditCard className="w-7 h-7 text-teal-600" />;
      case 'family-connect':
      default:
        return <Users className="w-7 h-7 text-purple-600" />;
    }
  };

  // 1. What our Digital Support Platform Provides items
  const saasCapabilities = [
    {
      id: 'scam-protection',
      title: 'Scam Protection & AI Verification',
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      tag: 'Cyber Safety',
      desc: 'Instant verification of suspicious UK SMS texts, HMRC fake tax rebates, Royal Mail delivery fees, and phishing links with plain-English safety verdicts.',
    },
    {
      id: 'digital-help',
      title: 'Digital Learning & Jargon-Free Guides',
      icon: <BookOpen className="w-6 h-6 text-teal-600" />,
      tag: 'Step-by-Step',
      desc: 'Gentle, visual walkthroughs for iPhone, iPad, Android tablets, supermarket home delivery, and the NHS App with spoken audio read-aloud support.',
    },
    {
      id: 'reminders',
      title: 'Life Reminders & UK MOT Tracker',
      icon: <CalendarClock className="w-6 h-6 text-amber-600" />,
      tag: 'Daily Organiser',
      desc: 'High-contrast agenda for GP appointments, repeat prescriptions, Blue Badge renewals, annual car MOT, Road Tax, and family celebrations.',
    },
    {
      id: 'document-vault',
      title: 'Encrypted Document Vault',
      icon: <FileLock2 className="w-6 h-6 text-emerald-600" />,
      tag: 'Bank-Grade Security',
      desc: 'Ultra-secure 256-bit encrypted digital safe for Power of Attorney documents, NHS numbers, insurance policies, and driving licence renewal tracking.',
    },
    {
      id: 'home-manager',
      title: 'Home Manager & Trades Directory',
      icon: <Home className="w-6 h-6 text-indigo-600" />,
      tag: 'Household Care',
      desc: 'Keep Gas Safe engineer contacts, emergency water stopcock locations, boiler service logs, appliance warranties, and utility account numbers in one place.',
    },
    {
      id: 'subscriptions',
      title: 'Bill & Subscription Guardian',
      icon: <Receipt className="w-6 h-6 text-cyan-600" />,
      tag: 'Money Saver',
      desc: 'Detect hidden recurring subscriptions, track broadband price-rise contract windows, TV licence renewals, and prevent accidental overspending.',
    },
    {
      id: 'family-connect',
      title: 'Family & Carer Sync Hub',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      tag: 'Family Portal',
      desc: 'Permission-based family portal allowing sons, daughters, or trusted caregivers to assist with appointment transport and check safety logs remotely.',
    },
    {
      id: 'confidence-coaching',
      title: 'Patient Human & Helpline Coaching',
      icon: <LifeBuoy className="w-6 h-6 text-blue-600" />,
      tag: 'UK Freephone',
      desc: 'Dedicated UK Freephone phone support and calm digital guidance designed to eliminate tech anxiety and foster true independent everyday mastery.',
    },
  ];

  // 2. Who Our Software Is For items
  const audienceSegments = [
    {
      id: 'seniors',
      badge: 'For Senior Citizens',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      title: 'Independent Older Adults (65+)',
      subtitle: 'Learn at your own pace without feeling rushed or judged.',
      points: [
        'Large, high-contrast buttons and readable fonts designed for mature eyes.',
        'Spoken audio screen reader to hear any guide read aloud.',
        'Clear, plain English with zero patronising attitudes or confusing abbreviations.',
        'Total independence — you remain 100% in control of your accounts.',
      ],
      cta: 'Start with EverEase',
      accentColor: 'border-emerald-600',
    },
    {
      id: 'families',
      badge: 'For Families & Carers',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      title: 'Caring Sons, Daughters & Relatives',
      subtitle: 'Complete reassurance and peace of mind from anywhere in the world.',
      points: [
        'Instant alerts if a potential scam or suspicious charge is flagged.',
        'Shared reminders so hospital visits and medication renewals are never missed.',
        'Encrypted document vault for lasting power of attorney and insurance policies.',
        'Relief from daily technical troubleshooting calls with dedicated UK staff on hand.',
      ],
      cta: 'Protect Your Loved One',
      accentColor: 'border-blue-600',
    },
    {
      id: 'reluctant-tech',
      badge: 'For Tech-Anxious Users',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      title: 'Anyone Feeling Confused or Left Behind',
      subtitle: 'Technology that adapts to you, rather than forcing you to adapt to it.',
      points: [
        'Never worry about "pressing the wrong button" or losing your files.',
        'Friendly UK telephone support desk always ready to walk you through.',
        'No invasive pop-ups, advert traps, or unwanted background updates.',
        'Safe banking and Direct Debit guarantee protection on all payments.',
      ],
      cta: 'Explore Membership Plans',
      accentColor: 'border-amber-600',
    },
  ];

  // 3. Why Families Choose EverEase
  const whyChooseReasons = [
    {
      title: 'Patient, Jargon-Free Guidance',
      desc: 'We never rush or use confusing acronyms. We explain concepts in clear everyday English as many times as needed until you feel 100% comfortable.',
      icon: <HeartHandshake className="w-6 h-6 text-emerald-700" />,
    },
    {
      title: 'No Direct Card Checkout on Site',
      desc: 'For maximum financial safety, we never collect card numbers on our website. Official invoices with secure BACS Direct Debit & Card links are sent by Stripe.',
      icon: <Shield className="w-6 h-6 text-teal-700" />,
    },
    {
      title: 'Dedicated UK Telephone & Portal Support',
      desc: 'Speak directly with our friendly British customer support team via our UK Freephone line (0800 888 2026) or request assistance inside your portal.',
      icon: <Headphones className="w-6 h-6 text-blue-700" />,
    },
    {
      title: 'Zero Ads, Pop-Ups, or Data Selling',
      desc: 'Your private information, family photos, and documents remain strictly confidential under UK GDPR standards. We never monetize your personal data.',
      icon: <Lock className="w-6 h-6 text-indigo-700" />,
    },
    {
      title: 'Gentle Family Connection with Full Dignity',
      desc: 'Seniors maintain complete autonomy while family members can provide safety backup, helping prevent elder financial fraud and isolation.',
      icon: <Users className="w-6 h-6 text-purple-700" />,
    },
    {
      title: 'Transparent Monthly Membership & Cancel Anytime',
      desc: 'Simple monthly subscriptions with secure payment options. Direct Debit payments are protected by the Direct Debit Guarantee.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-700" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-home-page">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="hero-section">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Safeguarding trust badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span>UK Digital Support Platform for Older Adults &amp; Families</span>
            </div>

            {/* Value proposition heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Making everyday technology <span className="text-emerald-300 underline decoration-emerald-500/50 underline-offset-8">simple, safe &amp; stress-free</span> for older adults.
            </h1>

            {/* Supporting description */}
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              Patient digital guidance, plain-English scam protection, smartphone &amp; tablet learning, and gentle family backup — without confusing jargon or rushed instructions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                id="btn-hero-get-started"
                onClick={() => {
                  navigate('/auth?mode=signup');
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer border-0"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Get Started — View Plans</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                type="button"
                id="btn-hero-book-intro-call"
                onClick={() => {
                  navigate('/contact?book=call');
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <span>Book a Free Intro Call</span>
              </button>
            </div>

            {/* Helpline and Direct Debit Badge */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>UK Freephone:</span>
                <a href="tel:08008882026" className="text-emerald-400 font-bold hover:underline">
                  0800 888 2026
                </a>
              </div>
              <span className="text-slate-500">•</span>
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-teal-400" />
                <span>BACS Direct Debit Protected</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Quality Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-500/30 shadow-2xl bg-slate-800">
              <img
                src={seniorTechConfidenceImg}
                alt="Senior woman using tablet with smile and confidence"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Confidence Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 text-slate-900 shadow-lg flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    Safe, Patient &amp; Jargon-Free
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Over 12,000+ older adults supported with calm technology guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SCREENSHOT MATCHING BANNER & 6 FEATURE CARDS SECTION
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 w-full max-w-[1500px] mx-auto space-y-10" id="platform-overview">
        {/* Centered Sub-Heading Banner */}
        <div className="text-center max-w-4xl mx-auto px-2 space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-900 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Comprehensive Senior Safeguarding &amp; Digital Learning</span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-teal-900 leading-relaxed">
            A complete, patient support ecosystem designed to protect your finances, preserve independence, and keep your family connected.
          </p>
        </div>

        {/* 6 Fresh Modern Capability Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Anti-Fraud & Cyber Safety */}
          <div 
            id="card-scam-shield-pillar"
            className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-rose-400 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                  Active Defence
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mt-2">
                  UK Scam Scanner &amp; Fraud Shield
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Instant AI verification of suspicious texts, fake HMRC rebates, banking alerts, and unsolicited phone calls with plain-English safety verdicts.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/services#scam-protection');
                }}
                className="text-rose-700 hover:text-rose-800 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent p-0"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Visual Digital Learning & Jargon Buster */}
          <div 
            id="card-digital-learning-pillar"
            className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-teal-400 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md">
                  Patient Tutorials
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mt-2">
                  Jargon-Free Device Walkthroughs
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Step-by-step pictorial guides for iPad, iPhone, Android, WhatsApp, and online supermarket delivery, accompanied by British audio read-aloud.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/services#digital-help');
                }}
                className="text-teal-700 hover:text-teal-800 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent p-0"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Encrypted Document & Expiry Safe */}
          <div 
            id="card-document-vault-pillar"
            className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileLock2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                  Bank-Grade Safe
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mt-2">
                  Encrypted Document Vault
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Bank-level 256-bit encrypted storage for Power of Attorney deeds, NHS paperwork, driving licences, and insurance policies with expiry countdowns.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/services#document-vault');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent p-0"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: Routine, MOT & Medical Reminders */}
          <div 
            id="card-reminders-pillar"
            className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-amber-400 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarClock className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md">
                  Daily Organiser
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mt-2">
                  Appointment &amp; MOT Tracker
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                High-contrast daily agenda and automated text reminders for GP appointments, prescription refills, annual car MOTs, and family milestones.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/services#reminders');
                }}
                className="text-amber-800 hover:text-amber-900 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent p-0"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 5: Household Emergency & Trade Manager */}
          <div 
            id="card-home-manager-pillar"
            className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                  Home Directory
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mt-2">
                  Home Manager &amp; Verified Trades
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Centralised utility reference numbers, boiler annual service records, stopcock shut-off diagrams, and trusted local tradesperson contacts.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/services#home-manager');
                }}
                className="text-indigo-700 hover:text-indigo-800 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent p-0"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 6: Family Care & Reassurance Portal */}
          <div 
            id="card-family-sync-pillar"
            className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-purple-400 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">
                  Carer Portal
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mt-2">
                  Family Sync &amp; Reassurance Hub
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Shared family calendar visibility, joint guide viewing, and optional instant security alerts so sons and daughters can support from afar.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/services#family-connect');
                }}
                className="text-purple-700 hover:text-purple-800 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent p-0"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION 1: WHAT OUR DIGITAL SUPPORT PLATFORM PROVIDES
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 w-full max-w-[1500px] mx-auto space-y-12" id="what-support-provides">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 font-extrabold text-xs sm:text-sm uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Core Digital Support Features</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            1. What Our Digital Support Platform Provides
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            EverEase provides an accessible online customer portal, plain-English digital education, and ongoing non-medical tech support for everyday tasks.
          </p>
        </div>

        {/* Highlight Banner with Image */}
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Interactive Dashboard &amp; Support Desk
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Practical technology support designed around your everyday routine.
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Whether you need help reading an email, making a video call to family, updating your smartphone settings, or checking if a text is a scam, our support platform puts calm, patient assistance right at your fingertips.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Large high-contrast display</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Audio voice read-aloud</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>UK Freephone helpline</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>No direct card checkout on site</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md">
              <img
                src={seniorLearningImg}
                alt="Senior couple happily learning devices together"
                className="w-full h-72 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* 8 SaaS Capability Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {saasCapabilities.map((item) => (
            <div
              key={item.id}
              id={`saas-capability-${item.id}`}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200/90 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-emerald-700 font-semibold text-xs">Included in All Plans</span>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/services#${item.id}`);
                  }}
                  className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center gap-1 border-0 bg-transparent p-0 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. SECTION 2: WHO OUR SOFTWARE IS FOR
          ========================================================================= */}
      <section className="bg-slate-100 py-16 sm:py-24 px-4 border-y border-slate-200" id="who-software-is-for">
        <div className="w-full max-w-[1500px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 font-extrabold text-xs sm:text-sm uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-300">
              <Users className="w-4 h-4 text-blue-700" />
              <span>Tailored for Every Generation</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              2. Who Our Software Is For
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              Designed specifically for older adults wanting gentle independence, and families seeking reassurance.
            </p>
          </div>

          {/* 3 Audience Persona Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {audienceSegments.map((segment) => (
              <div
                key={segment.id}
                id={`audience-card-${segment.id}`}
                className={`bg-white rounded-3xl p-7 sm:p-8 border-3 ${segment.accentColor} shadow-md flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  {/* Badge */}
                  <span className={`inline-block text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${segment.badgeColor}`}>
                    {segment.badge}
                  </span>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {segment.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      {segment.subtitle}
                    </p>
                  </div>

                  {/* Bullet checklist */}
                  <ul className="space-y-3 pt-2">
                    {segment.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base font-semibold text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/auth?mode=signup');
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white font-extrabold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{segment.cta}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Spotlight Image Strip */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <img
              src={familyCareImg}
              alt="Daughter and father reviewing secure dashboard together"
              className="w-full md:w-64 h-48 rounded-2xl object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Peace of Mind for the Whole Family
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                "It feels like having a patient family member living next door to help with my iPad."
              </h4>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                — Margaret Davies, 76, Bristol (EverEase Member since 2025)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION 3: WHY FAMILIES CHOOSE EVEREASE
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 w-full max-w-[1500px] mx-auto space-y-12" id="why-families-choose">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 font-extrabold text-xs sm:text-sm uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-emerald-300">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>Trusted British Service</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            3. Why Families Choose EverEase
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            We bridge the technology gap with warmth, human empathy, and rigorous financial security safeguards.
          </p>
        </div>

        {/* 6 Core Differentiator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseReasons.map((reason, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border-2 border-slate-200/90 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                {reason.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {reason.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>

        {/* UK Support Advisor Spotlight */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-md">
              <img
                src={ukAdvisorImg}
                alt="Friendly UK support advisor on phone"
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>Real People, Real Patience</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Friendly UK-Based Support Desk Ready to Help
            </h3>
            <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed">
              When you or your parent encounter a confusing popup, a locked password, or an unfamiliar app update, you won't be left dealing with unhelpful robots. Our UK team is always just a quick telephone call or dashboard message away.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="tel:08008882026"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-base shadow transition-colors"
              >
                <PhoneCall className="w-5 h-5 text-slate-950" />
                <span>Call Freephone: 0800 888 2026</span>
              </a>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-base border border-slate-600 transition-colors"
              >
                Ask a Question Online
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SEVEN CORE MODULE PILLARS
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 w-full max-w-[1500px] mx-auto space-y-12 bg-white rounded-3xl border-2 border-slate-200 shadow-sm" id="core-modules">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="text-emerald-800 font-extrabold text-xs sm:text-sm uppercase tracking-widest">
            Seven Pillars of Peace of Mind
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything you need to navigate everyday life safely.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Each module is crafted with large buttons, high-contrast layouts, and plain English explanations.
          </p>
        </div>

        {/* 7 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MODULES.map((module) => {
            return (
              <div
                key={module.id}
                id={`feature-card-${module.id}`}
                className="bg-slate-50 rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-2xs hover:border-emerald-500 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Icon & Category Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      {getModuleIcon(module.id)}
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {module.category}
                    </span>
                  </div>

                  {/* Title & Plain English One-Line Question */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {module.title}
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-emerald-800 mt-1 italic">
                      "{module.plainEnglishQuestion}"
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                    {module.shortDescription}
                  </p>
                </div>

                {/* Explore link */}
                <div className="pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/services');
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 text-sm sm:text-base group cursor-pointer"
                  >
                    <span>Read full module details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. TRUST & SAFEGUARDS STRIP
          ========================================================================= */}
      <section className="bg-slate-900 text-white py-8 px-4 border-y-2 border-slate-800" id="trust-strip">
        <div className="w-full max-w-[1500px] mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-extrabold text-slate-200">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Vault</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-400" />
            <span>BACS Direct Debit Guarantee</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>Dedicated UK-Based Support Desk</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-purple-400" />
            <span>Strict UK GDPR Compliance</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PRE-FOOTER CALL TO ACTION
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 max-w-4xl mx-auto text-center space-y-6" id="home-pre-footer">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          Ready to feel safe and confident with everyday technology?
        </h2>
        <p className="text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Join EverEase today. Choose your monthly membership plan, receive your Unique ID Code and temporary password, and pay securely via Stripe with BACS Direct Debit or Card.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            id="btn-home-bottom-get-started"
            onClick={() => {
              navigate('/auth?mode=signup');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <span>Get Started — Membership Onboarding</span>
          </button>
          <button
            type="button"
            id="btn-home-bottom-call"
            onClick={() => navigate('/contact')}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 rounded-2xl font-bold text-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5 text-emerald-700" />
            <span>Contact UK Support Team</span>
          </button>
        </div>
      </section>
    </div>
  );
};

