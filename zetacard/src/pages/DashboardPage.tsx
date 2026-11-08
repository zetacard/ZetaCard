import React, { useState, useEffect } from 'react';
import {
  Eye,
  Edit3,
  Copy,
  Trash2,
  Share2,
  QrCode,
  Calendar,
  MessageSquare,
  Users,
  LogOut,
  Settings,
} from 'lucide-react';
import { CardItem, Booking, Enquiry, ContactLead, CardCategory } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { QrModal } from '../components/common/QrModal';
import { ShareModal } from '../components/common/ShareModal';

interface DashboardPageProps {
  navigate: (route: string, param?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'bookings' | 'enquiries' | 'contacts'>('overview');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [cardCategoryFilter, setCardCategoryFilter] = useState<CardCategory | 'all'>('all');
  const [cardStatusFilter, setCardStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const [modalCard, setModalCard] = useState<CardItem | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const loadData = () => {
    if (!user) return;
    setCards(storageService.getUserCards(user.id));
    setBookings(storageService.getUserBookings(user.id));
    setEnquiries(storageService.getUserEnquiries(user.id));
    setContacts(storageService.getContacts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('zetacard_storage_updated', loadData);
    return () => window.removeEventListener('zetacard_storage_updated', loadData);
  }, [user]);

  const totalViews = cards.reduce((acc, c) => acc + (c.views || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const newEnquiries = enquiries.filter((e) => e.status === 'new');

  const filteredCards = cards.filter((c) => {
    const matchesCat = cardCategoryFilter === 'all' || c.category === cardCategoryFilter;
    const matchesStatus = cardStatusFilter === 'all' || c.status === cardStatusFilter;
    return matchesCat && matchesStatus;
  });

  const filteredBookings = bookings.filter((b) => {
    return bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
  });

  const handleDeleteCard = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This action cannot be undone.`)) {
      storageService.deleteCard(id);
      loadData();
    }
  };

  const handleDuplicateCard = (id: string) => {
    if (user) {
      storageService.duplicateCard(id, user.id);
      loadData();
    }
  };

  const handleUpdateBookingStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    storageService.updateBookingStatus(id, status);
    loadData();
  };

  const handleUpdateEnquiryStatus = (id: string, status: 'new' | 'replied' | 'archived') => {
    storageService.updateEnquiryStatus(id, status);
    loadData();
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
            Workspace Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{user?.displayName || 'Professional Account'}</span>
            <span aria-hidden="true">·</span>
            <span>{user?.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => navigate('settings')}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('home');
            }}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('editor', 'new')}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors whitespace-nowrap shadow-xs"
          >
            Create New Card
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="my-6 flex items-center gap-1 p-1 bg-slate-200/70 border border-slate-200 rounded-lg overflow-x-auto w-full sm:w-max">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'cards'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Cards ({cards.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bookings & RSVPs ({bookings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('enquiries')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Enquiries ({enquiries.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'contacts'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Contacts ({contacts.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4-Column Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Active Cards</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{cards.length}</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('cards')}
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  View all
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Total Card Views</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {totalViews.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">All time</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Pending Bookings / RSVPs</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {pendingBookings.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  Review
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Unread Enquiries</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {newEnquiries.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  Open inbox
                </button>
              </div>
            </div>
          </div>

          {/* Recent Cards Table */}
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Your Digital Cards & Menus</h3>
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Manage All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Views</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cards.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-slate-900 block">{c.title}</span>
                        <span className="text-slate-500">{c.profile.name}</span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-600">{c.category}</td>
                      <td className="py-3.5 px-4 capitalize">
                        <span
                          className={`font-medium ${
                            c.status === 'published' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {c.views.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setModalCard(c);
                              setShowQr(true);
                            }}
                            title="QR Code"
                            className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                          >
                            <QrCode size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setModalCard(c);
                              setShowShare(true);
                            }}
                            title="Share"
                            className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                          >
                            <Share2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('public-card', c.id)}
                            className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('editor', c.id)}
                            className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL CARDS & MENUS */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(['all', 'visiting', 'business', 'wedding', 'birthday', 'event', 'menu'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCardCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors whitespace-nowrap ${
                    cardCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCardStatusFilter(st)}
                  className={`px-2.5 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                    cardStatusFilter === st
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 text-sm">No cards match the selected filter.</p>
              <button
                type="button"
                onClick={() => navigate('editor', 'new')}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs"
              >
                Create New Card
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="capitalize font-medium text-slate-700">{c.category}</span>
                      <span
                        className={`capitalize font-medium ${
                          c.status === 'published' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {c.profile.bio || c.profile.title}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                      <span>{c.views.toLocaleString()} views</span>
                      <span aria-hidden="true">·</span>
                      <span>Updated {new Date(c.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setModalCard(c);
                          setShowQr(true);
                        }}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="QR Code"
                      >
                        <QrCode size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModalCard(c);
                          setShowShare(true);
                        }}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Share"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateCard(c.id)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Duplicate Card"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(c.id, c.title)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('public-card', c.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('editor', c.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKINGS & RSVPS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg border border-slate-200 text-xs font-medium w-max">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setBookingStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  bookingStatusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Calendar size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-700 font-medium text-sm">No bookings or RSVPs found</p>
              <p className="text-xs text-slate-500 mt-1">
                Incoming appointments, event RSVPs, and table reservations will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-200">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-sm text-slate-900">{b.name}</span>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span
                        className={`capitalize font-semibold ${
                          b.status === 'confirmed'
                            ? 'text-emerald-700'
                            : b.status === 'cancelled'
                            ? 'text-red-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Card: <strong className="text-slate-800">{b.cardTitle}</strong> · {b.email}
                      {b.phone ? ` · ${b.phone}` : ''}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5 tabular-nums">
                      <span>Date: <strong className="text-slate-800">{b.date}</strong> at <strong className="text-slate-800">{b.time}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Guests: <strong className="text-slate-800">{b.guests}</strong></span>
                    </div>

                    {b.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                        {b.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {b.status !== 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ENQUIRIES INBOX */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <MessageSquare size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-700 font-medium text-sm">No enquiries received</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-200">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <h4 className="font-bold text-sm text-slate-900">{enq.name}</h4>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span
                        className={`capitalize font-semibold ${
                          enq.status === 'replied' ? 'text-emerald-700' : 'text-blue-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">{enq.subject}</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>From: {enq.email} {enq.phone ? `· ${enq.phone}` : ''}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject)}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                      >
                        Reply via Email
                      </a>
                      {enq.status === 'new' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateEnquiryStatus(enq.id, 'replied')}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold"
                        >
                          Mark Replied
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SAVED CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Users size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-700 font-medium text-sm">No saved contact leads yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {contacts.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-white border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{c.email}</p>
                  {c.phone && <p className="text-xs text-slate-500 tabular-nums">{c.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {modalCard && (
        <QrModal
          isOpen={showQr}
          onClose={() => setShowQr(false)}
          url={`${window.location.origin}/c/${modalCard.id}`}
          title={modalCard.title}
          themeColor={modalCard.customization.themeColor}
          card={modalCard}
        />
      )}

      {modalCard && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          url={`${window.location.origin}/c/${modalCard.id}`}
          title={modalCard.title}
        />
      )}
    </div>
  );
};
