import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Users,
  Stethoscope,
  RefreshCw,
  Gift,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { ReminderRecord, ReminderType } from '../../types';
import { ReminderCard } from './ReminderCard';

interface ReminderCalendarViewProps {
  reminders: ReminderRecord[];
  onAddReminderForDate: (dateStr: string) => void;
  onMarkDone: (reminderId: string) => void;
  onSnooze: (reminder: ReminderRecord) => void;
  onEdit: (reminder: ReminderRecord) => void;
  onDelete: (reminderId: string) => void;
}

export const ReminderCalendarView: React.FC<ReminderCalendarViewProps> = ({
  reminders,
  onAddReminderForDate,
  onMarkDone,
  onSnooze,
  onEdit,
  onDelete,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedDateStr(`${y}-${m}-${d}`);
  };

  // Month Title (e.g. "August 2026")
  const monthName = currentMonthDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  // Calendar Math
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon, ...
  // Convert so Monday is 0, Sunday is 6 (UK standard calendar)
  const startingDayIndex = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayObj = new Date();
  const todayFormattedStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  // Build calendar matrix cells
  const calendarCells: Array<{
    dayNumber: number | null;
    dateStr: string | null;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    dayReminders: ReminderRecord[];
  }> = [];

  // Previous month placeholder blanks
  for (let i = 0; i < startingDayIndex; i++) {
    calendarCells.push({
      dayNumber: null,
      dateStr: null,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      dayReminders: [],
    });
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayReminders = reminders.filter((r) => r.dueDate.split('T')[0] === dStr);
    const isToday = dStr === todayFormattedStr;
    const isSelected = dStr === selectedDateStr;

    calendarCells.push({
      dayNumber: day,
      dateStr: dStr,
      isCurrentMonth: true,
      isToday,
      isSelected,
      dayReminders,
    });
  }

  // Selected date's active reminders list
  const selectedDateReminders = reminders.filter(
    (r) => r.dueDate.split('T')[0] === selectedDateStr
  );

  const formatSelectedDateHeading = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getDotColorForType = (type: ReminderType) => {
    switch (type) {
      case 'appointment':
        return 'bg-indigo-600';
      case 'renewal':
        return 'bg-amber-500';
      case 'birthday':
        return 'bg-rose-500';
      case 'service':
        return 'bg-teal-600';
      default:
        return 'bg-slate-600';
    }
  };

  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div id="reminder-calendar-view" className="space-y-8">
      {/* Calendar Card Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Month Navigation & Today Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{monthName}</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Tap any day to see or add reminders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGoToToday}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors"
            >
              Today
            </button>
            <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1 border border-slate-200">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl hover:bg-white text-slate-700 hover:shadow-xs transition-all"
                title="Previous month"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl hover:bg-white text-slate-700 hover:shadow-xs transition-all"
                title="Next month"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 rounded-2xl p-3 border border-slate-200">
          <span className="text-slate-500 font-bold">Categories:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Appointment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Renewal / MOT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Birthday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span>Service</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs sm:text-sm text-slate-500 py-1">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Date Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell.isCurrentMonth || !cell.dateStr) {
                return (
                  <div
                    key={`blank_${idx}`}
                    className="min-h-[75px] sm:min-h-[90px] rounded-2xl bg-slate-50/50 border border-transparent"
                  />
                );
              }

              const hasReminders = cell.dayReminders.length > 0;
              const hasUpcoming = cell.dayReminders.some((r) => r.status !== 'done');

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => cell.dateStr && setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[75px] sm:min-h-[90px] p-2 rounded-2xl border-2 transition-all flex flex-col justify-between text-left group ${
                    cell.isSelected
                      ? 'border-teal-600 bg-teal-50/70 shadow-md ring-2 ring-teal-200'
                      : cell.isToday
                      ? 'border-amber-400 bg-amber-50/40 hover:border-amber-500'
                      : hasReminders
                      ? 'border-slate-300 bg-white hover:border-teal-400 hover:shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                        cell.isToday
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : cell.isSelected
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-800'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {cell.isToday && (
                      <span className="hidden sm:inline text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Reminder Category Indicator Dots or Chips */}
                  <div className="w-full space-y-1 mt-1">
                    {hasReminders && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {cell.dayReminders.slice(0, 3).map((r) => (
                          <span
                            key={r.reminderId}
                            className={`w-2 h-2 rounded-full ${getDotColorForType(r.type)} ${
                              r.status === 'done' ? 'opacity-40' : ''
                            }`}
                            title={`${r.title} (${r.type})`}
                          />
                        ))}
                        {cell.dayReminders.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-500">
                            +{cell.dayReminders.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {hasUpcoming && (
                      <div className="hidden sm:block truncate text-[11px] font-semibold text-slate-700">
                        {cell.dayReminders[0].title}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Agenda Detail Section */}
      <div id="selected-day-agenda" className="bg-slate-50 rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-700" />
              <h4 className="text-xl font-bold text-slate-900">
                Agenda for {formatSelectedDateHeading(selectedDateStr)}
              </h4>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              {selectedDateReminders.length} reminder{selectedDateReminders.length === 1 ? '' : 's'} scheduled for this day.
            </p>
          </div>

          <button
            onClick={() => onAddReminderForDate(selectedDateStr)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-sm shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder for this Day</span>
          </button>
        </div>

        {/* Reminders List for Selected Day */}
        {selectedDateReminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDateReminders.map((rem) => (
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
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h5 className="text-base font-bold text-slate-800">
              No reminders scheduled for this date
            </h5>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your schedule is completely clear on {formatSelectedDateHeading(selectedDateStr)}.
            </p>
            <button
              onClick={() => onAddReminderForDate(selectedDateStr)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-teal-800 font-bold text-xs sm:text-sm transition-colors border border-slate-200"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule something here</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
