import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Bell,
  FileText,
  CreditCard,
  Home,
  HelpCircle,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  Plus,
  Lock,
  Eye,
  Edit,
  Sliders,
  Check,
  PhoneCall,
  Mail,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  FamilyLink,
  SeniorDigestData,
  ModulePermissionMap,
  PermissionLevel,
  ReminderRecord,
  ScamCheckRecord,
  DocumentRecord,
  TrackedSubscription,
} from '../../types';
import {
  getSeniorDigest,
  markReminderDone,
  snoozeReminder,
} from '../../lib/firestoreService';

interface Props {
  carerUid: string;
  carerName: string;
  carerEmail?: string;
  linkedSeniors: FamilyLink[];
  navigate: (route: string) => void;
  onRefreshLinks: () => void;
}

export const CarerDigestDashboard: React.FC<Props> = ({
  carerUid,
  carerName,
  carerEmail,
  linkedSeniors,
  navigate,
  onRefreshLinks,
}) => {
  const activeSeniors = linkedSeniors.filter((l) => l.status === 'active');
  const [selectedSeniorUid, setSelectedSeniorUid] = useState<string>(
    activeSeniors[0]?.seniorUid || 'senior_margaret_jenkins'
  );
  const [digestData, setDigestData] = useState<Record<string, SeniorDigestData>>({});
  const [loading, setLoading] = useState(true);
  const [actionDoneReminderId, setActionDoneReminderId] = useState<string | null>(null);

  const currentLink = activeSeniors.find((l) => l.seniorUid === selectedSeniorUid) || activeSeniors[0];
  const currentSeniorName = currentLink?.seniorName || 'Margaret Jenkins';
  const currentPermissions = currentLink?.permissions || {};

  // Fetch digests for all linked seniors
  useEffect(() => {
    let isMounted = true;
    async function loadDigests() {
      setLoading(true);
      const results: Record<string, SeniorDigestData> = {};

      for (const link of activeSeniors) {
        try {
          const digest = await getSeniorDigest(
            link.seniorUid,
            link.permissions,
            link.seniorName || 'Senior'
          );
          results[link.seniorUid] = digest;
        } catch (err) {
          console.warn('Error loading senior digest for', link.seniorUid, err);
        }
      }

      if (isMounted) {
        setDigestData(results);
        setLoading(false);
      }
    }

    if (activeSeniors.length > 0) {
      loadDigests();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [linkedSeniors]);

  const currentDigest = digestData[selectedSeniorUid] || {
    seniorUid: selectedSeniorUid,
    seniorName: currentSeniorName,
    permissions: currentPermissions,
    scamChecks: { totalCount: 0, flaggedCount: 0, recentChecks: [] },
    reminders: { upcomingCount: 0, overdueCount: 0, upcomingList: [] },
    documents: { totalCount: 0, expiringSoonCount: 0, expiringList: [] },
    subscriptions: { activeCount: 0, monthlyTotal: 0, flaggedCount: 0, flaggedList: [] },
    escalations: [],
  };

  const handleMarkReminderComplete = async (reminderId: string) => {
    setActionDoneReminderId(reminderId);
    try {
      await markReminderDone(reminderId);
      // Update local digest state
      setDigestData((prev) => {
        const existing = prev[selectedSeniorUid];
        if (!existing) return prev;
        return {
          ...prev,
          [selectedSeniorUid]: {
            ...existing,
            reminders: {
              ...existing.reminders,
              upcomingList: existing.reminders.upcomingList.filter((r) => r.reminderId !== reminderId),
              upcomingCount: Math.max(0, existing.reminders.upcomingCount - 1),
            },
          },
        };
      });
    } catch (err) {
      console.error('Error completing reminder:', err);
    } finally {
      setActionDoneReminderId(null);
    }
  };

  // Check if any escalations exist across all seniors
  const allEscalations = (Object.values(digestData) as SeniorDigestData[]).flatMap((d) =>
    d.escalations.map((esc) => ({ ...esc, seniorName: d.seniorName, seniorUid: d.seniorUid }))
  );

  return (
    <div className="space-y-8" id="carer-digest-dashboard">
      {/* Top Welcome & Multi-Senior Switcher */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                Family & Carer Portal
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Logged in as {carerName} ({carerEmail || 'Family Member'})
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Family Care Digest
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
              Review safety checks, upcoming appointments, and bills across your linked family members.
            </p>
          </div>
        </div>

        {/* Multi-Senior Switcher Tabs */}
        {activeSeniors.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Linked Family Members ({activeSeniors.length})
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {activeSeniors.map((link) => {
                const isSelected = link.seniorUid === selectedSeniorUid;
                const d = digestData[link.seniorUid];
                const alertsCount = (d?.scamChecks?.flaggedCount || 0) + (d?.escalations?.length || 0);

                return (
                  <button
                    key={link.linkId}
                    onClick={() => setSelectedSeniorUid(link.seniorUid)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-stone-900 dark:text-stone-100 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    id={`senior-tab-${link.seniorUid}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold flex items-center justify-center text-sm">
                      {link.seniorName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{link.seniorName}</span>
                        {alertsCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                            {alertsCount} alert{alertsCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 block">
                        {link.relationship || 'Senior'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Urgent Attention / Escalation Banner */}
      {allEscalations.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3" id="carer-escalations-banner">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Urgent Attention Required ({allEscalations.length})</span>
            </h3>
            <span className="text-xs text-amber-800 dark:text-amber-300">
              Escalations from "Ask a Family Member"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allEscalations.map((esc) => (
              <div
                key={esc.id}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/50 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {esc.seniorName}
                    </span>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {esc.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {esc.description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(esc.route)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-2xs"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permission scope indicator */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-100 dark:bg-stone-850 rounded-xl text-xs text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>
            Viewing <strong className="text-stone-900 dark:text-stone-200">{currentSeniorName}</strong>'s records.
            Permissions granted: {Object.keys(currentPermissions).map((k) => k.replace(/-/g, ' ')).join(', ')}.
          </span>
        </div>
        <span className="text-stone-500">Controlled by {currentSeniorName}</span>
      </div>

      {/* Modules Digest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Scam Protection Digest */}
        {currentPermissions['scam-protection'] && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Scam Protection
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentDigest.scamChecks.totalCount} safety checks completed
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/scam-protection')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1"
              >
                <span>Full Safety Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentDigest.scamChecks.flaggedCount > 0 ? (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{currentDigest.scamChecks.flaggedCount} Suspicious Message(s) Flagged</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Suspicious communications were detected and flagged. Review the safety advice to protect against banking fraud.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">No active threats detected</p>
                  <p className="text-stone-500 dark:text-stone-400">All recent safety checks evaluated as safe.</p>
                </div>
              </div>
            )}

            {/* Recent Scam Checks */}
            {currentDigest.scamChecks.recentChecks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Recent Messages Checked
                </p>
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {currentDigest.scamChecks.recentChecks.slice(0, 3).map((chk) => (
                    <div key={chk.checkId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-stone-800 dark:text-stone-200">
                          {chk.category.replace(/_/g, ' ')}
                        </p>
                        <p className="text-stone-500 dark:text-stone-400 line-clamp-1">
                          {chk.adviceSummary}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${
                          chk.verdict === 'likely_scam'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : chk.verdict === 'caution'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {chk.verdict.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Life Reminders Digest */}
        {currentPermissions['reminders'] && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Life Reminders
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentDigest.reminders.upcomingCount} upcoming appointments
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/reminders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
              >
                <span>View Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upcoming List */}
            {currentDigest.reminders.upcomingList.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                No upcoming reminders scheduled for this period.
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentDigest.reminders.upcomingList.map((rem) => {
                  const isDoneLoading = actionDoneReminderId === rem.reminderId;

                  return (
                    <div
                      key={rem.reminderId}
                      className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                            {rem.title}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium">
                            {rem.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {new Date(rem.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {rem.dueTime ? `at ${rem.dueTime}` : ''}</span>
                        </p>
                      </div>

                      {/* Complete button if allowed */}
                      {(currentPermissions['reminders'] === 'edit' || currentPermissions['reminders'] === 'manage') && (
                        <button
                          onClick={() => handleMarkReminderComplete(rem.reminderId)}
                          disabled={isDoneLoading}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-colors shadow-2xs"
                          title="Mark reminder as completed"
                        >
                          {isDoneLoading ? (
                            <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          <span>Done</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. Document Vault Digest */}
        {currentPermissions['document-vault'] && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Document Vault
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentDigest.documents.totalCount} secure documents stored
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/document-vault')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                <span>View Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentDigest.documents.expiringSoonCount > 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-2">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{currentDigest.documents.expiringSoonCount} Document(s) Expiring Within 90 Days</span>
                </p>
                <div className="divide-y divide-amber-100 dark:divide-amber-900/40 pt-1">
                  {currentDigest.documents.expiringList.map((doc) => (
                    <div key={doc.docId} className="py-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 dark:text-stone-200 line-clamp-1">{doc.title}</span>
                      <span className="text-amber-800 dark:text-amber-300 shrink-0 font-mono">
                        Expires {doc.expiryDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All key insurance policies and identity documents are up to date.</span>
              </div>
            )}
          </div>
        )}

        {/* 4. Subscription Manager Digest */}
        {currentPermissions['subscription-manager'] && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Subscription Manager
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentDigest.subscriptions.activeCount} active recurring payments
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/subscription-manager')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
              >
                <span>View Subscriptions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold">
                  Estimated Monthly Spend
                </p>
                <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-0.5">
                  £{currentDigest.subscriptions.monthlyTotal.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500 ml-1">/ month</span>
                </p>
              </div>

              {currentDigest.subscriptions.flaggedCount > 0 && (
                <div className="text-right">
                  <span className="px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    {currentDigest.subscriptions.flaggedCount} Price Jump Flagged
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Home Manager Digest */}
        {currentPermissions['home-manager'] && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Home Manager
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentDigest.homeManager?.totalAssets || 3} tracked appliances & trades
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/home-manager')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1"
              >
                <span>View Home Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 rounded-xl space-y-2">
              <p className="text-xs font-bold text-teal-900 dark:text-teal-200">
                Boiler & Appliance Maintenance
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Boiler and safety alarms have active service reminders configured. Trusted tradespeople contacts are on file.
              </p>
            </div>
          </div>
        )}

        {/* 6. Digital Help Digest */}
        {currentPermissions['digital-help'] && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Digital Help & Tech Support
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Assistance channel & guides
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/digital-help')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                <span>Open Digital Help</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl space-y-2">
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Carer Support Channel
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                When {currentSeniorName} taps "Ask a family member" on complex app or tablet tasks, you will receive real-time notifications here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
