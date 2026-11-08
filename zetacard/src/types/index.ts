export type CardCategory =
  | 'visiting'
  | 'business'
  | 'wedding'
  | 'birthday'
  | 'event'
  | 'menu';

export type CardStatus = 'draft' | 'published';

export type LayoutStyle = 'modern' | 'minimal' | 'luxury' | 'creative' | 'bold' | 'classic';

export type FontFamily = 'jakarta' | 'cinzel' | 'playfair' | 'outfit' | 'vibes';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  settings?: {
    theme?: 'dark' | 'light' | 'system';
    notificationsEmail?: boolean;
    autoPublish?: boolean;
  };
}

export interface CardCustomization {
  themeColor: string;
  secondaryColor?: string;
  fontFamily: FontFamily;
  layoutStyle: LayoutStyle;
  cardBgType: 'gradient' | 'solid' | 'pattern' | 'mesh' | 'dark' | 'glass';
  bgPattern?: string;
  showQr: boolean;
  enableBookings: boolean;
  enableEnquiries: boolean;
  enableVCard: boolean;
}

export interface CardProfile {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  avatarUrl?: string;
  logoUrl?: string;
  coverUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  mapUrl?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    youtube?: string;
    github?: string;
  };
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface EventDetails {
  hostName?: string;
  partnerName?: string;
  venueName?: string;
  venueAddress?: string;
  eventDate?: string;
  eventTime?: string;
  rsvpDeadline?: string;
  ceremonyDetails?: string;
  receptionDetails?: string;
  dressCode?: string;
  schedule?: ScheduleItem[];
  gallery?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | number;
  isVeg?: boolean;
  isChefSpecial?: boolean;
  isAvailable?: boolean;
  imageUrl?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuDetails {
  restaurantName?: string;
  tagline?: string;
  cuisine?: string;
  currency: string;
  sections: MenuSection[];
  tableReservationEnabled?: boolean;
}

export interface CardItem {
  id: string;
  userId: string;
  category: CardCategory;
  templateId: string;
  title: string;
  slug: string;
  status: CardStatus;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  profile: CardProfile;
  customization: CardCustomization;
  eventDetails?: EventDetails;
  menuDetails?: MenuDetails;
}

export interface Booking {
  id: string;
  cardId: string;
  cardTitle: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Enquiry {
  id: string;
  cardId: string;
  cardTitle: string;
  ownerId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'archived';
  createdAt: string;
}

export interface ContactLead {
  id: string;
  cardId: string;
  ownerId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export interface CardEvent {
  id: string;
  cardId: string;
  eventType: 'view' | 'qr_scan' | 'vcard_download' | 'share' | 'booking_start' | 'enquiry_sent';
  timestamp: string;
  userAgent?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: CardCategory;
  description: string;
  previewImage: string;
  defaultCustomization: CardCustomization;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
}
