import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Users, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  LogIn, 
  UserCheck, 
  Copy, 
  Check, 
  CreditCard, 
  Building, 
  ExternalLink, 
  FileText, 
  Printer, 
  AlertCircle, 
  ShieldAlert,
  Send,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { UserRole, OnboardingInvoiceResult } from '../types';

interface AuthPageProps {
  navigate?: (route: string) => void;
  initialMode?: 'signin' | 'signup';
  initialPlan?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  navigate, 
  initialMode = 'signin', 
  initialPlan = 'complete' 
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, quickLoginDemo, error, clearError } = useAuth();
  const { speakText } = useAccessibility();

  // Primary mode: 'signin' or 'get_started' (replaces traditional direct signup)
  const [mode, setMode] = useState<'signin' | 'get_started'>(initialMode === 'signin' ? 'signin' : 'get_started');
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'complete');
  const [signupTarget, setSignupTarget] = useState<'myself' | 'family'>('myself');
  
  // Registration Form Fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Sign-in fields
  const [loginEmailOrId, setLoginEmailOrId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [onboardingSuccess, setOnboardingSuccess] = useState<OnboardingInvoiceResult | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const planOptions = [
    {
      id: 'essentials',
      name: 'Essentials Plan',
      price: 45,
      tagline: 'Scam Protection, 1 Family Account & Dedicated UK Support',
    },
    {
      id: 'complete',
      name: 'Complete Plan',
      price: 55,
      tagline: 'All 7 Modules, Vault, Up to 3 Family Accounts & Direct Debit Protection',
      popular: true,
    },
    {
      id: 'complete_family',
      name: 'Complete + Family Plan',
      price: 65,
      tagline: 'Unlimited Family Accounts, Priority Fraud Desk & Home Manager',
    },
  ];

  // Handle "Get Started" submission (Generates Unique ID, Temp Pass, & Sends Stripe Invoice)
  const handleGetStartedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalMessage(null);

    if (!displayName.trim()) {
      setLocalMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setLocalMessage('Please enter a valid email address where the invoice and payment link will be sent.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/billing/create-onboarding-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          planId: selectedPlan,
          signupTarget,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate membership onboarding.');
      }

      const data: OnboardingInvoiceResult = await response.json();
      setOnboardingSuccess(data);
    } catch (err: any) {
      console.error('Error during Get Started onboarding:', err);
      setLocalMessage(err.message || 'Unable to complete registration. Please try again or call our Freephone line.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Standard Sign-In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalMessage(null);

    if (!loginEmailOrId.trim() || !loginPassword.trim()) {
      setLocalMessage('Please enter your email address (or Unique ID Code) and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(loginEmailOrId.trim(), loginPassword);
      if (navigate) {
        const lower = loginEmailOrId.toLowerCase();
        if (lower.includes('admin') || lower.includes('support') || lower.includes('finance') || lower.includes('super')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      // Auth context sets error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fast login right after onboarding completion
  const handleImmediateLoginWithTempCredentials = async () => {
    if (!onboardingSuccess) return;
    setIsSubmitting(true);
    try {
      const initialRole: UserRole = signupTarget === 'myself' ? 'senior' : 'family_carer';
      try {
        await signUpWithEmail(
          onboardingSuccess.customer.email,
          onboardingSuccess.tempPassword,
          onboardingSuccess.customer.name,
          initialRole
        );
      } catch (signUpErr: any) {
        // If already exists, sign in
        await signInWithEmail(
          onboardingSuccess.customer.email,
          onboardingSuccess.tempPassword
        );
      }
      if (navigate) navigate('/dashboard');
    } catch (err: any) {
      console.warn('Could not auto-login with temp credentials, falling back to sign in view:', err);
      setMode('signin');
      setLoginEmailOrId(onboardingSuccess.customer.email);
      setLoginPassword(onboardingSuccess.tempPassword);
      setOnboardingSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2500);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsSubmitting(true);
    try {
      const initialRole: UserRole = signupTarget === 'myself' ? 'senior' : 'family_carer';
      await signInWithGoogle(initialRole);
      if (navigate) navigate('/dashboard');
    } catch (err) {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    clearError();
    setIsSubmitting(true);
    try {
      await quickLoginDemo(role);
      if (navigate) {
        if (['support_admin', 'finance_admin', 'super_admin'].includes(role)) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-10 px-4" id="auth-container">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* Back to Public Website link */}
        {navigate && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                navigate('/');
              }}
              className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700 hover:text-emerald-800 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
              id="btn-back-to-website"
            >
              ← Back to EverEase Website
            </button>
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="text-xs font-bold text-emerald-800 underline"
            >
              View Membership Pricing
            </button>
          </div>
        )}

        {/* Brand Greeting */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-600 text-white shadow-sm border border-emerald-800/30 mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            EverEase <span className="text-emerald-700">UK</span>
          </h1>
          <p className="text-base md:text-lg font-bold text-slate-600">
            Simple, safe technology support for UK seniors & families
          </p>
        </div>

        {/* Success Confirmation Modal / Screen after "Get Started" */}
        {onboardingSuccess ? (
          <div className="bg-white rounded-3xl border-3 border-emerald-600 p-6 md:p-8 shadow-xl space-y-6 animate-in fade-in zoom-in duration-300" id="onboarding-success-card">
            {/* Header */}
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mb-1">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome to EverEase!
              </h2>
              <p className="text-base text-slate-600 font-semibold max-w-lg mx-auto">
                Your account has been created and your official Stripe invoice has been sent to{' '}
                <strong className="text-slate-900 underline">{onboardingSuccess.customer.email}</strong>.
              </p>
            </div>

            {/* Unique ID & Temp Password Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                Your New Member Credentials
              </div>

              {/* Unique ID Code */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Your Unique ID Code:</span>
                  <span className="text-2xl font-black text-emerald-800 tracking-wider font-mono">
                    {onboardingSuccess.uniqueMemberId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(onboardingSuccess.uniqueMemberId, 'id')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-sm font-bold transition-colors"
                  id="btn-copy-unique-id"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-700" />}
                  <span>{copiedId ? 'Copied!' : 'Copy Unique ID'}</span>
                </button>
              </div>

              {/* Temporary Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Temporary Access Password:</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {onboardingSuccess.tempPassword}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    (You can change this anytime in your account settings)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(onboardingSuccess.tempPassword, 'pass')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-sm font-bold transition-colors"
                  id="btn-copy-temp-password"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                  <span>{copiedPass ? 'Copied!' : 'Copy Password'}</span>
                </button>
              </div>
            </div>

            {/* Stripe Payment & Activation Card */}
            <div className="bg-emerald-50/80 rounded-2xl p-5 border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-emerald-950">
                    Complete Payment on Stripe to Activate
                  </h3>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300">
                  {onboardingSuccess.invoiceNumber}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <p>
                  <strong>Membership:</strong> {onboardingSuccess.plan.name} (£{onboardingSuccess.plan.price}/month)
                </p>
                <p>
                  <strong>Registration Email:</strong> {onboardingSuccess.customer.email}
                </p>
                <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-semibold">
                  ⏳ <strong>Activation Note:</strong> Your paid membership access activates automatically once your payment or Direct Debit mandate is confirmed on Stripe.
                </p>
              </div>

              {/* Supported Payment Methods Callout */}
              <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-2">
                <span className="text-xs font-extrabold uppercase text-slate-600 block">
                  Available Payment Options on Stripe:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Building className="w-4 h-4 text-teal-700" />
                    <span>UK Direct Debit</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <CreditCard className="w-4 h-4 text-purple-700" />
                    <span>Credit / Debit Card</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold pt-1">
                  ✓ Direct Debit payments are collected through Stripe and are protected by the UK Direct Debit Guarantee.
                </p>
              </div>

              {/* Action: Open Stripe Payment Link */}
              <div className="pt-2">
                <a
                  href={onboardingSuccess.hostedInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                  id="btn-open-stripe-invoice"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Continue to Stripe Secure Payment — £{onboardingSuccess.plan.price}/month</span>
                </a>
              </div>
            </div>

            {/* Direct Login Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleImmediateLoginWithTempCredentials}
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                id="btn-enter-dashboard-now"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 text-emerald-400" />
                    <span>Log In to Your Member Dashboard Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print This Confirmation For Your Records</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Auth Mode Toggle Tabs (Large, minimum 48px tap height) */}
            <div className="bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/80 grid grid-cols-2 gap-2 shadow-2xs" id="auth-tabs">
              <button
                type="button"
                onClick={() => {
                  setMode('get_started');
                  clearError();
                  setLocalMessage(null);
                }}
                className={`py-3 px-4 rounded-xl font-black text-base md:text-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'get_started'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
                id="tab-get-started-btn"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Get Started</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearError();
                  setLocalMessage(null);
                }}
                className={`py-3 px-4 rounded-xl font-black text-base md:text-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
                id="tab-sign-in-btn"
              >
                <LogIn className="w-4 h-4 text-slate-600" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Main Form Box */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
              {/* MODE 1: GET STARTED (Unique ID Code + Temp Password + Stripe Invoice with BACS/Card) */}
              {mode === 'get_started' && (
                <form onSubmit={handleGetStartedSubmit} className="space-y-6" id="get-started-form">
                  {/* Notice: No Direct Payment Checkout on Website */}
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 text-slate-900 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-black text-sm uppercase tracking-wider">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>Secure Payment via Stripe</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      For your financial security, <strong>we never collect or store credit card or bank details directly on our website</strong>. When you tap <em>"Continue to Secure Payment"</em>, you will proceed to our secure Stripe checkout to complete your <strong>UK Direct Debit</strong> or <strong>Card</strong> payment.
                    </p>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-3">
                    <label className="block text-base md:text-lg font-black text-slate-900">
                      1. Choose Your Membership Plan:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {planOptions.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-400/40 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                            }`}
                            id={`plan-choice-${plan.id}`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900 text-sm">{plan.name}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                              </div>
                              <p className="text-2xl font-black text-slate-900 mt-1">
                                £{plan.price}
                                <span className="text-xs text-slate-500 font-semibold">/mo</span>
                              </p>
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium mt-2 leading-tight">
                              {plan.tagline}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role Selection (Myself vs Family Carer) */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-base md:text-lg font-black text-slate-900">
                      2. Who is this membership for?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSignupTarget('myself')}
                        className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                          signupTarget === 'myself'
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-400/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                        id="signup-role-senior-btn"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">🧓</span>
                          {signupTarget === 'myself' && <CheckCircle2 className="w-4 h-4 text-emerald-600 font-bold" />}
                        </div>
                        <div className="mt-2">
                          <span className="font-extrabold text-slate-900 block text-base">For Myself</span>
                          <span className="text-xs text-slate-500 font-medium">I am a senior citizen (Age 65+)</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignupTarget('family')}
                        className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                          signupTarget === 'family'
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                        id="signup-role-carer-btn"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">👨‍👩‍👧</span>
                          {signupTarget === 'family' && <CheckCircle2 className="w-4 h-4 text-blue-600 font-bold" />}
                        </div>
                        <div className="mt-2">
                          <span className="font-extrabold text-slate-900 block text-base">Family Member / Carer</span>
                          <span className="text-xs text-slate-500 font-medium">Supporting an older relative</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <label className="block text-base md:text-lg font-black text-slate-900">
                      3. Your Contact Details:
                    </label>

                    {(error || localMessage) && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold text-sm flex items-start gap-2 shadow-2xs">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{error || localMessage}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-800" htmlFor="name-input">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          id="name-input"
                          type="text"
                          required
                          placeholder="e.g. Margaret Davies"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-800" htmlFor="email-input">
                        Email Address <span className="text-rose-600">* (Invoice &amp; payment link will be sent here)</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          id="email-input"
                          type="email"
                          required
                          placeholder="e.g. margaret.davies@example.co.uk"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-800" htmlFor="phone-input">
                          UK Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="phone-input"
                          type="tel"
                          placeholder="e.g. 07700 900123"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-800" htmlFor="postcode-input">
                          UK Postcode / Town <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="postcode-input"
                          type="text"
                          placeholder="e.g. SW1A 1AA, London"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission CTA */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-lg md:text-xl shadow-md border border-emerald-900/30 transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-amber-300 min-h-[56px] cursor-pointer"
                      id="get-started-submit-btn"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Preparing Secure Checkout...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Continue to Secure Payment — £{planOptions.find(p => p.id === selectedPlan)?.price || 55}/month</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium text-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Secure registration • Payments collected via UK Direct Debit or Card on Stripe</span>
                    </div>
                  </div>
                </form>
              )}

              {/* MODE 2: SIGN IN (Existing Members or with Temp Password / Unique ID) */}
              {mode === 'signin' && (
                <div className="space-y-6" id="signin-section">
                  {/* Google Quick Sign-In */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 font-black text-base md:text-lg text-slate-800 transition-colors shadow-2xs focus:ring-4 focus:ring-amber-300 min-h-[52px] cursor-pointer"
                    id="google-signin-btn"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-[1px] bg-slate-200 flex-1" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Or with email &amp; password
                    </span>
                    <div className="h-[1px] bg-slate-200 flex-1" />
                  </div>

                  {/* Sign In Form */}
                  <form onSubmit={handleSignInSubmit} className="space-y-4" id="auth-email-form">
                    {(error || localMessage) && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold text-base flex items-start gap-2 shadow-2xs">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{error || localMessage}</span>
                      </div>
                    )}

                    {/* Quick Autofill Helper for Testing */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>💡 Quick Autofill Dummy Credentials:</span>
                        <span className="text-[11px] text-slate-400 font-normal">Tap to fill inputs</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmailOrId('margaret.davies@everease-uk.org');
                            setLoginPassword('EverEasePassword2026!');
                          }}
                          className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          🧓 Senior (Margaret)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmailOrId('sarah.davies@everease-uk.org');
                            setLoginPassword('EverEasePassword2026!');
                          }}
                          className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          👨‍👩‍👧 Carer (Sarah)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmailOrId('support.lead@everease.co.uk');
                            setLoginPassword('EverEasePassword2026!');
                          }}
                          className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          🛠️ Admin (James)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmailOrId('EE-UK-884210');
                            setLoginPassword('EverEasePassword2026!');
                          }}
                          className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          💳 Member ID
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-base md:text-lg font-black text-slate-900" htmlFor="login-email-input">
                        Email Address or Unique ID Code
                      </label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          id="login-email-input"
                          type="text"
                          required
                          placeholder="e.g. name@example.co.uk or EE-UK-123456"
                          value={loginEmailOrId}
                          onChange={(e) => setLoginEmailOrId(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-base md:text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-base md:text-lg font-black text-slate-900" htmlFor="login-password-input">
                        Password or Temporary Password
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          id="login-password-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Your password or temporary passcode"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-xl text-base md:text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                          id="toggle-password-visibility-btn"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-lg md:text-xl shadow-sm border border-emerald-900/30 transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-amber-300 min-h-[56px] cursor-pointer"
                      id="auth-submit-btn"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          <span>Sign In to EverEase</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Demo Fast-Login Box (Allows instant testing of all 5 roles) */}
            <div className="bg-slate-100/90 rounded-3xl border border-slate-200 p-5 space-y-3 shadow-2xs" id="demo-login-box">
              <div className="flex items-center gap-2 text-slate-900">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <span className="text-sm font-black uppercase tracking-wider">
                  Quick Test: Select a Role to Try
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Instantly test role-based views and navigation without typing credentials:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('senior')}
                  className="p-3.5 bg-white hover:bg-emerald-50/60 active:bg-emerald-100/60 border border-emerald-200 rounded-2xl text-left font-bold text-slate-900 text-sm flex items-center justify-between transition-all shadow-2xs cursor-pointer"
                  id="demo-login-senior-btn"
                >
                  <div>
                    <span className="block text-emerald-950 font-black">🧓 Margaret Davies</span>
                    <span className="text-xs text-emerald-700 font-semibold">Senior User (Age 76)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('family_carer')}
                  className="p-3.5 bg-white hover:bg-blue-50/60 active:bg-blue-100/60 border border-blue-200 rounded-2xl text-left font-bold text-slate-900 text-sm flex items-center justify-between transition-all shadow-2xs cursor-pointer"
                  id="demo-login-carer-btn"
                >
                  <div>
                    <span className="block text-blue-950 font-black">👨‍👩‍👧 Sarah Davies</span>
                    <span className="text-xs text-blue-700 font-semibold">Family Carer / Daughter</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-700" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('support_admin')}
                  className="p-3.5 bg-white hover:bg-amber-50/60 active:bg-amber-100/60 border border-amber-200 rounded-2xl text-left font-bold text-slate-900 text-sm flex items-center justify-between transition-all shadow-2xs cursor-pointer"
                  id="demo-login-support-btn"
                >
                  <div>
                    <span className="block text-amber-950 font-black">🛠️ James Wilson</span>
                    <span className="text-xs text-amber-800 font-semibold">Support Admin Shell</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('super_admin')}
                  className="p-3.5 bg-white hover:bg-purple-50/60 active:bg-purple-100/60 border border-purple-200 rounded-2xl text-left font-bold text-slate-900 text-sm flex items-center justify-between transition-all shadow-2xs cursor-pointer"
                  id="demo-login-superadmin-btn"
                >
                  <div>
                    <span className="block text-purple-950 font-black">👑 Arthur Pendelton</span>
                    <span className="text-xs text-purple-800 font-semibold">Super Admin Shell</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-700" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Freephone help footer */}
        <div className="text-center py-2 text-slate-500 text-sm md:text-base font-semibold">
          Need help getting started or signing in? Freephone{' '}
          <a href="tel:08008882026" className="text-emerald-700 font-black underline hover:text-emerald-800 transition-colors">
            0800 888 2026
          </a>
        </div>
      </div>
    </div>
  );
};
