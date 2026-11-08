import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { CardItem, Booking, Enquiry } from '../types';

interface AdminPageProps {
  navigate: (route: string, param?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { isAdmin } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'cards' | 'bookings' | 'enquiries' | 'system'>('metrics');
  const [allCards, setAllCards] = useState<CardItem[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allEnquiries, setAllEnquiries] = useState<Enquiry[]>([]);
  const [serverHealth, setServerHealth] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      setAllCards(storageService.getCards());
      setAllBookings(storageService.getBookings());
      setAllEnquiries(storageService.getEnquiries());

      fetch('/api/health')
        .then((res) => (res.ok ? res.json() : null))
        .then(setServerHealth)
        .catch(() => {});
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md p-8 rounded-xl bg-white border border-slate-200 text-center text-slate-900">
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3 border border-slate-200">
            <Lock size={22} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-600 mt-1.5 mb-6 leading-relaxed">
            Only verified administrators (`founder@zetacard.com` or `zetacard@outlook.com`) have permission to access platform administration.
          </p>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteCard = (id: string) => {
    if (confirm('Delete this card as administrator?')) {
      storageService.deleteCard(id);
      setAllCards(storageService.getCards());
    }
  };

  const handleToggleCardStatus = (card: CardItem) => {
    const updatedStatus = card.status === 'published' ? 'draft' : 'published';
    storageService.saveCard({ ...card, status: updatedStatus });
    setAllCards(storageService.getCards());
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
            Platform Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global metrics, card moderation, booking audit log, and infrastructure status.
          </p>
        </div>
      </div>

      {/* Segmented Admin Tabs */}
      <div className="my-6 flex items-center gap-1 p-1 bg-slate-200/70 border border-slate-200 rounded-lg overflow-x-auto w-max">
        <button
          type="button"
          onClick={() => setActiveAdminTab('metrics')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeAdminTab === 'metrics'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('cards')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeAdminTab === 'cards'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cards ({allCards.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('bookings')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeAdminTab === 'bookings'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bookings ({allBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('enquiries')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeAdminTab === 'enquiries'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Enquiries ({allEnquiries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('system')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeAdminTab === 'system'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Schema & Rules
        </button>
      </div>

      {/* METRICS */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Total Platform Cards</span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{allCards.length}</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Total Bookings Recorded</span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{allBookings.length}</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Cumulative Card Views</span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {allCards.reduce((a, c) => a + (c.views || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">AI Assistant Service</span>
              <span className="text-sm font-semibold text-emerald-700 block mt-1.5">
                {serverHealth?.aiEnabled ? 'Gemini API Active' : 'Local Fallback Active'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CARDS MODERATION */}
      {activeAdminTab === 'cards' && (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Card Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Owner ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allCards.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.title}</td>
                    <td className="py-3 px-4 capitalize text-slate-600">{c.category}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 truncate max-w-[120px]">{c.userId}</td>
                    <td className="py-3 px-4 capitalize">
                      <span
                        className={`font-semibold ${
                          c.status === 'published' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-mono tabular-nums">
                      {c.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCardStatus(c)}
                        className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        Toggle Status
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('public-card', c.id)}
                        className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(c.id)}
                        className="px-2.5 py-1 rounded border border-red-200 hover:bg-red-50 text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKINGS AUDIT */}
      {activeAdminTab === 'bookings' && (
        <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-200">
          {allBookings.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900 text-sm">{b.name}</strong> ({b.email})
                <p className="text-slate-500 mt-0.5 tabular-nums">
                  Card: {b.cardTitle} · Date: {b.date} · Guests: {b.guests}
                </p>
              </div>
              <span
                className={`font-semibold capitalize ${
                  b.status === 'confirmed' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ENQUIRIES AUDIT */}
      {activeAdminTab === 'enquiries' && (
        <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-200">
          {allEnquiries.map((enq) => (
            <div key={enq.id} className="p-4 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-slate-900 text-sm">{enq.name}</strong>
                <span className="text-slate-500 tabular-nums">{new Date(enq.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-800 font-semibold">{enq.subject}</p>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">{enq.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* SYSTEM & SCHEMA */}
      {activeAdminTab === 'system' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
          <h3 className="font-bold text-sm text-slate-900">
            Firebase Firestore Schema & Default-Deny Security Rules
          </h3>
          <p className="text-slate-600 leading-relaxed">
            ZetaCard includes production <code>firestore.rules</code> and <code>firebase-blueprint.json</code> in the project root. All six core collections (Users, Cards, Bookings, Enquiries, Contacts, and CardEvents) are mapped with strict user ownership isolation.
          </p>
        </div>
      )}
    </div>
  );
};
