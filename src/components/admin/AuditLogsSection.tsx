import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  Clock, 
  Tag, 
  ChevronDown, 
  ChevronRight,
  Code
} from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogsSectionProps {
  logs: AuditLog[];
  loading: boolean;
  onRefresh: () => void;
}

export const AuditLogsSection: React.FC<AuditLogsSectionProps> = ({
  logs,
  loading,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = 
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actorUid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.targetUid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(l.details || {}).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('IMPERSONATION')) {
      return 'bg-purple-100 text-purple-900 border-purple-300';
    }
    if (action.includes('GUIDE')) {
      return 'bg-blue-100 text-blue-900 border-blue-300';
    }
    if (action.includes('TICKET') || action.includes('SUPPORT')) {
      return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    }
    if (action.includes('SCAM') || action.includes('BLOCKED')) {
      return 'bg-rose-100 text-rose-900 border-rose-300';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="space-y-6" id="admin-audit-logs-section">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" />
              <span>Immutable System & Safeguarding Audit Log</span>
            </h2>
            <p className="text-sm text-slate-500">
              Zero-trust audit trail recording support impersonation sessions, guide modifications, and ticket resolutions.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1 text-xs font-bold"
            title="Refresh audit logs"
            id="refresh-audit-logs-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search audit trail by action (e.g. IMPERSONATION), actor UID, or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-400 transition-all"
            id="admin-audit-search-input"
          />
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold">
              No audit log entries found matching "{searchQuery}".
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.logId;

              return (
                <div key={log.logId} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        Resource: <strong className="text-slate-800">{log.targetResource}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleString('en-GB')}
                      </span>
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.logId)}
                        className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-0.5 cursor-pointer ml-2"
                      >
                        <span>{isExpanded ? 'Hide Payload' : 'View Payload'}</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-400">Actor UID:</span> <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">{log.actorUid}</code>
                    </p>
                    {log.targetUid && (
                      <p>
                        <span className="font-semibold text-slate-400">Target UID:</span> <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">{log.targetUid}</code>
                      </p>
                    )}
                  </div>

                  {/* Expanded JSON Details */}
                  {isExpanded && log.details && (
                    <div className="mt-2 p-3 bg-slate-900 text-amber-300 rounded-2xl font-mono text-xs overflow-x-auto">
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
