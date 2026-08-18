import React from 'react';
import {
  Flame,
  Wrench,
  ShieldCheck,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Phone,
  Sparkles,
  CheckCircle2,
  Tv,
  Bell,
  Eye,
  Camera,
} from 'lucide-react';
import { HomeAssetRecord, HomeAssetType } from '../../types';

interface Props {
  asset: HomeAssetRecord;
  onEdit: (asset: HomeAssetRecord) => void;
  onDelete: (asset: HomeAssetRecord) => void;
  onViewPhoto: (asset: HomeAssetRecord) => void;
  canEdit: boolean;
}

export const AssetCard: React.FC<Props> = ({
  asset,
  onEdit,
  onDelete,
  onViewPhoto,
  canEdit,
}) => {
  // Helper to format UK date
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Not recorded';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Helper for type icons & colors
  const getTypeBadge = (type: HomeAssetType) => {
    switch (type) {
      case 'boiler':
        return {
          label: 'Gas Boiler & Heating',
          icon: <Flame className="w-4 h-4 text-amber-600" />,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          accentBorder: 'border-l-4 border-l-amber-500',
        };
      case 'appliance':
        return {
          label: 'Home Appliance',
          icon: <Sparkles className="w-4 h-4 text-sky-600" />,
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          accentBorder: 'border-l-4 border-l-sky-500',
        };
      case 'alarm':
        return {
          label: 'Smoke & Safety Alarm',
          icon: <Bell className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accentBorder: 'border-l-4 border-l-emerald-500',
        };
      default:
        return {
          label: 'Household Asset',
          icon: <Wrench className="w-4 h-4 text-indigo-600" />,
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          accentBorder: 'border-l-4 border-l-indigo-500',
        };
    }
  };

  const badge = getTypeBadge(asset.type);

  // Compute status for next service
  const getServiceStatus = () => {
    if (!asset.nextServiceDate) {
      return {
        label: 'No service schedule set',
        color: 'text-slate-500 bg-slate-100 border-slate-200',
        isDueSoon: false,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const serviceDate = new Date(asset.nextServiceDate);
    const diffDays = Math.ceil((serviceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)} days!`,
        color: 'text-red-700 bg-red-50 border-red-200 font-semibold',
        isDueSoon: true,
      };
    } else if (diffDays <= 30) {
      return {
        label: `Due in ${diffDays} days (${formatDate(asset.nextServiceDate)})`,
        color: 'text-amber-800 bg-amber-50 border-amber-300 font-semibold',
        isDueSoon: true,
      };
    } else {
      return {
        label: `Next due: ${formatDate(asset.nextServiceDate)}`,
        color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        isDueSoon: false,
      };
    }
  };

  // Compute status for warranty
  const getWarrantyStatus = () => {
    if (!asset.warrantyExpiry) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(asset.warrantyExpiry);
    const isExpired = expDate.getTime() < today.getTime();

    return {
      label: isExpired ? 'Warranty Expired' : `Warranty Active (until ${formatDate(asset.warrantyExpiry)})`,
      isExpired,
      color: isExpired ? 'text-slate-600 bg-slate-100 border-slate-300' : 'text-teal-800 bg-teal-50 border-teal-200',
    };
  };

  const serviceStatus = getServiceStatus();
  const warrantyStatus = getWarrantyStatus();

  return (
    <div
      id={`asset-card-${asset.assetId}`}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between ${badge.accentBorder}`}
    >
      <div>
        {/* Header Badges & Type */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
          >
            {badge.icon}
            {badge.label}
          </span>

          {asset.serviceIntervalMonths ? (
            <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Every {asset.serviceIntervalMonths} Months
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {asset.name}
        </h3>

        {/* Visual photo snapshot if available */}
        {asset.photoUrl ? (
          <div className="mb-4 relative group">
            <button
              id={`btn-view-photo-${asset.assetId}`}
              type="button"
              onClick={() => onViewPhoto(asset)}
              className="w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <img
                src={asset.photoUrl}
                alt={asset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm">
                <Eye className="w-5 h-5" />
                <span>View Full Photo & Details</span>
              </div>
            </button>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate">
              <Camera className="w-3 h-3 text-slate-400" />
              <span>Storage path: {asset.photoStoragePath || 'Scoped to Senior Vault'}</span>
            </div>
          </div>
        ) : null}

        {/* Dates & Status Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Last Service / Check</span>
            <span className="text-slate-800 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(asset.lastServiceDate)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Service Schedule</span>
            <span className={`inline-block px-2 py-0.5 rounded border text-[11px] ${serviceStatus.color}`}>
              {serviceStatus.label}
            </span>
          </div>
        </div>

        {/* Warranty Status Banner */}
        {warrantyStatus && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border font-medium w-full ${warrantyStatus.color}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {warrantyStatus.label}
            </span>
          </div>
        )}

        {/* Notes / Engineer Details */}
        {asset.notes && (
          <div className="text-xs text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg mb-3">
            <span className="font-semibold text-slate-700 block mb-0.5">Notes & Engineer Details:</span>
            <p className="line-clamp-3 text-slate-600 leading-relaxed">{asset.notes}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Synced with Reminders</span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              id={`btn-edit-asset-${asset.assetId}`}
              type="button"
              onClick={() => onEdit(asset)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              id={`btn-delete-asset-${asset.assetId}`}
              type="button"
              onClick={() => onDelete(asset)}
              className="inline-flex items-center justify-center p-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              title="Delete asset"
              aria-label={`Delete ${asset.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
