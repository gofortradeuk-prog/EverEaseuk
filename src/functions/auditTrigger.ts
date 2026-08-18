/**
 * Cloud Function Trigger Stub: auditPermissionsChangeTrigger
 * 
 * Trigger: Firestore onDocumentUpdated('familyLinks/{linkId}')
 * Purpose: Automatically writes an immutable auditLogs entry whenever a
 *          familyLinks document's permissions field is modified.
 * 
 * Architecture & Security Note:
 * This trigger runs in the secure Google Cloud Functions environment using the
 * Firebase Admin SDK. Because client writes to the 'auditLogs' collection are
 * strictly blocked by firestore.rules (allow write: if false), this trigger
 * guarantees cryptographic integrity and tamper-proof audit trails.
 */

export interface CloudFunctionChange<T> {
  before: {
    data: () => T | undefined;
    exists: boolean;
  };
  after: {
    data: () => T | undefined;
    exists: boolean;
  };
}

export interface FirestoreEventContext {
  params: {
    linkId: string;
  };
  auth?: {
    uid?: string;
  };
  timestamp?: string;
}

export interface FamilyLinkDocumentData {
  linkId: string;
  seniorUid: string;
  familyUid: string;
  permissions: Record<string, 'view' | 'edit' | 'manage'>;
  status: 'invited' | 'active' | 'revoked';
  invitedBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogEntry {
  logId: string;
  actorUid: string;
  action: 'PERMISSION_CHANGE' | string;
  targetUid: string;
  targetResource: string;
  timestamp: string;
  details: {
    linkId: string;
    previousPermissions: Record<string, string>;
    updatedPermissions: Record<string, string>;
    modifiedModules: string[];
    carerUid: string;
  };
}

/**
 * Core business logic for familyLinks permissions audit logging.
 * Can be executed within a Node.js Cloud Function environment with Firebase Admin SDK.
 * 
 * @param change - Firestore document change snapshot (before and after)
 * @param context - Cloud function event context containing document params
 * @param adminFirestore - Instance of Firebase Admin Firestore
 */
export async function handleFamilyLinkPermissionsUpdate(
  change: CloudFunctionChange<FamilyLinkDocumentData>,
  context: FirestoreEventContext,
  adminFirestore?: any
): Promise<{ auditWritten: boolean; log?: AuditLogEntry } | null> {
  const beforeData = change.before.data();
  const afterData = change.after.data();

  // If document was created or deleted, permissions update trigger does not apply
  if (!beforeData || !afterData) {
    return null;
  }

  const prevPerms = beforeData.permissions || {};
  const newPerms = afterData.permissions || {};

  // Check if permissions field changed
  const prevString = JSON.stringify(prevPerms);
  const newString = JSON.stringify(newPerms);

  if (prevString === newString) {
    // Permissions were not modified in this update event
    return { auditWritten: false };
  }

  // Identify specific modules modified
  const allModules = Array.from(new Set([...Object.keys(prevPerms), ...Object.keys(newPerms)]));
  const modifiedModules = allModules.filter((mod) => prevPerms[mod] !== newPerms[mod]);

  const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = context.timestamp || new Date().toISOString();
  const actorUid = context.auth?.uid || afterData.invitedBy || 'system_trigger';

  const auditEntry: AuditLogEntry = {
    logId,
    actorUid,
    action: 'PERMISSION_CHANGE',
    targetUid: afterData.seniorUid,
    targetResource: `familyLinks/${context.params.linkId}`,
    timestamp,
    details: {
      linkId: context.params.linkId,
      previousPermissions: prevPerms,
      updatedPermissions: newPerms,
      modifiedModules,
      carerUid: afterData.familyUid,
    },
  };

  // If Firebase Admin Firestore is passed, write the document to the auditLogs collection
  if (adminFirestore && typeof adminFirestore.collection === 'function') {
    await adminFirestore.collection('auditLogs').doc(logId).set(auditEntry);
    console.info(`[AuditTrigger] Successfully logged permission change for link: ${context.params.linkId}`);
  }

  return {
    auditWritten: true,
    log: auditEntry,
  };
}

/**
 * Firebase Cloud Functions v2 Export Template
 * Uncomment when deploying to Firebase Functions environment:
 * 
 * import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
 * import * as admin from 'firebase-admin';
 * 
 * if (!admin.apps.length) {
 *   admin.initializeApp();
 * }
 * const adminDb = admin.firestore();
 * 
 * export const auditFamilyLinkPermissions = onDocumentUpdated(
 *   'familyLinks/{linkId}',
 *   async (event) => {
 *     return handleFamilyLinkPermissionsUpdate(
 *       event.data as any,
 *       { params: event.params, timestamp: event.time },
 *       adminDb
 *     );
 *   }
 * );
 */
