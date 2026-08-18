import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Bell, 
  Mail, 
  MessageSquare, 
  RotateCcw, 
  MapPin, 
  FileText, 
  Sparkles, 
  Check, 
  Stethoscope, 
  RefreshCw, 
  Gift, 
  Wrench,
  Users,
  AlertCircle
} from 'lucide-react';
import { 
  ReminderRecord, 
  ReminderType, 
  ReminderRecurrence, 
  ReminderChannel, 
  ReminderStatus 
} from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ReminderModalProps {
  initialReminder?: ReminderRecord | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (reminder: ReminderRecord) => Promise<void>;
}

const QUICK_SUGGESTIONS = [
  { title: 'GP Practice Appointment', type: 'appointment' as ReminderType },
  { title: 'Dentist Check-up & Polish', type: 'appointment' as ReminderType },
  { title: 'Optician Eye Test', type: 'appointment' as ReminderType },
  { title: 'Car MOT & Annual Service', type: 'renewal' as ReminderType },
  { title: 'Car Tax / Vehicle Excise Duty', type: 'renewal' as ReminderType },
  { title: 'Home & Contents Insurance Renewal', type: 'renewal' as ReminderType },
  { title: 'TV Licence Annual Payment', type: 'renewal' as ReminderType },
  { title: 'Gas Boiler Annual Safety Service', type: 'service' as ReminderType },
  { title: 'Chimney Sweep / Roof Gutter Check', type: 'service' as ReminderType },
  { title: "Grandchild's Birthday Celebration", type: 'birthday' as ReminderType },
];

export const ReminderModal: React.FC<ReminderModalProps> = ({
  initialReminder,
  defaultDate,
  onClose,
  onSave,
}) => {
  const { userProfile, currentUser } = useAuth();
  const isEditing = !!initialReminder;

  // Calculate default tomorrow or selected date string (YYYY-MM-DD)
  const getInitialDueDate = () => {
    if (initialReminder?.dueDate) {
      return initialReminder.dueDate.split('T')[0];
    }
    if (defaultDate) {
      return defaultDate.split('T')[0];
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [type, setType] = useState<ReminderType>(initialReminder?.type || 'appointment');
  const [title, setTitle] = useState(initialReminder?.title || '');
  const [dueDate, setDueDate] = useState(getInitialDueDate());
  const [time, setTime] = useState(initialReminder?.time || '10:00');
  const [recurrence, setRecurrence] = useState<ReminderRecurrence>(initialReminder?.recurrence || 'none');
  const [channels, setChannels] = useState<ReminderChannel[]>(
    initialReminder?.channel || ['in_app', 'sms']
  );
  const [location, setLocation] = useState(initialReminder?.location || '');
  const [notes, setNotes] = useState(initialReminder?.notes || '');
  const [status, setStatus] = useState<ReminderStatus>(initialReminder?.status || 'upcoming');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Toggle delivery channels
  const toggleChannel = (ch: ReminderChannel) => {
    if (channels.includes(ch)) {
      if (channels.length === 1) {
        // Must keep at least one channel
        return;
      }
      setChannels(channels.filter((c) => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please give your reminder a title (e.g. GP Doctor Appointment).');
      return;
    }
    if (!dueDate) {
      setValidationError('Please select a due date.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      const seniorUid = userProfile?.role === 'family' ? 'demo_senior_uid' : (currentUser?.uid || 'demo_senior_uid');
      const creatorUid = currentUser?.uid || 'demo_senior_uid';
      const creatorName = userProfile?.displayName || 'Margaret';
      const creatorRole = userProfile?.role || 'senior';

      const reminderRecord: ReminderRecord = {
        reminderId: initialReminder?.reminderId || `rem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        seniorUid,
        type,
        title: title.trim(),
        dueDate,
        time: time || undefined,
        recurrence,
        channel: channels,
        status,
        createdBy: initialReminder?.createdBy || creatorUid,
        createdByName: initialReminder?.createdByName || (creatorRole === 'family' ? `${creatorName} (Family Carer)` : creatorName),
        createdByRole: initialReminder?.createdByRole || (creatorRole === 'family' ? 'family' : 'senior'),
        createdAt: initialReminder?.createdAt || new Date().toISOString(),
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      await onSave(reminderRecord);
      onClose();
    } catch (err: any) {
      console.error('Failed to save reminder:', err);
      setValidationError(err?.message || 'Failed to save reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="reminder-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="reminder-modal-content"
        className="bg-white rounded-3xl max-w-2xl w-full border-2 border-slate-200 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Life Reminder' : 'Add a New Life Reminder'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Appointments, renewals, birthdays, and household services.
              </p>
            </div>
          </div>

          <button
            id="close-reminder-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Category / Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              Reminder Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setType('appointment')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  type === 'appointment'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <Stethoscope className={`w-5 h-5 ${type === 'appointment' ? 'text-indigo-700' : 'text-slate-500'}`} />
                <span className="text-xs sm:text-sm">Appointment</span>
              </button>

              <button
                type="button"
                onClick={() => setType('renewal')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  type === 'renewal'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${type === 'renewal' ? 'text-amber-700' : 'text-slate-500'}`} />
                <span className="text-xs sm:text-sm">Renewal / MOT</span>
              </button>

              <button
                type="button"
                onClick={() => setType('birthday')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  type === 'birthday'
                    ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <Gift className={`w-5 h-5 ${type === 'birthday' ? 'text-rose-700' : 'text-slate-500'}`} />
                <span className="text-xs sm:text-sm">Birthday</span>
              </button>

              <button
                type="button"
                onClick={() => setType('service')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  type === 'service'
                    ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <Wrench className={`w-5 h-5 ${type === 'service' ? 'text-teal-700' : 'text-slate-500'}`} />
                <span className="text-xs sm:text-sm">Home Service</span>
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          {!isEditing && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">Quick suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.slice(0, 5).map((sugg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(sugg.title);
                      setType(sugg.type);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    + {sugg.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Title Field */}
          <div className="space-y-1.5">
            <label htmlFor="reminder-title-input" className="block text-sm font-bold text-slate-900">
              Reminder Title <span className="text-rose-600">*</span>
            </label>
            <input
              id="reminder-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GP Nurse Blood Pressure Check, Car MOT, Oliver's Birthday..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 text-base focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              required
            />
          </div>

          {/* 3. Due Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="reminder-due-date" className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>Due Date <span className="text-rose-600">*</span></span>
              </label>
              <input
                id="reminder-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 text-base focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reminder-time" className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Time (Optional)</span>
              </label>
              <input
                id="reminder-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 text-base focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* 4. Recurrence Selector */}
          <div className="space-y-1.5">
            <label htmlFor="reminder-recurrence" className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-teal-700" />
              <span>Does this repeat?</span>
            </label>
            <select
              id="reminder-recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as ReminderRecurrence)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 text-base focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
            >
              <option value="none">Does not repeat (One-off)</option>
              <option value="weekly">Every Week</option>
              <option value="monthly">Every Month</option>
              <option value="yearly">Every Year (e.g. MOT, Birthdays, Annual Service)</option>
            </select>
          </div>

          {/* 5. Delivery Channels Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              How would you like to be notified?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* In-App */}
              <button
                type="button"
                onClick={() => toggleChannel('in_app')}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  channels.includes('in_app')
                    ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${channels.includes('in_app') ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}>
                  {channels.includes('in_app') ? <Check className="w-4 h-4" /> : <Bell className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left text-xs sm:text-sm">
                  <div>In-App Banner</div>
                  <div className="text-[11px] opacity-75">On home screen</div>
                </div>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={() => toggleChannel('sms')}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  channels.includes('sms')
                    ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${channels.includes('sms') ? 'bg-sky-700 text-white' : 'bg-slate-200'}`}>
                  {channels.includes('sms') ? <Check className="w-4 h-4" /> : <MessageSquare className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left text-xs sm:text-sm">
                  <div>Text Message (SMS)</div>
                  <div className="text-[11px] opacity-75">Direct to mobile</div>
                </div>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => toggleChannel('email')}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  channels.includes('email')
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${channels.includes('email') ? 'bg-indigo-700 text-white' : 'bg-slate-200'}`}>
                  {channels.includes('email') ? <Check className="w-4 h-4" /> : <Mail className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left text-xs sm:text-sm">
                  <div>Email Notice</div>
                  <div className="text-[11px] opacity-75">Inbox copy</div>
                </div>
              </button>
            </div>
          </div>

          {/* 6. Optional Location & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="reminder-location" className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Location (Optional)</span>
              </label>
              <input
                id="reminder-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 4, High Street Surgery"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 text-sm focus:border-teal-600 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reminder-notes" className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Notes / Preparation (Optional)</span>
              </label>
              <input
                id="reminder-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bring reading glasses and medication list"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 text-sm focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Carer Attribution Indicator if logged in as family */}
          {userProfile?.role === 'family' && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-800 shrink-0" />
              <p className="text-xs sm:text-sm text-amber-900">
                You are adding this reminder as <strong>{userProfile.displayName} (Family Carer)</strong>. It will be visibly marked so Margaret knows you arranged it.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              id="cancel-reminder-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base transition-colors"
            >
              Cancel
            </button>

            <button
              id="save-reminder-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Reminder' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
