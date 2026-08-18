import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Share2,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  Phone,
  Clock,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  TrackedSubscription,
  SubscriptionCategory,
  SubscriptionStatus,
  SubscriptionSpendSummary,
  UserRecord,
} from '../../types';
import {
  getTrackedSubscriptionsForSenior,
  subscribeTrackedSubscriptionsForSenior,
  saveTrackedSubscription,
  deleteTrackedSubscription,
  updateSubscriptionStatus,
  calculateSubscriptionSpendSummary,
} from '../../lib/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { SubscriptionCard } from '../../components/subscriptions/SubscriptionCard';
import { SubscriptionModal } from '../../components/subscriptions/SubscriptionModal';
import { SubscriptionSpendSummaryCard } from '../../components/subscriptions/SubscriptionSpendSummaryCard';
import { ShareSummaryModal } from '../../components/subscriptions/ShareSummaryModal';

interface Props {
  navigate: (route: string) => void;
  currentUser?: UserRecord | null;
}

export const SubscriptionManagerPage: React.FC<Props> = ({ navigate }) => {
  const { userProfile } = useAuth();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  // Active senior UID & profile simulation
  const [activeSeniorUid, setActiveSeniorUid] = useState<string>('senior_margaret_jenkins');
  const [activeSeniorName, setActiveSeniorName] = useState<string>('Margaret Jenkins');
  const [viewRole, setViewRole] = useState<'senior' | 'family_carer'>('senior');

  // Subscriptions data state
  const [subscriptions, setSubscriptions] = useState<TrackedSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'active' | 'flagged' | 'cancelled'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSubscription, setEditingSubscription] = useState<TrackedSubscription | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  // Linked family carers for delegation and sharing
  const familyCarers = [
    { uid: 'family_david_jenkins', name: 'David Jenkins (Son & Primary Carer)' },
    { uid: 'family_sarah_jenkins', name: 'Sarah Jenkins (Daughter)' },
  ];

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeTrackedSubscriptionsForSenior(
      activeSeniorUid,
      (items) => {
        setSubscriptions(items);
        setLoading(false);
      },
      (err) => {
        console.warn('Subscription error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeSeniorUid]);

  // Calculate live spend summary metrics
  const summary: SubscriptionSpendSummary = calculateSubscriptionSpendSummary(subscriptions);

  const showToast = (text: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Voice Read-Aloud overview
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToRead = `Subscription and recurring bills summary for ${activeSeniorName}. You currently have ${summary.activeCount} active subscriptions, totalling £${summary.monthlyTotal.toFixed(2)} every month, which is approximately £${summary.annualTotal.toFixed(2)} per year. ${
      summary.flaggedCount > 0
        ? `Attention: You have ${summary.flaggedCount} subscription flagged for a price increase.`
        : 'All subscriptions are currently regular and up to date.'
    }`;

    speakText(textToRead);
  };

  // Help Me Cancel handler -> navigates to Digital Help with query parameter
  const handleHelpCancel = (sub: TrackedSubscription) => {
    const question = `How do I cancel my ${sub.provider} subscription?`;
    navigate(`/digital-help?q=${encodeURIComponent(question)}`);
  };

  // Status toggle handler
  const handleToggleStatus = async (trackId: string, currentStatus: string) => {
    let nextStatus: SubscriptionStatus = 'cancelled';
    if (currentStatus === 'cancelled') {
      nextStatus = 'active';
    } else if (currentStatus === 'flagged') {
      nextStatus = 'active';
    }

    try {
      const res = await updateSubscriptionStatus(trackId, nextStatus);
      if (res.success) {
        showToast(
          nextStatus === 'cancelled'
            ? 'Subscription marked as cancelled.'
            : 'Subscription reactivated and price jump review resolved.',
          'success'
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Delete subscription handler
  const handleDelete = async (trackId: string) => {
    try {
      const res = await deleteTrackedSubscription(trackId);
      if (res.success) {
        showToast('Subscription deleted from your records.', 'success');
      }
    } catch (err) {
      console.error('Error deleting subscription:', err);
    }
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProvider = sub.provider.toLowerCase().includes(q);
      const matchNotes = sub.notes?.toLowerCase().includes(q);
      const matchCategory = sub.category.toLowerCase().includes(q);
      if (!matchProvider && !matchNotes && !matchCategory) return false;
    }

    // Status Tab
    if (selectedStatusTab === 'active' && (sub.status === 'cancelled' || sub.status === 'flagged')) return false;
    if (selectedStatusTab === 'flagged' && sub.status !== 'flagged') return false;
    if (selectedStatusTab === 'cancelled' && sub.status !== 'cancelled') return false;

    // Category
    if (selectedCategory !== 'all' && sub.category !== selectedCategory) return false;

    return true;
  });

  const canEdit = viewRole === 'senior' || viewRole === 'family_carer';

  return (
    <div id="subscription-manager-page" className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="subscription-toast-alert"
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slideIn ${
            toastMessage.type === 'alert'
              ? 'bg-amber-800 text-white border-amber-600'
              : 'bg-emerald-800 text-white border-emerald-600'
          }`}
        >
          {toastMessage.type === 'alert' ? (
            <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
          )}
          <span className="font-semibold text-sm sm:text-base">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white py-8 sm:py-10 px-4 sm:px-8 shadow-md">
        <div className="w-full max-w-[1500px] mx-auto space-y-4">
          {/* Top navigation row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              id="back-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 hover:text-white text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Voice Read-Aloud & Role Simulation Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-voice-read-aloud"
                onClick={handleReadAloud}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
                title="Read summary out loud"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Stop Reading' : 'Listen to Summary'}</span>
              </button>

              {/* Role switcher for testing senior vs carer perspectives */}
              <div className="bg-slate-900/60 p-1 rounded-xl border border-white/20 flex items-center text-xs">
                <button
                  onClick={() => setViewRole('senior')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    viewRole === 'senior' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Senior View (Margaret)
                </button>
                <button
                  onClick={() => setViewRole('family_carer')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    viewRole === 'family_carer'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Family Carer View (David)
                </button>
              </div>
            </div>
          </div>

          {/* Module Title & Plain English Subtitle */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/30 flex items-center justify-center border border-amber-400/40 shrink-0">
                  <Receipt className="w-7 h-7 text-amber-200" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    "What am I paying for?"
                  </h1>
                  <p className="text-amber-200 text-base sm:text-lg font-semibold">
                    Subscription & Regular Outgoings Manager
                  </p>
                </div>
              </div>
              <p className="text-amber-100 text-base sm:text-lg max-w-3xl leading-relaxed">
                Review your monthly direct debits, streaming services, club memberships, and insurance plans. We alert you before renewals and warn you if prices jump!
              </p>
            </div>

            {/* Quick Action: Add Subscription */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                id="btn-open-add-subscription"
                onClick={() => {
                  setEditingSubscription(null);
                  setIsAddModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black text-base shadow-xl flex items-center justify-center gap-2.5 transition-all"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
                <span>Add a Regular Bill or Subscription</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 mt-8 space-y-8 flex-1 w-full">
        {/* Top Spend Summary Dashboard Card */}
        <section id="spend-summary-section">
          <SubscriptionSpendSummaryCard
            summary={summary}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            seniorName={activeSeniorName}
            isCarerView={viewRole === 'family_carer'}
          />
        </section>

        {/* Price Increase Urgent Alert Banner if any flagged */}
        {summary.flaggedCount > 0 && (
          <section
            id="price-increase-alert-section"
            className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-950">
                  {summary.flaggedCount} Subscription Flagged for Price Jump!
                </h3>
                <p className="text-amber-900 text-sm mt-0.5 leading-relaxed">
                  We noticed an increase on your recurring bill. You can tap "Help me cancel this" or call the provider to negotiate a cheaper renewal deal.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStatusTab('flagged')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shrink-0 transition-colors shadow-sm"
            >
              View Flagged Bills
            </button>
          </section>
        )}

        {/* Filter Controls, Search & Tabs */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl overflow-x-auto">
              <button
                id="tab-status-all"
                onClick={() => setSelectedStatusTab('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  selectedStatusTab === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Subscriptions ({subscriptions.length})
              </button>

              <button
                id="tab-status-active"
                onClick={() => setSelectedStatusTab('active')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedStatusTab === 'active'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Active ({summary.activeCount})</span>
              </button>

              <button
                id="tab-status-flagged"
                onClick={() => setSelectedStatusTab('flagged')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedStatusTab === 'flagged'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Price Jumps ({summary.flaggedCount})</span>
              </button>

              <button
                id="tab-status-cancelled"
                onClick={() => setSelectedStatusTab('cancelled')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedStatusTab === 'cancelled'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <XCircle className="w-4 h-4 text-slate-400" />
                <span>Cancelled ({summary.cancelledCount})</span>
              </button>
            </div>

            {/* Search Input & Category Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="sub-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by provider, bill, or notes..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                <select
                  id="sub-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  <option value="streaming_tv">Streaming & TV</option>
                  <option value="broadband_mobile">Broadband & Phone</option>
                  <option value="insurance_cover">Insurance & Cover</option>
                  <option value="utilities_home">Utilities & HomeCare</option>
                  <option value="magazines_news">Magazines & News</option>
                  <option value="health_fitness">Health & Fitness</option>
                  <option value="charity_direct_debit">Charity Direct Debit</option>
                  <option value="software_apps">Apps & Software</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Subscriptions Grid */}
        <section id="subscriptions-list-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tracked Subscriptions & Regular Bills
            </h2>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              Showing {filteredSubscriptions.length} of {subscriptions.length}
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 font-bold">Loading your subscriptions & renewals...</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
                <Receipt className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">No Subscriptions Found</h3>
                <p className="text-slate-500 text-sm">
                  {searchQuery || selectedCategory !== 'all' || selectedStatusTab !== 'all'
                    ? 'No subscriptions match your current filter settings. Try clearing the search or category.'
                    : 'You have not added any regular subscriptions yet. Tap below to start tracking your recurring outgoings.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatusTab('all');
                  setIsAddModalOpen(true);
                }}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Subscription</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.trackId}
                  subscription={sub}
                  onEdit={(item) => {
                    setEditingSubscription(item);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onHelpCancel={handleHelpCancel}
                  onToggleStatus={handleToggleStatus}
                  canEdit={canEdit}
                  seniorName={activeSeniorName}
                />
              ))}
            </div>
          )}
        </section>

        {/* Cancellation Tips & Guidance Banner */}
        <section className="bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>UK Consumer Rights & Direct Debit Guarantee</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white">UK Direct Debit Guarantee</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                You can cancel any Direct Debit instruction anytime through your bank or building society before the payment date.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white">14-Day Cooling-off Period</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                When signing up for online services or subscriptions, you generally have a statutory 14-day cancellation window.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white">Ask for Loyalty Discounts</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Broadband & TV providers often lower prices when you call before your contract auto-renews at a higher rate.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Add / Edit Subscription Modal */}
      <SubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSubscription(null);
        }}
        onSaved={(savedSub, flaggedPriceJump) => {
          if (flaggedPriceJump) {
            showToast(
              `⚠️ ${savedSub.provider} saved and flagged for price jump review! A reminder and alert were created.`,
              'alert'
            );
          } else {
            showToast(`${savedSub.provider} subscription saved successfully.`, 'success');
          }
        }}
        editingSubscription={editingSubscription}
        seniorUid={activeSeniorUid}
        familyCarers={familyCarers}
      />

      {/* Share Summary Modal */}
      <ShareSummaryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        subscriptions={subscriptions}
        summary={summary}
        seniorName={activeSeniorName}
        seniorUid={activeSeniorUid}
        familyCarers={familyCarers}
      />
    </div>
  );
};
