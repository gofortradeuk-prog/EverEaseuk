import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Users,
  AlertTriangle,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { TrackedSubscription, SubscriptionSpendSummary } from '../../types';
import { sendNotification } from '../../lib/firestoreService';

interface ShareSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: TrackedSubscription[];
  summary: SubscriptionSpendSummary;
  seniorName?: string;
  seniorUid: string;
  familyCarers?: { uid: string; name: string }[];
}

export const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  summary,
  seniorName = 'Margaret',
  seniorUid,
  familyCarers = [{ uid: 'family_david_jenkins', name: 'David Jenkins (Son)' }],
}) => {
  const [copied, setCopied] = useState(false);
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [notifSentSuccess, setNotifSentSuccess] = useState(false);

  if (!isOpen) return null;

  // Generate plain-text shareable summary
  const activeSubs = subscriptions.filter((s) => s.status !== 'cancelled');
  const flaggedSubs = subscriptions.filter((s) => s.status === 'flagged');

  const textLines = [
    `📊 EverEase Subscription & Recurring Bill Summary for ${seniorName}`,
    `----------------------------------------------------`,
    `💰 Total Monthly Spend: £${summary.monthlyTotal.toFixed(2)} / month`,
    `📆 Total Annual Spend: £${summary.annualTotal.toFixed(2)} / year`,
    `📋 Total Active Direct Debits: ${summary.activeCount + summary.flaggedCount}`,
    '',
  ];

  if (flaggedSubs.length > 0) {
    textLines.push(`⚠️ FLAGGED PRICE INCREASES / REVIEWS (${flaggedSubs.length}):`);
    flaggedSubs.forEach((s) => {
      textLines.push(
        ` • ${s.provider}: £${s.amount.toFixed(2)}/${s.billingCycle} (Next due: ${s.nextRenewalDate})`
      );
      if (s.flagReason) {
        textLines.push(`   Note: ${s.flagReason}`);
      }
    });
    textLines.push('');
  }

  textLines.push(`✅ ALL ACTIVE SUBSCRIPTIONS:`);
  activeSubs.forEach((s) => {
    textLines.push(
      ` • ${s.provider}: £${s.amount.toFixed(2)}/${s.billingCycle} | Due: ${s.nextRenewalDate}`
    );
  });

  textLines.push('');
  textLines.push(`Generated securely from EverEase.`);

  const shareText = textLines.join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Could not copy to clipboard:', err);
    }
  };

  const handleSendFamilyNotification = async () => {
    setIsSendingNotif(true);
    setNotifSentSuccess(false);

    try {
      for (const carer of familyCarers) {
        await sendNotification({
          notifId: `notif_sub_summary_${Date.now()}_${carer.uid}`,
          uid: carer.uid,
          type: 'subscription_price_jump',
          payload: {
            title: `📋 Updated Subscription Summary for ${seniorName}`,
            body: `${seniorName} has ${summary.activeCount + summary.flaggedCount} recurring bills totalling £${summary.monthlyTotal.toFixed(2)}/mo (${summary.flaggedCount} flagged for price increases).`,
            route: '/subscriptions',
            module: 'subscriptions',
            actionRequired: summary.flaggedCount > 0,
          },
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
      setNotifSentSuccess(true);
      setTimeout(() => setNotifSentSuccess(false), 4000);
    } catch (err) {
      console.error('Error sending family notification:', err);
    } finally {
      setIsSendingNotif(false);
    }
  };

  return (
    <div
      id="share-summary-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="share-summary-modal-content"
        className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 w-full max-w-xl overflow-hidden animate-slideUp my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-xl font-bold">
                Share Subscription Summary
              </h2>
              <p className="text-slate-300 text-xs font-medium">
                Keep family carers informed about regular household outgoings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Quick Summary Pill preview */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Monthly Total</span>
              <span className="text-2xl font-black text-slate-900">
                £{summary.monthlyTotal.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Active Direct Debits</span>
              <span className="text-2xl font-black text-slate-900">
                {summary.activeCount + summary.flaggedCount}
              </span>
            </div>
          </div>

          {/* Text preview box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Formatted Message Preview
            </label>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {shareText}
            </div>
          </div>

          {/* Action 1: Copy to clipboard */}
          <div className="space-y-2">
            <button
              id="btn-copy-subscription-summary"
              onClick={handleCopy}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-amber-200" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Summary for WhatsApp or Email</span>
                </>
              )}
            </button>
          </div>

          {/* Action 2: Direct In-App Notification to Linked Carers */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Linked Family Carers</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {familyCarers.length} Carer Linked
              </span>
            </div>

            {familyCarers.map((carer) => (
              <div
                key={carer.uid}
                className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between"
              >
                <div className="text-sm font-bold text-emerald-950">{carer.name}</div>
                <button
                  onClick={handleSendFamilyNotification}
                  disabled={isSendingNotif}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingNotif ? 'Sending...' : 'Send Update'}</span>
                </button>
              </div>
            ))}

            {notifSentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Notification successfully sent to David's EverEase inbox!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
