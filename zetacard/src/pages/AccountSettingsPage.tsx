import React, { useState } from 'react';
import { Download, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { getFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, isFirebaseConfigured } from '../firebase/config';

interface AccountSettingsPageProps {
  navigate: (route: string) => void;
}

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ navigate }) => {
  const { user, updateProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [fbConfig, setFbConfig] = useState(getFirebaseConfig());
  const [fbSaved, setFbSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ displayName, phone, bio });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(fbConfig);
    setFbSaved(true);
    setTimeout(() => setFbSaved(false), 2500);
  };

  const handleExportAllData = () => {
    if (!user) return;
    const data = {
      exportDate: new Date().toISOString(),
      user,
      cards: storageService.getUserCards(user.id),
      bookings: storageService.getUserBookings(user.id),
      enquiries: storageService.getUserEnquiries(user.id),
      contacts: storageService.getContacts(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zetacard_backup_${user.id}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllMyData = () => {
    if (!user) return;
    if (
      confirm(
        'Permanently delete all your cards, bookings, and enquiries in accordance with GDPR? This action cannot be undone.'
      )
    ) {
      storageService.deleteMyData(user.id);
      logout();
      navigate('home');
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-900 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
          Account & Infrastructure Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your profile, export portable JSON backups, or connect a custom Firebase project.
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Profile Details</h3>
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Check size={14} /> Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Account Role</label>
              <input
                type="text"
                disabled
                value={user?.role === 'admin' ? 'Administrator' : 'Standard Professional'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Custom Firebase Configuration */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Custom Firebase Project Connection</h3>
            <p className="text-xs text-slate-500">
              Optional: bind ZetaCard to your own Google Cloud / Firebase project for external portability.
            </p>
          </div>
          {fbSaved && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Check size={14} /> Saved
            </span>
          )}
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600">Current Storage Mode</span>
          <span className="font-semibold text-slate-900">
            {isFirebaseConfigured() ? 'Custom Firebase Project' : 'Unified Local + Server Storage'}
          </span>
        </div>

        <form onSubmit={handleSaveFirebase} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Firebase API Key</label>
              <input
                type="text"
                value={fbConfig.apiKey || ''}
                onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project ID</label>
              <input
                type="text"
                value={fbConfig.projectId || ''}
                onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                placeholder="my-zetacard-project"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Auth Domain</label>
              <input
                type="text"
                value={fbConfig.authDomain || ''}
                onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                placeholder="my-project.firebaseapp.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">App ID</label>
              <input
                type="text"
                value={fbConfig.appId || ''}
                onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value })}
                placeholder="1:123456789:web:abcdef..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                clearFirebaseConfig();
                setFbConfig({});
              }}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset to Default
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors"
            >
              Save Firebase Config
            </button>
          </div>
        </form>
      </div>

      {/* Data Export & GDPR Purge */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-200">
          Data Portability & Privacy Controls
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Export Account Data (JSON)</h4>
            <p className="text-xs text-slate-500">
              Download all your cards, bookings, enquiries, and contacts in portable JSON format.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportAllData}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download size={14} /> Download JSON
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-red-50/60 border border-red-200">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-red-900">Permanent Data Deletion (deleteMyData)</h4>
            <p className="text-xs text-red-700">
              Permanently remove all cards, customer bookings, and records associated with your account.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAllMyData}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Trash2 size={14} /> Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
};
