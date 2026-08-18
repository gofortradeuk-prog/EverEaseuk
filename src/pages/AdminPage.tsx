import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  DollarSign, 
  Lock, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  ArrowRight,
  Database,
  Eye,
  Sliders,
  UserPlus,
  FileText,
  BookOpen,
  Inbox,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserRole, 
  AdminRole, 
  UserProfile, 
  Guide, 
  AuditLog, 
  SupportTicket, 
  SupportImpersonationSession, 
  AdminOverviewMetrics 
} from '../types';
import { 
  checkAdminAccess,
  ensureAdminRecord,
  fetchAdminOverviewMetrics,
  fetchUsersList,
  getActiveImpersonationSession,
  startSupportImpersonation,
  stopSupportImpersonation,
  fetchAllGuides,
  saveOrUpdateGuide,
  deleteGuide,
  fetchSupportTickets,
  assignSupportTicket,
  updateTicketStatus,
  fetchAuditLogs
} from '../lib/adminService';
import { ImpersonationBanner } from '../components/admin/ImpersonationBanner';
import { OverviewSection } from '../components/admin/OverviewSection';
import { UserManagementSection } from '../components/admin/UserManagementSection';
import { ContentManagementSection } from '../components/admin/ContentManagementSection';
import { SupportInboxSection } from '../components/admin/SupportInboxSection';
import { FinanceSection } from '../components/admin/FinanceSection';
import { AuditLogsSection } from '../components/admin/AuditLogsSection';

interface AdminPageProps {
  navigate: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { currentUser, userProfile, switchUserRole, quickLoginDemo } = useAuth();
  
  // Tab Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'inbox' | 'finance' | 'audit'>('overview');
  
  // RBAC State
  const [adminRole, setAdminRole] = useState<AdminRole>('support');
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(true);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Data States
  const [metrics, setMetrics] = useState<AdminOverviewMetrics | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [guidesList, setGuidesList] = useState<Guide[]>([]);
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>([]);

  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Support Impersonation State
  const [impersonationSession, setImpersonationSession] = useState<SupportImpersonationSession | null>(null);

  // Verify RBAC access and initialize data
  useEffect(() => {
    verifyAccessAndLoad();
  }, [currentUser?.uid, userProfile?.role]);

  // Check for active impersonation session on mount
  useEffect(() => {
    const active = getActiveImpersonationSession();
    if (active) {
      setImpersonationSession(active);
    }
  }, []);

  const verifyAccessAndLoad = async () => {
    setCheckingAuth(true);
    const uid = currentUser?.uid || userProfile?.uid || 'demo_admin_uid';
    const profileRole = userProfile?.role || 'support_admin';

    const access = await checkAdminAccess(uid, profileRole);
    setIsAuthorizedAdmin(access.isAuthorized);
    setAdminRole(access.adminRole);

    if (access.isAuthorized) {
      // Ensure adminUsers document exists in Firestore
      if (currentUser?.uid) {
        ensureAdminRecord(
          currentUser.uid, 
          access.adminRole, 
          userProfile?.displayName || 'Admin Staff', 
          currentUser.email || userProfile?.email
        ).catch(() => {});
      }
      await loadAllAdminData();
    }
    setCheckingAuth(false);
  };

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [m, u, g, t, a] = await Promise.all([
        fetchAdminOverviewMetrics(),
        fetchUsersList(),
        fetchAllGuides(),
        fetchSupportTickets(),
        fetchAuditLogs(),
      ]);
      setMetrics(m);
      setUsersList(u);
      setGuidesList(g);
      setTicketsList(t);
      setAuditLogsList(a);
    } catch (err) {
      console.warn('Error loading admin portal data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Impersonation handlers
  const handleStartImpersonation = async (targetUser: UserProfile) => {
    const adminUid = currentUser?.uid || userProfile?.uid || 'admin_support_james';
    const adminEmail = currentUser?.email || userProfile?.email || 'support.lead@everease.co.uk';
    const adminName = userProfile?.displayName || 'James Wilson (Support)';

    const session = await startSupportImpersonation(
      adminUid,
      adminEmail,
      adminName,
      adminRole,
      targetUser
    );
    setImpersonationSession(session);
    // Reload audit logs to show the new event
    const freshLogs = await fetchAuditLogs();
    setAuditLogsList(freshLogs);
  };

  const handleStopImpersonation = async () => {
    if (!impersonationSession) return;
    await stopSupportImpersonation(impersonationSession);
    setImpersonationSession(null);
    const freshLogs = await fetchAuditLogs();
    setAuditLogsList(freshLogs);
  };

  // Guides CRUD handlers
  const handleSaveGuide = async (guide: Guide, isNew: boolean) => {
    const adminUid = currentUser?.uid || userProfile?.uid || 'admin_support_james';
    const res = await saveOrUpdateGuide(guide, adminUid, isNew);
    if (res.success) {
      const freshGuides = await fetchAllGuides();
      setGuidesList(freshGuides);
      const freshLogs = await fetchAuditLogs();
      setAuditLogsList(freshLogs);
    }
    return res;
  };

  const handleDeleteGuide = async (guideId: string, guideTitle: string) => {
    const adminUid = currentUser?.uid || userProfile?.uid || 'admin_support_james';
    const res = await deleteGuide(guideId, guideTitle, adminUid);
    if (res.success) {
      const freshGuides = await fetchAllGuides();
      setGuidesList(freshGuides);
      const freshLogs = await fetchAuditLogs();
      setAuditLogsList(freshLogs);
    }
    return res;
  };

  // Support Inbox handlers
  const handleAssignTicket = async (ticketId: string, staffUid: string, staffName: string) => {
    const actorUid = currentUser?.uid || userProfile?.uid || 'admin_support_james';
    const res = await assignSupportTicket(ticketId, staffUid, staffName, actorUid);
    if (res.success) {
      const freshTickets = await fetchSupportTickets();
      setTicketsList(freshTickets);
      const freshLogs = await fetchAuditLogs();
      setAuditLogsList(freshLogs);
    }
    return res;
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved', notes: string) => {
    const actorUid = currentUser?.uid || userProfile?.uid || 'admin_support_james';
    const res = await updateTicketStatus(ticketId, status, notes, actorUid);
    if (res.success) {
      const freshTickets = await fetchSupportTickets();
      setTicketsList(freshTickets);
      const freshLogs = await fetchAuditLogs();
      setAuditLogsList(freshLogs);
    }
    return res;
  };

  // Switch role for evaluation / simulation
  const handleRoleSimulation = async (role: UserRole) => {
    await switchUserRole(role);
  };

  // If loading authentication check
  if (checkingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-800 font-bold text-base">Verifying admin credentials & zero-trust permissions...</p>
        </div>
      </div>
    );
  }

  // If user does not have admin permissions, show Access Barrier
  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6" id="admin-access-denied-view">
        <div className="bg-white rounded-3xl border border-rose-200 p-8 md:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-3xl flex items-center justify-center mx-auto border border-rose-300">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs uppercase font-black tracking-widest text-rose-600">
              Access Restricted — RBAC Barrier
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              Administrative Credentials Required
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              The <code>/admin</code> dashboard is strictly limited to staff accounts present in the <code>adminUsers</code> collection with an active <code>adminRole</code>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left text-xs text-slate-700 space-y-1">
            <p><strong>Current User:</strong> {userProfile?.displayName || 'Senior / Member'}</p>
            <p><strong>Current Role:</strong> <span className="font-mono font-bold uppercase">{userProfile?.role}</span></p>
            <p className="text-slate-500 mt-1">To access this dashboard for testing, switch to an admin staff profile below:</p>
          </div>

          {/* Quick Evaluator Role Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleRoleSimulation('support_admin')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer shadow-xs transition-colors"
            >
              Log in as Support Admin
            </button>
            <button
              onClick={() => handleRoleSimulation('finance_admin')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer shadow-xs transition-colors"
            >
              Log in as Finance Admin
            </button>
            <button
              onClick={() => handleRoleSimulation('super_admin')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer shadow-xs transition-colors"
            >
              Log in as Superadmin
            </button>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline block mx-auto cursor-pointer pt-2"
          >
            Return to Senior Home Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-shell-view">
      {/* 15-Minute Support Impersonation Banner (Visible when active) */}
      <ImpersonationBanner
        session={impersonationSession}
        onEndImpersonation={handleStopImpersonation}
        navigate={navigate}
      />

      <div className="w-full max-w-[1500px] mx-auto px-4 py-6 space-y-8">
        {/* Admin Header with RBAC Switcher */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl shadow-xs">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-black tracking-widest text-purple-400">
                  EverEase UK Safeguarding & Staff Portal
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Admin Control Console
                </h1>
              </div>
            </div>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              Operational dashboard for user safeguarding, 15-min support impersonation with immutable audit logging, Digital Help CMS, and support inbox management.
            </p>
          </div>

          {/* Quick Role Switcher for Testing & Evaluation */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 space-y-2.5 shrink-0 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Active Staff Role:
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                adminRole === 'superadmin' ? 'bg-rose-500 text-white' :
                adminRole === 'finance' ? 'bg-teal-400 text-slate-950' : 'bg-amber-400 text-slate-950'
              }`}>
                {adminRole}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['support_admin', 'finance_admin', 'super_admin'] as UserRole[]).map((r) => {
                const normalized = r === 'support_admin' ? 'support' : (r === 'finance_admin' ? 'finance' : 'superadmin');
                const isSelected = adminRole === normalized;

                return (
                  <button
                    key={r}
                    onClick={() => handleRoleSimulation(r)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500 text-slate-950 shadow-xs ring-2 ring-purple-300'
                        : 'bg-slate-700/80 text-slate-200 hover:bg-slate-600'
                    }`}
                    id={`admin-switch-${r}-btn`}
                  >
                    {normalized.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-1 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>Switch to Senior/Carer View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1" id="admin-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-extrabold text-sm md:text-base rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="tab-admin-overview"
          >
            <Activity className="w-4 h-4 text-purple-700" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-extrabold text-sm md:text-base rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="tab-admin-users"
          >
            <Users className="w-4 h-4 text-blue-700" />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 font-extrabold text-sm md:text-base rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'content'
                ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="tab-admin-content"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Content CMS (Guides)</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-3 font-extrabold text-sm md:text-base rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer relative ${
              activeTab === 'inbox'
                ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="tab-admin-inbox"
          >
            <Inbox className="w-4 h-4 text-indigo-700" />
            <span>Support Inbox</span>
            {ticketsList.filter((t) => t.status === 'open').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-3 font-extrabold text-sm md:text-base rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="tab-admin-finance"
          >
            <DollarSign className="w-4 h-4 text-teal-700" />
            <span>Finance & Billing</span>
            {adminRole !== 'finance' && adminRole !== 'superadmin' && (
              <span className="text-[10px] text-slate-400 font-bold ml-0.5">(Restricted)</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 font-extrabold text-sm md:text-base rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            id="tab-admin-audit"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Tab Content Render */}
        {activeTab === 'overview' && (
          <OverviewSection
            metrics={metrics}
            loading={loadingData}
            onRefresh={loadAllAdminData}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'users' && (
          <UserManagementSection
            users={usersList}
            loading={loadingData}
            onRefresh={loadAllAdminData}
            activeImpersonation={impersonationSession}
            onStartImpersonation={handleStartImpersonation}
            onStopImpersonation={handleStopImpersonation}
          />
        )}

        {activeTab === 'content' && (
          <ContentManagementSection
            guides={guidesList}
            loading={loadingData}
            onRefresh={loadAllAdminData}
            onSaveGuide={handleSaveGuide}
            onDeleteGuide={handleDeleteGuide}
          />
        )}

        {activeTab === 'inbox' && (
          <SupportInboxSection
            tickets={ticketsList}
            loading={loadingData}
            onRefresh={loadAllAdminData}
            currentAdminUid={currentUser?.uid || userProfile?.uid || 'admin_support_james'}
            currentAdminName={userProfile?.displayName || 'James Wilson'}
            onAssignTicket={handleAssignTicket}
            onUpdateStatus={handleUpdateTicketStatus}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceSection
            currentRole={adminRole}
            metrics={metrics}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogsSection
            logs={auditLogsList}
            loading={loadingData}
            onRefresh={loadAllAdminData}
          />
        )}
      </div>
    </div>
  );
};
