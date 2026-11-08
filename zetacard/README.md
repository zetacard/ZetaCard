# ZetaCard — Complete Application Reconstruction

**Official Product:** ZetaCard  
**Founder and Creator:** Shahid Tufail  
**Backend:** Node.js Express + Firebase Authentication & Firestore Compatible  
**Frontend:** React 19 + TypeScript + Tailwind CSS  
**AI Intelligence:** Google Gemini AI Copilot (`gemini-2.5-flash`) via `@google/genai`  

---

## 🌟 Overview

ZetaCard is a luxury digital presence suite offering:
1. **Digital Visiting Cards:** Executive personal identity with 1-tap mobile vCard (.vcf) address book integration and high-resolution QR codes.
2. **Business Cards:** Corporate team cards with portfolio showcases and appointment booking engines.
3. **Wedding Invitations:** Gilded calligraphy, couple portraits, dress codes, ceremony schedules, and online RSVP tracking with `.ics` calendar sync.
4. **Birthday Invitations:** High-energy celebration stationery with guest counters and DJ timelines.
5. **Event Invitations:** Keynote conference passes and gala reservations.
6. **Interactive Restaurant Menus:** Contactless dining menus with chef specials, currency selectors, and table reservation workflows.

**Commercial Promise:** 100% Free Forever with zero paywalls.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js (version 20+)
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional keys:
- `GEMINI_API_KEY`: For AI Copilot text generation.
- `VITE_FIREBASE_*`: If connecting to your live custom Firebase project.

### 4. Running the Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 5. Building for Production
```bash
npm run build
npm start
```

---

## 🔒 Firebase Integration & Security Model

ZetaCard comes equipped with full standalone zero-friction persistence and complete production-grade Firebase Firestore configuration.

### Files Included:
- `firestore.rules`: Production default-deny security rules ensuring users can only read/modify their own private documents, while published cards remain publicly viewable without authentication.
- `firebase-blueprint.json`: Collection schemas, document relationships, and required index specifications.
- `src/firebase/config.ts`: Client Firebase SDK initialization that automatically adapts to environment variables or settings entered in the in-app Account Settings page.

### Entity Schemas (Firestore Collections):
1. **`users/{userId}`**: Profiles, roles (`admin` | `user`), settings.
2. **`cards/{cardId}`**: Visiting cards, invitations, menus, themes, custom styles.
3. **`bookings/{bookingId}`**: Public RSVPs, appointments, and table reservations.
4. **`enquiries/{enquiryId}`**: Direct visitor messages routed to the card creator.
5. **`contacts/{contactId}`**: Generated leads from vCard and card interactions.
6. **`cardEvents/{eventId}`**: Append-only visitor analytics (views, scans, shares).

---

## 🛡️ Admin Privileges

The administrator console (`/admin`) is restricted to accounts with the `admin` role or authorized founder emails (`founder@zetacard.com`, `zetacard@outlook.com`). Ordinary registered accounts are standard creators by default.

---

## 📦 Portability & Long-Term Ownership

This application has been architected without platform lock-in. You can:
- Download the complete ZIP archive from AI Studio.
- Push directly to any GitHub repository.
- Host on Vercel, Cloud Run, Netlify, Render, or a VPS.
- Plug in your own Google Cloud & Firebase credentials at any time.

*Created with pride for Shahid Tufail and the ZetaCard platform.*
