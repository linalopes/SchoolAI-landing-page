# Information architecture

Production institutional website for School of Tomorrow’s AI. Routes and navigation below match the implementation on `main` (reference: `c523a15`).

## Institutional routes

| Route | Purpose |
|---|---|
| `/` | Positioning, live hero carousel, selected research, atelier, programme, gallery and collaboration |
| `/about/` | The School — origin, philosophy, open research and founder |
| `/research/` | Artificial Emotion flagship and curated Research Archive |
| `/atelier/` | Eight research workstations and existing 3D tour |
| `/programme/` | Open Research Studio, research-based workshops, upcoming and past events |
| `/inverted-gallery/` | Gallery concept, cultural programme, space rental and inquiry |
| `/collaborate/` | Collaboration pathways, Research Wishlist teaser, financial support, Made possible by, contact |
| `/collaborate/wishlist/` | Research Wishlist — current needs and fulfilled contributions |

Custom **404** (`/404.html`) is not an institutional content route.

Space hire means **Inverted Gallery** only. The research atelier and its workstations are not rental spaces.

## Primary navigation

Live destinations in the header:

- About → `/about/`
- Research → `/research/`
- Atelier → `/atelier/`
- Programme → `/programme/`
- Inverted Gallery → `/inverted-gallery/`
- **Collaborate** → `/collaborate/` (highlighted CTA, not a plain text nav item)

Research Wishlist is linked from Collaborate (`/collaborate/wishlist/`), not from primary navigation.

**Made possible by** is a section inside Collaborate. There is no standalone `/collaborate/contributors/` route.

Homepage keeps compatibility anchors `#research`, `#atelier`, `#programme`, `#gallery` and `#collaborate`. The logo returns `/`.

## Homepage sections

Preserve the split hero and spreadsheet-driven carousel. Below the hero, in editorial order:

1. School introduction  
2. Artificial Emotion (flagship research)  
3. Selected research (archive feed)  
4. Atelier preview and maps link  
5. Programme preview  
6. Inverted Gallery introduction  
7. Collaborate pathways teaser  
8. Newsletter  

Dedicated pages hold full detail; homepage sections stay concise.

## Programme

- Open Research Studio  
- Research-based workshops  
- Upcoming events (from Events feed; cancelled rows omitted)  
- Past events preview  

## Atelier workstations

Eight editorial workstations (not including Inverted Gallery): BioLab, Makerspace, Dirty Workshop, Electronics Bench, Wearables Lab, Craft Office, Studio, Saloon.

## Collaborate

Six pathways (research, students, technology partnerships, commissions, hands-on contributions, financial support), then:

1. Research Wishlist teaser → `/collaborate/wishlist/`  
2. Financial support (TWINT / Stripe from Markdown)  
3. Made possible by (Contributors feed)  
4. Contact  

## Research Wishlist

- Current needs: published `open` and `in-progress` items, grouped by category  
- Made possible together: published `fulfilled` items with optional credits  
- Paused items remain in Sheets but are not shown in Current needs or contribution CTAs  

## Shared chrome

- Site header and mobile menu  
- Shared footer: identity and location, Explore, Elsewhere + socials, copyright bar (`© {year}` and Wetzikon-Zürich)  
- Canonical address from `src/content/site/location.md`  

## Content sources

| Kind | Location |
|---|---|
| Page copy | `src/content/pages/` |
| Gallery rates | `src/content/gallery/rental-rates.md` |
| Financial support | `src/content/support/financial-support.md` |
| Footer / location | `src/content/site/` |
| Live feeds | Google Sheets → `src/data/feeds/*.json` |

## Legacy compatibility

Preserve functioning URLs under `public/`:

- `space3d.html`  
- `room-for-interaction.html` (+ JSON)  
- `arduino-day-2026.html`  
- `peppers-ghost.html`  
- `/history/` where present  

Existing domain and HTTPS remain. Do not delete legacy content without review.
