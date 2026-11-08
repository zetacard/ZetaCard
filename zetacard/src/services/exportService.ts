import QRCode from 'qrcode';
import { CardItem } from '../types';

export interface CustomQrOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  badgeText?: string;
  badgeColor?: string;
}

export interface EventBadgeExportOptions {
  qrPayload: string;
  title: string;
  subtitle?: string;
  company?: string;
  categoryLabel?: string;
  darkColor?: string;
  badgeText?: string;
  modeLabel?: string;
  filename?: string;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export const exportService = {
  // Build standard vCard 3.0 payload string (used for both .vcf download and direct vCard QR codes)
  buildVCardString(card: CardItem): string {
    const p = card.profile;
    const nameParts = (p.name || 'ZetaCard Contact').trim().split(/\s+/);
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const firstName = nameParts[0] || '';

    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName};;;`,
      `FN:${p.name || ''}`,
      p.company ? `ORG:${p.company}` : '',
      p.title ? `TITLE:${p.title}` : '',
      p.phone ? `TEL;TYPE=CELL,VOICE:${p.phone}` : '',
      p.email ? `EMAIL;TYPE=PREF,INTERNET:${p.email}` : '',
      p.website ? `URL:${p.website}` : '',
      p.address ? `ADR;TYPE=WORK:;;${p.address};;;;` : '',
      p.bio ? `NOTE:${p.bio.replace(/\n/g, ' ').slice(0, 180)}` : '',
      'END:VCARD',
    ].filter(Boolean);

    return vcardLines.join('\r\n');
  },

  // Generate QR code Data URL (PNG) with optional custom center monogram badge
  async generateQrDataUrl(text: string, options: CustomQrOptions = {}): Promise<string> {
    try {
      const size = options.width || 440;
      const darkColor = options.color?.dark || '#0f172a';
      const lightColor = options.color?.light || '#ffffff';

      if (typeof document === 'undefined') {
        return await QRCode.toDataURL(text, {
          width: size,
          margin: options.margin ?? 2,
          color: { dark: darkColor, light: lightColor },
          errorCorrectionLevel: 'H',
        });
      }

      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: options.margin ?? 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: 'H',
      });

      if (options.badgeText) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const badgeSize = Math.round(size * 0.21);
          const pad = Math.max(4, Math.round(size * 0.018));
          const outerSize = badgeSize + pad * 2;
          const outerX = Math.round((size - outerSize) / 2);
          const outerY = Math.round((size - outerSize) / 2);
          const innerX = Math.round((size - badgeSize) / 2);
          const innerY = Math.round((size - badgeSize) / 2);
          const radius = Math.round(badgeSize * 0.26);

          // White outer shield for scan contrast
          ctx.fillStyle = lightColor;
          drawRoundedRect(ctx, outerX, outerY, outerSize, outerSize, radius + pad);
          ctx.fill();

          // Branded inner monogram badge
          ctx.fillStyle = options.badgeColor || darkColor;
          drawRoundedRect(ctx, innerX, innerY, badgeSize, badgeSize, radius);
          ctx.fill();

          // Monogram initials
          ctx.fillStyle = '#ffffff';
          ctx.font = `700 ${Math.round(badgeSize * 0.42)}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            options.badgeText.slice(0, 2).toUpperCase(),
            size / 2,
            size / 2 + 1
          );
        }
      }

      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error('QR code generation error:', err);
      return '';
    }
  },

  // Generate QR Code SVG String
  async generateQrSvg(text: string): Promise<string> {
    try {
      return await QRCode.toString(text, { type: 'svg', margin: 2, errorCorrectionLevel: 'H' });
    } catch {
      return '';
    }
  },

  // Download standalone QR code image (with optional custom color & badge)
  async downloadQrCode(
    text: string,
    filename: string = 'zetacard-qr.png',
    options: CustomQrOptions = {}
  ): Promise<void> {
    const url = await this.generateQrDataUrl(text, {
      width: 800,
      margin: 2,
      ...options,
    });
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  // Download a printable / lockscreen-ready Event QR Badge PNG
  async downloadEventQrBadge(opts: EventBadgeExportOptions): Promise<void> {
    if (typeof document === 'undefined') return;

    const qrDataUrl = await this.generateQrDataUrl(opts.qrPayload, {
      width: 520,
      margin: 2,
      color: {
        dark: opts.darkColor || '#0f172a',
        light: '#ffffff',
      },
      badgeText: opts.badgeText,
      badgeColor: opts.darkColor || '#0f172a',
    });

    if (!qrDataUrl) return;

    const canvas = document.createElement('canvas');
    const W = 800;
    const H = 1040;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accent = opts.darkColor || '#0f172a';

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    // Card frame
    const cardX = 56;
    const cardY = 48;
    const cardW = W - 112;
    const cardH = H - 96;

    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    // Top accent bar inside card
    ctx.save();
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
    ctx.clip();
    ctx.fillStyle = accent;
    ctx.fillRect(cardX, cardY, cardW, 20);
    ctx.restore();

    // Category / Event Pass kicker
    ctx.fillStyle = '#64748b';
    ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      (opts.categoryLabel || 'EVENT DIGITAL PASS').toUpperCase(),
      W / 2,
      cardY + 86
    );

    // Name / Title
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 42px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText((opts.title || 'ZetaCard').slice(0, 28), W / 2, cardY + 144);

    // Subtitle / Role & Company
    const subLine = [opts.subtitle, opts.company].filter(Boolean).join(' · ');
    if (subLine) {
      ctx.fillStyle = '#475569';
      ctx.font = '500 24px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(subLine.slice(0, 44), W / 2, cardY + 188);
    }

    // Draw QR image in center container
    const qrImg = new Image();
    await new Promise<void>((resolve) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => resolve();
      qrImg.src = qrDataUrl;
    });

    const qrBoxSize = 520;
    const qrBoxX = (W - qrBoxSize) / 2;
    const qrBoxY = cardY + 236;

    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, qrBoxX - 16, qrBoxY - 16, qrBoxSize + 32, qrBoxSize + 32, 24);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.drawImage(qrImg, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

    // Scan Instruction Badge
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 24px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      opts.modeLabel || 'Scan with Smartphone Camera to Connect',
      W / 2,
      qrBoxY + qrBoxSize + 68
    );

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('ZetaCard Digital Identity · Founded by Shahid Tufail', W / 2, cardY + cardH - 38);

    const badgeDataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = badgeDataUrl;
    a.download =
      opts.filename ||
      `${(opts.title || 'zetacard').toLowerCase().replace(/[^a-z0-9]/g, '_')}_event_qr_badge.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  // Generate and download standard vCard (.vcf) file
  downloadVCard(card: CardItem): void {
    const p = card.profile;
    const vcardContent = this.buildVCardString(card);
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(p.name || 'contact').toLowerCase().replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Generate and download standard iCalendar (.ics) event file
  downloadICalendar(card: CardItem): void {
    const ev = card.eventDetails;
    if (!ev || !ev.eventDate) return;

    const startDate = (ev.eventDate || '').replace(/-/g, '');
    const startTime = (ev.eventTime || '12:00').replace(/:/g, '') + '00';
    const dtStart = `${startDate}T${startTime}Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ZetaCard//Event Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:zetacard-${card.id}-${Date.now()}@zetacard.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `SUMMARY:${card.title}`,
      `DESCRIPTION:${(card.profile.bio || ev.ceremonyDetails || 'You are invited by ZetaCard').replace(/\n/g, '\\n')}`,
      `LOCATION:${ev.venueName ? `${ev.venueName}, ${ev.venueAddress || ''}` : card.profile.address || ''}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Share card via Web Share API or Clipboard copy
  async shareCard(card: CardItem, currentUrl?: string): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
    const url = currentUrl || `${window.location.origin}/c/${card.id}`;
    const shareData = {
      title: card.title,
      text: card.profile.bio || `View my digital card on ZetaCard: ${card.title}`,
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return { success: false, method: 'native' };
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      return { success: true, method: 'clipboard' };
    } catch {
      return { success: false, method: 'clipboard' };
    }
  },
};
