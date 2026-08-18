import React, { useState } from 'react';
import { 
  History, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Mail,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { ScamCheckRecord, ScamVerdict } from '../../types';

interface ScamHistoryListProps {
  history: ScamCheckRecord[];
  onSelectRecord?: (record: ScamCheckRecord) => void;
  onDeleteRecord?: (checkId: string) => Promise<void>;
  isLoading: boolean;
}

export const ScamHistoryList: React.FC<ScamHistoryListProps> = ({
  history,
  onSelectRecord,
  onDeleteRecord,
  isLoading,
}) => {
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (selectedVerdictFilter === 'all') return true;
    return item.verdict === selectedVerdictFilter;
  });

  const formatUkDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getVerdictBadge = (verdict: ScamVerdict) => {
    switch (verdict) {
      case 'likely_scam':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 font-extrabold text-xs md:text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            🔴 Likely Scam
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs md:text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            🟡 Caution
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs md:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            🟢 Safe
          </span>
        );
    }
  };

  const getInputTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-indigo-600" title="Screenshot" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-600" title="Email" />;
      case 'text':
      default:
        return <FileText className="w-4 h-4 text-emerald-600" title="Text message" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden" id="scam-history-section">
      {/* Section Header */}
      <div className="p-6 md:p-8 border-b-2 border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700" />
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Your Past Message Checks
            </h3>
          </div>
          <p className="text-sm md:text-base font-medium text-slate-500 mt-1">
            Review previous safety verdicts and advice history
          </p>
        </div>

        {/* Verdict Filter Controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedVerdictFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                selectedVerdictFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({history.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedVerdictFilter('likely_scam')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                selectedVerdictFilter === 'likely_scam'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scams
            </button>
            <button
              type="button"
              onClick={() => setSelectedVerdictFilter('caution')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                selectedVerdictFilter === 'caution'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Caution
            </button>
            <button
              type="button"
              onClick={() => setSelectedVerdictFilter('safe')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                selectedVerdictFilter === 'safe'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safe
            </button>
          </div>
        </div>
      </div>

      {/* History List or Empty State */}
      <div className="p-6 md:p-8 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 font-semibold text-sm">Loading your safety check history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-700">No message checks found</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Whenever you check a suspicious text, email, or screenshot, your safe summary will be recorded here for reference.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredHistory.map((item) => {
              const isExpanded = expandedId === item.checkId;
              return (
                <div
                  key={item.checkId}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getVerdictBadge(item.verdict)}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {getInputTypeIcon(item.inputType)}
                          <span className="capitalize">{item.inputType}</span>
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatUkDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-slate-800 line-clamp-2 mt-1">
                        {item.explanation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.checkId)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title={isExpanded ? 'Hide details' : 'Show details'}
                      >
                        {isExpanded ? (
                          <>
                            <span className="hidden sm:inline">Less</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {onDeleteRecord && (
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(item.checkId)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete this history entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-3 mt-3 border-t border-slate-200 space-y-3 bg-slate-50 p-4 rounded-xl text-sm">
                      {item.advice && (
                        <div>
                          <strong className="text-slate-900 block mb-0.5">Recommended Advice:</strong>
                          <span className="text-slate-700 font-medium">{item.advice}</span>
                        </div>
                      )}

                      {item.redFlags && item.redFlags.length > 0 && (
                        <div>
                          <strong className="text-slate-900 block mb-1">Warning Flags:</strong>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                            {item.redFlags.map((flag, i) => (
                              <li key={i}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {onSelectRecord && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => onSelectRecord(item)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Open Full Verdict View
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* UK GDPR Data Minimisation Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>UK GDPR Compliance (Article 5(1)(c) - Data Minimisation):</strong> EverEase does not store your original message text or uploaded screenshot images indefinitely in Firestore. Only the safety verdict, plain-English explanation, and red flags are retained in your log.
          </span>
        </div>
      </div>
    </div>
  );
};
