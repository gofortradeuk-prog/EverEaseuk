import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  History,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { FamilyLink, AuditLog, ModulePermissionMap, PermissionLevel } from '../../types';
import { revokeFamilyLink, claimPendingFamilyInvites } from '../../lib/firestoreService';
import { EditPermissionsModal } from './EditPermissionsModal';

interface Props {
  seniorUid: string;
  seniorName: string;
  seniorEmail?: string;
  links: FamilyLink[];
  auditLogs: AuditLog[];
  onOpenInviteModal: () => void;
  onLinksChanged: () => void;
  onSwitchToCarerMode: (carerLink: FamilyLink) => void;
}

const MODULE_LABELS: Record<string, string> = {
  'scam-protection': 'Scam Protection',
  'digital-help': 'Digital Help',
  'reminders': 'Life Reminders',
  'document-vault': 'Document Vault',
  'home-manager': 'Home Manager',
  'subscription-manager': 'Subscription Manager',
};

export const SeniorAccessManager: React.FC<Props> = ({
  seniorUid,
  seniorName,
  seniorEmail,
  links,
  auditLogs,
  onOpenInviteModal,
  onLinksChanged,
  onSwitchToCarerMode,
}) => {
  const [editingLink, setEditingLink] = useState<FamilyLink | null>(null);
  const [revokingLink, setRevokingLink] = useState<FamilyLink | null>(null);
  const [showRevokedHistory, setShowRevokedHistory] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [claimingInviteId, setClaimingInviteId] = useState<string | null>(null);

  const activeLinks = links.filter((l) => l.status === 'active');
  const pendingLinks = links.filter((l) => l.status === 'invited');
  const revokedLinks = links.filter((l) => l.status === 'revoked');

  const handleRevokeConfirm = async () => {
    if (!revokingLink) return;
    setActionLoading(true);
    try {
      await revokeFamilyLink(revokingLink.linkId, seniorUid, seniorName);
      onLinksChanged();
      setRevokingLink(null);
    } catch (err) {
      console.error('Error revoking family link:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateClaim = async (link: FamilyLink) => {
    if (!link.invitedEmail) return;
    setClaimingInviteId(link.linkId);
    try {
      const demoFamilyUid = `carer_${link.invitedEmail.split('@')[0]}_${Date.now().toString().slice(-4)}`;
      await claimPendingFamilyInvites(demoFamilyUid, link.invitedEmail, link.familyName);
      onLinksChanged();
    } catch (err) {
      console.error('Error claiming invite:', err);
    } finally {
      setClaimingInviteId(null);
    }
  };

  const handleCopyInviteLink = (link: FamilyLink) => {
    const inviteUrl = `${window.location.origin}/family-connect?invite=${link.linkId}&email=${encodeURIComponent(link.invitedEmail || '')}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLinkId(link.linkId);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const getPermissionBadge = (level?: PermissionLevel) => {
    switch (level) {
      case 'manage':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
            Manage
          </span>
        );
      case 'edit':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60">
            Edit
          </span>
        );
      case 'view':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
            View Only
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            No Access
          </span>
        );
    }
  };

  return (
    <div className="space-y-8" id="senior-access-manager">
      {/* Privacy & Reassurance Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-50 dark:from-amber-950/20 dark:to-stone-900 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Who Can See My Information</span>
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                You are always in complete control of your data. Family members can only see the specific modules you select, and you can revoke access at any time.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenInviteModal}
            className="flex items-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg shrink-0 text-sm"
            id="invite-family-member-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Family Member</span>
          </button>
        </div>
      </div>

      {/* Active Family Carers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Active Family Carers ({activeLinks.length})</span>
          </h3>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Trusted contacts with live access to your EverEase features
          </span>
        </div>

        {activeLinks.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <UserCheck className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto" />
            <h4 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No family members connected yet
            </h4>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              You haven't shared your information with any family members yet. You can invite a trusted son, daughter, or carer to assist with appointments and scam checks.
            </p>
            <button
              onClick={onOpenInviteModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Send First Invite</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeLinks.map((link) => {
              const permEntries = Object.entries(link.permissions || {});

              return (
                <div
                  key={link.linkId}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs hover:border-amber-200 dark:hover:border-amber-900/50 transition-all space-y-5"
                  id={`family-link-${link.linkId}`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 text-lg">
                        {link.familyName?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                            {link.familyName}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                            {link.relationship || 'Family Member'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {link.familyEmail || link.invitedEmail}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Linked since {new Date(link.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onSwitchToCarerMode(link)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
                        title="Simulate carer view for this family member"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Carer View</span>
                      </button>

                      <button
                        onClick={() => setEditingLink(link)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Permissions</span>
                      </button>

                      <button
                        onClick={() => setRevokingLink(link)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-lg transition-colors"
                        id={`revoke-btn-${link.linkId}`}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    </div>
                  </div>

                  {/* Module Permissions Grid */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Approved Module Permissions</span>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                      {Object.keys(MODULE_LABELS).map((modId) => {
                        const level = link.permissions?.[modId];
                        return (
                          <div
                            key={modId}
                            className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 text-left ${
                              level
                                ? 'bg-stone-50/80 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
                                : 'bg-stone-50/30 dark:bg-stone-900/30 border-dashed border-stone-200 dark:border-stone-800 opacity-60'
                            }`}
                          >
                            <span className="text-xs font-medium text-stone-700 dark:text-stone-300 line-clamp-1">
                              {MODULE_LABELS[modId]}
                            </span>
                            <div>{getPermissionBadge(level)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Invitations Section */}
      {pendingLinks.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              <span>Pending Invitations ({pendingLinks.length})</span>
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Invitations waiting for the family member to sign in
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {pendingLinks.map((link) => (
              <div
                key={link.linkId}
                className="bg-amber-50/40 dark:bg-amber-950/15 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {link.familyName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">
                        {link.familyName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                        Pending Sign-in
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      {link.invitedEmail} ({link.relationship}) • Sent {new Date(link.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Granted access: {Object.keys(link.permissions || {}).map((k) => MODULE_LABELS[k] || k).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleCopyInviteLink(link)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
                  >
                    {copiedLinkId === link.linkId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLinkId === link.linkId ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={() => handleSimulateClaim(link)}
                    disabled={claimingInviteId === link.linkId}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-2xs disabled:opacity-50"
                    title="Simulates the invitee logging in with their email"
                  >
                    {claimingInviteId === link.linkId ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>Simulate First Login</span>
                  </button>

                  <button
                    onClick={() => setRevokingLink(link)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Cancel invitation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revoked / Former Access History */}
      {revokedLinks.length > 0 && (
        <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
          <button
            onClick={() => setShowRevokedHistory(!showRevokedHistory)}
            className="flex items-center justify-between w-full p-4 rounded-xl bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-stone-500" />
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Revoked / Former Family Links ({revokedLinks.length})
              </span>
            </div>
            {showRevokedHistory ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </button>

          {showRevokedHistory && (
            <div className="mt-3 space-y-2.5">
              {revokedLinks.map((link) => (
                <div
                  key={link.linkId}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center font-bold text-xs">
                      {link.familyName?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-through">
                        {link.familyName} ({link.relationship})
                      </p>
                      <p className="text-xs text-stone-400">
                        {link.familyEmail || link.invitedEmail} • Revoked on {link.updatedAt ? new Date(link.updatedAt).toLocaleDateString('en-GB') : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                    Access Revoked
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transparent Audit Logs */}
      <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
        <button
          onClick={() => setShowAuditLogs(!showAuditLogs)}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Activity Audit Trail ({auditLogs.length} events logged)
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Transparent live log of whenever family carers access your papers or settings
              </p>
            </div>
          </div>
          {showAuditLogs ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {showAuditLogs && (
          <div className="mt-3 divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-sm text-stone-400">
                No external access activity recorded yet.
              </div>
            ) : (
              auditLogs.slice(0, 10).map((log) => (
                <div key={log.logId} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-200">
                        {log.details?.actorName || log.actorUid} — {log.action.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400">
                        {log.targetResource} {log.details?.docTitle ? `(${log.details.docTitle})` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-400 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Permissions Modal */}
      {editingLink && (
        <EditPermissionsModal
          link={editingLink}
          actorUid={seniorUid}
          actorName={seniorName}
          isOpen={true}
          onClose={() => setEditingLink(null)}
          onUpdated={() => {
            setEditingLink(null);
            onLinksChanged();
          }}
        />
      )}

      {/* Revoke Confirmation Dialog */}
      {revokingLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="alertdialog"
          aria-modal="true"
          id="revoke-confirm-modal"
        >
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Revoke Access for {revokingLink.familyName}?
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {revokingLink.familyName} will immediately lose all ability to view your reminders, documents, scam checks, and subscriptions.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRevokingLink(null)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-sm transition-colors"
              >
                Keep Access
              </button>
              <button
                type="button"
                onClick={handleRevokeConfirm}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs disabled:opacity-50"
                id="confirm-revoke-btn"
              >
                {actionLoading ? 'Revoking...' : 'Yes, Revoke Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
