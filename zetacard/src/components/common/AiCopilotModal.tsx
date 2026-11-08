import React, { useState } from 'react';
import { X, Check, RefreshCw } from 'lucide-react';
import { CardCategory } from '../../types';
import { aiService } from '../../services/aiService';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CardCategory;
  cardTitle: string;
  onApply: (generatedText: string) => void;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  category,
  cardTitle,
  onApply,
}) => {
  const [tone, setTone] = useState<'professional' | 'luxurious' | 'romantic' | 'energetic' | 'minimalist'>('professional');
  const [contextPrompt, setContextPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const quickPrompts: Record<CardCategory, string[]> = {
    visiting: [
      'Write a concise executive biography highlighting leadership, client partnerships, and strategic outcomes.',
      'Draft a professional profile summary for a senior consultant and advisor.',
      'Create a direct, modern introduction for networking and business inquiries.',
    ],
    business: [
      'Compose an authoritative company overview focusing on client outcomes and reliability.',
      'Write a clear practice statement for a specialized advisory or design firm.',
      'Draft a concise corporate introduction inviting partnership inquiries.',
    ],
    wedding: [
      'Write formal wedding invitation wording for family and guests.',
      'Compose warm, traditional ceremony and reception wording.',
      'Draft an understated, modern editorial invitation statement.',
    ],
    birthday: [
      'Write a welcoming dinner and celebration invitation for close friends and colleagues.',
      'Draft a formal milestone anniversary and birthday reception invitation.',
      'Create a concise weekend gathering invitation.',
    ],
    event: [
      'Write an executive leadership summit invitation highlighting keynote sessions.',
      'Compose a formal annual charity gala and dinner invitation.',
      'Draft a professional product briefing and networking reception invite.',
    ],
    menu: [
      'Write a seasonal culinary introduction highlighting local ingredients and preparation.',
      'Compose a classic bistro and wine cellar welcome note.',
      'Draft a concise tasting menu introduction.',
    ],
  };

  const handleGenerate = async (customPrompt?: string) => {
    setIsLoading(true);
    setApplied(false);
    try {
      const result = await aiService.generateContent({
        category,
        title: cardTitle,
        context: customPrompt || contextPrompt || quickPrompts[category][0],
        tone,
      });
      setGeneratedText(result.content);
    } catch {
      // Handled in service
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedText) return;
    onApply(generatedText);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-xl p-6 text-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-base text-slate-900">AI Writing Assistant</h3>
            <p className="text-xs text-slate-500 mt-0.5">Generate polished copy for your card</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Tone</label>
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg">
              {(['professional', 'minimalist', 'luxurious', 'romantic', 'energetic'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                    tone === t
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Suggested Templates</label>
            <div className="space-y-1.5">
              {quickPrompts[category]?.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setContextPrompt(p);
                    handleGenerate(p);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Custom Instructions</label>
            <textarea
              rows={2}
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
              placeholder="Describe key details you want included..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              {isLoading && <RefreshCw size={13} className="animate-spin" />}
              <span>{isLoading ? 'Generating...' : 'Generate Text'}</span>
            </button>
          </div>

          {/* Generated Result Output */}
          {generatedText && (
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">Suggested Copy</span>
              <p className="text-sm text-slate-800 leading-relaxed">{generatedText}</p>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Click to replace card description</span>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {applied && <Check size={14} />}
                  <span>{applied ? 'Applied' : 'Use Text'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
