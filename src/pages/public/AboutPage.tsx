import React from 'react';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  Award,
  Lock,
  Building,
  Check,
  Smile,
  Laptop
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import aboutTeamImg from '../../assets/images/about_team_seniors_1786863588574.jpg';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-about-page">
      {/* =========================================================================
          HERO SECTION: ABOUT EVEREASE
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="about-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Our UK Mission &amp; Purpose</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Empowering older adults with <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">patient digital confidence</span> and total safety.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              We founded EverEase to ensure technology bridges families together rather than causing anxiety, loneliness, or fear of fraud.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                id="btn-about-join-now"
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
                id="btn-about-call-us"
                onClick={() => {
                  navigate('/contact');
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <PhoneCall className="w-5 h-5 text-teal-400" />
                <span>Freephone: 0800 888 2026</span>
              </button>
            </div>

            {/* Trust Metrics Pill Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-700/80">
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black text-teal-300">12,000+</span>
                <p className="text-xs text-slate-300 font-medium">Seniors Supported</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black text-teal-300">100%</span>
                <p className="text-xs text-slate-300 font-medium">UK-Based Team</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black text-teal-300">0</span>
                <p className="text-xs text-slate-300 font-medium">Ads or Data Selling</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-teal-500/30 shadow-2xl bg-slate-800">
              <img
                src={aboutTeamImg}
                alt="UK seniors and tech mentors learning happily in a bright community space"
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
                    Patient &amp; Dignified Guidance
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    No condescension, no rushing, and no confusing acronyms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Story & Values Body */}
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 space-y-12">
        {/* 1. Company Story Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
              <Building className="w-7 h-7 text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                Our Company Story
              </h2>
              <p className="text-sm font-bold text-teal-800">
                Founded in the UK to bridge the digital divide for older generations.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
            <p>
              EverEase was founded with a single driving principle: that modern technology should serve, protect, and empower older generations rather than alienate them. In an era where essential public services, banks, energy providers, and the NHS are rapidly shifting to digital-first models, millions of capable UK seniors are faced with unnecessarily complex interfaces, aggressive fraud campaigns, and patronising customer support.
            </p>

            <p>
              We set out to design a comprehensive digital learning and safeguarding software platform that pairs large-type, high-contrast usability with patient human assistance. Whether evaluating a suspicious text message, remembering boiler service deadlines, or securely making a FaceTime call to grandchildren, EverEase ensures every interaction is clear, calm, and dignified.
            </p>
          </div>
        </section>

        {/* 2. Why We Built This Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-8">
          <div className="space-y-2">
            <span className="text-teal-400 font-extrabold uppercase text-xs tracking-wider">
              Purpose-Driven Design
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Why We Built EverEase
            </h2>
            <p className="text-slate-300 text-base sm:text-lg font-medium">
              Three core observations that shaped our software platform:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white">
                Scams Are Becoming Ruthless
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Criminal gangs exploit urgency with fake Royal Mail, NHS, and HMRC messages. Seniors need an instant, non-judgmental second opinion before clicking.
              </p>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white">
                Jargon Causes Anxiety
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Mainstream apps use tiny fonts, cryptic icons, and confusing tech terms. We write in plain English with large buttons and spoken assistance.
              </p>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white">
                Families Want To Help
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sons, daughters, and carers want peace of mind, but seniors cherish independence. Our granular permissions let both sides collaborate with mutual respect.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Team & Values Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
              Our Core Values &amp; Team Standards
            </h2>
            <p className="text-slate-600 font-medium text-base">
              Guided by strict safeguarding and ethical care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">Dignity Without Compromise</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                We treat all customers with utmost respect. We never assume a lack of capability, but rather remove the bad design practices that cause confusion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">Absolute Data Privacy</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                We do not monetize data. No advertisers, no data brokers, and no tracking cookies. EverEase is funded purely by clear subscription fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">Human UK Support</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Real UK advisors ready on the phone. When you call our Freephone helpline, you speak with a patient human based here in Britain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">Continuous Accessibility</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Every screen is tested with older adults, featuring adjustable typography, high contrast modes, and spoken audio screen readers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <div className="bg-teal-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md">
          <h2 className="text-2xl sm:text-4xl font-black">
            Ready to experience technology with total peace of mind?
          </h2>
          <p className="text-base sm:text-xl text-teal-100 max-w-2xl mx-auto font-medium">
            Join thousands of older adults and families who trust EverEase every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                navigate('/pricing');
              }}
              className="px-8 py-4 bg-white text-teal-900 hover:bg-teal-50 rounded-2xl font-black text-lg shadow-lg cursor-pointer transition-all"
            >
              View SaaS Plans
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/contact');
              }}
              className="px-7 py-4 bg-teal-800 text-white hover:bg-teal-900 rounded-2xl font-bold text-lg border border-teal-500 cursor-pointer transition-all"
            >
              Contact Our UK Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
