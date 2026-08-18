import React, { useState } from 'react';
import { X, RotateCcw, Calendar, Clock, Check } from 'lucide-react';
import { ReminderRecord } from '../../types';

interface SnoozeModalProps {
  reminder: ReminderRecord;
  onClose: () => void;
  onConfirmSnooze: (reminderId: string, daysOrDate: number | string) => Promise<void>;
}

export const SnoozeModal: React.FC<SnoozeModalProps> = ({
  reminder,
  onClose,
  onConfirmSnooze,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | 'custom'>(1);
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSnooze = async () => {
    setIsSubmitting(true);
    try {
      if (selectedOption === 'custom') {
        await onConfirmSnooze(reminder.reminderId, customDate);
      } else {
        await onConfirmSnooze(reminder.reminderId, selectedOption);
      }
      onClose();
    } catch (err) {
      console.error('Error snoozing reminder:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="snooze-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-md w-full border-2 border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Snooze Reminder</h3>
              <p className="text-xs text-slate-300">Choose when to be reminded again</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">{reminder.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">Currently due: {reminder.dueDate}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Remind me in:
            </label>

            {/* Quick Option 1: 1 Day */}
            <button
              type="button"
              onClick={() => setSelectedOption(1)}
              className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
                selectedOption === 1
                  ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Tomorrow (+1 Day)</span>
              </div>
              {selectedOption === 1 && <Check className="w-4 h-4 text-amber-800" />}
            </button>

            {/* Quick Option 2: 3 Days */}
            <button
              type="button"
              onClick={() => setSelectedOption(3)}
              className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
                selectedOption === 3
                  ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>In 3 Days</span>
              </div>
              {selectedOption === 3 && <Check className="w-4 h-4 text-amber-800" />}
            </button>

            {/* Quick Option 3: 1 Week */}
            <button
              type="button"
              onClick={() => setSelectedOption(7)}
              className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
                selectedOption === 7
                  ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Next Week (+7 Days)</span>
              </div>
              {selectedOption === 7 && <Check className="w-4 h-4 text-amber-800" />}
            </button>

            {/* Custom Date */}
            <div
              onClick={() => setSelectedOption('custom')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                selectedOption === 'custom'
                  ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Choose Custom Date</span>
                </div>
                {selectedOption === 'custom' && <Check className="w-4 h-4 text-amber-800" />}
              </div>

              {selectedOption === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-slate-900 text-sm focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSnooze}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Snoozing...' : 'Confirm Snooze'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
