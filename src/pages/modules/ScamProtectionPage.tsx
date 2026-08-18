import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  PhoneCall, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { MODULES } from '../../lib/modulesData';
import { 
  ScamCheckRecord, 
  ScamInputType, 
  ScamVerdict, 
  ScamCheckApiResponse 
} from '../../types';
import { 
  saveScamCheck, 
  subscribeToScamChecks, 
  deleteScamCheck, 
  askFamilyCarersForScamAdvice 
} from '../../lib/firestoreService';
import { ScamInputSection } from '../../components/scam/ScamInputSection';
import { ScamResultView } from '../../components/scam/ScamResultView';
import { ScamHistoryList } from '../../components/scam/ScamHistoryList';
import { BlockSenderModal } from '../../components/scam/BlockSenderModal';

interface Props {
  navigate: (route: string) => void;
}

export const ScamProtectionPage: React.FC<Props> = ({ navigate }) => {
  const { currentUser, userProfile } = useAuth();
  const { speak } = useAccessibility();
  const moduleData = MODULES.find((m) => m.id === 'scam-protection')!;

  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScamCheckRecord | null>(null);
  const [history, setHistory] = useState<ScamCheckRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isAskingFamily, setIsAskingFamily] = useState(false);
  const [familyNotifiedMessage, setFamilyNotifiedMessage] = useState<string | null>(null);

  // Subscribe to real-time scam check records for the senior
  useEffect(() => {
    const seniorUid = currentUser?.uid;
    if (!seniorUid) {
      setHistoryLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToScamChecks(seniorUid, (checks) => {
        setHistory(checks);
        setHistoryLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to scam checks:', err);
      setHistoryLoading(false);
    }
  }, [currentUser?.uid]);

  // Execute Scam Check via server-side Gemini API
  const handleRunAnalysis = async (data: {
    inputType: ScamInputType;
    text?: string;
    imageBase64?: string;
    mimeType?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setFamilyNotifiedMessage(null);

    try {
      // 1. Call server-side Express endpoint (Gemini API is never exposed to browser)
      const response = await fetch('/api/scam-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server was unable to analyse this message.');
      }

      const result: ScamCheckApiResponse = await response.json();

      // 2. Prepare structured ScamCheckRecord for Firestore
      // UK GDPR Compliance (Article 5(1)(c) - Data Minimisation):
      // Raw text or image is NOT stored in Firestore long term. Only verdict & red flags.
      const checkId = `check_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const newRecord: ScamCheckRecord = {
        checkId,
        seniorUid: currentUser?.uid || 'anonymous_user',
        inputType: data.inputType,
        rawContentRef: null, // Data-minimisation: raw text/image is discarded
        verdict: result.verdict || 'caution',
        explanation: result.explanation,
        redFlags: result.redFlags || [],
        advice: result.advice,
        createdAt: new Date().toISOString(),
      };

      // 3. Save to Firestore collection 'scamChecks'
      if (currentUser?.uid) {
        await saveScamCheck(newRecord);
      }

      setCurrentResult(newRecord);

      // 4. Accessibility vocal feedback
      if (newRecord.verdict === 'likely_scam') {
        speak('Warning: Our safety check found this message is likely a scam. Please do not click any links or reply.');
      } else if (newRecord.verdict === 'caution') {
        speak('Caution: Please take extra care with this message before sharing any information.');
      } else {
        speak('Good news: This message appears genuine and safe.');
      }
    } catch (err: any) {
      console.error('Scam check failed:', err);
      setErrorMessage(err.message || 'Something went wrong while analysing the message. Please try again or call support.');
    } finally {
      setIsLoading(false);
    }
  };

  // One-Tap Action: "Ask a family member"
  const handleAskFamily = async () => {
    if (!currentResult || !currentUser?.uid) return;
    setIsAskingFamily(true);
    setFamilyNotifiedMessage(null);

    try {
      const seniorName = userProfile?.displayName || 'Your Senior Relative';
      const result = await askFamilyCarersForScamAdvice(
        currentUser.uid,
        seniorName,
        currentResult
      );

      if (result.success && result.notifiedCount > 0) {
        const namesList = result.carerNames.join(', ');
        setFamilyNotifiedMessage(`Alert sent to ${namesList || 'your family carer'}. They have been notified to review this check with you.`);
      } else {
        // Provide friendly fallback if no active linked carer is configured yet
        setFamilyNotifiedMessage('A family review alert was queued. When a carer is linked in "Family & Carer Connect", they will see this notification.');
      }
    } catch (err) {
      console.error('Failed to notify family member:', err);
      setFamilyNotifiedMessage('Unable to send notification to family members right now. Please try again.');
    } finally {
      setIsAskingFamily(false);
    }
  };

  // History action: Delete record
  const handleDeleteRecord = async (checkId: string) => {
    try {
      await deleteScamCheck(checkId);
    } catch (err) {
      console.error('Failed to delete scam record:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8" id="scam-protection-page">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          id="btn-back-to-dashboard"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-base shadow-2xs transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
          <span>Back to Dashboard</span>
        </button>

        {/* Freephone Senior Helpline Callout */}
        <div className="flex items-center gap-3 bg-emerald-50 border-2 border-emerald-200 px-4 py-2 rounded-2xl">
          <PhoneCall className="w-5 h-5 text-emerald-700 shrink-0" />
          <div className="text-xs md:text-sm">
            <span className="font-bold text-emerald-950">Freephone Safety Support: </span>
            <strong className="text-emerald-700 font-extrabold">0800 888 2026</strong>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-3xl flex items-start gap-4 text-rose-950 font-semibold shadow-xs">
          <AlertCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Unable to complete check</h4>
            <p className="text-sm md:text-base text-rose-900">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Primary Content: Either Input Screen OR Result Screen */}
      {!currentResult ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          <ScamInputSection
            onAnalyze={handleRunAnalysis}
            isLoading={isLoading}
          />

          {/* Past History List */}
          <ScamHistoryList
            history={history}
            onSelectRecord={(rec) => setCurrentResult(rec)}
            onDeleteRecord={handleDeleteRecord}
            isLoading={historyLoading}
          />
        </div>
      ) : (
        <div className="animate-in fade-in duration-200 space-y-8">
          <ScamResultView
            checkRecord={currentResult}
            onReset={() => {
              setCurrentResult(null);
              setFamilyNotifiedMessage(null);
            }}
            onBlockSender={() => setIsBlockModalOpen(true)}
            onAskFamily={handleAskFamily}
            isAskingFamily={isAskingFamily}
            familyNotifiedMessage={familyNotifiedMessage}
          />

          {/* Historical Log below result for quick context */}
          <ScamHistoryList
            history={history}
            onSelectRecord={(rec) => setCurrentResult(rec)}
            onDeleteRecord={handleDeleteRecord}
            isLoading={historyLoading}
          />
        </div>
      )}

      {/* Block Sender Modal */}
      <BlockSenderModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
      />
    </div>
  );
};
