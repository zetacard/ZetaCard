import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  navigate: (route: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ navigate }) => {
  const [tab, setTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-900 space-y-6">
      <button
        type="button"
        onClick={() => navigate('home')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Home
      </button>

      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg border border-slate-200 w-max">
        <button
          type="button"
          onClick={() => setTab('privacy')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'privacy' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setTab('terms')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'terms' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Terms of Service
        </button>
      </div>

      <div className="p-8 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 space-y-5 leading-relaxed">
        {tab === 'privacy' ? (
          <>
            <h1 className="text-2xl font-bold text-slate-900 font-outfit">ZetaCard Privacy Policy</h1>
            <p className="text-xs text-slate-500">Product: ZetaCard · Founder & Creator: Shahid Tufail</p>

            <h2 className="text-base font-bold text-slate-900 mt-4">1. Commitment to Privacy</h2>
            <p>
              At ZetaCard, founded by Shahid Tufail, we adhere to strict default-deny privacy principles. We collect only the information necessary to provide and operate digital cards, event invitations, restaurant menus, bookings, and customer enquiries.
            </p>

            <h2 className="text-base font-bold text-slate-900 mt-4">2. Public vs. Private Information</h2>
            <p>
              When you publish a digital card, the profile details you designate (such as display name, title, contact telephone, public email, address, and menu items) become accessible to visitors who scan your QR code or navigate to your unique link. Private user account credentials and dashboard logs are never disclosed in public endpoints.
            </p>

            <h2 className="text-base font-bold text-slate-900 mt-4">3. Data Portability & Deletion (GDPR)</h2>
            <p>
              Users retain unconditional rights to export their complete dataset in portable JSON format, as well as execute the <code>deleteMyData</code> operation to permanently delete their profile, cards, and booking logs.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 font-outfit">ZetaCard Terms of Service</h1>
            <p className="text-xs text-slate-500">Product: ZetaCard · Founder & Creator: Shahid Tufail</p>

            <h2 className="text-base font-bold text-slate-900 mt-4">1. Acceptance of Terms</h2>
            <p>
              By utilizing the ZetaCard digital card platform, you agree to comply with these Terms of Service. ZetaCard provides free digital card creation, wedding invitation hosting, and restaurant menu displays with zero hidden fees.
            </p>

            <h2 className="text-base font-bold text-slate-900 mt-4">2. Permitted Use</h2>
            <p>
              Users may create digital visiting cards, executive portfolios, wedding invitations, birthday celebrations, conference tickets, and dining menus. Users agree not to publish deceptive, malicious, or defamatory materials.
            </p>

            <h2 className="text-base font-bold text-slate-900 mt-4">3. Intellectual Property</h2>
            <p>
              ZetaCard, including its original product workflows, brand design, and architecture, is the intellectual property of founder Shahid Tufail. Users retain copyright over the personalized logos, text, and imagery they upload to their cards.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
