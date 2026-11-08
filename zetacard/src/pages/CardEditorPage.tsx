import React, { useState } from 'react';
import {
  Save,
  QrCode,
  Share2,
  Smartphone,
  Monitor,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Eye,
} from 'lucide-react';
import { CardCategory, CardItem, FontFamily, ScheduleItem } from '../types';
import { TEMPLATES } from '../data/templates';
import { storageService, createInitialsSvgDataUrl } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { CardRenderer } from '../components/templates/CardRenderer';
import { AiCopilotModal } from '../components/common/AiCopilotModal';
import { QrModal } from '../components/common/QrModal';
import { ShareModal } from '../components/common/ShareModal';

interface CardEditorPageProps {
  cardIdOrTemplate?: string;
  navigate: (route: string, param?: string) => void;
}

export const CardEditorPage: React.FC<CardEditorPageProps> = ({ cardIdOrTemplate, navigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'details' | 'design' | 'settings'>('profile');
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const [card, setCard] = useState<CardItem>(() => {
    if (
      cardIdOrTemplate &&
      !cardIdOrTemplate.startsWith('visiting_') &&
      !cardIdOrTemplate.startsWith('business_') &&
      !cardIdOrTemplate.startsWith('wedding_') &&
      !cardIdOrTemplate.startsWith('birthday_') &&
      !cardIdOrTemplate.startsWith('event_') &&
      !cardIdOrTemplate.startsWith('menu_') &&
      cardIdOrTemplate !== 'new'
    ) {
      const existing = storageService.getCardById(cardIdOrTemplate);
      if (existing) return existing;
    }

    const template = TEMPLATES.find((t) => t.id === cardIdOrTemplate) || TEMPLATES[0];
    const newId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const category = template.category;
    const defaultName =
      user?.displayName ||
      (category === 'wedding'
        ? 'Eleanor & Julian'
        : category === 'menu'
        ? 'Le Bistro Gourmet'
        : 'Alexander Hamilton');

    const initials = defaultName
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return {
      id: newId,
      userId: user?.id || 'guest',
      category: category,
      templateId: template.id,
      title: `${template.name}`,
      slug: `my-${template.category}-${Date.now() % 10000}`,
      status: 'draft',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        name: defaultName,
        title:
          category === 'visiting'
            ? 'Managing Partner & Consultant'
            : category === 'business'
            ? 'Chief Technology Officer'
            : category === 'wedding'
            ? 'Marriage Ceremony & Reception'
            : category === 'menu'
            ? 'Executive Chef & Sommelier'
            : 'Formal Reception',
        company: 'ZetaCard Global',
        bio: template.description,
        avatarUrl: createInitialsSvgDataUrl(initials || 'ZC', template.defaultCustomization.themeColor, '#FFFFFF'),
        coverUrl: template.previewImage,
        phone: '+1 555 019 4829',
        email: user?.email || 'contact@zetacard.app',
        website: 'https://zeta-card.base44.app',
        address: 'Mayfair, London · New York',
        socials: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
      },
      customization: {
        ...template.defaultCustomization,
      },
      eventDetails: ['wedding', 'birthday', 'event'].includes(category)
        ? {
            partnerName: category === 'wedding' ? 'Julian Thorne' : '',
            venueName: 'The Belvedere Orangery',
            venueAddress: '12 Belvedere Way, Florence, Italy',
            eventDate: '2026-10-15',
            eventTime: '17:30',
            rsvpDeadline: '2026-09-01',
            dressCode: 'Black Tie Optional',
            ceremonyDetails: 'Ceremony followed by cocktail reception and seated dinner.',
            schedule: [
              { id: '1', time: '17:00', title: 'Guest Arrival', description: 'Welcome refreshments on the terrace.' },
              { id: '2', time: '17:30', title: 'Main Ceremony', description: 'Seated program in the pavilion.' },
              { id: '3', time: '19:00', title: 'Reception Dinner', description: 'Four-course dinner and toasts.' },
            ],
          }
        : undefined,
      menuDetails:
        category === 'menu'
          ? {
              restaurantName: 'Le Bistro Gourmet',
              tagline: 'Seasonal Tasting Menu & Wine Cellar',
              cuisine: 'Contemporary French',
              currency: '€',
              tableReservationEnabled: true,
              sections: [
                {
                  id: 'sec_1',
                  name: 'First Course (Entrées)',
                  items: [
                    {
                      id: 'm1',
                      name: 'Brittany Blue Lobster Bisque',
                      description: 'Cognac reduction, tarragon emulsion',
                      price: 32,
                      isChefSpecial: true,
                      isAvailable: true,
                    },
                    {
                      id: 'm2',
                      name: 'Heirloom Beetroot Carpaccio',
                      description: 'Whipped goat curd, toasted walnuts',
                      price: 24,
                      isVeg: true,
                      isAvailable: true,
                    },
                  ],
                },
                {
                  id: 'sec_2',
                  name: 'Main Course (Plats Principaux)',
                  items: [
                    {
                      id: 'm3',
                      name: 'Filet Mignon Rossini',
                      description: 'Truffle reduction, pomme purée',
                      price: 68,
                      isChefSpecial: true,
                      isAvailable: true,
                    },
                    {
                      id: 'm4',
                      name: 'Pan-Roasted Sea Bass',
                      description: 'Saffron emulsion, braised leeks',
                      price: 54,
                      isAvailable: true,
                    },
                  ],
                },
              ],
            }
          : undefined,
    };
  });

  const handleCategoryChange = (newCategory: CardCategory) => {
    const matchingTpl = TEMPLATES.find((t) => t.category === newCategory) || TEMPLATES[0];
    setCard((prev) => ({
      ...prev,
      category: newCategory,
      templateId: matchingTpl.id,
      customization: {
        ...prev.customization,
        ...matchingTpl.defaultCustomization,
      },
      eventDetails:
        ['wedding', 'birthday', 'event'].includes(newCategory) && !prev.eventDetails
          ? {
              venueName: 'The Belvedere Orangery',
              venueAddress: '12 Belvedere Way, Florence',
              eventDate: '2026-10-15',
              eventTime: '17:30',
              dressCode: 'Black Tie Optional',
              schedule: [
                { id: '1', time: '17:00', title: 'Welcome Reception', description: 'Refreshments served.' },
                { id: '2', time: '18:30', title: 'Main Program', description: 'Main hall.' },
              ],
            }
          : prev.eventDetails,
      menuDetails:
        newCategory === 'menu' && !prev.menuDetails
          ? {
              restaurantName: prev.profile.name || 'Le Bistro Gourmet',
              cuisine: 'Contemporary Dining',
              currency: '€',
              sections: [
                {
                  id: 'sec_1',
                  name: 'First Course',
                  items: [
                    { id: 'm1', name: 'Seasonal Soup', description: 'Artisanal garnish', price: 18, isAvailable: true },
                  ],
                },
              ],
            }
          : prev.menuDetails,
    }));
  };

  const handleSave = (publish: boolean = false) => {
    setIsSaving(true);
    setSaveStatus('');
    try {
      const updated: CardItem = {
        ...card,
        userId: user?.id || card.userId || 'guest',
        status: publish ? 'published' : card.status,
        updatedAt: new Date().toISOString(),
      };

      const saved = storageService.saveCard(updated);
      setCard(saved);
      setSaveStatus(publish ? 'Published' : 'Draft saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch {
      setSaveStatus('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const colorOptions = [
    { label: 'Slate', value: '#0F172A' },
    { label: 'Royal Blue', value: '#1E40AF' },
    { label: 'Cobalt', value: '#2563EB' },
    { label: 'Emerald', value: '#047857' },
    { label: 'Amber Gold', value: '#D97706' },
    { label: 'Bronze', value: '#B45309' },
    { label: 'Crimson Rose', value: '#BE123C' },
    { label: 'Terracotta', value: '#9A3412' },
    { label: 'Indigo', value: '#4F46E5' },
  ];

  const fontOptions: { id: FontFamily; label: string; preview: string }[] = [
    { id: 'jakarta', label: 'Plus Jakarta Sans', preview: 'Clean corporate geometric sans-serif' },
    { id: 'outfit', label: 'Outfit', preview: 'Structured modern display sans-serif' },
    { id: 'playfair', label: 'Playfair Display', preview: 'Classic editorial & formal serif' },
    { id: 'cinzel', label: 'Cinzel', preview: 'Traditional engraved formal capitals' },
    { id: 'vibes', label: 'Great Vibes', preview: 'Calligraphic script for formal invitations' },
  ];

  const bgOptions: { id: CardItem['customization']['cardBgType']; label: string; desc: string }[] = [
    { id: 'solid', label: 'Crisp Light Surface', desc: 'Clean white paper surface with dark text' },
    { id: 'dark', label: 'Executive Dark Surface', desc: 'Deep slate surface with light text' },
    { id: 'pattern', label: 'Subtle Architectural Grid', desc: 'Light surface with fine border structure' },
    { id: 'gradient', label: 'Deep Navy Contrast', desc: 'Rich dark tone for evening or executive cards' },
  ];

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${card.id}` : '';

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Workspace Action Bar */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Back + Title + Category Selector */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => setCard({ ...card, title: e.target.value })}
                  aria-label="Card Title"
                  className="font-bold text-sm sm:text-base text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none px-1 py-0.5 truncate max-w-[220px] sm:max-w-xs"
                />
                <span className="text-xs text-slate-500 capitalize">
                  · {card.status}
                </span>
              </div>
            </div>

            {/* Category Switcher */}
            <select
              value={card.category}
              onChange={(e) => handleCategoryChange(e.target.value as CardCategory)}
              aria-label="Card Category"
              className="hidden sm:block ml-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-900"
            >
              <option value="visiting">Category: Visiting Card</option>
              <option value="business">Category: Business Card</option>
              <option value="wedding">Category: Wedding Invitation</option>
              <option value="birthday">Category: Birthday Invitation</option>
              <option value="event">Category: Event Pass</option>
              <option value="menu">Category: Dining Menu</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-xs text-emerald-700 font-medium mr-1">
                {saveStatus}
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              title="QR Code"
              className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
            >
              <QrCode size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              title="Share Link"
              className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
            >
              <Share2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate('public-card', card.id)}
              title="Open Public View"
              className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
            >
              <Eye size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors whitespace-nowrap shadow-xs"
            >
              {card.status === 'published' ? 'Update Card' : 'Publish Card'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Editor Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-6 lg:p-8">
        {/* LEFT COLUMN: Structured Step-by-Step Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Segmented Step Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-3 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Contact Info
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-2 px-3 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. {card.category === 'menu' ? 'Menu Courses' : ['wedding', 'birthday', 'event'].includes(card.category) ? 'Event Schedule' : 'Social Links'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('design')}
              className={`py-2 px-3 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'design'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Appearance
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-3 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Booking & QR
            </button>
          </div>

          {/* STEP 1: PROFILE & CONTACT INFO */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Primary Identity & Contact</h3>
                  <p className="text-xs text-slate-500">Enter the details displayed at the top of your card</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  AI Writing Assistant
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {card.category === 'wedding'
                    ? 'Couple / Hosts Name'
                    : card.category === 'menu'
                    ? 'Restaurant / Venue Name'
                    : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={card.profile.name}
                  onChange={(e) => setCard({ ...card, profile: { ...card.profile, name: e.target.value } })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role / Title / Subtitle</label>
                  <input
                    type="text"
                    value={card.profile.title || ''}
                    onChange={(e) => setCard({ ...card, profile: { ...card.profile, title: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Organization / Company</label>
                  <input
                    type="text"
                    value={card.profile.company || ''}
                    onChange={(e) => setCard({ ...card, profile: { ...card.profile, company: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    {card.category === 'wedding'
                      ? 'Invitation Wording'
                      : card.category === 'menu'
                      ? 'Culinary Overview'
                      : 'Executive Summary / Bio'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="text-xs text-blue-700 hover:underline font-medium"
                  >
                    Draft with AI
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={card.profile.bio || ''}
                  onChange={(e) => setCard({ ...card, profile: { ...card.profile, bio: e.target.value } })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={card.profile.phone || ''}
                    onChange={(e) => setCard({ ...card, profile: { ...card.profile, phone: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={card.profile.email || ''}
                    onChange={(e) => setCard({ ...card, profile: { ...card.profile, email: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={card.profile.website || ''}
                    onChange={(e) => setCard({ ...card, profile: { ...card.profile, website: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Office / Location Address</label>
                  <input
                    type="text"
                    value={card.profile.address || ''}
                    onChange={(e) => setCard({ ...card, profile: { ...card.profile, address: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CATEGORY SPECIFIC DETAILS OR SOCIAL LINKS */}
          {activeTab === 'details' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              {['wedding', 'birthday', 'event'].includes(card.category) ? (
                <>
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900">Event Date, Venue & Schedule</h3>
                    <p className="text-xs text-slate-500">Configure ceremony times, venue address, and order of events</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Event Date</label>
                      <input
                        type="date"
                        value={card.eventDetails?.eventDate || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            eventDetails: { ...card.eventDetails, eventDate: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={card.eventDetails?.eventTime || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            eventDetails: { ...card.eventDetails, eventTime: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={card.eventDetails?.venueName || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            eventDetails: { ...card.eventDetails, venueName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Dress Code</label>
                      <input
                        type="text"
                        value={card.eventDetails?.dressCode || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            eventDetails: { ...card.eventDetails, dressCode: e.target.value },
                          })
                        }
                        placeholder="Black Tie Optional"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Venue Full Address</label>
                    <input
                      type="text"
                      value={card.eventDetails?.venueAddress || ''}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          eventDetails: { ...card.eventDetails, venueAddress: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  {/* Schedule items editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-800">Program Schedule</label>
                      <button
                        type="button"
                        onClick={() => {
                          const items = card.eventDetails?.schedule || [];
                          const newItem: ScheduleItem = {
                            id: `sch_${Date.now()}`,
                            time: '19:00',
                            title: 'New Schedule Item',
                            description: '',
                          };
                          setCard({
                            ...card,
                            eventDetails: {
                              ...card.eventDetails,
                              schedule: [...items, newItem],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1"
                      >
                        <Plus size={13} /> Add Item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {card.eventDetails?.schedule?.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex gap-2 items-center"
                        >
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => {
                              const sch = [...(card.eventDetails?.schedule || [])];
                              sch[idx].time = e.target.value;
                              setCard({ ...card, eventDetails: { ...card.eventDetails, schedule: sch } });
                            }}
                            className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono tabular-nums text-slate-900 text-center"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const sch = [...(card.eventDetails?.schedule || [])];
                              sch[idx].title = e.target.value;
                              setCard({ ...card, eventDetails: { ...card.eventDetails, schedule: sch } });
                            }}
                            className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-900"
                            placeholder="Activity title"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const sch = (card.eventDetails?.schedule || []).filter((_, i) => i !== idx);
                              setCard({ ...card, eventDetails: { ...card.eventDetails, schedule: sch } });
                            }}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : card.category === 'menu' ? (
                <>
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900">Dining Menu Courses & Items</h3>
                    <p className="text-xs text-slate-500">Manage course sections, dish descriptions, and pricing</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={card.menuDetails?.restaurantName || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            menuDetails: { ...card.menuDetails!, restaurantName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Currency Symbol</label>
                      <input
                        type="text"
                        value={card.menuDetails?.currency || '$'}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            menuDetails: { ...card.menuDetails!, currency: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {card.menuDetails?.sections?.map((sec, secIdx) => (
                      <div key={sec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={sec.name}
                            onChange={(e) => {
                              const secs = [...(card.menuDetails?.sections || [])];
                              secs[secIdx].name = e.target.value;
                              setCard({ ...card, menuDetails: { ...card.menuDetails!, sections: secs } });
                            }}
                            className="font-bold text-xs text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const secs = [...(card.menuDetails?.sections || [])];
                              secs[secIdx].items.push({
                                id: `item_${Date.now()}`,
                                name: 'New Dish',
                                description: 'Seasonal preparation',
                                price: 28,
                                isAvailable: true,
                              });
                              setCard({ ...card, menuDetails: { ...card.menuDetails!, sections: secs } });
                            }}
                            className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Dish
                          </button>
                        </div>

                        <div className="space-y-2">
                          {sec.items.map((item, itemIdx) => (
                            <div key={item.id} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const secs = [...(card.menuDetails?.sections || [])];
                                    secs[secIdx].items[itemIdx].name = e.target.value;
                                    setCard({ ...card, menuDetails: { ...card.menuDetails!, sections: secs } });
                                  }}
                                  className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-900"
                                  placeholder="Dish name"
                                />
                                <input
                                  type="text"
                                  value={item.price}
                                  onChange={(e) => {
                                    const secs = [...(card.menuDetails?.sections || [])];
                                    secs[secIdx].items[itemIdx].price = e.target.value;
                                    setCard({ ...card, menuDetails: { ...card.menuDetails!, sections: secs } });
                                  }}
                                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono tabular-nums text-slate-900 text-center"
                                  placeholder="Price"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const secs = [...(card.menuDetails?.sections || [])];
                                    secs[secIdx].items = secs[secIdx].items.filter((_, i) => i !== itemIdx);
                                    setCard({ ...card, menuDetails: { ...card.menuDetails!, sections: secs } });
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => {
                                  const secs = [...(card.menuDetails?.sections || [])];
                                  secs[secIdx].items[itemIdx].description = e.target.value;
                                  setCard({ ...card, menuDetails: { ...card.menuDetails!, sections: secs } });
                                }}
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600"
                                placeholder="Ingredients or preparation notes"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900">Professional Links & Profiles</h3>
                    <p className="text-xs text-slate-500">Add social and professional network links to your card</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={card.profile.socials?.linkedin || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            profile: {
                              ...card.profile,
                              socials: { ...card.profile.socials, linkedin: e.target.value },
                            },
                          })
                        }
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">X / Twitter URL</label>
                      <input
                        type="text"
                        value={card.profile.socials?.twitter || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            profile: {
                              ...card.profile,
                              socials: { ...card.profile.socials, twitter: e.target.value },
                            },
                          })
                        }
                        placeholder="https://x.com/yourhandle"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={card.profile.socials?.instagram || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            profile: {
                              ...card.profile,
                              socials: { ...card.profile.socials, instagram: e.target.value },
                            },
                          })
                        }
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: APPEARANCE & STYLING */}
          {activeTab === 'design' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">Appearance & Typography</h3>
                <p className="text-xs text-slate-500">Customize surface style, accent color, and typeface</p>
              </div>

              {/* Surface Theme */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Card Surface Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bgOptions.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() =>
                        setCard({
                          ...card,
                          customization: { ...card.customization, cardBgType: bg.id },
                        })
                      }
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        card.customization.cardBgType === bg.id
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-semibold block">{bg.label}</span>
                      <span
                        className={`text-[11px] block mt-0.5 ${
                          card.customization.cardBgType === bg.id ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {bg.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Primary Accent Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() =>
                        setCard({
                          ...card,
                          customization: { ...card.customization, themeColor: c.value },
                        })
                      }
                      className={`w-8 h-8 rounded-lg border-2 transition-transform flex items-center justify-center ${
                        card.customization.themeColor === c.value
                          ? 'border-slate-900 scale-110 shadow-xs'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {card.customization.themeColor === c.value && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Family */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Typography
                </label>
                <div className="space-y-2">
                  {fontOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() =>
                        setCard({
                          ...card,
                          customization: { ...card.customization, fontFamily: f.id },
                        })
                      }
                      className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        card.customization.fontFamily === f.id
                          ? 'bg-slate-50 border-slate-900 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{f.label}</span>
                        <span className="text-xs text-slate-500">{f.preview}</span>
                      </div>
                      {card.customization.fontFamily === f.id && <Check size={15} className="text-slate-900" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BOOKING & SHARING FEATURES */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">Interactive Features & Sharing</h3>
                <p className="text-xs text-slate-500">Choose which actions visitors can take on your published card</p>
              </div>

              <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {card.category === 'menu'
                      ? 'Enable Table Reservations'
                      : ['wedding', 'birthday', 'event'].includes(card.category)
                      ? 'Enable Online RSVP Form'
                      : 'Enable Meeting & Appointment Scheduling'}
                  </span>
                  <span className="text-xs text-slate-500">
                    Submissions appear immediately in your dashboard Bookings tab.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={card.customization.enableBookings}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      customization: { ...card.customization, enableBookings: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-slate-900 focus:ring-0 border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Enable Direct Messaging</span>
                  <span className="text-xs text-slate-500">
                    Visitors can send inquiries directly to your dashboard inbox.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={card.customization.enableEnquiries}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      customization: { ...card.customization, enableEnquiries: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-slate-900 focus:ring-0 border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Enable vCard Contact Download (.vcf)</span>
                  <span className="text-xs text-slate-500">
                    Allows mobile visitors to save your contact details with one tap.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={card.customization.enableVCard}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      customization: { ...card.customization, enableVCard: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-slate-900 focus:ring-0 border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Display QR Code Action</span>
                  <span className="text-xs text-slate-500">
                    Shows the QR code button at the top of your card for instant in-person scanning.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={card.customization.showQr}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      customization: { ...card.customization, showQr: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-slate-900 focus:ring-0 border-slate-300"
                />
              </label>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-32 w-full flex flex-col items-center">
            <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-slate-500">Live Card Preview</span>
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewportMode === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Smartphone size={12} /> Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewportMode === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Monitor size={12} /> Full
                </button>
              </div>
            </div>

            <div
              className={`w-full transition-all duration-200 ${
                viewportMode === 'mobile' ? 'max-w-[390px]' : 'max-w-lg'
              }`}
            >
              <CardRenderer card={card} isInteractive={true} isPreview={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AiCopilotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        category={card.category}
        cardTitle={card.profile.name || card.title}
        onApply={(text) => {
          setCard({
            ...card,
            profile: {
              ...card.profile,
              bio: text,
            },
          });
        }}
      />

      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={publicUrl}
        title={card.title}
        themeColor={card.customization.themeColor}
        card={card}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={publicUrl}
        title={card.title}
      />
    </div>
  );
};
