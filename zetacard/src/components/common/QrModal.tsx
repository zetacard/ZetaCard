import React, { useEffect, useState } from 'react';
import { X, Download, Copy, Check, Share2, Contact, Link2, Sparkles, IdCard } from 'lucide-react';
import { CardItem } from '../../types';
import { exportService } from '../../services/exportService';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  themeColor?: string;
  card?: CardItem;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  themeColor = '#0f172a',
  card,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [qrMode, setQrMode] = useState<'link' | 'vcard'>('link');
  const [showCenterBadge, setShowCenterBadge] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>(themeColor || '#0f172a');

  useEffect(() => {
    if (themeColor) {
      setSelectedColor(themeColor);
    }
  }, [themeColor]);

  const initials = (card?.profile?.name || title || 'ZC')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Append ?src=qr to link URLs so scans at events are tracked as qr_scan events
  const trackedUrl = url
    ? url.includes('?')
      ? `${url}&src=qr`
      : `${url}?src=qr`
    : '';

  const activePayload =
    qrMode === 'vcard' && card ? exportService.buildVCardString(card) : trackedUrl || url;

  useEffect(() => {
    if (isOpen && activePayload) {
      exportService
        .generateQrDataUrl(activePayload, {
          width: 480,
          margin: 2,
          color: {
            dark: selectedColor || '#0f172a',
            light: '#ffffff',
          },
          badgeText: showCenterBadge ? initials : undefined,
          badgeColor: selectedColor || '#0f172a',
        })
        .then(setQrDataUrl);
    }
  }, [isOpen, activePayload, selectedColor, showCenterBadge, initials]);

  if (!isOpen) return null;

  const colorPresets = Array.from(
    new Set([themeColor || '#0f172a', '#0f172a', '#1e3a8a', '#065f46', '#7c2d12', '#581c87'])
  ).slice(0, 5);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleDownloadQrOnly = () => {
    exportService.downloadQrCode(
      activePayload,
      `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${qrMode}_qr.png`,
      {
        color: { dark: selectedColor || '#0f172a', light: '#ffffff' },
        badgeText: showCenterBadge ? initials : undefined,
        badgeColor: selectedColor || '#0f172a',
      }
    );
  };

  const handleDownloadEventBadge = () => {
    exportService.downloadEventQrBadge({
      qrPayload: activePayload,
      title: card?.profile?.name || title,
      subtitle: card?.profile?.title,
      company: card?.profile?.company || card?.eventDetails?.venueName || card?.menuDetails?.restaurantName,
      categoryLabel:
        qrMode === 'vcard'
          ? 'INSTANT CONTACT PASS (VCARD)'
          : card?.category
          ? `${card.category.toUpperCase()} EVENT PASS`
          : 'DIGITAL CARD EVENT PASS',
      darkColor: selectedColor || '#0f172a',
      badgeText: showCenterBadge ? initials : undefined,
      modeLabel:
        qrMode === 'vcard'
          ? 'Scan to Save Contact Directly to Phone'
          : 'Scan with Smartphone Camera to Open Card',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Digital Card: ${title}`,
          url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-slate-900 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">Event QR Pass & Sharing</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher: Public Link vs Instant vCard Contact */}
        {card && (
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
              <Link2 size={14} />
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
              <Contact size={14} />
              <span>Direct Contact (vCard)</span>
            </button>
          </div>
        )}

        {/* QR Code Canvas Card */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="ZetaCard Custom Event QR Code"
                className="w-52 h-52 object-contain"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                Generating custom QR...
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-slate-100 w-full text-center">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] mx-auto">
                {card?.profile?.name || title}
              </p>
              {card?.profile?.title && (
                <p className="text-[11px] text-slate-500 truncate max-w-[200px] mx-auto">
                  {card.profile.title}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2.5 text-center">
            {qrMode === 'vcard'
              ? 'Scanning saves contact details directly to any phone address book (works offline)'
              : 'Scan with any smartphone camera at events to open this digital card'}
          </p>
        </div>

        {/* Customization Bar: Brand Color & Monogram Toggle */}
        <div className="mb-4 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600">QR Accent:</span>
            <div className="flex items-center gap-1.5">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    selectedColor === c ? 'scale-110 ring-2 ring-slate-900 ring-offset-1' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Set QR Color ${c}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCenterBadge((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
              showCenterBadge
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles size={11} />
            <span>Monogram</span>
          </button>
        </div>

        {/* URL Box */}
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-600 truncate pl-1.5">{url}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleDownloadEventBadge}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <IdCard size={15} />
            <span>Download Printable Event QR Badge (PNG)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadQrOnly}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Download size={14} />
              <span>QR Only (PNG)</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Share2 size={14} />
              <span>{shared ? 'Shared' : 'Share Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
