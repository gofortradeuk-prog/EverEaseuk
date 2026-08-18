import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Clock, 
  Bell, 
  MessageSquare, 
  Mail, 
  AlertCircle, 
  Sparkles,
  Terminal,
  Server
} from 'lucide-react';
import { ReminderRecord } from '../../types';
import { ScheduledExecutionResult } from '../../functions/reminderScheduler';

interface SchedulerTestModalProps {
  reminders: ReminderRecord[];
  onClose: () => void;
  onRefreshReminders: () => void;
}

export const SchedulerTestModal: React.FC<SchedulerTestModalProps> = ({
  reminders,
  onClose,
  onRefreshReminders,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ScheduledExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunScheduler = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/scheduler/check-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminders }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data.result);
      onRefreshReminders();
    } catch (err: any) {
      console.error('Error executing scheduler test:', err);
      setError(err?.message || 'Failed to execute Cloud Scheduler trigger.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      id="scheduler-test-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <Server className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Daily Cloud Scheduler Job Simulation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Trigger: Cloud Scheduler (Daily 08:00 UK Time cron)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="bg-teal-50 rounded-2xl p-5 border border-teal-200 space-y-2">
            <div className="flex items-center gap-2 text-teal-950 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>How this Cloud Function works</span>
            </div>
            <p className="text-xs sm:text-sm text-teal-900 leading-relaxed">
              Every morning at 08:00, Google Cloud Scheduler triggers this function to scan all active reminders for dates due <strong>Today</strong> or <strong>Tomorrow</strong>. It generates high-priority in-app alerts and dispatches stub SMS and Email notifications.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Trigger Button */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                Active reminders in memory: {reminders.filter((r) => r.status !== 'done').length}
              </div>
              <div className="text-xs text-slate-500">
                Test the Cloud Function right now with your current reminder schedule.
              </div>
            </div>

            <button
              onClick={handleRunScheduler}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-sm shadow-xs transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running Job...' : 'Run Scheduled Check'}</span>
            </button>
          </div>

          {/* Execution Results */}
          {result && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Job Execution Report</span>
              </h4>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-slate-900">{result.checkedCount}</div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Checked</div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-center">
                  <div className="text-2xl font-black text-amber-900">{result.dueTodayCount}</div>
                  <div className="text-[11px] font-bold text-amber-800 uppercase">Due Today</div>
                </div>

                <div className="bg-teal-50 rounded-2xl p-3.5 border border-teal-200 text-center">
                  <div className="text-2xl font-black text-teal-900">{result.dueTomorrowCount}</div>
                  <div className="text-[11px] font-bold text-teal-800 uppercase">Due Tomorrow</div>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-3.5 border border-indigo-200 text-center">
                  <div className="text-2xl font-black text-indigo-900">{result.notificationsCreated}</div>
                  <div className="text-[11px] font-bold text-indigo-800 uppercase">In-App Alerts</div>
                </div>
              </div>

              {/* Delivery Channels Dispatches */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-bold border-b border-slate-800 pb-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Channel Dispatch Logs (Cloud Function Console)</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span>SMS Dispatch Stubs Called: {result.smsDispatchesTriggered}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Email Dispatch Stubs Called: {result.emailDispatchesTriggered}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>In-App Notifications Recorded: {result.notificationsCreated}</span>
                  </div>
                </div>
              </div>

              {/* Processed Reminders List */}
              {result.processedReminders.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Reminders Triggering Notifications:
                  </div>
                  <div className="space-y-2">
                    {result.processedReminders.map((r, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{r.title}</div>
                          <div className="text-xs text-slate-500">
                            Due: {r.dueDate} ({r.isToday ? 'TODAY' : 'TOMORROW'})
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-teal-800">
                          {r.channels.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl text-center">
                  No reminders were due today or tomorrow. No notifications needed at this time.
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
