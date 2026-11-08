import { CardItem, Booking, Enquiry, ContactLead, CardEvent } from '../types';

const STORAGE_KEYS = {
  CARDS: 'zetacard_cards_v2',
  BOOKINGS: 'zetacard_bookings_v2',
  ENQUIRIES: 'zetacard_enquiries_v2',
  CONTACTS: 'zetacard_contacts_v2',
  EVENTS: 'zetacard_events_v2',
};

const IMG_BUSINESS = '/src/assets/images/template_business_card_1794128421125.jpg';
const IMG_INVITATION = '/src/assets/images/template_event_invitation_1794128422016.jpg';
const IMG_MENU = '/src/assets/images/template_fine_dining_menu_1794128423318.jpg';

// Clean inline SVG monogram avatar generator (never fails offline or in sandbox)
export const createInitialsSvgDataUrl = (initials: string, bgHex = '#0F172A', fgHex = '#F8FAFC') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="28" fill="${bgHex}"/>
    <text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="${fgHex}" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="56" letter-spacing="1">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Seed sample cards representing the ZetaCard launch products
const INITIAL_CARDS: CardItem[] = [
  {
    id: 'shahid-tufail-founder',
    userId: 'user_founder_01',
    category: 'visiting',
    templateId: 'visiting_executive_gold',
    title: 'Shahid Tufail — Executive Visiting Card',
    slug: 'shahid-tufail',
    status: 'published',
    views: 1248,
    likes: 312,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-20T14:30:00.000Z',
    profile: {
      name: 'Shahid Tufail',
      title: 'Founder & Principal Architect',
      company: 'ZetaCard Global Technologies',
      bio: 'Architecting digital identity systems, executive credentials, and interactive hospitality software for modern enterprises and professionals.',
      avatarUrl: createInitialsSvgDataUrl('ST', '#0F172A', '#F59E0B'),
      coverUrl: IMG_BUSINESS,
      phone: '+44 7911 123456',
      email: 'founder@zetacard.com',
      website: 'https://zeta-card.base44.app',
      address: 'Mayfair, London · Dubai Silicon Oasis',
      socials: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        whatsapp: '+447911123456',
      },
    },
    customization: {
      themeColor: '#D97706',
      secondaryColor: '#B45309',
      fontFamily: 'jakarta',
      layoutStyle: 'luxury',
      cardBgType: 'dark',
      showQr: true,
      enableBookings: true,
      enableEnquiries: true,
      enableVCard: true,
    },
  },
  {
    id: 'aurora-wedding-2026',
    userId: 'user_founder_01',
    category: 'wedding',
    templateId: 'wedding_royal_palace',
    title: 'Eleanor & Julian — Wedding Invitation',
    slug: 'eleanor-julian-wedding',
    status: 'published',
    views: 890,
    likes: 245,
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-03-22T09:15:00.000Z',
    profile: {
      name: 'Eleanor Vance & Julian Thorne',
      title: 'Wedding Ceremony & Evening Reception',
      bio: 'Together with our families, we request the pleasure of your company as we exchange marriage vows and celebrate our union.',
      email: 'rsvp@eleanor-julian.com',
      phone: '+1 555 019 2834',
      address: 'The Belvedere Orangery, Florence, Italy',
      avatarUrl: createInitialsSvgDataUrl('E&J', '#881337', '#FFF1F2'),
      coverUrl: IMG_INVITATION,
    },
    customization: {
      themeColor: '#BE123C',
      secondaryColor: '#9F1239',
      fontFamily: 'playfair',
      layoutStyle: 'luxury',
      cardBgType: 'solid',
      showQr: true,
      enableBookings: true,
      enableEnquiries: true,
      enableVCard: false,
    },
    eventDetails: {
      partnerName: 'Julian Thorne',
      venueName: 'The Belvedere Orangery',
      venueAddress: 'Via Belvedere 12, 50125 Florence, Italy',
      eventDate: '2026-09-18',
      eventTime: '16:30',
      rsvpDeadline: '2026-08-01',
      dressCode: 'Black Tie Optional',
      ceremonyDetails: 'Ceremony in the olive courtyard followed by a formal reception dinner in the main pavilion.',
      schedule: [
        { id: '1', time: '16:00', title: 'Guest Arrival & Welcome Reception', description: 'Refreshments served on the south terrace.' },
        { id: '2', time: '16:30', title: 'Marriage Ceremony', description: 'Exchange of vows in the courtyard.' },
        { id: '3', time: '18:00', title: 'Aperitif & Quartet', description: 'Classical string quartet accompaniment.' },
        { id: '4', time: '19:30', title: 'Reception Dinner & Toasts', description: 'Four-course seasonal Tuscan dinner.' },
      ],
    },
  },
  {
    id: 'l-etoile-gourmet-bistro',
    userId: 'user_founder_01',
    category: 'menu',
    templateId: 'menu_michelin_bistro',
    title: "L'Étoile Paris — Autumn Tasting Menu",
    slug: 'letoile-menu',
    status: 'published',
    views: 3120,
    likes: 540,
    createdAt: '2026-01-20T18:00:00.000Z',
    updatedAt: '2026-03-24T16:00:00.000Z',
    profile: {
      name: "L'Étoile Restaurant & Cellar",
      title: 'Executive Chef Marc Dupont',
      bio: 'Contemporary French gastronomy crafted daily from sustainable regional harvests and artisanal producers.',
      phone: '+33 1 42 68 55 00',
      email: 'reservations@letoile-paris.fr',
      website: 'https://letoile-dining.com',
      address: '14 Place Vendôme, 75001 Paris, France',
      avatarUrl: createInitialsSvgDataUrl('LE', '#1E293B', '#F59E0B'),
      coverUrl: IMG_MENU,
    },
    customization: {
      themeColor: '#B45309',
      secondaryColor: '#92400E',
      fontFamily: 'cinzel',
      layoutStyle: 'luxury',
      cardBgType: 'dark',
      showQr: true,
      enableBookings: true,
      enableEnquiries: true,
      enableVCard: false,
    },
    menuDetails: {
      restaurantName: "L'Étoile Paris",
      tagline: 'Seasonal Tasting Menu & Wine Cellar',
      cuisine: 'Contemporary French Gastronomy',
      currency: '€',
      tableReservationEnabled: true,
      sections: [
        {
          id: 'sec-starters',
          name: 'First Course (Entrées)',
          description: 'Seasonal introductions from land and sea',
          items: [
            { id: 'm1', name: 'Brittany Blue Lobster Bisque', description: 'Cognac reduction, tarragon emulsion, brioche', price: 34, isChefSpecial: true, isAvailable: true },
            { id: 'm2', name: 'Heirloom Beetroot Carpaccio', description: 'Whipped goat curd, toasted walnuts, aged balsamic', price: 26, isVeg: true, isAvailable: true },
            { id: 'm3', name: 'Pan-Seared Scallops', description: 'Cauliflower velouté, hazelnut brown butter', price: 36, isChefSpecial: true, isAvailable: true },
          ],
        },
        {
          id: 'sec-mains',
          name: 'Main Course (Plats Principaux)',
          description: 'Line-caught fish and dry-aged pasture cuts',
          items: [
            { id: 'm4', name: 'Wild Turbot Meunière', description: 'Caper brown butter, pomme purée, sea asparagus', price: 62, isChefSpecial: true, isAvailable: true },
            { id: 'm5', name: 'Beef Filet Mignon', description: 'Morel mushroom jus, glazed shallots, potato mille-feuille', price: 74, isChefSpecial: true, isAvailable: true },
            { id: 'm6', name: 'Chanterelle Mushroom Risotto', description: 'Aged Acquerello rice, 36-month Parmigiano, fine herbs', price: 42, isVeg: true, isAvailable: true },
          ],
        },
        {
          id: 'sec-desserts',
          name: 'Desserts (Pâtisserie)',
          description: 'Prepared to order by our pastry kitchen',
          items: [
            { id: 'm7', name: 'Valrhona Dark Chocolate Soufflé', description: '70% Guanaja chocolate, Madagascar vanilla bean ice cream', price: 24, isChefSpecial: true, isAvailable: true },
            { id: 'm8', name: 'Meyer Lemon Mille-Feuille', description: 'Caramelized puff pastry, citrusdiplomat cream', price: 22, isVeg: true, isAvailable: true },
          ],
        },
      ],
    },
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-01',
    cardId: 'l-etoile-gourmet-bistro',
    cardTitle: "L'Étoile Paris — Autumn Tasting Menu",
    ownerId: 'user_founder_01',
    name: 'Henry Sterling',
    email: 'henry.sterling@mayfair.co.uk',
    phone: '+44 7700 900123',
    date: '2026-11-20',
    time: '20:00',
    guests: 4,
    notes: 'Quiet corner table requested for client dinner.',
    status: 'confirmed',
    createdAt: '2026-11-01T15:20:00.000Z',
  },
  {
    id: 'book-02',
    cardId: 'aurora-wedding-2026',
    cardTitle: 'Eleanor & Julian — Wedding Invitation',
    ownerId: 'user_founder_01',
    name: 'Dr. Sophia & Thomas Wright',
    email: 'sophia.wright@cambridge.ac.uk',
    phone: '+44 7700 900456',
    date: '2026-09-18',
    time: '16:30',
    guests: 2,
    notes: 'Attending ceremony and dinner. Vegetarian option for one guest.',
    status: 'confirmed',
    createdAt: '2026-11-03T11:45:00.000Z',
  },
  {
    id: 'book-03',
    cardId: 'shahid-tufail-founder',
    cardTitle: 'Shahid Tufail — Executive Visiting Card',
    ownerId: 'user_founder_01',
    name: 'Marcus Vance',
    email: 'marcus@horizonventures.vc',
    phone: '+1 415 555 2671',
    date: '2026-11-25',
    time: '14:00',
    guests: 1,
    notes: '30-minute executive briefing on enterprise deployment.',
    status: 'pending',
    createdAt: '2026-11-06T09:10:00.000Z',
  },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-01',
    cardId: 'shahid-tufail-founder',
    cardTitle: 'Shahid Tufail — Executive Visiting Card',
    ownerId: 'user_founder_01',
    name: 'Elena Rostova',
    email: 'elena@luxuryliving.ae',
    phone: '+971 50 123 4567',
    subject: 'Enterprise Rollout for Advisory Team',
    message: 'Hello Shahid, we would like to standardize our senior advisory team on ZetaCard digital business cards. Please let us know your availability this week.',
    status: 'new',
    createdAt: '2026-11-05T14:15:00.000Z',
  },
  {
    id: 'enq-02',
    cardId: 'l-etoile-gourmet-bistro',
    cardTitle: "L'Étoile Paris — Autumn Tasting Menu",
    ownerId: 'user_founder_01',
    name: 'Camille Bernard',
    email: 'camille@voguefrance.fr',
    phone: '+33 6 12 34 56 78',
    subject: 'Private Dining Room Inquiry',
    message: 'We are organizing a corporate dinner for 18 guests next month and would like to review private dining availability.',
    status: 'replied',
    createdAt: '2026-11-04T10:00:00.000Z',
  },
];

export const storageService = {
  getCards(): CardItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(INITIAL_CARDS));
        return INITIAL_CARDS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_CARDS;
    }
  },

  getCardById(id: string): CardItem | undefined {
    const cards = this.getCards();
    return cards.find((c) => c.id === id || c.slug === id);
  },

  getUserCards(userId: string): CardItem[] {
    const cards = this.getCards();
    return cards.filter((c) => c.userId === userId || c.userId === 'user_founder_01');
  },

  saveCard(card: CardItem): CardItem {
    const cards = this.getCards();
    const index = cards.findIndex((c) => c.id === card.id);
    const updatedCard = {
      ...card,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      cards[index] = updatedCard;
    } else {
      cards.unshift(updatedCard);
    }

    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));

    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard),
    }).catch(() => {});

    window.dispatchEvent(new Event('zetacard_storage_updated'));
    return updatedCard;
  },

  deleteCard(id: string): boolean {
    const cards = this.getCards();
    const filtered = cards.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(filtered));
    window.dispatchEvent(new Event('zetacard_storage_updated'));
    return true;
  },

  duplicateCard(id: string, newUserId: string): CardItem | null {
    const original = this.getCardById(id);
    if (!original) return null;
    const duplicated: CardItem = {
      ...JSON.parse(JSON.stringify(original)),
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: newUserId,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now() % 10000}`,
      status: 'draft',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveCard(duplicated);
  },

  getBookings(): Booking[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  getUserBookings(ownerId: string): Booking[] {
    const all = this.getBookings();
    return all.filter((b) => b.ownerId === ownerId || b.ownerId === 'user_founder_01');
  },

  submitBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...bookingData,
      id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    fetch('/api/submitBooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch(() => {});

    window.dispatchEvent(new Event('zetacard_storage_updated'));
    return newBooking;
  },

  updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): boolean {
    const bookings = this.getBookings();
    const item = bookings.find((b) => b.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      window.dispatchEvent(new Event('zetacard_storage_updated'));
      return true;
    }
    return false;
  },

  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filtered));
    window.dispatchEvent(new Event('zetacard_storage_updated'));
    return true;
  },

  getEnquiries(): Enquiry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
        return INITIAL_ENQUIRIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_ENQUIRIES;
    }
  },

  getUserEnquiries(ownerId: string): Enquiry[] {
    const all = this.getEnquiries();
    return all.filter((e) => e.ownerId === ownerId || e.ownerId === 'user_founder_01');
  },

  submitEnquiry(enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnquiry);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));

    fetch('/api/submitEnquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnquiry),
    }).catch(() => {});

    window.dispatchEvent(new Event('zetacard_storage_updated'));
    return newEnquiry;
  },

  updateEnquiryStatus(id: string, status: 'new' | 'replied' | 'archived'): boolean {
    const enquiries = this.getEnquiries();
    const item = enquiries.find((e) => e.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      window.dispatchEvent(new Event('zetacard_storage_updated'));
      return true;
    }
    return false;
  },

  getContacts(): ContactLead[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveContact(contact: Omit<ContactLead, 'id' | 'createdAt'>): ContactLead {
    const contacts = this.getContacts();
    const newContact: ContactLead = {
      ...contact,
      id: `contact_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    contacts.unshift(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return newContact;
  },

  trackEvent(cardId: string, eventType: CardEvent['eventType']): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const events: CardEvent[] = stored ? JSON.parse(stored) : [];
      events.push({
        id: `ev_${Date.now()}`,
        cardId,
        eventType,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events.slice(-500)));

      if (eventType === 'view') {
        const cards = this.getCards();
        const card = cards.find((c) => c.id === cardId);
        if (card) {
          card.views = (card.views || 0) + 1;
          localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
        }
      }

      fetch('/api/trackEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, eventType }),
      }).catch(() => {});
    } catch {}
  },

  deleteMyData(userId: string): { success: boolean; countDeleted: number } {
    const cards = this.getCards().filter((c) => c.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));

    const bookings = this.getBookings().filter((b) => b.ownerId !== userId);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    const enquiries = this.getEnquiries().filter((e) => e.ownerId !== userId);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));

    window.dispatchEvent(new Event('zetacard_storage_updated'));
    return { success: true, countDeleted: 1 };
  },

  cardSlots() {
    return {
      unlimited: true,
      plan: 'free_forever',
      maxCards: 100,
      activeCards: this.getCards().length,
    };
  },
};
