import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Users, 
  Phone, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { Guide } from '../../types';
import { getGuides, INITIAL_SEEDED_GUIDES } from '../../lib/firestoreService';
import { DigitalHelpChat } from '../../components/digitalHelp/DigitalHelpChat';
import { GuideGrid } from '../../components/digitalHelp/GuideGrid';
import { GuideReaderModal } from '../../components/digitalHelp/GuideReaderModal';
import { AskFamilyHelpModal } from '../../components/digitalHelp/AskFamilyHelpModal';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  navigate: (route: string) => void;
  initialQuery?: string | null;
}

export const DigitalHelpPage: React.FC<Props> = ({ navigate, initialQuery }) => {
  const { userProfile } = useAuth();
  const [guides, setGuides] = useState<Guide[]>(INITIAL_SEEDED_GUIDES);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [familyQuestion, setFamilyQuestion] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Load guides from Firestore or use seeded fallback
  useEffect(() => {
    async function loadGuides() {
      try {
        const loaded = await getGuides();
        if (loaded && loaded.length > 0) {
          setGuides(loaded);
        }
      } catch (err) {
        console.warn('Using seeded guides fallback:', err);
      }
    }
    loadGuides();
  }, []);

  const handleAskFamily = (question: string) => {
    setFamilyQuestion(question);
  };

  const handleFamilyNotified = (carers: string[]) => {
    const names = carers.length > 0 ? carers.join(', ') : 'your linked family carer';
    setNotificationToast(`Your question was sent to ${names}. They have been alerted on their phone.`);
    setTimeout(() => {
      setNotificationToast(null);
    }, 5000);
  };

  return (
    <div id="digital-help-page" className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div 
          id="family-notified-toast"
          className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-6 py-4 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-3 animate-slideIn"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
          <p className="text-sm sm:text-base font-semibold">{notificationToast}</p>
        </div>
      )}

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white py-8 sm:py-10 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <button
              id="back-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <span className="px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              Step-by-Step Guidance
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/30 flex items-center justify-center border border-teal-400/40">
                  <HelpCircle className="w-7 h-7 text-teal-200" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    "How do I do this?"
                  </h1>
                  <p className="text-teal-200 text-base sm:text-lg font-medium">
                    Digital Tech Guidance for Everyday Tasks
                  </p>
                </div>
              </div>
              <p className="text-teal-100 text-base sm:text-lg max-w-2xl leading-relaxed">
                Ask any question in plain English or browse our simple step-by-step guides. No technical jargon, no rushing.
              </p>
            </div>

            {/* Quick Carer & Support Callout */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 max-w-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Family Support Linked</span>
              </div>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                If you ever get stuck, tap <strong>"Ask a family member instead"</strong> and we will alert your carers directly.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-12 flex-1 w-full">
        {/* Chat Section */}
        <section id="chat-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Ask a Question (Type or Speak)
              </h2>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 hidden sm:inline">
              Patient AI Assistant • Numbered Steps
            </span>
          </div>

          <DigitalHelpChat onAskFamily={handleAskFamily} initialQuery={initialQuery} />
        </section>

        {/* Pre-Written Guides Library Grid */}
        <section id="guides-grid-section">
          <GuideGrid
            guides={guides}
            onSelectGuide={(g) => setSelectedGuide(g)}
            onAskFamily={handleAskFamily}
          />
        </section>

        {/* Free Telephone Support Banner */}
        <section className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <HeartHandshake className="w-5 h-5" />
              <span>Prefer to speak with a human mentor?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              EverEase Freephone Digital Helpline
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Our UK-based support mentors are available Monday to Saturday, 9am to 6pm, to walk you through any device issue over the phone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="tel:08000123456"
              id="helpline-phone-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold text-base shadow-md transition-all"
            >
              <Phone className="w-5 h-5" />
              <span>Call 0800 012 3456 (Free)</span>
            </a>
          </div>
        </section>
      </main>

      {/* Guide Detail Reader Modal */}
      {selectedGuide && (
        <GuideReaderModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
          onAskFamily={handleAskFamily}
        />
      )}

      {/* Ask Family Member Modal */}
      {familyQuestion && (
        <AskFamilyHelpModal
          questionText={familyQuestion}
          onClose={() => setFamilyQuestion(null)}
          onSuccess={handleFamilyNotified}
        />
      )}
    </div>
  );
};
