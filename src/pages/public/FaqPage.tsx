import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  PhoneCall, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import faqHeroImg from '../../assets/images/faq_support_help_1786863640612.jpg';

interface FaqPageProps {
  navigate: (route: string) => void;
}

interface FaqItem {
  id: string;
  category: 'Billing' | 'Security & Data' | 'Family Connect' | 'Scam Protection' | 'General';
  question: string;
  answer: string;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    faq_1: true,
    faq_2: false,
    faq_3: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FaqItem[] = [
    {
      id: 'faq_1',
      category: 'Billing',
      question: 'How does billing and Direct Debit work?',
      answer: 'EverEase collects membership subscriptions on a monthly recurring basis via UK Direct Debit powered by Stripe. Direct Debit is the UK’s safest recurring payment method and is protected by the Direct Debit Guarantee. You will always be notified in writing at least 3 working days prior to your first payment or any scheduled change in billing amount.'
    },
    {
      id: 'faq_2',
      category: 'Billing',
      question: 'Why is there no direct credit card checkout on the website?',
      answer: 'For your maximum financial security and scam prevention, we never collect card numbers on our website. Official invoices with secure BACS Direct Debit & Stripe payment links are dispatched directly to your email, giving you complete verification and protection under UK banking laws.'
    },
    {
      id: 'faq_3',
      category: 'Billing',
      question: 'What happens if a monthly Direct Debit payment fails?',
      answer: 'If a payment fails due to temporary bank issues, Stripe will automatically re-attempt the charge after 3 business days. You and your designated family contacts will receive a friendly, non-punitive notification by email or SMS. We do not charge late fees or immediately suspend your digital tools.'
    },
    {
      id: 'faq_4',
      category: 'Family Connect',
      question: 'How do Family Connect permissions work, and can family see everything?',
      answer: 'No, your family can only see what you explicitly grant them permission to see. You are always in complete control. For each module (such as Reminders, Document Vault, or Home Manager), you can set family access to "View Only", "Can Edit", or "No Access". You can revoke access anytime with one click.'
    },
    {
      id: 'faq_5',
      category: 'Scam Protection',
      question: 'How does the Scam Awareness Shield check suspicious messages?',
      answer: 'You can paste or type the text of any suspicious message, email, or describe a phone caller into the Scam Scanner. Our plain-English system immediately analyses the language for urgency tricks, fake links, and known UK fraud patterns, giving you a clear Green, Amber, or Red safety verdict with exact instructions on what to do next.'
    },
    {
      id: 'faq_6',
      category: 'Security & Data',
      question: 'Is my personal information and document vault secure?',
      answer: 'Yes, absolutely. EverEase uses bank-grade 256-bit encryption for all stored files and records. We strictly adhere to UK GDPR laws and never sell, share, or monetize your data with third-party advertisers.'
    },
    {
      id: 'faq_7',
      category: 'General',
      question: 'Can I speak with a real person on the phone if I get stuck?',
      answer: 'Yes! All EverEase members have access to our UK Freephone helpline (0800 888 2026), open 8am to 8pm daily. Our friendly, patient British team is always happy to walk you through any question without rushing.'
    },
    {
      id: 'faq_8',
      category: 'General',
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes. There are no minimum term contracts or exit fees. You can cancel your rolling monthly subscription at any time from your member dashboard or by giving our support desk a quick call.'
    }
  ];

  const toggleFaq = (id: string) => {
    const nextState = !openItems[id];
    setOpenItems(prev => ({ ...prev, [id]: nextState }));
    if (nextState) {
      const item = faqs.find(f => f.id === id);
      if (item) {
      }
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
              Everything you need to know about EverEase membership, Direct Debit security, family permissions, and UK phone support.
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
                <span>Call UK Helpline: 0800 888 2026</span>
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
                    Reach real human support advisors 7 days a week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Search & Accordion Container */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20 space-y-10">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="faq-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords (e.g. 'direct debit', 'scams', 'phone')..."
            className="w-full pl-13 pr-4 py-4 rounded-2xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none bg-white text-base sm:text-lg font-medium shadow-xs"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['All', 'Billing', 'Security & Data', 'Family Connect', 'Scam Protection', 'General'].map((category) => (
            <button
              key={category}
              type="button"
              id={`btn-faq-cat-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-xl font-black text-slate-800">No questions found matching your search</h3>
              <p className="text-slate-600 font-medium text-sm">
                Try searching for another term, or call our UK helpline on 0800 888 2026.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                    isOpen ? 'border-teal-600 shadow-md' : 'border-slate-200 shadow-xs hover:border-teal-400'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg sm:text-xl font-black text-slate-900">
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-xl transition-colors ${
                      isOpen ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-slate-700 text-base sm:text-lg leading-relaxed font-medium border-t border-slate-100">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Direct Phone Assistance Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4 shadow-md">
          <h3 className="text-2xl font-black">Still have a question?</h3>
          <p className="text-slate-300 text-base font-medium max-w-xl mx-auto">
            Our friendly British customer support team is available on Freephone <strong className="text-teal-300 font-black">0800 888 2026</strong> from 8am to 8pm daily.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <a
              href="tel:08008882026"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-base transition-all inline-flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call 0800 888 2026</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
