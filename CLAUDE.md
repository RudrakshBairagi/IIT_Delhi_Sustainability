# CLAUDE.md - ReLoop Project Guide

> **For Claude Code Agent**: This file contains all context you need to understand and work on this project.

---

## � PROJECT OVERVIEW

**ReLoop** is a mobile-first web app for campus sustainability. College students can:
- **Scan items** with AI to get upcycle ideas
- **Trade/swap items** in a campus marketplace
- **Earn eco-coins** and compete on leaderboards
- **Track environmental impact** (CO2 saved, items recycled)

---

## � PROJECT STRUCTURE

This repo has **two implementations**:

### 1. Static HTML App (Main Demo)
```
/
├── index.html           # Entry point → redirects to onboarding/home
├── css/                 # Global stylesheets
├── js/
│   ├── app.js           # Main application logic
│   └── services/        # Core services
│       ├── auth.js          # Firebase Auth wrapper
│       ├── database.js      # Firestore wrapper
│       ├── scanner.js       # AI Scanner (Cloudflare Workers)
│       ├── gamification.js  # XP, Levels, Missions
│       └── demo-manager.js  # Demo/Real mode toggle
├── pages/
│   ├── core/            # home.html, onboarding.html
│   ├── scanner/         # camera.html, scan-success.html, scanning.html
│   ├── marketplace/     # marketplace.html, create-listing.html, item-*.html
│   ├── gamification/    # leaderboard.html, missions.html, wrapped.html
│   ├── user/            # profile.html, settings.html, impact.html
│   ├── stories/         # Success stories
│   └── components/      # Reusable HTML components
├── firestore.rules      # Firebase security rules
├── cloudflare-worker.js # AI worker code
└── cf-worker/           # Cloudflare Worker deployment
```

### 2. Next.js App (Newer Implementation)
```
/reloop-nextjs/
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities (demo-manager.ts, etc.)
│   ├── stores/          # State management
│   └── types/           # TypeScript types
└── package.json
```

---

## 🛠️ TECH STACK

| Layer | Technology | Details |
|-------|------------|---------|
| **Frontend (Static)** | Vanilla JS, HTML5, TailwindCSS CDN | Zero-build, fast loading |
| **Frontend (Next.js)** | Next.js 14, React, TypeScript | App Router, Server Components |
| **Backend** | Firebase (Firestore, Auth) | Real-time DB & authentication |
| **AI** | Cloudflare Workers + Llama 3.2 Vision | Serverless image analysis |
| **Hosting** | Netlify / Firebase Hosting | Global CDN |

---

## 🎭 DEMO MODE ARCHITECTURE

The app supports **two modes** for hackathon demos:

### Real Mode
- Uses Firebase Auth for login
- Firestore for database
- Cloudflare Workers for AI analysis

### Demo Mode
- Uses `localStorage` for state
- Mock data for listings, users, scan results
- No network required

**Toggle Location**: `pages/user/settings.html`

**Key File**: `js/services/demo-manager.js`
```javascript
DemoManager.isEnabled  // Check if demo mode is on
DemoManager.setMode(true/false)  // Toggle mode
DemoManager.getMockUser()  // Get mock user data
DemoManager.getMockScanResult()  // Get mock AI result
```

---

## 🎨 DESIGN SYSTEM

### Colors
- **Primary Green**: `#22c358` (eco-friendly theme)
- **Dark Mode**: Black/Gray backgrounds with green accents
- **Neo-brutalist Style**: Bold borders, shadows like `shadow-[4px_4px_0px_0px_#000]`

### Typography
- Font: System fonts with Tailwind defaults
- Mobile-first responsive design

### Components
- Cards with thick borders and drop shadows
- Pill-shaped buttons
- Bottom navigation bar (mobile)

---

## 🔑 KEY FLOWS

### 1. Onboarding → Home
```
index.html → pages/core/onboarding.html → pages/core/home.html
```

### 2. Scanning Flow
```
home.html (Scan button) → scanner/camera.html → scanner/scanning.html → scanner/scan-success.html
```

### 3. Marketplace Flow
```
home.html → marketplace/marketplace.html → marketplace/item-*.html
```

### 4. Gamification
```
home.html → gamification/leaderboard.html
         → gamification/missions.html
         → gamification/wrapped.html
```

---

## � COMMON TASKS

### When asked to add a new page:
1. Create HTML file in appropriate `pages/` subdirectory
2. Include standard head (Tailwind CDN, CSS)
3. Include bottom navigation
4. Add service scripts before `</body>`
5. Update navigation links in related pages

### When asked to modify UI:
1. Check existing component patterns in `pages/components/`
2. Follow neo-brutalist design (bold borders, shadows)
3. Use `#22c358` for primary actions
4. Test mobile-first (375px viewport)

### When asked to add a feature:
1. Create/modify service in `js/services/`
2. Add Demo Mode fallback in the service
3. Wire to HTML page with appropriate event handlers
4. Update `DemoManager` mock data if needed

### When working on Next.js version:
1. Work in `/reloop-nextjs/src/`
2. Use TypeScript
3. Use `demo-manager.ts` for mock data
4. Follow React best practices

---

## 🏃 RUNNING LOCALLY

### Static HTML App
```bash
# From project root
npx serve .
# OR
python -m http.server 3000
```

### Next.js App
```bash
cd reloop-nextjs
npm install
npm run dev
```

---

## ⚠️ IMPORTANT NOTES

1. **Always check Demo Mode**: Wrap new features with `DemoManager.isEnabled` check
2. **Mobile-first**: Design for 375px width first
3. **No purple/violet**: Use green `#22c358` as primary color
4. **Relative paths**: Pages use `../../js/` and `../../css/` for assets
5. **Firebase config**: Real config is in `js/firebase-config.js` (gitignored)

---

## 🧪 TESTING CHECKLIST

Before considering a feature complete:
- [ ] Works in Demo Mode (no network)
- [ ] Works in Real Mode (with Firebase)
- [ ] Mobile responsive (375px - 430px)
- [ ] Navigation links work
- [ ] No console errors

---

## 📍 CURRENT STATUS

**Active Development Areas:**
- Static HTML demo (primary for hackathon)
- Next.js version (future production)

**Pending Features:**
- Enhanced AI recommendations
- Real-time chat for trades
- Push notifications

---

## 🚀 QUICK COMMANDS

```bash
# Serve static app
npx serve .

# Run Next.js dev
cd reloop-nextjs && npm run dev

# Deploy to Netlify (static)
netlify deploy --prod

# Deploy Cloudflare Worker
cd cf-worker && wrangler deploy
```
