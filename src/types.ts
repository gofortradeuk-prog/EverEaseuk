// =============================================================================
// Core Role Definitions & Accessibility Types
// =============================================================================
export type UserRole = 
  | 'senior' 
  | 'family' 
  | 'admin'
  | 'family_carer' 
  | 'support_admin' 
  | 'finance_admin' 
  | 'super_admin';

export type AdminRole = 'support' | 'finance' | 'superadmin';

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  fontSize?: TextSize | 'default' | 'large' | 'extra-large';
  textSize?: TextSize;
  highContrast: boolean;
  voice?: boolean;
  readAloudEnabled?: boolean;
}

// =============================================================================
// 1. Users Collection
// Collection: users
// Fields: uid, role (senior/family/admin), displayName, email, phone, plan,
//         accessibilitySettings (fontSize, highContrast, voice), createdAt
// =============================================================================
export interface UserRecord {
  uid: string;
  uniqueMemberId?: string;
  tempPassword?: string;
  role: 'senior' | 'family' | 'admin' | UserRole;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  plan?: string;
  stripeCustomerId?: string;
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  paymentStatus?: 'invoice_sent' | 'paid' | 'pending' | 'direct_debit_active';
  paymentMethodsAllowed?: string[];
  accessibilitySettings?: {
    fontSize: 'default' | 'large' | 'extra-large' | TextSize;
    highContrast: boolean;
    voice: boolean;
  };
  accessibility?: AccessibilitySettings;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  seniorDetails?: {
    preferredName?: string;
    birthYear?: number;
    emergencyContactPhone?: string;
    emergencyContactName?: string;
  };
  carerDetails?: {
    relationship?: string;
    linkedSeniorUids?: string[];
  };
}

export interface OnboardingInvoiceResult {
  success: boolean;
  uniqueMemberId: string;
  tempPassword: string;
  invoiceId: string;
  invoiceNumber: string;
  hostedInvoiceUrl: string;
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'month';
  };
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  paymentMethodsAllowed: string[];
  dispatchedAt: string;
  noDirectCheckoutNotice: string;
}

export type UserProfile = UserRecord;

// =============================================================================
// 2. FamilyLinks Collection
// Collection: familyLinks
// Fields: linkId, seniorUid, familyUid, permissions (map of module name to
//         level: view/edit/manage), status (invited/active/revoked), invitedBy, createdAt
// =============================================================================
export type PermissionLevel = 'view' | 'edit' | 'manage';

export type ModulePermissionMap = {
  [moduleName: string]: PermissionLevel;
};

export interface FamilyLink {
  linkId: string;
  seniorUid: string;
  seniorName?: string;
  seniorEmail?: string;
  familyUid: string;
  familyName?: string;
  familyEmail?: string;
  relationship?: string;
  invitedEmail?: string;
  invitedBy: string;
  invitedByName?: string;
  permissions: ModulePermissionMap;
  status: 'invited' | 'active' | 'revoked';
  createdAt: string;
  updatedAt?: string;
  lastAccessedAt?: string;
}

export interface SeniorDigestData {
  seniorUid: string;
  seniorName: string;
  relationship?: string;
  permissions: ModulePermissionMap;
  lastActive?: string;
  scamChecks: {
    totalCount: number;
    flaggedCount: number;
    recentChecks: ScamCheckRecord[];
  };
  reminders: {
    upcomingCount: number;
    overdueCount: number;
    upcomingList: ReminderRecord[];
  };
  documents: {
    totalCount: number;
    expiringSoonCount: number;
    expiringList: DocumentRecord[];
  };
  subscriptions: {
    activeCount: number;
    monthlyTotal: number;
    flaggedCount: number;
    flaggedList: TrackedSubscription[];
  };
  homeManager?: {
    totalAssets: number;
    urgentIssues: number;
  };
  escalations: {
    id: string;
    type: 'scam_check' | 'digital_help';
    title: string;
    description: string;
    createdAt: string;
    route: string;
    payload?: any;
  }[];
}

// =============================================================================
// 3. Notifications Collection
// Collection: notifications
// Fields: notifId, uid, type, payload, read, createdAt
// =============================================================================
export interface NotificationPayload {
  title: string;
  body: string;
  route?: string;
  module?: string;
  actionRequired?: boolean;
  checkId?: string;
  verdict?: 'safe' | 'caution' | 'likely_scam';
  seniorName?: string;
  metadata?: Record<string, any>;
}

export interface NotificationRecord {
  notifId: string;
  uid: string;
  type: 'scam_alert' | 'reminder' | 'family_invite' | 'document_share' | 'system' | string;
  payload: NotificationPayload | Record<string, any>;
  read: boolean;
  createdAt: string;
}

// =============================================================================
// 4. AuditLogs Collection
// Collection: auditLogs
// Fields: logId, actorUid, action, targetUid, targetResource, timestamp
// =============================================================================
export interface AuditLog {
  logId: string;
  actorUid: string;
  action: 'PERMISSION_CHANGE' | 'LINK_INVITED' | 'LINK_ACTIVATED' | 'LINK_REVOKED' | 'LOGIN' | 'SCAM_REPORT' | string;
  targetUid: string;
  targetResource: string;
  timestamp: string;
  details?: Record<string, any>;
}

// =============================================================================
// 5. AdminUsers Collection
// Collection: adminUsers
// Fields: uid, adminRole (support/finance/superadmin)
// =============================================================================
export interface AdminUser {
  uid: string;
  adminRole: AdminRole;
  displayName?: string;
  email?: string;
  assignedAt?: string;
  assignedBy?: string;
}

export interface SupportTicket {
  id: string;
  uid: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  type: 'family_escalation' | 'support_request' | 'scam_escalation' | 'subscription_dispute' | 'general_help';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedAdminUid?: string;
  assignedAdminName?: string;
  priority: 'urgent' | 'high' | 'normal';
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  relatedModule?: string;
  rawPayload?: Record<string, any>;
}

export interface SupportImpersonationSession {
  adminUid: string;
  adminEmail: string;
  adminName: string;
  adminRole: AdminRole;
  targetUser: UserProfile;
  startedAt: number; // timestamp in ms
  expiresAt: number; // timestamp in ms (startedAt + 15 * 60 * 1000)
}

export interface AdminOverviewMetrics {
  totalUsers: number;
  activeSeniors: number;
  linkedFamilyCarers: number;
  adminStaffCount: number;
  planCounts: {
    free_trial: number;
    standard_monthly: number;
    family_care_bundle: number;
    annual_saver: number;
  };
  moduleUsage: {
    totalScamChecks: number;
    flaggedScams: number;
    safeChecks: number;
    activeReminders: number;
    documentsSecured: number;
    homeAssetsTracked: number;
    subscriptionsMonitored: number;
    flaggedSubscriptions: number;
    guidesPublished: number;
    openSupportTickets: number;
    resolvedSupportTickets: number;
  };
  monthlyRevenueGbp: number;
}

// =============================================================================
// 6. ScamChecks Collection ("Is this message safe?")
// Collection: scamChecks
// Fields: checkId, seniorUid, inputType (text/image/email), rawContentRef,
//         verdict (safe/caution/likely_scam), explanation, redFlags (array of strings),
//         createdAt
// =============================================================================
export type ScamVerdict = 'safe' | 'caution' | 'likely_scam';
export type ScamInputType = 'text' | 'image' | 'email';

export interface ScamCheckRecord {
  checkId: string;
  seniorUid: string;
  inputType: ScamInputType;
  rawContentRef: string | null;
  verdict: ScamVerdict;
  explanation: string;
  redFlags: string[];
  advice?: string;
  createdAt: string;
}

export interface ScamCheckApiResponse {
  verdict: ScamVerdict;
  explanation: string;
  redFlags: string[];
  advice: string;
  confidence?: string;
}

// =============================================================================
// 7. Guides Collection ("How do I do this?" Library)
// Collection: guides
// Fields: guideId, title, category, steps (array of {title, description}),
//         createdBy, updatedAt
// =============================================================================
export interface GuideStep {
  title: string;
  description: string;
}

export interface Guide {
  guideId: string;
  title: string;
  category: string;
  iconName?: string;
  summary?: string;
  steps: GuideStep[];
  createdBy: string;
  updatedAt: string;
}

export interface DigitalHelpMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  steps?: { title: string; description: string }[];
  isVoiceInput?: boolean;
}

// =============================================================================
// 8. Reminders Collection (Life Reminders)
// Collection: reminders
// Fields: reminderId, seniorUid, type (appointment/renewal/birthday/service),
//         title, dueDate, recurrence (none/weekly/monthly/yearly),
//         channel (array: in_app/email/sms), status (upcoming/done/snoozed),
//         createdBy, createdAt
// =============================================================================
export type ReminderType = 'appointment' | 'renewal' | 'birthday' | 'service';
export type ReminderRecurrence = 'none' | 'weekly' | 'monthly' | 'yearly';
export type ReminderChannel = 'in_app' | 'email' | 'sms';
export type ReminderStatus = 'upcoming' | 'done' | 'snoozed';

export interface ReminderRecord {
  reminderId: string;
  seniorUid: string;
  type: ReminderType;
  title: string;
  dueDate: string; // ISO date string YYYY-MM-DD or YYYY-MM-DDTHH:mm
  time?: string; // e.g. "10:30 AM" or "14:00"
  recurrence: ReminderRecurrence;
  channel: ReminderChannel[];
  status: ReminderStatus;
  createdBy: string;
  createdByName?: string;
  createdByRole?: 'senior' | 'family' | 'admin';
  createdAt: string;
  snoozedUntil?: string;
  notes?: string;
  location?: string;
}

// =============================================================================
// 9. Documents Collection (Document Vault)
// Collection: documents
// Fields: docId, seniorUid, category, title, storagePath, expiryDate,
//         sharedWith (array of familyUids with view access), uploadedAt
// =============================================================================
export type DocumentCategoryType =
  | 'identity_passport'
  | 'home_insurance'
  | 'health_medical'
  | 'legal_financial'
  | 'vehicle_driving'
  | 'utilities_council'
  | 'other';

export interface ExtractedDocumentData {
  suggestedTitle?: string;
  suggestedCategory?: string;
  suggestedExpiryDate?: string;
  issuerOrOrganisation?: string;
  summary?: string;
  confidence?: 'high' | 'medium' | 'low';
}

export interface DocumentRecord {
  docId: string;
  seniorUid: string;
  category: string; // e.g. "identity_passport", "home_insurance", "health_medical"
  title: string;
  storagePath: string; // scoped to seniorUid, e.g. "documents/{seniorUid}/{docId}_{filename}"
  downloadUrl?: string;
  fileType?: string; // 'image/jpeg', 'image/png', 'application/pdf'
  fileName?: string;
  fileSize?: number;
  expiryDate?: string; // ISO date string YYYY-MM-DD
  sharedWith: string[]; // array of familyUids with view access
  uploadedAt: string; // ISO timestamp
  extractedData?: ExtractedDocumentData;
  notes?: string;
  linkedReminderId?: string;
}

// =============================================================================
// 10. Home Assets Collection (Home Manager)
// Collection: homeAssets
// Fields: assetId, seniorUid, type (boiler/appliance/alarm/other), name,
//         warrantyExpiry, lastServiceDate, serviceIntervalMonths, notes,
//         photoStoragePath, createdAt, updatedAt
// =============================================================================
export type HomeAssetType = 'boiler' | 'appliance' | 'alarm' | 'other';

export interface HomeAssetRecord {
  assetId: string;
  seniorUid: string;
  type: HomeAssetType;
  name: string;
  warrantyExpiry?: string; // ISO date string YYYY-MM-DD
  lastServiceDate?: string; // ISO date string YYYY-MM-DD
  serviceIntervalMonths?: number; // e.g. 12 for annual boiler check
  nextServiceDate?: string; // calculated ISO date string YYYY-MM-DD
  notes?: string;
  photoStoragePath?: string; // scoped to "homeAssets/{seniorUid}/{assetId}_{filename}"
  photoUrl?: string; // base64 or download URL for direct preview
  createdAt: string;
  updatedAt?: string;
}

// =============================================================================
// 11. Tradespeople Collection (Trusted Trades & Emergency Contacts)
// Collection: tradespeople
// Fields: tradespersonId, seniorUid, name, trade, phone, notes, isEmergency, createdAt
// =============================================================================
export interface TradespersonRecord {
  tradespersonId: string;
  seniorUid: string;
  name: string;
  trade: string; // e.g. "Gas Safe Heating Engineer", "NICEIC Electrician", "Plumber", "Handyman", "Locksmith"
  phone: string;
  notes?: string;
  isEmergency?: boolean;
  rating?: string;
  recommendedBy?: string;
  createdAt: string;
}

// =============================================================================
// 12. Tracked Subscriptions Collection ("What am I paying for?")
// Collection: trackedSubscriptions
// Fields: trackId, seniorUid, provider, category, amount, currency (default GBP),
//         billingCycle (monthly/annual/quarterly/other), nextRenewalDate,
//         status (active/flagged/cancelled), detectedVia (manual/emailScan/bankScan),
//         sharedWithFamily, previousAmount, flagReason, notes, createdAt, updatedAt
// =============================================================================
export type SubscriptionCategory =
  | 'streaming_tv'
  | 'broadband_mobile'
  | 'insurance_cover'
  | 'utilities_home'
  | 'magazines_news'
  | 'health_fitness'
  | 'charity_direct_debit'
  | 'software_apps'
  | 'other';

export type BillingCycle = 'monthly' | 'annual' | 'quarterly' | 'other';
export type SubscriptionStatus = 'active' | 'flagged' | 'cancelled';
export type DetectedVia = 'manual' | 'emailScan' | 'bankScan';

export interface TrackedSubscription {
  trackId: string;
  seniorUid: string;
  provider: string; // e.g. "Netflix", "Sky TV & Broadband", "British Gas HomeCare", "Saga Magazine"
  category: SubscriptionCategory | string;
  amount: number;
  currency: string; // default "GBP" / "£"
  billingCycle: BillingCycle;
  nextRenewalDate: string; // ISO date string YYYY-MM-DD
  status: SubscriptionStatus;
  detectedVia: DetectedVia;
  sharedWithFamily: string[]; // array of family member UIDs
  previousAmount?: number;
  flagReason?: string;
  notes?: string;
  accountReference?: string;
  cancellationPhone?: string;
  cancellationUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionSpendSummary {
  monthlyTotal: number;
  annualTotal: number;
  activeCount: number;
  flaggedCount: number;
  cancelledCount: number;
  categoryBreakdown: {
    category: string;
    monthlyAmount: number;
    count: number;
  }[];
}

// =============================================================================
// Pricing Plans (Firestore collection: plans)
// =============================================================================
export interface PricingPlan {
  id: 'essentials' | 'complete' | 'complete_family' | string;
  name: string;
  price: number; // in GBP (£)
  currency: string;
  interval: 'month' | 'year';
  tagline: string;
  isPopular?: boolean;
  familySeats: number | 'Unlimited';
  modulesIncluded: string[];
  features: string[];
  supportLevel: string;
  order: number;
  bestFor?: string;
  responseTime?: string;
  supportHours?: string;
  delivery?: string;
  buttonLabel?: string;
}

// =============================================================================
// Module Definitions & Navigation Metadata
// =============================================================================
export type ModuleId = 
  | 'scam-protection'
  | 'digital-help'
  | 'reminders'
  | 'document-vault'
  | 'home-manager'
  | 'subscriptions'
  | 'family-connect';

export interface ModuleDefinition {
  id: ModuleId;
  title: string;
  plainEnglishQuestion: string;
  shortDescription: string;
  detailedDescription: string;
  primaryActionLabel: string;
  iconName: string;
  route: string;
  accentColor: string;
  badge: string;
  category: 'Safety' | 'Guidance' | 'Organiser' | 'Security' | 'Household' | 'Finances' | 'Family';
  featuresPlanned: string[];
}
