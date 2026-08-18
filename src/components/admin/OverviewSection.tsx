import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  CreditCard, 
  DollarSign, 
  BookOpen, 
  Bell, 
  FileText, 
  Home, 
  Repeat, 
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { AdminOverviewMetrics } from '../../types';

interface OverviewSectionProps {
  metrics: AdminOverviewMetrics | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectTab: (tab: any) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  metrics,
  loading,
  onRefresh,
  onSelectTab,
}) => {
  if (loading || !metrics) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-bold text-sm">Aggregating real-time safeguarding metrics...</p>
      </div>
    );
  }

  const totalPaidPlans = 
    metrics.planCounts.standard_monthly + 
    metrics.planCounts.family_care_bundle + 
    metrics.planCounts.annual_saver;

  return (
    <div className="space-y-8" id="admin-overview-section">
      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total User Base</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">{metrics.totalUsers.toLocaleString()}</p>
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% new senior accounts this month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Seniors (UK)</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-900">{metrics.activeSeniors.toLocaleString()}</p>
          <p className="text-xs font-semibold text-slate-500">
            Average age: 74 • 98% UK residential
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Linked Family Carers</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <HeartHandshake className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-blue-900">{metrics.linkedFamilyCarers.toLocaleString()}</p>
          <p className="text-xs font-semibold text-blue-700">
            {((metrics.linkedFamilyCarers / (metrics.activeSeniors || 1))).toFixed(1)} carers per senior average
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scams Blocked</span>
            <span className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-rose-800">{metrics.moduleUsage.flaggedScams}</p>
          <p className="text-xs font-semibold text-rose-700">
            {metrics.moduleUsage.totalScamChecks.toLocaleString()} total messages analysed
          </p>
        </div>
      </div>

      {/* Subscription Plans Distribution Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-700" />
              <span>Subscription Plans & Member Distribution</span>
            </h2>
            <p className="text-sm text-slate-500">Live breakdown of UK memberships across subscription tiers</p>
          </div>
          <div className="text-left sm:text-right bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200">
            <span className="text-xs font-bold text-purple-900 uppercase">Estimated Monthly Recurring (MRR)</span>
            <p className="text-xl font-black text-purple-950">£{metrics.monthlyRevenueGbp.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-500">Free Trial</span>
              <span className="text-xs font-black px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">14 Days</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{metrics.planCounts.free_trial}</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, (metrics.planCounts.free_trial / metrics.totalUsers) * 100)}%` }} 
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">£0.00 / month • Free safeguarding trial</p>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-800">Standard Senior</span>
              <span className="text-xs font-black px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md">£4.99/mo</span>
            </div>
            <p className="text-2xl font-black text-emerald-950">{metrics.planCounts.standard_monthly}</p>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full" 
                style={{ width: `${Math.min(100, (metrics.planCounts.standard_monthly / metrics.totalUsers) * 100)}%` }} 
              />
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">Solo senior essentials + scam filter</p>
          </div>

          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-purple-800">Family Care Bundle</span>
              <span className="text-xs font-black px-2 py-0.5 bg-purple-200 text-purple-900 rounded-md">£12.99/mo</span>
            </div>
            <p className="text-2xl font-black text-purple-950">{metrics.planCounts.family_care_bundle}</p>
            <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full" 
                style={{ width: `${Math.min(100, (metrics.planCounts.family_care_bundle / metrics.totalUsers) * 100)}%` }} 
              />
            </div>
            <p className="text-[11px] text-purple-800 font-medium">Multi-carer digest + all 7 modules</p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-amber-900">Annual Safeguard</span>
              <span className="text-xs font-black px-2 py-0.5 bg-amber-200 text-amber-950 rounded-md">£49.99/yr</span>
            </div>
            <p className="text-2xl font-black text-amber-950">{metrics.planCounts.annual_saver}</p>
            <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full rounded-full" 
                style={{ width: `${Math.min(100, (metrics.planCounts.annual_saver / metrics.totalUsers) * 100)}%` }} 
              />
            </div>
            <p className="text-[11px] text-amber-800 font-medium">Billed annually • Freephone support</p>
          </div>
        </div>
      </div>

      {/* 7 Module Activity & Usage Counters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-700" />
            <span>7 Core Safeguarding Modules — Telemetry & Usage</span>
          </h2>
          <p className="text-sm text-slate-500">Live operational counts aggregated across the EverEase platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
          {/* Module 1: Scam Protection */}
          <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-900 uppercase">1. Scam Protection</span>
              <ShieldCheck className="w-4 h-4 text-rose-700" />
            </div>
            <p className="text-2xl font-black text-rose-950">{metrics.moduleUsage.totalScamChecks.toLocaleString()}</p>
            <p className="text-xs text-rose-800 font-medium">
              <span className="font-bold">{metrics.moduleUsage.flaggedScams}</span> suspicious items blocked
            </p>
          </div>

          {/* Module 2: Digital Help */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 uppercase">2. Digital Help</span>
              <BookOpen className="w-4 h-4 text-blue-700" />
            </div>
            <p className="text-2xl font-black text-blue-950">{metrics.moduleUsage.guidesPublished}</p>
            <p className="text-xs text-blue-800 font-medium">
              Guides in library • Step-by-step
            </p>
          </div>

          {/* Module 3: Life Reminders */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase">3. Life Reminders</span>
              <Bell className="w-4 h-4 text-amber-700" />
            </div>
            <p className="text-2xl font-black text-amber-950">{metrics.moduleUsage.activeReminders.toLocaleString()}</p>
            <p className="text-xs text-amber-800 font-medium">
              Pills, appointments & renewals
            </p>
          </div>

          {/* Module 4: Document Vault */}
          <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-900 uppercase">4. Document Vault</span>
              <FileText className="w-4 h-4 text-teal-700" />
            </div>
            <p className="text-2xl font-black text-teal-950">{metrics.moduleUsage.documentsSecured.toLocaleString()}</p>
            <p className="text-xs text-teal-800 font-medium">
              Encrypted UK records & passes
            </p>
          </div>

          {/* Module 5: Home Manager */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase">5. Home Manager</span>
              <Home className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-2xl font-black text-slate-900">{metrics.moduleUsage.homeAssetsTracked.toLocaleString()}</p>
            <p className="text-xs text-slate-600 font-medium">
              Boilers, warranties & trades
            </p>
          </div>

          {/* Module 6: Subscription Manager */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 uppercase">6. Subscriptions</span>
              <Repeat className="w-4 h-4 text-purple-700" />
            </div>
            <p className="text-2xl font-black text-purple-950">{metrics.moduleUsage.subscriptionsMonitored.toLocaleString()}</p>
            <p className="text-xs text-purple-800 font-medium">
              <span className="font-bold">{metrics.moduleUsage.flaggedSubscriptions}</span> flagged for price hikes
            </p>
          </div>

          {/* Module 7: Family Connect */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase">7. Family Connect</span>
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl font-black text-emerald-950">{metrics.linkedFamilyCarers.toLocaleString()}</p>
            <p className="text-xs text-emerald-800 font-medium">
              Active permissioned links
            </p>
          </div>

          {/* Support Escalation Inbox */}
          <div 
            onClick={() => onSelectTab('inbox')}
            className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2 cursor-pointer hover:bg-indigo-100/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 uppercase">Support Inbox</span>
              <ArrowUpRight className="w-4 h-4 text-indigo-700" />
            </div>
            <p className="text-2xl font-black text-indigo-950">{metrics.moduleUsage.openSupportTickets}</p>
            <p className="text-xs text-indigo-800 font-medium">
              Open tickets • <span className="font-bold">{metrics.moduleUsage.resolvedSupportTickets}</span> resolved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
