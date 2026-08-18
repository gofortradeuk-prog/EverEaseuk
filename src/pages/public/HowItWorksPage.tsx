import React, { useState } from 'react';
import { 
  CheckCircle2, 
  CreditCard, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  ArrowRight, 
  Lock, 
  CalendarClock, 
  HeartHandshake, 
  ShieldAlert,
  Smartphone,
  Check,
  RefreshCw,
  FileText,
  Mail,
  GraduationCap,
  ShieldQuestion
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import howItWorksImg from '../../assets/images/how_it_works_steps_1786863616482.jpg';
import { JoinPlanModal } from '../../components/public/JoinPlanModal';
import { DEFAULT_PLANS } from '../../lib/firestoreService';
import { PricingPlan } from '../../types';

interface HowItWorksPageProps {
  navigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PricingPlan | null>(DEFAULT_PLANS[1]); // Default to Complete Plan

  const handleOpenJoinModal = (plan?: PricingPlan) => {
    setSelectedPlanForModal(plan || DEFAULT_PLANS[1]);
    setIsJoinModalOpen(true);
  };

  const steps = [
    {
      number: '1',
      title: 'Choose Your Plan & Receive Secure Credentials',
      subtitle: 'Simple online registration with zero lock-in contracts.',
      description: 'Select your preferred EverEase plan and complete our 2-minute registration form. An official Stripe Invoice, secure payment link (supporting UK BACS Direct Debit and Cards), and your unique account password are automatically dispatched to your email address.',
      bullets: [
        'Transparent UK pricing with zero 7-day trial traps or unexpected surprises.',
        'Unique generated account password sent immediately to your email inbox.',
        'Protected by Stripe security and the UK Direct Debit Guarantee scheme.'
      ],
      icon: <CreditCard className="w-8 h-8 text-teal-600" />
    },
    {
      number: '2',
      title: 'Empathetic Welcome Call & Needs Assessment',
      subtitle: 'We speak your language—in plain English without tech jargon.',
      description: 'A friendly British specialist calls you at your preferred time to introduce the service, take note of the devices you own (iPad, iPhone, Android, or PC), and discuss what everyday tasks you want help with first.',
      bullets: [
        '100% UK-based senior care specialists trained in unhurried, patient guidance.',
        'We tailor your account font size, high contrast, and voice audio settings.',
        'Zero pressure or rushing—take all the time you need to feel comfortable.'
      ],
      icon: <HeartHandshake className="w-8 h-8 text-teal-600" />
    },
    {
      number: '3',
      title: '1-on-1 Guided Learning & Software Walkthrough',
      subtitle: 'Step-by-step guidance tailored to your confidence level.',
      description: 'We guide you through your EverEase portal, demonstrating how to make video calls to loved ones, browse securely, manage online banking safely, and access our library of plain-English visual tutorials.',
      bullets: [
        'Screen-sharing or telephone-only walkthroughs based on your preference.',
        'Custom large-font printable cheat sheets provided for your specific devices.',
        'Safe practice environment where you cannot break anything or delete files.'
      ],
      icon: <GraduationCap className="w-8 h-8 text-teal-600" />
    },
    {
      number: '4',
      title: 'Active Scam Protection & Instant Screener',
      subtitle: 'Never wonder if an email, text, or phone call is real or fake.',
      description: 'Whenever you receive a suspicious text, delivery fee request, bank alert, or strange phone call, paste it into our Scam Checker or call us on 0800 888 2026 for an instant, plain-English safety verdict.',
      bullets: [
        'Instant analysis of HMRC, bank impersonation, and parcel delivery scams.',
        'Clear traffic-light verdicts (Safe / Caution / Dangerous) with exact next steps.',
        'Emergency telephone support if you accidentally clicked a suspicious link.'
      ],
      icon: <ShieldAlert className="w-8 h-8 text-teal-600" />
    },
    {
      number: '5',
      title: 'Encrypted Document Vault & Home Life Organizer',
      subtitle: 'Keep insurance policies, tradespeople, and emergency records organized.',
      description: 'Safely store essential paperwork—wills, power of attorney, insurance certificates, boiler service dates, and trusted plumber contacts—in bank-grade UK encrypted cloud storage.',
      bullets: [
        'Automatic reminder alerts for MOT renewals, boiler checks, and doctor visits.',
        'Clean photo uploads of letters, policies, and trusted trade contacts.',
        'Protected under UK GDPR and Data Protection Act 2018 standards.'
      ],
      icon: <FileText className="w-8 h-8 text-teal-600" />
    },
    {
      number: '6',
      title: 'Optional Family Reassurance & 24/7 Peace of Mind',
      subtitle: 'Keep adult children informed while maintaining your independence.',
      description: 'Optionally link trusted family members or caregivers to receive monthly reassurance digests and security alerts without compromising your personal privacy or financial autonomy.',
      bullets: [
        'Caregiver portal linking for adult children living elsewhere in the UK.',
        'Automated scam alert notifications sent to nominated family contacts.',
        'Ongoing Freephone helpline (0800 888 2026) open 8am–8pm daily.'
      ],
      icon: <Users className="w-8 h-8 text-teal-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-how-it-works-page">
      {/* =========================================================================
          HERO SECTION: HOW IT WORKS
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="how-it-works-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Simple 6-Step Guided Journey</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Getting started is <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">simple &amp; completely safe</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              No technical expertise needed. We guide you every step of the way with large text, spoken audio, and dedicated UK telephone support.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                id="btn-how-it-works-join-now"
                onClick={() => handleOpenJoinModal()}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Join EverEase Today</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                type="button"
                id="btn-how-it-works-freephone"
                onClick={() => {
                  window.location.href = 'tel:08008882026';
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <PhoneCall className="w-5 h-5 text-teal-400" />
                <span>Call: 0800 888 2026</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-teal-500/30 shadow-2xl bg-slate-800">
              <img
                src={howItWorksImg}
                alt="Clear onboarding guide on tablet next to a cup of English tea on a bright kitchen table"
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
                    Friendly Onboarding Call
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Our UK team offers a free phone walkthrough to ensure you feel 100% comfortable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Walkthrough Container */}
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 space-y-12">
        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.number}
              id={`step-card-${step.number}`}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs hover:border-teal-400 transition-all flex flex-col md:flex-row gap-6 sm:gap-8 items-start"
            >
              {/* Step number badge */}
              <div className="flex flex-row md:flex-col items-center gap-3 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center text-2xl font-black shadow-md">
                  {step.number}
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                  {step.icon}
                </div>
              </div>

              {/* Step details */}
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {step.title}
                  </h2>
                  <p className="text-sm sm:text-base font-extrabold text-teal-800 mt-1">
                    {step.subtitle}
                  </p>
                </div>

                <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                  {step.description}
                </p>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Key Highlights:
                  </span>
                  <ul className="space-y-2">
                    {step.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800 font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Direct Debit Reassurance Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-teal-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-teal-50 rounded-2xl text-teal-700">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Safe Payment &amp; Direct Debit Guarantee
              </h3>
              <p className="text-sm font-bold text-teal-800">
                Transparent UK billing with zero surprises
              </p>
            </div>
          </div>

          <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
            For maximum security, EverEase never takes card details over unverified phone calls or insecure forms. All subscriptions are collected via Stripe using the UK Direct Debit Guarantee scheme. You are always notified in writing prior to any charge, and you can cancel anytime with a single click or phone call.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-xl">
              <Check className="w-4 h-4 text-teal-600" />
              <span>Direct Debit Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-xl">
              <Check className="w-4 h-4 text-teal-600" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-xl">
              <Check className="w-4 h-4 text-teal-600" />
              <span>No Long-Term Contracts</span>
            </div>
          </div>
        </div>

        {/* Why EverEase Works Differently (Guarantees & Philosophy) */}
        <div className="space-y-8 pt-4" id="why-everease-works-differently">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>SERVICE EXCELLENCE &amp; GUARANTEES</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why EverEase Works Differently
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              We combine human patience with modern UK software standards to ensure our subscribers never feel rushed, judged, or locked into restrictive contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1: The 1-on-1 UK Tutoring Philosophy */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  The 1-on-1 UK Tutoring Philosophy
                </h3>
                <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                  When family members try to teach technology, frustration often goes both ways. Our UK-based senior care specialists are rigorously trained in empathetic communication. We never use confusing developer jargon, we provide large-font step-by-step notes, and we happily repeat explanations as many times as needed until digital confidence is achieved.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-teal-50/80 border border-teal-100 text-teal-900 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>100% UK-Based Specialist Team &bull; Zero Time Limits on Patient Learning</span>
              </div>
            </div>

            {/* Card 2: Family & Caregiver Portal Linking */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Family &amp; Caregiver Portal Linking
                </h3>
                <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                  For adult children living away from aging parents, worry is constant. Our SaaS platform allows subscribers to authorize trusted family members to view support activity. Caregivers can remotely check ticket statuses, monitor scam prevention alerts, and handle billing invoices without intruding on their loved one&rsquo;s personal privacy.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Shared Family Reassurance &bull; Automated Reassurance Digests</span>
              </div>
            </div>

            {/* Card 3: Stripe BACS Direct Debit & Banking Protection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Stripe BACS Direct Debit &amp; Banking Protection
                </h3>
                <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                  We partner with Stripe to provide industry-leading payment security for both Card and BACS Direct Debit. Direct Debit customers are covered by the UK Consumer Direct Debit Guarantee&mdash;receiving automated email notifications 3 working days before any collection and an immediate banking right to refund in the event of any billing discrepancy.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>UK Direct Debit Guarantee Protected &bull; 3-Day Advance Notice</span>
              </div>
            </div>

            {/* Card 4: 100% No-Hassle Cancellation & Refund Pledge */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  100% No-Hassle Cancellation &amp; Refund Pledge
                </h3>
                <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                  We believe services should be retained through merit, not contracts. Under UK Consumer Contracts Regulations, all subscribers enjoy a 14-day statutory cooling-off period for a 100% full refund if no tutoring services were utilized. You can pause your subscription during hospital visits or holidays for up to 3 months, or cancel anytime with 1 click.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-900 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>14-Day Statutory Money-Back Guarantee &bull; Zero Lock-In Contracts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-teal-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-xl text-teal-100 max-w-2xl mx-auto font-medium">
            Join now or call our friendly UK helpline for a free introductory conversation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleOpenJoinModal()}
              className="px-8 py-4 bg-white text-teal-900 hover:bg-teal-50 rounded-2xl font-black text-lg shadow-lg cursor-pointer transition-all border-0"
            >
              Choose a Membership Plan
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/contact');
              }}
              className="px-7 py-4 bg-teal-800 text-white hover:bg-teal-900 rounded-2xl font-bold text-lg border border-teal-500 cursor-pointer transition-all"
            >
              Speak to Our UK Team
            </button>
          </div>
        </div>
      </div>

      {/* Join Plan Registration & Stripe Invoicing Modal */}
      <JoinPlanModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        plan={selectedPlanForModal}
        navigate={navigate}
      />
    </div>
  );
};
