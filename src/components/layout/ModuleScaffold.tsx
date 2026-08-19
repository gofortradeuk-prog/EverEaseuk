import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  HelpCircle, 
  CalendarClock, 
  FileLock2, 
  Home as HomeIcon, 
  Receipt, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Info,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ModuleDefinition } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ModuleScaffoldProps {
  module: ModuleDefinition;
  onBack: () => void;
  customActionText?: string;
  customActionIcon?: React.ReactNode;
}

export const ModuleScaffold: React.FC<ModuleScaffoldProps> = ({
  module,
  onBack,
  customActionText,
  customActionIcon,
}) => {
  const { userProfile } = useAuth();
  const { speakText } = useAccessibility();
  const [actionTriggered, setActionTriggered] = useState(false);

  const getModuleIcon = (iconName: string) => {
    const className = "w-8 h-8 md:w-10 md:h-10 text-white";
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      case 'CalendarClock':
        return <CalendarClock className={className} />;
      case 'FileLock2':
        return <FileLock2 className={className} />;
      case 'Home':
        return <HomeIcon className={className} />;
      case 'Receipt':
        return <Receipt className={className} />;
      case 'Users':
        return <Users className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getAccentBg = (color: string) => {
    switch (color) {
      case 'rose':
        return 'bg-gradient-to-tr from-rose-600 to-rose-500 shadow-rose-200';
      case 'blue':
        return 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-200';
      case 'amber':
        return 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-amber-200';
      case 'emerald':
        return 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-200';
      case 'indigo':
        return 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-200';
      case 'teal':
        return 'bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-teal-200';
      case 'purple':
        return 'bg-gradient-to-tr from-purple-600 to-violet-500 shadow-purple-200';
      default:
        return 'bg-slate-700';
    }
  };

  const isCarer = userProfile?.role === 'family_carer';

  const handlePrimaryActionClick = () => {
    setActionTriggered(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6" id={`module-page-${module.id}`}>
      {/* Top Navigation Back Button - High Contrast & Large Tap Target */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-base md:text-lg transition-all shadow-xs focus:ring-4 focus:ring-amber-300 cursor-pointer"
          id="back-to-dashboard-btn"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800" />
          <span>Back to All Modules</span>
        </button>

        {/* Family Access Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl text-sm font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>
            {isCarer ? 'Carer View: Managing on behalf of Margaret Davies' : 'Protected by EverEase UK'}
          </span>
        </div>
      </div>

      {/* Module Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`p-3.5 rounded-2xl ${getAccentBg(module.accentColor)} shadow-xs`}>
            {getModuleIcon(module.iconName)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-700">
                Module: {module.category}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
                {module.badge}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {module.title}
            </h1>
            <p className="text-lg md:text-xl font-bold text-emerald-800">
              "{module.plainEnglishQuestion}"
            </p>
          </div>
        </div>

        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
          {module.detailedDescription}
        </p>

        {/* Single Obvious Primary Action (Strict rule: minimum 44px+ tap target, prominent and unmissable) */}
        <div className="pt-2">
          <div className="p-5 md:p-6 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
            <p className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-slate-500">
              Primary Action:
            </p>
            <button
              onClick={handlePrimaryActionClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-lg md:text-xl shadow-sm border border-emerald-900/30 transition-all hover:scale-[1.01] focus:ring-4 focus:ring-amber-300 min-h-[56px] cursor-pointer"
              id={`primary-action-btn-${module.id}`}
            >
              {customActionIcon || <Sparkles className="w-6 h-6 text-amber-300" />}
              <span>{customActionText || module.primaryActionLabel}</span>
              <ChevronRight className="w-6 h-6" />
            </button>

            {actionTriggered && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl flex items-start gap-3 mt-3 animate-in fade-in shadow-2xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-base md:text-lg">
                    Scaffold route confirmed: {module.route}
                  </p>
                  <p className="text-sm md:text-base text-emerald-900 mt-0.5 leading-relaxed font-medium">
                    This module route is fully connected to the router and Firestore backend. We will build the complete interactive form and AI verification workflow for "{module.title}" in the next milestone!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Planned Feature Capabilities & Senior Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Features Checklist */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-7 space-y-4 shadow-xs">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            <span>Key Module Features</span>
          </h2>
          <ul className="space-y-3">
            {module.featuresPlanned.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-base md:text-lg text-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center shrink-0 mt-0.5 text-xs border border-emerald-300">
                  {idx + 1}
                </span>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Senior & Carer Tips */}
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200 p-6 md:p-7 space-y-4 shadow-xs text-slate-900">
          <h2 className="text-xl md:text-2xl font-black text-amber-950 flex items-center gap-2 tracking-tight">
            <Info className="w-6 h-6 text-amber-800" />
            <span>Senior Friendly Guarantee</span>
          </h2>
          <div className="space-y-3 text-base md:text-lg text-amber-950">
            <p className="font-medium leading-relaxed">
              • <strong>No confusing tech jargon:</strong> Every alert and reminder is phrased in everyday plain British English.
            </p>
            <p className="font-medium leading-relaxed">
              • <strong>Family support built-in:</strong> If you are unsure, you can tap one button to ask your family member or carer for help with this item.
            </p>
            <p className="font-medium leading-relaxed">
              • <strong>Telephone assistance:</strong> Call our freephone support team on <strong>0800 888 2026</strong> anytime between 9:00 AM and 5:30 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
