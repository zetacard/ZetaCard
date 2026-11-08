import React from 'react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & Founder Attribution */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-base font-bold tracking-tight text-slate-900 block">
              ZetaCard
            </span>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Professional digital visiting cards, corporate credentials, formal event invitations, and interactive hospitality menus.
            </p>
            <p className="text-slate-600 text-xs pt-1">
              Founded & Created by <strong className="text-slate-900 font-semibold">Shahid Tufail</strong>
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs mb-3">Solutions</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => navigate('gallery')} className="hover:text-slate-900 transition-colors">
                  Digital Visiting Cards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('gallery')} className="hover:text-slate-900 transition-colors">
                  Executive Business Cards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('gallery')} className="hover:text-slate-900 transition-colors">
                  Wedding & Event Invitations
                </button>
              </li>
              <li>
                <button onClick={() => navigate('gallery')} className="hover:text-slate-900 transition-colors">
                  Interactive Dining Menus
                </button>
              </li>
            </ul>
          </div>

          {/* Workspace */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs mb-3">Workspace</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => navigate('editor')} className="hover:text-slate-900 transition-colors">
                  Card Editor
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-slate-900 transition-colors">
                  Dashboard & Bookings
                </button>
              </li>
              <li>
                <button onClick={() => navigate('how-it-works')} className="hover:text-slate-900 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('settings')} className="hover:text-slate-900 transition-colors">
                  Account & Portability
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs mb-3">Legal & Contact</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => navigate('legal')} className="hover:text-slate-900 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal')} className="hover:text-slate-900 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-slate-900 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <a href="mailto:zetacard@outlook.com" className="hover:text-slate-900 transition-colors">
                  zetacard@outlook.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ZetaCard. Original Product by Shahid Tufail.</p>
          <div className="flex items-center gap-4">
            <a
              href="/api/download-source"
              download="zetacard-source-code.zip"
              className="font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2"
            >
              Download Full App Source (.ZIP)
            </a>
            <span>·</span>
            <span>Free digital card creation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
