import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini AI SDK if key is available
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// In-memory server-authoritative cache & fallback storage
const db = {
  cards: new Map<string, any>(),
  bookings: new Map<string, any>(),
  enquiries: new Map<string, any>(),
  contacts: new Map<string, any>(),
  events: [] as any[],
};

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    product: 'ZetaCard',
    founder: 'Shahid Tufail',
    aiEnabled: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// API: Download complete application source code ZIP
app.get('/api/download-source', (req, res) => {
  const zipFile = path.resolve(__dirname, 'public/zetacard-source-code.zip');
  res.download(zipFile, 'zetacard-source-code.zip', (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ error: 'Source ZIP archive not found' });
    }
  });
});

// API: AI Copilot for ZetaCard content generation
app.post('/api/ai/copilot', async (req, res) => {
  try {
    const { category, type, context, title, tone = 'professional' } = req.body;

    if (!ai) {
      // Smart local fallback if API key is not configured in environment
      const fallbacks: Record<string, string> = {
        visiting: `Dedicated ${title || 'Professional'} specializing in driving measurable impact and modern client experiences. Connect with me directly for consultations and collaborative opportunities.`,
        business: `Transforming visions into reality through cutting-edge strategy, meticulous execution, and client-centric solutions. Reach out to discuss partnerships.`,
        wedding: `Together with their families, request the honour of your presence as they unite in holy matrimony and celebrate the beginning of their new journey in love.`,
        birthday: `Join us for an unforgettable evening of celebration, laughter, music, and joy as we commemorate this remarkable milestone!`,
        event: `You are cordially invited to attend an exclusive gathering celebrating innovation, community, and forward-looking discussions. RSVP below to reserve your seat.`,
        menu: `Crafted daily using sustainably sourced, artisanal ingredients. Each dish combines time-honored culinary traditions with modern gourmet elegance.`,
      };
      return res.json({
        content: fallbacks[category] || `Welcome to our digital card. We look forward to connecting with you.`,
        isFallback: true,
      });
    }

    const prompt = `You are the AI Copilot for ZetaCard (founded by Shahid Tufail), a premier digital cards, luxury invitations, and interactive menus platform.
Task: Write compelling, polished content for a digital card of category "${category || 'general'}" and content type "${type || 'bio/description'}".
Card Title/Name: "${title || 'Untitled Card'}"
Tone: "${tone}"
User context/instructions: "${context || 'Create a captivating, elegant, and concise description or invitation wording suitable for high-end digital presentation.'}"

Rules:
- Keep it punchy, sophisticated, and ready to paste into the card.
- For business/visiting cards: 2-3 engaging sentences highlighting expertise and value.
- For wedding invitations: poetic, respectful, elegant wording.
- For birthday/events: celebratory, welcoming, clear call-to-action.
- For menus: mouth-watering, artisanal description.
- Do NOT output quotation marks or markdown headers. Just the text itself.`;

    let generatedText = '';
    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      generatedText = response?.text ? response.text.trim() : '';
    } catch (e: any) {
      console.warn('[AI Copilot] Falling back to local generation:', e.message);
      const fallbacks: Record<string, string> = {
        visiting: `Dedicated ${title || 'Executive & Director'} committed to driving measurable impact and modern client experiences. Connect with me directly for strategic consultations and collaborative ventures.`,
        business: `Transforming business landscapes through bespoke strategy, digital agility, and uncompromising quality. Reach out to discuss corporate partnerships.`,
        wedding: `Together with their families, request the honour of your presence as they unite in holy matrimony and celebrate the beginning of their new journey in love.`,
        birthday: `Join us for an unforgettable evening of celebration, laughter, music, and joy as we commemorate this remarkable milestone!`,
        event: `You are cordially invited to attend an exclusive gathering celebrating innovation, community, and forward-looking discussions. RSVP to reserve your seat.`,
        menu: `Crafted daily using sustainably sourced, artisanal ingredients. Each dish combines time-honored culinary traditions with modern gourmet elegance.`,
      };
      generatedText = fallbacks[category] || `Welcome to our digital card. We look forward to connecting with you.`;
    }

    res.json({ content: generatedText, isFallback: false });
  } catch (err: any) {
    console.error('AI Copilot error:', err);
    res.status(500).json({
      error: 'Failed to generate AI content',
      message: err.message || 'Unknown error',
    });
  }
});

// API: Card Slot check
app.get('/api/cardSlots', (req, res) => {
  res.json({
    unlimited: true,
    plan: 'free_forever',
    maxCards: 100,
    message: 'ZetaCard provides 100% free digital card creation with zero paywalls.',
  });
});

// API: Public and user card submission / sync
app.post('/api/cards', (req, res) => {
  const card = req.body;
  if (!card || !card.id) {
    return res.status(400).json({ error: 'Card ID is required' });
  }
  card.updatedAt = new Date().toISOString();
  if (!card.createdAt) card.createdAt = card.updatedAt;
  db.cards.set(card.id, card);
  res.json({ success: true, card });
});

app.get('/api/cards/:id', (req, res) => {
  const card = db.cards.get(req.params.id);
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }
  res.json(card);
});

// API: Public booking submission
app.post('/api/submitBooking', (req, res) => {
  const { cardId, name, email, phone, date, time, guests, notes } = req.body;
  if (!cardId || !name || !email) {
    return res.status(400).json({ error: 'Missing required booking fields (cardId, name, email)' });
  }
  const id = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const booking = {
    id,
    cardId,
    name,
    email,
    phone: phone || '',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '12:00',
    guests: guests || 1,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.bookings.set(id, booking);
  res.json({ success: true, booking });
});

// API: Public contact / enquiry submission
app.post('/api/submitEnquiry', (req, res) => {
  const { cardId, name, email, phone, subject, message } = req.body;
  if (!cardId || !name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const enquiry = {
    id,
    cardId,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Enquiry',
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  db.enquiries.set(id, enquiry);
  res.json({ success: true, enquiry });
});

// API: Track card analytics event
app.post('/api/trackEvent', (req, res) => {
  const { cardId, eventType, userAgent, referrer } = req.body;
  const event = {
    cardId,
    eventType: eventType || 'view',
    timestamp: new Date().toISOString(),
    userAgent: userAgent || req.headers['user-agent'],
    referrer: referrer || req.headers['referer'],
  };
  db.events.push(event);
  res.json({ success: true });
});

// Mount Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
        ws: {
          server: httpServer,
        },
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZetaCard Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ZetaCard Server] Failed to start:', err);
  process.exit(1);
});
