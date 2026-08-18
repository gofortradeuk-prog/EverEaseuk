import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, UserX, ExternalLink, ArrowRight } from 'lucide-react';
import { SupportImpersonationSession } from '../../types';

interface ImpersonationBannerProps {
  session: SupportImpersonationSession | null;
  onEndImpersonation: () => void;
  navigate?: (route: string) => void;
}

export const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({
  session,
  onEndImpersonation,
  navigate,
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('15:00');
  const [isWarningNearEnd, setIsWarningNearEnd] = useState(false);

  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const remainingMs = session.expiresAt - Date.now();
      if (remainingMs <= 0) {
        setTimeLeftStr('00:00');
        onEndImpersonation();
      } else {
        const totalSecs = Math.floor(remainingMs / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        setTimeLeftStr(
          `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
        setIsWarningNearEnd(totalSecs < 120); // under 2 minutes
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session, onEndImpersonation]);

  if (!session) return null;

  return (
    <div
      className={`border-b px-4 py-3 text-slate-900 transition-colors ${
        isWarningNearEnd
          ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
          : 'bg-amber-400 border-amber-500 text-slate-950'
      }`}
      id="impersonation-active-banner"
    >
      <div className="w-full max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-black/10 rounded-lg shrink-0">
            <ShieldAlert className="w-4 h-4 text-slate-950" />
          </span>
          <div>
            <span className="uppercase tracking-wider font-extrabold mr-1.5">
              Support Impersonation Mode Active:
            </span>
            <span className="underline">
              {session.targetUser.displayName} ({session.targetUser.role.replace('_', ' ')})
            </span>
            <span className="hidden md:inline text-slate-800 ml-2 font-medium">
              — All actions tracked in Audit Log
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-xl text-xs font-black">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in: {timeLeftStr}</span>
          </div>

          {navigate && (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              id="impersonation-test-view-btn"
            >
              <span>Test User Experience</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={onEndImpersonation}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            id="end-impersonation-btn"
          >
            <UserX className="w-3.5 h-3.5 text-rose-600" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
