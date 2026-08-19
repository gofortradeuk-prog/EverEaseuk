import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  PhoneCall,
  Mail,
  Clock,
  ArrowRight,
  HelpCircle,
  FileText,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';

export interface CancellationResult {
  reason: string;
  refundRequested: boolean;
  refundReasonCategory?: string;
  notes?: string;
  cancelledAt: string;
  referenceCode: string;
  effectiveEndDate: string;
  planName: string;
  price: number;
}

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (result: CancellationResult) => Promise<void> | void;
  planName?: string;
  monthlyPrice?: number;
  paymentMethod?: string;
  renewalDate?: string;
  navigate?: (route: string) => void;
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  planName = 'EverEase Peace of Mind (Monthly)',
  monthlyPrice = 29.99,
  paymentMethod = 'BACS Direct Debit',
  renewalDate,
  navigate,
}) => {
  const [step, setStep] = useState<'review_policy' | 'confirm_details' | 'success'>('review_policy');
  const [selectedReason, setSelectedReason] = useState<string>('no_longer_needed');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [wantsRefund, setWantsRefund] = useState<boolean>(false);
  const [refundReasonType, setRefundReasonType] = useState<string>('14_day_cooling_off');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cancellationResult, setCancellationResult] = useState<CancellationResult | null>(null);

  if (!isOpen) return null;

  // Calculate default effective end date (end of current monthly cycle)
  const calculateEffectiveEndDate = () => {
    if (renewalDate) return renewalDate;
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleProcessCancellation = async () => {
    setIsSubmitting(true);
    try {
      const refCode = `EE-CAN-${Math.floor(100000 + Math.random() * 900000)}`;
      const resultData: CancellationResult = {
        reason: selectedReason,
        refundRequested: wantsRefund,
        refundReasonCategory: wantsRefund ? refundReasonType : undefined,
        notes: customNotes.trim() || undefined,
        cancelledAt: new Date().toISOString(),
        referenceCode: refCode,
        effectiveEndDate: calculateEffectiveEndDate(),
        planName,
        price: monthlyPrice,
      };

      await onConfirmCancel(resultData);
      setCancellationResult(resultData);
      setStep('success');
    } catch (err) {
      console.error('Cancellation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      id="cancel-subscription-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-subscription-title"
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col my-8 max-h-[90vh]"
        id="cancel-subscription-modal-container"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 block">
                EverEase Membership Management
              </span>
              <h2 id="cancel-subscription-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {step === 'success' ? 'Subscription Cancelled' : 'Cancel Subscription & Refund Policy'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            id="close-cancel-modal-btn"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* STEP 1: REVIEW REFUND POLICY & SELECT OPTIONS */}
          {step === 'review_policy' && (
            <div className="space-y-6 animate-in fade-in" id="step-review-policy">
              
              {/* Current Plan Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                    Your Current Plan
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {planName}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    £{monthlyPrice.toFixed(2)} / month &bull; Protected by {paymentMethod}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                    Active & Guarded
                  </span>
                </div>
              </div>

              {/* Official Refund Policy Highlight Box */}
              <div className="rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 p-5 space-y-3" id="refund-policy-summary-box">
                <div className="flex items-center gap-2.5 text-emerald-950 font-black text-base sm:text-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                  <span>Our Customer Refund Policy & Guarantees</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm font-medium text-slate-800">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                    <strong className="text-emerald-900 font-extrabold block">
                      14-Day Statutory Cooling-Off
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      Under UK Consumer Contracts Regulations 2013, new subscribers enjoy a 100% full money-back refund within 14 days if no 1-on-1 tutoring was used.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                    <strong className="text-emerald-900 font-extrabold block">
                      No Cancellation Penalties
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      Cancel anytime with 1 click. No lock-in contracts or penalty fees. Access continues until your prepaid month ends.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                    <strong className="text-emerald-900 font-extrabold block">
                      BACS Direct Debit Guarantee
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      Protected by UK banking rules. You receive advance notice of any charges and immediate refund rights for any discrepancies.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                    <strong className="text-emerald-900 font-extrabold block">
                      Compassionate Exceptions
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      We offer full review for serious illness, hospitalisation, bereavement, or sudden changes in care circumstances.
                    </p>
                  </div>
                </div>

                {navigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/legal?type=refund');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-800 hover:text-emerald-950 underline pt-1 cursor-pointer"
                  >
                    <span>Read complete EverEase Refund &amp; Cancellation Policy</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Cancellation Reason Selector */}
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-extrabold text-slate-900">
                  Please let us know why you are cancelling:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'no_longer_needed', label: 'No longer need the service' },
                    { id: 'financial_reasons', label: 'Financial reasons / monthly cost' },
                    { id: 'too_difficult', label: 'Found the technology too difficult' },
                    { id: 'temporary_pause', label: 'Temporary pause (hospital / holiday)' },
                    { id: 'family_handling', label: 'Family member taking over care' },
                    { id: 'other', label: 'Other reason' },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-colors ${
                        selectedReason === option.id
                          ? 'bg-amber-50/80 border-amber-400 text-amber-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={option.id}
                        checked={selectedReason === option.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional Refund Request Checkbox */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsRefund}
                    onChange={(e) => setWantsRefund(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    id="request-refund-checkbox"
                  />
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base block">
                      I wish to request a refund under the Refund Policy
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 block">
                      Check this if you are within your 14-day statutory cooling-off period or have an exceptional circumstance (illness, hospitalisation, duplicate charge).
                    </span>
                  </div>
                </label>

                {wantsRefund && (
                  <div className="pt-3 border-t border-amber-200/80 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                        Select Refund Eligibility Category:
                      </label>
                      <select
                        value={refundReasonType}
                        onChange={(e) => setRefundReasonType(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="14_day_cooling_off">14-Day Statutory Cooling-Off (New Member)</option>
                        <option value="medical_hospital">Medical / Hospitalisation / Bereavement</option>
                        <option value="billing_discrepancy">Billing Discrepancy / Direct Debit Guarantee Claim</option>
                        <option value="service_issue">Service Unable to Meet Requirement</option>
                        <option value="other_compassionate">Other Compassionate Review</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                        Optional notes for our UK support desk:
                      </label>
                      <textarea
                        rows={2}
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder="Provide any details to help our team process your refund promptly..."
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm sm:text-base transition-colors cursor-pointer text-center"
                >
                  Keep My Subscription
                </button>

                <button
                  type="button"
                  onClick={() => setStep('confirm_details')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm sm:text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  id="proceed-to-cancellation-step-btn"
                >
                  <span>Proceed with Cancellation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRM FINAL CANCELLATION */}
          {step === 'confirm_details' && (
            <div className="space-y-6 animate-in fade-in" id="step-confirm-cancellation">
              <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-rose-950 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Please Confirm Your Cancellation</span>
                </h3>
                <p className="text-sm sm:text-base text-rose-900 font-medium leading-relaxed">
                  Upon confirming, future recurring payments will be immediately halted. You will continue to have full access to your EverEase portal until <strong>{calculateEffectiveEndDate()}</strong>.
                </p>
                {wantsRefund && (
                  <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs sm:text-sm font-semibold text-rose-900">
                    ✨ <strong>Refund Request Attached:</strong> Your refund claim under the <em>{refundReasonType.replace(/_/g, ' ')}</em> policy will be reviewed within 2 business days and returned to your original payment method ({paymentMethod}).
                  </div>
                )}
              </div>

              {/* Freephone Support Reminder */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3.5">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    Need help or prefer to talk to someone first?
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    Call our friendly UK team free on{' '}
                    <a href="tel:08008882026" className="text-emerald-700 underline font-black">
                      0800 888 2026
                    </a>{' '}
                    (9:00 AM – 5:30 PM daily)
                  </p>
                </div>
              </div>

              {/* Confirm Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('review_policy')}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  Back to Review
                </button>

                <button
                  type="button"
                  onClick={handleProcessCancellation}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  id="final-confirm-cancel-btn"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Cancelling Subscription...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-rose-200" />
                      <span>Yes, Cancel My Subscription</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS NOTIFICATION */}
          {step === 'success' && cancellationResult && (
            <div className="space-y-6 text-center animate-in zoom-in-95" id="step-cancel-success">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Your Subscription Has Been Cancelled
                </h3>
                <p className="text-base text-slate-600 max-w-lg mx-auto font-medium">
                  We have confirmed your request. No further payments will be debited from your account.
                </p>
              </div>

              {/* Receipt / Confirmation Card */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 max-w-md mx-auto text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-500">Reference Number:</span>
                  <span className="font-black text-slate-900 font-mono text-base">
                    {cancellationResult.referenceCode}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-500">Plan Cancelled:</span>
                  <span className="font-bold text-slate-900">{cancellationResult.planName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-500">Access Remains Active Until:</span>
                  <span className="font-bold text-emerald-800">{cancellationResult.effectiveEndDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Refund Status:</span>
                  <span className={`font-bold ${cancellationResult.refundRequested ? 'text-amber-700' : 'text-slate-700'}`}>
                    {cancellationResult.refundRequested ? 'Refund Requested (Under Review)' : 'Standard Period-End Cancellation'}
                  </span>
                </div>
              </div>

              {/* Refund Notice if applied */}
              {cancellationResult.refundRequested && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-950 font-medium text-left max-w-md mx-auto space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Refund Claim Recorded</span>
                  </div>
                  <p>
                    Your refund request under our policy has been submitted to the accounts team. Refunds are returned to your original payment method within 5–10 working days.
                  </p>
                </div>
              )}

              {/* Support Contact Info */}
              <div className="p-4 bg-slate-100 rounded-2xl text-xs sm:text-sm text-slate-600 max-w-md mx-auto space-y-1">
                <p className="font-bold text-slate-800">
                  A confirmation email has been logged.
                </p>
                <p>
                  Questions? Contact <strong>support@evereaseuk.com</strong> or call <strong>+44 (0) 330 401 0019</strong> (9:00 AM – 5:30 PM).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black text-base shadow-sm transition-colors cursor-pointer"
                  id="close-success-cancel-btn"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
