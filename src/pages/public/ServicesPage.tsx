import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  CalendarClock, 
  FolderLock, 
  Home, 
  CreditCard, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye,
  ShieldCheck,
  Video,
  Mail,
  BellRing
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import servicesHeroImg from '../../assets/images/services_digital_help_1786863603747.jpg';

interface ServicesPageProps {
  navigate: (route: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const services = [
    {
      id: 'scam-protection',
      title: 'Scam Awareness & Anti-Fraud Shield',
      tagline: 'Instant verification for texts, emails, letters, and phone calls.',
      question: 'Is this message safe or a scam?',
      category: 'Safety',
      color: 'rose',
      icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
      bullets: [
        'Instant verification of text messages, emails, letters, and suspicious callers with plain-English AI analysis.',
        'Clear Traffic-Light Safety Rating: Green (Safe), Amber (Caution), Red (Likely Scam) with immediate actionable advice.',
        'Plain-English UK red flags explaining common fraud tactics (e.g. fake Royal Mail parcel fees, HMRC tax rebates, bank security alerts).',
        'Direct guidance: "Do not click links", "Call your bank on 159", or "Report to Action Fraud".',
        'Optional family safety notifications if dangerous scams or fraud attempts are identified.'
      ],
      screenshotLabel: 'Scam Scanner Live Verdict Screen (Traffic Light Rating & UK Fraud Detection)'
    },
    {
      id: 'digital-help',
      title: 'Digital Learning & Jargon-Free Guides',
      tagline: 'Gentle step-by-step walkthroughs for smartphones, tablets, and computers.',
      question: 'How do I do this on my device without getting confused?',
      category: 'Guidance',
      color: 'teal',
      icon: <HelpCircle className="w-8 h-8 text-teal-600" />,
      bullets: [
        'Step-by-step visual guides for iPad, iPhone, Android, WhatsApp, NHS App, and supermarket delivery.',
        'Plain-English Jargon Buster explaining "Wi-Fi", "The Cloud", "Bluetooth", "Apps", and "Downloads" in everyday words.',
        'Spoken audio screen reader that speaks every single step aloud at a comfortable British English cadence.',
        'Printable one-page cheatsheets formatted cleanly for keeping next to your computer or on the fridge.',
        'Ask-a-Helper one-tap request so trusted family can view guides alongside you.'
      ],
      screenshotLabel: 'Step-by-Step Guide Reader with Spoken Read-Aloud & Picture Walkthroughs'
    },
    {
      id: 'reminders',
      title: 'Appointment & Life Reminders',
      tagline: 'Never miss an MOT, hospital appointment, boiler service, or family birthday.',
      question: 'What renewals and daily tasks are coming up?',
      category: 'Organiser',
      color: 'amber',
      icon: <CalendarClock className="w-8 h-8 text-amber-600" />,
      bullets: [
        'Senior-friendly daily agenda and high-contrast calendar views with extra-large dates.',
        'Dedicated UK annual renewal trackers: Car MOT, Road Tax, Passport, Blue Badge, TV Licence, and Dental checkups.',
        'Gentle SMS text message alerts, emails, and high-contrast screen notifications.',
        'Shared visibility with family carers so sons and daughters can assist with appointment transport.',
        'One-touch snooze with clear spoken reminder intervals.'
      ],
      screenshotLabel: 'High-Contrast Agenda View with MOT & NHS Appointment Reminders'
    },
    {
      id: 'document-vault',
      title: 'Encrypted Document Vault',
      tagline: 'Bank-grade encrypted storage for important household, NHS, and legal papers.',
      question: 'Where did I put that warranty, insurance, or policy letter?',
      category: 'Security',
      color: 'emerald',
      icon: <FolderLock className="w-8 h-8 text-emerald-600" />,
      bullets: [
        'Bank-grade 256-bit encrypted storage for driving licences, NHS cards, home insurance policies, and Power of Attorney letters.',
        'Automatic expiration countdowns with proactive reminders months before official documents expire.',
        'Granular family sharing: choose exactly which documents individual family members are allowed to view.',
        'Emergency medical access protocol: ensures vital health notes and medications are immediately accessible when needed.',
        'High-contrast document viewer with zoom controls and simple camera upload directly from your phone.'
      ],
      screenshotLabel: 'Encrypted Document Vault with Expiry Date Alerts & Family Share Controls'
    },
    {
      id: 'home-manager',
      title: 'Home Manager & Trusted Contacts',
      tagline: 'Organise your utilities, council tax, boiler engineers, and trusted tradespeople.',
      question: 'Who is my water supplier and who do I call if the heating stops?',
      category: 'Organiser',
      color: 'indigo',
      icon: <Home className="w-8 h-8 text-indigo-600" />,
      bullets: [
        'Centralised directory for council tax references, electricity & gas account numbers, and emergency boiler care details.',
        'Verified tradesperson contacts log (Gas Safe engineers, trusted plumbers, local electricians, and gardeners).',
        'Seasonal household safety checklists (winter freeze preparation, smoke alarm tests, radiator bleeding guides).',
        'Meter reading submission helper with step-by-step camera guidance for British Gas, Octopus, and E.ON.',
        'Immediate family sync so relatives know exact emergency cutoff locations for water, gas, and electricity.'
      ],
      screenshotLabel: 'Home Manager Household Dashboard with Emergency Contacts & Seasonal Checks'
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions & Contract Checker',
      tagline: 'Audit recurring broadband, TV packages, and insurance to stop price creep.',
      question: 'Am I paying too much for my broadband, mobile, or breakdown cover?',
      category: 'Money',
      color: 'teal',
      icon: <CreditCard className="w-8 h-8 text-teal-600" />,
      bullets: [
        'Comprehensive breakdown of ongoing broadband, mobile, streaming, insurance, and warranty subscriptions.',
        'Automated contract end-date alerts 30 days before mid-contract price hikes or automatic renewals occur.',
        'UK switching negotiation scripts with plain-English sentences to read when calling Sky, BT, or Virgin to lower your bill.',
        'Jargon-free broadband speed & data checker to determine if you are paying for unused gigabytes.',
        'Clear tracking of direct debits and standing orders across all providers.'
      ],
      screenshotLabel: 'Subscription Tracker with Price Creep Alerts & Negotiation Script Helper'
    },
    {
      id: 'family-connect',
      title: 'Family Connect & Safety Backup',
      tagline: 'Gentle collaboration with adult children and carers while maintaining your total independence.',
      question: 'How can my family help me without taking over my privacy?',
      category: 'Family',
      color: 'purple',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      bullets: [
        'Private family portal allowing designated adult children or carers to view only what you choose to share.',
        'Real-time safeguarding notifications if a suspicious scam is detected or if an urgent appointment is overdue.',
        'One-tap "Check-in" button sending a quick "I’m having a wonderful day" reassurance message to family WhatsApp.',
        'Strict permissions dashboard: easily toggle family access on or off for individual modules with zero awkwardness.',
        'Complete audit log showing exactly when trusted family members viewed shared reminders or documents.'
      ],
      screenshotLabel: 'Family Connect Dashboard with Permission Sliders & Shared Calendar View'
    }
  ];

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(s => s.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-services-page">
      {/* =========================================================================
          HERO SECTION: SERVICES
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="services-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Full Digital Care &amp; Safeguarding Suite</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Everyday digital tools designed <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">for older adults</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              From scam verification and tablet learning to appointment reminders and family connection — explore our full suite of accessible support modules.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                id="btn-services-join-now"
                onClick={() => {
                  navigate('/auth?mode=signup');
                }}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Join Now — View Membership Plans</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                type="button"
                id="btn-services-freephone"
                onClick={() => {
                  window.location.href = 'tel:08008882026';
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <PhoneCall className="w-5 h-5 text-teal-400" />
                <span>0800 888 2026</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-teal-500/30 shadow-2xl bg-slate-800">
              <img
                src={servicesHeroImg}
                alt="Senior grandfather comfortably using an iPad tablet in a bright living room"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 text-slate-900 shadow-lg flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    Accessible &amp; Easy to Use
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Adjustable font size, contrast, and voice audio for every module.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Filter & Grid */}
      <div className="w-full max-w-[1500px] mx-auto px-4 py-16 sm:py-20 space-y-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto">
          {['all', 'Safety', 'Guidance', 'Organiser', 'Security', 'Money', 'Family'].map((cat) => (
            <button
              key={cat}
              type="button"
              id={`btn-filter-${cat.toLowerCase()}`}
              onClick={() => {
                setActiveFilter(cat);
              }}
              className={`px-4 py-2 rounded-xl font-extrabold text-sm sm:text-base transition-all cursor-pointer ${
                activeFilter.toLowerCase() === cat.toLowerCase()
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Services (7)' : cat}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-12">
          {filteredServices.map((srv, idx) => (
            <section
              key={srv.id}
              id={`service-detail-${srv.id}`}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs hover:border-teal-400 transition-all space-y-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                    {srv.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-md">
                        {srv.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Module #{idx + 1}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {srv.title}
                    </h2>
                    <p className="text-base sm:text-lg text-teal-800 font-bold">
                      {srv.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/auth?mode=signup&module=${srv.id}`);
                    }}
                    className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-sm sm:text-base shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Get Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Core capabilities & reassurance */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-lg font-black text-slate-900">
                    What this module gives you:
                  </h3>
                  <ul className="space-y-3">
                    {srv.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-slate-700 text-base leading-relaxed font-medium">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-1" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Example Box */}
                <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-teal-800 font-black text-sm">
                    <Laptop className="w-4 h-4" />
                    <span>How it looks in everyday use:</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Common Question</p>
                    <p className="font-extrabold text-slate-900 text-base">"{srv.question}"</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                      EverEase displays the answer in large, high-contrast text with spoken audio explanation, giving you immediate reassurance.
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Included in all EverEase membership subscriptions</span>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Ready to explore all 7 EverEase modules?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Join today with our simple monthly subscriptions with secure payment options. Direct Debit payments are protected by the Direct Debit Guarantee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                navigate('/pricing');
              }}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl font-black text-lg shadow-lg cursor-pointer transition-all"
            >
              View Membership Plans
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = 'tel:08008882026';
              }}
              className="px-7 py-4 bg-slate-800 text-white hover:bg-slate-700 rounded-2xl font-bold text-lg border border-slate-600 cursor-pointer transition-all"
            >
              Call 0800 888 2026
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
