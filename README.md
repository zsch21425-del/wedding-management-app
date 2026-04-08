# Wedding Management App

A complete, single-user wedding planning app built with React + Vite + TypeScript + Tailwind CSS. All data persists in localStorage — no backend required.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or deploy to Netlify:

```bash
npm run build
# Upload the `dist/` folder to Netlify
```

## Modules

| Module | Description |
|--------|-------------|
| Color Scheme Visualizer | Live mockup previews, 8 preset palettes, save/switch schemes, vendor export |
| Dashboard | Countdown timer, stats, to-do list, vendor payments, today's focus |
| Guest List Manager | CRUD, CSV import/export, RSVP pie chart, seating view |
| Vendor Management | CRUD, color-coded status badges, payment timeline, contact cards |
| Budget Tracker | Per-category tracking, progress bars, budget health meter |
| Wedding Checklist | Tasks by time bucket, assignees, due dates, progress tracking |
| Venue Planner | Ceremony + reception cards, day-of timeline editor |
| Trends & Ideas Hub | 20+ curated articles, category filters, bookmarks |
| Inspiration Board | Image upload/link, tagging, color overlay tool, lightbox, pinning |
| Settings | Wedding details, JSON backup/restore, data reset |

## Tech Stack

- **Framework:** React 18 + Vite 5 (TypeScript)
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts
- **Icons:** lucide-react
- **Date math:** date-fns
- **Persistence:** localStorage via custom `useLocalStorage` hook

## Sample Data

The app comes pre-populated with realistic sample data (10 guests, 4 vendors, budget entries, checklist tasks) so it looks alive immediately. Reset anytime via Settings.
