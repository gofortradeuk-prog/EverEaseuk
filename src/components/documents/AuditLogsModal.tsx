import React, { useEffect, useState } from 'react';
import {
  X,
  History,
  ShieldCheck,
  Eye,
  Download,
  Calendar,
  User,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { AuditLog } from '../../types';
import { getAuditLogsForTarget } from '../../lib/firestoreService';

interface Props {
  seniorUid: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<Props> = ({
  seniorUid,
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await getAuditLogsForTarget(seniorUid);
        setLogs(data);
      } catch (err) {
        console.warn('Could not fetch audit logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [isOpen, seniorUid]);

  if (!isOpen) return null;

  const formatUkDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id="document-audit-logs-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 md:p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Document Access Audit Trail</h2>
              <p className="text-xs text-slate-400">
                Immutable compliance log of family carer views & downloads
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

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>
              Every access event by linked carers is recorded with an exact timestamp to protect senior privacy.
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-xs">Loading audit entries...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Lock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-sm text-slate-700">No external accesses recorded yet</p>
              <p className="text-xs max-w-sm mx-auto">
                When a linked family member opens or downloads one of your shared documents, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.logId}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors space-y-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {log.action === 'download_document' ? (
                        <Download className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      {log.action.replace('_', ' ').toUpperCase()}
                    </span>

                    <span className="text-xs text-slate-400 font-medium">
                      {formatUkDateTime(log.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">
                        {log.details?.docTitle || log.targetResource}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Accessed by: <span className="font-semibold text-slate-700">{log.details?.actorName || log.actorUid}</span>
                        {log.details?.actorRole && ` (${log.details.actorRole})`}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded flex-shrink-0">
                      {log.targetResource}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
