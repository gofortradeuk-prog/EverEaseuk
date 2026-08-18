import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Stethoscope, 
  RefreshCw, 
  Gift, 
  Wrench,
  Users
} from 'lucide-react';
import { ReminderRecord, ReminderType } from '../../types';
import { ReminderCard } from './ReminderCard';
import { categorizeDueDate } from '../../functions/reminderScheduler';

interface ReminderListViewProps {
  reminders: ReminderRecord[];
  onAddReminder: () => void;
  onMarkDone: (reminderId: string) => void;
  onSnooze: (reminder: ReminderRecord) => void;
  onEdit: (reminder: ReminderRecord) => void;
  onDelete: (reminderId: string) => void;
}

export const ReminderListView: React.FC<ReminderListViewProps> = ({
  reminders,
  onAddReminder,
  onMarkDone,
  onSnooze,
  onEdit,
  onDelete,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  // Filter reminders
  const filteredReminders = reminders.filter((rem) => {
    const matchesCategory = selectedCategory === 'all' || rem.type === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      rem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rem.location && rem.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rem.notes && rem.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rem.createdByName && rem.createdByName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const now = new Date();

  // Helper to check if a due date is within the next 7 days
  const isDueWithinThisWeek = (dateStr: string) => {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length < 3) return false;
    const due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = due.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  // Split reminders into groups
  const todayReminders = filteredReminders.filter(
    (r) => r.status !== 'done' && categorizeDueDate(r.dueDate, now) === 'today'
  );

  const thisWeekReminders = filteredReminders.filter(
    (r) =>
      r.status !== 'done' &&
      categorizeDueDate(r.dueDate, now) !== 'today' &&
      isDueWithinThisWeek(r.dueDate)
  );

  const laterReminders = filteredReminders.filter(
    (r) =>
      r.status !== 'done' &&
      categorizeDueDate(r.dueDate, now) !== 'today' &&
      !isDueWithinThisWeek(r.dueDate)
  );

  const completedReminders = filteredReminders.filter((r) => r.status === 'done');

  return (
    <div id="reminder-list-view" className="space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            All Items ({reminders.length})
          </button>

          <button
            onClick={() => setSelectedCategory('appointment')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'appointment'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-indigo-900 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Appointments</span>
          </button>

          <button
            onClick={() => setSelectedCategory('renewal')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'renewal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Renewals / MOT</span>
          </button>

          <button
            onClick={() => setSelectedCategory('birthday')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'birthday'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-900 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Birthdays</span>
          </button>

          <button
            onClick={() => setSelectedCategory('service')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'service'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-teal-900 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Services</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="reminder-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reminders..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-900 text-sm focus:border-teal-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* 1. HIGHLIGHTED TODAY'S ITEMS (MANDATORY REQUIREMENT) */}
      {todayReminders.length > 0 && (
        <section id="today-reminders-section" className="bg-amber-50/90 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                  Due Today
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 font-medium">
                  Priority items scheduled for today that need your attention.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-amber-200 text-amber-950 font-bold text-xs rounded-full uppercase tracking-wider">
              {todayReminders.length} Item{todayReminders.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {todayReminders.map((rem) => (
              <ReminderCard
                key={rem.reminderId}
                reminder={rem}
                onMarkDone={onMarkDone}
                onSnooze={onSnooze}
                onEdit={onEdit}
                onDelete={onDelete}
                isPriorityDue={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. HIGHLIGHTED THIS WEEK'S ITEMS (MANDATORY REQUIREMENT) */}
      {thisWeekReminders.length > 0 && (
        <section id="this-week-reminders-section" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <h3 className="text-xl font-bold text-slate-900">
                Coming Up This Week
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Next 7 days ({thisWeekReminders.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {thisWeekReminders.map((rem) => (
              <ReminderCard
                key={rem.reminderId}
                reminder={rem}
                onMarkDone={onMarkDone}
                onSnooze={onSnooze}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. LATER UPCOMING REMINDERS */}
      {laterReminders.length > 0 && (
        <section id="later-reminders-section" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-600" />
              <h3 className="text-xl font-bold text-slate-900">
                Upcoming Later
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Future schedule ({laterReminders.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {laterReminders.map((rem) => (
              <ReminderCard
                key={rem.reminderId}
                reminder={rem}
                onMarkDone={onMarkDone}
                onSnooze={onSnooze}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State when no upcoming items */}
      {todayReminders.length === 0 && thisWeekReminders.length === 0 && laterReminders.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-300 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
          <h4 className="text-xl font-bold text-slate-900">
            {searchQuery ? `No reminders matching "${searchQuery}"` : 'All caught up! No upcoming reminders'}
          </h4>
          <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
            Keep on top of GP appointments, vehicle MOTs, insurance renewals, and birthdays by scheduling your next reminder.
          </p>
          <div className="pt-2">
            <button
              onClick={onAddReminder}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Reminder</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. COMPLETED ITEMS ACCORDION */}
      {completedReminders.length > 0 && (
        <section id="completed-reminders-section" className="pt-6 border-t border-slate-200 space-y-4">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 transition-colors text-slate-700"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm sm:text-base">
                Completed Reminders ({completedReminders.length})
              </span>
            </div>
            {showCompleted ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showCompleted && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
              {completedReminders.map((rem) => (
                <ReminderCard
                  key={rem.reminderId}
                  reminder={rem}
                  onMarkDone={onMarkDone}
                  onSnooze={onSnooze}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
