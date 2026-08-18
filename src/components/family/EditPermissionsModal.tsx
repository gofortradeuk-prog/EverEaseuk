import React, { useState } from 'react';
import {
  X,
  Shield,
  HelpCircle,
  Bell,
  FileText,
  Home,
  CreditCard,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';
import { ModulePermissionMap, PermissionLevel, FamilyLink } from '../../types';
import { updateFamilyLinkPermissions } from '../../lib/firestoreService';

interface Props {
  link: FamilyLink;
  actorUid: string;
  actorName: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedLink: FamilyLink) => void;
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

export const EditPermissionsModal: React.FC<Props> = ({
  link,
  actorUid,
  actorName,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [permissions, setPermissions] = useState<ModulePermissionMap>(link.permissions || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateFamilyLinkPermissions(link.linkId, permissions, actorUid, actorName);
      if (res.success) {
        onUpdated({
          ...link,
          permissions,
          updatedAt: new Date().toISOString(),
        });
        onClose();
      } else {
        setError(res.error || 'Failed to update permissions.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      id="edit-permissions-modal"
    >
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Manage Permissions for {link.familyName || 'Family Member'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {link.relationship} • {link.familyEmail || link.invitedEmail}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50/40 dark:bg-stone-800/20">
            {AVAILABLE_MODULES.map((mod) => {
              const currentLevel = permissions[mod.id] || 'none';
              const Icon = mod.icon;

              return (
                <div
                  key={mod.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white dark:hover:bg-stone-800/50 transition-colors"
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
                      { value: 'view', label: 'View' },
                      { value: 'edit', label: 'Edit' },
                      { value: 'manage', label: 'Manage' },
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
