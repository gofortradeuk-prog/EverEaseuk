import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Lock, 
  CreditCard, 
  Building2,
  HelpCircle,
  Users,
  Award,
  Zap,
  Check,
  Globe,
  Shield,
  FileText,
  Lightbulb,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { getPricingPlans, DEFAULT_PLANS } from '../../lib/firestoreService';
import { PricingPlan } from '../../types';
import pricingHeroImg from '../../assets/images/pricing_peace_mind_1786863627905.jpg';
import { JoinPlanModal } from '../../components/public/JoinPlanModal';

interface PricingPageProps {
  navigate: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PricingPlan | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPlans = async () => {
      try {
        const fetched = await getPricingPlans();
        if (isMounted && fetched && fetched.length > 0) {
          // Merge with default values if firestore has older schemas
          const merged = fetched.map(p => {
            const def = DEFAULT_PLANS.find(d => d.id === p.id);
            return {
              ...def,
              ...p,
              bestFor: p.bestFor || def?.bestFor,
              responseTime: p.responseTime || def?.responseTime,
              supportHours: p.supportHours || def?.supportHours,
              delivery: p.delivery || def?.delivery,
              buttonLabel: p.buttonLabel || def?.buttonLabel,
              features: def?.features || p.features || []
            };
          });
          setPlans(merged);
        }
      } catch (err) {
        console.warn('Using default fallback plans:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectPlan = (planId: string, planName: string, price: number) => {
    const targetPlan = plans.find(p => p.id === planId) || {
      id: planId,
      name: planName,
      price: price,
      tagline: 'Comprehensive senior technology assistance',
      features: []
    };
    setSelectedPlanForModal(targetPlan);
    setIsJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-pricing-page">
      {/* =========================================================================
          HERO SECTION: PRICING
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="pricing-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Transparent UK Monthly Membership Pricing</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Simple, honest plans with <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">no hidden fees</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              Simple monthly subscriptions with secure payment options. Cancel or change your membership at any time.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                id="btn-pricing-join-now"
                onClick={() => {
                  handleSelectPlan('complete', 'Complete Plan', 55);
                }}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Join Most Popular (£55/mo)</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                type="button"
                id="btn-pricing-freephone"
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
                src={pricingHeroImg}
                alt="Retired British couple enjoying peace of mind at home with tablet in hand"
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
                    Direct Debit Guarantee
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Direct Debit payments are protected by the Direct Debit Guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pricing Cards Container */}
      <div className="w-full max-w-[1500px] mx-auto px-4 py-16 sm:py-20 space-y-12">
        
        {/* Notice Above Plans */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            All plans are billed monthly and renew automatically each month until cancelled. Prices are shown in GBP.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            There are no joining or cancellation fees. See our{' '}
            <button
              type="button"
              onClick={() => navigate('/legal?type=refund')}
              className="text-teal-700 font-bold underline hover:text-teal-800 cursor-pointer"
            >
              Refund &amp; Cancellation Policy
            </button>{' '}
            for full details.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isComplete = plan.id === 'complete' || plan.isPopular;
            const isFamily = plan.id === 'complete_family';
            
            // Dynamic labels based on specifications
            const buttonText = plan.buttonLabel || (isComplete ? 'Choose Plus' : isFamily ? 'Choose Family Care' : 'Choose Essential');

            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                className={`rounded-3xl p-6 sm:p-8 border-2 transition-all flex flex-col justify-between relative ${
                  isComplete
                    ? 'bg-[#064e3b] text-white border-teal-500 shadow-2xl scale-100 lg:-translate-y-2'
                    : 'bg-white text-slate-900 border-slate-200 shadow-sm hover:border-teal-400'
                }`}
              >
                {isComplete && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-2xl font-black ${isComplete ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                    <p className={`text-sm font-medium mt-1 ${isComplete ? 'text-teal-200' : 'text-slate-600'}`}>{plan.tagline}</p>
                  </div>

                  <div className={`rounded-2xl p-4 border ${isComplete ? 'bg-emerald-950/70 border-emerald-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl sm:text-5xl font-black ${isComplete ? 'text-white' : 'text-slate-900'}`}>£{plan.price}</span>
                      <span className={`font-bold text-base ${isComplete ? 'text-teal-200' : 'text-slate-600'}`}>/month</span>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${isComplete ? 'text-teal-300' : 'text-teal-800'}`}>
                      Recurring monthly payment • Cancel anytime
                    </p>
                  </div>

                  {/* Feature Checkmarks List */}
                  <div className="space-y-3">
                    <p className={`text-[11px] font-black tracking-wider uppercase ${isComplete ? 'text-teal-200' : 'text-slate-500'}`}>
                      INCLUDED IN THIS PLAN:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className={`flex items-start gap-2.5 text-xs sm:text-sm font-medium leading-relaxed ${isComplete ? 'text-emerald-50' : 'text-slate-700'}`}>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isComplete ? 'text-teal-300' : 'text-teal-600'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best for & Response Details Box */}
                  <div className={`rounded-xl p-3.5 border text-xs space-y-2.5 ${
                    isComplete 
                      ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-100' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {plan.bestFor && (
                      <p className="font-semibold leading-relaxed">
                        <strong className={isComplete ? 'text-white font-bold' : 'text-slate-900 font-bold'}>Best for:</strong> {plan.bestFor.replace(/^Best for:\s*/i, '')}
                      </p>
                    )}

                    <div className={`pt-2 border-t space-y-1.5 ${isComplete ? 'border-emerald-800/60' : 'border-slate-200/80'}`}>
                      {plan.responseTime && (
                        <div className="flex items-center justify-between gap-2">
                          <span className={isComplete ? 'text-emerald-300' : 'text-slate-500'}>Response Time:</span>
                          <span className={`font-bold ${isComplete ? 'text-white' : 'text-slate-900'}`}>{plan.responseTime}</span>
                        </div>
                      )}
                      {plan.supportHours && (
                        <div className="flex items-center justify-between gap-2">
                          <span className={isComplete ? 'text-emerald-300' : 'text-slate-500'}>Support Hours:</span>
                          <span className={`font-bold ${isComplete ? 'text-white' : 'text-slate-900'}`}>{plan.supportHours}</span>
                        </div>
                      )}
                      {plan.delivery && (
                        <div className="flex items-center justify-between gap-2">
                          <span className={isComplete ? 'text-emerald-300' : 'text-slate-500'}>Delivery:</span>
                          <span className={`font-bold ${isComplete ? 'text-white' : 'text-slate-900'}`}>{plan.delivery}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100/20">
                  <button
                    type="button"
                    id={`btn-select-plan-${plan.id}`}
                    onClick={() => handleSelectPlan(plan.id, plan.name, plan.price)}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isComplete
                        ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-lg shadow-teal-900/30'
                        : 'border-2 border-teal-600 text-teal-700 hover:bg-teal-50 bg-white'
                    }`}
                  >
                    <span>{buttonText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Compliance Badges Pill Banner */}
        <div className="flex justify-center -mt-6">
          <div className="bg-slate-900 text-slate-200 px-6 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-3 sm:gap-5 flex-wrap justify-center border border-slate-700/60 shadow-lg">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure payments</span>
            </span>
            <span className="text-slate-600 font-normal">•</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Globe className="w-3.5 h-3.5" />
              <span>SSL encrypted</span>
            </span>
            <span className="text-slate-600 font-normal">•</span>
            <span className="flex items-center gap-1.5 text-teal-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>UK-based support</span>
            </span>
            <span className="text-slate-600 font-normal">•</span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <Shield className="w-3.5 h-3.5" />
              <span>GDPR compliant</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            PAYMENT METHODS & OPTIONS SECTION
            ========================================================================= */}
        <div className="space-y-8 pt-6" id="payment-methods-section">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Payment Methods &amp; Options
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              We offer secure, flexible, and trusted payment options designed for peace of mind. Choose the payment method that suits you best.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Pay by BACS Direct Debit */}
            <div className="bg-white rounded-3xl border-2 border-teal-500 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
              {/* Recommended Top-Right Ribbon */}
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl border-l border-b border-amber-300 shadow-xs">
                RECOMMENDED - BEST FOR MONTHLY MEMBERSHIP
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 pt-2 sm:pt-0">
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Pay by BACS Direct Debit
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                        MOST POPULAR
                      </span>
                    </div>
                    <p className="text-xs font-bold text-indigo-600 tracking-wider uppercase mt-0.5">
                      POWERED BY STRIPE
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Payments are collected securely through Stripe using BACS Direct Debit.</strong> You will receive the required Direct Debit notification before collection.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Debit Guarantee:</strong> Your Direct Debit payments are protected by the BACS Direct Debit Guarantee. If a payment is taken incorrectly, you are entitled to a refund from your bank under the Guarantee.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Advance notification before collections:</strong> You will always receive notification prior to any debit being made from your account.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Easy cancellation:</strong> Cancel your Direct Debit mandate at any time directly through your bank or our member dashboard.</span>
                  </li>
                </ul>

                {/* Sub-quote Highlight Box */}
                <div className="p-4 bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl text-xs text-teal-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-teal-900">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Why We Recommend BACS Direct Debit:</span>
                  </p>
                  <p className="italic text-teal-800 leading-relaxed">
                    "BACS Direct Debit helps us reduce payment processing costs, allowing us to keep our membership prices affordable while providing dedicated support to seniors."
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Pay by Credit / Debit Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50/70 to-transparent pointer-events-none rounded-tr-3xl" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Pay by Credit / Debit Card
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 tracking-wider uppercase mt-0.5">
                      POWERED BY STRIPE
                    </p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Secure payments powered by Stripe</strong>, a world-recognized leader in bank-grade online payment processing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Supports all major payment cards</strong> including Visa, Mastercard, Maestro, and American Express.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>256-bit SSL encryption:</strong> Your card details are securely encrypted and never stored on EverEase servers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Instant automated confirmation:</strong> Immediate digital receipts and subscription activation upon payment processing.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Note Banner: Invoices & Payment Links */}
          <div className="bg-[#064e3b] text-white rounded-2xl p-5 sm:p-6 shadow-md flex items-start gap-4 border border-teal-600">
            <div className="p-2.5 bg-teal-500/20 text-teal-300 rounded-xl shrink-0 mt-0.5">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base sm:text-lg text-white">
                Note: Invoices &amp; Payment Links
              </h4>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                We clearly understand that every customer has different payment preferences. <strong>We will send the invoice along with the payment link</strong> directly to your registered email address, and you can make the payment as per your desire using whichever method is most convenient for you!
              </p>
            </div>
          </div>

          {/* Underneath Payment Section Guarantee Notice */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Direct Debit payments are collected through Stripe and are protected by the Direct Debit Guarantee.
            </p>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM INFORMATION & SUPPORT STANDARDS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Box 1: Important Membership Information */}
          <div className="bg-[#ecfeff] border border-[#a5f3fc] rounded-3xl p-6 sm:p-8 space-y-4 text-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-900 font-bold text-base">
                <HelpCircle className="w-5 h-5 text-cyan-600 shrink-0" />
                <span>Important Membership Information</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-700 font-black">•</span>
                  <span>Support access, response times, and service scope vary by membership plan. Please review our Service Level Agreement and Terms &amp; Conditions for full details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-700 font-black">•</span>
                  <span>All plans are billed monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-700 font-black">•</span>
                  <span>Support is provided during stated support hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-700 font-black">•</span>
                  <span>Service scope depends on the chosen plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-700 font-black">•</span>
                  <span>Cancellation is available in accordance with our policy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Box 2: Our Support Standards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-base text-slate-900">
                Our Support Standards
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Support available Monday to Friday, 9:00 AM – 5:30 PM (UK Time). Support requests received outside business hours will normally be reviewed on the next working day</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Friendly support via phone, WhatsApp, and email</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Response targets vary by membership plan</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Support is provided for general digital learning and everyday online tasks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>EverEase is a non-medical, non-emergency support service.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 italic leading-relaxed">
              "Support is provided during stated business hours and subject to the scope of your selected plan. Response times vary by membership plan and issue type. Please review our{' '}
              <button 
                type="button" 
                onClick={() => navigate('/legal?type=sla')} 
                className="text-teal-700 font-bold underline hover:text-teal-800 cursor-pointer"
              >
                Service Level Agreement
              </button>{' '}
              for full details."
            </div>
          </div>

        </div>

        {/* Freephone Help Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Have questions about which plan is right for you?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Call our friendly British support desk on Freephone <strong className="text-teal-300 font-black">0800 888 2026</strong> (9:00 AM – 5:30 PM daily).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = 'tel:08008882026';
            }}
            className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-base shrink-0 shadow-lg cursor-pointer transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call 0800 888 2026</span>
          </button>
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
