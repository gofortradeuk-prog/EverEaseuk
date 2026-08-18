import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit,
  Receipt,
  Calendar,
  PoundSterling,
  Users,
  Info,
  AlertTriangle,
  Tv,
  Wifi,
  Shield,
  Home,
  BookOpen,
  Heart,
  HeartHandshake,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { TrackedSubscription, SubscriptionCategory, BillingCycle } from '../../types';
import { saveTrackedSubscription } from '../../lib/firestoreService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (sub: TrackedSubscription, flaggedPriceJump: boolean) => void;
  editingSubscription?: TrackedSubscription | null;
  seniorUid: string;
  familyCarers?: { uid: string; name: string }[];
}

const CATEGORY_OPTIONS: { value: SubscriptionCategory; label: string; icon: any }[] = [
  { value: 'streaming_tv', label: 'Streaming & TV (Netflix, BBC, Disney, Sky)', icon: Tv },
  { value: 'broadband_mobile', label: 'Broadband & Mobile Phone (BT, Sky, EE, O2)', icon: Wifi },
  { value: 'insurance_cover', label: 'Insurance & Breakdown Cover (AA, RAC, Aviva)', icon: Shield },
  { value: 'utilities_home', label: 'Utilities & HomeCare (British Gas, Water, Energy)', icon: Home },
  { value: 'magazines_news', label: 'Magazines, Newspapers & Books (Saga, Telegraph)', icon: BookOpen },
  { value: 'health_fitness', label: 'Health, Gym & Social Clubs (PureGym, U3A)', icon: Heart },
  { value: 'charity_direct_debit', label: 'Charity & Donations (Age UK, Cancer Research)', icon: HeartHandshake },
  { value: 'software_apps', label: 'Apps, Cloud & Computer (Microsoft 365, Apple)', icon: Laptop },
  { value: 'other', label: 'Other Recurring Direct Debit or Membership', icon: Receipt },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editingSubscription,
  seniorUid,
  familyCarers = [{ uid: 'family_david_jenkins', name: 'David Jenkins (Son)' }],
}) => {
  const isEditing = !!editingSubscription;

  // Form State
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('streaming_tv');
  const [amount, setAmount] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextRenewalDate, setNextRenewalDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [accountReference, setAccountReference] = useState<string>('');
  const [cancellationPhone, setCancellationPhone] = useState<string>('');
  const [shareWithFamily, setShareWithFamily] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or reset form
  useEffect(() => {
    if (editingSubscription) {
      setProvider(editingSubscription.provider);
      setCategory((editingSubscription.category as SubscriptionCategory) || 'streaming_tv');
      setAmount(editingSubscription.amount.toString());
      setBillingCycle(editingSubscription.billingCycle || 'monthly');
      setNextRenewalDate(editingSubscription.nextRenewalDate || '');
      setNotes(editingSubscription.notes || '');
      setAccountReference(editingSubscription.accountReference || '');
      setCancellationPhone(editingSubscription.cancellationPhone || '');
      setShareWithFamily(
        editingSubscription.sharedWithFamily && editingSubscription.sharedWithFamily.length > 0
      );
    } else {
      // Default: new subscription 1 month from today
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      const defaultDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      setProvider('');
      setCategory('streaming_tv');
      setAmount('');
      setBillingCycle('monthly');
      setNextRenewalDate(defaultDate);
      setNotes('');
      setAccountReference('');
      setCancellationPhone('');
      setShareWithFamily(true);
    }
    setErrorMessage(null);
  }, [editingSubscription, isOpen]);

  if (!isOpen) return null;

  // Quick renewal date helpers
  const handleSetQuickDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    setNextRenewalDate(dateStr);
  };

  const parsedAmount = parseFloat(amount);
  const isPriceIncrease =
    isEditing &&
    editingSubscription &&
    !isNaN(parsedAmount) &&
    parsedAmount > editingSubscription.amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!provider.trim()) {
      setErrorMessage('Please enter the provider or service name (e.g. Netflix, British Gas, Sky).');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setErrorMessage('Please enter a valid subscription amount (e.g. 10.99).');
      return;
    }

    if (!nextRenewalDate) {
      setErrorMessage('Please enter or select the next payment or renewal date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const trackId = editingSubscription
        ? editingSubscription.trackId
        : `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const sharedArray = shareWithFamily ? familyCarers.map((f) => f.uid) : [];

      const record: TrackedSubscription = {
        trackId,
        seniorUid,
        provider: provider.trim(),
        category,
        amount: parsedAmount,
        currency: 'GBP',
        billingCycle,
        nextRenewalDate,
        status: isPriceIncrease ? 'flagged' : editingSubscription ? editingSubscription.status : 'active',
        detectedVia: editingSubscription ? editingSubscription.detectedVia : 'manual',
        sharedWithFamily: sharedArray,
        previousAmount: isEditing && isPriceIncrease ? editingSubscription.amount : editingSubscription?.previousAmount,
        flagReason:
          isEditing && isPriceIncrease
            ? `Price increased from £${editingSubscription.amount.toFixed(2)} to £${parsedAmount.toFixed(2)} (${billingCycle}).`
            : editingSubscription?.flagReason,
        notes: notes.trim() || undefined,
        accountReference: accountReference.trim() || undefined,
        cancellationPhone: cancellationPhone.trim() || undefined,
        createdAt: editingSubscription ? editingSubscription.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await saveTrackedSubscription(record, true);

      if (result.success) {
        onSaved(record, !!result.flaggedDueToPriceJump);
        onClose();
      } else {
        setErrorMessage(result.error || 'Could not save subscription. Please try again.');
      }
    } catch (err) {
      console.error('Error saving subscription:', err);
      setErrorMessage('An unexpected error occurred while saving the subscription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="subscription-modal-content"
        className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 w-full max-w-2xl overflow-hidden animate-slideUp my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 sm:p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold">
                {isEditing ? 'Edit Subscription' : 'Add a Regular Subscription or Bill'}
              </h2>
              <p className="text-amber-100 text-sm font-medium">
                Keep track of direct debits, streaming TV, club memberships & insurance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Price Increase Warning when editing */}
          {isPriceIncrease && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-900 text-sm space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Price Increase Detected</span>
              </div>
              <p className="leading-relaxed">
                You are updating the cost from <strong>£{editingSubscription?.amount.toFixed(2)}</strong> to{' '}
                <strong>£{parsedAmount.toFixed(2)}</strong>. This subscription will be flagged for review and an alert will be created.
              </p>
            </div>
          )}

          {/* Provider Name */}
          <div className="space-y-2">
            <label htmlFor="sub-provider" className="block text-base font-bold text-slate-900">
              Provider or Service Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="sub-provider"
              type="text"
              required
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Netflix, Sky TV, British Gas HomeCare, Saga Magazine"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-base font-semibold text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500 font-medium">
              The company or organisation taking the regular payment.
            </p>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label htmlFor="sub-category" className="block text-base font-bold text-slate-900">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              id="sub-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as SubscriptionCategory)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-base font-semibold text-slate-900 bg-white"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="sub-amount" className="block text-base font-bold text-slate-900">
                Amount (£) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                  £
                </span>
                <input
                  id="sub-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-lg font-extrabold text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sub-cycle" className="block text-base font-bold text-slate-900">
                Billing Cycle <span className="text-rose-600">*</span>
              </label>
              <select
                id="sub-cycle"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-base font-semibold text-slate-900 bg-white"
              >
                <option value="monthly">Monthly (Every month)</option>
                <option value="annual">Annual / Yearly (Once a year)</option>
                <option value="quarterly">Quarterly (Every 3 months)</option>
                <option value="other">Other / Custom schedule</option>
              </select>
            </div>
          </div>

          {/* Next Renewal Date */}
          <div className="space-y-3">
            <label htmlFor="sub-renewal-date" className="block text-base font-bold text-slate-900">
              Next Payment or Renewal Date <span className="text-rose-600">*</span>
            </label>
            <input
              id="sub-renewal-date"
              type="date"
              required
              value={nextRenewalDate}
              onChange={(e) => setNextRenewalDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-base font-semibold text-slate-900 bg-white"
            />
            {/* Quick date shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Quick set:</span>
              <button
                type="button"
                onClick={() => handleSetQuickDate(7)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition-colors"
              >
                In 1 Week
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(30)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition-colors"
              >
                In 1 Month
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(365)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition-colors"
              >
                In 1 Year
              </button>
            </div>
          </div>

          {/* Auto Reminder Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs sm:text-sm text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Automatic Reminder:</strong> EverEase will automatically place a notification in your Reminders calendar 7 days before this date so you never get surprised by a renewal.
            </p>
          </div>

          {/* Optional Details: Account Ref & Cancellation Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="sub-account-ref" className="block text-sm font-bold text-slate-900">
                Account or Policy Number (Optional)
              </label>
              <input
                id="sub-account-ref"
                type="text"
                value={accountReference}
                onChange={(e) => setAccountReference(e.target.value)}
                placeholder="e.g. SKY-490218, Direct Debit Ref"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 text-sm font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sub-cancel-phone" className="block text-sm font-bold text-slate-900">
                Cancellation Phone Number (Optional)
              </label>
              <input
                id="sub-cancel-phone"
                type="tel"
                value={cancellationPhone}
                onChange={(e) => setCancellationPhone(e.target.value)}
                placeholder="e.g. 0800 096 6379"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 text-sm font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="sub-notes" className="block text-sm font-bold text-slate-900">
              Helpful Notes or Cancellation Terms (Optional)
            </label>
            <textarea
              id="sub-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 30-day notice required to cancel, includes family access, renewal discounts available if I call."
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 text-sm font-medium text-slate-900"
            />
          </div>

          {/* Share with Family Toggle */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Share with Linked Family Carers</span>
              </div>
              <p className="text-xs text-slate-500">
                Allows David to see this bill in their shared family spend summary.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shareWithFamily}
                onChange={(e) => setShareWithFamily(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-colors"
            >
              Cancel
            </button>
            <button
              id="sub-save-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-extrabold text-base shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                <>
                  <Edit className="w-5 h-5" />
                  <span>Update Subscription</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Save Subscription</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
