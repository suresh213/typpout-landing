# Typpout — Astro landing site

The marketing site for [Typpout](https://www.typpout.com), the AI go-to-market platform that listens to social conversations, finds ICP-matched buyers, and books meetings with personalised AI outreach.

Built with **Astro v6** + **Tailwind v4**. Ships static HTML with near-zero JS, optimised for Lighthouse 95+ and strong SEO.

## What's in here

```
public/               static assets — favicon, robots.txt, sitemap (generated)
src/
  components/         Astro components (Header, Footer, Hero, Features, …)
  content/blog/       Markdown blog posts (typed via content collection)
  content.config.ts   Astro content collection schema
  data/site.ts        Single source of truth for nav, footer, keywords, URLs
  layouts/Layout.astro  Base layout — wraps every page, injects SEO/meta
  pages/
    index.astro       Home
    pricing.astro     Pricing
    blogs/            Blog index + dynamic [...slug] detail
    404.astro         Custom 404
    rss.xml.ts        Auto-generated RSS feed
  styles/global.css   Tailwind v4 entry + design tokens + utilities
astro.config.mjs      sitemap integration, Tailwind v4 vite plugin
```

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to ./dist
npm run preview    # serve the production build locally
```

Node 22.12+ is required (matches `package.json` engines).

## Adding a blog post

1. Create `src/content/blog/your-slug.md`.
2. Add frontmatter (matching the schema in `src/content.config.ts`):
   ```yaml
   ---
   title: "Your title"
   description: "Used for meta description and OG share."
   pubDate: 2026-05-20
   updatedDate: 2026-05-22
   author: "Your name"
   category: "Comparisons"
   tags: ["AI SDR", "outbound"]
   readingTime: "8 min read"
   featured: true
   ---
   ```
3. Write Markdown. The post auto-appears on `/blogs`, in the sitemap, and in the RSS feed. Schema.org `Article` JSON-LD is emitted automatically.

## Design system

Defined in `src/styles/global.css` as Tailwind v4 `@theme` tokens — colours, fonts, easing, pastels. Fonts: **Inter** (sans) + **Instrument Serif** (display, self-hosted via Google Fonts). All design choices live in one file — change a CSS variable, the whole site updates.

Utility classes worth knowing:
- `.h-hero` / `.h-section` / `.h-card` — typographic scales.
- `.eyebrow` — small uppercase labels above section headlines.
- `.btn`, `.btn-primary`, `.btn-brand`, `.btn-ghost` — CTAs.
- `.card-soft`, `.tier`, `.grid-bg`, `.marquee`, `.prose-typpout` — section primitives.
- `data-reveal` — fades in on scroll via the IntersectionObserver in `Layout.astro`.

## SEO

Every page goes through `src/components/SEO.astro` (via the Layout's props) and gets:
- Canonical URL, Open Graph, Twitter Card meta tags.
- `robots.txt` allowing all + sitemap reference.
- Auto-generated `sitemap-index.xml` (via `@astrojs/sitemap`).
- Default Organization JSON-LD, overridable per page.
- Blog posts emit Article JSON-LD; FAQ component emits FAQPage JSON-LD.
- Keywords pulled from `KEYWORDS` in `src/data/site.ts`.

## Performance

- Static output — no SSR, no server cost.
- One CSS bundle, two tiny inline scripts on the home page (no JS frameworks).
- Self-hosted font subsets via Google Fonts CDN with `preconnect` hints.
- Compressed HTML output.
- `prefers-reduced-motion` honoured globally.

## Deploy

The `dist/` folder is plain static HTML. Drop it on Netlify, Vercel, Cloudflare Pages, S3+CloudFront — anywhere. Set the `site` URL in `astro.config.mjs` if you're moving off `https://www.typpout.com`.

## Commands

| Command           | What it does                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start dev server                        |
| `npm run build`   | Production build into `./dist`          |
| `npm run preview` | Preview the production build            |
| `npm run astro`   | Run Astro CLI (`astro add`, `check`, …) |
