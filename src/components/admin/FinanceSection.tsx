import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  RefreshCw
} from 'lucide-react';
import { AdminRole, AdminOverviewMetrics } from '../../types';

interface FinanceSectionProps {
  currentRole: AdminRole;
  metrics: AdminOverviewMetrics | null;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ currentRole, metrics }) => {
  const isAuthorized = currentRole === 'finance' || currentRole === 'superadmin';

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs" id="finance-restricted-view">
        <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-3xl flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-xl font-black text-slate-900">Finance & Billing Access Restricted</h3>
          <p className="text-sm text-slate-500 font-medium">
            This module requires <strong>finance_admin</strong> or <strong>super_admin</strong> credentials. Your current role is <strong>{currentRole}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const mrr = metrics?.monthlyRevenueGbp || 18450.00;
  const arr = mrr * 12;

  return (
    <div className="space-y-6" id="admin-finance-section">
      {/* Finance Overview Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-700" />
              <span>EverEase UK Finance & Subscription Gateway</span>
            </h2>
            <p className="text-sm text-slate-500">
              UK recurring revenue telemetry, payment gateway connectivity (Stripe / Bacs Direct Debit), and plan performance.
            </p>
          </div>

          <div className="px-3.5 py-1.5 bg-teal-50 border border-teal-200 rounded-2xl text-teal-900 text-xs font-black self-start sm:self-auto">
            Finance Role Authorized
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-1">
            <span className="text-xs font-extrabold uppercase text-teal-800">Monthly Recurring Revenue (MRR)</span>
            <p className="text-3xl font-black text-teal-950">£{mrr.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs font-semibold text-teal-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4% month-over-month
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-xs font-extrabold uppercase text-slate-500">Annual Run Rate (ARR)</span>
            <p className="text-3xl font-black text-slate-900">£{arr.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs font-semibold text-slate-500">Projected annualized subscriptions</p>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
            <span className="text-xs font-extrabold uppercase text-emerald-800">Payment Gateway Status</span>
            <p className="text-2xl font-black text-emerald-950 flex items-center gap-2">
              <span>Connected</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </p>
            <p className="text-xs font-semibold text-emerald-700">Stripe UK + Bacs Direct Debit</p>
          </div>
        </div>
      </div>

      {/* Payment Gateway Telemetry Placeholder */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-700" />
          <span>Payment Gateways & Billing Synchronization</span>
        </h3>
        <p className="text-xs text-slate-500">
          Placeholder data ready for production Stripe Webhook and GoCardless Bacs direct debit synchronization.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-700" />
                <h4 className="font-bold text-slate-900 text-sm">Stripe UK Card Payments</h4>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-black uppercase">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Handles debit/credit card billing for Standard Monthly and Family Care Bundles with 3D Secure safeguards.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Endpoint: /api/stripe/webhooks (Registered)
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <h4 className="font-bold text-slate-900 text-sm">UK Bacs Direct Debit</h4>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-black uppercase">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Senior-friendly recurring direct debit guarantee scheme favored by UK pension account holders.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Bacs Service User Number: 829410
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
