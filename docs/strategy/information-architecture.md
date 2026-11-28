# Information architecture

Production institutional website for School of Tomorrow’s AI. Routes and navigation below match the implementation on `main`.

## Institutional dimensions

| Dimension | Route | Purpose |
|---|---|---|
| About | `/about/` | Institutional identity and philosophy |
| Research | `/research/` | Ongoing investigations (Artificial Emotion + Research Archive) |
| Atelier | `/atelier/` | Physical infrastructure and experimental making |
| Programme | `/programme/` | Thematic public programmes and encounters |
| Publications | `/publications/` | Selected authored knowledge and artefacts beyond their original context |
| Inverted Gallery | `/inverted-gallery/` | Cultural exchange and space rental |
| Collaborate | `/collaborate/` | Collaboration and contribution pathways |

Homepage `/` introduces each dimension; dedicated pages hold full detail. Research Wishlist lives under Collaborate (`/collaborate/wishlist/`), not as a primary nav item.

## Institutional routes

| Route | Purpose |
|---|---|
| `/` | Positioning, live hero carousel, selected research, atelier, programme, publications teaser, gallery and collaboration |
| `/about/` | The School — origin, philosophy, open research and founder |
| `/research/` | Artificial Emotion flagship and curated Research Archive |
| `/atelier/` | Eight research workstations and existing 3D tour |
| `/programme/` | Current programme, upcoming events, activity formats, past programmes, past events |
| `/publications/` | Curated authored publications |
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
- Publications → `/publications/`
- Inverted Gallery → `/inverted-gallery/`
- **Collaborate** → `/collaborate/` (highlighted CTA, not a plain text nav item)

Desktop text links switch to the hamburger menu at **max-width 1279px**. Footer Explore lists the same destinations plus Collaborate.

Pepper’s Ghost is discovered through Publications, not as a separate primary nav item.

**Made possible by** is a section inside Collaborate. There is no standalone `/collaborate/contributors/` route.

Homepage keeps compatibility anchors `#research`, `#atelier`, `#programme`, `#publications`, `#gallery` and `#collaborate`. The logo returns `/`.

## Homepage sections

Preserve the split hero and spreadsheet-driven carousel. Below the hero, in editorial order:

1. School introduction  
2. Artificial Emotion (flagship research)  
3. Selected research (archive feed)  
4. Atelier preview and maps link  
5. Programme preview  
6. Publications teaser  
7. Inverted Gallery introduction  
8. Collaborate pathways teaser  
9. Newsletter  

## Publications

`/publications/` presents selected authored outputs. Each Markdown entry in `src/content/publications/` links to its destination (internal experiment route or independent external application). There are no individual publication detail pages when the destination already is the publication.

| Launch publication | Format | Destination |
|---|---|---|
| Pepper’s Ghost | Interactive Publication | `/peppers-ghost.html` (institutional site) |
| Paper as Interface | Research Board | Independently hosted app + optional GitHub; Arduino Day contextual link |

Covers use optional public HTTPS URLs; typographic fallbacks when no cover is hosted are intentional. Unpublished entries (`published: false`) stay hidden. Offline builds do not depend on external publication apps.

## Programme

Section order on `/programme/`:

1. Current Programme (Markdown — Artificial Emotion public programme, January–June 2027)  
2. Upcoming Events (Events feed; cancelled rows omitted)  
3. Activity Formats (Open Research Studio; research-based workshops)  
4. Past Programmes (Markdown — archived programmes such as Room for Interaction)  
5. Past Events preview (Events feed)  
6. Newsletter  

The Current Programme period describes the public programme semester. It does not redefine the duration of the Artificial Emotion research project on `/research/`. Past Programmes remain distinct from Past Events (individual dates).

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
| Publication records | `src/content/publications/` |
| Gallery rates | `src/content/gallery/rental-rates.md` |
| Financial support | `src/content/support/financial-support.md` |
| Footer / location | `src/content/site/` |
| Live feeds | Google Sheets → `src/data/feeds/*.json` (six feeds; no Publications feed) |

## Legacy compatibility

| Route or asset | Status |
|---|---|
| `/arduino-day-2026.html` | Migrated to Markdown + Astro; flattened public URL |
| `/room-for-interaction.html` | Migrated to Markdown + Astro; flattened public URL |
| `/room-for-interaction.json` | Compatibility endpoint from the same Markdown source |
| `/peppers-ghost.html` | Migrated to Markdown + Astro + `src/scripts/peppers-ghost.ts` |
| `/space3d.html` | Intentionally preserved standalone application under `public/` |
| `/history/` | Intentionally preserved historical assets |

`scripts/flatten-html-routes.mjs` runs after the Astro build so selected routes remain root-level `.html` files. Existing domain and HTTPS remain. Do not delete or migrate intentional standalone/history assets without owner approval.
