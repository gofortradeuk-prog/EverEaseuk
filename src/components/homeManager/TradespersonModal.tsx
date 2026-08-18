import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Wrench,
  Flame,
  Zap,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Star,
  UserCheck,
} from 'lucide-react';
import { TradespersonRecord } from '../../types';
import { saveTradesperson } from '../../lib/firestoreService';

interface Props {
  seniorUid: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (tp: TradespersonRecord) => void;
  editingTradesperson?: TradespersonRecord | null;
}

const COMMON_TRADES = [
  'Gas Safe Heating & Boiler Engineer',
  'NICEIC Approved Electrician',
  'Plumber & Drainage Specialist',
  'General Handyman & Locksmith',
  'Appliance Repair Technician',
  'Roofer & Gutter Cleaner',
  'Gardener & Outdoor Maintenance',
];

const PRELOADED_CONTACTS = [
  {
    name: 'Andy Miller Heating & Gas',
    trade: 'Gas Safe Heating & Boiler Engineer',
    phone: '07700 900481',
    notes: 'Gas Safe Registration Ref #512984. Installed the Worcester Bosch boiler. Very polite, knows our home setup.',
    isEmergency: true,
    rating: '5.0 ★ Highly Trusted',
    recommendedBy: 'Son (David Jenkins)',
  },
  {
    name: 'Clive Davies Electrical Services',
    trade: 'NICEIC Approved Electrician',
    phone: '0121 496 0882',
    notes: 'Part P certified domestic electrician. Upgraded the consumer unit and alarm batteries. 24/7 callout for power trips.',
    isEmergency: true,
    rating: '4.9 ★ Verified Local',
    recommendedBy: 'Age UK Trade Directory',
  },
  {
    name: 'David Evans (D&E Household Repairs)',
    trade: 'General Handyman & Locksmith',
    phone: '07700 900219',
    notes: 'Grab rails in bathroom, key cutting, window hinges, door locks, and minor carpentry. Fair fixed quotes.',
    isEmergency: false,
    rating: '5.0 ★ Local Recommendation',
    recommendedBy: 'Neighbourhood Watch',
  },
];

export const TradespersonModal: React.FC<Props> = ({
  seniorUid,
  isOpen,
  onClose,
  onSaved,
  editingTradesperson,
}) => {
  const [name, setName] = useState<string>('');
  const [trade, setTrade] = useState<string>('Gas Safe Heating & Boiler Engineer');
  const [customTrade, setCustomTrade] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [recommendedBy, setRecommendedBy] = useState<string>('');
  const [rating, setRating] = useState<string>('5.0 ★ Trusted');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingTradesperson) {
        setName(editingTradesperson.name);
        if (COMMON_TRADES.includes(editingTradesperson.trade)) {
          setTrade(editingTradesperson.trade);
          setCustomTrade('');
        } else {
          setTrade('other');
          setCustomTrade(editingTradesperson.trade);
        }
        setPhone(editingTradesperson.phone);
        setNotes(editingTradesperson.notes || '');
        setIsEmergency(Boolean(editingTradesperson.isEmergency));
        setRecommendedBy(editingTradesperson.recommendedBy || '');
        setRating(editingTradesperson.rating || '5.0 ★ Trusted');
      } else {
        setName('');
        setTrade('Gas Safe Heating & Boiler Engineer');
        setCustomTrade('');
        setPhone('');
        setNotes('');
        setIsEmergency(false);
        setRecommendedBy('');
        setRating('5.0 ★ Trusted');
      }
      setFormError(null);
    }
  }, [isOpen, editingTradesperson]);

  const handleApplyPreset = (preset: typeof PRELOADED_CONTACTS[0]) => {
    setName(preset.name);
    setTrade(preset.trade);
    setPhone(preset.phone);
    setNotes(preset.notes);
    setIsEmergency(preset.isEmergency);
    setRating(preset.rating);
    setRecommendedBy(preset.recommendedBy);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter the name of the tradesperson or business.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter a telephone or mobile number.');
      return;
    }

    const finalTrade = trade === 'other' ? customTrade.trim() : trade;
    if (!finalTrade) {
      setFormError('Please specify the trade or speciality.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const tradespersonId =
      editingTradesperson?.tradespersonId ||
      `tp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const tpToSave: TradespersonRecord = {
      tradespersonId,
      seniorUid,
      name: name.trim(),
      trade: finalTrade,
      phone: phone.trim(),
      notes: notes.trim() || undefined,
      isEmergency,
      rating: rating.trim() || undefined,
      recommendedBy: recommendedBy.trim() || undefined,
      createdAt: editingTradesperson?.createdAt || new Date().toISOString(),
    };

    const res = await saveTradesperson(tpToSave);

    setIsSaving(false);
    if (res.success) {
      onSaved(tpToSave);
      onClose();
    } else {
      setFormError(res.error || 'Failed to save tradesperson. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        id="tradesperson-modal"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {editingTradesperson ? 'Edit Trusted Tradesperson' : 'Add Trusted Tradesperson / Emergency Contact'}
              </h2>
              <p className="text-xs text-slate-300">
                Verified Gas Safe engineers, electricians, and local repair contacts.
              </p>
            </div>
          </div>
          <button
            id="btn-close-tradesperson-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 flex-1">
          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Preload Presets */}
          {!editingTradesperson && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Quick UK Presets (One-Click Pre-fill)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRELOADED_CONTACTS.map((preset, idx) => (
                  <button
                    key={idx}
                    id={`btn-preset-trades-${idx}`}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg shadow-xs transition-colors"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="tradesperson-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact / Business Name <span className="text-red-500">*</span>
            </label>
            <input
              id="tradesperson-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Andy Miller (Miller Heating & Plumbing)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Trade / Speciality */}
          <div>
            <label htmlFor="tradesperson-trade-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Trade / Speciality <span className="text-red-500">*</span>
            </label>
            <select
              id="tradesperson-trade-select"
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {COMMON_TRADES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="other">Other Trade / Custom Speciality</option>
            </select>

            {trade === 'other' && (
              <input
                type="text"
                value={customTrade}
                onChange={(e) => setCustomTrade(e.target.value)}
                placeholder="Specify trade (e.g. Window Glazier / Locksmith)"
                className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>

          {/* Telephone Number */}
          <div>
            <label htmlFor="tradesperson-phone-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Telephone / Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="tradesperson-phone-input"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 07700 900481 or 0121 496 0882"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* 24/7 Emergency Toggle */}
          <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="toggle-emergency"
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <label htmlFor="toggle-emergency" className="text-xs font-bold text-red-900 cursor-pointer flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Available for 24/7 Urgent Household Emergencies
              </label>
            </div>
            <span className="text-[11px] text-red-700 font-medium">Burst pipes, gas leaks, power outage</span>
          </div>

          {/* Recommended By & Rating Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tradesperson-rec-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Recommended By (Optional)
              </label>
              <input
                id="tradesperson-rec-input"
                type="text"
                value={recommendedBy}
                onChange={(e) => setRecommendedBy(e.target.value)}
                placeholder="e.g. Son David / Age UK"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="tradesperson-rating-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trust Badge / Rating
              </label>
              <input
                id="tradesperson-rating-input"
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="e.g. 5.0 ★ Highly Trusted"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Notes & Certification */}
          <div>
            <label htmlFor="tradesperson-notes-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes & Certifications (e.g. Gas Safe / NICEIC Registration)
            </label>
            <textarea
              id="tradesperson-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Gas Safe #512984. Installed the Worcester Bosch boiler. Clean, polite, and trusted by family."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-tradesperson"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-tradesperson"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Contact...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingTradesperson ? 'Save Contact' : 'Add to Trusted Contacts'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
