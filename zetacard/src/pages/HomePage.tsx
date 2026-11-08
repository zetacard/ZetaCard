import React, { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { CardCategory } from '../types';
import { storageService } from '../services/storageService';
import { CardRenderer } from '../components/templates/CardRenderer';

interface HomePageProps {
  navigate: (route: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [activeHeroTab, setActiveHeroTab] = useState<'visiting' | 'wedding' | 'menu'>('visiting');

  const sampleCards = storageService.getCards();
  const heroCardVisiting = sampleCards.find((c) => c.category === 'visiting') || sampleCards[0];
  const heroCardWedding = sampleCards.find((c) => c.category === 'wedding') || sampleCards[1] || sampleCards[0];
  const heroCardMenu = sampleCards.find((c) => c.category === 'menu') || sampleCards[2] || sampleCards[0];

  const currentHeroCard =
    activeHeroTab === 'wedding'
      ? heroCardWedding
      : activeHeroTab === 'menu'
      ? heroCardMenu
      : heroCardVisiting;

  const categoriesList: {
    id: CardCategory;
    index: string;
    title: string;
    description: string;
    meta: string;
  }[] = [
    {
      id: 'visiting',
      index: '01',
      title: 'Digital Visiting Cards',
      description: 'Personal executive identity cards with 1-tap vCard address book saving, direct phone/email links, and QR code sharing.',
      meta: '4 Templates · vCard & QR',
    },
    {
      id: 'business',
      index: '02',
      title: 'Executive Business Cards',
      description: 'Standardized credentials for founders, advisory teams, and consultants with integrated appointment scheduling.',
      meta: '4 Templates · Appointment Booking',
    },
    {
      id: 'wedding',
      index: '03',
      title: 'Formal Wedding Invitations',
      description: 'Editorial wedding stationery featuring ceremony timelines, venue addresses, dress codes, and online RSVP tracking.',
      meta: '4 Templates · RSVP & Calendar',
    },
    {
      id: 'birthday',
      index: '04',
      title: 'Milestone & Birthday Invites',
      description: 'Structured event invitations for milestone anniversaries, private dinners, and receptions with guest counters.',
      meta: '4 Templates · Guest Count RSVP',
    },
    {
      id: 'event',
      index: '05',
      title: 'Conference & Gala Passes',
      description: 'Professional delegate passes for leadership summits, corporate briefings, and annual charity galas.',
      meta: '4 Templates · Schedule & Registration',
    },
    {
      id: 'menu',
      index: '06',
      title: 'Interactive Restaurant Menus',
      description: 'Contactless dining and tasting menus with course sections, dietary indicators, tabular pricing, and table bookings.',
      meta: '4 Templates · Table Reservations',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      {/* HERO SECTION */}
      <section className="py-12 lg:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Proposition & Action */}
            <div className="lg:col-span-7 space-y-6 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Digital Identity & Stationery Platform</span>
                <span aria-hidden="true">·</span>
                <span>Founded by Shahid Tufail</span>
              </div>

              <h1
                className="font-bold tracking-tight text-slate-900 font-outfit leading-[1.12] max-w-2xl"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
              >
                Professional Digital Cards, Invitations, and Menus.
              </h1>

              <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                Create and share structured digital visiting cards, corporate credentials, formal event invitations, and interactive dining menus. Includes instant QR code export, 1-tap vCard contact saving, and integrated booking management.
              </p>

              {/* Primary CTA & Secondary Link */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('editor', 'new')}
                  className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs"
                >
                  <span>Create Digital Card</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('gallery')}
                  className="px-5 py-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  Browse 24 Templates
                </button>
              </div>

              {/* Clean Unboxed Key Facts */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums block">24</span>
                  <span className="text-xs text-slate-500">Curated Templates</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums block">6</span>
                  <span className="text-xs text-slate-500">Product Categories</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums block">100%</span>
                  <span className="text-xs text-slate-500">Free Forever</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Segmented Filter Control */}
              <div className="w-full max-w-md mb-4 p-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('visiting')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activeHeroTab === 'visiting'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Visiting Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('wedding')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activeHeroTab === 'wedding'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Event Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('menu')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activeHeroTab === 'menu'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dining Menu
                </button>
              </div>

              <div className="w-full max-w-md">
                {currentHeroCard && (
                  <CardRenderer card={currentHeroCard} isInteractive={true} isPreview={false} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 PRODUCT CATEGORIES */}
      <section className="py-16 lg:py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
              Built for Executive Identity, Hospitality, and Formal Events
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Select a specialized format below. Every category includes purpose-built fields, clean typography, and instant mobile sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesList.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate('gallery')}
                className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-mono font-semibold text-slate-900">{cat.index}.</span>
                    <span>{cat.meta}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                  <span>Explore Templates</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLATES */}
      <section className="py-16 lg:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
                Featured Templates
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Ready-to-use layouts designed for clarity and high legibility on any screen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('gallery')}
              className="text-xs font-semibold text-slate-900 hover:text-blue-700 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View All 24 Templates</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.slice(0, 8).map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-xl bg-white border border-slate-200 hover:border-slate-300 overflow-hidden transition-colors flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span className="capitalize">{tpl.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tpl.tags[0]}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{tpl.tags.slice(0, 2).join(' · ')}</span>
                    <button
                      type="button"
                      onClick={() => navigate('editor', tpl.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors whitespace-nowrap"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS & FOUNDER ATTRIBUTION */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
                Three Steps to Publish Your Card
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">01. Select a Template</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Choose from 24 structured templates across visiting cards, corporate credentials, wedding invitations, and dining menus.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">02. Enter Your Details</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Add your contact information, schedule of events, or menu items. Use the integrated AI Writing Assistant to draft concise bios or formal wording.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">03. Share via Link, QR, or vCard</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Publish immediately with a unique share link and high-resolution QR code. Manage incoming bookings, RSVPs, and direct inquiries from your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 rounded-xl bg-white border border-slate-200 space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Leadership & Product Vision
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit">
                Designed for Clarity and Reliability
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                "ZetaCard was built to give professionals, organizations, and event hosts a dependable, distraction-free way to share their credentials, schedules, and menus—without paywalls or complex setup."
              </p>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">Shahid Tufail</p>
                <p className="text-xs text-slate-500">Founder & Creator of ZetaCard</p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('editor', 'new')}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  Start Creating Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
