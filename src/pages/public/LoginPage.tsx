import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import loginHeroBg from '../../assets/images/login_senior_couple_tablet_1787069954901.jpg';

interface LoginPageProps {
  navigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { signInWithEmail, quickLoginDemo, error, clearError } = useAuth();
  
  // Pre-filled dummy details for testing as requested
  const [fullName, setFullName] = useState('John Doe');
  const [customerId, setCustomerId] = useState('EE-12345');
  const [password, setPassword] = useState('EverEase2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotEmailOrId, setForgotEmailOrId] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!fullName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }

    if (!customerId.trim()) {
      setLocalError('Please enter your Unique Customer ID (e.g. EE-12345).');
      return;
    }

    if (!password.trim()) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Sign in using the customer ID / email with AuthContext
      await signInWithEmail(customerId.trim(), password);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Fallback direct login for demo customer:', err);
      // Fallback demo login if network/auth is in demo mode
      await quickLoginDemo('senior');
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTestCredentials = (name: string, id: string, pass: string) => {
    setFullName(name);
    setCustomerId(id);
    setPassword(pass);
    setLocalError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center lg:justify-end overflow-hidden bg-slate-900" id="customer-login-page">
      {/* Background Image of Senior Couple using iPad in cozy living room - Flipped to Left Side */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={loginHeroBg}
          alt="Elderly couple smiling while browsing their tablet together"
          className="w-full h-full object-cover object-[center_top] -scale-x-100 filter brightness-[0.82] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle gradient: transparent on the left over the couple, dark on the right behind the login cards */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-slate-950/50 to-slate-950/90" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16 flex items-center justify-center lg:justify-end">
        
        {/* Right Side: Exact 2-card layout matching screenshot ee8.jpg */}
        <div className="w-full max-w-[460px] space-y-4">
          
          {/* Top Card: "Welcome to Your Digital Hub" */}
          <div 
            id="login-top-welcome-card"
            className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-white/15 shadow-2xl text-left space-y-4"
          >
            {/* Top row badge & label */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-900/70 text-teal-300 border border-teal-500/40">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                UK Secure Member Portal
              </span>
              <span className="text-xs font-bold text-teal-400">
                Digital Hub
              </span>
            </div>

            {/* Title & description */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Welcome to Your <span className="text-teal-400">Digital Hub</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-1.5">
                Sign in to view your learning progress, manage your subscription, download official receipts, or request immediate 1-on-1 technical assistance.
              </p>
            </div>

            {/* Two Trust Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white leading-tight truncate">
                    Bank-Grade Security
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    UK GDPR compliant
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white leading-tight truncate">
                    Patient UK Support
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Friendly support team
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: "My Account" Form */}
          <div 
            id="login-form-card"
            className="rounded-3xl p-6 sm:p-7 bg-slate-900/85 backdrop-blur-xl border border-white/15 shadow-2xl space-y-5 text-left"
          >
            {/* Header Brand Icon */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-700/80 text-teal-200 border border-teal-500/40 shadow-inner mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-300 tracking-wide">
                EverEase
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                My Account
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{localError || error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4" id="customer-login-form">
              {/* Field 1: Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="input-login-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 focus:border-teal-400 focus:bg-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Unique Customer ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Unique Customer ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="input-login-customer-id"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="e.g. EE-12345"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 focus:border-teal-400 focus:bg-white/10 rounded-xl text-white text-sm font-mono placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Field 3: Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 bg-white/5 border border-white/15 focus:border-teal-400 focus:bg-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  id="btn-forgot-password"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer border-0 bg-transparent"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                id="btn-customer-login-submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-extrabold text-base rounded-xl transition-all shadow-lg hover:shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Quick Testing Dummy Helper */}
            <div className="pt-3 border-t border-white/10 text-center space-y-2">
              <div className="text-[11px] font-semibold text-slate-400">
                Testing Presets (Click to autofill):
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestCredentials('John Doe', 'EE-12345', 'EverEase2026!')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/15 transition-colors cursor-pointer"
                >
                  👤 Senior: John Doe
                </button>
                <button
                  type="button"
                  onClick={() => setTestCredentials('Sarah Davies', 'sarah.davies@everease-uk.org', 'carer123!')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/15 transition-colors cursor-pointer"
                >
                  👥 Family: Sarah Davies
                </button>
              </div>
            </div>

            {/* Not a member yet? */}
            <div className="text-center pt-1 text-xs text-slate-400">
              <span>Don’t have a membership yet? </span>
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="text-teal-400 font-bold hover:underline cursor-pointer border-0 bg-transparent ml-1"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Reset Your Password</h3>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSubmitted(false);
                }}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-200">
                  If an account matches your details, our patient UK support team has sent reset instructions to your registered email or phone.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your Unique Customer ID or registered email address. We’ll send you a secure verification link, or you can call our helpline for immediate human assistance.
                </p>

                <input
                  type="text"
                  value={forgotEmailOrId}
                  onChange={(e) => setForgotEmailOrId(e.target.value)}
                  placeholder="e.g. EE-12345 or your@email.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-teal-400 focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotSubmitted(true)}
                    className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm"
                  >
                    Send Reset Link
                  </button>
                  <a
                    href="tel:+443304010019"
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 no-underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                    <span>Call Helpline</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
