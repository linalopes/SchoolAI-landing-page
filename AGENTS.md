# Agent instructions — SchoolAI website

Read README and docs before edits. Follow approved phase scope. Preserve existing visual identity (official SchoolAI-brand-kit), split hero and functional integrations. Do not redesign or add dependencies without justification and approval. All public copy English. Wetzikon-Zürich explicit. Use Artificial Emotion singular. Inverted Gallery is the confirmed English name. Only that space is offered for rental.

**Editorial content must not live in Astro or TypeScript.** Institutional copy, homepage sections, gallery narrative, rental rates, financial support text, CTA labels, SEO descriptions and external editorial image URLs belong in Markdown under `src/content/`. Components present; TypeScript validates feeds and application logic. Do not duplicate sources of truth.

Google Sheets remains the source for hero, events, research archive, workstations and contributors. Markdown updates require rebuild/deploy; sheet updates use `npm run refresh-feeds` plus client refresh with last-known-good fallback. Footer address lives in `src/content/site/footer.md`.

Financial support (TWINT personal-contact QR and Stripe Payment Link) is configured in `src/content/support/financial-support.md`. Do not add Stripe SDK, API keys, webhooks or custom checkout. Authorised functional media exceptions: `public/imgs/contact-twint.png` and `public/imgs/stripe.png`. Never store editorial photographs, video, audio or research documentation binaries in Git. Reference stable public HTTPS media URLs. Audit legacy media before removal; preserve URLs.

Maintain external research repositories and hyperlinks; never import full projects or personal blog articles. Separate loaders, schema validation and presentation. Do not use raw HTML from Sheets.

No invented partners, research outcomes, names, images or claims. No private data in Git or published spreadsheets, including draft rows. No implication of nonprofit status, tax deductibility, formal programs or unrestricted access. Preserve Formspree and 3D functionality pending audit. No production deployment, destructive changes, live sheet edits or payment changes without approval. Use a branch and small reviewable commits. Validate build, tests, links, accessibility, responsiveness and legacy URLs. Report blockers, assumptions and changes. Update documentation when architecture changes.
