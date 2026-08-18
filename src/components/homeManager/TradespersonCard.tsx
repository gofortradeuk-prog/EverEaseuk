import React from 'react';
import {
  Phone,
  Wrench,
  Flame,
  Zap,
  ShieldAlert,
  Edit,
  Trash2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Star,
  UserCheck,
  Award,
} from 'lucide-react';
import { TradespersonRecord } from '../../types';

interface Props {
  tradesperson: TradespersonRecord;
  onEdit: (tp: TradespersonRecord) => void;
  onDelete: (tp: TradespersonRecord) => void;
  canEdit: boolean;
}

export const TradespersonCard: React.FC<Props> = ({
  tradesperson,
  onEdit,
  onDelete,
  canEdit,
}) => {
  // Helper to pick trade icon
  const getTradeIcon = (trade: string) => {
    const lower = trade.toLowerCase();
    if (lower.includes('gas') || lower.includes('heat') || lower.includes('boiler')) {
      return <Flame className="w-5 h-5 text-amber-600" />;
    }
    if (lower.includes('electr')) {
      return <Zap className="w-5 h-5 text-yellow-600" />;
    }
    if (lower.includes('plumb') || lower.includes('water')) {
      return <Wrench className="w-5 h-5 text-sky-600" />;
    }
    if (lower.includes('alarm') || lower.includes('lock') || lower.includes('secur')) {
      return <ShieldAlert className="w-5 h-5 text-emerald-600" />;
    }
    return <Wrench className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div
      id={`tradesperson-card-${tradesperson.tradespersonId}`}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Emergency Indicator */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
              {getTradeIcon(tradesperson.trade)}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                {tradesperson.trade}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {tradesperson.name}
              </h3>
            </div>
          </div>

          {tradesperson.isEmergency && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              24/7 Emergency
            </span>
          )}
        </div>

        {/* Big Click-to-Call Phone Button (Senior-friendly) */}
        <div className="mb-4">
          <a
            id={`btn-call-${tradesperson.tradespersonId}`}
            href={`tel:${tradesperson.phone.replace(/\s+/g, '')}`}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Call {tradesperson.phone}</span>
          </a>
        </div>

        {/* Verification & Recommendation Tag */}
        {(tradesperson.rating || tradesperson.recommendedBy) && (
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            {tradesperson.rating && (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {tradesperson.rating}
              </span>
            )}
            {tradesperson.recommendedBy && (
              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                Recommended by: {tradesperson.recommendedBy}
              </span>
            )}
          </div>
        )}

        {/* Notes & Certifications */}
        {tradesperson.notes && (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 p-3 rounded-lg leading-relaxed">
            <span className="font-semibold text-slate-700 block mb-0.5">Contact Notes & Reg Details:</span>
            <p className="line-clamp-3 text-slate-600">{tradesperson.notes}</p>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Local Contact</span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              id={`btn-edit-tradesperson-${tradesperson.tradespersonId}`}
              type="button"
              onClick={() => onEdit(tradesperson)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              id={`btn-delete-tradesperson-${tradesperson.tradespersonId}`}
              type="button"
              onClick={() => onDelete(tradesperson)}
              className="inline-flex items-center justify-center p-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              title="Delete contact"
              aria-label={`Delete ${tradesperson.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
