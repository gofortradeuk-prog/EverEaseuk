import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Mail, 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  User, 
  MessageSquare,
  Building,
  HeartHandshake,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import contactHeroImg from '../../assets/images/contact_helpline_uk_1786863656448.jpg';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { speakText } = useAccessibility();

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // General Message Form State
  const [msgName, setMsgName] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [msgSubject, setMsgSubject] = useState('General Enquiry');
  const [msgContent, setMsgContent] = useState('');
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Check if query had ?book=call
  useEffect(() => {
    if (window.location.search.includes('book=call')) {
      const bookElem = document.getElementById('book-call-card');
      if (bookElem) {
        bookElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim() || !bookingDate) {
      return;
    }
    setBookingSuccess(true);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName.trim() || (!msgEmail.trim() && !msgPhone.trim()) || !msgContent.trim()) {
      return;
    }
    setMsgSuccess(true);
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
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
              <span>Dedicated UK Telephone &amp; Email Support</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We are here to <span className="text-teal-300 underline decoration-teal-500/50 underline-offset-8">help you</span> every day.
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              Call our UK Freephone helpline directly, book a free introductory telephone appointment, or send our friendly team a quick message.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="tel:08008882026"
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 rounded-2xl font-black text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border-2 border-teal-300 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-slate-950" />
                <span>Call Freephone: 0800 888 2026</span>
              </a>

              <a
                href="#book-call-card"
                className="px-7 py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-100 rounded-2xl font-extrabold text-lg shadow-lg border-2 border-slate-600 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-teal-400" />
                <span>Book a Call Time</span>
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
                    Based in the United Kingdom • Open 8am–8pm Daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Telephone Card + Book a Call + Send Message */}
      <div className="w-full max-w-[1500px] mx-auto px-4 py-16 sm:py-20 space-y-12">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border-2 border-teal-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Freephone Helpline</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">0800 888 2026</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Free to call from all UK landlines and mobiles. Open 8:00 AM to 8:00 PM, 7 days a week.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Email Support Desk</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">support@everease.co.uk</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Send us an email anytime. Our team replies in plain English within 1 business day.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">UK Headquarters</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">London, United Kingdom</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Registered in England &amp; Wales. Fully compliant with UK GDPR &amp; Safeguarding Standards.
            </p>
          </div>
        </div>

        {/* Two Forms Grid: Book a Call & Send a Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form 1: Book a Free Intro Call */}
          <div id="book-call-card" className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border-2 border-teal-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-teal-50 rounded-2xl text-teal-700">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Book an Intro Call</h2>
                <p className="text-xs font-bold text-teal-800">We will phone you at a time that suits you</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Call Request Received!</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Thank you, <strong>{bookingName}</strong>. One of our friendly UK advisors will call you at <strong>{bookingPhone}</strong> on <strong>{bookingDate}</strong> at <strong>{bookingTime}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setBookingSuccess(false)}
                  className="mt-2 text-xs font-bold text-teal-700 underline"
                >
                  Book another time
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="booking-name">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    id="booking-name"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Margaret Smith"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="booking-phone">
                    Telephone Number (UK) *
                  </label>
                  <input
                    type="tel"
                    id="booking-phone"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="e.g. 07123 456789 or 0161 123456"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="booking-date">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="booking-date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="booking-time">
                      Preferred Time *
                    </label>
                    <select
                      id="booking-time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                    >
                      <option value="10:00 AM">Morning (10:00 AM)</option>
                      <option value="11:30 AM">Morning (11:30 AM)</option>
                      <option value="02:00 PM">Afternoon (2:00 PM)</option>
                      <option value="03:30 PM">Afternoon (3:30 PM)</option>
                      <option value="05:00 PM">Late Afternoon (5:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="booking-notes">
                    What would you like help with? (Optional)
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Help setting up iPad, scam check, or choosing a subscription plan..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-call-booking"
                  className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-xl text-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Confirm Free Telephone Appointment</span>
                </button>
              </form>
            )}
          </div>

          {/* Form 2: Send Us a Message */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-teal-50 rounded-2xl text-teal-700">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Send Us a Message</h2>
                <p className="text-xs font-bold text-slate-500">We will respond by email or phone</p>
              </div>
            </div>

            {msgSuccess ? (
              <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Message Dispatched!</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Thank you, <strong>{msgName}</strong>. Our UK support team has received your enquiry and will be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setMsgSuccess(false)}
                  className="mt-2 text-xs font-bold text-teal-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="msg-name">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="msg-name"
                    required
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="msg-email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="msg-email"
                      value={msgEmail}
                      onChange={(e) => setMsgEmail(e.target.value)}
                      placeholder="your.email@example.co.uk"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="msg-phone">
                      Telephone Number
                    </label>
                    <input
                      type="tel"
                      id="msg-phone"
                      value={msgPhone}
                      onChange={(e) => setMsgPhone(e.target.value)}
                      placeholder="e.g. 07123 456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="msg-subject">
                    Subject
                  </label>
                  <select
                    id="msg-subject"
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Membership & Billing">Membership &amp; Direct Debit Question</option>
                    <option value="Scam Verification Question">Scam Verification Help</option>
                    <option value="Family Connect Help">Family Member Connection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="msg-content">
                    Your Message *
                  </label>
                  <textarea
                    id="msg-content"
                    rows={4}
                    required
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-general-message"
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message to UK Support</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
