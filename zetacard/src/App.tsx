/**
 * ZetaCard — Master Application Entry Point
 * Founder and Creator: Shahid Tufail
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { CardEditorPage } from './pages/CardEditorPage';
import { DashboardPage } from './pages/DashboardPage';
import { PublicCardViewPage } from './pages/PublicCardViewPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { LegalPage } from './pages/LegalPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactSupportPage } from './pages/ContactSupportPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/c/')) {
        const id = path.replace('/c/', '');
        if (id) {
          setCurrentRoute('public-card');
          setRouteParam(id);
          return;
        }
      }

      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const [r, p] = hash.split('/');
        setCurrentRoute(r || 'home');
        setRouteParam(p);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);

    if (route === 'public-card' && param) {
      window.history.pushState({}, '', `/c/${param}`);
    } else if (route === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', param ? `#${route}/${param}` : `#${route}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicStandalone = currentRoute === 'public-card';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
        {!isPublicStandalone && (
          <Navbar currentRoute={currentRoute} navigate={navigate} />
        )}

        <main className="flex-1">
          {currentRoute === 'home' && <HomePage navigate={navigate} />}
          {currentRoute === 'gallery' && <GalleryPage navigate={navigate} />}
          {currentRoute === 'editor' && (
            <CardEditorPage cardIdOrTemplate={routeParam} navigate={navigate} />
          )}
          {currentRoute === 'dashboard' && <DashboardPage navigate={navigate} />}
          {currentRoute === 'public-card' && (
            <PublicCardViewPage cardId={routeParam || 'shahid-tufail-founder'} navigate={navigate} />
          )}
          {currentRoute === 'admin' && <AdminPage navigate={navigate} />}
          {currentRoute === 'auth' && <AuthPage navigate={navigate} />}
          {currentRoute === 'settings' && <AccountSettingsPage navigate={navigate} />}
          {currentRoute === 'legal' && <LegalPage navigate={navigate} />}
          {currentRoute === 'how-it-works' && <HowItWorksPage navigate={navigate} />}
          {currentRoute === 'contact' && <ContactSupportPage navigate={navigate} />}
        </main>

        {!isPublicStandalone && <Footer navigate={navigate} />}
      </div>
    </AuthProvider>
  );
}
