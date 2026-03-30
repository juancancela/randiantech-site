# Randiantech Website

Corporate website for **Randiantech**, an AI consulting firm specializing in enterprise AI training, staff augmentation, and AI product development.

**Live:** [https://randiantech.com](https://randiantech.com)

## Tech Stack

- **Framework:** [Astro 4](https://astro.build/) (hybrid mode — static pages + serverless API)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Frontend interactivity:** React 18 (islands), vanilla JS for modals/forms
- **Deployment:** [Vercel](https://vercel.com/) with `@astrojs/vercel` adapter
- **Email:** [Resend](https://resend.dev/) for transactional emails from API endpoints
- **i18n:** Custom path-based routing (EN default at `/`, ES at `/es/`)
- **Fonts:** Inter + JetBrains Mono (Google Fonts)

## Project Structure

```
src/
├── components/         # Reusable Astro components
│   ├── Header.astro        # Sticky header with nav, language switcher, theme toggle
│   ├── Footer.astro        # Multi-column footer with locale-aware links
│   ├── Breadcrumbs.astro   # Locale-aware breadcrumb navigation
│   ├── CookieConsent.astro # GDPR cookie banner (localStorage persistence)
│   ├── LanguageSwitcher.astro  # EN/ES toggle
│   ├── Socials.astro       # Social media icon links
│   └── ...
├── i18n/
│   ├── translations.ts     # All UI content in EN and ES
│   └── utils.ts            # getLocaleFromUrl, getLocalizedPath helpers
├── layouts/
│   ├── Layout.astro        # Base HTML layout (head, meta, fonts, scripts)
│   └── AboutLayout.astro   # (legacy, unused — about is now .astro)
├── pages/
│   ├── index.astro         # Home — hero with SVG illustration, services, stats, tech, CTA
│   ├── about.astro         # About — timeline, differentiators, stats, tech stack
│   ├── services.astro      # Services — AI Training, Staff Aug, AI Product Dev
│   ├── team.astro          # Team — leadership + engineering cards
│   ├── careers.astro       # Careers — job descriptions with modal apply (LinkedIn URL)
│   ├── contact.astro       # Contact — form submitting to /api/contact
│   ├── privacy.astro       # Privacy policy
│   ├── tos.astro           # Terms of service
│   ├── 404.astro           # Not found page
│   ├── robots.txt.ts       # Dynamic robots.txt
│   ├── api/
│   │   ├── contact.ts      # POST — sends contact form email via Resend
│   │   └── apply.ts        # POST — sends job application email via Resend
│   └── es/                 # Spanish versions of all pages
│       ├── index.astro
│       ├── about.astro
│       ├── services.astro
│       ├── team.astro
│       ├── careers.astro
│       ├── contact.astro
│       ├── privacy.astro
│       ├── tos.astro
│       └── 404.astro
├── styles/
│   └── base.css            # Tailwind layers, color tokens, component classes, scroll animations
├── config.ts               # Site metadata, social links, logo config
└── types.ts                # TypeScript type definitions
public/
├── favicon.svg             # "Rt" branded favicon
├── scroll-animate.js       # Intersection Observer scroll animations
├── toggle-theme.js         # Light/dark theme toggle
└── images/services/        # Service icons (SVG/PNG)
```

## Design System

### Color Tokens (CSS custom properties)

Defined in `src/styles/base.css` with light and dark variants:

| Token | Usage |
|-------|-------|
| `--color-fill` | Page background |
| `--color-text-base` | Primary text |
| `--color-accent` | Brand blue (links, buttons, highlights) |
| `--color-card` | Card backgrounds |
| `--color-card-muted` | Muted card/section backgrounds |
| `--color-border` | Borders and dividers |

### Component Classes

| Class | Purpose |
|-------|---------|
| `.card` | Bordered card with hover accent border + shadow |
| `.card-flat` | Bordered card without hover effect |
| `.btn-primary` | Blue filled button |
| `.btn-outline` | Bordered transparent button |
| `.section-label` | Uppercase accent label (e.g., "Services") |
| `.gradient-text` | Accent gradient text effect |
| `[data-animate]` | Scroll fade-in-up animation trigger |

### Scroll Animations

Add `data-animate` to any element to make it fade in on scroll. Use `data-animate-delay="200"` for staggered timing (in ms). Powered by `public/scroll-animate.js` using Intersection Observer.

## i18n

- **English:** `/` (default, no prefix)
- **Spanish:** `/es/` prefix
- Shared translations in `src/i18n/translations.ts`
- Header, Footer, Breadcrumbs auto-detect locale from URL
- `LanguageSwitcher` component toggles between EN/ES preserving current page

## API Endpoints

Both run as Vercel serverless functions (`prerender = false`).

### `POST /api/contact`

Sends a contact form email.

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string (optional)",
  "message": "string"
}
```

### `POST /api/apply`

Sends a job application email.

```json
{
  "role": "string",
  "linkedinUrl": "string"
}
```

Both endpoints send emails to `cancela.juancarlos@gmail.com` via Resend.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Resend API key for email delivery | Yes (for API endpoints) |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification | No |

Set in `.env` locally and in Vercel Dashboard > Settings > Environment Variables for production.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Requires Node.js 20+. Use `fnm use 20.11.1` if using fnm.

## Deployment

The site deploys automatically to Vercel on push to `main`. The Vercel adapter runs in hybrid mode:
- Static pages are prerendered at build time
- API endpoints (`/api/*`) run as serverless functions

**DNS:** `randiantech.com` (A record → Vercel) and `www.randiantech.com` (CNAME → Vercel DNS).

---

## Agent Context Prompt

Use the following as a first message when starting a new coding session with an AI agent to give it full context about this project:

```
I'm working on the Randiantech corporate website at /Users/jcancela/Documents/personal/code/randiantech-site.

## Project Overview
- **What:** Corporate site for Randiantech, an AI consulting firm (enterprise AI training, staff augmentation, AI product development)
- **Stack:** Astro 4 (hybrid mode) + Tailwind CSS 3 + React 18 + Vercel (serverless) + Resend (email)
- **Repo:** github.com/juancancela/randiantech-site, branch: main, auto-deploys to Vercel
- **Live:** https://randiantech.com

## Architecture
- Astro hybrid mode: static pages + serverless API endpoints at /api/contact and /api/apply
- i18n: EN at / (default), ES at /es/ — translations in src/i18n/translations.ts
- Design system: CSS custom properties for colors (--color-fill, --color-accent, etc.), Tailwind utility classes, component classes (.card, .btn-primary, .section-label, .gradient-text, [data-animate])
- Fonts: Inter (sans) + JetBrains Mono (mono) via Google Fonts
- Email: Resend SDK, API key in .env (RESEND_API_KEY), sends to cancela.juancarlos@gmail.com

## Key Files
- src/config.ts — site metadata, social links
- src/styles/base.css — color tokens (light/dark), component classes, scroll animation CSS
- src/i18n/translations.ts — all UI text in EN and ES
- src/i18n/utils.ts — getLocaleFromUrl(), getLocalizedPath()
- src/layouts/Layout.astro — base HTML with head, fonts, cookie banner, scroll-animate script
- src/components/Header.astro — sticky nav with language switcher and theme toggle
- src/pages/api/contact.ts — POST endpoint for contact form (Resend)
- src/pages/api/apply.ts — POST endpoint for job applications (Resend)
- public/scroll-animate.js — Intersection Observer for [data-animate] elements
- tailwind.config.cjs — extends skin color system, Inter/JetBrains Mono fonts

## Pages (EN + mirrored in /es/)
Home (index.astro) — hero with SVG illustration, services grid, stats, client logos, tech stack, CTA
About (about.astro) — timeline, differentiators grid, stats, tech by category, CTA
Services (services.astro) — 3 service blocks (AI Training, Staff Aug, AI Product Dev) with sub-items
Team (team.astro) — leadership + engineering member cards with avatars
Careers (careers.astro) — 5 roles with detailed JDs in modals, LinkedIn URL apply via /api/apply
Contact (contact.astro) — form submitting to /api/contact, contact cards, "what to expect" steps
Privacy, ToS, 404

## Dev Environment
- Node 20.11.1 (use fnm use 20.11.1)
- npm run dev / npm run build / npm run preview
- DNS: randiantech.com → Vercel (A record), www.randiantech.com → Vercel (CNAME)
```
