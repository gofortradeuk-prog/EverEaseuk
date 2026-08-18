import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  HeartHandshake, 
  Scale, 
  FileCheck2, 
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Building2,
  ExternalLink,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

interface LegalPageProps {
  type: 'terms' | 'privacy' | 'refund' | 'sla' | 'disclaimer' | 'gdpr' | 'our-commitment';
  navigate: (route: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, navigate }) => {
  const [activeTab, setActiveTab] = useState<string>(type || 'terms');

  const legalContentMap: Record<string, {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    effectiveDate: string;
    details: string;
  }> = {
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Terms of use for the EverEase digital learning and support service',
      icon: <Scale className="w-8 h-8 text-emerald-700" />,
      effectiveDate: 'Effective date: 17 August 2026 — Last updated: 17 August 2026',
      details: 'Governs access to EverEase UK web applications, modules, membership tiers, and Direct Debit collections.'
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How We Protect, Store, and Respect Your Personal Information',
      icon: <Lock className="w-8 h-8 text-emerald-700" />,
      effectiveDate: 'Effective date: 17 August 2026 — Last updated: 17 August 2026',
      details: 'Details our strict zero-ad, non-commercialisation data policy and AES-256 vault encryption standards.'
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      subtitle: 'Clear terms governing subscription cancellations, cooling-off rights, refunds, and billing',
      icon: <FileCheck2 className="w-8 h-8 text-emerald-700" />,
      effectiveDate: 'Effective Date: 18 August 2026 — Last Updated: 18 August 2026 — Version: 3.0',
      details: 'Clear and straightforward guidance on cancelling subscriptions, statutory cooling-off rights, and refund processes.'
    },
    sla: {
      title: 'Service Level Agreement (SLA)',
      subtitle: 'Detailed commitments to platform availability, support responsiveness and incident handling',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-700" />,
      effectiveDate: 'Effective date: 18 August 2026 — Last updated: 18 August 2026 — Version 2.0 (Detailed)',
      details: 'Our 99.0% uptime target, multi-tiered incident response matrix, session delivery standards, and service credit terms.'
    },
    disclaimer: {
      title: 'Disclaimer & Emergency Notice',
      subtitle: 'Information Accuracy, Scam Assessments, & Legal Boundary Notice',
      icon: <AlertCircle className="w-8 h-8 text-amber-700" />,
      effectiveDate: 'Effective date: 17 August 2026 — Last updated: 17 August 2026',
      details: 'Clarifies that EverEase guidance provides assistive fraud screening and does not replace emergency 999 or official legal counsel.'
    },
    gdpr: {
      title: 'GDPR & Data Protection Compliance',
      subtitle: 'UK Data Protection Act 2018 & Subject Access Rights',
      icon: <FileText className="w-8 h-8 text-emerald-700" />,
      effectiveDate: 'Effective date: 17 August 2026 — Last updated: 17 August 2026',
      details: 'Full breakdown of your statutory rights regarding data portability, erasure, and access requests.'
    },
    'our-commitment': {
      title: 'Our Commitment & Safeguarding Standards',
      subtitle: 'How EverEase Supports and Protects Vulnerable Customers',
      icon: <HeartHandshake className="w-8 h-8 text-emerald-700" />,
      effectiveDate: 'Effective date: 17 August 2026 — Last updated: 17 August 2026',
      details: 'Our dedicated operational protocols for older adults, cognitive accessibility, and safeguarding intervention.'
    }
  };

  const currentType = activeTab in legalContentMap ? activeTab : 'terms';
  const config = legalContentMap[currentType];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8" id={`public-legal-page-${currentType}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Back navigation button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-800 font-extrabold text-sm sm:text-base group bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-emerald-700" />
            <span>Back to Home</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>UK Law: England &amp; Wales Jurisdiction</span>
          </div>
        </div>

        {/* Legal Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-6">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shrink-0 w-fit">
              {config.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  EVEREASE LEGAL &amp; GOVERNANCE
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  Customer Policy
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {config.title}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1">
                {config.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 pt-1">
            <span className="text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              {config.effectiveDate}
            </span>
            <span>UK Consumer Cancellation &amp; Refund Terms</span>
          </div>
        </div>

        {/* Legal Document Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'refund', label: 'Refund & Cancellation' },
            { id: 'sla', label: 'Service Level Agreement (SLA)' },
            { id: 'disclaimer', label: 'Disclaimer' },
            { id: 'gdpr', label: 'GDPR Rights' },
            { id: 'our-commitment', label: 'Our Commitment & Safeguarding' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Document Content */}
        {currentType === 'our-commitment' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                EVEREASE — Our Commitment &amp; Safeguarding Policy
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Protecting the dignity, security, and digital independence of older adults and vulnerable members under UK Safeguarding standards.
              </p>
              <div className="text-xs font-bold text-slate-500 pt-1">
                Effective date: 17 August 2026 — Last updated: 17 August 2026
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="commitment-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>Our Safeguarding Framework</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase operates strictly under the principles of the UK Safeguarding Vulnerable Groups framework. Safeguarding the dignity, safety, and independence of our members is at the heart of everything we do.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3" id="commitment-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Our Core Commitments</span>
              </h3>
              <ul className="space-y-2.5 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>We never sell member data to third parties.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>We never display third-party advertising to members within our service.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>We never request a member&rsquo;s bank PIN, full password, or ask them to transfer money to us or any third party.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>We communicate in plain English, free from confusing jargon, and at a pace that respects each member&rsquo;s needs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>We support independence and confidence, rather than creating dependency.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3" id="commitment-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Staff Training &amp; Conduct</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                All EverEase support staff receive training in safeguarding awareness, scam and fraud recognition, communicating with vulnerable adults, and how to escalate concerns appropriately. Staff undergo appropriate background checks in line with UK safeguarding good practice.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4" id="commitment-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>Recognising and Responding to Concerns</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                If our team identifies signs that a member may be at risk &mdash; such as evidence of financial abuse, an ongoing scam, self-neglect, or a safeguarding concern raised by a family member &mdash; we will:
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-900">Listen and Support:</strong> Listen to and support the member with patience and without judgement;
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-900">Family &amp; Contact Liaison:</strong> Where the member consents, contact a nominated family member or trusted contact;
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-900">Statutory Escalation:</strong> Where there is a risk of serious harm, escalate to the relevant statutory authority (such as local adult social care services or, in an emergency, the police);
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-slate-900">Internal Audit &amp; Review:</strong> Record and review the concern in line with our internal safeguarding procedures.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3" id="commitment-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">5</span>
                <span>Family &amp; Trusted Contacts</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We encourage members to nominate a trusted family member or friend as an emergency and safeguarding contact. This person may be contacted in the event of a safeguarding concern, and &mdash; where authorised by the member &mdash; may assist with billing or account matters.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4" id="commitment-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>Reporting a Concern</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Anyone &mdash; a member, family member, or member of the public &mdash; can raise a safeguarding concern with EverEase at any time via our Freephone helpline (<strong>0800 888 2026</strong>, 8am&ndash;8pm daily) or by email to <strong>support@everease.co.uk</strong>. All concerns are treated seriously and in confidence.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="commitment-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>Working with External Bodies</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where necessary and appropriate, EverEase will work with local safeguarding boards, adult social care services, Action Fraud, and the police to protect the welfare of our members.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3" id="commitment-section-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">8</span>
                <span>Continuous Improvement</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We regularly review our safeguarding policies and procedures to ensure they reflect current best practice and legal requirements, and we welcome feedback from members and families on how we can improve.
              </p>
            </section>

            {/* Contact section */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="commitment-section-contact">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">9</span>
                <span>Contact Us</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you have any questions about this policy, please contact our support and compliance team:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>Freephone UK Telephone Desk</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Open 8:00 AM &ndash; 8:00 PM (Monday to Sunday, 365 days a year)
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Support &amp; Compliance Email</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    support@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    Legal / Compliance: legal@everease.co.uk
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Registered:</strong> EverEase, registered in England &amp; Wales.</p>
              </div>
            </section>

          </div>
        ) : currentType === 'gdpr' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                EVEREASE — GDPR Compliance Statement
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Our standards and legal foundations for safeguarding your personal data under the UK GDPR &amp; Data Protection Act 2018.
              </p>
              <div className="text-xs font-bold text-slate-500 pt-1">
                Effective date: 17 August 2026 — Last updated: 17 August 2026
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="gdpr-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>Our Commitment to Data Protection</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase is committed to protecting the privacy and personal data of our members, their families, and website visitors, in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3" id="gdpr-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Data Controller</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase, registered in England &amp; Wales, acts as the data controller for personal data collected through our website, portal, and services.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3" id="gdpr-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Lawful Basis for Processing</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We process personal data on the following lawful bases:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Contract:</strong> to provide membership services, billing, and support you have signed up for;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Consent:</strong> for optional communications, such as marketing updates, which you may withdraw at any time;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Legal obligation:</strong> to meet our regulatory, tax, and safeguarding obligations;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Legitimate interests:</strong> to maintain the safety, security, and quality of our services, balanced against members&rsquo; rights and freedoms.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3" id="gdpr-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>What Data We Collect</span>
              </h3>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Identity and contact details:</strong> (name, address, phone number, email);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Account and billing information:</strong> (processed securely via Stripe; we do not store full card details);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Support interaction records:</strong> (calls, emails, chat transcripts) to provide and improve our service;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Nominated family/emergency contact details:</strong> where provided;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span><strong>Technical data:</strong> (such as device and browser information) for website functionality and security.</span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3" id="gdpr-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">5</span>
                <span>How We Use Your Data</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Personal data is used to provide membership services, process payments, respond to support requests, safeguard members, meet legal obligations, and &mdash; where consented &mdash; send service or marketing communications. We do not sell member data to third parties.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3" id="gdpr-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>Data Sharing</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We share personal data only where necessary, with:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Trusted service providers who process data on our behalf (e.g. Stripe for payments, hosting providers), under appropriate data processing agreements;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Nominated family contacts, where a member has authorised this;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Statutory or safeguarding authorities, where required by law or to protect a vulnerable person from harm.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="gdpr-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>Data Retention</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We retain personal data only for as long as necessary to provide our services and meet legal, accounting, or safeguarding requirements, after which it is securely deleted or anonymised.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3" id="gdpr-section-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">8</span>
                <span>Your Rights Under UK GDPR</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                You have the right to:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Access the personal data we hold about you;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request correction of inaccurate data;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request erasure of your data, subject to legal exceptions;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Restrict or object to certain processing;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request data portability;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Withdraw consent for marketing communications at any time;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Lodge a complaint with the Information Commissioner&rsquo;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">ico.org.uk <ExternalLink className="w-3.5 h-3.5" /></a>.</span>
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-3" id="gdpr-section-9">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">9</span>
                <span>Data Security</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We use SSL encryption, secure hosting, access controls, and regular security reviews to protect personal data against unauthorised access, loss, or misuse.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3" id="gdpr-section-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">10</span>
                <span>International Transfers</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where personal data is transferred outside the UK, we ensure appropriate safeguards are in place, such as adequacy decisions or standard contractual clauses, in accordance with UK GDPR requirements.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3" id="gdpr-section-11">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">11</span>
                <span>Further Information</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                For full details on how we handle personal data, please refer to our Privacy Policy. To exercise any of your data protection rights, contact us using the details below.
              </p>
            </section>

            {/* Contact section */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="gdpr-section-contact">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">12</span>
                <span>Contact Us</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you have any questions about this policy, please contact our support and compliance team:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>Freephone UK Telephone Desk</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Open 8:00 AM &ndash; 8:00 PM (Monday to Sunday, 365 days a year)
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Support &amp; Compliance Email</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    support@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    Legal / Compliance: legal@everease.co.uk
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Registered:</strong> EverEase, registered in England &amp; Wales.</p>
              </div>
            </section>

          </div>
        ) : currentType === 'disclaimer' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                EVEREASE — Disclaimer &amp; Guidance Notice
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Scope of digital coaching, scam awareness educational guidance, and limitations of liability.
              </p>
              <div className="text-xs font-bold text-slate-500 pt-1">
                Effective date: 17 August 2026 — Last updated: 17 August 2026
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="disclaimer-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>General Information</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase provides digital learning, scam-awareness guidance, and technology support services for older adults and their families. The content, guidance, and support provided through our website, portal, helpline, and services are for general informational and educational purposes only.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3" id="disclaimer-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Not Professional Financial, Legal or Medical Advice</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Nothing provided by EverEase, including guidance from our support team, learning materials, or scam-awareness content, constitutes financial, legal, or medical advice. Members should seek independent professional advice from a qualified adviser, solicitor, or medical practitioner where appropriate.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4" id="disclaimer-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Scam &amp; Fraud Awareness Guidance</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                While EverEase provides guidance to help members recognise and avoid scams, we cannot guarantee that any individual will be protected from fraud, financial loss, or malicious activity. Members and their families remain responsible for their own financial decisions and account security.
              </p>
              <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2.5 text-rose-950 text-base sm:text-lg">
                <div className="flex items-center gap-2 font-black text-rose-900">
                  <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
                  <span>Important Security Rule: EverEase Will Never Ask For Sensitive Details</span>
                </div>
                <p className="font-semibold text-rose-900">
                  EverEase will never ask a member for their bank PIN, full password, or to transfer money to us or a third party as part of our support service. Any communication claiming to be from EverEase requesting such information should be treated as suspicious and reported to us immediately.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3" id="disclaimer-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>Third-Party Services and Links</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Our website and materials may reference or link to third-party services, websites, or products (including device manufacturers, banks, and payment processors such as Stripe). EverEase is not responsible for the content, accuracy, or practices of third parties, and inclusion of a reference does not imply endorsement.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3" id="disclaimer-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">5</span>
                <span>Accuracy of Information</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase takes reasonable care to ensure that information provided through our services is accurate and up to date. However, we make no warranty, express or implied, as to the completeness, accuracy, or reliability of any content, and technology, scams, and online risks change frequently.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3" id="disclaimer-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>Limitation of Liability</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                To the fullest extent permitted by law, EverEase shall not be liable for any indirect, incidental, or consequential loss arising from the use of, or inability to use, our services, save that nothing in this disclaimer excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability which cannot be excluded or limited under English law.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="disclaimer-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>No Guarantee of Outcomes</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase supports members in building digital confidence and awareness, but cannot guarantee specific outcomes, including complete prevention of scams, fraud, or technology-related issues.
              </p>
            </section>

            {/* Contact section */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="disclaimer-section-contact">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">8</span>
                <span>Contact Us</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you have any questions about this policy, please contact our support and compliance team:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>Freephone UK Telephone Desk</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Open 8:00 AM &ndash; 8:00 PM (Monday to Sunday, 365 days a year)
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Support &amp; Compliance Email</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    support@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    Legal / Compliance: legal@everease.co.uk
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Registered:</strong> EverEase, registered in England &amp; Wales.</p>
              </div>
            </section>

          </div>
        ) : currentType === 'sla' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                EVEREASE &mdash; Service Level Agreement (SLA)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Detailed commitments to platform availability, support responsiveness and incident handling
              </p>
              <div className="text-xs font-bold text-slate-500 pt-1">
                Effective date: 18 August 2026 &mdash; Last updated: 18 August 2026 &mdash; Version 2.0 (Detailed)
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="sla-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>Purpose and Scope</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                This Service Level Agreement (&ldquo;SLA&rdquo;) describes, in detail, the level of service EverEase commits to providing in respect of platform availability, support response and resolution times, incident handling, and service credits. It applies to all active Subscription Plans and covers the EverEase website, online platform, telephone helpline, and live chat support.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                This SLA is an operational commitment and statement of our service standards; it does not replace or limit the legal rights and remedies available to you under our Terms &amp; Conditions, our Refund &amp; Cancellation Policy, or applicable consumer law.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4" id="sla-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Definitions</span>
              </h3>
              <ul className="space-y-2.5 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Available&rdquo; / &ldquo;Availability&rdquo;</strong> means the EverEase website and Member platform are accessible and functioning as intended for their core purpose (account login, session booking, guidance content).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Downtime&rdquo;</strong> means any period during which the platform is not Available, excluding Scheduled Maintenance and Excused Downtime (see Section 9).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Scheduled Maintenance&rdquo;</strong> means planned maintenance windows notified in advance in accordance with Section 6.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Incident&rdquo;</strong> means an unplanned event that disrupts or degrades the Service.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Response Time&rdquo;</strong> means the time between an Incident or support request being logged and a first meaningful response being given.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Resolution Time&rdquo;</strong> means the time between an Incident being logged and Service being restored to normal operation (which may include a temporary workaround).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span><strong>&ldquo;Business Hours&rdquo;</strong> means 8am&ndash;8pm UK time, daily, in line with our published support hours.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-6" id="sla-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Support Channels, Plan Tiers &amp; Service Standards</span>
              </h3>

              <p className="text-slate-700 text-base sm:text-lg">
                EverEase provides multi-channel customer assistance tailored to support everyday digital confidence. The channels and operating schedules available are outlined below:
              </p>

              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                      <th className="p-4 sm:p-5">Channel</th>
                      <th className="p-4 sm:p-5">General Availability</th>
                      <th className="p-4 sm:p-5">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>UK Freephone: 0800 888 2026</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-700 font-medium">8am&ndash;8pm daily, including weekends &amp; bank holidays</td>
                      <td className="p-4 sm:p-5 text-slate-700">Urgent questions, telephone check-ins, guidance calls, suspected fraud reports</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-100 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-700 shrink-0" />
                          <span>Live Chat (Website &amp; Portal)</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-700 font-medium">Active during tier support hours</td>
                      <td className="p-4 sm:p-5 text-slate-700">Interactive troubleshooting, live walkthroughs, quick account help</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-purple-700 shrink-0" />
                          <span>Email: support@everease.co.uk</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-700 font-medium">Monitored during support hours; queued 24/7</td>
                      <td className="p-4 sm:p-5 text-slate-700">Non-urgent enquiries, document verification, written receipts, general feedback</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3.1 Plan-Specific Support Tiers Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-slate-900">3.1 Support Hours &amp; Response Targets by Membership Plan</h4>
                <p className="text-slate-700 text-base sm:text-lg">
                  To ensure our support operations remain responsive, our support hours and target response times are tiered by membership plan:
                </p>

                <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                  <table className="w-full text-left border-collapse text-sm sm:text-base">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                        <th className="p-4 sm:p-5">Plan Tier</th>
                        <th className="p-4 sm:p-5">Support Operating Hours</th>
                        <th className="p-4 sm:p-5">Target Response Time</th>
                        <th className="p-4 sm:p-5">Personal Setup &amp; Onboarding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      <tr className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-slate-900">Essentials (£45/mo)</td>
                        <td className="p-4 sm:p-5 text-slate-700">Mon&ndash;Fri, 9:00 AM &ndash; 5:30 PM UK Time</td>
                        <td className="p-4 sm:p-5 font-semibold text-slate-800">Within 2 hours during support hours (Standard queue)</td>
                        <td className="p-4 sm:p-5 text-slate-700">Instant portal access; setup assistance on next business day</td>
                      </tr>
                      <tr className="bg-emerald-50/40 hover:bg-emerald-50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-emerald-950">Complete (£55/mo)</td>
                        <td className="p-4 sm:p-5 text-slate-700">Mon&ndash;Sat, 9:00 AM &ndash; 6:00 PM UK Time</td>
                        <td className="p-4 sm:p-5 font-extrabold text-emerald-900">Within 1 hour during support hours (Priority queue)</td>
                        <td className="p-4 sm:p-5 text-slate-700">Instant portal access; 1-to-1 setup assistance within 24 hours</td>
                      </tr>
                      <tr className="bg-purple-50/40 hover:bg-purple-50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-purple-950">Complete + Family (£65/mo)</td>
                        <td className="p-4 sm:p-5 text-slate-700">Mon&ndash;Sun, 8:00 AM &ndash; 8:00 PM UK Time</td>
                        <td className="p-4 sm:p-5 font-extrabold text-purple-900">Under 30 minutes during support hours (Express queue)</td>
                        <td className="p-4 sm:p-5 text-slate-700">Instant portal access; priority setup assistance within 12 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3.2 What Counts as a Valid Support Request */}
              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-slate-900">3.2 What Counts as a Support Request</h4>
                <p className="text-slate-700 text-base sm:text-lg">
                  A support request is defined as any inbound communication regarding the EverEase platform, digital learning modules, scam verification, account access, or billing management made through one of the following verified channels:
                </p>
                <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-700 font-black mt-1">&bull;</span>
                    <span>A help or scam-verification ticket submitted directly through the authenticated Member Portal;</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-700 font-black mt-1">&bull;</span>
                    <span>An email sent from the Member&rsquo;s registered email address to <strong>support@everease.co.uk</strong>;</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-700 font-black mt-1">&bull;</span>
                    <span>A live chat session initiated on the official website or portal;</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-700 font-black mt-1">&bull;</span>
                    <span>A telephone call placed to our UK Freephone helpline on <strong>0800 888 2026</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* 3.3 Definition of Response Time vs Resolution Time */}
              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-slate-900">3.3 What &ldquo;Response Time&rdquo; Means in Practice</h4>
                <p className="text-slate-700 text-base sm:text-lg">
                  <strong>&ldquo;Response Time&rdquo;</strong> refers to the elapsed time between a support request being registered during operational support hours and a qualified UK support advisor reviewing the request and providing a first meaningful, human reply or actionable step. Automated auto-reply acknowledgements do not satisfy our Response Time commitment.
                </p>
                <p className="text-slate-700 text-base sm:text-lg">
                  <strong>Requests Outside Support Hours:</strong> Any request submitted outside the operating hours for your plan tier is safely stored in our queue and will be picked up at the start of the next business support window.
                </p>
              </div>

              {/* 3.4 Setup & Onboarding Standards */}
              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-slate-900">3.4 Digital Setup &amp; Onboarding Commitments</h4>
                <p className="text-slate-700 text-base sm:text-lg">
                  Upon completion of registration, digital account creation is immediate, allowing instant access to member guides, scam checklists, and document templates. Where personalized 1-to-1 setup or onboarding assistance is requested, our team coordinates with you or your designated family carer to conduct the session within the stated delivery window (e.g. within 24 hours for Complete members, or same business day for requests received before 3:00 PM UK Time).
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4" id="sla-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>Platform Availability Target</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We target a monthly platform Availability of <strong>99.0%</strong>, measured over each calendar month, excluding Scheduled Maintenance and Excused Downtime as defined in Section 9. This equates to a maximum of approximately 7 hours and 18 minutes of unplanned Downtime per 30-day month.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-slate-900">4.1 Measurement Methodology</h4>
                <p className="text-slate-700 text-base sm:text-lg">
                  Availability is measured using automated uptime monitoring of our core website and Member login systems, sampled at regular intervals throughout each month. Availability percentage is calculated as:
                </p>
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 font-mono text-sm sm:text-base text-slate-900 font-semibold overflow-x-auto">
                  Availability % = ((Total Minutes in Month &minus; Downtime Minutes) &divide; Total Minutes in Month) &times; 100
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-lg font-bold text-slate-900">4.2 Monthly Reporting</h4>
                <p className="text-slate-700 text-base sm:text-lg">
                  A summary of platform Availability for the preceding month is maintained internally and will be made available on request to any Member who raises a specific query about an outage they experienced.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4" id="sla-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">5</span>
                <span>Incident Severity Levels and Targets</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                When we become aware of a genuine service Incident, we classify it by severity to determine our response and resolution targets:
              </p>

              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                      <th className="p-4 sm:p-5">Severity</th>
                      <th className="p-4 sm:p-5">Description</th>
                      <th className="p-4 sm:p-5">Response Time</th>
                      <th className="p-4 sm:p-5">Resolution Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr className="bg-rose-50/50 hover:bg-rose-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-rose-950">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></span>
                          <span>Critical (P1)</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-rose-950">Platform completely unavailable, or a safety-critical function (e.g. inability to reach support) is down for all users</td>
                      <td className="p-4 sm:p-5 font-extrabold text-rose-700">Within 30 minutes during Business Hours</td>
                      <td className="p-4 sm:p-5 font-extrabold text-rose-800">Within 4 hours</td>
                    </tr>
                    <tr className="bg-amber-50/40 hover:bg-amber-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-amber-950">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span>High (P2)</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-amber-950">Major feature unavailable or badly degraded for many users (e.g. booking system down, login failures)</td>
                      <td className="p-4 sm:p-5 font-bold text-amber-800">Within 1 hour during Business Hours</td>
                      <td className="p-4 sm:p-5 font-bold text-amber-900">Within 1 business day</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>Medium (P3)</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-700">A feature is impaired or unavailable for some users, with a reasonable workaround available</td>
                      <td className="p-4 sm:p-5 font-bold text-emerald-800">Within 4 hours during Business Hours</td>
                      <td className="p-4 sm:p-5 text-slate-800">Within 3 business days</td>
                    </tr>
                    <tr className="bg-slate-50/60 hover:bg-slate-100 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                          <span>Low (P4)</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">Minor issue with limited impact (e.g. cosmetic display issue) not affecting core functionality</td>
                      <td className="p-4 sm:p-5 font-semibold text-slate-700">Within 1 business day</td>
                      <td className="p-4 sm:p-5 text-slate-700">Next scheduled release</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-slate-700 text-base sm:text-lg">
                Severity is assessed by EverEase based on the number of Members affected and the nature of the function impacted. Members can help us classify an issue correctly by describing, when reporting it, what they were trying to do and what happened instead.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3" id="sla-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>Scheduled Maintenance</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                From time to time we need to carry out planned maintenance to keep the platform secure, reliable and up to date. Wherever possible, we will:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Schedule maintenance outside Business Hours (i.e. overnight, before 8am or after 8pm UK time);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Give at least 24 hours&rsquo; advance notice via email or an in-platform notice for any maintenance expected to affect access for more than 15 minutes;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Keep planned maintenance windows as short as reasonably possible;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Ensure the telephone helpline remains available during any platform maintenance window, save in exceptional circumstances.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="sla-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>Guidance Session Delivery Standards</span>
              </h3>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Scheduled one-to-one or group guidance Sessions will begin within 5 minutes of the confirmed start time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Where a coach is unable to attend a Session, we will contact the Member as soon as reasonably possible (and in any event before the scheduled start time, where the unavailability is known in advance) to reschedule at no extra cost.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Where technical issues on our side interrupt a Session in progress, we will attempt to resume within 10 minutes, or reschedule the remaining time at no additional cost.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Rescheduled Sessions will be offered within 3 business days of the original appointment, at a time convenient to the Member, wherever possible.</span>
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4" id="sla-section-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">8</span>
                <span>Service Credits</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where our monthly platform Availability falls below the target set out in Section 4, or a P1/P2 Incident&rsquo;s Resolution Target in Section 5 is missed due to a fault attributable to EverEase, an affected Member on an active paid Subscription Plan may request a service credit as follows:
              </p>

              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                      <th className="p-4 sm:p-5">Circumstance</th>
                      <th className="p-4 sm:p-5">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">Monthly Availability between 97.0% and 98.99%</td>
                      <td className="p-4 sm:p-5 font-extrabold text-emerald-800">5% of that month&rsquo;s subscription fee credited to the next Billing Cycle</td>
                    </tr>
                    <tr className="bg-amber-50/40 hover:bg-amber-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-amber-950">Monthly Availability below 97.0%</td>
                      <td className="p-4 sm:p-5 font-extrabold text-amber-900">10% of that month&rsquo;s subscription fee credited to the next Billing Cycle</td>
                    </tr>
                    <tr className="bg-purple-50/40 hover:bg-purple-50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-purple-950">A P1 Incident&rsquo;s Resolution Target missed by EverEase</td>
                      <td className="p-4 sm:p-5 font-extrabold text-purple-900">One guidance Session credited, or 10% of that month&rsquo;s fee, at the Member&rsquo;s choice</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-slate-700 text-base sm:text-lg">
                Service credits must be requested within 30 days of the end of the affected month by contacting our support line, and are applied as a credit to a future Billing Cycle rather than a cash refund, save where a cash refund is more appropriate under our Refund &amp; Cancellation Policy (for example, where the Member is also cancelling their subscription).
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3" id="sla-section-9">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">9</span>
                <span>Exclusions (Excused Downtime)</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                The following are excluded from Availability calculations and do not count toward service credit eligibility:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Scheduled Maintenance carried out in accordance with Section 6;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Issues caused by a Member&rsquo;s own internet connection, device, browser, or telephone line;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Outages or degradation of third-party services outside our control (e.g. a Member&rsquo;s mobile network, banking app, or a device manufacturer&rsquo;s service);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Events of force majeure, including power outages, extreme weather, national telecoms failures, or other circumstances beyond our reasonable control;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Suspension of a specific Member&rsquo;s Account due to a breach of our Terms &amp; Conditions or non-payment;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Beta or clearly-labelled experimental features not yet part of the core, generally available Service.</span>
                </li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="space-y-4" id="sla-section-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">10</span>
                <span>Escalation Path</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If a support issue is not resolved within the targets set out in Section 5, or you are unhappy with how it has been handled, you may request escalation at any point:
              </p>
              <div className="space-y-3 pl-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900 text-base">Step 1: First point of contact</div>
                  <p className="text-slate-700 text-sm sm:text-base">Front-line support agent via phone (0800 888 2026), live chat, or email.</p>
                </div>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-950 text-base">Step 2: Support Supervisor Escalation</div>
                  <p className="text-slate-700 text-sm sm:text-base">If unresolved or you are unsatisfied, ask to escalate to a Support Supervisor &mdash; target acknowledgement within 1 business day.</p>
                </div>
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <div className="font-bold text-blue-950 text-base">Step 3: Customer Operations Manager</div>
                  <p className="text-slate-700 text-sm sm:text-base">If still unresolved, escalate directly to the Customer Operations Manager (operations@everease.co.uk) &mdash; target response within 3 business days.</p>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section className="space-y-3" id="sla-section-11">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">11</span>
                <span>Reporting an Incident</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                To report a service Incident, please contact us via the freephone line (fastest for urgent issues: <strong>0800 888 2026</strong>) or live chat, and provide as much detail as possible, including: what you were trying to do, what happened instead, the approximate time it occurred, and the device/browser you were using, if known. This helps us classify severity accurately and resolve the issue faster.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3" id="sla-section-12">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">12</span>
                <span>Review and Updates to This SLA</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We review these service level targets periodically to ensure they remain realistic and reflect good practice, and may update this SLA from time to time. Where changes would reduce the level of service committed to active subscribers, we will give at least 30 days&rsquo; notice by email or in-platform notice. The version in force is the one published on our website at the relevant time.
              </p>
            </section>

            {/* Section 13 / Contact section */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="sla-section-13">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">13</span>
                <span>Contact Details</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you have any questions regarding this SLA or require operational assistance, please reach out to our team:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>Freephone UK Telephone Line</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Open 8:00 AM &ndash; 8:00 PM GMT daily (Monday to Sunday, 365 days a year)
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Support &amp; Operations Inboxes</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    support@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    Operations: operations@everease.co.uk &bull; Legal: legal@everease.co.uk
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Registered Company:</strong> EverEase, registered in England &amp; Wales.</p>
                <p><strong>Registered Office:</strong> 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ.</p>
              </div>
            </section>

          </div>
        ) : currentType === 'refund' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                EverEase &mdash; Refund &amp; Cancellation Policy
              </h2>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-semibold text-slate-700">
                <span><strong>Email:</strong> support@everease.co.uk</span>
                <span><strong>Telephone:</strong> 0800 888 2026</span>
                <span><strong>Support Hours:</strong> 8am&ndash;8pm daily</span>
              </div>
              <div className="text-xs font-bold text-slate-500 pt-1 flex flex-wrap items-center gap-2 border-t border-slate-200">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-extrabold">Version 3.0</span>
                <span>Effective Date: 18 August 2026 &mdash; Last Updated: 18 August 2026</span>
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="refund-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>Purpose and Scope</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                This Refund &amp; Cancellation Policy explains how customers can cancel an EverEase subscription, when refunds may be available, how refunds are processed, and how billing issues are handled.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                This Policy applies to subscriptions and services purchased from EverEase through the EverEase website, by telephone, or through another authorised EverEase sales or support channel.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                Nothing in this Policy limits or excludes any rights that you may have under applicable UK consumer law.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3" id="refund-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Free Introductory Call</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase may offer a free introductory call to help you understand our services and decide whether an EverEase membership is suitable for you.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                The introductory call is provided at no charge and does not create a paid subscription or payment obligation.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                No refund is applicable to the free introductory call because no payment is taken for the call.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                If you decide to purchase an EverEase subscription following the introductory call, the subscription will be subject to the applicable pricing, Terms &amp; Conditions, and this Refund &amp; Cancellation Policy.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4" id="refund-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Cancelling an EverEase Subscription</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                You may request cancellation of your EverEase subscription by:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Emailing <strong>support@everease.co.uk</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Calling <strong>0800 888 2026</strong>, available 8am&ndash;8pm daily</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">&bull;</span>
                  <span>Using the cancellation facility available through your EverEase account, where provided</span>
                </li>
              </ul>
              <p className="text-slate-700 text-base sm:text-lg">
                We will normally confirm your cancellation request by email.
              </p>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg">Ordinary Cancellation</h4>
                <p className="text-slate-700 text-sm sm:text-base">
                  For cancellations made outside any applicable statutory cancellation or cooling-off period, your subscription will normally remain active until the end of the current paid billing period.
                </p>
                <p className="text-slate-700 text-sm sm:text-base">
                  You will normally not receive a refund for unused time remaining in a billing period unless a refund is required by applicable law or is otherwise approved under this Policy.
                </p>
                <p className="text-slate-700 text-sm sm:text-base">
                  Cancelling your subscription will prevent future renewal charges from being taken after the effective cancellation date.
                </p>
                <p className="text-slate-700 text-sm sm:text-base font-medium">
                  EverEase does not charge a cancellation fee unless a specific charge has been clearly disclosed before entering into the relevant contract and is permitted by applicable law.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4" id="refund-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>14-Day Cooling-Off and Statutory Cancellation Rights</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where applicable to your contract, UK consumer law provides a 14-day cancellation period for certain distance contracts.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                If you are entitled to a statutory cancellation period, you may cancel within that period without giving a reason.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Services Starting During the Cancellation Period</h4>
                  <p className="text-slate-700 text-sm sm:text-base">
                    If you expressly request that EverEase begins providing services before the end of the applicable 14-day cancellation period, you acknowledge that the service may begin during that period.
                  </p>
                  <p className="text-slate-700 text-sm sm:text-base">
                    If you subsequently cancel during the cancellation period, EverEase may be entitled to charge a proportionate amount for services actually supplied before your cancellation, where permitted by applicable UK law.
                  </p>
                  <p className="text-slate-700 text-sm sm:text-base">
                    If the service has been fully performed during the applicable cancellation period following your express request and acknowledgement, statutory cancellation rights may be affected where permitted by law.
                  </p>
                  <p className="text-slate-700 text-sm sm:text-base font-medium">
                    Nothing in this section is intended to remove or restrict any statutory consumer right that cannot lawfully be excluded.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">How to Exercise a Statutory Cancellation Right</h4>
                  <p className="text-slate-700 text-sm sm:text-base">
                    To request cancellation, contact:
                  </p>
                  <ul className="space-y-1 text-slate-700 text-sm sm:text-base pl-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span><strong>Email:</strong> support@everease.co.uk</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span><strong>Telephone:</strong> 0800 888 2026</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 text-sm sm:text-base">
                    Please include your name, account email address and, where possible, your subscription or customer reference.
                  </p>
                  <p className="text-slate-700 text-sm sm:text-base">
                    We will normally confirm receipt of your cancellation request.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4" id="refund-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">5</span>
                <span>Refunds Outside the Cooling-Off Period</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                After the applicable cooling-off or statutory cancellation period has ended, subscription payments are generally non-refundable for the unused portion of the current billing period unless a refund is required by law or approved under this Policy.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                A refund or appropriate credit may be available in circumstances including:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">Service Unavailable</h4>
                  <p className="text-slate-700 text-sm sm:text-base">
                    If EverEase is unable to provide a paid service or scheduled session and we cannot reasonably reschedule or otherwise provide the service, we may provide an appropriate refund or credit for the affected service.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">Incorrect or Duplicate Billing</h4>
                  <p className="text-slate-700 text-sm sm:text-base">
                    If you have been charged incorrectly, charged twice for the same transaction, or charged an amount that does not match the agreed price, please contact us promptly so that we can investigate and correct the charge.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">EverEase Unable to Provide the Purchased Service</h4>
                  <p className="text-slate-700 text-sm sm:text-base">
                    If EverEase is unable to provide a service that you have paid for, we will consider an appropriate refund or alternative remedy depending on the circumstances and applicable consumer law.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">Exceptional Circumstances</h4>
                  <p className="text-slate-700 text-sm sm:text-base">
                    EverEase may consider refund requests in exceptional circumstances, including serious illness, bereavement, hospitalisation, or significant changes in a customer&rsquo;s care circumstances.
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    Such refunds are considered individually and are discretionary unless a refund is otherwise required by applicable law.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3" id="refund-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>How Refunds Are Processed</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where a refund is approved, it will normally be made to the original payment method used for the transaction.
              </p>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-semibold text-sm sm:text-base">
                EverEase normally initiates approved refunds within 5&ndash;10 business days after the refund has been confirmed.
              </div>
              <p className="text-slate-700 text-base sm:text-lg">
                Once a refund has been initiated, the time required for the funds to appear in your bank or card account may vary depending on your payment method, bank, card issuer, or payment service provider.
              </p>
              <p className="text-slate-700 text-sm sm:text-base text-slate-600">
                EverEase cannot control processing times imposed by a customer&rsquo;s bank or card provider.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="refund-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>Family and Third-Party Purchasers</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase services may be purchased by a family member or another person on behalf of the person receiving the service.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                Where a subscription has been purchased by a third party, cancellation and refund requests may normally be made by the purchaser or by the service recipient where their authority to make the request can reasonably be confirmed.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                Refunds will normally be returned to the original payment method used by the purchaser.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3" id="refund-section-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">8</span>
                <span>Subscription Renewal and Billing</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase subscriptions may renew automatically according to the billing frequency selected at the time of purchase.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                The applicable price, billing frequency and renewal terms will be displayed before you complete your purchase.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                You may cancel your subscription using the cancellation methods described in Section 3.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                Cancellation before the next scheduled renewal will normally prevent the next recurring charge.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                If a renewal payment has already been processed, any refund will be handled according to this Policy and any applicable statutory rights.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                EverEase will not knowingly charge a customer an amount different from the price and billing terms agreed at the time of purchase, except where a change has been properly notified and is permitted under the applicable contract and law.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4" id="refund-section-9">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">9</span>
                <span>Billing Errors and Payment Disputes</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you believe a payment has been taken incorrectly, please contact us as soon as possible:
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-4 text-sm sm:text-base font-bold text-slate-900">
                <span><strong>Email:</strong> support@everease.co.uk</span>
                <span><strong>Telephone:</strong> 0800 888 2026</span>
              </div>
              <p className="text-slate-700 text-base sm:text-lg">
                We encourage customers to contact EverEase first so that billing errors can be investigated and resolved quickly.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                This does not affect any rights you may have through your bank, card provider, payment provider, or applicable consumer law.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                Where a payment was processed through a third-party payment provider such as Stripe, any approved refund will normally be processed through the relevant payment method.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3" id="refund-section-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">10</span>
                <span>Cancellation Confirmation</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                When we receive a cancellation request, we will normally send confirmation to the email address associated with your EverEase account.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                If you do not receive confirmation, please contact us at <strong>support@everease.co.uk</strong> or <strong>0800 888 2026</strong> so that we can verify the status of your subscription.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                Customers should retain their cancellation confirmation for their records.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3" id="refund-section-11">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">11</span>
                <span>Changes to This Policy</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase may update this Refund &amp; Cancellation Policy from time to time to reflect changes to our services, payment arrangements, business practices, or applicable law.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                Where appropriate, material changes affecting existing customers will be communicated through reasonable means, including email or an account notification.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                The version and effective date shown at the beginning of this Policy identify the current version.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                Any change will not remove or restrict statutory consumer rights that apply to an existing contract.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3" id="refund-section-12">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">12</span>
                <span>Applicable Law</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                This Policy is intended to operate in accordance with applicable law in England and Wales and applicable UK consumer protection requirements.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                Where mandatory consumer legislation gives you rights that are more favourable than the terms of this Policy, those statutory rights will apply.
              </p>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                EverEase will update its subscription processes and customer policies where necessary to comply with applicable UK subscription and consumer-protection requirements.
              </p>
            </section>

            {/* Section 13 / Contact Us */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="refund-section-contact">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">13</span>
                <span>Contact Us</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you have any questions about cancellation, refunds or billing, please contact the EverEase support team.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>EverEase Telephone Support</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Support Hours: 8am&ndash;8pm daily
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>EverEase Email Support</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    support@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    Support Hours: 8am&ndash;8pm daily
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 font-medium text-sm sm:text-base">
                We aim to handle cancellation and refund requests clearly, fairly and without unnecessary delay.
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p>&copy; 2026 EverEase. All rights reserved.</p>
              </div>
            </section>

          </div>
        ) : currentType === 'privacy' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                EVEREASE — Privacy Policy
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                How EverEase collects, uses and protects your personal information
              </p>
              <div className="text-xs font-bold text-slate-500 pt-1">
                Effective date: 17 August 2026 — Last updated: 17 August 2026
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="privacy-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>Introduction</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase (&ldquo;EverEase&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) is committed to protecting the privacy of our Members, their Family Members, and visitors to our website. This Privacy Policy explains what personal data we collect, why we collect it, how we use it, and the rights you have in relation to it, in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                This Policy applies to everevase-e16u.onrender.com and any related applications or services operated by EverEase (together, the &ldquo;Service&rdquo;).
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3" id="privacy-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Who We Are &mdash; the Data Controller</span>
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium space-y-1">
                <p className="font-bold text-slate-900">EverEase UK Safeguarding &amp; Digital Learning Ltd</p>
                <p>Company Registration: England &amp; Wales (Registered in the United Kingdom)</p>
                <p>Registered Office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom</p>
                <p>Information Commissioner&rsquo;s Office (ICO) Data Protection Registration: ZB884210</p>
                <p className="text-xs text-slate-500 pt-1">This entity is the &ldquo;data controller&rdquo; responsible for your personal data.</p>
              </div>
              <p className="text-slate-700 text-base sm:text-lg">
                If we appoint a Data Protection Officer or other privacy contact, their details will be provided in Section 15 below.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3" id="privacy-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Information We Collect</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We may collect the following categories of personal data:
              </p>
              <ul className="space-y-2.5 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Identity and contact data:</strong> name, date of birth (to confirm eligibility), address, email address, and telephone number.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Account data:</strong> login credentials, subscription plan, and account preferences (e.g. text size, high-contrast, or read-aloud settings).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Family Member / Nominated Contact data:</strong> name and contact details of any Family Member added to a Member&rsquo;s Account, and the nature of their relationship to the Member.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Payment data:</strong> billing name, address, and Direct Debit / payment details, processed by our payment provider (we do not store full card or bank account numbers on our own systems).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Communications data:</strong> records of calls to our support line, live chat transcripts, emails, and notes taken during guidance sessions, where relevant to the support provided.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Technical data:</strong> IP address, browser type, device information, and website usage data, collected via cookies and similar technologies (see Section 10).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Accessibility and support needs:</strong> information you choose to share about accessibility requirements, so we can tailor guidance appropriately.
                  </div>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3" id="privacy-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>Special Category Data</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We do not ask Members to provide health information as a condition of using the Service. However, if you choose to share information about your health, mobility, or care arrangements (for example, to explain why you need particular support, or as part of an emergency contact arrangement), we will treat this as special category data under UK GDPR and will only process it with your explicit consent, or where necessary to protect your vital interests or those of another person.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3" id="privacy-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">5</span>
                <span>How We Collect Your Information</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We collect information directly from you when you create an Account, book an introductory call, subscribe to a plan, contact our support line or live chat, or otherwise interact with the Service. We may also receive information from a Family Member acting on your behalf, or automatically through cookies and similar technologies when you use our website.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3" id="privacy-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>How We Use Your Information and Our Legal Basis</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We use your personal data for the following purposes, relying on the legal bases indicated:
              </p>
              <ul className="space-y-2.5 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To create and manage your Account, and to deliver the Service you have subscribed to &mdash; necessary for the performance of our contract with you.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To process payments via Direct Debit or other means &mdash; necessary for the performance of our contract, and to comply with our legal obligations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To provide telephone, chat and guidance support, including keeping records of sessions to ensure continuity of support &mdash; necessary for the performance of our contract and our legitimate interest in providing high-quality, consistent support.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To share relevant updates with a Family Member you have nominated &mdash; based on your consent.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To send you service updates, safety alerts, or (with your consent) marketing communications about new services &mdash; consent, or our legitimate interest in keeping customers informed about their existing subscription.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To improve our website, services and accessibility features &mdash; our legitimate interest in developing and improving the Service.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To detect, prevent and investigate fraud, abuse, or safeguarding concerns &mdash; our legitimate interest and, where relevant, legal obligation, in protecting our Members and our business.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>To comply with our legal and regulatory obligations, including tax, accounting, and consumer protection requirements.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="privacy-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>Sharing Your Information</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Family Members or Nominated Contacts you have chosen to add to your Account, to the extent of the access you have authorised;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Payment processors and our bank, to collect Direct Debit payments;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>IT hosting, telephony, and customer support platform providers who process data on our behalf, under contract and only as instructed by us;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Professional advisers such as accountants, auditors, or legal advisers, where necessary;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Regulators, law enforcement, or other authorities where we are required to do so by law, or where necessary to protect the safety of a Member or another person (for example, in a suspected safeguarding or fraud situation);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>A buyer or successor entity in the event of a sale, merger, or reorganisation of our business, subject to appropriate safeguards.</span>
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-3" id="privacy-section-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">8</span>
                <span>International Transfers</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where any of our service providers are located outside the UK, we ensure appropriate safeguards are in place, such as the UK International Data Transfer Agreement, an adequacy decision, or equivalent standard contractual clauses, before any personal data is transferred.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3" id="privacy-section-9">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">9</span>
                <span>Data Retention</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We retain personal data for as long as your Account is active, and afterwards for as long as necessary to comply with our legal, accounting, or regulatory obligations, resolve disputes, and enforce our agreements. Call recordings and chat transcripts are typically retained for a limited period necessary for quality, training and safeguarding purposes, and are then securely deleted.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium space-y-1">
                <p><strong>Account records:</strong> Retained for duration of membership + 6 years (UK statutory limitation &amp; tax requirements).</p>
                <p><strong>Support call recordings &amp; chat transcripts:</strong> Retained for up to 90 days for training and safeguarding, then securely purged.</p>
                <p><strong>BACS Direct Debit payment records:</strong> Retained for 7 years in compliance with HMRC accounting rules.</p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-3" id="privacy-section-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">10</span>
                <span>Cookies and Similar Technologies</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Our website uses cookies and similar technologies to operate core functionality, remember your accessibility preferences (such as text size and high-contrast mode), and understand how visitors use our site. Where required by law, we will ask for your consent before setting non-essential cookies. You can control or disable cookies through your browser settings, though this may affect how the website functions.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3" id="privacy-section-11">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">11</span>
                <span>Data Security</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We use appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, misuse or alteration, including encryption of data in transit, access controls, and staff training. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3" id="privacy-section-12">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">12</span>
                <span>Your Rights</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Under UK GDPR, you have the right to:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Access the personal data we hold about you;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request correction of inaccurate or incomplete data;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request erasure of your data, in certain circumstances;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request restriction of processing, in certain circumstances;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Object to processing based on our legitimate interests, including direct marketing;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Request a copy of your data in a portable format;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Withdraw consent at any time, where processing is based on consent;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Ask that a Family Member or trusted representative exercise these rights on your behalf, where you have authorised them to do so.</span>
                </li>
              </ul>
              <p className="text-slate-700 text-base sm:text-lg">
                To exercise any of these rights, please contact us using the details in Section 15. We may need to verify your identity before responding, and where a Family Member is acting on a Member&rsquo;s behalf, we may need to confirm their authority to do so.
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-3" id="privacy-section-13">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">13</span>
                <span>How We Support Older and Vulnerable Members</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We recognise that some Members may need additional support to understand this Policy or exercise their privacy rights. We are happy to explain this Policy in plain language over the phone, in large print, or with the involvement of a trusted Family Member, on request.
              </p>
            </section>

            {/* Section 14 */}
            <section className="space-y-3" id="privacy-section-14">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">14</span>
                <span>Changes to This Policy</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Where changes are material, we will notify you by email or through the platform. The &ldquo;Last updated&rdquo; date at the top of this Policy shows when it was last revised.
              </p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="privacy-section-15">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">15</span>
                <span>How to Contact Us</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you have questions about this Privacy Policy or how we handle your personal data, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>Freephone UK Telephone Desk</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Open 8:00 AM &ndash; 8:00 PM (Monday to Sunday, 365 days a year)
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Privacy &amp; Data Protection Officer</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    privacy@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    General Support: support@everease.co.uk
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Postal Address:</strong> Data Protection Officer, EverEase, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.</p>
                <p><strong>ICO Registration:</strong> ZB884210 (UK Data Protection Act 2018)</p>
              </div>
            </section>

            {/* Section 16 */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="privacy-section-16">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">16</span>
                <span>Complaints &amp; Supervisory Authority</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you are unhappy with how we have handled your personal data, please contact us first so we can try to resolve the matter. You also have the right to lodge a complaint with the UK&rsquo;s supervisory authority:
              </p>

              <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-2 text-sm sm:text-base text-slate-800">
                <p className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Information Commissioner&rsquo;s Office (ICO)
                </p>
                <p>Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
                <p><strong>Helpline:</strong> 0303 123 1113</p>
                <p><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">ico.org.uk <ExternalLink className="w-3.5 h-3.5" /></a></p>
              </div>
            </section>

          </div>
        ) : currentType === 'terms' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed font-normal text-base sm:text-lg">
            
            {/* Header intro callout */}
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                EVEREASE — Terms &amp; Conditions
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Terms of use for the EverEase digital learning and support service.
              </p>
              <div className="text-xs font-bold text-slate-500 pt-1">
                Effective date: 17 August 2026 — Last updated: 17 August 2026
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3" id="terms-section-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">1</span>
                <span>Who We Are</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase (&ldquo;EverEase&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) provides a UK-based subscription service offering patient digital skills guidance, plain-English scam and fraud awareness support, smartphone and tablet training, and family support tools for older adults, delivered through our website, telephone support line and online platform (the &ldquo;Service&rdquo;).
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium space-y-1">
                <p className="font-bold text-slate-900">EverEase UK Safeguarding &amp; Digital Learning Ltd</p>
                <p>Company Registration: England &amp; Wales (Registered in the United Kingdom)</p>
                <p>Registered Office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom</p>
                <p>Information Commissioner&rsquo;s Office (ICO) Data Protection Registration: ZB884210</p>
              </div>
              <p className="text-slate-700 text-base sm:text-lg">
                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern access to and use of the Service. By creating an account, booking an introductory call, subscribing to a plan, or otherwise using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3" id="terms-section-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">2</span>
                <span>Definitions</span>
              </h3>
              <ul className="space-y-2.5 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">&ldquo;Account&rdquo;</strong> means the personal account created by a Member or Family Member to access the Service.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">&ldquo;Member&rdquo;</strong> means the individual receiving digital guidance and support through EverEase (typically an older adult).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">&ldquo;Family Member&rdquo; or &ldquo;Nominated Contact&rdquo;</strong> means a relative, carer, or other individual authorised by a Member to help manage the Account, receive updates, or act as an emergency contact.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">&ldquo;Subscription Plan&rdquo;</strong> means the paid plan selected on our Pricing page, billed on a recurring basis.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">&ldquo;Content&rdquo;</strong> means guidance, articles, video calls, telephone support, learning materials and any other material made available through the Service.
                  </div>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3" id="terms-section-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">3</span>
                <span>Eligibility and Accounts</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                You must be at least 18 years old to create an Account and enter into these Terms. Where an Account is created by, or on behalf of, an older adult by a Family Member, the Family Member confirms they have the Member&rsquo;s consent (or appropriate authority, such as power of attorney) to do so.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                You are responsible for keeping your login details confidential and for all activity that takes place under your Account. Please tell us immediately at the contact details in Section 21 if you believe your Account has been accessed without authorisation.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                You agree to provide accurate, current and complete information when registering, and to keep this information up to date.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3" id="terms-section-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">4</span>
                <span>Description of the Service</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                EverEase provides guidance and support intended to help Members use everyday technology more safely and confidently. Depending on your Subscription Plan, this may include:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>One-to-one or group digital skills coaching (by telephone, video call, or in writing);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Plain-English guidance on recognising and avoiding scams and fraud;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Smartphone, tablet and computer familiarisation and troubleshooting support;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>A UK freephone helpline, available during the hours shown on our website (currently 8am&ndash;8pm daily, subject to change);</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Tools allowing a Member to invite a Family Member to receive updates or provide backup support.</span>
                </li>
              </ul>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-950 font-medium">
                <strong>Scope Notice:</strong> The Service is educational and supportive in nature. It is not a substitute for professional financial, legal, medical or IT security advice, and does not include remote access to, or control of, a Member&rsquo;s device unless expressly agreed and consented to for a specific support session.
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4" id="terms-section-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-900 text-sm font-black shrink-0">5</span>
                <span>Scam and Fraud Protection Guidance &mdash; Important Disclaimer</span>
              </h3>
              
              <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 text-amber-950">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>Important Legal Disclaimer</span>
                </div>
                <p className="text-base sm:text-lg leading-relaxed">
                  While we take care to provide up-to-date and practical guidance on recognising scams and fraudulent activity, EverEase cannot guarantee that a Member will not become the victim of fraud, and we accept no liability for losses arising from scams, fraud, or fraudulent transactions carried out by third parties.
                </p>
                <div className="p-4 bg-white/80 rounded-xl border border-amber-200 text-sm sm:text-base font-bold text-slate-900 space-y-1">
                  <p>🚨 If you believe you or a family member has been the victim of fraud:</p>
                  <ul className="list-disc pl-5 font-normal text-slate-800 space-y-0.5">
                    <li>Contact your bank or building society immediately.</li>
                    <li>Report it to <strong>Action Fraud on 0300 123 2040</strong>.</li>
                    <li>In an emergency or immediate danger, call the police on <strong>999</strong>.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3" id="terms-section-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">6</span>
                <span>Family and Third-Party Access</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Where a Member chooses to add a Family Member or Nominated Contact to their Account, that person may be able to view certain account information, session summaries, or receive notifications, as described within the platform at the point of set-up.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                It is the Member&rsquo;s responsibility to decide what information is shared with a Family Member. EverEase is not responsible for how a Family Member uses information shared with them, and disputes between a Member and their Family Member(s) about access or information sharing are not matters EverEase can resolve or mediate, save that we will act on a clear, verified instruction from the Account holder to change access settings.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3" id="terms-section-7">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">7</span>
                <span>Subscription Plans and Pricing</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Current Subscription Plans and pricing are set out on our Pricing page. We may offer a free introductory call or trial period; where offered, its terms will be made clear at the point of booking.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                We reserve the right to change our prices or plans. Where a price change affects an active subscription, we will give you at least 30 days&rsquo; notice before the change takes effect, and you may cancel before the new price applies.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3" id="terms-section-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">8</span>
                <span>Payment Terms</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Subscription fees are collected by BACS Direct Debit (or another payment method we make available) on a recurring basis in accordance with the billing cycle of your chosen plan. By providing payment details, you authorise us (or our payment processor) to collect the applicable fees when due.
              </p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-sm sm:text-base text-emerald-950 font-medium">
                <div className="font-bold flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>The Direct Debit Guarantee</span>
                </div>
                <p>
                  Direct Debit payments are protected by the Direct Debit Guarantee. If you believe a payment has been taken in error, you are entitled to an immediate refund from your bank.
                </p>
              </div>
              <p className="text-slate-700 text-base sm:text-lg">
                If a payment fails or is declined, we may suspend or restrict access to the Service until payment is successfully made, and may retry collection in accordance with standard Direct Debit practice.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3" id="terms-section-9">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">9</span>
                <span>Cancellation and Refunds</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                You may cancel your Subscription Plan at any time via your Account settings or by contacting our support line; cancellation will take effect at the end of the current billing period unless otherwise stated at sign-up.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                If you are a consumer in the UK, you generally have a statutory right to cancel a distance contract for services within 14 days of subscribing without giving a reason, in accordance with the Consumer Contracts Regulations 2013, unless you have expressly requested that the Service begin during that period and expressly acknowledged that your cancellation right will be lost once the Service is fully performed.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Refund Policy for Billing Periods &amp; Sessions:</p>
                <p>If you cancel within your first 30 days on any monthly or annual plan, you are entitled to a full 100% money-back refund on request. For ongoing monthly subscriptions cancelled after the 30-day initial period, access remains active until the end of your prepaid billing period without further charge.</p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-3" id="terms-section-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">10</span>
                <span>Your Responsibilities</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                When using the Service, you agree that you will:
              </p>
              <ul className="space-y-2 text-slate-700 text-base sm:text-lg pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Use the Service only for lawful purposes and in accordance with these Terms;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Not attempt to gain unauthorised access to any part of the Service, other Members&rsquo; Accounts, or our systems;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Not use the Service to harass, abuse, or threaten our staff or other users;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Not misuse the Service to test, probe or interfere with the security of our platform;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black mt-1">•</span>
                  <span>Provide accurate information necessary for us to deliver the Service safely and effectively.</span>
                </li>
              </ul>
              <p className="text-slate-700 text-base sm:text-lg">
                We reserve the right to suspend or terminate an Account that breaches these Terms, acts abusively towards our staff, or misuses the Service.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3" id="terms-section-11">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">11</span>
                <span>Accessibility</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We aim to make the Service accessible to older adults and people with a range of needs, including adjustable text size, high-contrast display, and read-aloud functionality on our website. If you experience accessibility barriers, please contact us using the details in Section 21 so we can assist you.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3" id="terms-section-12">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">12</span>
                <span>Intellectual Property</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                All content, trademarks, logos, software and materials made available as part of the Service (excluding content you provide) are owned by, or licensed to, EverEase and are protected by copyright, trademark and other intellectual property laws. You may use such Content for your personal, non-commercial use in connection with the Service only, and may not copy, reproduce, distribute or create derivative works from it without our prior written consent.
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-3" id="terms-section-13">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">13</span>
                <span>Third-Party Links and Services</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                The Service may contain links to third-party websites, apps, or services (for example, device manufacturers or banking apps referenced during guidance sessions). We do not control and are not responsible for the content, accuracy, or practices of any third-party sites or services.
              </p>
            </section>

            {/* Section 14 */}
            <section className="space-y-3" id="terms-section-14">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">14</span>
                <span>Availability of the Service</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We aim to keep the Service available at all times, but we do not guarantee uninterrupted access. We may suspend, withdraw or restrict availability of all or part of the Service for maintenance, upgrades, or reasons outside our reasonable control, and will try to give reasonable notice where practicable.
              </p>
            </section>

            {/* Section 15 */}
            <section className="space-y-3" id="terms-section-15">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">15</span>
                <span>Limitation of Liability</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Nothing in these Terms limits or excludes our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot be limited or excluded under English law.
              </p>
              <p className="text-slate-700 text-base sm:text-lg">
                Subject to the above, EverEase shall not be liable for any indirect or consequential loss, or for losses arising from scams, fraud, or unauthorised transactions carried out by third parties (as set out in Section 5), and our total liability to you arising out of or in connection with these Terms shall not exceed the total fees paid by you for the Service in the 12 months preceding the event giving rise to the claim.
              </p>
            </section>

            {/* Section 16 */}
            <section className="space-y-3" id="terms-section-16">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">16</span>
                <span>Indemnity</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                You agree to indemnify and hold EverEase harmless from any claims, losses, or expenses (including reasonable legal fees) arising from your breach of these Terms or misuse of the Service, except to the extent caused by our own negligence or breach.
              </p>
            </section>

            {/* Section 17 */}
            <section className="space-y-3" id="terms-section-17">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">17</span>
                <span>Data Protection and Privacy</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Our collection and use of personal data is described in our Privacy Policy, which forms part of these Terms. By using the Service, you acknowledge that your information will be processed as set out in that Policy.
              </p>
            </section>

            {/* Section 18 */}
            <section className="space-y-3" id="terms-section-18">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">18</span>
                <span>Changes to These Terms</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                We may update these Terms from time to time, for example to reflect changes in our Service, technology, or legal requirements. Where changes are material, we will notify you by email or through the platform at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 19 */}
            <section className="space-y-3" id="terms-section-19">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">19</span>
                <span>Termination</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                Either party may terminate an Account and these Terms as described in Section 9 (Cancellation). We may suspend or terminate your Account immediately if you materially breach these Terms, engage in abusive conduct, or if required to do so by law.
              </p>
            </section>

            {/* Section 20 */}
            <section className="space-y-3" id="terms-section-20">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">20</span>
                <span>Governing Law and Jurisdiction</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                These Terms are governed by the laws of England and Wales. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales, save that if you live in Scotland or Northern Ireland you may also bring proceedings in your local courts.
              </p>
            </section>

            {/* Section 21 */}
            <section className="space-y-3" id="terms-section-21">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-black shrink-0">21</span>
                <span>Complaints</span>
              </h3>
              <p className="text-slate-700 text-base sm:text-lg">
                If you are unhappy with any aspect of the Service, please contact us in the first instance using the details below so we can try to resolve the matter. Where relevant, you may also be entitled to refer certain disputes to an alternative dispute resolution provider or the relevant ombudsman.
              </p>
            </section>

            {/* Section 22 */}
            <section className="space-y-4 pt-4 border-t border-slate-200" id="terms-section-22">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-black shrink-0">22</span>
                <span>Contact Us</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <PhoneCall className="w-5 h-5 text-emerald-700" />
                    <span>Freephone UK Telephone Desk</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-950">
                    0800 888 2026
                  </p>
                  <p className="text-xs font-semibold text-emerald-800">
                    Open 8:00 AM &ndash; 8:00 PM (Monday to Sunday, 365 days a year)
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Written &amp; Legal Support</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    support@everease.co.uk
                  </p>
                  <p className="text-xs text-slate-600">
                    Legal &amp; Safeguarding Compliance: legal@everease.co.uk
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Postal Address:</strong> EverEase, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.</p>
                <p><strong>ICO Registration:</strong> ZB884210 (UK Data Protection Act 2018)</p>
              </div>
            </section>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 font-bold text-sm">
              Official EverEase Document &mdash; {config.title}
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-slate-800 font-medium text-base sm:text-lg leading-relaxed">
              <h3 className="text-xl font-bold text-slate-900">
                {config.title}
              </h3>
              <p>
                This policy governs {config.subtitle.toLowerCase()}. EverEase operates under the laws of England and Wales and complies fully with the UK Data Protection Act 2018, the Consumer Rights Act 2015, and the BACS Direct Debit Scheme Rules.
              </p>
              <p>
                For any inquiries regarding this policy or to request documentation in large print or braille, please call our UK freephone desk on <strong>0800 888 2026</strong> (8am&ndash;8pm daily) or email <strong>legal@everease.co.uk</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Contact / Help Footer Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black text-white">
              Questions about our Terms &amp; Policies?
            </h3>
            <p className="text-slate-300 text-sm font-medium">
              We are committed to total transparency. Speak with our UK team or book an introductory call.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="shrink-0 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="shrink-0 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              View Pricing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

