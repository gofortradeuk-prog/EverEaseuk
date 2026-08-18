import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Cloud Function Trigger: auditFamilyLinkPermissionsChange
 * 
 * Automatically writes an immutable auditLogs entry whenever a
 * familyLinks document's permissions field changes.
 */
export const auditFamilyLinkPermissionsChange = onDocumentUpdated(
  'familyLinks/{linkId}',
  async (event) => {
    if (!event.data) return null;

    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    if (!beforeData || !afterData) return null;

    const prevPerms = beforeData.permissions || {};
    const newPerms = afterData.permissions || {};

    // Check if permissions changed
    if (JSON.stringify(prevPerms) === JSON.stringify(newPerms)) {
      return null;
    }

    const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = event.time || new Date().toISOString();

    const auditEntry = {
      logId,
      actorUid: afterData.invitedBy || 'system_cloud_function',
      action: 'PERMISSION_CHANGE',
      targetUid: afterData.seniorUid,
      targetResource: `familyLinks/${event.params.linkId}`,
      timestamp,
      details: {
        linkId: event.params.linkId,
        previousPermissions: prevPerms,
        updatedPermissions: newPerms,
        carerUid: afterData.familyUid,
      },
    };

    await db.collection('auditLogs').doc(logId).set(auditEntry);
    console.log(`[AuditLog] Recorded permissions change for familyLinks/${event.params.linkId}`);
    return auditEntry;
  }
);
