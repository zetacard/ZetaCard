import React, { useState } from 'react';
import { Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { storageService } from '../services/storageService';

interface ContactSupportPageProps {
  navigate: (route: string) => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      storageService.submitEnquiry({
        cardId: 'platform_support',
        cardTitle: 'ZetaCard Help & Support',
        ownerId: 'user_founder_01',
        name,
        email,
        subject: `[Support] ${subject}`,
        message,
      });
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-slate-900 space-y-6">
      <button
        type="button"
        onClick={() => navigate('home')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Home
      </button>

      <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 font-outfit">Contact Support</h1>
          <p className="text-xs text-slate-500">
            Have questions about your digital cards, invitations, or custom deployment? Send us a message below.
          </p>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Support Request Submitted</h3>
            <p className="text-xs text-slate-600">
              Thank you for contacting us. Our team will reply to <strong className="text-slate-900">{email}</strong> promptly.
            </p>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shahid Tufail"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enterprise card branding inquiry"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>

            <div className="text-center pt-2 text-xs text-slate-500">
              Direct Email:{' '}
              <a href="mailto:zetacard@outlook.com" className="text-slate-800 hover:underline font-medium">
                zetacard@outlook.com
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
