import React, { useState } from 'react';
import { 
  MapPin,
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import contactHeroImg from '../../assets/images/contact_helpline_uk_1786863656448.jpg';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();

  // Contact Form State matching screenshot
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [enquiryType, setEnquiryType] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter your message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMsgSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" id="public-contact-page">
      {/* =========================================================================
          HERO SECTION: CONTACT US
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#043d2f] to-[#0f172a] text-white py-14 sm:py-20 lg:py-24 px-4 relative overflow-hidden" id="contact-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Dedicated UK Telephone &amp; Online Support</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We are here to <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">help you</span> every day.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              Get in touch with our friendly UK-based team. Whether you have questions about our membership plans or need assistance with everyday digital tasks, we are ready to assist.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="tel:08008882026"
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 rounded-2xl font-black text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border-2 border-teal-300 cursor-pointer no-underline"
              >
                <Phone className="w-5 h-5 text-slate-950" />
                <span>Call: +44 (0) 330 401 0019</span>
              </a>

              <a
                href="#send-message-card"
                className="px-7 py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-100 rounded-2xl font-extrabold text-lg shadow-lg border-2 border-slate-600 transition-all flex items-center justify-center gap-2.5 cursor-pointer no-underline"
              >
                <MessageSquare className="w-5 h-5 text-teal-400" />
                <span>Send Us a Message</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-teal-500/30 shadow-2xl bg-slate-800">
              <img
                src={contactHeroImg}
                alt="Pleasant UK support specialist with telephone headset at desk in bright modern office"
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
                    UK-Based Support Team
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    London, United Kingdom • Open Mon–Fri 9:00 AM – 5:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN CONTACT SECTION: 2-COLUMN LAYOUT MATCHING SCREENSHOT ee6.jpg
          ========================================================================= */}
      <div className="w-full max-w-[1300px] mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: GET IN TOUCH DETAILS */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch
            </h2>

            <div className="space-y-6">
              {/* 1. Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-base font-bold text-slate-900">Address</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    160 City Road<br />
                    Kemp House<br />
                    London, EC1V 2NX
                  </p>
                </div>
              </div>

              {/* 2. Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-base font-bold text-slate-900">Phone</h3>
                  <a 
                    href="tel:+443304010019" 
                    className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors block"
                  >
                    +44 (0) 330 401 0019
                  </a>
                </div>
              </div>

              {/* 3. Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-teal-600" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-base font-bold text-slate-900">Email</h3>
                  <a 
                    href="mailto:support@everease.co.uk" 
                    className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors block"
                  >
                    support@everease.co.uk
                  </a>
                </div>
              </div>

              {/* 4. WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-base font-bold text-slate-900">WhatsApp</h3>
                  <p className="text-sm font-bold text-slate-800">Available to members</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Direct messaging support is included with active member subscriptions.
                  </p>
                </div>
              </div>

              {/* 5. Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-base font-bold text-slate-900">Business Hours</h3>
                  <p className="text-sm text-slate-600 font-medium">
                    Monday to Friday<br />
                    9:00 AM – 5:30 PM (UK Time)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SEND US A MESSAGE CARD (MATCHING SCREENSHOT ee6.jpg) */}
          <div className="lg:col-span-7" id="send-message-card">
            <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Send Us a Message
                </h3>
                <p className="text-sm text-slate-600 font-normal mt-1.5 leading-relaxed">
                  Please fill in the form below and we’ll get back to you as soon as possible.
                </p>
              </div>

              {msgSuccess ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Message Received!</h4>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed max-w-md mx-auto">
                    Thank you, <strong>{fullName}</strong>. Our UK support team has received your enquiry and will respond to <strong>{emailAddress}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgSuccess(false);
                      setFullName('');
                      setEmailAddress('');
                      setPhoneNumber('');
                      setEnquiryType('');
                      setMessage('');
                    }}
                    className="mt-3 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMessageSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                    />
                  </div>

                  {/* 2. Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                    />
                  </div>

                  {/* 3. Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                    />
                  </div>

                  {/* 4. Are you enquiring for yourself or a family member? */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Are you enquiring for yourself or a family member?
                    </label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                    >
                      <option value="">Please select...</option>
                      <option value="myself">For myself (Senior)</option>
                      <option value="family">For a family member / loved one</option>
                      <option value="caregiver">For a client / care organization</option>
                      <option value="general">General enquiry</option>
                    </select>
                  </div>

                  {/* 5. Your Message */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can we educate?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

