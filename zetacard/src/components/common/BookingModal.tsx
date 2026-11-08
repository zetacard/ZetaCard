import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { CardItem } from '../../types';
import { storageService } from '../../services/storageService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardItem;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, card }) => {
  const isMenu = card.category === 'menu';
  const isEvent = ['wedding', 'birthday', 'event'].includes(card.category);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(card.eventDetails?.eventDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(card.eventDetails?.eventTime || '14:00');
  const [guests, setGuests] = useState(isEvent ? 2 : 1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide your full name and email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      storageService.submitBooking({
        cardId: card.id,
        cardTitle: card.title,
        ownerId: card.userId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date,
        time,
        guests: Number(guests) || 1,
        notes: notes.trim(),
      });

      storageService.trackEvent(card.id, 'booking_start');
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    if (isMenu) return 'Table Reservation';
    if (isEvent) return 'RSVP Confirmation';
    return 'Schedule Appointment';
  };

  const getModalSubtitle = () => {
    if (isMenu) return `Reserve a table at ${card.menuDetails?.restaurantName || card.title}`;
    if (isEvent) return `Confirm your attendance for ${card.title}`;
    return `Request a meeting with ${card.profile.name}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 text-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-base text-slate-900">{getModalTitle()}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{getModalSubtitle()}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 size={26} />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {isEvent ? 'RSVP Confirmed' : 'Booking Request Received'}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you, <strong className="text-slate-900">{name}</strong>. Your submission has been recorded for <strong className="text-slate-900">{date}</strong> at <strong className="text-slate-900">{time}</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alexander Hamilton"
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
                  placeholder="alexander@company.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isEvent ? 'Attendees' : 'Participants'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isEvent ? 'Dietary Notes or Message' : 'Meeting Agenda / Notes'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific requirements or topics..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors"
              >
                {isSubmitting ? 'Submitting...' : isEvent ? 'Confirm RSVP' : 'Submit Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
