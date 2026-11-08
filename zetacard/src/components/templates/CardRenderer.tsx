import React, { useEffect, useState } from 'react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  QrCode,
  Share2,
  Download,
  MessageSquare,
  ExternalLink,
  Maximize2,
  Contact,
  Link2,
} from 'lucide-react';
import { CardItem } from '../../types';
import { exportService } from '../../services/exportService';
import { QrModal } from '../common/QrModal';
import { ShareModal } from '../common/ShareModal';
import { BookingModal } from '../common/BookingModal';
import { EnquiryModal } from '../common/EnquiryModal';

interface CardRendererProps {
  card: CardItem;
  isInteractive?: boolean;
  isPreview?: boolean;
}

export const CardRenderer: React.FC<CardRendererProps> = ({
  card,
  isInteractive = true,
}) => {
  const [showQr, setShowQr] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [inlineQrUrl, setInlineQrUrl] = useState<string>('');
  const [inlineQrMode, setInlineQrMode] = useState<'link' | 'vcard'>('link');

  const themeColor = card.customization?.themeColor || '#0F172A';
  const fontFamily = card.customization?.fontFamily || 'jakarta';
  const bgType = card.customization?.cardBgType || 'solid';

  const isDarkCard = ['dark', 'gradient', 'mesh', 'glass'].includes(bgType);

  const fontClass =
    {
      cinzel: 'font-cinzel',
      vibes: 'font-vibes',
      playfair: 'font-playfair',
      outfit: 'font-outfit',
      jakarta: 'font-jakarta',
    }[fontFamily] || 'font-jakarta';

  const p = card.profile;
  const ev = card.eventDetails;
  const menu = card.menuDetails;
  const isMenu = card.category === 'menu';
  const isEvent = ['wedding', 'birthday', 'event'].includes(card.category);
  const isVisitingOrBusiness = ['visiting', 'business'].includes(card.category);

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${card.id}` : '';
  const trackedQrUrl = currentUrl ? `${currentUrl}?src=qr` : '';

  const initials = (p.name || 'ZC')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (card.customization?.showQr === false) return;
    const payload =
      inlineQrMode === 'vcard'
        ? exportService.buildVCardString(card)
        : trackedQrUrl || `https://zetacard.app/c/${card.id}`;

    exportService
      .generateQrDataUrl(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: themeColor || '#0f172a',
          light: '#ffffff',
        },
        badgeText: initials,
        badgeColor: themeColor || '#0f172a',
      })
      .then(setInlineQrUrl);
  }, [
    card,
    card.id,
    card.customization?.showQr,
    themeColor,
    initials,
    inlineQrMode,
    trackedQrUrl,
  ]);

  const categoryLabels: Record<string, string> = {
    visiting: 'Visiting Card',
    business: 'Business Card',
    wedding: 'Wedding Invitation',
    birthday: 'Celebration Invitation',
    event: 'Event Pass',
    menu: 'Dining Menu',
  };

  const containerStyle = isDarkCard
    ? 'bg-slate-900 text-slate-100 border border-slate-800'
    : 'bg-white text-slate-900 border border-slate-200';

  const subSurfaceStyle = isDarkCard
    ? 'bg-slate-800/60 border border-slate-700/80 text-slate-200'
    : 'bg-slate-50 border border-slate-200 text-slate-700';

  const mutedTextStyle = isDarkCard ? 'text-slate-400' : 'text-slate-500';
  const dividerStyle = isDarkCard ? 'border-slate-800' : 'border-slate-200';

  return (
    <div className={`w-full max-w-lg mx-auto ${fontClass} relative`}>
      <div className={`rounded-2xl overflow-hidden shadow-sm ${containerStyle}`}>
        {/* Cover Banner or Clean Accent Header */}
        {p.coverUrl && !coverError ? (
          <div className="relative h-40 w-full overflow-hidden bg-slate-200">
            <img
              src={p.coverUrl}
              alt={card.title}
              referrerPolicy="no-referrer"
              onError={() => setCoverError(true)}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                isDarkCard ? 'from-slate-900 via-slate-900/30' : 'from-black/50 via-black/15'
              } to-transparent`}
            />
          </div>
        ) : (
          <div
            className="h-24 w-full"
            style={{
              backgroundColor: themeColor,
            }}
          />
        )}

        {/* Content Body */}
        <div className="px-6 sm:px-7 pb-7 -mt-10 relative z-10">
          {/* Header Row: Avatar + Utility Actions */}
          <div className="flex items-end justify-between gap-4">
            {p.avatarUrl && !avatarError ? (
              <img
                src={p.avatarUrl}
                alt={p.name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className={`w-20 h-20 rounded-xl object-cover border-2 shadow-sm ${
                  isDarkCard ? 'border-slate-900 bg-slate-800' : 'border-white bg-slate-100'
                }`}
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-xl text-white border-2 shadow-sm ${
                  isDarkCard ? 'border-slate-900' : 'border-white'
                }`}
                style={{ backgroundColor: themeColor }}
              >
                {initials}
              </div>
            )}

            {isInteractive && (
              <div className="flex items-center gap-2 mb-1">
                {card.customization?.showQr !== false && (
                  <button
                    type="button"
                    onClick={() => setShowQr(true)}
                    title="Show Event QR Code"
                    className={`p-2 rounded-lg border transition-colors ${
                      isDarkCard
                        ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <QrCode size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowShare(true)}
                  title="Share Card"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDarkCard
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Share2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Unboxed Metadata Kicker + Name + Title */}
          <div className="mt-4">
            <div className={`flex items-center gap-1.5 text-xs ${mutedTextStyle}`}>
              <span>{categoryLabels[card.category] || 'Digital Card'}</span>
              {p.company && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{p.company}</span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 leading-snug">
              {p.name}
            </h1>

            {p.title && (
              <p className={`text-sm font-medium mt-0.5 ${isDarkCard ? 'text-slate-300' : 'text-slate-600'}`}>
                {p.title}
              </p>
            )}
          </div>

          {/* Bio / Invitation Wording */}
          {p.bio && (
            <p
              className={`mt-4 text-sm leading-relaxed whitespace-pre-line ${
                isDarkCard ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {p.bio}
            </p>
          )}

          {/* === EVENT DETAILS (WEDDING / BIRTHDAY / EVENT) === */}
          {isEvent && ev && (
            <div className={`mt-6 pt-5 border-t ${dividerStyle} space-y-4`}>
              <div className={`p-4 rounded-xl ${subSurfaceStyle} grid grid-cols-2 gap-3 text-left`}>
                {ev.eventDate && (
                  <div>
                    <span className={`text-xs block ${mutedTextStyle}`}>Date</span>
                    <p className="text-xs sm:text-sm font-semibold mt-0.5 tabular-nums">
                      {new Date(ev.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {ev.eventTime && (
                  <div>
                    <span className={`text-xs block ${mutedTextStyle}`}>Time</span>
                    <p className="text-xs sm:text-sm font-semibold mt-0.5 tabular-nums">{ev.eventTime}</p>
                  </div>
                )}

                {ev.venueName && (
                  <div className={`col-span-2 pt-2.5 border-t ${dividerStyle}`}>
                    <span className={`text-xs block ${mutedTextStyle}`}>Venue</span>
                    <p className="text-xs sm:text-sm font-semibold mt-0.5">{ev.venueName}</p>
                    {ev.venueAddress && <p className={`text-xs mt-0.5 ${mutedTextStyle}`}>{ev.venueAddress}</p>}
                  </div>
                )}
              </div>

              {(ev.ceremonyDetails || ev.dressCode) && (
                <div className={`text-xs space-y-1.5 ${isDarkCard ? 'text-slate-300' : 'text-slate-600'}`}>
                  {ev.dressCode && (
                    <p>
                      <strong className={isDarkCard ? 'text-white' : 'text-slate-900'}>Dress Code:</strong> {ev.dressCode}
                    </p>
                  )}
                  {ev.ceremonyDetails && <p>{ev.ceremonyDetails}</p>}
                </div>
              )}

              {/* Schedule / Timeline */}
              {ev.schedule && ev.schedule.length > 0 && (
                <div className="pt-2">
                  <h4 className={`text-xs font-semibold mb-2.5 ${mutedTextStyle}`}>
                    Schedule of Events
                  </h4>
                  <div className={`divide-y ${dividerStyle} border rounded-xl overflow-hidden ${dividerStyle}`}>
                    {ev.schedule.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-3 flex items-baseline gap-3 text-xs ${
                          isDarkCard ? 'bg-slate-800/40' : 'bg-white'
                        }`}
                      >
                        <span className="font-mono font-semibold tabular-nums shrink-0 w-12" style={{ color: themeColor }}>
                          {item.time}
                        </span>
                        <div>
                          <h5 className="font-semibold">{item.title}</h5>
                          {item.description && <p className={`mt-0.5 ${mutedTextStyle}`}>{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isInteractive && (
                <button
                  type="button"
                  onClick={() => exportService.downloadICalendar(card)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isDarkCard
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Calendar size={14} />
                  <span>Add to Calendar (.ics)</span>
                </button>
              )}
            </div>
          )}

          {/* === RESTAURANT MENU DETAILS === */}
          {isMenu && menu && (
            <div className={`mt-6 pt-5 border-t ${dividerStyle} space-y-5`}>
              {menu.restaurantName && (
                <div>
                  <h3 className="text-base font-bold">{menu.restaurantName}</h3>
                  <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${mutedTextStyle}`}>
                    {menu.cuisine && <span>{menu.cuisine}</span>}
                    {menu.cuisine && menu.tagline && <span aria-hidden="true">·</span>}
                    {menu.tagline && <span>{menu.tagline}</span>}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {menu.sections?.map((section) => (
                  <div key={section.id} className="space-y-2.5">
                    <div className={`pb-1.5 border-b ${dividerStyle}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{section.name}</h4>
                      {section.description && <p className={`text-xs mt-0.5 ${mutedTextStyle}`}>{section.description}</p>}
                    </div>

                    <div className={`divide-y ${dividerStyle}`}>
                      {section.items?.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-baseline justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="font-semibold">{item.name}</span>
                              {(item.isChefSpecial || item.isVeg) && (
                                <span className={`text-xs ${mutedTextStyle}`}>
                                  {[item.isChefSpecial ? 'Chef Selection' : '', item.isVeg ? 'Vegetarian' : '']
                                    .filter(Boolean)
                                    .join(' · ')}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className={`text-xs mt-0.5 ${mutedTextStyle}`}>{item.description}</p>
                            )}
                          </div>
                          <span className="font-mono font-semibold text-xs sm:text-sm tabular-nums whitespace-nowrap">
                            {menu.currency || '$'}
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === DIRECT CONTACT DETAILS === */}
          {(p.phone || p.email || p.website || p.address) && (
            <div className={`mt-6 pt-5 border-t ${dividerStyle} space-y-2`}>
              {p.phone && (
                <a
                  href={`tel:${p.phone}`}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm transition-colors ${subSurfaceStyle} hover:opacity-90`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Phone size={15} className="shrink-0 opacity-70" />
                    <span className="font-medium tabular-nums truncate">{p.phone}</span>
                  </div>
                  <span className={`text-xs ${mutedTextStyle} shrink-0`}>Call</span>
                </a>
              )}

              {p.email && (
                <a
                  href={`mailto:${p.email}`}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm transition-colors ${subSurfaceStyle} hover:opacity-90`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail size={15} className="shrink-0 opacity-70" />
                    <span className="font-medium truncate">{p.email}</span>
                  </div>
                  <span className={`text-xs ${mutedTextStyle} shrink-0`}>Email</span>
                </a>
              )}

              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm transition-colors ${subSurfaceStyle} hover:opacity-90`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Globe size={15} className="shrink-0 opacity-70" />
                    <span className="font-medium truncate">{p.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <ExternalLink size={13} className="shrink-0 opacity-60" />
                </a>
              )}

              {p.address && (
                <div className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-xs sm:text-sm ${subSurfaceStyle}`}>
                  <MapPin size={15} className="shrink-0 opacity-70" />
                  <span className="truncate">{p.address}</span>
                </div>
              )}
            </div>
          )}

          {/* Social Links as Clean Unboxed Text Links */}
          {p.socials && Object.values(p.socials).some(Boolean) && (
            <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${mutedTextStyle}`}>
              {Object.entries(p.socials)
                .filter(([, link]) => Boolean(link))
                .map(([net, link], idx, arr) => (
                  <React.Fragment key={net}>
                    <a
                      href={link!.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`capitalize hover:underline font-medium ${
                        isDarkCard ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {net}
                    </a>
                    {idx < arr.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
            </div>
          )}

          {/* PRIMARY CALL TO ACTION BUTTONS */}
          {isInteractive && (
            <div className="mt-6 space-y-2.5">
              {isVisitingOrBusiness && card.customization?.enableVCard && (
                <button
                  type="button"
                  onClick={() => exportService.downloadVCard(card)}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-95 shadow-xs"
                  style={{ backgroundColor: themeColor }}
                >
                  <Download size={15} />
                  <span>Save Contact (vCard)</span>
                </button>
              )}

              {card.customization?.enableBookings && (
                <button
                  type="button"
                  onClick={() => setShowBooking(true)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isVisitingOrBusiness
                      ? isDarkCard
                        ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      : 'text-white shadow-xs hover:opacity-95'
                  }`}
                  style={!isVisitingOrBusiness ? { backgroundColor: themeColor } : {}}
                >
                  <Calendar size={15} />
                  <span>
                    {isMenu ? 'Reserve a Table' : isEvent ? 'Confirm RSVP' : 'Schedule Meeting'}
                  </span>
                </button>
              )}

              {card.customization?.enableEnquiries && (
                <button
                  type="button"
                  onClick={() => setShowEnquiry(true)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isDarkCard
                      ? 'bg-transparent hover:bg-slate-800 border-slate-700 text-slate-300'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <MessageSquare size={14} />
                  <span>Send Direct Message</span>
                </button>
              )}
            </div>
          )}

          {/* === INLINE CUSTOM EVENT QR CODE SHARE SECTION === */}
          {card.customization?.showQr !== false && (
            <div className={`mt-6 pt-5 border-t ${dividerStyle}`}>
              <div className={`p-4 rounded-xl ${subSurfaceStyle} flex flex-col sm:flex-row items-center gap-4`}>
                <button
                  type="button"
                  onClick={() => isInteractive && setShowQr(true)}
                  title="Click to enlarge QR pass for event scanning"
                  className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0 group relative cursor-pointer"
                >
                  {inlineQrUrl ? (
                    <img
                      src={inlineQrUrl}
                      alt={`${p.name} Custom Event QR Code`}
                      className="w-28 h-28 object-contain"
                    />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center text-[11px] text-slate-400">
                      Loading QR...
                    </div>
                  )}
                </button>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode size={14} className="shrink-0 opacity-80" />
                    <span className="text-xs font-bold tracking-tight">
                      Instant Event QR Pass
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${mutedTextStyle}`}>
                    {inlineQrMode === 'vcard'
                      ? 'Point any smartphone camera to save contact details directly to phone.'
                      : 'Scan at conferences, receptions, or events to open & save this card.'}
                  </p>

                  {/* Mode Switcher + Expand Actions */}
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => setInlineQrMode('link')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                        inlineQrMode === 'link'
                          ? isDarkCard
                            ? 'bg-white text-slate-900 border-white'
                            : 'bg-slate-900 text-white border-slate-900'
                          : isDarkCard
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Link2 size={11} />
                      <span>Card URL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInlineQrMode('vcard')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                        inlineQrMode === 'vcard'
                          ? isDarkCard
                            ? 'bg-white text-slate-900 border-white'
                            : 'bg-slate-900 text-white border-slate-900'
                          : isDarkCard
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Contact size={11} />
                      <span>vCard QR</span>
                    </button>

                    {isInteractive && (
                      <button
                        type="button"
                        onClick={() => setShowQr(true)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                          isDarkCard
                            ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Maximize2 size={11} />
                        <span>Customize & Badge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Attribution */}
          <div className={`mt-6 pt-4 border-t ${dividerStyle} flex items-center justify-between text-[11px] ${mutedTextStyle}`}>
            <span>ZetaCard Digital Identity</span>
            <span>By Shahid Tufail</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QrModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        url={currentUrl}
        title={card.title}
        themeColor={themeColor}
        card={card}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={currentUrl}
        title={card.title}
      />

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        card={card}
      />

      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        card={card}
      />
    </div>
  );
};
