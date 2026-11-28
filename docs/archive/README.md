# Archived documentation — Website 2027 migration

> **Archival notice.** Documents in this folder record planning and decisions from the Website 2027 migration. They are preserved for historical context only.
>
> The Website 2027 migration project closed with release **`v2.1.0`** (26 November 2026). Temporary Git branch `website-2027` was retired after verification that it contained no commits missing from `main`. References to that branch inside archived documents remain as historical wording.
>
> Post-baseline maintenance on `main` (including Publications and legacy `.html` consolidations prepared as **`v2.2.0`**) is documented in active docs and [CHANGELOG.md](../../CHANGELOG.md) — not in this archive.
>
> They must **not** be treated as current implementation requirements.
>
> For active instructions see:
>
> - [Owner content management](../editorial/content-management.md)
> - [Google Sheets reference](../editorial/google-sheets.md)
> - [Technical architecture](../technical/architecture.md)
> - [Deployment](../technical/deployment.md)
> - [AGENTS.md](../../AGENTS.md)
> - [CHANGELOG.md](../../CHANGELOG.md)

| Document | Why archived |
|---|---|
| [implementation-plan.md](implementation-plan.md) | Phased delivery and acceptance criteria; migration complete |
| [decisions-2026-11-26.md](decisions-2026-11-26.md) | Decision log from 26 November 2026; several items superseded (wishlist as Sheets, live payments, six feeds) |
| [website-copy.md](website-copy.md) | Draft institutional copy; published copy lives in `src/content/` |
| [research-archive.md](research-archive.md) | Early Research Archive curation notes |
| [content-model.md](content-model.md) | Mixed live contracts and speculative column models |
| [technical-architecture-phase-4a.md](technical-architecture-phase-4a.md) | Pre-cutover architecture describing `website-2027` as release candidate |
| [csv-parser.md](csv-parser.md) | Parser decision; behaviour summarised in [feed resilience](../technical/feed-resilience.md) |

Canonical public website copy is in `src/content/`, not in duplicated documentation drafts.
