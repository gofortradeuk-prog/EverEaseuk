import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ListFilter, 
  Plus, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Bell, 
  Users, 
  Stethoscope, 
  RefreshCw, 
  Gift, 
  Wrench,
  AlertCircle,
  Play,
  Server
} from 'lucide-react';
import { ReminderRecord, ReminderType } from '../../types';
import { 
  getRemindersForSenior, 
  subscribeRemindersForSenior, 
  createReminder, 
  updateReminder, 
  markReminderDone, 
  snoozeReminder, 
  deleteReminder,
  getInitialSeededReminders 
} from '../../lib/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { ReminderListView } from '../../components/reminders/ReminderListView';
import { ReminderCalendarView } from '../../components/reminders/ReminderCalendarView';
import { ReminderModal } from '../../components/reminders/ReminderModal';
import { SnoozeModal } from '../../components/reminders/SnoozeModal';
import { SchedulerTestModal } from '../../components/reminders/SchedulerTestModal';

interface Props {
  navigate: (route: string) => void;
}

export const RemindersPage: React.FC<Props> = ({ navigate }) => {
  const { userProfile, currentUser } = useAuth();
  const seniorUid = userProfile?.role === 'family' ? 'demo_senior_uid' : (currentUser?.uid || 'demo_senior_uid');

  const [reminders, setReminders] = useState<ReminderRecord[]>(() => getInitialSeededReminders(seniorUid));
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderRecord | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined);
  const [snoozingReminder, setSnoozingReminder] = useState<ReminderRecord | null>(null);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Real-time listener for reminders
  useEffect(() => {
    const unsubscribe = subscribeRemindersForSenior(
      seniorUid,
      (updatedReminders) => {
        setReminders(updatedReminders);
      },
      (err) => {
        console.warn('Subscription fallback to getReminders:', err);
        getRemindersForSenior(seniorUid).then(setReminders);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [seniorUid]);

  // Handler: Save (Create or Update)
  const handleSaveReminder = async (reminder: ReminderRecord) => {
    const existingIdx = reminders.findIndex((r) => r.reminderId === reminder.reminderId);
    if (existingIdx >= 0) {
      await updateReminder(reminder.reminderId, reminder);
      setReminders((prev) => prev.map((r) => (r.reminderId === reminder.reminderId ? reminder : r)));
      showToast(`Updated "${reminder.title}"`);
    } else {
      await createReminder(reminder);
      setReminders((prev) => [reminder, ...prev]);
      showToast(`Added new reminder: "${reminder.title}"`);
    }
  };

  // Handler: Mark Done / Toggle
  const handleMarkDone = async (reminderId: string) => {
    const target = reminders.find((r) => r.reminderId === reminderId);
    if (!target) return;

    const newStatus = target.status === 'done' ? 'upcoming' : 'done';
    await updateReminder(reminderId, { status: newStatus });
    setReminders((prev) =>
      prev.map((r) => (r.reminderId === reminderId ? { ...r, status: newStatus } : r))
    );
    showToast(newStatus === 'done' ? `Marked "${target.title}" as completed!` : `Marked "${target.title}" as upcoming`);
  };

  // Handler: Confirm Snooze
  const handleConfirmSnooze = async (reminderId: string, daysOrDate: number | string) => {
    if (typeof daysOrDate === 'number') {
      await snoozeReminder(reminderId, daysOrDate);
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + daysOrDate);
      const dStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
      setReminders((prev) =>
        prev.map((r) =>
          r.reminderId === reminderId ? { ...r, status: 'snoozed', dueDate: dStr } : r
        )
      );
    } else {
      await updateReminder(reminderId, { status: 'snoozed', dueDate: daysOrDate });
      setReminders((prev) =>
        prev.map((r) =>
          r.reminderId === reminderId ? { ...r, status: 'snoozed', dueDate: daysOrDate } : r
        )
      );
    }
    showToast('Reminder snoozed successfully.');
  };

  // Handler: Delete
  const handleDelete = async (reminderId: string) => {
    const target = reminders.find((r) => r.reminderId === reminderId);
    if (!target) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete "${target.title}"?`);
    if (!confirmDelete) return;

    await deleteReminder(reminderId);
    setReminders((prev) => prev.filter((r) => r.reminderId !== reminderId));
    showToast(`Deleted "${target.title}"`);
  };

  // Handler: Edit
  const handleEdit = (reminder: ReminderRecord) => {
    setEditingReminder(reminder);
    setPrefilledDate(undefined);
    setIsAddModalOpen(true);
  };

  // Handler: Add for Specific Calendar Date
  const handleAddForDate = (dateStr: string) => {
    setEditingReminder(null);
    setPrefilledDate(dateStr);
    setIsAddModalOpen(true);
  };

  // Count active stats
  const activeCount = reminders.filter((r) => r.status !== 'done').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayCount = reminders.filter((r) => r.status !== 'done' && r.dueDate.split('T')[0] === todayStr).length;

  return (
    <div id="reminders-page" className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div 
          id="reminder-toast-alert"
          className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-slideIn"
        >
          <CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0" />
          <p className="text-sm sm:text-base font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-8 sm:py-10 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <button
              id="back-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Cloud Scheduler Job Inspector Button */}
            <button
              id="cloud-scheduler-test-btn"
              onClick={() => setIsSchedulerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-semibold transition-colors"
              title="Inspect the daily Cloud Scheduler Cloud Function"
            >
              <Server className="w-3.5 h-3.5 text-teal-300" />
              <span>Daily Cloud Scheduler</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/30 flex items-center justify-center border border-teal-400/40">
                  <CalendarIcon className="w-7 h-7 text-teal-200" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    Life Reminders & Appointments
                  </h1>
                  <p className="text-teal-200 text-base sm:text-lg font-medium">
                    GP visits, vehicle MOTs, insurance renewals, and birthdays
                  </p>
                </div>
              </div>
              <p className="text-teal-100 text-base sm:text-lg max-w-2xl leading-relaxed">
                Stay organised with clear reminders sent by in-app alert, SMS text, or email. Linked family members can also add reminders directly to your calendar.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 min-w-[240px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200">Active Schedule</span>
                <span className="text-xs font-bold text-amber-300">
                  {dueTodayCount > 0 ? `${dueTodayCount} Due Today` : 'Up to date'}
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {activeCount} Upcoming
              </div>
              <p className="text-xs text-teal-100">
                Multi-channel notifications active (In-App • SMS • Email)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-8 flex-1 w-full">
        {/* Controls Toolbar: View Toggle & Add Button */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* List vs Calendar Toggle */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
            <button
              id="reminders-toggle-list-view-btn"
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-4 h-4 text-teal-700" />
              <span>List View</span>
            </button>

            <button
              id="reminders-toggle-calendar-view-btn"
              onClick={() => setViewMode('calendar')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-teal-700" />
              <span>Monthly Calendar</span>
            </button>
          </div>

          {/* Add Reminder CTA Button */}
          <div className="flex items-center gap-3">
            <button
              id="add-reminder-primary-btn"
              onClick={() => {
                setEditingReminder(null);
                setPrefilledDate(undefined);
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-md transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add a Reminder</span>
            </button>
          </div>
        </div>

        {/* View Mode Switching */}
        {viewMode === 'list' ? (
          <ReminderListView
            reminders={reminders}
            onAddReminder={() => {
              setEditingReminder(null);
              setPrefilledDate(undefined);
              setIsAddModalOpen(true);
            }}
            onMarkDone={handleMarkDone}
            onSnooze={(rem) => setSnoozingReminder(rem)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ReminderCalendarView
            reminders={reminders}
            onAddReminderForDate={handleAddForDate}
            onMarkDone={handleMarkDone}
            onSnooze={(rem) => setSnoozingReminder(rem)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <ReminderModal
          initialReminder={editingReminder}
          defaultDate={prefilledDate}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingReminder(null);
            setPrefilledDate(undefined);
          }}
          onSave={handleSaveReminder}
        />
      )}

      {/* Snooze Modal */}
      {snoozingReminder && (
        <SnoozeModal
          reminder={snoozingReminder}
          onClose={() => setSnoozingReminder(null)}
          onConfirmSnooze={handleConfirmSnooze}
        />
      )}

      {/* Cloud Scheduler Job Live Inspector Modal */}
      {isSchedulerModalOpen && (
        <SchedulerTestModal
          reminders={reminders}
          onClose={() => setIsSchedulerModalOpen(false)}
          onRefreshReminders={() => getRemindersForSenior(seniorUid).then(setReminders)}
        />
      )}
    </div>
  );
};
