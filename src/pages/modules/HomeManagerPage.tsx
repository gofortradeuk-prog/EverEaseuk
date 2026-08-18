import React, { useState, useEffect } from 'react';
import {
  Home,
  Flame,
  Wrench,
  Sparkles,
  Bell,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Camera,
  Trash2,
  Edit,
  ArrowLeft,
  Filter,
  Eye,
  Star,
  RefreshCw,
} from 'lucide-react';
import { HomeAssetRecord, HomeAssetType, TradespersonRecord, UserRecord } from '../../types';
import {
  subscribeHomeAssetsForSenior,
  subscribeTradespeopleForSenior,
  deleteHomeAsset,
  deleteTradesperson,
} from '../../lib/firestoreService';
import { AssetCard } from '../../components/homeManager/AssetCard';
import { AssetModal } from '../../components/homeManager/AssetModal';
import { TradespersonCard } from '../../components/homeManager/TradespersonCard';
import { TradespersonModal } from '../../components/homeManager/TradespersonModal';
import { PhotoViewerModal } from '../../components/homeManager/PhotoViewerModal';

interface Props {
  navigate: (route: string) => void;
  currentUser?: UserRecord | null;
}

export const HomeManagerPage: React.FC<Props> = ({ navigate, currentUser }) => {
  // Senior UID
  const seniorUid = currentUser?.role === 'senior' ? currentUser.uid : 'senior_margaret_jenkins';

  // Role simulation state (Senior Owner vs Linked Family Carer)
  const [activeUserRole, setActiveUserRole] = useState<'senior' | 'family'>('senior');

  // Simulated active user
  const activeUser: UserRecord = activeUserRole === 'senior'
    ? (currentUser && currentUser.role === 'senior'
        ? currentUser
        : {
            uid: seniorUid,
            email: 'margaret.jenkins@example.co.uk',
            displayName: 'Margaret Jenkins',
            role: 'senior',
            createdAt: new Date().toISOString(),
            accessibility: { highContrast: false, largeFont: true, voiceFeedback: true, screenReaderFriendly: true, reduceMotion: false },
          })
    : {
        uid: 'family_david_jenkins',
        email: 'david.jenkins@example.co.uk',
        displayName: 'David Jenkins (Son & Carer)',
        role: 'family',
        seniorUid,
        createdAt: new Date().toISOString(),
        accessibility: { highContrast: false, largeFont: false, voiceFeedback: false, screenReaderFriendly: false, reduceMotion: false },
      };

  // State
  const [assets, setAssets] = useState<HomeAssetRecord[]>([]);
  const [tradespeople, setTradespeople] = useState<TradespersonRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tabs: 'assets' | 'tradespeople' | 'schedule'
  const [activeTab, setActiveTab] = useState<'assets' | 'tradespeople' | 'schedule'>('assets');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Modals state
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<HomeAssetRecord | null>(null);

  const [isTradesModalOpen, setIsTradesModalOpen] = useState<boolean>(false);
  const [editingTradesperson, setEditingTradesperson] = useState<TradespersonRecord | null>(null);

  const [viewingPhotoAsset, setViewingPhotoAsset] = useState<HomeAssetRecord | null>(null);

  // Success / Info Alert banner
  const [alertNotice, setAlertNotice] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Auto clear alert
  useEffect(() => {
    if (alertNotice) {
      const timer = setTimeout(() => setAlertNotice(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [alertNotice]);

  // Subscribe to Firestore collections
  useEffect(() => {
    setIsLoading(true);
    const unsubAssets = subscribeHomeAssetsForSenior(seniorUid, (items) => {
      setAssets(items);
      setIsLoading(false);
    });

    const unsubTrades = subscribeTradespeopleForSenior(seniorUid, (items) => {
      setTradespeople(items);
    });

    return () => {
      unsubAssets();
      unsubTrades();
    };
  }, [seniorUid]);

  // Permissions (Senior can always edit; Family with edit/manage can edit)
  const canEdit = activeUserRole === 'senior' || activeUserRole === 'family';

  // Handle Delete Asset
  const handleDeleteAsset = async (asset: HomeAssetRecord) => {
    const confirm = window.confirm(`Are you sure you want to remove "${asset.name}" from your home registry? Any associated reminders will also be updated.`);
    if (!confirm) return;

    const res = await deleteHomeAsset(asset.assetId);
    if (res.success) {
      setAssets((prev) => prev.filter((a) => a.assetId !== asset.assetId));
      setAlertNotice({
        type: 'info',
        message: `"${asset.name}" and its linked service reminders were removed.`,
      });
    }
  };

  // Handle Delete Tradesperson
  const handleDeleteTradesperson = async (tp: TradespersonRecord) => {
    const confirm = window.confirm(`Are you sure you want to remove "${tp.name}" from your trusted contacts?`);
    if (!confirm) return;

    const res = await deleteTradesperson(tp.tradespersonId);
    if (res.success) {
      setTradespeople((prev) => prev.filter((t) => t.tradespersonId !== tp.tradespersonId));
      setAlertNotice({
        type: 'info',
        message: `"${tp.name}" removed from trusted contacts.`,
      });
    }
  };

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.notes && asset.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedTypeFilter === 'all' || asset.type === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  // Filtered Tradespeople
  const filteredTradespeople = tradespeople.filter((tp) => {
    return (
      tp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tp.notes && tp.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Highlight stats
  const boilerCount = assets.filter((a) => a.type === 'boiler').length;
  const activeWarrantiesCount = assets.filter((a) => {
    if (!a.warrantyExpiry) return false;
    return new Date(a.warrantyExpiry).getTime() >= Date.now();
  }).length;
  const emergencyTradesCount = tradespeople.filter((t) => t.isEmergency).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                id="btn-home-back"
                type="button"
                onClick={() => navigate('/dashboard')}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Home Manager & Boiler Tracker
                  </h1>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Household Safety
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Track boiler servicing, appliance warranties, and trusted UK tradespeople with automatic Life Reminders.
                </p>
              </div>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Switcher Pill */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="px-2 text-slate-500 font-medium">Viewing as:</span>
                <button
                  id="btn-role-senior"
                  type="button"
                  onClick={() => setActiveUserRole('senior')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    activeUserRole === 'senior'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Margaret (Senior)
                </button>
                <button
                  id="btn-role-family"
                  type="button"
                  onClick={() => setActiveUserRole('family')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    activeUserRole === 'family'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  David (Son / Carer)
                </button>
              </div>

              {/* Add Buttons */}
              <button
                id="btn-open-add-asset"
                type="button"
                onClick={() => {
                  setEditingAsset(null);
                  setIsAssetModalOpen(true);
                }}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Appliance / Boiler</span>
              </button>

              <button
                id="btn-open-add-tradesperson"
                type="button"
                onClick={() => {
                  setEditingTradesperson(null);
                  setIsTradesModalOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Trusted Tradesperson</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice Banner */}
        {alertNotice && (
          <div
            id="alert-notice-banner"
            className={`p-4 rounded-xl text-sm flex items-center justify-between border ${
              alertNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-sky-50 text-sky-900 border-sky-200'
            } animate-in fade-in duration-200`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{alertNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlertNotice(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Boilers & Heating</span>
              <span className="text-2xl font-black text-slate-900">{boilerCount} Active</span>
              <span className="text-[11px] text-amber-700 block mt-0.5">Annual service synced</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl border border-teal-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Active Warranties</span>
              <span className="text-2xl font-black text-slate-900">{activeWarrantiesCount} Covered</span>
              <span className="text-[11px] text-teal-700 block mt-0.5">Renewal notices enabled</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Trusted Trades</span>
              <span className="text-2xl font-black text-slate-900">{tradespeople.length} Verified</span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">{emergencyTradesCount} 24/7 emergency lines</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Household Items</span>
              <span className="text-2xl font-black text-slate-900">{assets.length} Registered</span>
              <button
                type="button"
                onClick={() => navigate('/reminders')}
                className="text-[11px] text-indigo-600 hover:underline font-semibold block mt-0.5"
              >
                View Reminders Calendar →
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-200 pb-2 md:pb-0 overflow-x-auto">
              <button
                id="tab-assets"
                type="button"
                onClick={() => setActiveTab('assets')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'assets'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Appliances, Boilers & Alarms ({assets.length})</span>
              </button>

              <button
                id="tab-tradespeople"
                type="button"
                onClick={() => setActiveTab('tradespeople')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'tradespeople'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Trusted Tradespeople ({tradespeople.length})</span>
              </button>

              <button
                id="tab-schedule"
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Service Schedule & Reminders</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'tradespeople'
                    ? 'Search trade, name, gas safe...'
                    : 'Search appliances, boilers...'
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Only on Assets Tab) */}
          {activeTab === 'assets' && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Filter Type:
              </span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'boiler', label: 'Gas Boilers & Heating' },
                { id: 'appliance', label: 'Home Appliances' },
                { id: 'alarm', label: 'Smoke & Safety Alarms' },
                { id: 'other', label: 'Plumbing & Other' },
              ].map((f) => (
                <button
                  key={f.id}
                  id={`filter-asset-type-${f.id}`}
                  type="button"
                  onClick={() => setSelectedTypeFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedTypeFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Assets List */}
        {activeTab === 'assets' && (
          <div>
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                <p className="text-sm font-medium">Loading home assets from Firestore...</p>
              </div>
            ) : filteredAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAssets.map((asset) => (
                  <AssetCard
                    key={asset.assetId}
                    asset={asset}
                    onEdit={(a) => {
                      setEditingAsset(a);
                      setIsAssetModalOpen(true);
                    }}
                    onDelete={handleDeleteAsset}
                    onViewPhoto={(a) => setViewingPhotoAsset(a)}
                    canEdit={canEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No home appliances or boilers found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    {searchQuery || selectedTypeFilter !== 'all'
                      ? 'Try adjusting your search query or category filters.'
                      : 'Add your central heating boiler, smoke alarms, or appliances to start automatic service reminders.'}
                  </p>
                </div>
                <button
                  id="btn-empty-add-asset"
                  type="button"
                  onClick={() => {
                    setEditingAsset(null);
                    setIsAssetModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs"
                >
                  + Add First Home Appliance / Boiler
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Trusted Tradespeople */}
        {activeTab === 'tradespeople' && (
          <div>
            {filteredTradespeople.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTradespeople.map((tp) => (
                  <TradespersonCard
                    key={tp.tradespersonId}
                    tradesperson={tp}
                    onEdit={(item) => {
                      setEditingTradesperson(item);
                      setIsTradesModalOpen(true);
                    }}
                    onDelete={handleDeleteTradesperson}
                    canEdit={canEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No trusted tradespeople found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    {searchQuery
                      ? 'No contact matches your search keywords.'
                      : 'Keep a clean list of trusted Gas Safe engineers, NICEIC electricians, and emergency contacts handy.'}
                  </p>
                </div>
                <button
                  id="btn-empty-add-trades"
                  type="button"
                  onClick={() => {
                    setEditingTradesperson(null);
                    setIsTradesModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs"
                >
                  + Add Trusted Tradesperson
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Service Schedule & Reminders Integration */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Synchronized Household Service Schedule
                    </h3>
                    <p className="text-xs text-slate-500">
                      All maintenance dates below automatically write into your unified Life Reminders calendar.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/reminders')}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Open Full Reminders Calendar →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Household Device</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Cycle</th>
                      <th className="py-3 px-4">Next Service Due</th>
                      <th className="py-3 px-4">Warranty Expiry</th>
                      <th className="py-3 px-4 text-right">Reminder Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assets.map((asset) => (
                      <tr key={asset.assetId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {asset.name}
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-600">
                          {asset.type}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {asset.serviceIntervalMonths ? `Every ${asset.serviceIntervalMonths} mo` : 'One-off'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {asset.nextServiceDate || 'Not scheduled'}
                        </td>
                        <td className="py-3.5 px-4 text-teal-800">
                          {asset.warrantyExpiry || 'None'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Live Synced
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* UK Senior Tip Banner */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-xs text-amber-900 space-y-1">
                <h4 className="font-bold text-sm text-amber-950">UK Gas Safe & Winter Readiness Advice</h4>
                <p className="leading-relaxed">
                  Annual gas boiler servicing is essential before cold winter months. Always verify that your heating engineer carries an active Gas Safe ID card with their 7-digit registration number.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Asset Modal (Add/Edit) */}
      <AssetModal
        seniorUid={seniorUid}
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        editingAsset={editingAsset}
        onSaved={(savedAsset, serviceCreated, warrantyCreated) => {
          setAlertNotice({
            type: 'success',
            message: `Successfully saved "${savedAsset.name}". ${
              serviceCreated || warrantyCreated
                ? 'Automatic reminders have been updated in your Life Reminders calendar.'
                : ''
            }`,
          });
        }}
      />

      {/* Tradesperson Modal (Add/Edit) */}
      <TradespersonModal
        seniorUid={seniorUid}
        isOpen={isTradesModalOpen}
        onClose={() => setIsTradesModalOpen(false)}
        editingTradesperson={editingTradesperson}
        onSaved={(savedTp) => {
          setAlertNotice({
            type: 'success',
            message: `Trusted tradesperson "${savedTp.name}" saved to your contacts.`,
          });
        }}
      />

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        asset={viewingPhotoAsset}
        onClose={() => setViewingPhotoAsset(null)}
      />
    </div>
  );
};
