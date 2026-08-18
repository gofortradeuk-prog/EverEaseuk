import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  Calendar,
  Shield,
  FileText,
  Lock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  History,
} from 'lucide-react';
import { DocumentRecord, UserRecord } from '../../types';
import { getCategoryMeta } from './DocumentCard';
import { logDocumentAccess } from '../../lib/firestoreService';

interface Props {
  document: DocumentRecord | null;
  currentUser: UserRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (doc: DocumentRecord) => void;
}

export const DocumentViewerModal: React.FC<Props> = ({
  document,
  currentUser,
  isOpen,
  onClose,
  onShare,
}) => {
  const [loggedAudit, setLoggedAudit] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && document && currentUser) {
      // Non-owner viewing triggers required audit log
      if (currentUser.uid !== document.seniorUid) {
        logDocumentAccess(
          document.docId,
          document.seniorUid,
          currentUser.uid,
          document.title,
          currentUser.displayName || currentUser.email,
          currentUser.role,
          'view_document'
        );
        setLoggedAudit(true);
      } else {
        setLoggedAudit(false);
      }
    }
  }, [isOpen, document, currentUser]);

  if (!isOpen || !document) return null;

  const meta = getCategoryMeta(document.category);
  const isOwner = currentUser?.uid === document.seniorUid;

  const handleDownload = () => {
    if (!isOwner && currentUser) {
      logDocumentAccess(
        document.docId,
        document.seniorUid,
        currentUser.uid,
        document.title,
        currentUser.displayName || currentUser.email,
        currentUser.role,
        'download_document'
      );
    }

    if (document.downloadUrl) {
      const a = window.document.createElement('a');
      a.href = document.downloadUrl;
      a.download = document.fileName || `${document.title}.jpg`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      window.print();
    }
  };

  const formatUkDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id="document-viewer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 md:p-6 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 truncate">
            <span
              className={`p-2 rounded-xl border ${meta.badgeColor} flex-shrink-0`}
            >
              <Shield className={`w-5 h-5 ${meta.iconColor}`} />
            </span>
            <div className="truncate">
              <h2 className="text-lg md:text-xl font-bold text-white truncate">
                {document.title}
              </h2>
              <span className="text-xs text-slate-400">
                {meta.label} • Uploaded {formatUkDate(document.uploadedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="hidden sm:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close document viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Non-Owner Security Audit Log Banner */}
        {loggedAudit && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-blue-900 flex-shrink-0">
            <History className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span>
              Security Audit: View logged for Carer <strong>{currentUser?.displayName || 'Family Member'}</strong> in EverEase access logs.
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Expiry / Renewal
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm md:text-base">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {document.expiryDate ? (
                  formatUkDate(document.expiryDate)
                ) : (
                  <span className="text-slate-500 font-normal">Permanent Document</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Sharing Access
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm md:text-base">
                <Users className="w-4 h-4 text-indigo-700" />
                {document.sharedWith.length === 0
                  ? 'Private (Owner Only)'
                  : `Shared with ${document.sharedWith.length} carer(s)`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Storage Pointer
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 truncate" title={document.storagePath}>
                <Lock className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span className="truncate">{document.storagePath}</span>
              </div>
            </div>
          </div>

          {/* AI Summary / Notes */}
          {(document.extractedData?.summary || document.notes) && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Document Summary & Notes
              </span>
              <p className="text-sm md:text-base text-slate-800 leading-relaxed">
                {document.extractedData?.summary || document.notes}
              </p>
              {document.extractedData?.issuerOrOrganisation && (
                <p className="text-xs font-semibold text-emerald-800 pt-1">
                  Issuing Authority / Company: {document.extractedData.issuerOrOrganisation}
                </p>
              )}
            </div>
          )}

          {/* Document Preview Canvas/Image */}
          <div className="rounded-2xl border-2 border-slate-200 bg-slate-100 p-4 min-h-[300px] flex items-center justify-center overflow-hidden">
            {document.downloadUrl ? (
              <img
                src={document.downloadUrl}
                alt={document.title}
                className="max-h-[500px] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <FileText className="w-16 h-16 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-lg">
                    {document.fileName || `${document.title}.pdf`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Encrypted file stored under Cloud Storage pointer: {document.storagePath}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 md:p-5 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          {isOwner ? (
            <button
              onClick={() => {
                onClose();
                onShare(document);
              }}
              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-sm inline-flex items-center gap-2 shadow-sm"
            >
              <Users className="w-4 h-4" />
              Manage Family Access
            </button>
          ) : (
            <span className="text-xs text-slate-500">
              Viewing as linked family carer
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm inline-flex items-center gap-2 shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
