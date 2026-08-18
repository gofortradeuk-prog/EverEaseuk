import React from 'react';
import { X, Camera, Calendar, ShieldCheck, Clock, Flame, Wrench, Sparkles, Bell } from 'lucide-react';
import { HomeAssetRecord } from '../../types';

interface Props {
  asset: HomeAssetRecord | null;
  onClose: () => void;
}

export const PhotoViewerModal: React.FC<Props> = ({ asset, onClose }) => {
  if (!asset || !asset.photoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="photo-viewer-modal"
        className="bg-slate-900 text-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{asset.name}</h3>
            <p className="text-xs text-slate-400">Photo / Rating Plate Reference</p>
          </div>
          <button
            id="btn-close-photo-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Display */}
        <div className="p-6 flex-1 flex items-center justify-center bg-black/60 overflow-hidden min-h-[300px]">
          <img
            src={asset.photoUrl}
            alt={asset.name}
            referrerPolicy="no-referrer"
            className="max-h-[50vh] max-w-full object-contain rounded-lg border border-slate-800 shadow-lg"
          />
        </div>

        {/* Footer Details */}
        <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block font-medium">Storage Path</span>
            <span className="text-slate-200 font-mono truncate block">{asset.photoStoragePath || 'Scoped to seniorUid'}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">Next Service Date</span>
            <span className="text-emerald-400 font-semibold block">{asset.nextServiceDate || 'Not scheduled'}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">Warranty Expiry</span>
            <span className="text-teal-400 font-semibold block">{asset.warrantyExpiry || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
