---
id: 33-ph6-daily-angel-card-con-immagine-angel-01
title: [Ph6] Daily Angel card con immagine — ANGEL-01
status: draft
created: 2026-10-19
updated: 2026-10-19
owner: issue-bridge
executor: orchestrator
gh_body_sha: 
gh_issue: 33
gh_state: OPEN
gh_synced_at: 2026-10-19T14:25:36Z
---

## Goal
[Ph6] Daily Angel card con immagine — ANGEL-01

## Inputs Available
## Goal
Ogni giorno l'utente riceve una carta degli angeli personalizzata in base al mood e alla fase lunare.

## Requirements
**ANGEL-01** — Angel Cards

## Success Criteria
1. `src/data/angel_cards_seed.json` con >= 20 carte (id, name IT, description IT, moodRange, moonPhases, imagePath)
2. Immagini bundled in `public/images/angels/` (formato WebP/PNG)
3. Engine di selezione ponderata (pattern identico all'oracle engine: mood range filter + moon phase bonus)
4. Carta angel mostrata in sezione dedicata della home/oracle page con immagine, nome, descrizione
5. Risultato persistito nel MoodLog (campo aggiuntivo `angelCardId`)
6. Togglable dalle Impostazioni

## Note v2
Questa feature e' parte della v2 (Phase 6). Non richiede backend.

## Dipendenze
- Phase 5 completata
- Oracle engine (Phase 2) come pattern di riferimento

## Success Criteria
- 

## Scope
- 

## Safety
- 

## Outputs Required
- 

## Test Plan
- 

## Verification
- 

## Notes / Edge Cases
- 

