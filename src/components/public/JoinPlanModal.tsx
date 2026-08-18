import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Building2, 
  Mail, 
  PhoneCall, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react';
import { PricingPlan } from '../../types';

interface JoinPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  navigate: (route: string) => void;
}

export const JoinPlanModal: React.FC<JoinPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  navigate,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bacs' | 'card'>('bacs');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    customerName: string;
    customerEmail: string;
    tempPassword: string;
    invoiceNumber: string;
    invoiceAmount: number;
    paymentLink: string;
    planName: string;
    paymentMethod: string;
  } | null>(null);

  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen || !plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please confirm that you agree to the Terms & Conditions and Refund Policy.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique credentials and official Stripe Invoice simulation
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const uniquePass = `EE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const invNum = `INV-2026-EE-${randomSuffix}`;
      const checkoutUrl = `https://checkout.stripe.com/c/pay/cs_live_everease_${randomSuffix}?plan=${plan.id}&method=${paymentMethod}`;

      setSubmissionSuccess({
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        tempPassword: uniquePass,
        invoiceNumber: invNum,
        invoiceAmount: plan.price,
        paymentLink: checkoutUrl,
        planName: plan.name,
        paymentMethod: paymentMethod === 'bacs' ? 'UK Direct Debit' : 'Credit / Debit Card'
      });
      setIsSubmitting(false);
    }, 700);
  };

  const handleCopyPassword = () => {
    if (submissionSuccess) {
      navigator.clipboard.writeText(submissionSuccess.tempPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-6 text-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-plan-modal-title"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 id="join-plan-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Join {plan.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Secure registration &bull; Instant password &amp; Stripe invoice delivery
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {submissionSuccess ? (
            /* =========================================================================
               POST-SUBMISSION SUCCESS STATE
               ========================================================================= */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Registration Successful!
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  Welcome to EverEase, <strong>{submissionSuccess.customerName}</strong>. Your account has been registered. Please complete your payment setup on Stripe to activate your full membership:
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 font-bold text-sm">
                  {submissionSuccess.customerEmail}
                </div>
              </div>

              {/* Payment Action & Credentials Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                {/* Secure Payment Link Action (Prominent First) */}
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Complete Payment on Stripe to Activate Membership</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Click the button below to complete your {submissionSuccess.paymentMethod} setup on Stripe&rsquo;s official secure checkout. Your membership activates immediately upon payment confirmation.
                  </p>
                  <a
                    href={submissionSuccess.paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center no-underline"
                  >
                    <span>Continue to Stripe Secure Payment — &pound;{submissionSuccess.invoiceAmount}/month</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span>Account Credentials &amp; Confirmation</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Registered
                  </span>
                </div>

                {/* Generated Password Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Temporary Account Password:</span>
                  <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-lg font-mono text-base font-bold">
                    <span className="tracking-widest text-teal-300">{submissionSuccess.tempPassword}</span>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-md transition-colors flex items-center gap-1.5 cursor-pointer border-0"
                    >
                      {copiedPass ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    You can use this password to sign in after completing payment on Stripe.
                  </p>
                </div>

                {/* Order Details */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subscription Plan:</span>
                    <span className="font-bold text-slate-900">{submissionSuccess.planName} &bull; &pound;{submissionSuccess.invoiceAmount}.00 / month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Payment Method:</span>
                    <span className="font-bold text-teal-800">{submissionSuccess.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Membership Status:</span>
                    <span className="font-bold text-amber-700">Awaiting Stripe Confirmation</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/auth?mode=signin');
                  }}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Proceed to EverEase Member Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-transparent hover:bg-slate-100 text-slate-600 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer border-0"
                >
                  Close &amp; Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================================
               MAIN REGISTRATION FORM (MATCHING ee4.jpg SCREENSHOT)
               ========================================================================= */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Informational Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Please fill in your details below. After submitting this form, your software profile will be activated, and an official Stripe Invoice and welcome email with login credentials will be sent to your email.
              </p>

              {/* Selected Plan Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-800">
                    SELECTED PLAN
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    {plan.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    PRICE
                  </span>
                  <p className="text-base sm:text-lg font-black text-teal-700">
                    &pound;{plan.price}.00<span className="text-xs font-semibold text-slate-600">/mo</span>
                  </p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yash Kr"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 07700 900077"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 High Street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* City & Postcode (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="London"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                      Postcode
                    </label>
                    <input
                      type="text"
                      placeholder="SW1A 1AA"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-900">
                  Payment Method &amp; Setup Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* UK Direct Debit Tile */}
                  <div
                    onClick={() => setPaymentMethod('bacs')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'bacs'
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-900">
                          <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                          <span>UK Direct Debit</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white font-extrabold text-[10px] uppercase">
                          RECOMMENDED
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-teal-800 block">
                        Best for monthly membership
                      </span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Payments are collected securely through Stripe using UK Direct Debit. You will receive the required Direct Debit notification before collection.
                      </p>
                    </div>
                  </div>

                  {/* Card Tile */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'card'
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-900">
                        <CreditCard className="w-4 h-4 text-slate-700 shrink-0" />
                        <span>Credit / Debit Card</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Standard Card Subscription
                      </span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Instant subscription setup via official Stripe secure payment checkout.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Summary Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <span>Billing Summary</span>
                  <span className="text-emerald-700 font-extrabold">&pound;{plan.price}.00 / month</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="font-semibold text-slate-500">Plan &amp; Rate:</span>
                    <p className="font-bold text-slate-800">{plan.name} (&pound;{plan.price}/month)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Payment Method:</span>
                    <p className="font-bold text-slate-800">{paymentMethod === 'bacs' ? 'UK Direct Debit' : 'Credit / Debit Card'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Account Activation:</span>
                    <p className="font-bold text-emerald-800">Activated after payment confirmation</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Cancel anytime:</span>
                    <p className="font-bold text-slate-800">Yes (0 Days Lock-in)</p>
                  </div>
                </div>
              </div>

              {/* Terms & Guarantees Callout */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <p>
                  <strong>Subscription Terms:</strong> You are setting up a monthly membership subscription. You will continue to Stripe&rsquo;s secure checkout to complete payment or mandate setup.
                </p>
                <p>
                  <strong>Direct Debit Guarantee:</strong> Your Direct Debit payments are protected by the UK Direct Debit Guarantee. If a payment is taken incorrectly, you are entitled to a refund from your bank under the Guarantee.
                </p>
                <p>
                  <strong>Cancellation Policy:</strong> You can cancel your membership at any time from your account dashboard or by contacting <span className="font-semibold text-slate-800">support@everease.co.uk</span>.
                </p>
              </div>

              {/* Checkbox Agreement */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="checkbox-agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <label htmlFor="checkbox-agree-terms" className="text-xs text-slate-700 leading-normal cursor-pointer select-none">
                  I authorize the membership registration and agree to the{' '}
                  <span onClick={() => { onClose(); navigate('/legal/terms'); }} className="text-teal-700 underline font-semibold cursor-pointer">Terms &amp; Conditions</span>,{' '}
                  <span onClick={() => { onClose(); navigate('/legal/privacy'); }} className="text-teal-700 underline font-semibold cursor-pointer">Privacy Policy</span>, and{' '}
                  <span onClick={() => { onClose(); navigate('/legal/refund'); }} className="text-teal-700 underline font-semibold cursor-pointer">Refund Policy</span>.
                </label>
              </div>

              {/* Error Notification */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Registration &amp; Redirecting...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-200" />
                      <span>Complete Registration &amp; Continue to Stripe — &pound;{plan.price}/month</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Footer Security Badges */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] text-slate-500 flex-wrap pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" /> Secure payments
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-teal-600" /> SSL encrypted
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-blue-600" /> UK-based support
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-600" /> GDPR compliant
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
