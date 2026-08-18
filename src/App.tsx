import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import { Header } from './components/layout/Header';
import { PublicHeader } from './components/public/PublicHeader';
import { PublicFooter } from './components/public/PublicFooter';
import { WhatsAppWidget } from './components/public/WhatsAppWidget';

// Public Marketing Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { PricingPage } from './pages/public/PricingPage';
import { FaqPage } from './pages/public/FaqPage';
import { ContactPage } from './pages/public/ContactPage';
import { LegalPage } from './pages/public/LegalPage';

// Auth & App Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';

// 7 Authenticated Module Pages
import { ScamProtectionPage } from './pages/modules/ScamProtectionPage';
import { DigitalHelpPage } from './pages/modules/DigitalHelpPage';
import { RemindersPage } from './pages/modules/RemindersPage';
import { DocumentVaultPage } from './pages/modules/DocumentVaultPage';
import { HomeManagerPage } from './pages/modules/HomeManagerPage';
import { SubscriptionManagerPage } from './pages/modules/SubscriptionManagerPage';
import { FamilyConnectPage } from './pages/modules/FamilyConnectPage';

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/how-it-works',
  '/pricing',
  '/faq',
  '/contact',
  '/terms',
  '/privacy',
  '/refund',
  '/sla',
  '/disclaimer',
  '/gdpr',
  '/our-commitment',
];

const MainRouter: React.FC = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  // Default to public home route or current hash/path
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path && path !== '/') {
        return `${path}${search}`;
      }
    }
    return '/';
  });

  // Handle URL changes & role redirection when logging in
  useEffect(() => {
    if (currentUser && userProfile?.role) {
      if (['support_admin', 'finance_admin', 'super_admin'].includes(userProfile.role)) {
        if (currentRoute === '/auth') {
          setCurrentRoute('/admin');
        }
      } else {
        if (currentRoute === '/auth') {
          setCurrentRoute('/dashboard');
        }
      }
    }
  }, [currentUser, userProfile?.role]);

  const navigate = (route: string) => {
    window.scrollTo(0, 0);
    setCurrentRoute(route);
  };

  // Ensure scroll resets directly and immediately on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Loading EverEase UK...</h2>
          <p className="text-sm text-slate-500 font-medium">Connecting to secure safeguarding systems</p>
        </div>
      </div>
    );
  }

  const [rawPath, queryString] = currentRoute.split('?');
  const path = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
  const queryParams = new URLSearchParams(queryString || '');

  // 1. Auth Page Route
  if (path === '/auth') {
    const initialMode = (queryParams.get('mode') as 'signin' | 'signup') || 'signin';
    const initialPlan = queryParams.get('plan') || undefined;
    return (
      <AuthPage 
        navigate={navigate} 
        initialMode={initialMode} 
        initialPlan={initialPlan} 
      />
    );
  }

  // 2. Public Marketing Website Routes (Logged-out or public viewing)
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path === '';
  if (isPublicRoute) {
    const renderPublicPage = () => {
      switch (path) {
        case '/about':
          return <AboutPage navigate={navigate} />;
        case '/services':
          return <ServicesPage navigate={navigate} />;
        case '/how-it-works':
          return <HowItWorksPage navigate={navigate} />;
        case '/pricing':
          return <PricingPage navigate={navigate} />;
        case '/faq':
          return <FaqPage navigate={navigate} />;
        case '/contact':
          return <ContactPage navigate={navigate} />;
        case '/terms':
          return <LegalPage type="terms" navigate={navigate} />;
        case '/privacy':
          return <LegalPage type="privacy" navigate={navigate} />;
        case '/refund':
          return <LegalPage type="refund" navigate={navigate} />;
        case '/sla':
          return <LegalPage type="sla" navigate={navigate} />;
        case '/disclaimer':
          return <LegalPage type="disclaimer" navigate={navigate} />;
        case '/gdpr':
          return <LegalPage type="gdpr" navigate={navigate} />;
        case '/our-commitment':
          return <LegalPage type="our-commitment" navigate={navigate} />;
        case '/':
        default:
          return <HomePage navigate={navigate} />;
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <PublicHeader currentRoute={currentRoute} navigate={navigate} />
        <main className="flex-1" id="public-main-content">
          {renderPublicPage()}
        </main>
        <PublicFooter navigate={navigate} />
        <WhatsAppWidget />
      </div>
    );
  }

  // 3. Authenticated App Pages (requires login)
  if (!currentUser) {
    return (
      <AuthPage 
        navigate={navigate} 
        initialMode="signin" 
      />
    );
  }

  // Render authenticated application view
  const renderAuthenticatedView = () => {
    switch (path) {
      case '/admin':
        return <AdminPage navigate={navigate} />;
      case '/scam-protection':
        return <ScamProtectionPage navigate={navigate} />;
      case '/digital-help':
        return <DigitalHelpPage navigate={navigate} initialQuery={queryParams.get('q')} />;
      case '/reminders':
        return <RemindersPage navigate={navigate} />;
      case '/document-vault':
        return <DocumentVaultPage navigate={navigate} currentUser={userProfile} />;
      case '/home-manager':
        return <HomeManagerPage navigate={navigate} currentUser={userProfile} />;
      case '/subscriptions':
        return <SubscriptionManagerPage navigate={navigate} />;
      case '/family-connect':
        return <FamilyConnectPage navigate={navigate} />;
      case '/dashboard':
      default:
        return <DashboardPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Authenticated Header with Accessibility Toolbar & Quick Emergency Actions */}
      <Header currentRoute={currentRoute} navigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1 pb-12" id="main-content-region">
        {renderAuthenticatedView()}
      </main>

      {/* Senior-friendly footer with plain English notices & Public Site link */}
      <footer className="bg-slate-900 text-white border-t-2 border-slate-800 py-6 px-4">
        <div className="w-full max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-sm md:text-base font-semibold">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="font-extrabold text-emerald-400">EverEase UK</span> • Safeguarding Platform
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Public Website
            </button>
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Pricing &amp; Plans
            </button>
            <button
              type="button"
              onClick={() => navigate('/our-commitment')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Safeguarding Commitment
            </button>
          </div>
          <div className="text-slate-400 text-xs md:text-sm">
            Freephone Helpline: <span className="text-white font-bold">0800 888 2026</span> • Open daily 8am to 8pm
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <MainRouter />
      </AccessibilityProvider>
    </AuthProvider>
  );
}
