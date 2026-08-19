import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Headphones, 
  FileCheck2, 
  CheckCircle2, 
  Phone,
  Mail, 
  MapPin,
  CreditCard
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface PublicFooterProps {
  navigate: (route: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();

  const legalLinks = [
    { label: 'Terms & Conditions', route: '/terms' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Refund & Cancellation Policy', route: '/refund' },
    { label: 'Service Level Agreement (SLA)', route: '/sla' },
    { label: 'Disclaimer', route: '/disclaimer' },
    { label: 'GDPR Compliance', route: '/gdpr' },
    { label: 'Our Commitment & Safeguarding', route: '/our-commitment' },
  ];

  const handleLegalClick = (route: string, label: string) => {
    navigate(route);
  };

  return (
    <footer className="bg-slate-900 text-slate-100 border-t-4 border-teal-600" id="public-footer">
      {/* 1. Trust Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-4 px-4">
        <div className="w-full max-w-[1500px] mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-200">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" />
            <span>Secure payments</span>
          </div>
          <div className="hidden sm:inline text-slate-600">•</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>SSL encrypted</span>
          </div>
          <div className="hidden sm:inline text-slate-600">•</div>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-teal-400" />
            <span>UK-based support</span>
          </div>
          <div className="hidden sm:inline text-slate-600">•</div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-teal-400" />
            <span>GDPR compliant</span>
          </div>
          <div className="hidden sm:inline text-slate-600">•</div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-400" />
            <span>Direct Debit Guarantee protected</span>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="w-full max-w-[1500px] mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Purpose */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Ever<span className="text-teal-400">Ease</span>
              </span>
              <p className="text-xs text-slate-400 font-medium">Digital Learning, Safety &amp; Peace of Mind for Older Adults</p>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            EverEase provides plain-English scam protection, step-by-step digital guidance, life reminders, household management, and caring family connections. Designed specifically to empower older adults with confidence, dignity, and independence online.
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 bg-teal-950/60 border border-teal-800/80 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              Direct Debit Guarantee protected
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Explore EverEase
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm">
            <li>
              <button 
                type="button"
                onClick={() => navigate('/')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                Home Overview
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => navigate('/about')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                About Our Mission
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => navigate('/services')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                Our 7 Services
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => navigate('/how-it-works')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                How It Works (6 Simple Steps)
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => navigate('/pricing')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                Membership Plans &amp; Pricing
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => navigate('/faq')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => navigate('/contact')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                Contact Us &amp; Enquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-3" id="footer-contact-section">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Contact
          </h3>
          <div className="space-y-3.5 text-xs sm:text-sm">
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200">Address</p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-0.5">
                  160 City Road<br />
                  Kemp House<br />
                  London, EC1V 2NX
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200">Phone</p>
                <a 
                  href="tel:+443304010019" 
                  className="text-slate-300 hover:text-teal-300 transition-colors text-xs sm:text-sm font-semibold block mt-0.5"
                >
                  +44 (0) 330 401 0019
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200">Email</p>
                <a 
                  href="mailto:support@evereaseuk.com" 
                  className="text-slate-300 hover:text-teal-300 transition-colors text-xs sm:text-sm font-semibold block mt-0.5 break-all"
                >
                  support@evereaseuk.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Safeguarding & Direct Debit Guarantee */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Safeguarding Standards
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            EverEase operates strictly under the UK Safeguarding Vulnerable Groups framework. We never sell data, never show advertising, and never request bank PINs or passwords.
          </p>
          <div className="bg-teal-950/40 border border-teal-800/60 rounded-xl p-3 text-xs space-y-1">
            <div className="font-bold text-teal-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              Direct Debit Guarantee
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Direct Debit payments are collected securely via Stripe and fully protected under the BACS Direct Debit Guarantee. You can cancel at any time with no lock-in.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Legal Links Row (Every Public Page) */}
      <div className="border-t border-slate-800 bg-slate-950 py-5 px-4">
        <div className="w-full max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center md:text-left">
            {legalLinks.map((link) => (
              <button
                key={link.route}
                type="button"
                id={`footer-legal-${link.route.replace('/', '')}`}
                onClick={() => handleLegalClick(link.route, link.label)}
                className="text-slate-400 hover:text-teal-400 underline underline-offset-4 transition-colors font-medium cursor-pointer border-0 bg-transparent p-0"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="text-center md:text-right shrink-0 text-slate-500 font-normal text-xs">
            © {new Date().getFullYear()} EverEase. All rights reserved. Registered in England &amp; Wales.
          </div>
        </div>
      </div>
    </footer>
  );
};
