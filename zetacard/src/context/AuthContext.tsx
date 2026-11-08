import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { createInitialsSvgDataUrl } from '../services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'zetacard_auth_user_v2';
const USERS_REGISTRY_KEY = 'zetacard_users_registry_v2';

const DEFAULT_USERS: (UserProfile & { passHash: string })[] = [
  {
    id: 'user_founder_01',
    email: 'founder@zetacard.com',
    displayName: 'Shahid Tufail',
    role: 'admin',
    avatarUrl: createInitialsSvgDataUrl('ST', '#0F172A', '#F59E0B'),
    phone: '+44 7911 123456',
    bio: 'Founder & Principal Architect of ZetaCard.',
    createdAt: '2026-01-01T00:00:00.000Z',
    passHash: 'password123',
    settings: {
      theme: 'light',
      notificationsEmail: true,
      autoPublish: true,
    },
  },
  {
    id: 'user_admin_02',
    email: 'zetacard@outlook.com',
    displayName: 'ZetaCard Administrator',
    role: 'admin',
    avatarUrl: createInitialsSvgDataUrl('ZA', '#1E293B', '#F8FAFC'),
    phone: '+1 800 555 0199',
    bio: 'Platform administration and infrastructure.',
    createdAt: '2026-01-01T00:00:00.000Z',
    passHash: 'admin123',
    settings: {
      theme: 'light',
      notificationsEmail: true,
    },
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const existingRegistry = localStorage.getItem(USERS_REGISTRY_KEY);
      if (!existingRegistry) {
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(DEFAULT_USERS));
      }

      const savedSession = localStorage.getItem(AUTH_USER_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      } else {
        const founder = DEFAULT_USERS[0];
        setUser(founder);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(founder));
      }
    } catch (e) {
      console.error('Auth initialization error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsersRegistry = (): (UserProfile & { passHash: string })[] => {
    try {
      const stored = localStorage.getItem(USERS_REGISTRY_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const registry = getUsersRegistry();
    const found = registry.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      return { success: false, error: 'No account found with this email. Please register.' };
    }

    if (found.passHash && found.passHash !== pass) {
      return { success: false, error: 'Incorrect password. Try "password123" or reset password.' };
    }

    const { passHash, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const registry = getUsersRegistry();
    const normalizedEmail = email.trim().toLowerCase();

    if (registry.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const isAdminEmail = ['zetacard@outlook.com', 'founder@zetacard.com'].includes(normalizedEmail);
    const initials = name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: UserProfile & { passHash: string } = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: normalizedEmail,
      displayName: name.trim(),
      role: isAdminEmail ? 'admin' : 'user',
      avatarUrl: createInitialsSvgDataUrl(initials || 'ZC', '#0F172A', '#F8FAFC'),
      createdAt: new Date().toISOString(),
      passHash: pass,
      settings: {
        theme: 'light',
        notificationsEmail: true,
        autoPublish: false,
      },
    };

    registry.push(newUser);
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));

    const { passHash: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const googleUser: UserProfile = {
      id: 'usr_google_' + Date.now().toString(36),
      email: 'professional.user@gmail.com',
      displayName: 'Verified Professional',
      role: 'user',
      avatarUrl: createInitialsSvgDataUrl('VP', '#1E40AF', '#FFFFFF'),
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        notificationsEmail: true,
      },
    };

    setUser(googleUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const registry = getUsersRegistry();
    const found = registry.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'If an account with that email exists, password reset instructions have been sent.' };
    }
    return {
      success: true,
      message: `Password reset link sent to ${email}. Temporary recovery code: ZETA-${Math.floor(100000 + Math.random() * 900000)}.`,
    };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));

    const registry = getUsersRegistry();
    const idx = registry.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      registry[idx] = { ...registry[idx], ...updates };
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
    }
  };

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.email === 'zetacard@outlook.com' || user.email === 'founder@zetacard.com')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
