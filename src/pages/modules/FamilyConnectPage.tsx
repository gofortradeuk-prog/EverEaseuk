import React, { useState, useEffect } from 'react';
import { ModuleScaffold } from '../../components/layout/ModuleScaffold';
import { MODULES } from '../../lib/modulesData';
import {
  Users,
  UserPlus,
  ShieldCheck,
  LayoutDashboard,
  Shield,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { FamilyLink, AuditLog } from '../../types';
import {
  getFamilyLinksForSenior,
  subscribeFamilyLinksForSenior,
  getFamilyLinksForCarer,
  subscribeFamilyLinksForCarer,
  getAuditLogsForTarget,
} from '../../lib/firestoreService';
import { SeniorAccessManager } from '../../components/family/SeniorAccessManager';
import { CarerDigestDashboard } from '../../components/family/CarerDigestDashboard';
import { FamilyInviteModal } from '../../components/family/FamilyInviteModal';

interface Props {
  navigate: (route: string) => void;
}

export const FamilyConnectPage: React.FC<Props> = ({ navigate }) => {
  const moduleData = MODULES.find((m) => m.id === 'family-connect')!;
  const { currentUser, userProfile, switchUserRole } = useAuth();
  const { speak } = useAccessibility();

  // Active perspective tab: 'senior' (Who can see my info) or 'carer' (Family carer digest)
  const initialRole = userProfile?.role === 'family' ? 'carer' : 'senior';
  const [activeTab, setActiveTab] = useState<'senior' | 'carer'>(initialRole);

  const [seniorLinks, setSeniorLinks] = useState<FamilyLink[]>([]);
  const [carerLinks, setCarerLinks] = useState<FamilyLink[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const seniorUid = userProfile?.role === 'senior' && currentUser ? currentUser.uid : 'senior_margaret_jenkins';
  const seniorName = userProfile?.displayName || 'Margaret Jenkins';
  const seniorEmail = currentUser?.email || 'margaret.jenkins@everease-uk.org';

  const carerUid = userProfile?.role === 'family' && currentUser ? currentUser.uid : 'family_david_jenkins';
  const carerName = userProfile?.role === 'family' && userProfile?.displayName ? userProfile.displayName : 'David Jenkins';
  const carerEmail = currentUser?.email || 'david.jenkins@example.co.uk';

  // Real-time subscription for Senior links & Audit logs
  useEffect(() => {
    const unsubSenior = subscribeFamilyLinksForSenior(seniorUid, (links) => {
      setSeniorLinks(links);
    });

    getAuditLogsForTarget(seniorUid).then(setAuditLogs);

    return () => {
      unsubSenior();
    };
  }, [seniorUid, refreshTrigger]);

  // Real-time subscription for Carer links
  useEffect(() => {
    const unsubCarer = subscribeFamilyLinksForCarer(carerUid, carerEmail, (links) => {
      setCarerLinks(links);
    });

    return () => {
      unsubCarer();
    };
  }, [carerUid, carerEmail, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSwitchToCarerMode = (carerLink: FamilyLink) => {
    setActiveTab('carer');
    speak(`Switched to family carer view for ${carerLink.familyName || 'Family Carer'}`);
  };

  return (
    <ModuleScaffold
      module={moduleData}
      onBack={() => navigate('/dashboard')}
      customActionIcon={<UserPlus className="w-5 h-5 text-amber-900" />}
      customActionText="Invite Family Member"
      onCustomAction={() => setIsInviteModalOpen(true)}
    >
      <div className="space-y-8" id="family-connect-main-container">
        {/* Role / Perspective Switcher Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Viewing Perspective
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Switch between senior consent management and the family carer digest
              </p>
            </div>
          </div>

          <div className="flex items-center p-1 bg-stone-200 dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700">
            <button
              onClick={() => {
                setActiveTab('senior');
                speak('Viewing Who Can See My Information');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'senior'
                  ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              id="senior-perspective-tab"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Senior: Who Can See My Info</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('carer');
                speak('Viewing Family Carer Digest');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'carer'
                  ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              id="carer-perspective-tab"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Family / Carer Digest</span>
            </button>
          </div>
        </div>

        {/* Perspective Content */}
        {activeTab === 'senior' ? (
          <SeniorAccessManager
            seniorUid={seniorUid}
            seniorName={seniorName}
            seniorEmail={seniorEmail}
            links={seniorLinks}
            auditLogs={auditLogs}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            onLinksChanged={handleRefresh}
            onSwitchToCarerMode={handleSwitchToCarerMode}
          />
        ) : (
          <CarerDigestDashboard
            carerUid={carerUid}
            carerName={carerName}
            carerEmail={carerEmail}
            linkedSeniors={carerLinks}
            navigate={navigate}
            onRefreshLinks={handleRefresh}
          />
        )}

        {/* Invite Family Member Modal */}
        <FamilyInviteModal
          seniorUid={seniorUid}
          seniorName={seniorName}
          seniorEmail={seniorEmail}
          actorUid={currentUser?.uid || seniorUid}
          actorName={userProfile?.displayName || seniorName}
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInviteSent={() => {
            handleRefresh();
          }}
        />
      </div>
    </ModuleScaffold>
  );
};
