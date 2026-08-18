import React, { useState, useEffect } from 'react';
import {
  FileLock2,
  Plus,
  Search,
  Camera,
  UploadCloud,
  History,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Users,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Filter,
  Lock,
  Eye,
  Info,
} from 'lucide-react';
import { DocumentRecord, UserRecord } from '../../types';
import {
  getDocumentsForSenior,
  subscribeDocumentsForSenior,
  deleteDocument,
} from '../../lib/firestoreService';
import { DocumentCard } from '../../components/documents/DocumentCard';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';
import { DocumentViewerModal } from '../../components/documents/DocumentViewerModal';
import { DocumentShareModal } from '../../components/documents/DocumentShareModal';
import { AuditLogsModal } from '../../components/documents/AuditLogsModal';
import { DocumentCategoryFilter } from '../../components/documents/DocumentCategoryFilter';

interface Props {
  navigate: (route: string) => void;
  currentUser?: UserRecord | null;
}

export const DocumentVaultPage: React.FC<Props> = ({ navigate, currentUser }) => {
  // Active senior UID persona
  const seniorUid = currentUser?.role === 'senior' ? currentUser.uid : 'senior_margaret_jenkins';

  // Active simulated user for testing viewing / role simulation
  const [activeUserRole, setActiveUserRole] = useState<'senior' | 'family'>('senior');

  // Simulated current user object
  const activeUser: UserRecord = activeUserRole === 'senior'
    ? (currentUser && currentUser.role === 'senior'
        ? currentUser
        : {
            uid: seniorUid,
            email: 'margaret.jenkins@example.co.uk',
            displayName: 'Margaret Jenkins',
            role: 'senior',
            createdAt: new Date().toISOString(),
            accessibility: { highContrast: false, largeFont: true, voiceFeedback: true, screenReaderFriendly: true, reduceMotion: false },
          })
    : {
        uid: 'family_david_jenkins',
        email: 'david.jenkins@example.co.uk',
        displayName: 'David Jenkins (Son & Carer)',
        role: 'family',
        seniorUid,
        createdAt: new Date().toISOString(),
        accessibility: { highContrast: false, largeFont: false, voiceFeedback: false, screenReaderFriendly: false, reduceMotion: false },
      };

  // State
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState<boolean>(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentRecord | null>(null);
  const [sharingDoc, setSharingDoc] = useState<DocumentRecord | null>(null);

  // Success notification banner
  const [alertNotice, setAlertNotice] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Subscribe to real-time document collection
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeDocumentsForSenior(seniorUid, (items) => {
      setDocuments(items);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [seniorUid]);

  // Handle delete
  const handleDelete = async (docToDelete: DocumentRecord) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${docToDelete.title}" from your secure vault?`);
    if (!confirmDelete) return;

    try {
      const res = await deleteDocument(docToDelete.docId);
      if (res.success) {
        setAlertNotice({
          message: `"${docToDelete.title}" removed from vault.`,
          type: 'info',
        });
        setTimeout(() => setAlertNotice(null), 4000);
      }
    } catch (err) {
      console.error('Delete document failed:', err);
    }
  };

  // Handle onSaved from upload modal
  const handleDocSaved = (savedDoc: DocumentRecord, reminderCreated: boolean) => {
    setAlertNotice({
      message: reminderCreated
        ? `"${savedDoc.title}" saved securely to vault! A renewal reminder was automatically scheduled 8 weeks before expiry.`
        : `"${savedDoc.title}" saved securely to your encrypted vault.`,
      type: 'success',
    });
    setTimeout(() => setAlertNotice(null), 6000);
  };

  // Category counts calculation
  const counts: Record<string, number> = {
    all: documents.length,
    home_insurance: 0,
    identity_passport: 0,
    health_medical: 0,
    legal_financial: 0,
    vehicle_driving: 0,
    utilities_council: 0,
  };

  documents.forEach((d) => {
    if (counts[d.category] !== undefined) {
      counts[d.category] += 1;
    }
  });

  // Filter documents by search and category
  const filteredDocuments = documents.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      (d.notes && d.notes.toLowerCase().includes(q)) ||
      (d.extractedData?.summary && d.extractedData.summary.toLowerCase().includes(q));

    // If viewing as family carer, only show documents shared with this family UID or public to family
    if (activeUserRole === 'family') {
      const isSharedWithMe = d.sharedWith.includes(activeUser.uid);
      return matchesCategory && matchesSearch && isSharedWithMe;
    }

    return matchesCategory && matchesSearch;
  });

  // Urgent expiring documents (within 8 weeks)
  const expiringSoonDocs = documents.filter((d) => {
    if (!d.expiryDate) return false;
    const expDate = new Date(d.expiryDate).getTime();
    const diffDays = Math.ceil((expDate - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 56;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Top Breadcrumb & Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>

            {/* Persona View Switcher for easy testing of audit logging & per-doc sharing */}
            <div className="inline-flex items-center gap-2 bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs">
              <span className="text-slate-400 pl-2 font-medium">Viewing as:</span>
              <button
                onClick={() => setActiveUserRole('senior')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeUserRole === 'senior'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Margaret (Senior Owner)
              </button>
              <button
                onClick={() => setActiveUserRole('family')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeUserRole === 'family'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                David (Family Carer)
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <FileLock2 className="w-4 h-4 text-emerald-400" />
                <span>Document Vault & Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Important Documents
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                Encrypted digital storage for your insurance, passport, and medical records with AI renewal reminders and controlled family sharing.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-view-audit-logs"
                onClick={() => setIsAuditLogsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm shadow-sm transition-colors"
              >
                <History className="w-4 h-4 text-emerald-400" />
                Access Audit Logs
              </button>

              {activeUserRole === 'senior' && (
                <button
                  id="btn-open-upload-modal"
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm md:text-base shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  Add Document
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Success / Alert Notice Banner */}
        {alertNotice && (
          <div
            id="vault-notification-banner"
            className={`p-4 rounded-2xl border flex items-start gap-3 text-sm md:text-base animate-fadeIn ${
              alertNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{alertNotice.message}</p>
            </div>
          </div>
        )}

        {/* Family Role Warning Banner (if viewing as carer) */}
        {activeUserRole === 'family' && (
          <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-950 flex items-start gap-3 text-sm">
            <Info className="w-5 h-5 text-indigo-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-900">
                Viewing as Linked Carer (David Jenkins)
              </p>
              <p className="text-indigo-800">
                You only see documents Margaret has explicitly shared with you. Every time you open or download a document, an immutable entry is logged in compliance with UK privacy standards.
              </p>
            </div>
          </div>
        )}

        {/* Expiring Soon Banner (8-week notice) */}
        {expiringSoonDocs.length > 0 && activeUserRole === 'senior' && (
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base md:text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-700 animate-bounce" />
              <span>
                {expiringSoonDocs.length} Document{expiringSoonDocs.length > 1 ? 's' : ''} Expiring or Due for Renewal in the next 8 weeks
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expiringSoonDocs.map((doc) => (
                <div
                  key={doc.docId}
                  className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-900 text-sm block truncate">
                      {doc.title}
                    </span>
                    <span className="text-xs text-amber-800 font-medium">
                      Expires: {doc.expiryDate}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex-shrink-0"
                  >
                    Check Policy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Category Filter Section */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-documents"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policy name, passport, council tax, or keyword..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm md:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
              />
            </div>

            <div className="text-xs md:text-sm text-slate-500 font-semibold flex items-center gap-1.5 self-end sm:self-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>
                Showing {filteredDocuments.length} of {documents.length} document{documents.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Category Chips Filter */}
          <DocumentCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={counts}
          />
        </div>

        {/* Document Grid / Empty State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-base font-semibold">Decrypting and loading documents...</span>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileLock2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No documents match your filter'
                  : 'Your Document Vault is Empty'}
              </h3>
              <p className="text-sm text-slate-600">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try clearing your search query or selecting a different category tab.'
                  : 'Add paper documents, passport photos, and home insurance policies to keep them safe and track renewals automatically.'}
              </p>
            </div>

            {activeUserRole === 'senior' && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.docId}
                document={doc}
                isOwner={activeUserRole === 'senior'}
                onView={(d) => setViewingDoc(d)}
                onShare={(d) => setSharingDoc(d)}
                onDelete={(d) => handleDelete(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        seniorUid={seniorUid}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaved={handleDocSaved}
      />

      {/* Viewer Modal */}
      <DocumentViewerModal
        document={viewingDoc}
        currentUser={activeUser}
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        onShare={(d) => {
          setViewingDoc(null);
          setSharingDoc(d);
        }}
      />

      {/* Family Sharing Modal */}
      <DocumentShareModal
        document={sharingDoc}
        seniorUid={seniorUid}
        isOpen={!!sharingDoc}
        onClose={() => setSharingDoc(null)}
        onUpdated={(updated) => {
          setDocuments((prev) => prev.map((d) => (d.docId === updated.docId ? updated : d)));
        }}
      />

      {/* Audit Logs Modal */}
      <AuditLogsModal
        seniorUid={seniorUid}
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />
    </div>
  );
};
