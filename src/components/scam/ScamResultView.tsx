import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Ban, 
  ExternalLink, 
  Users, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  CheckCircle2, 
  AlertOctagon,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ScamCheckRecord, ScamVerdict } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ScamResultViewProps {
  checkRecord: ScamCheckRecord;
  onReset: () => void;
  onBlockSender: () => void;
  onAskFamily: () => Promise<void>;
  isAskingFamily: boolean;
  familyNotifiedMessage: string | null;
}

export const ScamResultView: React.FC<ScamResultViewProps> = ({
  checkRecord,
  onReset,
  onBlockSender,
  onAskFamily,
  isAskingFamily,
  familyNotifiedMessage,
}) => {
  const { isSpeaking, speak, stopSpeech } = useAccessibility();
  const [speechActive, setSpeechActive] = useState(false);

  const { verdict, explanation, redFlags, advice, createdAt } = checkRecord;

  const handleToggleSpeech = () => {
    if (speechActive || isSpeaking) {
      stopSpeech();
      setSpeechActive(false);
    } else {
      const textToRead = `Verdict: ${
        verdict === 'likely_scam'
          ? 'Likely Scam. Warning, this message is dangerous.'
          : verdict === 'caution'
          ? 'Caution. Take care with this message.'
          : 'Safe. This message looks genuine.'
      }. Explanation: ${explanation}. Immediate Advice: ${advice || ''}. Red flags detected: ${
        redFlags.join('. ')
      }`;
      speak(textToRead);
      setSpeechActive(true);
    }
  };

  // Verdict Configuration - High-contrast, WCAG AA, with Icon AND Word
  const getVerdictTheme = (v: ScamVerdict) => {
    switch (v) {
      case 'likely_scam':
        return {
          title: 'LIKELY SCAM (RED LIGHT)',
          subtitle: 'Danger: Do not click links, reply, or share bank details',
          badgeText: '🔴 LIKELY SCAM',
          bgBanner: 'bg-rose-950 text-white border-rose-600',
          cardBg: 'bg-rose-50 border-rose-300 text-rose-950',
          iconBg: 'bg-rose-600 text-white',
          icon: <ShieldAlert className="w-12 h-12 md:w-16 md:h-16" />,
          accentBorder: 'border-rose-500',
          lightColor: 'text-rose-700',
        };
      case 'caution':
        return {
          title: 'PROCEED WITH CAUTION (AMBER LIGHT)',
          subtitle: 'Take Care: Double-check details with a trusted person before taking action',
          badgeText: '🟡 CAUTION',
          bgBanner: 'bg-amber-950 text-white border-amber-500',
          cardBg: 'bg-amber-50 border-amber-300 text-amber-950',
          iconBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-12 h-12 md:w-16 md:h-16" />,
          accentBorder: 'border-amber-500',
          lightColor: 'text-amber-700',
        };
      case 'safe':
      default:
        return {
          title: 'LOOKS GENUINE & SAFE (GREEN LIGHT)',
          subtitle: 'Safe: No typical UK fraud patterns detected',
          badgeText: '🟢 SAFE',
          bgBanner: 'bg-emerald-950 text-white border-emerald-600',
          cardBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          iconBg: 'bg-emerald-600 text-white',
          icon: <ShieldCheck className="w-12 h-12 md:w-16 md:h-16" />,
          accentBorder: 'border-emerald-500',
          lightColor: 'text-emerald-700',
        };
    }
  };

  const theme = getVerdictTheme(verdict);

  return (
    <div className="space-y-6" id="scam-result-container">
      {/* Top Controls: Back button & Read Aloud */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-base shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
          <span>Check Another Message</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSpeech}
          className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-base shadow-xs transition-colors cursor-pointer border-2 ${
            speechActive
              ? 'bg-amber-500 border-amber-600 text-slate-950'
              : 'bg-white border-emerald-600 text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          {speechActive ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>Stop Reading Aloud</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <span>Read Verdict Aloud to Me</span>
            </>
          )}
        </button>
      </div>

      {/* Prominent Traffic-Light Card (Green / Amber / Red) */}
      <div
        className={`rounded-3xl border-4 ${theme.accentBorder} shadow-lg overflow-hidden bg-white`}
        id="verdict-traffic-light-card"
      >
        {/* Header Ribbon with High-Contrast Text and Icon */}
        <div className={`p-6 md:p-8 ${theme.bgBanner} flex flex-col md:flex-row items-center gap-6 text-center md:text-left`}>
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl ${theme.iconBg} flex items-center justify-center shadow-md shrink-0`}>
            {theme.icon}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-white font-extrabold text-sm tracking-wider uppercase backdrop-blur-xs mb-1">
              {theme.badgeText}
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {theme.title}
            </h2>
            <p className="text-base md:text-xl font-medium text-slate-200">
              {theme.subtitle}
            </p>
          </div>
        </div>

        {/* Core Analysis Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Plain English Explanation */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Why we reached this verdict:</span>
            </h3>
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-lg md:text-xl text-slate-900 font-medium leading-relaxed">
              {explanation}
            </div>
          </div>

          {/* Red Flags List (If any) */}
          {redFlags && redFlags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <span>Specific Warning Signs (Red Flags) Detected:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-3 text-rose-950 font-semibold text-base"
                  >
                    <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Action Advice */}
          {advice && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                Recommended Step
              </span>
              <p className="text-base md:text-lg font-bold text-emerald-950 leading-relaxed">
                {advice}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3 ONE-TAP ACTIONS */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 md:p-8 shadow-sm space-y-5" id="one-tap-actions-card">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            What would you like to do next?
          </h3>
          <p className="text-slate-600 font-medium text-base mt-1">
            Choose one of these 3 simple one-tap actions:
          </p>
        </div>

        {/* Family Member Alert Feedback Banner */}
        {familyNotifiedMessage && (
          <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center gap-3 text-emerald-950 font-bold text-base">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
            <span>{familyNotifiedMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Block Sender */}
          <button
            type="button"
            onClick={onBlockSender}
            id="btn-block-sender"
            className="flex flex-col items-start text-left p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <Ban className="w-6 h-6" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 block">
              1. Block this sender
            </span>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Step-by-step guidance to stop this phone number or email from contacting you again.
            </p>
          </button>

          {/* Action 2: Report to Action Fraud */}
          <a
            href="https://www.actionfraud.police.uk/reporting-fraud-and-cyber-crime"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-report-action-fraud"
            className="flex flex-col items-start text-left p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 hover:border-rose-400 hover:bg-rose-100 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-rose-950 block">
                2. Report to Action Fraud
              </span>
            </div>
            <p className="text-sm font-semibold text-rose-800 mt-1">
              Official UK Police reporting portal or call free on <strong>0300 123 2040</strong>.
            </p>
          </a>

          {/* Action 3: Ask a family member */}
          <button
            type="button"
            onClick={onAskFamily}
            disabled={isAskingFamily}
            id="btn-ask-family-member"
            className="flex flex-col items-start text-left p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-100 transition-all cursor-pointer group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-lg font-extrabold text-indigo-950 block">
              3. Ask a family member
            </span>
            <p className="text-sm font-semibold text-indigo-800 mt-1">
              {isAskingFamily ? 'Sending alert to carers...' : 'Notify your linked family carer to review this check with you.'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
