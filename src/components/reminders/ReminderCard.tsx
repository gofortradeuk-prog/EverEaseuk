import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Bell, 
  Mail, 
  MessageSquare, 
  Users, 
  MapPin, 
  FileText, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Gift,
  Wrench,
  Stethoscope,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ReminderRecord, ReminderType, ReminderChannel } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ReminderCardProps {
  reminder: ReminderRecord;
  onMarkDone: (reminderId: string) => void;
  onSnooze: (reminder: ReminderRecord) => void;
  onEdit: (reminder: ReminderRecord) => void;
  onDelete: (reminderId: string) => void;
  isPriorityDue?: boolean;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onMarkDone,
  onSnooze,
  onEdit,
  onDelete,
  isPriorityDue = false,
}) => {
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const isDone = reminder.status === 'done';
  const isSnoozed = reminder.status === 'snoozed';

  // Determine if created by family member
  const isCreatedByFamily =
    reminder.createdByRole === 'family' ||
    (reminder.createdByName && !reminder.createdByName.toLowerCase().includes('margaret') && reminder.createdByName !== 'You');

  const getTypeVisuals = (type: ReminderType) => {
    switch (type) {
      case 'appointment':
        return {
          icon: <Stethoscope className="w-5 h-5 text-indigo-700" />,
          bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-900',
          label: 'Appointment',
          badgeBg: 'bg-indigo-100 text-indigo-800',
        };
      case 'renewal':
        return {
          icon: <RefreshCw className="w-5 h-5 text-amber-700" />,
          bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
          label: 'Renewal / Deadline',
          badgeBg: 'bg-amber-100 text-amber-900',
        };
      case 'birthday':
        return {
          icon: <Gift className="w-5 h-5 text-rose-700" />,
          bgColor: 'bg-rose-50 border-rose-200 text-rose-900',
          label: 'Birthday / Celebration',
          badgeBg: 'bg-rose-100 text-rose-900',
        };
      case 'service':
        return {
          icon: <Wrench className="w-5 h-5 text-teal-700" />,
          bgColor: 'bg-teal-50 border-teal-200 text-teal-900',
          label: 'Home & Auto Service',
          badgeBg: 'bg-teal-100 text-teal-900',
        };
      default:
        return {
          icon: <Calendar className="w-5 h-5 text-slate-700" />,
          bgColor: 'bg-slate-50 border-slate-200 text-slate-900',
          label: 'Reminder',
          badgeBg: 'bg-slate-100 text-slate-800',
        };
    }
  };

  const visuals = getTypeVisuals(reminder.type);

  // Format date nicely (e.g. "Tuesday, 15 August 2026")
  const formatDateUK = (dateStr: string) => {
    try {
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const speechText = `Reminder: ${reminder.title}. Due date: ${formatDateUK(reminder.dueDate)}${reminder.time ? ` at ${reminder.time}` : ''}. ${reminder.location ? `Location: ${reminder.location}.` : ''} ${reminder.notes ? `Notes: ${reminder.notes}.` : ''} ${isCreatedByFamily ? `Added by ${reminder.createdByName}.` : ''}`;
      speakText(speechText);
    }
  };

  return (
    <div
      id={`reminder-card-${reminder.reminderId}`}
      className={`rounded-3xl border-2 transition-all p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4 relative ${
        isDone
          ? 'bg-slate-50/80 border-slate-200 opacity-75'
          : isPriorityDue
          ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-200/50'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Header: Category Badge, Recurrence & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${visuals.badgeBg}`}>
            {visuals.icon}
            <span>{visuals.label}</span>
          </span>

          {reminder.recurrence && reminder.recurrence !== 'none' && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold capitalize flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>Repeats {reminder.recurrence}</span>
            </span>
          )}
        </div>

        {/* Action icons (Read Aloud, Edit, Delete) */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleReadAloud}
            className="p-2 rounded-xl text-slate-500 hover:text-teal-800 hover:bg-slate-100 transition-colors"
            title="Read reminder out loud"
            aria-label="Read out loud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(reminder)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Edit reminder details"
            aria-label="Edit reminder"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(reminder.reminderId)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete reminder"
            aria-label="Delete reminder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Details: Title, Date, Time, Location */}
      <div className="space-y-2.5">
        <h4
          className={`text-lg sm:text-xl font-bold leading-snug ${
            isDone ? 'text-slate-500 line-through' : 'text-slate-900'
          }`}
        >
          {reminder.title}
        </h4>

        {/* Date & Time Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
            <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{formatDateUK(reminder.dueDate)}</span>
          </div>

          {reminder.time && (
            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{reminder.time}</span>
            </div>
          )}

          {isSnoozed && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-amber-700" />
              Snoozed
            </span>
          )}
        </div>

        {/* Optional Location */}
        {reminder.location && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 pl-1">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{reminder.location}</span>
          </div>
        )}

        {/* Optional Notes */}
        {reminder.notes && (
          <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 leading-relaxed">
            {reminder.notes}
          </div>
        )}
      </div>

      {/* Family Attribution Tag (Mandatory per specification) */}
      {isCreatedByFamily && (
        <div className="bg-amber-50/90 rounded-2xl p-3 border border-amber-200/90 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-xs sm:text-sm text-amber-950 font-bold">
            Added by {reminder.createdByName || 'Family Member'}
          </div>
        </div>
      )}

      {/* Footer: Notification Channels & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Delivery Channels */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Alerts:</span>
          {reminder.channel.includes('in_app') && (
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700" title="In-App Notification">
              <Bell className="w-3.5 h-3.5 text-teal-700" />
            </span>
          )}
          {reminder.channel.includes('sms') && (
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700" title="SMS Text Alert">
              <MessageSquare className="w-3.5 h-3.5 text-sky-700" />
            </span>
          )}
          {reminder.channel.includes('email') && (
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700" title="Email Alert">
              <Mail className="w-3.5 h-3.5 text-indigo-700" />
            </span>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {!isDone && (
            <button
              onClick={() => onSnooze(reminder)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Snooze</span>
            </button>
          )}

          <button
            onClick={() => onMarkDone(reminder.reminderId)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              isDone
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isDone ? 'Mark Upcoming' : 'Mark Done'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
