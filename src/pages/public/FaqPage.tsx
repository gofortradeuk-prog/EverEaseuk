import React, { useState } from 'react';
import { 
  HelpCircle, 
  RefreshCw, 
  Landmark, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import faqHeroImg from '../../assets/images/faq_support_help_1786863640612.jpg';

interface FaqPageProps {
  navigate: (route: string) => void;
}

interface FaqItem {
  id: string;
  globalIndex: number;
  category: 'general' | 'refunds' | 'billing';
  categoryLabel: string;
  question: string;
  answer: string;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'refunds' | 'billing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allFaqs: FaqItem[] = [
    // ---------------------------------------------------------
    // CATEGORY 1: General & Support (7 questions)
    // ---------------------------------------------------------
    {
      id: 'faq-1',
      globalIndex: 1,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'What does the EverEase digital support platform educate on?',
      answer: 'The EverEase digital support platform educates on everyday digital tasks such as smartphones, WhatsApp, emails, video calls, online forms, reminders, and general digital confidence support via our secure portal.'
    },
    {
      id: 'faq-2',
      globalIndex: 2,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'Is EverEase a care or medical service?',
      answer: 'No. EverEase is a digital support platform and subscription service providing software tools, guidance dashboards, and friendly technology assistance. We are not a medical, emergency, nursing, or regulated care provider.'
    },
    {
      id: 'faq-3',
      globalIndex: 3,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'How do the monthly membership plans work?',
      answer: 'Our membership subscriptions are billed monthly and renew automatically until cancelled. Each membership plan includes a different level of portal access, response priorities, and family account features.'
    },
    {
      id: 'faq-4',
      globalIndex: 4,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'Who is EverEase designed for?',
      answer: 'EverEase is designed for UK seniors, retirees, and older adults who want clear, unhurried digital confidence, as well as family members and carers looking for reassurance, scam prevention, and shared organizational tools.'
    },
    {
      id: 'faq-5',
      globalIndex: 5,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'Can family members or carers access the portal?',
      answer: 'Yes. With Family Connect, members can optionally invite a designated son, daughter, or caregiver with custom permissions (View Only, Can Edit, or No Access) for reminders, documents, and scam alerts while preserving full personal autonomy.'
    },
    {
      id: 'faq-6',
      globalIndex: 6,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'How does telephone and ticket support work?',
      answer: 'Members can call our dedicated UK telephone line (+44 (0) 330 401 0019 / Freephone 0800 888 2026) or submit a ticket directly from the portal for patient, step-by-step guidance with zero developer jargon.'
    },
    {
      id: 'faq-7',
      globalIndex: 7,
      category: 'general',
      categoryLabel: 'General & Support',
      question: 'Is my personal data and document vault secure?',
      answer: 'Yes. All document vault storage and personal records are encrypted with 256-bit bank-grade security, fully compliant with the UK Data Protection Act 2018 and UK GDPR standards.'
    },

    // ---------------------------------------------------------
    // CATEGORY 2: Refunds & Cancellations (7 questions)
    // ---------------------------------------------------------
    {
      id: 'faq-8',
      globalIndex: 8,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'What is the EverEase cancellation policy?',
      answer: 'You can cancel your subscription at any time with zero penalty or exit fees through your portal dashboard, by emailing support@everease.co.uk, or by calling our UK helpline on +44 (0) 330 401 0019.'
    },
    {
      id: 'faq-9',
      globalIndex: 9,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'Is there a 14-day statutory cooling-off period?',
      answer: 'Yes. Under the UK Consumer Contracts Regulations 2013, all new subscribers enjoy a 14-day statutory cooling-off period from initial sign-up for a 100% full refund if no 1-on-1 personalized tutoring services were utilized.'
    },
    {
      id: 'faq-10',
      globalIndex: 10,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'Can I pause my subscription if I am away or in hospital?',
      answer: 'Yes. You may pause your subscription for up to 3 consecutive months for temporary reasons such as extended holidays, hospital stays, or convalescence, with no billing during the pause period.'
    },
    {
      id: 'faq-11',
      globalIndex: 11,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'How are cancellations handled during a monthly cycle?',
      answer: 'When you cancel a monthly subscription, cancellation takes effect at the end of the current paid billing cycle, and you retain full platform access until that date with no additional charges.'
    },
    {
      id: 'faq-12',
      globalIndex: 12,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'How do I request a refund if eligible?',
      answer: 'To request a refund, simply email support@everease.co.uk or call our UK support desk with your Member ID. Eligible refunds are reviewed within 2 business days and credited to your original payment method within 5–10 working days.'
    },
    {
      id: 'faq-13',
      globalIndex: 13,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'Are there any hidden fees or cancellation penalties?',
      answer: 'None whatsoever. EverEase operates on 100% transparent pricing. There are no registration fees, setup charges, minimum contract terms, or cancellation penalties.'
    },
    {
      id: 'faq-14',
      globalIndex: 14,
      category: 'refunds',
      categoryLabel: 'Refunds & Cancellations',
      question: 'What happens to my stored data if I cancel?',
      answer: 'If you cancel, you will have 30 days of read-only access to download and export your saved documents and records before your account is securely archived in compliance with UK GDPR.'
    },

    // ---------------------------------------------------------
    // CATEGORY 3: Direct Debit & Billing (6 questions)
    // ---------------------------------------------------------
    {
      id: 'faq-15',
      globalIndex: 15,
      category: 'billing',
      categoryLabel: 'Direct Debit & Billing',
      question: 'How does BACS Direct Debit billing work?',
      answer: 'Monthly membership payments are collected securely via Stripe BACS Direct Debit. You receive an automated advance email notification at least 3 working days prior to any collection.'
    },
    {
      id: 'faq-16',
      globalIndex: 16,
      category: 'billing',
      categoryLabel: 'Direct Debit & Billing',
      question: 'What is the UK Direct Debit Guarantee?',
      answer: 'The Direct Debit Guarantee protects all UK bank account holders. If an error is made in the payment of your Direct Debit, you are entitled to a full and immediate refund from your bank or building society.'
    },
    {
      id: 'faq-17',
      globalIndex: 17,
      category: 'billing',
      categoryLabel: 'Direct Debit & Billing',
      question: 'Can I pay by credit or debit card instead of Direct Debit?',
      answer: 'Yes. While BACS Direct Debit is recommended for recurring monthly memberships, we also accept Visa, Mastercard, and American Express via secure Stripe online invoice links.'
    },
    {
      id: 'faq-18',
      globalIndex: 18,
      category: 'billing',
      categoryLabel: 'Direct Debit & Billing',
      question: 'Why do you send a Stripe invoice and payment link?',
      answer: 'To prevent fraud and ensure bank-grade security, EverEase never stores or asks for unencrypted card numbers on the public web. Official Stripe invoices provide encrypted, compliant checkout.'
    },
    {
      id: 'faq-19',
      globalIndex: 19,
      category: 'billing',
      categoryLabel: 'Direct Debit & Billing',
      question: 'What happens if a monthly Direct Debit payment fails?',
      answer: 'If a payment fails due to insufficient funds or bank delays, Stripe re-attempts the charge after 3 days. We notify you via email and never charge punitive late fees or immediately suspend your account.'
    },
    {
      id: 'faq-20',
      globalIndex: 20,
      category: 'billing',
      categoryLabel: 'Direct Debit & Billing',
      question: 'How do I change my billing details or bank account?',
      answer: 'You can easily update your payment method directly in your Member Portal under "Billing & Invoices" or by contacting our UK billing team on +44 (0) 330 401 0019.'
    }
  ];

  // Filtering
  const filteredFaqs = allFaqs.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryHeading = () => {
    switch (activeTab) {
      case 'general':
        return 'General Platform & Subscription FAQs';
      case 'refunds':
        return 'Refunds & Cancellation FAQs';
      case 'billing':
        return 'Direct Debit & Billing FAQs';
      default:
        return 'General Platform & Subscription FAQs';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-faq-page">
      {/* =========================================================================
          HERO SECTION: FAQ
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="faq-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Plain-English Answers</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Frequently Asked <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">Questions</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              Everything you need to know about EverEase membership, Direct Debit security, family permissions, refunds, and UK phone support.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                id="btn-faq-freephone"
                onClick={() => {
                  window.location.href = 'tel:08008882026';
                }}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <PhoneCall className="w-5 h-5 text-slate-950" />
                <span>Call UK Helpline: +44 (0) 330 401 0019</span>
              </button>

              <button
                type="button"
                id="btn-faq-contact-us"
                onClick={() => {
                  navigate('/contact');
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <span>Send Us a Message</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-teal-500/30 shadow-2xl bg-slate-800">
              <img
                src={faqHeroImg}
                alt="Friendly UK customer care advisor smiling warmly while holding tablet in modern bright office"
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
                    Friendly UK Phone Team
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Reach real human support advisors Mon–Fri 9:00 AM – 5:30 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ TAB PILLS & LIST CONTAINER (MATCHING SCREENSHOT ee7.jpg)
          ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        
        {/* Category Pill Tabs matching screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          {/* Tab 1: All Questions (20) */}
          <button
            type="button"
            id="tab-faq-all"
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
              activeTab === 'all'
                ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            All Questions (20)
          </button>

          {/* Tab 2: General & Support (7) */}
          <button
            type="button"
            id="tab-faq-general"
            onClick={() => setActiveTab('general')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
              activeTab === 'general'
                ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            General &amp; Support (7)
          </button>

          {/* Tab 3: Refunds & Cancellations (7) */}
          <button
            type="button"
            id="tab-faq-refunds"
            onClick={() => setActiveTab('refunds')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === 'refunds'
                ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${activeTab === 'refunds' ? 'text-white' : 'text-teal-600'}`} />
            <span>Refunds &amp; Cancellations (7)</span>
          </button>

          {/* Tab 4: Direct Debit & Billing (6) */}
          <button
            type="button"
            id="tab-faq-billing"
            onClick={() => setActiveTab('billing')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Landmark className={`w-3.5 h-3.5 ${activeTab === 'billing' ? 'text-white' : 'text-teal-600'}`} />
            <span>Direct Debit &amp; Billing (6)</span>
          </button>
        </div>

        {/* Section Header with teal circle question mark icon */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-teal-100/90 text-teal-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-teal-700" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {getCategoryHeading()}
          </h2>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const displayNumber = index + 1;
            return (
              <div
                key={faq.id}
                id={`faq-card-${faq.id}`}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all space-y-2.5 text-left"
              >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  <span className="text-teal-700 font-extrabold mr-1.5">{displayNumber}.</span> {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            );
          })}
        </div>

        {/* Direct Assistance Card at Bottom */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-md">
          <h3 className="text-2xl font-black">Still have a question?</h3>
          <p className="text-slate-300 text-base font-normal max-w-xl mx-auto leading-relaxed">
            Our friendly British customer support team is available on <strong className="text-teal-300 font-bold">+44 (0) 330 401 0019</strong> or Freephone <strong className="text-teal-300 font-bold">0800 888 2026</strong> from 9am to 5:30pm Monday to Friday.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+443304010019"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-sm sm:text-base transition-all inline-flex items-center gap-2 no-underline"
            >
              <PhoneCall className="w-5 h-5 text-slate-950" />
              <span>Call +44 (0) 330 401 0019</span>
            </a>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm sm:text-base transition-all border border-slate-700 cursor-pointer"
            >
              Send Us a Message
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

