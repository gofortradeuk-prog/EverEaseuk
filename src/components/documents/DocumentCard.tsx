import React from 'react';
import { DocumentRecord, DocumentCategoryType } from '../../types';
import {
  FileText,
  Shield,
  Calendar,
  Users,
  Eye,
  Share2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileLock2,
  Clock,
} from 'lucide-react';

interface Props {
  document: DocumentRecord;
  isOwner: boolean;
  onView: (doc: DocumentRecord) => void;
  onShare: (doc: DocumentRecord) => void;
  onDelete: (doc: DocumentRecord) => void;
}

export const getCategoryMeta = (cat: string) => {
  switch (cat as DocumentCategoryType) {
    case 'identity_passport':
      return {
        label: 'Identity & Passport',
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        iconColor: 'text-indigo-600',
      };
    case 'home_insurance':
      return {
        label: 'Home & Insurance',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconColor: 'text-emerald-600',
      };
    case 'health_medical':
      return {
        label: 'Health & Medical',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        iconColor: 'text-rose-600',
      };
    case 'legal_financial':
      return {
        label: 'Legal & Financial',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        iconColor: 'text-amber-600',
      };
    case 'vehicle_driving':
      return {
        label: 'Vehicle & Driving',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        iconColor: 'text-blue-600',
      };
    case 'utilities_council':
      return {
        label: 'Utilities & Council',
        badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
        iconColor: 'text-teal-600',
      };
    default:
      return {
        label: 'Important Document',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        iconColor: 'text-slate-600',
      };
  }
};

export const DocumentCard: React.FC<Props> = ({
  document,
  isOwner,
  onView,
  onShare,
  onDelete,
}) => {
  const meta = getCategoryMeta(document.category);

  // Expiry calculation
  let expiryStatus: 'none' | 'valid' | 'expiring_soon' | 'expired' = 'none';
  let daysUntilExpiry: number | null = null;

  if (document.expiryDate) {
    const expDate = new Date(document.expiryDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
    daysUntilExpiry = diffDays;

    if (diffDays < 0) {
      expiryStatus = 'expired';
    } else if (diffDays <= 56) {
      // 8 weeks = 56 days
      expiryStatus = 'expiring_soon';
    } else {
      expiryStatus = 'valid';
    }
  }

  const formatUkDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id={`document-card-${document.docId}`}
      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header & Badges */}
      <div className="p-5 md:p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-bold border ${meta.badgeColor}`}
          >
            <Shield className={`w-3.5 h-3.5 ${meta.iconColor}`} />
            {meta.label}
          </span>

          {/* Expiry Badge */}
          {document.expiryDate ? (
            expiryStatus === 'expired' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Expired {formatUkDate(document.expiryDate)}
              </span>
            ) : expiryStatus === 'expiring_soon' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Renew Soon ({daysUntilExpiry} days)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Valid to {formatUkDate(document.expiryDate)}
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <FileLock2 className="w-3.5 h-3.5 text-slate-500" />
              Permanent Record
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug line-clamp-2">
          {document.title}
        </h3>

        {/* Summary or Notes */}
        {document.extractedData?.summary ? (
          <p className="text-sm md:text-base text-slate-600 line-clamp-2 leading-relaxed">
            {document.extractedData.summary}
          </p>
        ) : document.notes ? (
          <p className="text-sm md:text-base text-slate-600 line-clamp-2 leading-relaxed">
            {document.notes}
          </p>
        ) : null}

        {/* Issuer and storage pointer */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Added: {formatUkDate(document.uploadedAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {document.sharedWith.length === 0
                ? 'Private (Only you)'
                : `Shared with ${document.sharedWith.length} family member${document.sharedWith.length > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Storage path tag */}
        <div className="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate" title={document.storagePath}>
          🔒 Path: {document.storagePath}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50 p-3 md:p-4 border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          id={`btn-view-doc-${document.docId}`}
          onClick={() => onView(document)}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm md:text-base bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Document
        </button>

        {isOwner && (
          <>
            <button
              id={`btn-share-doc-${document.docId}`}
              onClick={() => onShare(document)}
              title="Family Sharing Controls"
              className="inline-flex items-center justify-center p-2.5 rounded-xl font-semibold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              id={`btn-delete-doc-${document.docId}`}
              onClick={() => onDelete(document)}
              title="Delete Document"
              className="inline-flex items-center justify-center p-2.5 rounded-xl font-semibold text-slate-500 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 shadow-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
