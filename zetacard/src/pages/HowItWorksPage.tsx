import React from 'react';

interface HowItWorksPageProps {
  navigate: (route: string, param?: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-900 space-y-12">
      <div className="max-w-2xl space-y-2">
        <span className="text-xs font-semibold text-slate-500 block">
          Platform Documentation
        </span>
        <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">
          How ZetaCard Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From executive business credentials to contactless dining menus and formal event invitations, ZetaCard streamlines digital publishing and guest management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
          <span className="font-mono text-sm font-bold text-slate-900">01.</span>
          <h3 className="text-base font-bold text-slate-900">Select From 24 Templates</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every category—visiting cards, corporate business, weddings, birthdays, conferences, and restaurant menus—features clean, high-contrast layouts with curated typography.
          </p>
          <button
            type="button"
            onClick={() => navigate('gallery')}
            className="text-xs font-semibold text-blue-700 hover:underline pt-1 inline-block"
          >
            Browse Template Directory →
          </button>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
          <span className="font-mono text-sm font-bold text-slate-900">02.</span>
          <h3 className="text-base font-bold text-slate-900">Customize & Draft with AI</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Use the step-by-step editor to update contact details, schedules, or menu sections. Use the AI Writing Assistant to draft concise executive summaries or formal invitation wording.
          </p>
          <button
            type="button"
            onClick={() => navigate('editor', 'new')}
            className="text-xs font-semibold text-blue-700 hover:underline pt-1 inline-block"
          >
            Open Card Editor →
          </button>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
          <span className="font-mono text-sm font-bold text-slate-900">03.</span>
          <h3 className="text-base font-bold text-slate-900">QR Code & 1-Tap vCard Export</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Download high-resolution QR codes for print or mobile sharing. Visitors can save your contact information directly into their phone address book (.vcf) or calendar (.ics).
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
          <span className="font-mono text-sm font-bold text-slate-900">04.</span>
          <h3 className="text-base font-bold text-slate-900">Manage Bookings, RSVPs & Inquiries</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Clients and guests can schedule appointments, confirm event attendance, or reserve dining tables directly on your card. Review and confirm all submissions in your dashboard.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-outfit">Ready to create your digital card?</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Free digital card creation with zero paywalls or subscription requirements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('editor', 'new')}
          className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs whitespace-nowrap shrink-0 transition-colors"
        >
          Create Digital Card
        </button>
      </div>
    </div>
  );
};
