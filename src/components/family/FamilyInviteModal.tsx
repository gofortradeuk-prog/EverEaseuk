import React, { useState } from 'react';
import {
  X,
  Send,
  Shield,
  HelpCircle,
  Bell,
  FileText,
  Home,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  UserPlus,
  Sparkles,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { ModulePermissionMap, PermissionLevel, FamilyLink } from '../../types';
import { createFamilyInvite } from '../../lib/firestoreService';

interface Props {
  seniorUid: string;
  seniorName: string;
  seniorEmail?: string;
  actorUid: string;
  actorName: string;
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: (newLink: FamilyLink) => void;
}

const AVAILABLE_MODULES = [
  {
    id: 'scam-protection',
    title: 'Scam Protection',
    description: 'Review suspicious messages, safety verdicts, and bank alerts.',
    icon: Shield,
    iconColor: 'text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400',
  },
  {
    id: 'digital-help',
    title: 'Digital Help',
    description: 'Provide tech guidance, answer questions, and assist with apps.',
    icon: HelpCircle,
    iconColor: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400',
  },
  {
    id: 'reminders',
    title: 'Life Reminders',
    description: 'View and add medication times, GP visits, and MOT appointments.',
    icon: Bell,
    iconColor: 'text-blue-600 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400',
  },
  {
    id: 'document-vault',
    title: 'Document Vault',
    description: 'Access stored insurance policies, passport scans, and NHS cards.',
    icon: FileText,
    iconColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  {
    id: 'home-manager',
    title: 'Home Manager',
    description: 'Track boiler services, appliance cover, and trusted tradespeople.',
    icon: Home,
    iconColor: 'text-teal-600 bg-teal-100 dark:bg-teal-950/50 dark:text-teal-400',
  },
  {
    id: 'subscription-manager',
    title: 'Subscription Manager',
    description: 'View monthly outgoings, flagged price jumps, and cancellation help.',
    icon: CreditCard,
    iconColor: 'text-rose-600 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400',
  },
];

const PRESETS = [
  {
    id: 'full_guardian',
    name: 'Full Guardian & Carer',
    description: 'Complete management access across all modules.',
    permissions: {
      'scam-protection': 'manage' as PermissionLevel,
      'digital-help': 'manage' as PermissionLevel,
      'reminders': 'manage' as PermissionLevel,
      'document-vault': 'manage' as PermissionLevel,
      'home-manager': 'manage' as PermissionLevel,
      'subscription-manager': 'manage' as PermissionLevel,
    },
  },
  {
    id: 'everyday_helper',
    name: 'Everyday Helper',
    description: 'Manage scam alerts & reminders; view documents & bills.',
    permissions: {
      'scam-protection': 'manage' as PermissionLevel,
      'digital-help': 'edit' as PermissionLevel,
      'reminders': 'manage' as PermissionLevel,
      'document-vault': 'view' as PermissionLevel,
      'home-manager': 'view' as PermissionLevel,
      'subscription-manager': 'view' as PermissionLevel,
    },
  },
  {
    id: 'peace_of_mind',
    name: 'Peace of Mind (View Only)',
    description: 'View alerts, calendar reminders, and emergency home contacts.',
    permissions: {
      'scam-protection': 'view' as PermissionLevel,
      'digital-help': 'view' as PermissionLevel,
      'reminders': 'view' as PermissionLevel,
      'document-vault': 'view' as PermissionLevel,
      'home-manager': 'view' as PermissionLevel,
      'subscription-manager': 'view' as PermissionLevel,
    },
  },
];

export const FamilyInviteModal: React.FC<Props> = ({
  seniorUid,
  seniorName,
  seniorEmail,
  actorUid,
  actorName,
  isOpen,
  onClose,
  onInviteSent,
}) => {
  const [familyName, setFamilyName] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [customRelationship, setCustomRelationship] = useState('');
  const [permissions, setPermissions] = useState<ModulePermissionMap>({
    'scam-protection': 'manage',
    'digital-help': 'manage',
    'reminders': 'manage',
    'document-vault': 'view',
    'home-manager': 'view',
    'subscription-manager': 'view',
  });
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<FamilyLink | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setPermissions(preset.permissions);
  };

  const handlePermissionChange = (moduleId: string, level: PermissionLevel | 'none') => {
    setPermissions((prev) => {
      const next = { ...prev };
      if (level === 'none') {
        delete next[moduleId];
      } else {
        next[moduleId] = level;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!familyName.trim()) {
      setError('Please enter the family member\'s name.');
      return;
    }
    if (!familyEmail.trim() || !familyEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!consentAccepted) {
      setError('Please confirm your consent to share information with this family member.');
      return;
    }

    const relValue = relationship === 'Other' ? (customRelationship.trim() || 'Trusted Contact') : relationship;

    setLoading(true);
    try {
      const res = await createFamilyInvite({
        seniorUid,
        seniorName,
        seniorEmail,
        invitedEmail: familyEmail.trim(),
        familyName: familyName.trim(),
        relationship: relValue,
        permissions,
        invitedBy: actorUid,
        invitedByName: actorName,
      });

      if (res.success && res.link) {
        setCreatedLink(res.link);
        onInviteSent(res.link);
      } else {
        setError(res.error || 'Unable to send invitation. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inviteLinkUrl = createdLink
    ? `${window.location.origin}/family-connect?invite=${createdLink.linkId}&email=${encodeURIComponent(createdLink.invitedEmail || '')}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetAndClose = () => {
    setFamilyName('');
    setFamilyEmail('');
    setCreatedLink(null);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      id="family-invite-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-invite-modal-title"
    >
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        id="family-invite-modal-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="family-invite-modal-title" className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Invite a Trusted Family Member
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Choose exactly which modules they can view or manage for {seniorName}.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close invite modal"
            id="close-family-invite-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {createdLink ? (
            /* Success Step */
            <div className="space-y-6 text-center py-4" id="invite-success-view">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Invitation Created for {createdLink.familyName}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                  An invitation has been registered for <span className="font-semibold text-stone-900 dark:text-stone-200">{createdLink.invitedEmail}</span> ({createdLink.relationship}).
                </p>
              </div>

              {/* Security info card */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 text-left flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm text-stone-700 dark:text-stone-300">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">Automatic Activation on Login</p>
                  <p className="mt-1 text-stone-600 dark:text-stone-400">
                    When <span className="font-medium text-amber-700 dark:text-amber-300">{createdLink.invitedEmail}</span> signs into EverEase, this invitation will automatically link to their account with the {Object.keys(createdLink.permissions).length} module permissions you selected.
                  </p>
                </div>
              </div>

              {/* Copy Invite Link */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Direct Invitation Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLinkUrl}
                    className="flex-1 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-700 dark:text-stone-300 font-mono select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-medium text-sm rounded-lg transition-colors shadow-xs"
                    id="copy-invite-link-btn"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                  id="done-family-invite-btn"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6" id="family-invite-form">
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Family Member Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                  <span>1. Family Member Details</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5" htmlFor="family-member-name">
                      Full Name *
                    </label>
                    <input
                      id="family-member-name"
                      type="text"
                      required
                      placeholder="e.g. David Jenkins"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5" htmlFor="family-member-email">
                      Email Address *
                    </label>
                    <input
                      id="family-member-email"
                      type="email"
                      required
                      placeholder="e.g. david.jenkins@example.co.uk"
                      value={familyEmail}
                      onChange={(e) => setFamilyEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5" htmlFor="family-member-relationship">
                    Relationship to {seniorName}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Son', 'Daughter', 'Grandchild', 'Partner / Spouse', 'Carer / Helper', 'Sibling', 'Other'].map((rel) => (
                      <button
                        type="button"
                        key={rel}
                        onClick={() => setRelationship(rel)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                          relationship === rel
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                  {relationship === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify relationship (e.g. Niece, Trusted Neighbour)"
                      value={customRelationship}
                      onChange={(e) => setCustomRelationship(e.target.value)}
                      className="mt-2 w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>2. Quick Permission Presets</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className="p-3 text-left rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 hover:bg-amber-50/50 hover:border-amber-300 dark:hover:bg-amber-950/20 dark:hover:border-amber-700 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                          {preset.name}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2 block">
                        Apply Template &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Module Permissions */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-stone-500" />
                  <span>3. Granular Module Permissions</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Select the level of access this family member should have for each feature:
                </p>

                <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50/40 dark:bg-stone-800/20">
                  {AVAILABLE_MODULES.map((mod) => {
                    const currentLevel = permissions[mod.id] || 'none';
                    const Icon = mod.icon;

                    return (
                      <div
                        key={mod.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white dark:hover:bg-stone-800/50 transition-colors"
                        id={`module-perm-${mod.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${mod.iconColor} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                              {mod.title}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                              {mod.description}
                            </p>
                          </div>
                        </div>

                        {/* Level selector buttons */}
                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          {[
                            { value: 'none', label: 'None' },
                            { value: 'view', label: 'View Only' },
                            { value: 'edit', label: 'Can Edit' },
                            { value: 'manage', label: 'Full Manage' },
                          ].map((opt) => (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => handlePermissionChange(mod.id, opt.value as any)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                                currentLevel === opt.value
                                  ? opt.value === 'manage'
                                    ? 'bg-amber-600 text-white border-amber-600'
                                    : opt.value === 'edit'
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : opt.value === 'view'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-stone-700 text-white border-stone-700'
                                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consent check */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                    id="consent-checkbox"
                  />
                  <span className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Senior Authorization & Consent: </span>
                    I confirm that {seniorName} has authorised sharing selected records with this family member. Access can be modified or revoked at any time.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm font-semibold rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
                  id="send-family-invite-btn"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Sending Invite...' : 'Send Family Invitation'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
