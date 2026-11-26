# Media policy

## Permanent rule

Editorial photographs, video, audio and research documentation **must not** be committed as binary assets to this repository.

Use stable **public HTTPS** URLs (for example Nextcloud public previews or Cloudinary delivery URLs that return the image directly and do not expire). The site does not bind itself to one host. Signed, expiring or private-share URLs are not acceptable for new references.

## Authorised exceptions in Git

| Path | Role |
|---|---|
| Brand SVGs / favicon under `public/imgs/` | Interface assets |
| `public/imgs/contact-twint.png` | TWINT personal-contact QR |
| `public/imgs/stripe.png` | Stripe Payment Link QR |
| Existing legacy media already under `public/imgs/` and `public/history/` | Compatibility — do not delete without review |

Brand patterns may load from https://github.com/linalopes/SchoolAI-brand-kit.

## Sheets and Markdown images

- Hero, archive, workstations and wishlist images: HTTPS URLs in Google Sheets.  
- Gallery photographs: HTTPS URLs in `src/content/pages/inverted-gallery.md`.  
- Always provide meaningful `alt` text when an image is supplied (wishlist validation requires alt when `image_url` is set).

## Legacy inventory (compatibility)

| Public path | Role | Later move |
|---|---|---|
| `/imgs/sota-horizontal-bg-transparent-dark.svg`, `/imgs/favicon.svg` | Brand mark and icon | May remain |
| `/imgs/pepper_ghost_pyramid_template_6cm.svg` | Pepper’s Ghost download | Keep with that page |
| `/imgs/lina.jpg` | Portrait on legacy pages | Replace with HTTPS URL before removal |
| `/imgs/space/*` | Used by `/space3d.html` and related history pages | Externalise carefully; preserve URLs until checked |
| `/history/*.pdf` | Historical screenshots | Leave until owner approves deletion |

Do not migrate, delete or rename legacy media during documentation-only work. Do not commit QA screenshots to Git.

## Future externalisation steps

1. Choose a stable public HTTPS URL for each photograph.  
2. Update the page or tour to that URL. Do not copy files into `src/` or run remote editorial media through Astro’s image pipeline as the default.  
3. Confirm nothing still needs the old path before removing a repository file.  
