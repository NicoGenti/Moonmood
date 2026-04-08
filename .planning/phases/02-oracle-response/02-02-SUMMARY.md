---
phase: 02-oracle-response
plan: "02"
subsystem: data
tags: [oracle, seed-data, italian-content, json]
dependency_graph:
  requires: [02-01]
  provides: [src/data/oracle_seed.json, src/data/remedies_seed.json, src/data/aphorisms_seed.json]
  affects: [02-04, 02-03]
tech_stack:
  added: []
  patterns: [static-json-seed, italian-content-authoring]
key_files:
  created:
    - src/data/oracle_seed.json
    - src/data/remedies_seed.json
    - src/data/aphorisms_seed.json
  modified: []
decisions:
  - "Default card is card-010 (L'Equilibrio dei Venti) with moodRange [2,8] and Waxing Gibbous + Waning Gibbous phases — neutral yet meaningful mid-range coverage"
  - "Remedy category distribution evened out from 7 scrittura to 6, moving card-020 remedy to movimento category"
metrics:
  duration: 5 min
  completed: "2026-04-08"
  tasks_completed: 2
  files_modified: 3
---

# Phase 02 Plan 02: Oracle Seed Data Summary

**One-liner:** 22 hand-crafted Italian oracle cards with matching remedies and 12 aphorisms, covering full mood range 0-10 and all 8 moon phases.

## What Was Built

Created the complete static seed data layer for the oracle system — the "soul" of the product — comprising three JSON files:

### `src/data/oracle_seed.json` (22 cards)
- 22 oracle cards with poetic Italian names, descriptions (1-3 sentences each), mood ranges, moon phase arrays, and Italian tags
- Full mood range coverage: low (0-3), low-mid (1-4), mid (3-7), mid-high (4-8), high (6-10), peak (8-10)
- All 8 moon phases covered, each appearing in ≥2 cards: New Moon(5), Waxing Crescent(4), First Quarter(4), Waxing Gibbous(7), Full Moon(9), Waning Gibbous(5), Last Quarter(5), Waning Crescent(5)
- Exactly 1 default card: `card-010` "L'Equilibrio dei Venti" — moodRange [2,8], isDefault: true

### `src/data/remedies_seed.json` (22 remedies)
- One remedy per oracle card, all `linkedCardId` values resolve to existing card IDs
- Categories distributed: meditazione(4), natura(4), scrittura(6), respiro(4), movimento(4) — all within 2-6 range
- Each remedy 1-2 Italian sentences, practical and sensory

### `src/data/aphorisms_seed.json` (12 aphorisms)
- 12 original Italian aphorisms about moon, moods, inner life, and transformation
- Mix of short maxims (5-10 words) and longer reflective phrases
- Standalone — not linked to cards; ready for future UI display

## Verification Results

```
Cards: 22 Remedies: 22
Default cards: 1
All remedies linked: true
All 8 phases covered (>=2 cards each): true
Category distribution: { meditazione: 4, natura: 4, scrittura: 6, respiro: 4, movimento: 4 }
Aphorisms: 12
```

All verification scripts exit 0.

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author oracle_seed.json and remedies_seed.json | c1fe3b8 | src/data/oracle_seed.json, src/data/remedies_seed.json |
| 2 | Author aphorisms_seed.json | 140ad77 | src/data/aphorisms_seed.json |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Remedy category distribution exceeded maximum**
- **Found during:** Task 1 verification
- **Issue:** Initial distribution had `scrittura: 7` which exceeded the max of 6 per the plan spec
- **Fix:** Changed `remedy-020` (card-020 La Riva Lontana) from `scrittura` to `movimento`, replacing the writing prompt with a walking practice
- **Files modified:** src/data/remedies_seed.json
- **Commit:** c1fe3b8 (included in original commit after fix)

## Known Stubs

None — all data is fully authored content. No placeholders, no empty arrays, no TODO markers.

## Self-Check: PASSED

```
FOUND: src/data/oracle_seed.json
FOUND: src/data/remedies_seed.json
FOUND: src/data/aphorisms_seed.json
FOUND commit: c1fe3b8
FOUND commit: 140ad77
```
