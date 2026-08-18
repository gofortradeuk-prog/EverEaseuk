import React from 'react';
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
  Check
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import howItWorksImg from '../../assets/images/how_it_works_steps_1786863616482.jpg';

interface HowItWorksPageProps {
  navigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();

  const steps = [
    {
      number: '1',
      title: 'Sign Up & Choose a Plan',
      subtitle: 'Simple, transparent UK membership with no long contracts.',
      description: 'Select your preferred EverEase plan. Registration takes only two minutes in plain English with large text.',
      bullets: [
        'No complicated tech setup or confusing questions.',
        'Immediate confirmation sent to your email or SMS.',
        'Protected by the UK Direct Debit Guarantee via Stripe.'
      ],
      icon: <CreditCard className="w-8 h-8 text-teal-600" />
    },
    {
      number: '2',
      title: 'Set Up in Minutes (With Family If Helpful)',
      subtitle: 'Tailor your preferences and optionally invite a trusted helper.',
      description: 'Adjust your font size, turn on high-contrast mode, or invite a son, daughter, or carer using a simple 6-digit code or SMS link.',
      bullets: [
        'Choose your preferred reading size and voice audio options.',
        'You decide what (if anything) family members can see.',
        'Optional free welcome phone call with our UK support team.'
      ],
      icon: <HeartHandshake className="w-8 h-8 text-teal-600" />
    },
    {
      number: '3',
      title: 'Use Everyday Safeguards & Learning',
      subtitle: 'Scam checks, reminders, documents, and guides at your fingertips.',
      description: 'Whenever you receive an odd text message or need to check an appointment, simply open EverEase for an instant, clear answer.',
      bullets: [
        'Check suspicious messages in seconds with clear traffic-light advice.',
        'Never miss MOTs, boiler services, or hospital appointments.',
        'Store important insurance policies safely in your encrypted vault.'
      ],
      icon: <ShieldAlert className="w-8 h-8 text-teal-600" />
    },
    {
      number: '4',
      title: 'Ongoing Telephone & Portal Support',
      subtitle: 'Never feel stuck or alone when technology changes.',
      description: 'Call our Freephone line or request assistance directly through the portal whenever you encounter a new update, device, or question.',
      bullets: [
        'Freephone 0800 888 2026 open 8am–8pm daily.',
        'Patient British staff who explain steps without rushing.',
        'Monthly contract that you can cancel or change anytime.'
      ],
      icon: <PhoneCall className="w-8 h-8 text-teal-600" />
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
              <span>Simple 4-Step Process</span>
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
                onClick={() => {
                  navigate('/auth?mode=signup');
                }}
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
              onClick={() => {
                navigate('/pricing');
              }}
              className="px-8 py-4 bg-white text-teal-900 hover:bg-teal-50 rounded-2xl font-black text-lg shadow-lg cursor-pointer transition-all"
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
    </div>
  );
};
