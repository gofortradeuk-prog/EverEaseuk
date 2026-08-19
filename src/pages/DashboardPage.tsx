import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  CalendarClock, 
  FileLock2, 
  Home as HomeIcon, 
  Receipt, 
  Users, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Calendar,
  Stethoscope,
  Gift,
  Wrench,
  RefreshCw,
  FileText,
  Check,
  Search,
  ExternalLink,
  MessageSquare,
  XCircle,
  CreditCard
} from 'lucide-react';
import { MODULES } from '../lib/modulesData';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { ModuleDefinition, ReminderRecord, FamilyLink } from '../types';
import { 
  subscribeRemindersForSenior, 
  getRemindersForSenior,
  markReminderDone,
  createReminder,
  subscribeFamilyLinksForCarer,
  getInitialSeededReminders,
  cancelUserMembership,
  reactivateUserMembership,
  getStoredUserCancellation,
  MembershipCancellationRecord
} from '../lib/firestoreService';
import { ReminderModal } from '../components/reminders/ReminderModal';
import { CarerDigestDashboard } from '../components/family/CarerDigestDashboard';
import { CancelSubscriptionModal, CancellationResult } from '../components/subscriptions/CancelSubscriptionModal';

interface DashboardPageProps {
  navigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { currentUser, userProfile, switchUserRole } = useAuth();
  const { speakText } = useAccessibility();

  const isCarer = userProfile?.role === 'family_carer';
  const seniorUid = currentUser?.uid || 'demo_senior_uid';
  const seniorName = userProfile?.displayName || (isCarer ? 'Sarah Davies' : 'Margaret Davies');

  // Reminders state for Senior Dashboard
  const [reminders, setReminders] = useState<ReminderRecord[]>(() => getInitialSeededReminders(seniorUid));
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cancellation & Refund Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationRecord, setCancellationRecord] = useState<MembershipCancellationRecord | null>(() => 
    getStoredUserCancellation(seniorUid)
  );

  // Carer links state for Family Carer Landing
  const [carerLinks, setCarerLinks] = useState<FamilyLink[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleConfirmCancelSubscription = async (result: CancellationResult) => {
    try {
      await cancelUserMembership(seniorUid, {
        reason: result.reason,
        refundRequested: result.refundRequested,
        refundReasonCategory: result.refundReasonCategory,
        notes: result.notes,
        referenceCode: result.referenceCode,
        effectiveEndDate: result.effectiveEndDate,
        planName: result.planName,
        price: result.price,
      });

      const updatedRecord = getStoredUserCancellation(seniorUid);
      setCancellationRecord(updatedRecord || {
        uid: seniorUid,
        planName: result.planName,
        reason: result.reason,
        refundRequested: result.refundRequested,
        referenceCode: result.referenceCode,
        cancelledAt: result.cancelledAt,
        effectiveEndDate: result.effectiveEndDate,
        status: result.refundRequested ? 'pending_refund' : 'cancelled',
      });

      showToast(
        result.refundRequested
          ? `✓ Subscription cancelled (Ref: ${result.referenceCode}). Your refund request has been sent for review.`
          : `✓ Subscription cancelled (Ref: ${result.referenceCode}). No future charges will be taken.`
      );
    } catch (err) {
      console.error('Failed to cancel membership:', err);
      showToast('Error recording cancellation. Please contact support.');
    }
  };

  const handleReactivateMembership = async () => {
    try {
      await reactivateUserMembership(seniorUid);
      setCancellationRecord(null);
      showToast('✓ EverEase Membership reactivated successfully. Your protection is active.');
    } catch (err) {
      console.error('Failed to reactivate:', err);
      showToast('Could not reactivate membership. Please try again.');
    }
  };

  // Real-time Reminders Subscription for Senior
  useEffect(() => {
    if (isCarer) return;

    setLoadingReminders(true);
    const unsub = subscribeRemindersForSenior(
      seniorUid,
      (updatedList) => {
        setReminders(updatedList);
        setLoadingReminders(false);
      },
      (err) => {
        console.warn('Error subscribing to senior reminders:', err);
        setLoadingReminders(false);
      }
    );

    return () => {
      unsub();
    };
  }, [seniorUid, isCarer]);

  // Real-time Carer Links Subscription for Family Carer
  useEffect(() => {
    if (!isCarer) return;

    const carerUid = currentUser?.uid || 'family_david_jenkins';
    const carerEmail = currentUser?.email || 'david.jenkins@example.co.uk';

    const unsubCarer = subscribeFamilyLinksForCarer(carerUid, carerEmail, (links) => {
      setCarerLinks(links);
    });

    return () => {
      unsubCarer();
    };
  }, [currentUser, isCarer, refreshTrigger]);

  // Filter reminders for "Today & This Week"
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);
  const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

  const activeReminders = reminders.filter(
    (r) => r.status === 'upcoming' || r.status === 'snoozed'
  );

  const todayReminders = activeReminders.filter((r) => r.dueDate <= todayStr);
  const thisWeekReminders = activeReminders.filter(
    (r) => r.dueDate > todayStr && r.dueDate <= endOfWeekStr
  );

  const handleMarkDone = async (reminder: ReminderRecord) => {
    try {
      await markReminderDone(reminder.reminderId);
      setReminders((prev) =>
        prev.map((r) =>
          r.reminderId === reminder.reminderId ? { ...r, status: 'done' } : r
        )
      );
      showToast(`✓ Marked "${reminder.title}" as completed.`);
    } catch (err: any) {
      console.error('Failed to mark reminder done:', err);
      showToast('Could not complete reminder. Please try again.');
    }
  };

  const handleCreateReminder = async (newReminder: ReminderRecord) => {
    try {
      await createReminder(newReminder);
      setReminders((prev) => [newReminder, ...prev]);
      setIsAddReminderModalOpen(false);
      showToast(`✓ Reminder added for ${newReminder.dueDate}.`);
    } catch (err: any) {
      console.error('Failed to save reminder:', err);
      showToast('Error saving reminder. Please try again.');
    }
  };

  const getModuleIcon = (iconName: string) => {
    const iconClass = "w-8 h-8 md:w-9 md:h-9 text-white shrink-0";
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className={iconClass} />;
      case 'HelpCircle':
        return <HelpCircle className={iconClass} />;
      case 'CalendarClock':
        return <CalendarClock className={iconClass} />;
      case 'FileLock2':
        return <FileLock2 className={iconClass} />;
      case 'Home':
        return <HomeIcon className={iconClass} />;
      case 'Receipt':
        return <Receipt className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const getAccentBg = (color: string) => {
    switch (color) {
      case 'rose':
        return 'bg-gradient-to-tr from-rose-600 to-rose-500 shadow-rose-200';
      case 'blue':
        return 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-200';
      case 'amber':
        return 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-amber-200';
      case 'emerald':
        return 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-200';
      case 'indigo':
        return 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-200';
      case 'teal':
        return 'bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-teal-200';
      case 'purple':
        return 'bg-gradient-to-tr from-purple-600 to-violet-500 shadow-purple-200';
      default:
        return 'bg-slate-700';
    }
  };

  const getCardBorderHover = (color: string) => {
    switch (color) {
      case 'rose':
        return 'hover:border-rose-400 hover:shadow-md';
      case 'blue':
        return 'hover:border-blue-400 hover:shadow-md';
      case 'amber':
        return 'hover:border-amber-400 hover:shadow-md';
      case 'emerald':
        return 'hover:border-emerald-400 hover:shadow-md';
      case 'indigo':
        return 'hover:border-indigo-400 hover:shadow-md';
      case 'teal':
        return 'hover:border-teal-400 hover:shadow-md';
      case 'purple':
        return 'hover:border-purple-400 hover:shadow-md';
      default:
        return 'hover:border-slate-400 hover:shadow-md';
    }
  };

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'birthday':
        return <Gift className="w-5 h-5 text-pink-600 shrink-0" />;
      case 'service':
        return <Wrench className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'renewal':
      default:
        return <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
  };

  const formatReminderDate = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // ===========================================================================
  // 1. FAMILY / CARER DIRECT LANDING VIEW
  // ===========================================================================
  if (isCarer) {
    return (
      <div className="w-full max-w-[1500px] mx-auto px-4 py-6 md:py-8 space-y-6" id="carer-dashboard-landing">
        {/* Carer Landing Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full">
                Family & Carer Portal
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                Multi-Senior Care Hub
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, {userProfile?.displayName || 'Family Carer'}
            </h1>
            <p className="text-base md:text-lg text-slate-600 font-medium">
              Real-time safeguarding, health reminders, and document oversight across your linked family members.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/family-connect')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-colors shadow-xs"
              id="manage-family-network-btn"
            >
              <Users className="w-5 h-5 text-amber-300" />
              <span>Manage Care Network</span>
            </button>
          </div>
        </div>

        {/* Embedded Multi-Senior Digest Dashboard with Switcher */}
        <CarerDigestDashboard
          carerUid={currentUser?.uid || 'family_david_jenkins'}
          carerName={userProfile?.displayName || 'David Jenkins'}
          carerEmail={currentUser?.email || 'david.jenkins@example.co.uk'}
          linkedSeniors={carerLinks}
          navigate={navigate}
          onRefreshLinks={() => setRefreshTrigger((prev) => prev + 1)}
        />

        {/* Family Carer Membership & Plan Management Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5" id="carer-membership-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Receipt className="w-6 h-6 text-emerald-600 shrink-0" />
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  EverEase Family Membership &amp; Billing
                </h2>
              </div>
              <p className="text-sm md:text-base text-slate-600 font-medium">
                Manage your family plan subscription, Direct Debit protection, and refund guarantees.
              </p>
            </div>

            <div>
              {cancellationRecord && cancellationRecord.status !== 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-extrabold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cancellation Scheduled</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active &amp; Direct Debit Protected</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Plan</span>
              <h3 className="text-lg font-black text-slate-900">{userProfile?.plan || 'EverEase Complete + Family Plan'}</h3>
              <p className="text-sm font-semibold text-slate-600">£65.00 / month &bull; BACS Direct Debit</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Billing Status</span>
              <p className="text-sm font-bold text-slate-800">
                {cancellationRecord && cancellationRecord.status !== 'active' ? (
                  <span className="text-rose-700">Active until {cancellationRecord.effectiveEndDate}</span>
                ) : (
                  <span className="text-emerald-700">Protected &bull; Renews 1st of next month</span>
                )}
              </p>
              <p className="text-xs text-slate-500">Guaranteed by BACS Direct Debit Guarantee</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-center gap-2">
              {cancellationRecord && cancellationRecord.status !== 'active' ? (
                <button
                  onClick={handleReactivateMembership}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer text-center"
                  id="carer-reactivate-membership-btn"
                >
                  Reactivate Membership
                </button>
              ) : (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 hover:text-rose-800 font-extrabold text-sm shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  id="carer-cancel-subscription-btn"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Cancel Subscription</span>
                </button>
              )}

              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold underline text-center cursor-pointer"
              >
                View Refund Policy &amp; Cancellation Terms
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Subscription & Refund Policy Modal */}
        <CancelSubscriptionModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirmCancel={handleConfirmCancelSubscription}
          planName={userProfile?.plan || 'EverEase Complete + Family Plan'}
          monthlyPrice={65.0}
          paymentMethod="BACS Direct Debit"
          navigate={navigate}
        />
      </div>
    );
  }

  // ===========================================================================
  // 2. SENIOR USER DASHBOARD VIEW
  // ===========================================================================
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 py-6 md:py-8 space-y-8" id="dashboard-main">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold rounded-2xl flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span className="text-base md:text-lg">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-xs uppercase font-extrabold text-emerald-800 hover:text-emerald-950 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Personalized Senior Greeting Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full">
                Your EverEase Care Space
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                UK Protected
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              Good day, {seniorName}!
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium">
              What would you like assistance with today? Tap any of the 7 sections below or check a suspicious message right away.
            </p>
          </div>

          {/* Quick Helpline Card */}
          <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center gap-3.5 shrink-0 shadow-xs">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 block">
                Free UK Phone Help
              </span>
              <a 
                href="tel:08008882026" 
                className="text-lg md:text-xl font-black text-emerald-950 underline hover:text-emerald-800 transition-colors"
                id="dashboard-emergency-helpline"
              >
                0800 888 2026
              </a>
            </div>
          </div>
        </div>

        {/* Safeguarding & Status Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm md:text-base font-semibold">
          <div className="flex items-center gap-2.5 text-emerald-950 bg-emerald-50/60 px-3.5 py-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>Scam Protection: <strong>Active & Guarding</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-blue-950 bg-blue-50/60 px-3.5 py-2.5 rounded-xl border border-blue-200/80 shadow-2xs">
            <Users className="w-5 h-5 text-blue-700 shrink-0" />
            <span>Family Carer: <strong>Connected & Linked</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-amber-950 bg-amber-50/60 px-3.5 py-2.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Due This Week: <strong>{todayReminders.length + thisWeekReminders.length} item(s)</strong></span>
          </div>
        </div>
      </div>

      {/* =======================================================================
          EVEREASE MEMBERSHIP & SUBSCRIPTION STATUS PANEL (WITH CANCEL BUTTON)
          ======================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5" id="dashboard-senior-membership-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-emerald-600 shrink-0" />
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                EverEase Membership &amp; Protection Plan
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 font-medium">
              Your ongoing monthly membership gives you full scam checks, reminders, document storage, and phone help.
            </p>
          </div>

          <div>
            {cancellationRecord && cancellationRecord.status !== 'active' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-extrabold text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancellation Scheduled</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active &amp; BACS Direct Debit Protected</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Your Active Plan</span>
            <h3 className="text-lg font-black text-slate-900">{userProfile?.plan || 'EverEase Complete Plan'}</h3>
            <p className="text-sm font-semibold text-slate-600">£55.00 / month &bull; BACS Direct Debit</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Billing Status</span>
            <p className="text-sm font-bold text-slate-800">
              {cancellationRecord && cancellationRecord.status !== 'active' ? (
                <span className="text-rose-700">Access active until {cancellationRecord.effectiveEndDate}</span>
              ) : (
                <span className="text-emerald-700">Active &bull; Next renewal 1st of next month</span>
              )}
            </p>
            <p className="text-xs text-slate-500">Covered by BACS Direct Debit Guarantee</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-center gap-2">
            {cancellationRecord && cancellationRecord.status !== 'active' ? (
              <button
                onClick={handleReactivateMembership}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer text-center"
                id="senior-reactivate-membership-btn"
              >
                Reactivate Membership
              </button>
            ) : (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 hover:text-rose-800 font-extrabold text-sm shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                id="senior-cancel-subscription-btn"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Cancel Subscription</span>
              </button>
            )}

            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline text-center cursor-pointer"
            >
              View Refund Policy &amp; Cancellation Terms
            </button>
          </div>
        </div>

        {cancellationRecord && cancellationRecord.status !== 'active' && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-rose-900 font-medium">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-950">
                Your subscription cancellation has been confirmed (Reference: {cancellationRecord.referenceCode}).
              </p>
              <p>
                No further payments will be taken from your bank. You retain full access to all your portals and stored documents until {cancellationRecord.effectiveEndDate}.
                {cancellationRecord.refundRequested && ' Your refund request under our policy is recorded and under review.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =======================================================================
          EXTRA-PROMINENT "IS THIS MESSAGE SAFE?" QUICK ACTION BUTTON ABOVE TILES
          ======================================================================= */}
      <div 
        className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-rose-400/60 relative overflow-hidden"
        id="quick-scam-check-hero"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-300/40 text-rose-200 text-xs md:text-sm font-extrabold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Highest Priority Safety Quick Check</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Is this message or phone call safe?
            </h2>

            <p className="text-base md:text-lg text-rose-100 font-medium leading-relaxed">
              Unsure about a text message, email, fake Royal Mail parcel fee, HMRC tax rebate, bank alert, or cold caller? Check it immediately in plain English before replying or clicking any link.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-rose-200">Common checks:</span>
              <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">Royal Mail fee</span>
              <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">HMRC tax refund</span>
              <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">Bank security alert</span>
              <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">Energy grant</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => navigate('/scam-protection')}
              className="px-8 py-5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-lg md:text-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 min-h-[60px] cursor-pointer"
              id="hero-check-message-btn"
            >
              <ShieldAlert className="w-6 h-6 text-rose-900 shrink-0" />
              <span>Check Suspicious Message Now</span>
              <ChevronRight className="w-6 h-6 text-slate-950 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================================
          "TODAY & THIS WEEK" DUE REMINDERS PANEL
          ======================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs" id="today-and-this-week-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-6 h-6 text-amber-600 shrink-0" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Today & This Week
              </h2>
            </div>
            <p className="text-base md:text-lg text-slate-600 font-medium">
              Appointments, renewal deadlines, and events due in the next 7 days.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddReminderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-sm sm:text-base transition-colors border border-amber-300 shadow-xs cursor-pointer"
              id="dashboard-add-reminder-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>

            <button
              onClick={() => navigate('/reminders')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm sm:text-base transition-colors border border-slate-200 shadow-xs cursor-pointer"
              id="dashboard-view-all-reminders-btn"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reminders List or Empty State */}
        {todayReminders.length === 0 && thisWeekReminders.length === 0 ? (
          <div className="p-8 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              All caught up for the week!
            </h3>
            <p className="text-base text-slate-600 max-w-md mx-auto font-medium">
              You have no urgent doctor appointments or bill renewals due in the next 7 days.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Today / Overdue Reminders */}
            {todayReminders.map((rem) => (
              <div
                key={rem.reminderId}
                className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-xs flex flex-col justify-between gap-4 space-y-2"
                id={`reminder-due-today-${rem.reminderId}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rem.dueDate < todayStr ? '⚠️ Overdue' : 'Due Today'}</span>
                    </span>

                    <span className="text-sm font-bold text-slate-600">
                      {rem.time || 'All Day'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200 shrink-0 shadow-2xs">
                      {getReminderTypeIcon(rem.type)}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                        {rem.title}
                      </h4>
                      {rem.location && (
                        <p className="text-sm font-bold text-slate-600 mt-0.5">
                          📍 {rem.location}
                        </p>
                      )}
                      {rem.notes && (
                        <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                          {rem.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Added by: {rem.createdByName || 'Margaret'}
                  </span>
                  <button
                    onClick={() => handleMarkDone(rem)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                    id={`mark-done-btn-${rem.reminderId}`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            ))}

            {/* This Week Reminders */}
            {thisWeekReminders.map((rem) => (
              <div
                key={rem.reminderId}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs flex flex-col justify-between gap-4 space-y-2"
                id={`reminder-this-week-${rem.reminderId}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-extrabold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>{formatReminderDate(rem.dueDate)}</span>
                    </span>

                    <span className="text-sm font-bold text-slate-500">
                      {rem.time || 'All Day'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                      {getReminderTypeIcon(rem.type)}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                        {rem.title}
                      </h4>
                      {rem.location && (
                        <p className="text-sm font-semibold text-slate-600 mt-0.5">
                          📍 {rem.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {rem.recurrence !== 'none' ? `Repeats: ${rem.recurrence}` : 'One-off event'}
                  </span>
                  <button
                    onClick={() => handleMarkDone(rem)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark Done</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =======================================================================
          SEVEN LARGE MODULE TILES (EXACT SEQUENCE)
          1. Scam Protection
          2. Digital Help
          3. Life Reminders
          4. Document Vault
          5. Home Manager
          6. Subscription Manager
          7. Family Connect
          ======================================================================= */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Your 7 Support Modules
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-medium">
            Tap any section below to open it. Designed with clear text and simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="module-tiles-grid">
          {MODULES.map((module: ModuleDefinition) => (
            <div
              key={module.id}
              className={`bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-5 shadow-xs transition-all duration-200 ${getCardBorderHover(
                module.accentColor
              )} flex flex-col justify-between`}
              id={`tile-${module.id}`}
            >
              {/* Top row: Icon, Category Badge, Title */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className={`p-3.5 rounded-2xl ${getAccentBg(module.accentColor)} shadow-xs`}>
                    {getModuleIcon(module.iconName)}
                  </div>
                  <span className="text-xs md:text-sm font-extrabold uppercase px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700">
                    {module.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {module.title}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-emerald-800">
                    "{module.plainEnglishQuestion}"
                  </p>
                </div>

                <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                  {module.shortDescription}
                </p>
              </div>

              {/* Bottom Row: Large Tap Primary Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(module.route)}
                  className="w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black text-lg md:text-xl transition-all shadow-xs focus:ring-4 focus:ring-amber-300 min-h-[56px] group cursor-pointer"
                  id={`open-module-btn-${module.id}`}
                >
                  <span>{module.primaryActionLabel}</span>
                  <ChevronRight className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Senior Guarantee Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-5 shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            The EverEase Promise to UK Seniors
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base md:text-lg font-medium text-slate-200">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-lg">1. Plain English Only</h4>
            <p className="text-slate-300 text-base leading-relaxed">We never use confusing computer acronyms or hidden menus.</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-lg">2. You Stay in Control</h4>
            <p className="text-slate-300 text-base leading-relaxed">You choose which family members can help with reminders or view documents.</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-lg">3. Always a Real Person</h4>
            <p className="text-slate-300 text-base leading-relaxed">If you get stuck, freephone 0800 888 2026 for friendly telephone support.</p>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isAddReminderModalOpen && (
        <ReminderModal
          onClose={() => setIsAddReminderModalOpen(false)}
          onSave={handleCreateReminder}
        />
      )}

      {/* Cancel Subscription & Refund Policy Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancelSubscription}
        planName={userProfile?.plan || 'EverEase Complete Plan'}
        monthlyPrice={55.0}
        paymentMethod="BACS Direct Debit"
        navigate={navigate}
      />
    </div>
  );
};

