# CSV parser decision

Phase 2 uses a small shared parser in `src/lib/sheets/csv.ts` instead of adding `csv-parse`.

## Why

- Hero and events refresh in the browser from the same published CSV contracts as the Node refresh script.
- `csv-parse` is oriented around Node streams and would either pull Node-only APIs into the client bundle or force a second parser.
- AGENTS.md asks not to add dependencies without justification. One shared, tested parser is the smaller surface.
- `@types/node` is a justified TypeScript-only dependency for `node:fs` / `node:path` in the snapshot and refresh scripts. It is not a runtime CSV dependency.

## Behaviour

The parser supports UTF-8 BOM, CRLF and LF, quoted commas, escaped quotes (`""`), multiline quoted fields, empty optional cells, required-header validation, and unclosed-quote detection.

Rows are then validated by the typed feed adapters. Presentation code never reads raw CSV cells.
