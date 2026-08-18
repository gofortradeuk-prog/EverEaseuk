import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Eye, 
  Type, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  PhoneCall, 
  Home, 
  LayoutDashboard,
  Sparkles,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { UserRole } from '../../types';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { currentUser, userProfile, signOut, switchUserRole } = useAuth();
  const { 
    settings, 
    setTextSize,
    cycleTextSize, 
    toggleHighContrast, 
    speakText, 
    stopSpeaking, 
    isSpeaking, 
    isSpeechAvailable 
  } = useAccessibility();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'senior':
        return 'Senior User';
      case 'family_carer':
        return 'Family Carer';
      case 'support_admin':
        return 'Support Admin';
      case 'finance_admin':
        return 'Finance Admin';
      case 'super_admin':
        return 'Super Admin';
      default:
        return 'Member';
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'senior':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
      case 'family_carer':
        return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
      case 'support_admin':
        return 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100';
      case 'finance_admin':
        return 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100';
      case 'super_admin':
        return 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100';
    }
  };

  const handleReadAloudCurrentScreen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      let speechContent = 'EverEase senior web platform. ';
      if (currentRoute === '/dashboard') {
        speechContent += 'You are on your main home dashboard. You have seven help modules: Scam Protection, Digital Help, Life Reminders, Document Vault, Home Manager, Subscription Manager, and Family Connect. Tap any card to open.';
      } else if (currentRoute === '/admin') {
        speechContent += 'You are in the administrative management shell for system overview and role oversight.';
      } else {
        speechContent += `You are viewing the ${currentRoute.replace('/', '').replace('-', ' ')} module. Tap the primary action button to get started.`;
      }
      speakText(speechContent);
    }
  };

  const isAdminRole = userProfile?.role && ['support_admin', 'finance_admin', 'super_admin'].includes(userProfile.role);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="app-header">
      {/* Top Accessibility & Support Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800">
        <div className="w-full max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-3 text-base">
          {/* Direct UK Telephone Help line */}
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center p-1.5 bg-emerald-500 rounded-lg text-slate-950 shadow-xs">
              <PhoneCall className="w-3.5 h-3.5" />
            </span>
            <span className="hidden sm:inline text-slate-300">Freephone UK Support:</span>
            <a 
              href="tel:08008882026" 
              className="font-black underline text-emerald-300 hover:text-emerald-200 tracking-wide text-lg transition-colors"
              id="emergency-phone-link"
            >
              0800 888 2026
            </a>
            <span className="text-xs text-slate-400 hidden md:inline font-medium">(Free 8am–8pm 7 days a week)</span>
          </div>

          {/* Quick Accessibility Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap" id="accessibility-toolbar">
            {/* Text Size Slider & Quick Step Controls */}
            <div 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold shadow-xs" 
              id="text-size-control-group"
            >
              <Type className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 text-xs sm:text-sm font-medium hidden sm:inline">Text Size:</span>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (settings.textSize === 'xlarge') setTextSize('large');
                    else if (settings.textSize === 'large') setTextSize('normal');
                  }}
                  disabled={settings.textSize === 'normal'}
                  className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:opacity-30 disabled:hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  title="Make text smaller (Standard)"
                  id="decrease-text-size-btn"
                  aria-label="Decrease text size"
                >
                  A-
                </button>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={settings.textSize === 'normal' ? 1 : settings.textSize === 'large' ? 2 : 3}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val === 1) setTextSize('normal');
                    else if (val === 2) setTextSize('large');
                    else if (val === 3) setTextSize('xlarge');
                  }}
                  className="w-14 sm:w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Text Size Slider"
                  id="text-size-slider"
                />

                <button
                  onClick={() => {
                    if (settings.textSize === 'normal') setTextSize('large');
                    else if (settings.textSize === 'large') setTextSize('xlarge');
                  }}
                  disabled={settings.textSize === 'xlarge'}
                  className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:opacity-30 disabled:hover:bg-slate-700 text-xs sm:text-sm font-black text-amber-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  title="Make text larger (Large or Extra Large)"
                  id="increase-text-size-btn"
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>

              <span className="text-amber-300 font-extrabold text-xs uppercase px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 shrink-0">
                {settings.textSize === 'normal' ? 'Standard' : settings.textSize === 'large' ? 'Large' : 'XL'}
              </span>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                settings.highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
              title="Toggle High Contrast Mode for better visibility"
              id="high-contrast-toggle-btn"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>High Contrast</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded font-black ${settings.highContrast ? 'bg-slate-900 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                {settings.highContrast ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Audio Reader / Speak page */}
            {isSpeechAvailable && (
              <button
                onClick={handleReadAloudCurrentScreen}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse font-extrabold shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                title="Read screen aloud in clear English"
                id="read-aloud-toggle-btn"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-slate-950" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Read Screen'}</span>
                <span className="sm:hidden">{isSpeaking ? 'Stop' : 'Read'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="w-full max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Senior UK Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(isAdminRole ? '/admin' : '/dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-sm border border-emerald-800/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">EverEase</span>
                <span className="text-xs font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-md">
                  UK Edition
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-tight">
                Simple & Safe Everyday Care
              </p>
            </div>
          </button>
        </div>

        {/* User Info, Role Switcher for Testing, and Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userProfile && (
            <>
              {/* Navigation quick buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-base transition-all ${
                    currentRoute === '/dashboard'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                  }`}
                  id="nav-home-dashboard-btn"
                >
                  <LayoutDashboard className="w-5 h-5 text-emerald-700" />
                  <span>Modules</span>
                </button>

                {isAdminRole && (
                  <button
                    onClick={() => navigate('/admin')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-base transition-all ${
                      currentRoute === '/admin'
                        ? 'bg-purple-50 text-purple-900 border border-purple-300 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                    }`}
                    id="nav-admin-shell-btn"
                  >
                    <Settings className="w-5 h-5 text-purple-700" />
                    <span>Admin Shell</span>
                  </button>
                )}
              </div>

              {/* Role Switcher Menu (Essential for evaluators/testers to switch roles easily) */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold text-sm sm:text-base transition-all shadow-xs ${getRoleBadgeStyle(
                    userProfile.role
                  )}`}
                  id="user-role-badge-btn"
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Role:</span>
                  <span className="font-extrabold">{getRoleLabel(userProfile.role)}</span>
                  <ChevronDown className="w-4 h-4 ml-0.5 opacity-70" />
                </button>

                {roleMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    id="role-switch-dropdown"
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Signed in as
                      </p>
                      <p className="font-bold text-slate-900 text-sm truncate mt-0.5">
                        {userProfile.displayName || userProfile.email}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                        {userProfile.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <p className="px-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Switch View Role:
                      </p>
                      <div className="space-y-1">
                        {(['senior', 'family_carer', 'support_admin', 'finance_admin', 'super_admin'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              switchUserRole(r);
                              setRoleMenuOpen(false);
                              if (['support_admin', 'finance_admin', 'super_admin'].includes(r)) {
                                navigate('/admin');
                              } else {
                                navigate('/dashboard');
                              }
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                              userProfile.role === r
                                ? 'bg-slate-900 text-white'
                                : 'hover:bg-slate-100 text-slate-800'
                            }`}
                            id={`switch-role-to-${r}-btn`}
                          >
                            <span>{getRoleLabel(r)}</span>
                            {userProfile.role === r && (
                              <span className="text-xs bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-md">
                                Active
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={signOut}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        id="signout-from-menu-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of EverEase</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Sign Out Button */}
              <button
                onClick={signOut}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold text-base transition-colors shadow-xs"
                title="Sign out of account"
                id="header-signout-btn"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
