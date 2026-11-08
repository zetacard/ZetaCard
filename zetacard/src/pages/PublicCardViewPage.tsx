import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Share2,
  QrCode,
  IdCard,
  Link2,
  Contact,
  Download,
  Copy,
  Check,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { CardItem } from '../types';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';
import { CardRenderer } from '../components/templates/CardRenderer';
import { QrModal } from '../components/common/QrModal';
import { ShareModal } from '../components/common/ShareModal';

interface PublicCardViewPageProps {
  cardId: string;
  navigate: (route: string, param?: string) => void;
}

export const PublicCardViewPage: React.FC<PublicCardViewPageProps> = ({ cardId, navigate }) => {
  const [card, setCard] = useState<CardItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Dedicated Event QR Pass presentation mode for fast in-person scanning
  const [eventPassMode, setEventPassMode] = useState(false);
  const [qrMode, setQrMode] = useState<'link' | 'vcard'>('link');
  const [qrColor, setQrColor] = useState<string>('#0f172a');
  const [showMonogram, setShowMonogram] = useState<boolean>(true);
  const [eventQrDataUrl, setEventQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const isQrScan =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('src') === 'qr';

    const found = storageService.getCardById(cardId);
    if (found) {
      setCard(found);
      setQrColor(found.customization?.themeColor || '#0f172a');
      storageService.trackEvent(found.id, 'view');
      if (isQrScan) {
        storageService.trackEvent(found.id, 'qr_scan');
      }
      setIsLoading(false);
    } else {
      fetch(`/api/cards/${cardId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((apiCard) => {
          if (apiCard) {
            setCard(apiCard);
            setQrColor(apiCard.customization?.themeColor || '#0f172a');
            storageService.trackEvent(apiCard.id, 'view');
            if (isQrScan) {
              storageService.trackEvent(apiCard.id, 'qr_scan');
            }
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [cardId]);

  const cleanCardUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/c/${card?.id || cardId}`
      : '';
  const trackedQrUrl = cleanCardUrl ? `${cleanCardUrl}?src=qr` : '';

  const initials = (card?.profile?.name || card?.title || 'ZC')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const activeQrPayload =
    qrMode === 'vcard' && card
      ? exportService.buildVCardString(card)
      : trackedQrUrl || cleanCardUrl;

  useEffect(() => {
    if (!card || !activeQrPayload) return;
    exportService
      .generateQrDataUrl(activeQrPayload, {
        width: 520,
        margin: 2,
        color: {
          dark: qrColor || '#0f172a',
          light: '#ffffff',
        },
        badgeText: showMonogram ? initials : undefined,
        badgeColor: qrColor || '#0f172a',
      })
      .then(setEventQrDataUrl);
  }, [card, activeQrPayload, qrColor, showMonogram, initials]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanCardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleDownloadBadge = () => {
    if (!card) return;
    exportService.downloadEventQrBadge({
      qrPayload: activeQrPayload,
      title: card.profile.name || card.title,
      subtitle: card.profile.title,
      company:
        card.profile.company ||
        card.eventDetails?.venueName ||
        card.menuDetails?.restaurantName,
      categoryLabel:
        qrMode === 'vcard'
          ? 'INSTANT CONTACT PASS (VCARD)'
          : `${card.category.toUpperCase()} EVENT PASS`,
      darkColor: qrColor || '#0f172a',
      badgeText: showMonogram ? initials : undefined,
      modeLabel:
        qrMode === 'vcard'
          ? 'Scan to Save Contact Directly to Phone'
          : 'Scan with Smartphone Camera to Open Card',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
          <span className="text-xs font-medium">Loading digital card...</span>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs">
          <AlertCircle size={32} className="text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Card Not Found</h2>
          <p className="text-xs text-slate-600 mt-1.5 mb-6">
            The requested digital card may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
          >
            Return to ZetaCard
          </button>
        </div>
      </div>
    );
  }

  const colorPresets = Array.from(
    new Set([
      card.customization?.themeColor || '#0f172a',
      '#0f172a',
      '#1e3a8a',
      '#065f46',
      '#7c2d12',
      '#581c87',
    ])
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="max-w-lg mx-auto w-full flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors shrink-0"
        >
          <ArrowLeft size={14} />
          <span>ZetaCard</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Toggle between Standard Card View and Full Event QR Badge Mode */}
          <button
            type="button"
            onClick={() => setEventPassMode((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              eventPassMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Toggle Event QR Badge View"
          >
            {eventPassMode ? (
              <>
                <CreditCard size={14} />
                <span>Card View</span>
              </>
            ) : (
              <>
                <QrCode size={14} />
                <span>Event QR Pass</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowQr(true)}
            className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
            title="Customize & Download QR"
          >
            <IdCard size={15} />
          </button>

          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
            title="Share"
          >
            <Share2 size={15} />
          </button>

          <button
            type="button"
            onClick={() => navigate('editor', 'new')}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Create Card
          </button>
        </div>
      </div>

      {/* Main Content Area: Either Event QR Pass Mode or Full Digital Card View */}
      <main className="flex-1 flex items-center justify-center my-2">
        {eventPassMode ? (
          <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Top Brand Accent Bar */}
            <div
              className="h-3 w-full"
              style={{ backgroundColor: qrColor || card.customization?.themeColor || '#0f172a' }}
            />

            <div className="p-6 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {qrMode === 'vcard' ? 'Instant Contact QR Pass' : 'Event Sharing QR Pass'}
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">{card.profile.name}</h1>
              {(card.profile.title || card.profile.company) && (
                <p className="text-xs text-slate-600 mt-0.5">
                  {[card.profile.title, card.profile.company].filter(Boolean).join(' · ')}
                </p>
              )}

              {/* QR Mode Switcher */}
              <div className="mt-4 grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQrMode('link')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    qrMode === 'link'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Link2 size={13} />
                  <span>Public Card Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode('vcard')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    qrMode === 'vcard'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Contact size={13} />
                  <span>Offline vCard</span>
                </button>
              </div>

              {/* Large Scannable Custom QR Code */}
              <div className="my-5 flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xs">
                  {eventQrDataUrl ? (
                    <img
                      src={eventQrDataUrl}
                      alt={`${card.profile.name} Event QR Code`}
                      className="w-60 h-60 sm:w-64 sm:h-64 object-contain"
                    />
                  ) : (
                    <div className="w-60 h-60 flex items-center justify-center text-xs text-slate-400">
                      Generating custom QR...
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-3 max-w-xs">
                  {qrMode === 'vcard'
                    ? 'Point any smartphone camera here to add contact details directly to phone.'
                    : 'Hold up at events or conferences for instant smartphone camera scanning.'}
                </p>
              </div>

              {/* Custom QR Style Controls */}
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600">Color:</span>
                  <div className="flex items-center gap-1.5">
                    {colorPresets.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setQrColor(c)}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          qrColor === c
                            ? 'scale-110 ring-2 ring-slate-900 ring-offset-1'
                            : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c }}
                        title={`QR Color ${c}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMonogram((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
                    showMonogram
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles size={11} />
                  <span>Monogram</span>
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadBadge}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download size={14} />
                  <span>Save Event Badge</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copied' : 'Copy Card Link'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CardRenderer card={card} isInteractive={true} isPreview={false} />
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-slate-500">
        <p>
          Powered by <strong className="text-slate-700">ZetaCard</strong> · Founded by Shahid Tufail
        </p>
      </footer>

      <QrModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        url={cleanCardUrl}
        title={card.title}
        themeColor={card.customization.themeColor}
        card={card}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={cleanCardUrl}
        title={card.title}
      />
    </div>
  );
};
