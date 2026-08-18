import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Type, 
  HelpCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAuth } from '../../contexts/AuthContext';

interface PublicHeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ currentRoute, navigate }) => {
  const { 
    textSize, 
    setTextSize, 
    highContrast, 
    toggleHighContrast, 
    speakText,
    stopSpeaking,
    isSpeaking,
    isSpeechAvailable
  } = useAccessibility();
  const { currentUser, userProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleReadAloudCurrentScreen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      let speechContent = 'EverEase senior web platform. ';
      if (currentRoute === '/' || currentRoute === '') {
        speechContent += 'Welcome to EverEase, the British support ecosystem empowering UK seniors to live independently, stay safe from scams, master digital devices, and stay connected with family.';
      } else if (currentRoute.startsWith('/services')) {
        speechContent += 'EverEase Services overview. Explore our six core modules: Scam Scanner, Digital Help, Encrypted Vault, Reminders, Home Manager, and Family Connect.';
      } else if (currentRoute.startsWith('/about')) {
        speechContent += 'About EverEase. Learn about our mission, dedicated UK support, security standards, and founding purpose.';
      } else if (currentRoute.startsWith('/how-it-works')) {
        speechContent += 'How EverEase Works. Join in three simple steps with large-print welcome packs, telephone onboarding, and family sync.';
      } else if (currentRoute.startsWith('/pricing')) {
        speechContent += 'EverEase transparent pricing plans: Essentials plan at £7.99 per month, Complete plan at £14.99 per month, and Lifetime plan.';
      } else if (currentRoute.startsWith('/faq')) {
        speechContent += 'Frequently Asked Questions about EverEase security, UK phone help, and family sync.';
      } else if (currentRoute.startsWith('/contact')) {
        speechContent += 'Contact EverEase. Freephone UK telephone helpline on 0800 888 2026 or send us an enquiry message.';
      } else {
        speechContent += `You are viewing ${currentRoute.replace('/', '').replace('-', ' ')}.`;
      }
      speakText(speechContent);
    }
  };

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'How it Works', route: '/how-it-works' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Contact', route: '/contact' },
  ];

  const handleLinkClick = (route: string, label: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  const isActive = (route: string) => {
    if (route === '/' && (currentRoute === '/' || currentRoute === '')) return true;
    return currentRoute.startsWith(route) && route !== '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm" id="public-header-navigation">
      {/* Top Senior Safeguarding & Accessibility Bar */}
      <div className="bg-slate-900 text-white text-xs md:text-sm py-2 px-4">
        <div className="w-full max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Freephone Helpline */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30">
              <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
              UK Freephone: <strong className="text-white text-sm">0800 888 2026</strong>
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              • Open 8am–8pm Daily
            </span>
          </div>

          {/* Accessibility Quick Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Text Size Control */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <span className="text-slate-300 px-2 flex items-center gap-1 font-medium text-xs">
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                Text:
              </span>
              <button
                type="button"
                id="btn-font-normal"
                onClick={() => setTextSize('normal')}
                className={`px-2 py-0.5 rounded text-xs font-semibold border-0 transition-colors ${
                  textSize === 'normal'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Standard text size (16px)"
              >
                A
              </button>
              <button
                type="button"
                id="btn-font-large"
                onClick={() => setTextSize('large')}
                className={`px-2 py-0.5 rounded text-xs font-semibold border-0 transition-colors ${
                  textSize === 'large'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Large text size (18px)"
              >
                A+
              </button>
              <button
                type="button"
                id="btn-font-xlarge"
                onClick={() => setTextSize('xlarge')}
                className={`px-2 py-0.5 rounded text-xs font-semibold border-0 transition-colors ${
                  textSize === 'xlarge'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Extra large text size (20px)"
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              id="btn-high-contrast-toggle"
              onClick={toggleHighContrast}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle High Contrast Mode"
            >
              {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{highContrast ? 'Contrast: High' : 'High Contrast'}</span>
            </button>

            {/* Audio Voice Assistant */}
            {isSpeechAvailable && (
              <button
                type="button"
                id="btn-voice-read-aloud-toggle"
                onClick={handleReadAloudCurrentScreen}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold animate-pulse'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
                title="Read screen aloud in clear English"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Public Navigation Bar */}
      <div className="w-full max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          id="btn-nav-brand-logo"
          onClick={() => handleLinkClick('/', 'Home')}
          className="flex items-center gap-2.5 text-left border-0 bg-transparent focus:outline-none group cursor-pointer"
          aria-label="EverEase Home"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none block">
              EverEase
            </span>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 rounded">
              DIGITAL LEARNING
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.route);
            return (
              <button
                key={link.route}
                type="button"
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleLinkClick(link.route, link.label)}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm border-0 bg-transparent transition-colors cursor-pointer ${
                  active
                    ? 'text-teal-700 font-bold bg-teal-50/70'
                    : 'text-slate-700 hover:text-teal-700 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {currentUser ? (
            <button
              type="button"
              id="btn-nav-go-to-dashboard"
              onClick={() => {
                navigate('/dashboard');
              }}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full font-bold shadow-xs transition-all cursor-pointer text-sm border-0"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-200" />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                id="btn-nav-login"
                onClick={() => {
                  navigate('/login');
                }}
                className={`px-3 py-1.5 font-medium transition-colors text-sm cursor-pointer border-0 bg-transparent ${
                  currentRoute.startsWith('/login')
                    ? 'text-teal-700 font-bold bg-teal-50/70 rounded-lg'
                    : 'text-slate-700 hover:text-teal-700'
                }`}
              >
                <span>Login</span>
              </button>

              <button
                type="button"
                id="btn-nav-join-now"
                onClick={() => {
                  navigate('/auth?mode=signup');
                }}
                className="px-4 py-2 rounded-full font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs hover:shadow transition-all cursor-pointer text-sm border-0"
              >
                <span>Join Now</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          id="btn-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border-2 border-slate-300 focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t-2 border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.route);
              return (
                <button
                  key={link.route}
                  type="button"
                  id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleLinkClick(link.route, link.label)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t-2 border-slate-200 grid grid-cols-1 gap-2.5">
            {currentUser ? (
              <button
                type="button"
                id="btn-mobile-go-to-dashboard"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-3.5 bg-emerald-700 text-white rounded-xl font-extrabold text-center text-lg flex items-center justify-center gap-2 shadow"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>Go to Member Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  id="btn-mobile-get-started"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth?mode=signup');
                  }}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-center text-lg flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started — Membership Setup</span>
                </button>

                <button
                  type="button"
                  id="btn-mobile-login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth?mode=signin');
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 rounded-xl font-bold text-center text-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5 text-emerald-700" />
                  <span>Member Log In</span>
                </button>
              </>
            )}

            {/* Helpline CTA in Mobile Drawer */}
            <div className="mt-2 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-900 font-bold uppercase tracking-wider">
                Need help by telephone?
              </p>
              <a 
                href="tel:08008882026"
                className="text-lg font-black text-emerald-800 hover:underline inline-flex items-center gap-1.5 mt-0.5"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                0800 888 2026
              </a>
              <p className="text-xs text-emerald-700 font-medium">Freephone • 8am to 8pm UK</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
