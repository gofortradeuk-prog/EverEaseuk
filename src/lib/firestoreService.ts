import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocFromServer,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  UserRecord,
  FamilyLink,
  NotificationRecord,
  AuditLog,
  AdminUser,
  PermissionLevel,
  ModulePermissionMap,
  SeniorDigestData,
  ScamCheckRecord,
  Guide,
  ReminderRecord,
  DocumentRecord,
  HomeAssetRecord,
  HomeAssetType,
  TradespersonRecord,
  TrackedSubscription,
  SubscriptionCategory,
  BillingCycle,
  SubscriptionStatus,
  SubscriptionSpendSummary,
} from '../types';

// =============================================================================
// Firebase Error Handler Pattern (as required by Firestore Integration Spec)
// =============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// =============================================================================
// Firestore Connection Test
// =============================================================================
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'adminUsers', '_healthcheck'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline or unreachable.');
    }
    return false;
  }
}

// =============================================================================
// 1. Users Collection Service
// =============================================================================
export async function getUserProfile(uid: string): Promise<UserRecord | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserRecord) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfile(user: UserRecord): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// =============================================================================
// 2. FamilyLinks Collection Service
// =============================================================================

export function getInitialSeededFamilyLinks(seniorUid: string = 'senior_margaret_jenkins'): FamilyLink[] {
  return [
    {
      linkId: `link_${seniorUid}_david`,
      seniorUid,
      seniorName: 'Margaret Jenkins',
      seniorEmail: 'margaret.jenkins@everease-uk.org',
      familyUid: 'family_david_jenkins',
      familyName: 'David Jenkins',
      familyEmail: 'david.jenkins@example.co.uk',
      relationship: 'Son (Primary Carer)',
      permissions: {
        'scam-protection': 'manage',
        'digital-help': 'manage',
        'reminders': 'manage',
        'document-vault': 'manage',
        'home-manager': 'manage',
        'subscription-manager': 'manage',
      },
      status: 'active',
      invitedBy: seniorUid,
      invitedByName: 'Margaret Jenkins',
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      lastAccessedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      linkId: `link_${seniorUid}_sarah`,
      seniorUid,
      seniorName: 'Margaret Jenkins',
      seniorEmail: 'margaret.jenkins@everease-uk.org',
      familyUid: 'family_sarah_jenkins',
      familyName: 'Sarah Jenkins',
      familyEmail: 'sarah.davies@everease-uk.org',
      relationship: 'Daughter',
      permissions: {
        'scam-protection': 'view',
        'digital-help': 'edit',
        'reminders': 'edit',
        'document-vault': 'view',
        'home-manager': 'view',
        'subscription-manager': 'view',
      },
      status: 'active',
      invitedBy: seniorUid,
      invitedByName: 'Margaret Jenkins',
      createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      lastAccessedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      linkId: `link_${seniorUid}_richard`,
      seniorUid,
      seniorName: 'Margaret Jenkins',
      seniorEmail: 'margaret.jenkins@everease-uk.org',
      familyUid: `pending_richard_${Date.now()}`,
      familyName: 'Richard Jenkins',
      invitedEmail: 'richard.jenkins@bristol-mail.co.uk',
      familyEmail: 'richard.jenkins@bristol-mail.co.uk',
      relationship: 'Son (Bristol)',
      permissions: {
        'scam-protection': 'view',
        'digital-help': 'view',
        'reminders': 'view',
        'document-vault': 'view',
        'home-manager': 'view',
        'subscription-manager': 'view',
      },
      status: 'invited',
      invitedBy: seniorUid,
      invitedByName: 'Margaret Jenkins',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
}

export async function getFamilyLink(linkId: string): Promise<FamilyLink | null> {
  const path = `familyLinks/${linkId}`;
  try {
    const snap = await getDoc(doc(db, 'familyLinks', linkId));
    return snap.exists() ? (snap.data() as FamilyLink) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getFamilyLinksForSenior(seniorUid: string): Promise<FamilyLink[]> {
  const path = 'familyLinks';
  try {
    const q = query(
      collection(db, 'familyLinks'),
      where('seniorUid', '==', seniorUid)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      const seeded = getInitialSeededFamilyLinks(seniorUid);
      try {
        for (const link of seeded) {
          await setDoc(doc(db, 'familyLinks', link.linkId), link);
        }
      } catch (err) {
        console.warn('Could not persist seeded family links, returning in memory:', err);
      }
      return seeded;
    }
    return snap.docs.map((d) => d.data() as FamilyLink);
  } catch (error) {
    console.warn('Error fetching family links for senior, using fallback:', error);
    return getInitialSeededFamilyLinks(seniorUid);
  }
}

export function subscribeFamilyLinksForSenior(
  seniorUid: string,
  callback: (links: FamilyLink[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'familyLinks';
  const q = query(
    collection(db, 'familyLinks'),
    where('seniorUid', '==', seniorUid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(getInitialSeededFamilyLinks(seniorUid));
      } else {
        const links = snapshot.docs.map((d) => d.data() as FamilyLink);
        callback(links);
      }
    },
    (error) => {
      console.warn('FamilyLinks snapshot error for senior:', error);
      if (onError) onError(error);
      callback(getInitialSeededFamilyLinks(seniorUid));
    }
  );
}

export async function getActiveFamilyLinksForSenior(seniorUid: string): Promise<FamilyLink[]> {
  const links = await getFamilyLinksForSenior(seniorUid);
  return links.filter((l) => l.status === 'active');
}

export async function getFamilyLinksForCarer(familyUid: string, familyEmail?: string): Promise<FamilyLink[]> {
  const path = 'familyLinks';
  try {
    const q1 = query(
      collection(db, 'familyLinks'),
      where('familyUid', '==', familyUid)
    );
    const snap1 = await getDocs(q1);
    let results = snap1.docs.map((d) => d.data() as FamilyLink);

    if (familyEmail) {
      const q2 = query(
        collection(db, 'familyLinks'),
        where('invitedEmail', '==', familyEmail)
      );
      const snap2 = await getDocs(q2);
      const emailMatches = snap2.docs.map((d) => d.data() as FamilyLink);
      
      // Merge unique by linkId
      const existingIds = new Set(results.map((r) => r.linkId));
      for (const item of emailMatches) {
        if (!existingIds.has(item.linkId)) {
          results.push(item);
        }
      }
    }

    if (results.length === 0) {
      // Seed default carer view linking David to Margaret Jenkins and Arthur Davies
      const seeded: FamilyLink[] = [
        ...getInitialSeededFamilyLinks('senior_margaret_jenkins'),
        {
          linkId: 'link_arthur_davies_david',
          seniorUid: 'senior_arthur_davies',
          seniorName: 'Arthur Davies',
          seniorEmail: 'arthur.davies@everease-uk.org',
          familyUid,
          familyName: 'David Jenkins',
          familyEmail: familyEmail || 'david.jenkins@example.co.uk',
          relationship: 'Father-in-law (Age 79)',
          permissions: {
            'scam-protection': 'manage',
            'digital-help': 'edit',
            'reminders': 'manage',
            'document-vault': 'view',
            'home-manager': 'edit',
            'subscription-manager': 'edit',
          },
          status: 'active',
          invitedBy: 'senior_arthur_davies',
          invitedByName: 'Arthur Davies',
          createdAt: new Date(Date.now() - 86400000 * 55).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
          lastAccessedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ];
      return seeded;
    }

    return results;
  } catch (error) {
    console.warn('Error fetching family links for carer, using fallback:', error);
    return [
      ...getInitialSeededFamilyLinks('senior_margaret_jenkins'),
      {
        linkId: 'link_arthur_davies_david',
        seniorUid: 'senior_arthur_davies',
        seniorName: 'Arthur Davies',
        seniorEmail: 'arthur.davies@everease-uk.org',
        familyUid,
        familyName: 'David Jenkins',
        familyEmail: familyEmail || 'david.jenkins@example.co.uk',
        relationship: 'Father-in-law (Age 79)',
        permissions: {
          'scam-protection': 'manage',
          'digital-help': 'edit',
          'reminders': 'manage',
          'document-vault': 'view',
          'home-manager': 'edit',
          'subscription-manager': 'edit',
        },
        status: 'active',
        invitedBy: 'senior_arthur_davies',
        invitedByName: 'Arthur Davies',
        createdAt: new Date(Date.now() - 86400000 * 55).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        lastAccessedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ];
  }
}

export function subscribeFamilyLinksForCarer(
  familyUid: string,
  familyEmail: string | undefined,
  callback: (links: FamilyLink[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'familyLinks';
  const q = query(
    collection(db, 'familyLinks'),
    where('familyUid', '==', familyUid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback([
          ...getInitialSeededFamilyLinks('senior_margaret_jenkins'),
          {
            linkId: 'link_arthur_davies_david',
            seniorUid: 'senior_arthur_davies',
            seniorName: 'Arthur Davies',
            seniorEmail: 'arthur.davies@everease-uk.org',
            familyUid,
            familyName: 'David Jenkins',
            familyEmail: familyEmail || 'david.jenkins@example.co.uk',
            relationship: 'Father-in-law (Age 79)',
            permissions: {
              'scam-protection': 'manage',
              'digital-help': 'edit',
              'reminders': 'manage',
              'document-vault': 'view',
              'home-manager': 'edit',
              'subscription-manager': 'edit',
            },
            status: 'active',
            invitedBy: 'senior_arthur_davies',
            invitedByName: 'Arthur Davies',
            createdAt: new Date(Date.now() - 86400000 * 55).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
            lastAccessedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
        ]);
      } else {
        const links = snapshot.docs.map((d) => d.data() as FamilyLink);
        callback(links);
      }
    },
    (error) => {
      console.warn('FamilyLinks snapshot error for carer:', error);
      if (onError) onError(error);
    }
  );
}

export async function getActiveFamilyLinksForCarer(familyUid: string, familyEmail?: string): Promise<FamilyLink[]> {
  const links = await getFamilyLinksForCarer(familyUid, familyEmail);
  return links.filter((l) => l.status === 'active');
}

export async function saveFamilyLink(link: FamilyLink): Promise<void> {
  const path = `familyLinks/${link.linkId}`;
  try {
    await setDoc(doc(db, 'familyLinks', link.linkId), link, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Creates a new family invitation document with status="invited"
 */
export async function createFamilyInvite(params: {
  seniorUid: string;
  seniorName: string;
  seniorEmail?: string;
  invitedEmail: string;
  familyName: string;
  relationship: string;
  permissions: ModulePermissionMap;
  invitedBy: string;
  invitedByName?: string;
}): Promise<{ success: boolean; link?: FamilyLink; error?: string }> {
  const linkId = `link_${params.seniorUid}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newLink: FamilyLink = {
    linkId,
    seniorUid: params.seniorUid,
    seniorName: params.seniorName,
    seniorEmail: params.seniorEmail,
    familyUid: `pending_${Math.random().toString(36).substring(2, 8)}`,
    familyName: params.familyName,
    familyEmail: params.invitedEmail,
    invitedEmail: params.invitedEmail.toLowerCase().trim(),
    relationship: params.relationship,
    permissions: params.permissions,
    status: 'invited',
    invitedBy: params.invitedBy,
    invitedByName: params.invitedByName || params.seniorName,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await saveFamilyLink(newLink);

    // Record audit log
    await logAuditEvent({
      actorUid: params.invitedBy,
      action: 'LINK_INVITED',
      targetUid: params.seniorUid,
      targetResource: `familyLinks/${linkId}`,
      details: {
        invitedEmail: params.invitedEmail,
        familyName: params.familyName,
        relationship: params.relationship,
        permissions: params.permissions,
      },
    });

    // Send in-app notification to the inviter
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await sendNotification({
      notifId,
      uid: params.seniorUid,
      type: 'family_invite',
      payload: {
        title: `✉️ Invitation Sent to ${params.familyName}`,
        body: `Invitation sent to ${params.invitedEmail} (${params.relationship}) with selected module access permissions.`,
        route: '/family-connect',
        module: 'family-connect',
      },
      read: false,
      createdAt: now,
    });

    return { success: true, link: newLink };
  } catch (error: any) {
    console.error('Error creating family invite:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Revokes access for a family member by setting status="revoked"
 */
export async function revokeFamilyLink(
  linkId: string,
  actorUid: string,
  actorName: string = 'Senior User'
): Promise<{ success: boolean; error?: string }> {
  const path = `familyLinks/${linkId}`;
  const now = new Date().toISOString();
  try {
    const existing = await getFamilyLink(linkId);
    await updateDoc(doc(db, 'familyLinks', linkId), {
      status: 'revoked',
      updatedAt: now,
    });

    // Record audit log
    await logAuditEvent({
      actorUid,
      action: 'LINK_REVOKED',
      targetUid: existing?.seniorUid || actorUid,
      targetResource: `familyLinks/${linkId}`,
      details: {
        revokedLinkId: linkId,
        revokedFamilyName: existing?.familyName || 'Family Carer',
        revokedFamilyEmail: existing?.familyEmail || existing?.invitedEmail,
        revokedBy: actorName,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error revoking family link:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates permissions on an existing family link document
 */
export async function updateFamilyLinkPermissions(
  linkId: string,
  newPermissions: Record<string, PermissionLevel>,
  actorUid?: string,
  actorName?: string
): Promise<{ success: boolean; error?: string }> {
  const path = `familyLinks/${linkId}`;
  const now = new Date().toISOString();
  try {
    const existing = await getFamilyLink(linkId);
    await updateDoc(doc(db, 'familyLinks', linkId), {
      permissions: newPermissions,
      updatedAt: now,
    });

    // Record audit log
    if (actorUid) {
      await logAuditEvent({
        actorUid,
        action: 'PERMISSION_CHANGE',
        targetUid: existing?.seniorUid || actorUid,
        targetResource: `familyLinks/${linkId}`,
        details: {
          updatedLinkId: linkId,
          familyName: existing?.familyName,
          newPermissions,
          updatedBy: actorName || 'Senior User',
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, error: error.message };
  }
}

/**
 * Flips status="invited" to status="active" when an invitee logs in matching the invited email
 */
export async function claimPendingFamilyInvites(
  userUid: string,
  userEmail: string,
  userName?: string
): Promise<{ claimedCount: number; links: FamilyLink[] }> {
  if (!userEmail) return { claimedCount: 0, links: [] };

  const normalizedEmail = userEmail.toLowerCase().trim();
  const claimedLinks: FamilyLink[] = [];

  try {
    const q = query(
      collection(db, 'familyLinks'),
      where('invitedEmail', '==', normalizedEmail),
      where('status', '==', 'invited')
    );
    const snap = await getDocs(q);

    for (const docSnap of snap.docs) {
      const link = docSnap.data() as FamilyLink;
      const now = new Date().toISOString();

      await updateDoc(doc(db, 'familyLinks', link.linkId), {
        familyUid: userUid,
        familyName: userName || link.familyName || userEmail,
        familyEmail: normalizedEmail,
        status: 'active',
        updatedAt: now,
        lastAccessedAt: now,
      });

      // Audit log
      await logAuditEvent({
        actorUid: userUid,
        action: 'LINK_ACTIVATED',
        targetUid: link.seniorUid,
        targetResource: `familyLinks/${link.linkId}`,
        details: {
          linkId: link.linkId,
          userEmail: normalizedEmail,
          userName: userName || userEmail,
        },
      });

      claimedLinks.push({
        ...link,
        familyUid: userUid,
        familyName: userName || link.familyName || userEmail,
        status: 'active',
      });
    }

    return { claimedCount: claimedLinks.length, links: claimedLinks };
  } catch (error) {
    console.warn('Error claiming pending invites for email:', error);
    return { claimedCount: 0, links: [] };
  }
}

// =============================================================================
// 3. Notifications Collection Service
// =============================================================================
export function subscribeToUserNotifications(
  uid: string,
  callback: (notifications: NotificationRecord[]) => void
): Unsubscribe {
  const path = 'notifications';
  const q = query(
    collection(db, 'notifications'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifs = snapshot.docs.map((doc) => doc.data() as NotificationRecord);
      callback(notifs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function markNotificationAsRead(notifId: string): Promise<void> {
  const path = `notifications/${notifId}`;
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function sendNotification(notif: NotificationRecord): Promise<void> {
  const path = `notifications/${notif.notifId}`;
  try {
    await setDoc(doc(db, 'notifications', notif.notifId), notif);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// =============================================================================
// 4. AuditLogs Collection Service (Client Read-Only)
// =============================================================================
export async function getMyAuditLogs(uid: string): Promise<AuditLog[]> {
  const path = 'auditLogs';
  try {
    const q = query(
      collection(db, 'auditLogs'),
      where('actorUid', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AuditLog);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function getAuditLogsForTarget(targetUid: string): Promise<AuditLog[]> {
  const path = 'auditLogs';
  try {
    const q = query(
      collection(db, 'auditLogs'),
      where('targetUid', '==', targetUid),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return [
        {
          logId: 'audit_seed_1',
          actorUid: 'family_david_jenkins',
          action: 'view_document',
          targetUid,
          targetResource: 'documents/doc_seed_home_ins',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          details: {
            docTitle: 'Aviva Home Buildings & Contents Policy 2026/27',
            actorName: 'David Jenkins',
            actorRole: 'family_carer',
          },
        },
      ];
    }
    return snap.docs.map((d) => d.data() as AuditLog);
  } catch (error) {
    return [
      {
        logId: 'audit_seed_1',
        actorUid: 'family_david_jenkins',
        action: 'view_document',
        targetUid,
        targetResource: 'documents/doc_seed_home_ins',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        details: {
          docTitle: 'Aviva Home Buildings & Contents Policy 2026/27',
          actorName: 'David Jenkins',
          actorRole: 'family_carer',
        },
      },
    ];
  }
}

export async function logAuditEvent(params: {
  actorUid: string;
  action: string;
  targetUid: string;
  targetResource: string;
  details?: Record<string, any>;
}): Promise<void> {
  const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const log: AuditLog = {
    logId,
    actorUid: params.actorUid,
    action: params.action,
    targetUid: params.targetUid,
    targetResource: params.targetResource,
    timestamp: new Date().toISOString(),
    details: params.details,
  };
  try {
    await setDoc(doc(db, 'auditLogs', logId), log);
  } catch (error) {
    console.warn('Could not write audit log to Firestore:', error);
  }
}

/**
 * Aggregates senior data across modules for family carer digest
 */
export async function getSeniorDigest(
  seniorUid: string,
  permissions: ModulePermissionMap,
  seniorNameFallback: string = 'Senior'
): Promise<SeniorDigestData> {
  let seniorName = seniorNameFallback;
  try {
    const uSnap = await getDoc(doc(db, 'users', seniorUid));
    if (uSnap.exists()) {
      const uData = uSnap.data() as UserRecord;
      seniorName = uData.displayName || seniorNameFallback;
    }
  } catch (err) {
    // Ignore profile read errors
  }

  // 1. Scam Checks
  let scamChecksSummary = {
    totalCount: 0,
    flaggedCount: 0,
    recentChecks: [] as ScamCheckRecord[],
  };
  if (permissions['scam-protection']) {
    try {
      const checks = await getScamChecksForSenior(seniorUid);
      scamChecksSummary.totalCount = checks.length;
      scamChecksSummary.flaggedCount = checks.filter(
        (c) => c.verdict === 'caution' || c.verdict === 'likely_scam'
      ).length;
      scamChecksSummary.recentChecks = checks.slice(0, 5);
    } catch (err) {
      console.warn('Could not fetch scam checks for digest:', err);
    }
  }

  // 2. Reminders
  let remindersSummary = {
    upcomingCount: 0,
    overdueCount: 0,
    upcomingList: [] as ReminderRecord[],
  };
  if (permissions['reminders']) {
    try {
      const reminders = await getRemindersForSenior(seniorUid);
      const todayStr = new Date().toISOString().split('T')[0];
      const activeReminders = reminders.filter((r) => r.status === 'upcoming' || r.status === 'snoozed');
      remindersSummary.upcomingCount = activeReminders.filter((r) => r.dueDate >= todayStr).length;
      remindersSummary.overdueCount = activeReminders.filter((r) => r.dueDate < todayStr).length;
      remindersSummary.upcomingList = activeReminders
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 5);
    } catch (err) {
      console.warn('Could not fetch reminders for digest:', err);
    }
  }

  // 3. Documents
  let documentsSummary = {
    totalCount: 0,
    expiringSoonCount: 0,
    expiringList: [] as DocumentRecord[],
  };
  if (permissions['document-vault']) {
    try {
      const docs = await getDocumentsForSenior(seniorUid);
      documentsSummary.totalCount = docs.length;
      const now = new Date();
      const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      const in90DaysStr = in90Days.toISOString().split('T')[0];
      const todayStr = now.toISOString().split('T')[0];

      const expiring = docs.filter(
        (d) => d.expiryDate && d.expiryDate >= todayStr && d.expiryDate <= in90DaysStr
      );
      documentsSummary.expiringSoonCount = expiring.length;
      documentsSummary.expiringList = expiring;
    } catch (err) {
      console.warn('Could not fetch documents for digest:', err);
    }
  }

  // 4. Subscriptions
  let subscriptionsSummary = {
    activeCount: 0,
    monthlyTotal: 0,
    flaggedCount: 0,
    flaggedList: [] as TrackedSubscription[],
  };
  if (permissions['subscription-manager']) {
    try {
      const subs = await getTrackedSubscriptionsForSenior(seniorUid);
      const activeSubs = subs.filter((s) => s.status !== 'cancelled');
      subscriptionsSummary.activeCount = activeSubs.length;
      subscriptionsSummary.flaggedCount = subs.filter((s) => s.status === 'flagged').length;
      subscriptionsSummary.flaggedList = subs.filter((s) => s.status === 'flagged');

      let monthly = 0;
      for (const s of activeSubs) {
        if (s.billingCycle === 'monthly') monthly += s.amount;
        else if (s.billingCycle === 'annual') monthly += s.amount / 12;
        else monthly += s.amount;
      }
      subscriptionsSummary.monthlyTotal = Math.round(monthly * 100) / 100;
    } catch (err) {
      console.warn('Could not fetch subscriptions for digest:', err);
    }
  }

  // 5. Home Manager
  let homeManagerSummary = {
    totalAssets: 0,
    urgentIssues: 0,
  };
  if (permissions['home-manager']) {
    try {
      const assets = await getHomeAssetsForSenior(seniorUid);
      homeManagerSummary.totalAssets = assets.length;
      const todayStr = new Date().toISOString().split('T')[0];
      const overdueOrDueSoon = assets.filter(
        (a) => a.nextServiceDate && a.nextServiceDate <= todayStr
      ).length;
      homeManagerSummary.urgentIssues = overdueOrDueSoon;
    } catch (err) {
      console.warn('Could not fetch home assets for digest:', err);
    }
  }

  // 6. Escalations ("Ask a family member" from Scam Protection, Digital Help, or Price jumps)
  const escalations: SeniorDigestData['escalations'] = [];
  if (permissions['scam-protection']) {
    const flaggedChecks = scamChecksSummary.recentChecks.filter(
      (c) => (c as any).status === 'pending_second_opinion' || (c as any).actionStatus === 'asked_family' || c.verdict === 'likely_scam'
    );
    for (const fc of flaggedChecks) {
      escalations.push({
        id: fc.checkId,
        type: 'scam_check',
        title: `⚠️ Review Scam Concern: ${(fc as any).category?.replace(/_/g, ' ') || 'Suspicious Message'}`,
        description: fc.advice || fc.explanation,
        createdAt: fc.createdAt,
        route: '/scam-protection',
        payload: fc,
      });
    }
  }

  if (permissions['subscription-manager'] && subscriptionsSummary.flaggedCount > 0) {
    for (const sub of subscriptionsSummary.flaggedList) {
      escalations.push({
        id: `sub_${sub.trackId}`,
        type: 'scam_check',
        title: `⚠️ Price Jump on ${sub.provider} Bill`,
        description: sub.flagReason || `Price changed to £${sub.amount.toFixed(2)} / ${sub.billingCycle}.`,
        createdAt: sub.createdAt,
        route: '/subscription-manager',
        payload: sub,
      });
    }
  }

  return {
    seniorUid,
    seniorName,
    permissions,
    scamChecks: scamChecksSummary,
    reminders: remindersSummary,
    documents: documentsSummary,
    subscriptions: subscriptionsSummary,
    homeManager: homeManagerSummary,
    escalations,
  };
}

// =============================================================================
// 5. AdminUsers Collection Service (Rule Lookups & Verification)
// =============================================================================
export async function checkIsAdmin(uid: string): Promise<AdminUser | null> {
  const path = `adminUsers/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'adminUsers', uid));
    return snap.exists() ? (snap.data() as AdminUser) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// =============================================================================
// 6. ScamChecks Collection Service ("Is this message safe?")
// 
// UK GDPR Compliance (Article 5(1)(c) - Data Minimisation):
// We do not store raw message text or uploaded screenshot images in
// Firestore/Cloud Storage long-term. Only the extracted verdict, plain-English
// explanation, and detected red flags are retained in the user's history.
// =============================================================================
export async function saveScamCheck(checkRecord: ScamCheckRecord): Promise<void> {
  const path = `scamChecks/${checkRecord.checkId}`;
  try {
    // UK GDPR Data Minimisation: Guarantee rawContentRef is nulled out in persistent record
    const sanitizedRecord: ScamCheckRecord = {
      ...checkRecord,
      rawContentRef: null,
    };
    await setDoc(doc(db, 'scamChecks', checkRecord.checkId), sanitizedRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToScamChecks(
  seniorUid: string,
  callback: (checks: ScamCheckRecord[]) => void
): Unsubscribe {
  const path = 'scamChecks';
  const q = query(
    collection(db, 'scamChecks'),
    where('seniorUid', '==', seniorUid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const checks = snapshot.docs.map((doc) => doc.data() as ScamCheckRecord);
      callback(checks);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function getScamChecksForSenior(seniorUid: string): Promise<ScamCheckRecord[]> {
  const path = 'scamChecks';
  try {
    const q = query(
      collection(db, 'scamChecks'),
      where('seniorUid', '==', seniorUid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ScamCheckRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteScamCheck(checkId: string): Promise<void> {
  const path = `scamChecks/${checkId}`;
  try {
    await deleteDoc(doc(db, 'scamChecks', checkId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Dispatches an "Ask a family member" request by notifying any active linked
 * family carer who has 'manage' or 'edit' permissions on the 'scam-protection' module.
 */
export async function askFamilyCarersForScamAdvice(
  seniorUid: string,
  seniorName: string,
  checkRecord: ScamCheckRecord
): Promise<{ success: boolean; notifiedCount: number; carerNames: string[] }> {
  try {
    // 1. Find all active family links for this senior
    const activeLinks = await getActiveFamilyLinksForSenior(seniorUid);
    
    // 2. Filter for carers with 'manage' or 'edit' permissions on 'scam-protection'
    const eligibleLinks = activeLinks.filter((link) => {
      const perm = link.permissions['scam-protection'];
      return perm === 'manage' || perm === 'edit';
    });

    const notifiedCarers: string[] = [];

    // 3. Create a notification in the notifications collection for each eligible carer
    for (const link of eligibleLinks) {
      const carerProfile = await getUserProfile(link.familyUid);
      const carerDisplayName = carerProfile?.displayName || 'Family Member';
      notifiedCarers.push(carerDisplayName);

      const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newNotif: NotificationRecord = {
        notifId,
        uid: link.familyUid,
        type: 'scam_alert',
        payload: {
          title: `🛡️ Scam Check Help Request from ${seniorName}`,
          body: `${seniorName} checked a message classified as "${checkRecord.verdict.toUpperCase().replace('_', ' ')}" and has asked for your review: "${checkRecord.explanation.substring(0, 120)}..."`,
          route: '/scam-protection',
          module: 'scam-protection',
          checkId: checkRecord.checkId,
          verdict: checkRecord.verdict,
          seniorName,
          actionRequired: true,
        },
        read: false,
        createdAt: new Date().toISOString(),
      };

      await sendNotification(newNotif);
    }

    return {
      success: true,
      notifiedCount: eligibleLinks.length,
      carerNames: notifiedCarers,
    };
  } catch (error) {
    console.error('Error dispatching family notifications for scam check:', error);
    return {
      success: false,
      notifiedCount: 0,
      carerNames: [],
    };
  }
}

// =============================================================================
// 7. Guides Collection Service ("How do I do this?" Library)
// =============================================================================
export const INITIAL_SEEDED_GUIDES: Guide[] = [
  {
    guideId: 'guide_video_call',
    title: 'How to video call your grandchild on WhatsApp or FaceTime',
    category: 'Staying in Touch',
    iconName: 'Video',
    summary: 'A simple guide to seeing family face-to-face on your phone or tablet.',
    steps: [
      {
        title: 'Step 1: Open WhatsApp or FaceTime',
        description: 'Look for the green WhatsApp icon with a white phone symbol, or the green FaceTime icon with a camera symbol on your home screen, and tap it gently once.',
      },
      {
        title: 'Step 2: Find your grandchild in your contact list',
        description: 'Tap on "Chats" or "Contacts" at the bottom of the screen, and scroll down until you see their name or photo.',
      },
      {
        title: 'Step 3: Tap the video camera icon',
        description: 'In the top right corner of their chat screen, you will see a small icon shaped like a video camera. Tap this once to begin the video call.',
      },
      {
        title: 'Step 4: Hold your phone up and smile',
        description: 'Keep the phone at eye level so they can see your face clearly. When you are finished talking, tap the red phone icon to end the call.',
      },
    ],
    createdBy: 'system_admin',
    updatedAt: new Date().toISOString(),
  },
  {
    guideId: 'guide_online_banking',
    title: 'Online banking basics: Checking your balance safely',
    category: 'Everyday Banking',
    iconName: 'Building2',
    summary: 'Learn how to securely view your statements and balance without risk.',
    steps: [
      {
        title: 'Step 1: Open your bank app from your phone',
        description: 'Always use your bank’s official mobile app installed on your phone. Never click on links in text messages or emails to log in.',
      },
      {
        title: 'Step 2: Log in with Face ID, fingerprint, or passcode',
        description: 'Use your secure fingerprint, facial recognition, or your private 6-digit banking passcode. Never share this code with anyone over the phone.',
      },
      {
        title: 'Step 3: View your current account balance',
        description: 'Your main account balance will appear at the top of your screen. Tap on "Current Account" or "Transactions" to see recent payments or pensions received.',
      },
      {
        title: 'Step 4: Always log out when you are finished',
        description: 'Tap "Log Out" in the top corner or close the banking app completely to keep your details safe and secure.',
      },
    ],
    createdBy: 'system_admin',
    updatedAt: new Date().toISOString(),
  },
  {
    guideId: 'guide_nhs_app',
    title: 'Using the official NHS App for repeat prescriptions',
    category: 'Healthcare',
    iconName: 'Activity',
    summary: 'Order your regular medications and see health records straight from your phone.',
    steps: [
      {
        title: 'Step 1: Open the official NHS App',
        description: 'Tap the blue NHS app icon on your screen. (If prompted, log in with your NHS login email and secure password or fingerprint).',
      },
      {
        title: 'Step 2: Tap on "Prescriptions"',
        description: 'At the bottom of your screen or on the main home menu, select the option called "Prescriptions" or "Order repeat prescription".',
      },
      {
        title: 'Step 3: Select your regular medications',
        description: 'You will see a list of your approved repeat medicines. Tap the small circle or checkbox next to the items you need to refill.',
      },
      {
        title: 'Step 4: Confirm and select your local pharmacy',
        description: 'Check your chosen chemist (e.g. Boots or your local village pharmacy) and tap the green "Confirm and Order" button. You will receive a notification when it is ready.',
      },
    ],
    createdBy: 'system_admin',
    updatedAt: new Date().toISOString(),
  },
  {
    guideId: 'guide_gp_appointment',
    title: 'Booking a GP doctor appointment online',
    category: 'Healthcare',
    iconName: 'CalendarCheck',
    summary: 'Request a routine GP consultation or phone call without waiting in telephone queues.',
    steps: [
      {
        title: 'Step 1: Open the NHS App or your Surgery Portal',
        description: 'Open your NHS App or your GP practice website (like Patchs, eConsult, or SystmOnline) in your web browser.',
      },
      {
        title: 'Step 2: Choose "Appointments" or "Ask a Doctor"',
        description: 'Select the option to request an appointment, routine consultation, or phone callback with your doctor.',
      },
      {
        title: 'Step 3: Answer a few simple health questions',
        description: 'Describe what you would like help with in plain words (for example: "Annual blood pressure check" or "Knee stiffness").',
      },
      {
        title: 'Step 4: Select your preferred time and submit',
        description: 'Pick morning or afternoon and whether you prefer an in-person visit or phone call. Tap "Submit" to send your request directly to your surgery reception.',
      },
    ],
    createdBy: 'system_admin',
    updatedAt: new Date().toISOString(),
  },
  {
    guideId: 'guide_smart_tv_remote',
    title: 'How to use a Smart TV remote to watch BBC iPlayer or Netflix',
    category: 'Home & Entertainment',
    iconName: 'Tv',
    summary: 'Find catch-up TV and streaming apps without getting lost on your remote control.',
    steps: [
      {
        title: 'Step 1: Press the "Home" or "Smart" button',
        description: 'Look for the button with a picture of a small house (Home) or the brand name (e.g. LG / Samsung / Roku / Sky) in the middle of your remote control.',
      },
      {
        title: 'Step 2: Use the arrow keys to scroll to BBC iPlayer or Netflix',
        description: 'Use the up, down, left, and right arrow buttons around the central OK button to highlight the app you want to open.',
      },
      {
        title: 'Step 3: Press the central "OK" or "Select" button',
        description: 'Press the middle "OK" button firmly once to open the application.',
      },
      {
        title: 'Step 4: Search for your show or press Back to return',
        description: 'Use the search box or browse recommendations. If you ever get stuck, just press the "Back" arrow or the "TV" button to return to normal broadcast TV.',
      },
    ],
    createdBy: 'system_admin',
    updatedAt: new Date().toISOString(),
  },
  {
    guideId: 'guide_phone_reminder',
    title: 'Setting a reminder on your phone for pills or appointments',
    category: 'Organiser & Memory',
    iconName: 'Bell',
    summary: 'Ensure you never miss a daily tablet or important doctor visit with gentle alarms.',
    steps: [
      {
        title: 'Step 1: Open the "Clock" or "Reminders" app',
        description: 'On iPhone, tap the "Clock" (for daily alarms) or "Reminders" app. On Android / Samsung, tap "Clock" or "Tasks".',
      },
      {
        title: 'Step 2: Tap the "+" plus symbol to add a new alarm',
        description: 'You will see a "+" plus button in the top corner. Tap it to create a new reminder.',
      },
      {
        title: 'Step 3: Choose the time (e.g. 09:00 AM) and set Repeat',
        description: 'Scroll the hour and minute wheels to your desired pill or appointment time. Tap "Repeat" and select "Every Day" if you take medication daily.',
      },
      {
        title: 'Step 4: Label the reminder and tap Save',
        description: 'Type a helpful label like "Morning Heart Tablet with Water" and tap the "Save" button in the top right. Your phone will now chime and show this reminder automatically.',
      },
    ],
    createdBy: 'system_admin',
    updatedAt: new Date().toISOString(),
  },
];

export async function getGuides(): Promise<Guide[]> {
  const path = 'guides';
  try {
    const q = query(collection(db, 'guides'));
    const snap = await getDocs(q);
    if (snap.empty) {
      // Return the fallback seeded guides immediately
      return INITIAL_SEEDED_GUIDES;
    }
    return snap.docs.map((d) => d.data() as Guide);
  } catch (error) {
    console.warn('Firestore guides read failed, falling back to pre-seeded guides:', error);
    return INITIAL_SEEDED_GUIDES;
  }
}

/**
 * Dispatches an "Ask a family member instead" request for Digital Help
 * by creating a notification in the Firestore `notifications` collection
 * for any linked family carer who has 'manage', 'edit', or 'view' permissions on 'digital-help'.
 */
export async function askFamilyCarersForDigitalHelp(
  seniorUid: string,
  seniorName: string,
  questionText: string
): Promise<{ success: boolean; notifiedCount: number; carerNames: string[] }> {
  try {
    // 1. Find all active family links for this senior
    const activeLinks = await getActiveFamilyLinksForSenior(seniorUid);

    // 2. Filter for carers with permission on 'digital-help'
    const eligibleLinks = activeLinks.filter((link) => {
      const perm = link.permissions['digital-help'];
      return perm === 'manage' || perm === 'edit' || perm === 'view';
    });

    const notifiedCarers: string[] = [];

    // 3. Create a notification in the notifications collection for each eligible carer
    for (const link of eligibleLinks) {
      const carerProfile = await getUserProfile(link.familyUid);
      const carerDisplayName = carerProfile?.displayName || 'Family Member';
      notifiedCarers.push(carerDisplayName);

      const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newNotif: NotificationRecord = {
        notifId,
        uid: link.familyUid,
        type: 'digital_help_request',
        payload: {
          title: `💬 Tech Help Question from ${seniorName}`,
          body: `${seniorName} asked a tech question: "${questionText.substring(0, 140)}" and requested your help.`,
          route: '/digital-help',
          module: 'digital-help',
          seniorName,
          question: questionText,
          actionRequired: true,
        },
        read: false,
        createdAt: new Date().toISOString(),
      };

      await sendNotification(newNotif);
    }

    return {
      success: true,
      notifiedCount: eligibleLinks.length,
      carerNames: notifiedCarers,
    };
  } catch (error) {
    console.error('Error dispatching digital help notifications to family carers:', error);
    return {
      success: false,
      notifiedCount: 0,
      carerNames: [],
    };
  }
}

// =============================================================================
// 8. Reminders Collection Service (Life Reminders)
// =============================================================================

export function getInitialSeededReminders(seniorUid: string = 'demo_senior_uid'): ReminderRecord[] {
  const today = new Date();
  
  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDate(today);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);
  const in3DaysStr = formatDate(in3Days);

  const in5Days = new Date(today);
  in5Days.setDate(today.getDate() + 5);
  const in5DaysStr = formatDate(in5Days);

  const in12Days = new Date(today);
  in12Days.setDate(today.getDate() + 12);
  const in12DaysStr = formatDate(in12Days);

  return [
    {
      reminderId: 'rem_gp_blood_pressure',
      seniorUid,
      type: 'appointment',
      title: 'GP Practice Nurse Blood Pressure Review',
      dueDate: todayStr,
      time: '14:30',
      recurrence: 'none',
      channel: ['in_app', 'sms'],
      status: 'upcoming',
      createdBy: seniorUid,
      createdByName: 'Margaret',
      createdByRole: 'senior',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      location: 'Meadowview Health Centre (Room 4)',
      notes: 'Take morning reading chart with you.',
    },
    {
      reminderId: 'rem_mot_service',
      seniorUid,
      type: 'renewal',
      title: 'Car MOT & Annual Service Renewal Due',
      dueDate: tomorrowStr,
      time: '09:00',
      recurrence: 'yearly',
      channel: ['in_app', 'email', 'sms'],
      status: 'upcoming',
      createdBy: 'demo_family_uid',
      createdByName: 'Sarah Davies (Daughter)',
      createdByRole: 'family',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      location: 'Kwik Fit High Street',
      notes: 'Sarah booked this with the mechanic.',
    },
    {
      reminderId: 'rem_oliver_birthday',
      seniorUid,
      type: 'birthday',
      title: "Grandson Oliver's 10th Birthday 🎂",
      dueDate: in3DaysStr,
      time: '10:00',
      recurrence: 'yearly',
      channel: ['in_app', 'sms'],
      status: 'upcoming',
      createdBy: seniorUid,
      createdByName: 'Margaret',
      createdByRole: 'senior',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      notes: 'Card is in the sideboard drawer; call him on FaceTime after school.',
    },
    {
      reminderId: 'rem_boiler_service',
      seniorUid,
      type: 'service',
      title: 'British Gas Boiler Winter Check & Service',
      dueDate: in5DaysStr,
      time: '11:00',
      recurrence: 'yearly',
      channel: ['in_app', 'email'],
      status: 'upcoming',
      createdBy: 'demo_family_uid',
      createdByName: 'Sarah Davies (Daughter)',
      createdByRole: 'family',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      notes: 'Engineer will call 30 mins before arrival.',
    },
    {
      reminderId: 'rem_home_insurance',
      seniorUid,
      type: 'renewal',
      title: 'Direct Line Home & Contents Insurance Policy Renewal',
      dueDate: in12DaysStr,
      time: '12:00',
      recurrence: 'yearly',
      channel: ['in_app', 'email'],
      status: 'upcoming',
      createdBy: seniorUid,
      createdByName: 'Margaret',
      createdByRole: 'senior',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      notes: 'Check auto-renewal price against comparison quote.',
    },
  ];
}

/**
 * Fetch all reminders for a given senior UID
 */
export async function getRemindersForSenior(seniorUid: string): Promise<ReminderRecord[]> {
  const path = 'reminders';
  try {
    const q = query(collection(db, path), where('seniorUid', '==', seniorUid));
    const snap = await getDocs(q);

    if (snap.empty) {
      // If empty in Firestore, seed initial ones for smooth immediate experience
      const seeded = getInitialSeededReminders(seniorUid);
      try {
        for (const rem of seeded) {
          await setDoc(doc(db, 'reminders', rem.reminderId), rem);
        }
      } catch (seedErr) {
        console.warn('Could not persist initial seeded reminders, returning in memory:', seedErr);
      }
      return seeded;
    }

    return snap.docs.map((d) => d.data() as ReminderRecord);
  } catch (error) {
    console.warn('Failed to fetch reminders from Firestore, using memory fallback:', error);
    return getInitialSeededReminders(seniorUid);
  }
}

/**
 * Real-time subscription to reminders for a senior
 */
export function subscribeRemindersForSenior(
  seniorUid: string,
  onUpdate: (reminders: ReminderRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'reminders';
  const q = query(collection(db, path), where('seniorUid', '==', seniorUid));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        const seeded = getInitialSeededReminders(seniorUid);
        onUpdate(seeded);
      } else {
        const items = snap.docs.map((d) => d.data() as ReminderRecord);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Subscription error on reminders:', err);
      if (onError) onError(err);
      onUpdate(getInitialSeededReminders(seniorUid));
    }
  );
}

/**
 * Create a new reminder
 */
export async function createReminder(reminder: ReminderRecord): Promise<{ success: boolean; error?: string }> {
  const path = `reminders/${reminder.reminderId}`;
  try {
    await setDoc(doc(db, 'reminders', reminder.reminderId), reminder);
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Update an existing reminder
 */
export async function updateReminder(
  reminderId: string,
  updates: Partial<ReminderRecord>
): Promise<{ success: boolean; error?: string }> {
  const path = `reminders/${reminderId}`;
  try {
    await updateDoc(doc(db, 'reminders', reminderId), updates);
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Mark a reminder as done
 */
export async function markReminderDone(reminderId: string): Promise<{ success: boolean; error?: string }> {
  return updateReminder(reminderId, { status: 'done' });
}

/**
 * Snooze a reminder (e.g. by 1 day or specified date)
 */
export async function snoozeReminder(
  reminderId: string,
  snoozeDays: number = 1
): Promise<{ success: boolean; error?: string }> {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + snoozeDays);
  const y = newDate.getFullYear();
  const m = String(newDate.getMonth() + 1).padStart(2, '0');
  const d = String(newDate.getDate()).padStart(2, '0');
  const snoozedDateStr = `${y}-${m}-${d}`;

  return updateReminder(reminderId, {
    status: 'snoozed',
    dueDate: snoozedDateStr,
    snoozedUntil: new Date().toISOString(),
  });
}

/**
 * Delete a reminder
 */
export async function deleteReminder(reminderId: string): Promise<{ success: boolean; error?: string }> {
  const path = `reminders/${reminderId}`;
  try {
    await deleteDoc(doc(db, 'reminders', reminderId));
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: (error as Error).message };
  }
}

// =============================================================================
// 9. Documents Collection Service (Document Vault)
// =============================================================================

/**
 * Initial seeded documents for UK seniors
 */
export function getInitialSeededDocuments(seniorUid: string): DocumentRecord[] {
  const today = new Date();
  const nextYear = today.getFullYear() + 1;
  const inTenMonths = new Date(today.getTime() + 300 * 24 * 60 * 60 * 1000);
  const inTenMonthsStr = `${inTenMonths.getFullYear()}-${String(inTenMonths.getMonth() + 1).padStart(2, '0')}-${String(inTenMonths.getDate()).padStart(2, '0')}`;

  return [
    {
      docId: `doc_seed_home_ins_${seniorUid.substring(0, 5)}`,
      seniorUid,
      category: 'home_insurance',
      title: 'Aviva Home Buildings & Contents Policy 2026/27',
      storagePath: `documents/${seniorUid}/doc_aviva_home_policy_schedule.pdf`,
      fileType: 'application/pdf',
      fileName: 'Aviva_Home_Policy_Schedule_2026.pdf',
      fileSize: 428000,
      expiryDate: inTenMonthsStr,
      sharedWith: [],
      uploadedAt: new Date(today.getTime() - 86400000 * 18).toISOString(),
      extractedData: {
        suggestedTitle: 'Aviva Home Buildings & Contents Policy 2026/27',
        suggestedCategory: 'home_insurance',
        suggestedExpiryDate: inTenMonthsStr,
        issuerOrOrganisation: 'Aviva UK Insurance',
        summary: 'Buildings & Contents policy schedule (Ref: AV-984210). Includes 24/7 Home Emergency & boiler breakdown cover.',
        confidence: 'high',
      },
      notes: 'Policy reference AV-984210. 24hr Emergency helpline: 0800 015 1515.',
    },
    {
      docId: `doc_seed_passport_${seniorUid.substring(0, 5)}`,
      seniorUid,
      category: 'identity_passport',
      title: 'HM British Passport (Valid to 2031)',
      storagePath: `documents/${seniorUid}/doc_uk_passport_photo_page.jpg`,
      fileType: 'image/jpeg',
      fileName: 'UK_Passport_Margaret_Jenkins.jpg',
      fileSize: 1250000,
      expiryDate: `${today.getFullYear() + 5}-07-22`,
      sharedWith: [],
      uploadedAt: new Date(today.getTime() - 86400000 * 45).toISOString(),
      extractedData: {
        suggestedTitle: 'HM British Passport (Valid to 2031)',
        suggestedCategory: 'identity_passport',
        suggestedExpiryDate: `${today.getFullYear() + 5}-07-22`,
        issuerOrOrganisation: 'HM Passport Office',
        summary: 'Standard 10-year British Citizen passport. Number: 541098231.',
        confidence: 'high',
      },
      notes: 'Stored for verification with banks, post office, and travel bookings.',
    },
    {
      docId: `doc_seed_nhs_cert_${seniorUid.substring(0, 5)}`,
      seniorUid,
      category: 'health_medical',
      title: 'NHS Medical & Prescription Exemption Certificate',
      storagePath: `documents/${seniorUid}/doc_nhs_prescription_exemption.pdf`,
      fileType: 'application/pdf',
      fileName: 'NHS_Prescription_Exemption_Card.pdf',
      fileSize: 310000,
      expiryDate: `${nextYear}-11-30`,
      sharedWith: [],
      uploadedAt: new Date(today.getTime() - 86400000 * 60).toISOString(),
      extractedData: {
        suggestedTitle: 'NHS Medical & Prescription Exemption Certificate',
        suggestedCategory: 'health_medical',
        suggestedExpiryDate: `${nextYear}-11-30`,
        issuerOrOrganisation: 'NHS Business Services Authority',
        summary: 'Exemption certificate proving entitlement to free NHS medication and repeat prescriptions.',
        confidence: 'high',
      },
      notes: 'Show pharmacist or surgery reception if requested.',
    },
    {
      docId: `doc_seed_lpa_${seniorUid.substring(0, 5)}`,
      seniorUid,
      category: 'legal_financial',
      title: 'Registered Lasting Power of Attorney (Property & Financial Affairs)',
      storagePath: `documents/${seniorUid}/doc_lpa_registered_property_finance.pdf`,
      fileType: 'application/pdf',
      fileName: 'Registered_LPA_Property_Finance_OPG.pdf',
      fileSize: 890000,
      expiryDate: undefined, // Permanent legal document
      sharedWith: [],
      uploadedAt: new Date(today.getTime() - 86400000 * 90).toISOString(),
      extractedData: {
        suggestedTitle: 'Registered Lasting Power of Attorney (Property & Financial Affairs)',
        suggestedCategory: 'legal_financial',
        suggestedExpiryDate: undefined,
        issuerOrOrganisation: 'Office of the Public Guardian (OPG)',
        summary: 'Official OPG registered Lasting Power of Attorney. Authorises named family members to assist with utility bills, bank accounts, and pensions.',
        confidence: 'high',
      },
      notes: 'OPG Reference: LPA-8819-2041. Keep shared with trusted family members.',
    },
    {
      docId: `doc_seed_council_tax_${seniorUid.substring(0, 5)}`,
      seniorUid,
      category: 'utilities_council',
      title: 'Cornwall Council Tax Annual Assessment 2026/27',
      storagePath: `documents/${seniorUid}/doc_council_tax_assessment.pdf`,
      fileType: 'application/pdf',
      fileName: 'Council_Tax_Demand_Notice_2026_27.pdf',
      fileSize: 260000,
      expiryDate: `${nextYear}-03-31`,
      sharedWith: [],
      uploadedAt: new Date(today.getTime() - 86400000 * 12).toISOString(),
      extractedData: {
        suggestedTitle: 'Cornwall Council Tax Annual Assessment 2026/27',
        suggestedCategory: 'utilities_council',
        suggestedExpiryDate: `${nextYear}-03-31`,
        issuerOrOrganisation: 'Cornwall Council',
        summary: 'Annual Band C council tax bill showing direct debit monthly instalment schedule and single person discount applied.',
        confidence: 'high',
      },
      notes: 'Council tax account ref: CTX-772910.',
    },
  ];
}

/**
 * Fetch all documents owned by seniorUid or shared with the user
 */
export async function getDocumentsForSenior(seniorUid: string): Promise<DocumentRecord[]> {
  const path = 'documents';
  try {
    const q = query(collection(db, path), where('seniorUid', '==', seniorUid));
    const snap = await getDocs(q);

    if (snap.empty) {
      const seeded = getInitialSeededDocuments(seniorUid);
      try {
        for (const docItem of seeded) {
          await setDoc(doc(db, 'documents', docItem.docId), docItem);
        }
      } catch (seedErr) {
        console.warn('Could not persist initial seeded documents to Firestore, returning in memory:', seedErr);
      }
      return seeded;
    }

    return snap.docs.map((d) => d.data() as DocumentRecord);
  } catch (error) {
    console.warn('Failed to fetch documents from Firestore, using memory fallback:', error);
    return getInitialSeededDocuments(seniorUid);
  }
}

/**
 * Real-time subscription to documents for a senior
 */
export function subscribeDocumentsForSenior(
  seniorUid: string,
  onUpdate: (docs: DocumentRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'documents';
  const q = query(collection(db, path), where('seniorUid', '==', seniorUid));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        const seeded = getInitialSeededDocuments(seniorUid);
        onUpdate(seeded);
      } else {
        const items = snap.docs.map((d) => d.data() as DocumentRecord);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Subscription error on documents:', err);
      if (onError) onError(err);
      onUpdate(getInitialSeededDocuments(seniorUid));
    }
  );
}

/**
 * Fetch documents shared with a specific family UID
 */
export async function getSharedDocumentsForFamily(familyUid: string): Promise<DocumentRecord[]> {
  const path = 'documents';
  try {
    const q = query(collection(db, path), where('sharedWith', 'array-contains', familyUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as DocumentRecord);
  } catch (error) {
    console.warn('Failed to fetch shared documents for family UID:', error);
    return [];
  }
}

/**
 * Save or update a document in Firestore.
 * If expiryDate is provided, automatically creates a matching reminder (type: renewal)
 * roughly 8 weeks (56 days) before expiry.
 */
export async function saveDocument(
  docRecord: DocumentRecord,
  createRenewalReminder: boolean = true
): Promise<{ success: boolean; reminderCreated?: boolean; error?: string }> {
  const path = `documents/${docRecord.docId}`;
  try {
    await setDoc(doc(db, 'documents', docRecord.docId), docRecord, { merge: true });

    let reminderCreated = false;

    // Automatic reminder creation when expiryDate is present
    if (docRecord.expiryDate && createRenewalReminder) {
      try {
        const expiryTime = new Date(docRecord.expiryDate).getTime();
        if (!isNaN(expiryTime)) {
          const eightWeeksMs = 56 * 24 * 60 * 60 * 1000; // 8 weeks = 56 days
          let reminderTime = expiryTime - eightWeeksMs;
          
          // If 8 weeks before is already in the past, schedule it for today/tomorrow or 1 week before
          const now = Date.now();
          if (reminderTime < now) {
            reminderTime = Math.min(expiryTime - 7 * 86400000, now + 86400000);
          }

          const remDate = new Date(reminderTime);
          const y = remDate.getFullYear();
          const m = String(remDate.getMonth() + 1).padStart(2, '0');
          const d = String(remDate.getDate()).padStart(2, '0');
          const dueDateStr = `${y}-${m}-${d}`;

          const reminderId = `rem_renewal_${docRecord.docId}`;
          const newReminder: ReminderRecord = {
            reminderId,
            seniorUid: docRecord.seniorUid,
            type: 'renewal',
            title: `Renew ${docRecord.title} (Expiring ${docRecord.expiryDate})`,
            dueDate: dueDateStr,
            recurrence: docRecord.category === 'home_insurance' || docRecord.category === 'vehicle_driving' ? 'yearly' : 'none',
            channel: ['in_app', 'email'],
            status: 'upcoming',
            createdBy: docRecord.seniorUid,
            createdByName: 'Document Vault Auto-Renewal',
            createdByRole: 'senior',
            createdAt: new Date().toISOString(),
            notes: `Automatic 8-week renewal notice linked to Document: ${docRecord.title}. Document expiry date is ${docRecord.expiryDate}. Storage path: ${docRecord.storagePath}`,
          };

          await createReminder(newReminder);
          reminderCreated = true;
        }
      } catch (remErr) {
        console.warn('Could not auto-create renewal reminder:', remErr);
      }
    }

    return { success: true, reminderCreated };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete a document from the vault
 */
export async function deleteDocument(docId: string): Promise<{ success: boolean; error?: string }> {
  const path = `documents/${docId}`;
  try {
    await deleteDoc(doc(db, 'documents', docId));
    // Also remove associated auto-reminder if present
    try {
      await deleteDoc(doc(db, 'reminders', `rem_renewal_${docId}`));
    } catch {
      // Ignored if reminder did not exist
    }
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Update the sharedWith array of family UIDs for a specific document
 */
export async function updateDocumentSharing(
  docId: string,
  sharedWith: string[]
): Promise<{ success: boolean; error?: string }> {
  const path = `documents/${docId}`;
  try {
    await updateDoc(doc(db, 'documents', docId), { sharedWith });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Log document access by non-owners into auditLogs collection
 */
export async function logDocumentAccess(
  docId: string,
  seniorUid: string,
  actorUid: string,
  docTitle: string,
  actorName?: string,
  actorRole?: string,
  action: 'view_document' | 'download_document' = 'view_document'
): Promise<void> {
  // Only non-owning viewers require audit logging
  if (actorUid === seniorUid) return;

  try {
    await fetch('/api/documents/log-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docId,
        seniorUid,
        actorUid,
        actorName,
        actorRole,
        action,
        docTitle,
      }),
    });
  } catch (err) {
    console.error('Failed to dispatch document access log:', err);
  }
}

// =============================================================================
// 10. Home Manager: Home Assets & Maintenance Tracking
// =============================================================================

export function calculateNextServiceDate(
  lastServiceDate?: string,
  intervalMonths?: number
): string | undefined {
  if (!lastServiceDate || !intervalMonths || intervalMonths <= 0) return undefined;
  try {
    const d = new Date(lastServiceDate);
    if (isNaN(d.getTime())) return undefined;
    d.setMonth(d.getMonth() + Number(intervalMonths));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return undefined;
  }
}

export function getInitialSeededHomeAssets(seniorUid: string): HomeAssetRecord[] {
  const currentYear = new Date().getFullYear();
  return [
    {
      assetId: 'asset_seed_boiler',
      seniorUid,
      type: 'boiler',
      name: 'Worcester Bosch Greenstar 8000 Life 30kW Gas Boiler',
      warrantyExpiry: `${currentYear + 4}-10-15`,
      lastServiceDate: `${currentYear - 1}-11-10`,
      serviceIntervalMonths: 12,
      nextServiceDate: `${currentYear}-11-10`,
      notes: 'Gas Safe annual service required to maintain 10-year manufacturer warranty. Engineer: Andy Miller (Gas Safe #512984). Pressure gauge should sit between 1.0 and 1.5 bar.',
      photoStoragePath: `homeAssets/${seniorUid}/asset_seed_boiler_worcester_bosch.jpg`,
      photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="40" y="30" width="520" height="340" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="300" cy="180" r="70" fill="%230284c7" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="4"/><text x="300" y="175" fill="%2338bdf8" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">1.2 BAR</text><text x="300" y="205" fill="%2394a3b8" font-family="sans-serif" font-size="14" text-anchor="middle">Optimal Pressure</text><text x="300" y="75" fill="white" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">WORCESTER BOSCH GREENSTAR 8000</text><text x="300" y="100" fill="%23cbd5e1" font-family="sans-serif" font-size="13" text-anchor="middle">Serial: 7738112904 • Gas Safe Ref: 512984</text><rect x="80" y="290" width="440" height="50" rx="8" fill="%23047857"/><text x="300" y="322" fill="white" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Annual Service Status: Up to Date (Next Due Nov)</text></svg>',
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      assetId: 'asset_seed_washing_machine',
      seniorUid,
      type: 'appliance',
      name: 'Bosch Serie 4 Front Loader Washing Machine (WAN28209GB)',
      warrantyExpiry: `${currentYear + 1}-03-20`,
      lastServiceDate: `${currentYear}-03-20`,
      serviceIntervalMonths: 6,
      nextServiceDate: `${currentYear}-09-20`,
      notes: 'Clean the drain pump filter at bottom right corner every 6 months. Bought from John Lewis (Ref: JL-882910). EcoSilence Drive motor.',
      photoStoragePath: `homeAssets/${seniorUid}/asset_seed_appliance_bosch_wan.jpg`,
      photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f8fafc"/><rect x="40" y="30" width="520" height="340" rx="16" fill="white" stroke="%23e2e8f0" stroke-width="3"/><circle cx="300" cy="180" r="75" fill="%23f1f5f9" stroke="%2394a3b8" stroke-width="8"/><circle cx="300" cy="180" r="50" fill="%2338bdf8" fill-opacity="0.3"/><text x="300" y="75" fill="%230f172a" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">BOSCH SERIE 4 WASHING MACHINE</text><text x="300" y="100" fill="%2364748b" font-family="sans-serif" font-size="13" text-anchor="middle">Model: WAN28209GB/01 • 8kg Load Capacity</text><rect x="80" y="295" width="440" height="45" rx="8" fill="%230284c7"/><text x="300" y="324" fill="white" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Filter Maintenance: 6-Month Cycle Active</text></svg>',
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      assetId: 'asset_seed_smoke_alarm',
      seniorUid,
      type: 'alarm',
      name: 'Aico Ei3024 Multi-Sensor Optical Smoke & Heat Detector (Hallway & Landing)',
      warrantyExpiry: `${currentYear + 6}-05-01`,
      lastServiceDate: `${currentYear}-02-01`,
      serviceIntervalMonths: 6,
      nextServiceDate: `${currentYear}-08-01`,
      notes: 'Mains-powered interlinked detectors with rechargeable lithium cell backup. Test button check recommended every 6 months. 10-year sensor lifespan ends 2032.',
      photoStoragePath: `homeAssets/${seniorUid}/asset_seed_alarm_aico.jpg`,
      photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="40" y="30" width="520" height="340" rx="16" fill="%230f172a" stroke="%23334155" stroke-width="2"/><circle cx="300" cy="180" r="65" fill="%2310b981" fill-opacity="0.2" stroke="%2310b981" stroke-width="4"/><text x="300" y="185" fill="%2310b981" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">GREEN LED OK</text><text x="300" y="75" fill="white" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">AICO EI3024 DUAL SENSOR ALARMS</text><text x="300" y="100" fill="%2394a3b8" font-family="sans-serif" font-size="13" text-anchor="middle">BS 5839-6 Grade D1 Standard • Hallway & Upper Landing</text><rect x="80" y="295" width="440" height="45" rx="8" fill="%23047857"/><text x="300" y="324" fill="white" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Battery & Sensor Health: Fully Verified</text></svg>',
      createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function getInitialSeededTradespeople(seniorUid: string): TradespersonRecord[] {
  return [
    {
      tradespersonId: 'tp_seed_1',
      seniorUid,
      name: 'Andy Miller (Miller Heating & Plumbing)',
      trade: 'Gas Safe Heating & Boiler Engineer',
      phone: '07700 900481',
      notes: 'Gas Safe Registration #512984. Installed our Worcester Bosch boiler. Extremely polite, punctual, and knows the house setup.',
      isEmergency: true,
      rating: '5.0 ★ Highly Trusted',
      recommendedBy: 'Son (David Jenkins)',
      createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    },
    {
      tradespersonId: 'tp_seed_2',
      seniorUid,
      name: 'Clive Davies Electrical Services',
      trade: 'NICEIC Approved Electrician',
      phone: '0121 496 0882',
      notes: 'Part P Certified Domestic Electrician. Upgraded the consumer unit and tested smoke alarms. 24/7 callout for power faults.',
      isEmergency: true,
      rating: '4.9 ★ Verified Local',
      recommendedBy: 'Age UK Local Trade Directory',
      createdAt: new Date(Date.now() - 86400000 * 100).toISOString(),
    },
    {
      tradespersonId: 'tp_seed_3',
      seniorUid,
      name: 'David Evans (D&E Household Repairs & Locks)',
      trade: 'General Handyman & Locksmith',
      phone: '07700 900219',
      notes: 'Grab rails in bathroom, key cutting, window hinges, door locks, and minor carpentry. Very fair fixed prices.',
      isEmergency: false,
      rating: '5.0 ★ Local Recommendation',
      recommendedBy: 'Neighbourhood Watch Scheme',
      createdAt: new Date(Date.now() - 86400000 * 80).toISOString(),
    },
  ];
}

/**
 * Fetch all home assets for a senior
 */
export async function getHomeAssetsForSenior(seniorUid: string): Promise<HomeAssetRecord[]> {
  const path = 'homeAssets';
  try {
    const q = query(
      collection(db, path),
      where('seniorUid', '==', seniorUid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return getInitialSeededHomeAssets(seniorUid);
    }
    return snap.docs.map((d) => d.data() as HomeAssetRecord);
  } catch (error) {
    console.warn('Could not fetch home assets from Firestore, falling back to seed:', error);
    return getInitialSeededHomeAssets(seniorUid);
  }
}

/**
 * Subscribe to real-time home assets for a senior
 */
export function subscribeHomeAssetsForSenior(
  seniorUid: string,
  onUpdate: (assets: HomeAssetRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'homeAssets';
  const q = query(collection(db, path), where('seniorUid', '==', seniorUid));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onUpdate(getInitialSeededHomeAssets(seniorUid));
      } else {
        const items = snap.docs.map((d) => d.data() as HomeAssetRecord);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Subscription error on homeAssets:', err);
      if (onError) onError(err);
      onUpdate(getInitialSeededHomeAssets(seniorUid));
    }
  );
}

/**
 * Save or update a Home Asset and automatically synchronize matching Reminders
 * for nextServiceDate (service) and warrantyExpiry (renewal).
 */
export async function saveHomeAsset(
  asset: HomeAssetRecord,
  createAutoReminders: boolean = true
): Promise<{ success: boolean; serviceReminderCreated?: boolean; warrantyReminderCreated?: boolean; error?: string }> {
  const path = `homeAssets/${asset.assetId}`;
  try {
    // Ensure nextServiceDate is calculated
    const nextServiceDate = asset.nextServiceDate || calculateNextServiceDate(asset.lastServiceDate, asset.serviceIntervalMonths);
    const assetToSave: HomeAssetRecord = {
      ...asset,
      nextServiceDate,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'homeAssets', asset.assetId), assetToSave, { merge: true });

    let serviceReminderCreated = false;
    let warrantyReminderCreated = false;

    if (createAutoReminders) {
      // 1. Next Service Date Reminder (type: 'service')
      if (nextServiceDate) {
        try {
          const serviceReminderId = `rem_service_${asset.assetId}`;
          const isBoiler = asset.type === 'boiler';
          const newReminder: ReminderRecord = {
            reminderId: serviceReminderId,
            seniorUid: asset.seniorUid,
            type: 'service',
            title: isBoiler
              ? `Annual Gas Boiler Service Due: ${asset.name}`
              : `Maintenance / Service Due: ${asset.name}`,
            dueDate: nextServiceDate,
            recurrence: asset.serviceIntervalMonths === 12 ? 'yearly' : 'none',
            channel: ['in_app', 'email'],
            status: 'upcoming',
            createdBy: asset.seniorUid,
            createdByName: 'Home Manager Auto-Scheduler',
            createdByRole: 'senior',
            createdAt: new Date().toISOString(),
            notes: `Scheduled maintenance check for ${asset.name}. Interval: Every ${asset.serviceIntervalMonths || 12} months. Asset notes: ${asset.notes || ''}`,
          };
          await createReminder(newReminder);
          serviceReminderCreated = true;
        } catch (sErr) {
          console.warn('Could not auto-create service reminder:', sErr);
        }
      }

      // 2. Warranty Expiry Reminder (type: 'renewal')
      if (asset.warrantyExpiry) {
        try {
          const warrantyReminderId = `rem_warranty_${asset.assetId}`;
          const expTime = new Date(asset.warrantyExpiry).getTime();
          if (!isNaN(expTime)) {
            // Schedule 4 weeks (28 days) before warranty expires so owner has time to review
            const fourWeeksMs = 28 * 24 * 60 * 60 * 1000;
            let reminderTime = expTime - fourWeeksMs;
            const now = Date.now();
            if (reminderTime < now) {
              reminderTime = Math.min(expTime, now + 86400000);
            }
            const remDate = new Date(reminderTime);
            const y = remDate.getFullYear();
            const m = String(remDate.getMonth() + 1).padStart(2, '0');
            const d = String(remDate.getDate()).padStart(2, '0');
            const dueDateStr = `${y}-${m}-${d}`;

            const newReminder: ReminderRecord = {
              reminderId: warrantyReminderId,
              seniorUid: asset.seniorUid,
              type: 'renewal',
              title: `Warranty Expiry Notice: ${asset.name}`,
              dueDate: dueDateStr,
              recurrence: 'none',
              channel: ['in_app', 'email'],
              status: 'upcoming',
              createdBy: asset.seniorUid,
              createdByName: 'Home Manager Warranty Tracker',
              createdByRole: 'senior',
              createdAt: new Date().toISOString(),
              notes: `Manufacturer / policy warranty expiring for ${asset.name} on ${asset.warrantyExpiry}. Check extension or renewal terms.`,
            };
            await createReminder(newReminder);
            warrantyReminderCreated = true;
          }
        } catch (wErr) {
          console.warn('Could not auto-create warranty reminder:', wErr);
        }
      }
    }

    return { success: true, serviceReminderCreated, warrantyReminderCreated };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete a Home Asset and clean up associated reminders
 */
export async function deleteHomeAsset(assetId: string): Promise<{ success: boolean; error?: string }> {
  const path = `homeAssets/${assetId}`;
  try {
    await deleteDoc(doc(db, 'homeAssets', assetId));
    // Clean up reminders
    try {
      await deleteDoc(doc(db, 'reminders', `rem_service_${assetId}`));
    } catch {}
    try {
      await deleteDoc(doc(db, 'reminders', `rem_warranty_${assetId}`));
    } catch {}
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: (error as Error).message };
  }
}

// =============================================================================
// 11. Home Manager: Trusted Tradespeople
// =============================================================================

/**
 * Fetch all trusted tradespeople for a senior
 */
export async function getTradespeopleForSenior(seniorUid: string): Promise<TradespersonRecord[]> {
  const path = 'tradespeople';
  try {
    const q = query(
      collection(db, path),
      where('seniorUid', '==', seniorUid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return getInitialSeededTradespeople(seniorUid);
    }
    return snap.docs.map((d) => d.data() as TradespersonRecord);
  } catch (error) {
    console.warn('Could not fetch tradespeople from Firestore, falling back to seed:', error);
    return getInitialSeededTradespeople(seniorUid);
  }
}

/**
 * Subscribe to real-time trusted tradespeople for a senior
 */
export function subscribeTradespeopleForSenior(
  seniorUid: string,
  onUpdate: (items: TradespersonRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'tradespeople';
  const q = query(collection(db, path), where('seniorUid', '==', seniorUid));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onUpdate(getInitialSeededTradespeople(seniorUid));
      } else {
        const items = snap.docs.map((d) => d.data() as TradespersonRecord);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Subscription error on tradespeople:', err);
      if (onError) onError(err);
      onUpdate(getInitialSeededTradespeople(seniorUid));
    }
  );
}

/**
 * Save or update a trusted tradesperson
 */
export async function saveTradesperson(
  tp: TradespersonRecord
): Promise<{ success: boolean; error?: string }> {
  const path = `tradespeople/${tp.tradespersonId}`;
  try {
    await setDoc(doc(db, 'tradespeople', tp.tradespersonId), tp, { merge: true });
    return { success: true };
  } catch (error)
    {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete a trusted tradesperson
 */
export async function deleteTradesperson(
  tradespersonId: string
): Promise<{ success: boolean; error?: string }> {
  const path = `tradespeople/${tradespersonId}`;
  try {
    await deleteDoc(doc(db, 'tradespeople', tradespersonId));
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: (error as Error).message };
  }
}

// =============================================================================
// 12. Tracked Subscriptions Service ("What am I paying for?")
// =============================================================================

/**
 * Initial seeded subscriptions for UK seniors (realistic household recurring bills)
 */
export function getInitialSeededSubscriptions(seniorUid: string = 'senior_margaret_jenkins'): TrackedSubscription[] {
  const today = new Date();

  const formatDate = (daysOffset: number) => {
    const d = new Date(today.getTime() + daysOffset * 86400000);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return [
    {
      trackId: `sub_netflix_${seniorUid.substring(0, 5)}`,
      seniorUid,
      provider: 'Netflix (Standard HD)',
      category: 'streaming_tv',
      amount: 10.99,
      currency: 'GBP',
      billingCycle: 'monthly',
      nextRenewalDate: formatDate(8),
      status: 'active',
      detectedVia: 'manual',
      sharedWithFamily: ['family_david_jenkins'],
      notes: 'Standard 2-screen plan. Used on living room smart TV and iPad.',
      accountReference: 'NET-77192-GB',
      cancellationPhone: '0800 096 6379',
      cancellationUrl: 'https://help.netflix.com/en/node/407',
      createdAt: new Date(today.getTime() - 86400000 * 90).toISOString(),
    },
    {
      trackId: `sub_sky_broadband_${seniorUid.substring(0, 5)}`,
      seniorUid,
      provider: 'Sky TV Essentials & Superfast Broadband',
      category: 'broadband_mobile',
      amount: 58.00,
      previousAmount: 44.00,
      currency: 'GBP',
      billingCycle: 'monthly',
      nextRenewalDate: formatDate(5),
      status: 'flagged',
      flagReason: 'Price increased from £44.00 to £58.00/month after the 18-month introductory contract ended.',
      detectedVia: 'manual',
      sharedWithFamily: ['family_david_jenkins'],
      notes: 'Contract ended last month. Call customer loyalty department to negotiate a cheaper renewal deal or cancel TV bundle.',
      accountReference: 'SKY-992014-UK',
      cancellationPhone: '0333 7591 018',
      cancellationUrl: 'https://www.sky.com/help/articles/cancel-sky-tv',
      createdAt: new Date(today.getTime() - 86400000 * 120).toISOString(),
    },
    {
      trackId: `sub_british_gas_homecare_${seniorUid.substring(0, 5)}`,
      seniorUid,
      provider: 'British Gas HomeCare Two (Boiler & Heating)',
      category: 'utilities_home',
      amount: 24.50,
      currency: 'GBP',
      billingCycle: 'monthly',
      nextRenewalDate: formatDate(16),
      status: 'active',
      detectedVia: 'manual',
      sharedWithFamily: ['family_david_jenkins'],
      notes: 'Includes annual boiler safety service and 24/7 central heating emergency callouts.',
      accountReference: 'BG-HC-402911',
      cancellationPhone: '0333 200 8899',
      createdAt: new Date(today.getTime() - 86400000 * 180).toISOString(),
    },
    {
      trackId: `sub_saga_magazine_${seniorUid.substring(0, 5)}`,
      seniorUid,
      provider: 'Saga Magazine Print & Digital Subscription',
      category: 'magazines_news',
      amount: 4.99,
      currency: 'GBP',
      billingCycle: 'monthly',
      nextRenewalDate: formatDate(22),
      status: 'active',
      detectedVia: 'manual',
      sharedWithFamily: ['family_david_jenkins'],
      notes: 'Direct Debit monthly magazine delivery with puzzle book supplement.',
      accountReference: 'SAGA-MAG-8812',
      cancellationPhone: '0800 056 1057',
      createdAt: new Date(today.getTime() - 86400000 * 60).toISOString(),
    },
    {
      trackId: `sub_aviva_breakdown_${seniorUid.substring(0, 5)}`,
      seniorUid,
      provider: 'Aviva Personal Roadside & Recovery Breakdown',
      category: 'insurance_cover',
      amount: 96.00,
      currency: 'GBP',
      billingCycle: 'annual',
      nextRenewalDate: formatDate(35),
      status: 'active',
      detectedVia: 'manual',
      sharedWithFamily: ['family_david_jenkins'],
      notes: 'Personal cover applies to any vehicle Margaret is driving or passenger in.',
      accountReference: 'AV-BKD-1029',
      cancellationPhone: '0800 015 1515',
      createdAt: new Date(today.getTime() - 86400000 * 330).toISOString(),
    },
    {
      trackId: `sub_age_uk_charity_${seniorUid.substring(0, 5)}`,
      seniorUid,
      provider: 'Age UK Monthly Charitable Direct Debit',
      category: 'charity_direct_debit',
      amount: 5.00,
      currency: 'GBP',
      billingCycle: 'monthly',
      nextRenewalDate: formatDate(12),
      status: 'active',
      detectedVia: 'manual',
      sharedWithFamily: [],
      notes: 'Monthly voluntary donation supporting befriending calls for lonely seniors in the UK.',
      accountReference: 'AUK-DON-5510',
      cancellationPhone: '0800 169 8787',
      createdAt: new Date(today.getTime() - 86400000 * 200).toISOString(),
    },
  ];
}

/**
 * Placeholder for automated bank statement / Open Banking or email receipt scanning.
 * Deliberately deferred and consent-gated for senior safety and GDPR compliance.
 */
export async function detectSubscriptionsFromScan(
  _source: 'bank' | 'email',
  _seniorUid: string
): Promise<TrackedSubscription[]> {
  // Deliberately deferred feature requiring explicit UK Open Banking FCA accreditation and user consent
  throw new Error(
    'detectSubscriptionsFromScan: Not implemented. Automated bank and email scanning is a deliberately deferred, consent-gated feature.'
  );
}

/**
 * Helper to calculate monthly and annual spend summary metrics
 */
export function calculateSubscriptionSpendSummary(
  subscriptions: TrackedSubscription[]
): SubscriptionSpendSummary {
  let monthlyTotal = 0;
  let annualTotal = 0;
  let activeCount = 0;
  let flaggedCount = 0;
  let cancelledCount = 0;

  const categoryMap: { [cat: string]: { monthlyAmount: number; count: number } } = {};

  for (const sub of subscriptions) {
    if (sub.status === 'cancelled') {
      cancelledCount++;
      continue;
    }

    if (sub.status === 'flagged') {
      flaggedCount++;
    } else {
      activeCount++;
    }

    let monthlyEquiv = 0;
    let annualEquiv = 0;

    switch (sub.billingCycle) {
      case 'monthly':
        monthlyEquiv = sub.amount;
        annualEquiv = sub.amount * 12;
        break;
      case 'annual':
        monthlyEquiv = sub.amount / 12;
        annualEquiv = sub.amount;
        break;
      case 'quarterly':
        monthlyEquiv = (sub.amount * 4) / 12;
        annualEquiv = sub.amount * 4;
        break;
      case 'other':
      default:
        monthlyEquiv = sub.amount;
        annualEquiv = sub.amount * 12;
        break;
    }

    monthlyTotal += monthlyEquiv;
    annualTotal += annualEquiv;

    const catKey = sub.category || 'other';
    if (!categoryMap[catKey]) {
      categoryMap[catKey] = { monthlyAmount: 0, count: 0 };
    }
    categoryMap[catKey].monthlyAmount += monthlyEquiv;
    categoryMap[catKey].count += 1;
  }

  const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    monthlyAmount: Math.round(data.monthlyAmount * 100) / 100,
    count: data.count,
  }));

  return {
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    annualTotal: Math.round(annualTotal * 100) / 100,
    activeCount,
    flaggedCount,
    cancelledCount,
    categoryBreakdown,
  };
}

/**
 * Fetch all tracked subscriptions for a given senior UID
 */
export async function getTrackedSubscriptionsForSenior(
  seniorUid: string
): Promise<TrackedSubscription[]> {
  const path = 'trackedSubscriptions';
  try {
    const q = query(
      collection(db, path),
      where('seniorUid', '==', seniorUid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      const seeded = getInitialSeededSubscriptions(seniorUid);
      try {
        for (const item of seeded) {
          await setDoc(doc(db, path, item.trackId), item);
        }
      } catch (seedErr) {
        console.warn('Could not persist seeded subscriptions to Firestore, using in memory:', seedErr);
      }
      return seeded;
    }

    return snap.docs.map((d) => d.data() as TrackedSubscription);
  } catch (error) {
    console.warn('Could not fetch trackedSubscriptions from Firestore, falling back to seed:', error);
    return getInitialSeededSubscriptions(seniorUid);
  }
}

/**
 * Real-time subscription to tracked subscriptions for a senior
 */
export function subscribeTrackedSubscriptionsForSenior(
  seniorUid: string,
  onUpdate: (items: TrackedSubscription[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'trackedSubscriptions';
  const q = query(collection(db, path), where('seniorUid', '==', seniorUid));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onUpdate(getInitialSeededSubscriptions(seniorUid));
      } else {
        const items = snap.docs.map((d) => d.data() as TrackedSubscription);
        // Sort by next renewal date ascending
        items.sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime());
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Subscription error on trackedSubscriptions:', err);
      if (onError) onError(err);
      onUpdate(getInitialSeededSubscriptions(seniorUid));
    }
  );
}

/**
 * Save or update a Tracked Subscription in Firestore.
 *
 * Logic:
 * 1. If edited amount > previous amount or price jump is detected, auto-flag with status="flagged"
 *    and trigger an in-app notification to the senior and any linked family members.
 * 2. Synchronizes a matching renewal reminder entry in the "reminders" collection
 *    scheduled roughly 7 days before nextRenewalDate (or on renewal date).
 */
export async function saveTrackedSubscription(
  sub: TrackedSubscription,
  createRenewalReminder: boolean = true
): Promise<{ success: boolean; flaggedDueToPriceJump?: boolean; reminderCreated?: boolean; error?: string }> {
  const path = `trackedSubscriptions/${sub.trackId}`;
  try {
    let flaggedDueToPriceJump = false;
    const finalRecord: TrackedSubscription = {
      ...sub,
      updatedAt: new Date().toISOString(),
    };

    // Check if price increased compared to previous known amount
    if (sub.previousAmount && sub.amount > sub.previousAmount && sub.status !== 'cancelled') {
      finalRecord.status = 'flagged';
      finalRecord.flagReason = `Price increased from £${sub.previousAmount.toFixed(2)} to £${sub.amount.toFixed(2)} (${sub.billingCycle}).`;
      flaggedDueToPriceJump = true;

      // Dispatch price-increase notification to senior and family carers
      try {
        const notifId = `notif_price_jump_${sub.trackId}_${Date.now()}`;
        const priceJumpNotif: NotificationRecord = {
          notifId,
          uid: sub.seniorUid,
          type: 'subscription_price_jump',
          payload: {
            title: `⚠️ Price Increase Detected: ${sub.provider}`,
            body: `Your recurring cost for ${sub.provider} increased from £${sub.previousAmount.toFixed(2)} to £${sub.amount.toFixed(2)} per ${sub.billingCycle}. Review this renewal in Subscription Manager.`,
            route: '/subscriptions',
            module: 'subscriptions',
            trackId: sub.trackId,
            provider: sub.provider,
            newAmount: sub.amount,
            oldAmount: sub.previousAmount,
            actionRequired: true,
          },
          read: false,
          createdAt: new Date().toISOString(),
        };
        await sendNotification(priceJumpNotif);

        // Also notify shared family members
        if (sub.sharedWithFamily && sub.sharedWithFamily.length > 0) {
          for (const familyUid of sub.sharedWithFamily) {
            const familyNotifId = `notif_price_jump_fam_${sub.trackId}_${familyUid}_${Date.now()}`;
            await sendNotification({
              ...priceJumpNotif,
              notifId: familyNotifId,
              uid: familyUid,
              payload: {
                ...priceJumpNotif.payload,
                title: `⚠️ Price Increase on Margaret's ${sub.provider} Bill`,
                body: `${sub.provider} increased from £${sub.previousAmount.toFixed(2)} to £${sub.amount.toFixed(2)} per ${sub.billingCycle}.`,
              },
            });
          }
        }
      } catch (notifErr) {
        console.warn('Could not dispatch price jump notification:', notifErr);
      }
    }

    await setDoc(doc(db, 'trackedSubscriptions', sub.trackId), finalRecord, { merge: true });

    let reminderCreated = false;

    // Automatic reminder synchronization for nextRenewalDate
    if (finalRecord.nextRenewalDate && finalRecord.status !== 'cancelled' && createRenewalReminder) {
      try {
        const renewalTime = new Date(finalRecord.nextRenewalDate).getTime();
        if (!isNaN(renewalTime)) {
          // Schedule reminder 7 days before renewal, or at least 1 day before if less than 7 days
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          let reminderScheduleTime = renewalTime - sevenDaysMs;
          const now = Date.now();
          if (reminderScheduleTime < now) {
            reminderScheduleTime = Math.min(renewalTime, now + 86400000);
          }

          const remDate = new Date(reminderScheduleTime);
          const y = remDate.getFullYear();
          const m = String(remDate.getMonth() + 1).padStart(2, '0');
          const d = String(remDate.getDate()).padStart(2, '0');
          const dueDateStr = `${y}-${m}-${d}`;

          const reminderId = `rem_sub_${finalRecord.trackId}`;
          const newReminder: ReminderRecord = {
            reminderId,
            seniorUid: finalRecord.seniorUid,
            type: 'renewal',
            title: `Review ${finalRecord.provider} Subscription Renewal (£${finalRecord.amount.toFixed(2)}/${finalRecord.billingCycle})`,
            dueDate: dueDateStr,
            recurrence: finalRecord.billingCycle === 'annual' ? 'yearly' : (finalRecord.billingCycle === 'monthly' ? 'monthly' : 'none'),
            channel: ['in_app', 'email'],
            status: 'upcoming',
            createdBy: finalRecord.seniorUid,
            createdByName: 'Subscription Manager Renewal Alert',
            createdByRole: 'senior',
            createdAt: new Date().toISOString(),
            notes: `Auto-renewal notice for ${finalRecord.provider}. Next payment due on ${finalRecord.nextRenewalDate}. Check if price is competitive or if you wish to keep/cancel.`,
          };

          await createReminder(newReminder);
          reminderCreated = true;
        }
      } catch (remErr) {
        console.warn('Could not auto-create renewal reminder for subscription:', remErr);
      }
    }

    return { success: true, flaggedDueToPriceJump, reminderCreated };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Update subscription status (e.g. resolve flag, mark as cancelled, reactivate)
 */
export async function updateSubscriptionStatus(
  trackId: string,
  status: SubscriptionStatus,
  flagReason?: string
): Promise<{ success: boolean; error?: string }> {
  const path = `trackedSubscriptions/${trackId}`;
  try {
    const updates: Partial<TrackedSubscription> = {
      status,
      flagReason: status === 'flagged' ? flagReason : undefined,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, 'trackedSubscriptions', trackId), updates);

    // If cancelled, remove or mark matching renewal reminder
    if (status === 'cancelled') {
      try {
        await deleteDoc(doc(db, 'reminders', `rem_sub_${trackId}`));
      } catch {}
    }

    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete a Tracked Subscription and remove linked reminder
 */
export async function deleteTrackedSubscription(
  trackId: string
): Promise<{ success: boolean; error?: string }> {
  const path = `trackedSubscriptions/${trackId}`;
  try {
    await deleteDoc(doc(db, 'trackedSubscriptions', trackId));
    try {
      await deleteDoc(doc(db, 'reminders', `rem_sub_${trackId}`));
    } catch {}
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, error: (error as Error).message };
  }
}

// =============================================================================
// 13. Plans Collection Service (Pricing & Membership Tiers)
// =============================================================================

export const DEFAULT_PLANS: import('../types').PricingPlan[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    price: 45,
    currency: 'GBP',
    interval: 'month',
    tagline: 'Core protection and everyday reassurance for independent seniors.',
    isPopular: false,
    familySeats: 1,
    modulesIncluded: ['scam-protection', 'digital-help', 'reminders'],
    features: [
      'Scam Protection: Instant text, email & letter verification',
      'Digital Help: Step-by-step plain English guides & glossary',
      'Life Reminders: Appointments, MOTs & medication times',
      '1 family/carer account with permission-based access',
      'Dedicated UK email support (Monday–Friday)',
      'Direct Debit Guarantee protected'
    ],
    supportLevel: 'Email support',
    order: 1,
    bestFor: 'Seniors who only need light support from time to time.',
    responseTime: 'Within 2 hours (during support hours)',
    supportHours: 'Mon–Fri, 9:00 AM – 5:30 PM (UK Time)',
    delivery: 'Instant portal access (setup guidance next business day)',
    buttonLabel: 'Choose Essentials'
  },
  {
    id: 'complete',
    name: 'Complete',
    price: 55,
    currency: 'GBP',
    interval: 'month',
    tagline: 'Comprehensive home, health, and financial organisation for the whole family.',
    isPopular: true,
    familySeats: 3,
    modulesIncluded: [
      'scam-protection',
      'digital-help',
      'reminders',
      'document-vault',
      'home-manager',
      'subscriptions'
    ],
    features: [
      'Everything in Essentials plan',
      'Document Vault: Encrypted storage for vital papers & wills',
      'Home Manager: Boiler service tracking & trusted trades directory',
      'Subscription Manager: Monthly outgoings & price hike alerts',
      'Up to 3 family/carer accounts with permission-based access and digest summaries',
      'Priority UK email support & Live Chat guidance',
      'Direct Debit Guarantee protected'
    ],
    supportLevel: 'Priority email + Live chat',
    order: 2,
    bestFor: 'Seniors who need regular monthly education on everyday digital tasks.',
    responseTime: 'Within 1 hour (during support hours, priority queue)',
    supportHours: 'Mon–Sat, 9:00 AM – 6:00 PM (UK Time)',
    delivery: 'Instant portal access (guided onboarding within 24 hours)',
    buttonLabel: 'Choose Complete'
  },
  {
    id: 'complete_family',
    name: 'Complete + Family',
    price: 65,
    currency: 'GBP',
    interval: 'month',
    tagline: 'Full peace-of-mind package with priority response and unlimited carer access.',
    isPopular: false,
    familySeats: 'Unlimited',
    modulesIncluded: [
      'scam-protection',
      'digital-help',
      'reminders',
      'document-vault',
      'home-manager',
      'subscriptions',
      'family-connect'
    ],
    features: [
      'All 7 EverEase modules with full feature access',
      'Unlimited encrypted document & photo storage',
      'Priority rapid scam-check response queue',
      'Unlimited family/carer accounts with permission-based access',
      'Priority live chat + Monthly telephone check-in call',
      'Direct contact line for family carers in emergencies',
      'Direct Debit Guarantee protected'
    ],
    supportLevel: 'Priority chat + Monthly phone check-in',
    order: 3,
    bestFor: 'Adult children who want regular support available for a parent or loved one.',
    responseTime: 'Under 30 min. (during support hours, express queue)',
    supportHours: 'Mon–Sun, 9:00 AM – 5:30 PM (UK Time)',
    delivery: 'Instant portal access (priority onboarding within 12 hours)',
    buttonLabel: 'Choose Complete + Family'
  }
];

/**
 * Fetch plans from Firestore 'plans' collection with automatic fallback to DEFAULT_PLANS
 */
export async function getPricingPlans(): Promise<import('../types').PricingPlan[]> {
  const path = 'plans';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const plans = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      })) as import('../types').PricingPlan[];
      return plans;
    }
  } catch (error) {
    console.info('Pricing plans falling back to default structured tiers:', error);
  }
  return DEFAULT_PLANS;
}





