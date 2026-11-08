import React, { useState } from 'react';
import { Search, X, Eye } from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { CardCategory, TemplateDefinition, CardItem } from '../types';
import { CardRenderer } from '../components/templates/CardRenderer';
import { createInitialsSvgDataUrl } from '../services/storageService';

interface GalleryPageProps {
  navigate: (route: string, param?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const categories: { id: CardCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Templates (24)' },
    { id: 'visiting', label: 'Visiting Cards' },
    { id: 'business', label: 'Business Cards' },
    { id: 'wedding', label: 'Wedding Invitations' },
    { id: 'birthday', label: 'Birthday Invites' },
    { id: 'event', label: 'Event Passes' },
    { id: 'menu', label: 'Dining Menus' },
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getPreviewCard = (tpl: TemplateDefinition): CardItem => {
    return {
      id: `preview_${tpl.id}`,
      userId: 'preview',
      category: tpl.category,
      templateId: tpl.id,
      title: `${tpl.name} Preview`,
      slug: `preview-${tpl.id}`,
      status: 'published',
      views: 450,
      likes: 88,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        name:
          tpl.category === 'wedding'
            ? 'Eleanor Vance & Julian Thorne'
            : tpl.category === 'menu'
            ? 'L’Étoile Gastronomie Paris'
            : 'Alexander Hamilton',
        title:
          tpl.category === 'visiting'
            ? 'Managing Partner & Senior Counsel'
            : tpl.category === 'business'
            ? 'Chief Technology Officer · Apex Labs'
            : tpl.category === 'wedding'
            ? 'Marriage Ceremony & Evening Reception'
            : tpl.category === 'birthday'
            ? 'Milestone Anniversary Dinner'
            : tpl.category === 'event'
            ? 'Executive Leadership Summit Keynote'
            : 'Seasonal Tasting Menu & Wine Cellar',
        company: 'ZetaCard International',
        bio: tpl.description,
        phone: '+1 555 019 8234',
        email: 'contact@zetacard.app',
        website: 'https://zeta-card.base44.app',
        address: 'Mayfair, London · New York',
        avatarUrl: createInitialsSvgDataUrl('AH', tpl.defaultCustomization.themeColor, '#FFFFFF'),
        coverUrl: tpl.previewImage,
        socials: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
      },
      customization: tpl.defaultCustomization,
      eventDetails: ['wedding', 'birthday', 'event'].includes(tpl.category)
        ? {
            partnerName: 'Julian Thorne',
            venueName: 'The Belvedere Orangery',
            venueAddress: 'Via Belvedere 12, Florence, Italy',
            eventDate: '2026-09-18',
            eventTime: '17:00',
            dressCode: 'Black Tie Optional',
            ceremonyDetails: 'Ceremony followed by dinner reception.',
            schedule: [
              { id: '1', time: '17:00', title: 'Welcome Reception', description: 'Refreshments on the terrace.' },
              { id: '2', time: '18:30', title: 'Main Program & Dinner', description: 'Seated dinner in the main hall.' },
            ],
          }
        : undefined,
      menuDetails:
        tpl.category === 'menu'
          ? {
              restaurantName: 'L’Étoile Gastronomie',
              cuisine: 'Contemporary French Cuisine',
              currency: '€',
              sections: [
                {
                  id: 's1',
                  name: 'First Course',
                  items: [
                    { id: 'i1', name: 'Brittany Lobster Bisque', description: 'Cognac reduction, tarragon emulsion', price: 34, isChefSpecial: true },
                    { id: 'i2', name: 'Heirloom Beetroot Carpaccio', description: 'Whipped goat curd, toasted walnuts', price: 26, isVeg: true },
                  ],
                },
              ],
            }
          : undefined,
    };
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
            Template Directory
          </h1>
          <p className="mt-1 text-slate-600 text-sm">
            Select a layout below to customize contact fields, typography, schedules, or menus.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, category, or keyword..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Segmented Category Filter Bar */}
      <div className="my-6 flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg overflow-x-auto">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600 text-sm">No templates match your current filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="group rounded-xl bg-white border border-slate-200 hover:border-slate-300 overflow-hidden transition-colors flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative h-44 overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tpl)}
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-md bg-white/95 hover:bg-white border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <span className="capitalize">{tpl.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tpl.tags.slice(0, 2).join(' · ')}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tpl)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Inspect Layout
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('editor', tpl.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors whitespace-nowrap"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Modal Preview */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 text-slate-900 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500 capitalize">
                  {previewTemplate.category} · {previewTemplate.tags.join(' · ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CardRenderer
                card={getPreviewCard(previewTemplate)}
                isInteractive={false}
                isPreview={true}
              />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const tplId = previewTemplate.id;
                  setPreviewTemplate(null);
                  navigate('editor', tplId);
                }}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
