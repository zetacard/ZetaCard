import { CardCategory } from '../types';

export interface AiCopilotRequest {
  category: CardCategory;
  type?: 'bio' | 'tagline' | 'invitation' | 'schedule' | 'menu_item';
  title?: string;
  context?: string;
  tone?: 'professional' | 'luxurious' | 'romantic' | 'energetic' | 'minimalist';
}

export const aiService = {
  async generateContent(req: AiCopilotRequest): Promise<{ content: string; isFallback: boolean }> {
    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content || '',
        isFallback: Boolean(data.isFallback),
      };
    } catch (err) {
      console.warn('AI copilot API call failed, generating contextual content locally:', err);
      return {
        content: this.getLocalFallback(req),
        isFallback: true,
      };
    }
  },

  getLocalFallback(req: AiCopilotRequest): string {
    const { category, title, tone } = req;
    switch (category) {
      case 'wedding':
        return `Together with their families, ${title || 'the happy couple'} joyfully invite you to celebrate the holy union of their lives and love. Join us for a day of cherished memories, dinner, and dancing under the stars.`;
      case 'birthday':
        return `You are cordially invited to celebrate ${title || 'a special milestone'}! Prepare for an unforgettable evening filled with wonderful friends, exquisite cocktails, delicious treats, and timeless celebration.`;
      case 'event':
        return `Join industry pioneers, thought leaders, and creators for an exclusive session on ${title || 'emerging horizons'}. Reserve your seat now to participate in dynamic keynotes and high-value networking.`;
      case 'menu':
        return `Prepared with seasonal artisanal produce, delicate aromatic herbs, and time-honored culinary finesse. Presented with contemporary flair for an extraordinary dining experience.`;
      case 'business':
        return `Empowering enterprises and visionary leaders through bespoke strategy, digital transformation, and measurable execution. Let us collaborate to accelerate your mission.`;
      case 'visiting':
      default:
        return `Dedicated ${title || 'Executive & Innovator'} committed to delivering world-class craftsmanship and strategic results. Reach out directly to initiate dialogue or schedule a conversation.`;
    }
  },
};
