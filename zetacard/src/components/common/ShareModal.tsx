import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Send, Globe, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`,
    },
    {
      name: 'LinkedIn',
      icon: Globe,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`View my digital card: ${url}`)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-6 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-base text-slate-900">Share Digital Card</h3>
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

        <div className="grid grid-cols-4 gap-3 my-6">
          {shareChannels.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Icon size={18} />
                </div>
                <span className="text-xs text-slate-700 font-medium whitespace-nowrap">{ch.name}</span>
              </a>
            );
          })}
        </div>

        {/* Copy Link Field */}
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-600 truncate pl-1.5">{url}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
