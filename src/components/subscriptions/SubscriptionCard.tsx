import React, { useState } from 'react';
import {
  Tv,
  Wifi,
  Shield,
  Home,
  BookOpen,
  Heart,
  HeartHandshake,
  Laptop,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Trash2,
  Edit,
  HelpCircle,
  Users,
  ExternalLink,
  Phone,
  RefreshCw,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { TrackedSubscription, SubscriptionCategory } from '../../types';

interface SubscriptionCardProps {
  subscription: TrackedSubscription;
  onEdit: (sub: TrackedSubscription) => void;
  onDelete: (trackId: string) => void;
  onHelpCancel: (sub: TrackedSubscription) => void;
  onToggleStatus: (trackId: string, currentStatus: string) => void;
  canEdit: boolean;
  seniorName?: string;
}

export const getCategoryMeta = (category: SubscriptionCategory | string) => {
  switch (category) {
    case 'streaming_tv':
      return {
        label: 'Streaming & TV',
        icon: Tv,
        bg: 'bg-purple-100 text-purple-800 border-purple-200',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-300',
      };
    case 'broadband_mobile':
      return {
        label: 'Broadband & Mobile',
        icon: Wifi,
        bg: 'bg-blue-100 text-blue-800 border-blue-200',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-300',
      };
    case 'insurance_cover':
      return {
        label: 'Insurance & Cover',
        icon: Shield,
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      };
    case 'utilities_home':
      return {
        label: 'Utilities & Home',
        icon: Home,
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-300',
      };
    case 'magazines_news':
      return {
        label: 'Magazines & News',
        icon: BookOpen,
        bg: 'bg-rose-100 text-rose-800 border-rose-200',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-300',
      };
    case 'health_fitness':
      return {
        label: 'Health & Fitness',
        icon: Heart,
        bg: 'bg-teal-100 text-teal-800 border-teal-200',
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-300',
      };
    case 'charity_direct_debit':
      return {
        label: 'Charity Direct Debit',
        icon: HeartHandshake,
        bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      };
    case 'software_apps':
      return {
        label: 'Apps & Software',
        icon: Laptop,
        bg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-300',
      };
    case 'other':
    default:
      return {
        label: 'Other Subscription',
        icon: Receipt,
        bg: 'bg-slate-100 text-slate-800 border-slate-200',
        badgeBg: 'bg-slate-50 text-slate-700 border-slate-300',
      };
  }
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onHelpCancel,
  onToggleStatus,
  canEdit,
  seniorName = 'Margaret',
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const meta = getCategoryMeta(subscription.category);
  const IconComponent = meta.icon;

  // Renewal date calculations
  const renewalDate = new Date(subscription.nextRenewalDate);
  const today = new Date();
  const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const isRenewalSoon = diffDays >= 0 && diffDays <= 7;
  const isOverdue = diffDays < 0;

  const formatCycle = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return '/ month';
      case 'annual':
        return '/ year';
      case 'quarterly':
        return '/ quarter';
      case 'other':
      default:
        return 'per billing';
    }
  };

  const isFlagged = subscription.status === 'flagged';
  const isCancelled = subscription.status === 'cancelled';

  return (
    <div
      id={`sub-card-${subscription.trackId}`}
      className={`relative rounded-3xl border-2 transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
        isFlagged
          ? 'bg-amber-50/70 border-amber-400'
          : isCancelled
          ? 'bg-slate-100/80 border-slate-300 opacity-80'
          : 'bg-white border-slate-200 hover:border-emerald-300'
      }`}
    >
      {/* Flagged Alert Banner if price jump detected */}
      {isFlagged && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
          <span className="flex-1">
            {subscription.flagReason || 'Review requested: Possible unexpected price jump or contract expiry.'}
          </span>
          {subscription.previousAmount && (
            <span className="bg-slate-900 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
              Was £{subscription.previousAmount.toFixed(2)}
            </span>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Category Badge & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${meta.bg}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${meta.badgeBg}`}>
                <Tag className="w-3 h-3" />
                {meta.label}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">
                {subscription.provider}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {isFlagged ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-200 text-amber-900 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                Price Jumped
              </span>
            ) : isCancelled ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                Cancelled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Direct Debit
              </span>
            )}
          </div>
        </div>

        {/* Cost & Billing Cycle Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
              Recurring Amount
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                £{subscription.amount.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {formatCycle(subscription.billingCycle)}
              </span>
            </div>
          </div>

          {/* Annualized estimate if monthly */}
          {subscription.billingCycle === 'monthly' && (
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Yearly total</span>
              <span className="text-sm font-extrabold text-slate-800">
                £{(subscription.amount * 12).toFixed(2)} / yr
              </span>
            </div>
          )}
          {subscription.billingCycle === 'annual' && (
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Monthly equiv.</span>
              <span className="text-sm font-extrabold text-slate-800">
                £{(subscription.amount / 12).toFixed(2)} / mo
              </span>
            </div>
          )}
        </div>

        {/* Renewal Date & Timing Indicator */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Next Renewal Date:</span>
            </span>
            <span className="font-bold text-slate-900">
              {new Date(subscription.nextRenewalDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Renewal Notice:</span>
            </span>
            {isCancelled ? (
              <span className="text-slate-500 font-semibold">Cancelled (No renewal)</span>
            ) : isOverdue ? (
              <span className="text-amber-700 font-bold">Renewed recently</span>
            ) : isRenewalSoon ? (
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold text-xs">
                ⚠️ Due in {diffDays} {diffDays === 1 ? 'day' : 'days'}
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-md">
                In {diffDays} days
              </span>
            )}
          </div>
        </div>

        {/* Account Reference / Notes */}
        {(subscription.accountReference || subscription.notes) && (
          <div className="bg-slate-50/80 rounded-xl p-3 text-xs sm:text-sm text-slate-700 border border-slate-200/60 space-y-1">
            {subscription.accountReference && (
              <p className="font-medium text-slate-800">
                <span className="text-slate-500">Ref/Account:</span> {subscription.accountReference}
              </p>
            )}
            {subscription.notes && (
              <p className="text-slate-600 italic">"{subscription.notes}"</p>
            )}
          </div>
        )}

        {/* Family Sharing Indicator */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {subscription.sharedWithFamily && subscription.sharedWithFamily.length > 0
              ? 'Shared with linked family carers'
              : 'Private to Margaret'}
          </span>
          <span className="text-slate-400">
            Added via {subscription.detectedVia === 'manual' ? 'Manual entry' : 'Scan'}
          </span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col gap-2.5">
        {/* Prominent "Help me cancel this" Button */}
        {!isCancelled && (
          <button
            id={`btn-help-cancel-${subscription.trackId}`}
            onClick={() => onHelpCancel(subscription)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-[0.99] text-amber-950 font-bold text-sm flex items-center justify-center gap-2 border border-amber-300 shadow-sm transition-all"
          >
            <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Help me cancel this subscription</span>
          </button>
        )}

        {/* Management Controls Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Toggle Active / Cancelled / Resolved */}
          {canEdit && (
            <button
              onClick={() => onToggleStatus(subscription.trackId, subscription.status)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2 py-1 px-1.5"
            >
              {isCancelled ? 'Re-activate tracking' : isFlagged ? 'Mark price jump as reviewed' : 'Mark as Cancelled'}
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {canEdit && (
              <button
                id={`btn-edit-sub-${subscription.trackId}`}
                onClick={() => onEdit(subscription)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                title="Edit subscription details"
                aria-label="Edit subscription details"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}

            {canEdit && !showConfirmDelete && (
              <button
                id={`btn-delete-sub-${subscription.trackId}`}
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete subscription"
                aria-label="Delete subscription"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {showConfirmDelete && (
              <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
                <button
                  onClick={() => {
                    onDelete(subscription.trackId);
                    setShowConfirmDelete(false);
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
