import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Receipt,
  Share2,
  Calendar,
  Sparkles,
  PieChart,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { SubscriptionSpendSummary } from '../../types';
import { getCategoryMeta } from './SubscriptionCard';

interface SubscriptionSpendSummaryCardProps {
  summary: SubscriptionSpendSummary;
  onOpenShareModal: () => void;
  seniorName?: string;
  isCarerView?: boolean;
}

export const SubscriptionSpendSummaryCard: React.FC<SubscriptionSpendSummaryCardProps> = ({
  summary,
  onOpenShareModal,
  seniorName = 'Margaret',
  isCarerView = false,
}) => {
  return (
    <div
      id="subscription-spend-summary-card"
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Total Spend Summary
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {isCarerView ? `${seniorName}'s Recurring Bills` : 'What You Are Paying For'}
              </h2>
            </div>
          </div>

          {/* Share with family button */}
          <button
            id="btn-share-subscriptions-summary"
            onClick={onOpenShareModal}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>Share Summary with Family</span>
          </button>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Monthly Spend */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Estimated Monthly</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                £{summary.monthlyTotal.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ month</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Based on active monthly direct debits & prorated annual bills.
            </p>
          </div>

          {/* Annual Spend */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Estimated Annual</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                £{summary.annualTotal.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ year</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Total projected 12-month recurring expenditure.
            </p>
          </div>

          {/* Active vs Flagged Items */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-amber-400/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                Tracking Status
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div>
                  <span className="text-2xl font-bold text-emerald-400">
                    {summary.activeCount}
                  </span>
                  <span className="text-xs text-slate-300 block font-medium">Active Bills</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <span className="text-2xl font-bold text-amber-400">
                    {summary.flaggedCount}
                  </span>
                  <span className="text-xs text-slate-300 block font-medium">Flagged Jumps</span>
                </div>
              </div>
            </div>

            {summary.flaggedCount > 0 && (
              <div className="mt-3 bg-amber-500/20 border border-amber-400/50 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{summary.flaggedCount} subscription has a price increase!</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Chips */}
        {summary.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
          <div className="pt-2 border-t border-slate-700/80">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <PieChart className="w-4 h-4 text-slate-400" />
              <span>Spend by Category (Monthly)</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {summary.categoryBreakdown.map((cat) => {
                const meta = getCategoryMeta(cat.category);
                const IconComp = meta.icon;
                return (
                  <div
                    key={cat.category}
                    className="bg-white/10 hover:bg-white/15 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2.5 text-xs transition-colors"
                  >
                    <IconComp className="w-4 h-4 text-amber-300" />
                    <div>
                      <span className="font-semibold text-slate-200 block">{meta.label}</span>
                      <span className="font-extrabold text-white">
                        £{cat.monthlyAmount.toFixed(2)}/mo ({cat.count})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
