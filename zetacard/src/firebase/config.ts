/**
 * ZetaCard Firebase Configuration & Client Initialization Helper
 * Founder & Creator: Shahid Tufail
 * 
 * Supports both standalone development (instant persistence via storageService)
 * and seamless connection to live Firebase project when VITE_FIREBASE_* credentials
 * are provided in .env or the in-app Account Settings.
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const getFirebaseConfig = (): FirebaseConfig => {
  // Check localStorage overrides (configured from Settings page) first, then env variables
  try {
    const custom = localStorage.getItem('zetacard_firebase_config');
    if (custom) {
      return JSON.parse(custom);
    }
  } catch {}

  return {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || '',
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '',
  };
};

export const isFirebaseConfigured = (): boolean => {
  const cfg = getFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
};

export const saveFirebaseConfig = (config: FirebaseConfig): void => {
  localStorage.setItem('zetacard_firebase_config', JSON.stringify(config));
  window.dispatchEvent(new Event('zetacard_firebase_config_updated'));
};

export const clearFirebaseConfig = (): void => {
  localStorage.removeItem('zetacard_firebase_config');
  window.dispatchEvent(new Event('zetacard_firebase_config_updated'));
};
