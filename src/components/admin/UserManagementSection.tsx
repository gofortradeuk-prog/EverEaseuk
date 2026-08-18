import React, { useState } from 'react';
import { 
  Search, 
  RefreshCw, 
  Eye, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Lock, 
  X, 
  AlertCircle,
  PlayCircle,
  FileText,
  Heart,
  Sliders,
  Type,
  ChevronRight
} from 'lucide-react';
import { UserProfile, SupportImpersonationSession } from '../../types';

interface UserManagementSectionProps {
  users: UserProfile[];
  loading: boolean;
  onRefresh: () => void;
  activeImpersonation: SupportImpersonationSession | null;
  onStartImpersonation: (user: UserProfile) => void;
  onStopImpersonation: () => void;
}

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  users,
  loading,
  onRefresh,
  activeImpersonation,
  onStartImpersonation,
  onStopImpersonation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'senior' | 'family' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (u.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (u.uid?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (u.role?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (roleFilter === 'senior') return u.role === 'senior';
    if (roleFilter === 'family') return u.role === 'family' || u.role === 'family_carer';
    if (roleFilter === 'admin') return ['support_admin', 'finance_admin', 'super_admin', 'admin'].includes(u.role);
    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'senior':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-black uppercase">Senior</span>;
      case 'family_carer':
      case 'family':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-black uppercase">Family Carer</span>;
      case 'support_admin':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-black uppercase">Support Staff</span>;
      case 'finance_admin':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-black uppercase">Finance Admin</span>;
      case 'super_admin':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-lg text-xs font-black uppercase">Superadmin</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase">{role}</span>;
    }
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'family_care_bundle':
        return <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Family Care (£12.99)</span>;
      case 'standard_monthly':
        return <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Standard (£4.99)</span>;
      case 'annual_saver':
        return <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Annual Saver (£49.99)</span>;
      default:
        return <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Free Trial (14-Day)</span>;
    }
  };

  return (
    <div className="space-y-6" id="admin-user-management-section">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-700" />
              <span>User Directory & Safeguarding Profiles</span>
            </h2>
            <p className="text-sm text-slate-500">
              Searchable database of UK seniors, linked carers, and staff accounts. All profile views are strictly read-only.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1 text-xs font-bold"
            title="Refresh list from Firestore"
            id="admin-refresh-users-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, email, phone number, or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-400 transition-all"
              id="admin-users-search-input"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['all', 'senior', 'family', 'admin'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 cursor-pointer ${
                  roleFilter === tab
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                id={`filter-user-role-${tab}`}
              >
                {tab === 'all' ? 'All Roles' : tab === 'family' ? 'Family / Carers' : tab + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" id="admin-users-table">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-xs">
              <tr>
                <th className="px-5 py-4">User Details</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Accessibility</th>
                <th className="px-5 py-4">Safeguarding Link</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No users found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentlyImpersonating = activeImpersonation?.targetUser.uid === user.uid;

                  return (
                    <tr key={user.uid} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-900 font-black flex items-center justify-center text-xs shrink-0">
                            {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'EE'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.displayName || 'Unnamed Account'}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {getRoleBadge(user.role)}
                      </td>

                      <td className="px-5 py-4">
                        {getPlanBadge(user.plan)}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        <span className="font-bold uppercase text-slate-900">
                          {user.accessibility?.textSize || user.accessibilitySettings?.fontSize || 'normal'}
                        </span> text
                        {user.accessibility?.highContrast && (
                          <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-900 font-bold rounded text-[10px]">
                            High Contrast
                          </span>
                        )}
                        {user.accessibility?.voice && (
                          <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded text-[10px]">
                            Voice
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-700">
                        {user.seniorDetails?.emergencyContactName ? (
                          <span className="text-slate-800 font-medium">
                            <span className="text-slate-400">Emergency:</span> {user.seniorDetails.emergencyContactName}
                          </span>
                        ) : user.carerDetails?.relationship ? (
                          <span className="text-slate-800 font-medium">
                            <span className="text-slate-400">Carer:</span> {user.carerDetails.relationship}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No external link</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="View Profile (Read-only)"
                            id={`view-profile-${user.uid}`}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>View</span>
                          </button>

                          {user.role !== 'support_admin' && user.role !== 'finance_admin' && user.role !== 'super_admin' && (
                            isCurrentlyImpersonating ? (
                              <button
                                onClick={onStopImpersonation}
                                className="px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                                id={`stop-impersonate-${user.uid}`}
                              >
                                End Session
                              </button>
                            ) : (
                              <button
                                onClick={() => onStartImpersonation(user)}
                                className="px-2.5 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Start 15-min Support Impersonation (Audit Logged)"
                                id={`impersonate-${user.uid}`}
                              >
                                <PlayCircle className="w-3.5 h-3.5 text-purple-700" />
                                <span>Impersonate (15m)</span>
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View-Only Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 rounded-2xl text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{selectedUser.displayName}</h3>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <p className="text-xs text-purple-300 font-bold uppercase tracking-wider mt-0.5">
                    View-Only Safeguarding Record (No Data Editing Allowed)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              {/* Mandatory View-Only Banner */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Zero-Trust Safeguarding Rule:</strong> Personal member records are strictly view-only from the admin console to protect senior privacy. Personal details may only be altered by the senior or authorized family carer.
                </p>
              </div>

              {/* Core Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-400">UID Reference</span>
                  <p className="text-xs font-mono font-bold text-slate-900 break-all">{selectedUser.uid}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Email Address</span>
                  <p className="text-sm font-bold text-slate-900">{selectedUser.email || 'N/A'}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Phone Contact</span>
                  <p className="text-sm font-bold text-slate-900">{selectedUser.phone || 'None registered'}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Active Membership Plan</span>
                  <p className="text-sm font-bold text-purple-900">{selectedUser.plan || 'Free Trial (14 days)'}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Account Created</span>
                  <p className="text-xs font-bold text-slate-700">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Initial Seed'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Last Active Session</span>
                  <p className="text-xs font-bold text-slate-700">
                    {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString('en-GB') : 'Recent'}
                  </p>
                </div>
              </div>

              {/* Senior / Carer Details Section */}
              {selectedUser.seniorDetails && (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Senior Details & Safeguarding Contact</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p><span className="text-emerald-800 font-semibold">Preferred Name:</span> {selectedUser.seniorDetails.preferredName || 'Margaret'}</p>
                    <p><span className="text-emerald-800 font-semibold">Year of Birth:</span> {selectedUser.seniorDetails.birthYear || '1948'}</p>
                    <p><span className="text-emerald-800 font-semibold">Emergency Contact:</span> {selectedUser.seniorDetails.emergencyContactName || 'Sarah Davies'}</p>
                    <p><span className="text-emerald-800 font-semibold">Emergency Phone:</span> {selectedUser.seniorDetails.emergencyContactPhone || '07700 900456'}</p>
                  </div>
                </div>
              )}

              {selectedUser.carerDetails && (
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-blue-700" />
                    <span>Family Carer Relationship</span>
                  </h4>
                  <div className="text-xs space-y-1 text-blue-900">
                    <p><span className="font-semibold">Relationship:</span> {selectedUser.carerDetails.relationship || 'Daughter'}</p>
                    <p><span className="font-semibold">Linked Senior UIDs:</span> {(selectedUser.carerDetails.linkedSeniorUids || []).join(', ') || 'senior_margaret_jenkins'}</p>
                  </div>
                </div>
              )}

              {/* Accessibility Settings */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-600" />
                  <span>Configured Accessibility Preferences</span>
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold">
                    Text Size: {(selectedUser.accessibility?.textSize || 'normal').toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold">
                    High Contrast: {selectedUser.accessibility?.highContrast ? 'ENABLED' : 'DISABLED'}
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold">
                    Voice Guidance: {selectedUser.accessibility?.voice ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Profile
              </button>

              {selectedUser.role !== 'support_admin' && selectedUser.role !== 'finance_admin' && selectedUser.role !== 'super_admin' && (
                <button
                  onClick={() => {
                    const target = selectedUser;
                    setSelectedUser(null);
                    onStartImpersonation(target);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start 15-Min Support Impersonation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
