# Information architecture

| Route | Purpose | Key action |
|---|---|---|
| `/` | Positioning, live editorial hero, selected research, atelier, programme, gallery and collaboration | Explore research / Collaborate |
| `/about/` | School, origin, philosophy, open research and founder | Learn about Lina / Contact |
| `/research/` | Artificial Emotion, research threads and curated archive | Follow research notebook / Propose research |
| `/atelier/` | Eight research workstations, optional photographs, existing 3D tour | Arrange a visit |
| `/programme/` | Open Research Studio, research-derived workshops, past/upcoming events | View event / Register externally |
| `/inverted-gallery/` | Concept, cultural programme, space hire and curator inquiry | Inquire about space / Curatorial collaboration |
| `/collaborate/` | Research, students, partners, commissions, financial support | Contact / Contribute |
| `/collaborate/wishlist/` | Editorial research needs and campaign links | Offer a contribution |
| `/collaborate/contributors/` | Permanent permission-based credits | Learn about support |

Space hire means the Inverted Gallery only. The research atelier and its workstations are not rental spaces.

Primary navigation (live destinations): The School → `/about/`; Research → `/research/`; The Atelier → `/atelier/`; Programme → `/#programme`; Inverted Gallery → `/#gallery`; Collaborate → `/#collaborate`. Homepage keeps `#research` and `#atelier` anchors for compatibility. Logo returns `/`. Remaining routes stay in `plannedRoutes` until they ship. Footer: location, contact, The School, Lina Lopes, blog. No standalone news blog; hero updates are short links to meaningful content. No automatic detail pages for archived projects; external links are preferred.

## Homepage composition
Preserve current split hero and carousel, including responsive behavior and brand pattern. Left: tagline, Wetzikon-Zürich, short descriptor, CTAs. Right: spreadsheet-driven featured items (image, short text, link). Below: school intro, flagship research, atelier preview, programme, gallery introduction, collaboration and credits teaser, occasional newsletter. Reuse current visual components rather than creating a new design language.

## Legacy URLs
Inventory all current routes, including `arduino-day-2026.html`, `peppers-ghost.html`, `room-for-interaction.html`, `room-for-interaction.json`, `space3d.html`, `/history/` and existing home anchors. Preserve functioning URLs or provide tested compatibility pages/redirects appropriate to static hosting. Maintain existing domain and HTTPS. Do not delete old content without review.
