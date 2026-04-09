# Roadmap: Moonmood — Spiritual Mood Tracker

## Overview

Moonmood v1 è una **Progressive Web App puramente frontend**: nessun backend, nessun database server, nessuna autenticazione. Tutti i dati sono persistiti localmente (IndexedDB) e i contenuti oracolari sono bundled nell'app come JSON statico. Le fasi lunari vengono calcolate lato client.

L'interfaccia è progettata **mobile-first** con touch targets e layout responsive che anticipano il porting futuro su React Native (iOS/Android). I componenti UI sono separati dalla logica di dominio per rendere la migrazione verso React Native il più lineare possibile.

**Versioni future:**
- **v2**: Introduzione di backend (.NET 8), database (MongoDB), autenticazione utente e sync cloud
- **v3**: App nativa iOS/Android (React Native + Expo) che condivide la logica di dominio con la web app

**Scope:**
- **v1 (Phases 1-5):** PWA frontend-only con persistenza locale, contenuti bundled, quick wins
- **v2 (Phases 6-8):** Espansione contenuti, introduzione backend (.NET 8 + MongoDB), autenticazione, AI, diari wellness completi

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Mood Input** - User can log daily mood with Moonmood UI and liquid slider (completed 2026-04-07)
- [x] **Phase 2: Oracle Response** - App delivers a meaningful oracle card and remedy based on mood and lunar phase (completed 2026-04-08)
- [x] **Phase 3: Mood History** - User can review past logs and oracle responses (completed 2026-04-08)
- [ ] **Phase 4: PWA Shell** - App is installable and works fully offline
- [ ] **Phase 5: Quick Wins** - Surface bundled content, improve reports, add settings and favorites
- [ ] **Phase 6: Content Expansion** - Angel cards, animal totems, dream diary, lunar strip, social sharing
- [ ] **Phase 7: Backend & Architecture** - Authentication, cloud sync, push notifications, AI integration, multiple daily logs, adaptive music
- [ ] **Phase 8: Diaries & Wellness** - Jodorowsky tarot, menstrual/therapeutic/intestinal diaries, TCM, chakra, meditation, advanced reports

## Phase Details

### Phase 1: Mood Input
**Goal**: Users can log their daily mood through a sensory, beautiful interface and the log is persisted locally in IndexedDB (no backend required)
**Depends on**: Nothing (first phase)
**Requirements**: MOOD-01, MOOD-02, MOOD-03, MOOD-04, UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. User can drag a liquid-animated slider from 0 to 10 to set their mood score
  2. User can optionally type a text note before submitting the log
  3. Reopening the app on the same day shows today's existing log, not a blank form
  4. The Moonmood boreale gradient theme (green, violet, blue, pink) is visible throughout the app
  5. All mood logs survive a full browser refresh (persisted in IndexedDB)
  6. Layout is responsive and usable on mobile screen sizes (≥320px width), with touch targets ≥ 44px
**Plans**: 7 plans

Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js 14 project with all Phase 1 dependencies
- [x] 01-02-PLAN.md — MoodLog types and Dexie.js persistence service with tests
- [x] 01-03-PLAN.md — Zustand mood store and Aurora Boreale animated gradient overlay
- [x] 01-04-PLAN.md — LiquidSlider SVG morphing blob drag component
- [x] 01-05-PLAN.md — MoodNoteInput, SaveMoodButton, and useDailySession hook
- [x] 01-06-PLAN.md — Wire all components into page.tsx/layout.tsx + human verification

### Phase 2: Oracle Response
**Goal**: After submitting a mood log, the user receives a contextually meaningful oracle card and remedy selected by the weighted engine using lunar phase data — all computed client-side with bundled static data
**Depends on**: Phase 1
**Requirements**: ORCL-01, ORCL-02, ORCL-03, ORCL-04, ORCL-05, ASTR-01, ASTR-02, ASTR-03
**Success Criteria** (what must be TRUE):
  1. Submitting a mood log triggers an oracle card reveal with an animated, immersive transition
  2. A remedy suggestion appears alongside the oracle card
  3. The current lunar phase is calculated client-side and shown or logged (no external API call)
  4. Different mood scores and lunar phases produce meaningfully different card selections over repeated use
  5. Oracle content (cards and remedies) loads from bundled static JSON — app works with no network
**Plans**: 6 plans

Plans:
- [x] 02-01-PLAN.md — Install astronomia + define oracle/astrology/mood types + Dexie v2
- [x] 02-02-PLAN.md — Author oracle seed data (22 cards + remedies + aphorisms in Italian)
- [x] 02-03-PLAN.md — TDD: lunar phase service (astronomia) + mood trend service
- [x] 02-04-PLAN.md — TDD: oracle selection engine + useOracleEngine hook
- [x] 02-05-PLAN.md — Wire oracle into useDailySession + /oracle page + flip animation
- [x] 02-06-PLAN.md — Human verification of complete Phase 2 oracle experience
- [x] 02-07-PLAN.md — Close verification gap by defining ORCL/ASTR requirements in REQUIREMENTS.md

### Phase 3: Mood History
**Goal**: Users can reflect on their emotional journey by browsing past logs and their oracle responses, all sourced from local IndexedDB
**Depends on**: Phase 2
**Requirements**: HIST-01, HIST-02
**Success Criteria** (what must be TRUE):
  1. User can navigate to a history view listing all past logs with date, score, and oracle card name
  2. Tapping a past log opens a detail view showing the text note, oracle card, remedy, and lunar phase captured at submission time
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Define history contracts + grouped paging transformer + upgraded useMoodHistory hook
- [x] 03-02-PLAN.md — Build /history card-row month-grouped list UI, load-more, empty-state, and navigation entry points
- [x] 03-03-PLAN.md — Implement route-based history detail experience with graceful fallback and human verification

### Phase 4: PWA Shell
**Goal**: The app is installable on any device (desktop and mobile) and works completely offline after first load
**Depends on**: Phase 3
**Requirements**: UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. A browser install prompt appears (or an install button) allowing the user to add Moonmood to their home screen on both desktop and mobile
  2. After installation, the app loads and all features work with the device in airplane mode
  3. A service worker caches the app shell so reload works offline
**Plans**: TBD

### Phase 5: Quick Wins
**Goal**: Surface existing bundled content (aphorisms, ironic phrases) in the home experience, enhance reports with temporal filters, add a settings page and a favorites system — all within the current local-first PWA architecture
**Depends on**: Phase 4
**Requirements**: ECO-01, STCZ-01, RPT-01, SET-01, FAV-01
**Success Criteria** (what must be TRUE):
  1. The home page displays a daily aphorism ("Eco del Giorno") sourced from the existing aphorisms_seed.json
  2. The home page displays a daily ironic phrase ("Sticazzi") from a new seed dataset
  3. The report page supports temporal filters (7 days, 30 days, 90 days, all time) with updated statistics
  4. A settings page is accessible from navigation with language, notification toggles, and feature flags
  5. Users can mark oracle cards and aphorisms as favorites (heart icon), persisted in IndexedDB
  6. Favorite entries are browsable in a dedicated favorites list view
**Plans**: TBD

### Phase 6: Content Expansion (v2)
**Goal**: Expand the spiritual content ecosystem with new card systems (Angel, Animal Totem), a text-based dream diary, a visual lunar cycle strip with real photos, and social sharing via canvas-generated images — all without requiring a backend
**Depends on**: Phase 5
**Requirements**: ANGEL-01, TOTEM-01, DREAM-01, LUNA-01, SHARE-01
**Success Criteria** (what must be TRUE):
  1. Users receive a daily Angel card with image, sourced from a bundled seed dataset, using a selection engine similar to oracle
  2. Users receive a daily Animal Totem with image, sourced from a bundled seed dataset, with mood-aware selection
  3. Users can write dream diary entries (text) stored in IndexedDB, browsable in a dedicated dream log view
  4. A visual lunar cycle strip displays the current month's moon phases with representative photos
  5. Users can generate and share a mood summary image (1:1 or 9:16 format) via the Web Share API or canvas download
**Plans**: TBD

### Phase 7: Backend & Architecture (v2)
**Goal**: Introduce server-side infrastructure (.NET 8 + MongoDB) to enable user authentication, cloud backup/sync, push notifications, AI-powered features, multiple daily logs, and adaptive background music
**Depends on**: Phase 6
**Requirements**: AUTH-01, SYNC-01, PUSH-01, AI-01, MULTI-01, MUSIC-01
**Success Criteria** (what must be TRUE):
  1. Users can sign in via Google or Apple OAuth and optionally use the app as guest
  2. Mood logs and all local data sync to cloud storage with automatic backup
  3. Push notifications remind users to log their mood (configurable schedule)
  4. AI interprets dream diary entries and generates personalized emotional insights
  5. Users can log mood multiple times per day, visible on an interactive sinusoidal chart
  6. Background music adapts dynamically to the current mood score
**Plans**: TBD

### Phase 8: Diaries & Wellness (v2)
**Goal**: Complete the wellness ecosystem with Jodorowsky tarot readings, specialized health diaries (menstrual, therapeutic, intestinal), Traditional Chinese Medicine content, chakra/aura/meditation modules, crystal/ritual guides, voice journaling, and advanced multidimensional reports
**Depends on**: Phase 7
**Requirements**: TAROT-01, DIARY-MENS-01, DIARY-THER-01, DIARY-INTE-01, WHISPER-01, MTC-01, CHAKRA-01, AURA-01, MEDIT-01, STONE-01, RITUAL-01, RPT-MAP-01, RPT-CONST-01, RPT-POWER-01, RPT-GREEN-01, RPT-ASTRAL-01, RPT-LIGHT-01, TRANSIT-01
**Success Criteria** (what must be TRUE):
  1. Users receive a daily Jodorowsky tarot card reading with authentic imagery and Italian interpretation
  2. Users can track menstrual cycle data with calendar view and trend analysis
  3. Users can log medications/supplements in a therapeutic diary with reminders
  4. Users can track intestinal health with a dedicated diary and symptom patterns
  5. Users can record voice journal entries ("Il Sussurro") with playback and optional transcription
  6. TCM, Acupuncture, Chakra, Aura, Meditation, Crystal, and Ritual sections provide daily mood-aware guidance
  7. Advanced reports include: Temporal Map (colored nebulae), Wellness Constellation, Power Words, Green Heart Method, Astral Synchrony, and "Ricorda la Tua Luce" (difficult moments support)
  8. Planetary transits section shows current astrological transits with mood correlation
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Mood Input | 6/6 | Complete   | 2026-04-07 |
| 2. Oracle Response | 7/7 | Complete    | 2026-04-08 |
| 3. Mood History | 3/3 | Complete | 2026-04-08 |
| 4. PWA Shell | 0/? | Not started | - |
| 5. Quick Wins | 0/? | Not started | - |
| 6. Content Expansion (v2) | 0/? | Not started | - |
| 7. Backend & Architecture (v2) | 0/? | Not started | - |
| 8. Diaries & Wellness (v2) | 0/? | Not started | - |
