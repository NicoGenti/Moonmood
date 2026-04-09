# Requirements

This file defines all requirement IDs referenced in phase plans and the ROADMAP.
Each entry provides an authoritative requirement statement and acceptance criteria.

---

## Phase 1: Mood Input

### MOOD-01 — Liquid Slider (0–10 drag-only input)

**Statement:** The user shall be able to set their mood score via a drag-only liquid-animated blob slider that maps the drag position to an integer value from 0 to 10 inclusive.

**Acceptance criteria:**
- The slider blob is draggable horizontally and maps position to a value in [0, 10]
- No tap-to-set, no numeric labels, no tick marks — drag is the only interaction
- The slider defaults to 5 (center) on a fresh daily log
- The blob morphs and animates reactively as the user drags

---

### MOOD-02 — Optional Text Note (up to 280 characters)

**Statement:** The user shall be able to optionally attach a text note to their mood log entry, up to 280 characters, before saving.

**Acceptance criteria:**
- The note field is presented collapsed (pill/button); tapping expands it into a textarea
- A character counter is visible when approaching the limit (≥ 240 characters)
- Saving with an empty note omits the note field from the persisted log
- Placeholder and labels are in Italian (e.g., "Come ti senti adesso?")

---

### MOOD-03 — Same-Day Read-Only Behavior

**Statement:** When the user reopens the app on a day that already has a saved mood log, the app shall display a read-only summary of that log instead of a blank input form.

**Acceptance criteria:**
- On mount, the app queries IndexedDB for today's log (local device timezone)
- If a log exists, the UI renders a read-only view with the saved score and note
- An explicit "Edit" (or equivalent Italian) button allows re-entering editing mode to overwrite
- A warm Italian message is shown alongside the saved data (e.g., "Hai già registrato il tuo umore oggi.")

---

### MOOD-04 — Persistence Across Refresh (IndexedDB with localStorage fallback)

**Statement:** All saved mood logs shall survive a full browser page reload, persisted to IndexedDB via Dexie.js with a localStorage fallback if IndexedDB is unavailable.

**Acceptance criteria:**
- `saveMoodLog()` writes the log to the Dexie `dailyLogs` table
- `getTodayLog()` reads and returns today's log from IndexedDB on subsequent loads
- If IndexedDB is unavailable, the service falls back to localStorage transparently
- A hard browser refresh restores the saved state without data loss

---

## Phase 1: UI

### UI-01 — Aurora Boreale Animated Gradient Theme

**Statement:** The app shall display a live-reactive Aurora Boreale animated gradient background that shifts its color palette in real time based on the current mood score.

**Acceptance criteria:**
- The background gradient is always animating (ambient motion at rest, reactive on drag)
- Low mood (0–3): misty grey-blue / cool desaturated palette
- Mid mood (4–7): smooth interpolation across the Aurora palette
- High mood (8–10): full vivid Aurora Boreale colors (green, violet, blue, pink)
- The overlay renders full-viewport and is wired to the global mood score Zustand store

---

### UI-02 — Mobile-First Responsive Layout with Accessible Touch Targets

**Statement:** The app layout shall be usable on mobile screen widths from 320px and all interactive controls shall meet minimum touch target size requirements.

**Acceptance criteria:**
- Layout uses single-column mobile-first structure with no horizontal overflow at ≥ 320px width
- All interactive touch targets (slider, note pill, save button) are ≥ 44px in height or diameter
- The app is visually functional and usable on a 320×568 viewport (iPhone SE 1st gen minimum)
- No fixed-width elements that overflow on small screens

---

## Phase 2: Oracle Response

### ORCL-01 — Save-to-Oracle Reveal Flow

**Statement:** After the user saves a daily mood log, the app shall navigate to `/oracle` and reveal the selected oracle card with a 3D flip animation, then reveal the remedy with a delayed fade-in.

**Acceptance criteria:**
- A successful save in the daily session flow triggers navigation to `/oracle` via App Router.
- The oracle card is initially face-down and transitions to face-up through a Y-axis 3D flip animation.
- The remedy UI remains hidden until the card flip completion callback fires.
- After the flip completion event, the remedy fades in below the card during the same oracle session.

---

### ORCL-02 — Stateless Oracle Route with Empty State CTA

**Statement:** The `/oracle` route shall be stateless and reconstruct its view from persisted local data on mount, with an explicit empty-state CTA when no mood log exists for today.

**Acceptance criteria:**
- On mount, `/oracle` reads today’s log from IndexedDB (with existing persistence fallback behavior) and does not rely on router payload/state.
- Direct navigation to `/oracle` and browser refresh both produce the same resolved state from storage.
- If no today log is found, the page shows an Italian empty-state message and a CTA that navigates back to `/`.
- The empty state does not auto-redirect; user intent is required to leave `/oracle`.

---

### ORCL-03 — Weighted Oracle Selection Rules

**Statement:** Oracle selection shall apply deterministic weighted rules over eligible cards, then introduce bounded randomness by choosing uniformly from the top-scored candidates.

**Acceptance criteria:**
- A hard filter runs first: only cards whose `moodRange` includes today’s mood score are eligible.
- For each eligible card, scoring applies +2 for moon phase match, +1 for tag relevance, and +1 for trend match.
- Eligible cards are sorted by score, top 5 are selected as the candidate pool, and one card is chosen uniformly at random from that pool.
- If no cards pass the hard filter, the engine returns the designated default card.

---

### ORCL-04 — Persist Oracle Selection in MoodLog

**Statement:** The oracle outcome used for display shall be persisted into the same daily MoodLog record as lightweight identifiers, enabling later retrieval without duplicating full card content.

**Acceptance criteria:**
- The MoodLog schema includes optional fields `oracleCardId` and `oracleRemedyId`.
- After selection, the save flow writes `oracleCardId` and `oracleRemedyId` into the persisted daily log.
- Persisted IDs correspond to valid entries in bundled oracle and remedy seed datasets.
- The `/oracle` page resolves card and remedy content by IDs from the persisted MoodLog.

---

### ORCL-05 — Bundled Static Oracle Content Integrity

**Statement:** Oracle domain content shall be bundled as static local JSON datasets (cards, remedies, aphorisms) with Italian copy and schema constraints compatible with client-only execution.

**Acceptance criteria:**
- Oracle card, remedy, and aphorism content are stored in local bundled JSON files under `src/data/`.
- Card records include: `id`, Italian `name`, Italian `description`, `moodRange`, `moonPhases`, and `tags`.
- Remedy records include: `id`, Italian `text`, `linkedCardId`, and `category`, with one remedy per card.
- The oracle path reads these datasets via static imports with no network dependency for content retrieval.

---

### ASTR-01 — Client-Side Lunar Phase Computation (8 Phases)

**Statement:** The app shall compute lunar phase client-side using `astronomia` and normalize output to exactly 8 named moon phases for oracle logic and display.

**Acceptance criteria:**
- Lunar phase computation for oracle flow is executed locally in app code using `astronomia`.
- The resulting phase value is one of exactly these 8 names: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent.
- No additional lunar metrics (illumination percentage, lunar age, zodiac position) are required to satisfy this requirement.
- Oracle selection consumes the normalized phase name in its scoring path.

---

### ASTR-02 — Save-Time Moon Phase Snapshot Persistence

**Statement:** The lunar phase used for an oracle result shall be captured at mood save time and persisted in the associated MoodLog record for deterministic replay on `/oracle`.

**Acceptance criteria:**
- When the user saves the daily mood log, moon phase is computed during the save flow (not lazily only at render).
- The MoodLog schema includes optional `moonPhase` and persists it for the saved entry.
- The `/oracle` route reads persisted `moonPhase` from today’s log to render/log the saved result context.
- Existing older logs without `moonPhase` remain valid due to optional schema fields.

---

### ASTR-03 — No External Astrology API Dependency

**Statement:** The astrology path used by oracle selection shall remain fully local and must not depend on external HTTP APIs for lunar phase data.

**Acceptance criteria:**
- No network request is required to calculate moon phase during save or oracle selection flows.
- Disabling network access does not prevent lunar phase calculation for oracle selection.
- Oracle selection and `/oracle` rendering continue to function with bundled data and local persistence only.
- Any astrology dependency used in this path is a local library/package, not a remote service contract.

---

## Phase 3: Mood History

### HIST-01 — Browse Full Mood History with Grouped Reflective List

**Statement:** The user shall be able to navigate to a dedicated history view that lists persisted mood logs in newest-first order with emotionally readable cues and explicit progressive loading.

**Acceptance criteria:**
- A dedicated `/history` view is reachable from both the editable home flow and saved read-only flow.
- History entries are shown as card rows (not table/timeline), grouped by Italian month headers.
- Each row includes date, mood score with emoji/color cue, and oracle card preview text.
- Initial render shows a recent chunk and exposes explicit `Carica altre memorie` to load older records.
- Empty history state shows warm Italian copy, a one-line reflection benefit, and CTA back to `/`.

---

### HIST-02 — Reflect on Historical Entry Detail with Graceful Fallbacks

**Statement:** Selecting a history entry shall open a dedicated detail experience showing the saved note, oracle card, remedy, and lunar phase when available, while older/incomplete records remain readable through graceful fallback messaging.

**Acceptance criteria:**
- Selecting a row opens a dedicated detail experience for the requested historical date.
- Ready entries render note, oracle card name/description, remedy text, and moon phase label.
- Incomplete entries render available fields plus the Italian fallback message: `Alcuni dettagli oracolari non erano ancora disponibili in questa memoria.`
- Detail view back action returns to the list using browser-history behavior to preserve return context (including scroll state where supported).
- Detail rendering never crashes when optional historical oracle fields are missing.

---

## Phase 4: PWA Shell

### UI-03 — PWA Installability (Web App Manifest + Install Prompt)

**Statement:** The app shall be installable on desktop and mobile devices via a standards-compliant Web App Manifest and shall surface a browser install prompt or custom install button.

**Acceptance criteria:**
- A valid `manifest.json` (or `manifest.webmanifest`) is served with `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color`, and at least 192px and 512px icons
- The app triggers the browser's `beforeinstallprompt` event on supporting browsers (Chromium-based)
- A custom install button or banner is shown when the install prompt is available, with Italian copy (e.g., "Installa Moonmood")
- After installation, the app opens in standalone mode (no browser chrome) on both desktop and mobile

---

### UI-04 — Offline-First Functionality (Service Worker Caching)

**Statement:** A service worker shall cache the application shell and all critical assets so that every feature works without network access after the first load.

**Acceptance criteria:**
- A service worker is registered on first visit and caches the app shell (HTML, CSS, JS bundles, static JSON data files)
- After caching completes, toggling the device to airplane mode and reloading the app produces a fully functional experience
- All features (mood logging, oracle reveal, history browsing, report viewing) work offline with no degradation
- The service worker implements a cache-first strategy for static assets and a network-first strategy for any future API calls
- Cache versioning ensures updated assets are fetched on subsequent visits when online

## Phase 5: Quick Wins

### ECO-01 — Eco del Giorno (Daily Aphorism in Home)

**Statement:** The home page shall display a daily aphorism ("Eco del Giorno") selected from the existing bundled `aphorisms_seed.json`, rotating deterministically based on the current date.

**Acceptance criteria:**
- A dedicated "Eco del Giorno" card/section is visible on the home page below the mood input area
- The aphorism is selected deterministically from `aphorisms_seed.json` using the current date as seed (same date = same aphorism)
- The aphorism displays the Italian text and an optional attribution/source
- The card is styled consistently with the existing glassmorphism design language
- Tapping the aphorism card allows the user to mark it as a favorite (see FAV-01)

---

### STCZ-01 — Sticazzi (Daily Ironic Phrase)

**Statement:** The home page shall display a daily ironic/humorous phrase ("Sticazzi") sourced from a new bundled seed dataset, providing lighthearted emotional relief.

**Acceptance criteria:**
- A new `sticazzi_seed.json` file is created under `src/data/` containing at least 30 Italian ironic/humorous phrases with unique IDs
- A "Sticazzi" card/section appears on the home page, visually distinct from the Eco del Giorno
- The phrase rotates daily using a deterministic date-based selection (same date = same phrase)
- The card style matches the app's visual language but with a playful/ironic tone (e.g., different accent color)
- Tapping the card allows the user to mark it as a favorite (see FAV-01)

---

### RPT-01 — Enhanced Report with Temporal Filters

**Statement:** The report page shall support temporal range filters (7 days, 30 days, 90 days, all time) and display richer statistics including averages, streaks, trends, and distribution for the selected range.

**Acceptance criteria:**
- A filter bar at the top of the report page offers 4 temporal options: 7 giorni, 30 giorni, 90 giorni, Tutto
- Changing the filter re-renders all statistics and charts for the selected range
- Statistics include: average mood, longest positive streak (score >= 7), longest negative streak (score <= 3), overall trend direction
- A bar or line chart visualizes mood scores over the selected period
- The default selection is 7 giorni (matching current behavior) so existing experience is preserved
- All data is sourced from local IndexedDB with no network dependency

---

### SET-01 — Settings Page

**Statement:** A settings page shall be accessible from the app navigation, providing controls for language preference, notification toggles, and feature visibility flags.

**Acceptance criteria:**
- A "Impostazioni" page is reachable from the bottom navigation or a settings icon
- Language setting shows "Italiano" as default (additional languages deferred to v2)
- A notification toggle is present with Italian label; actual push notification implementation deferred to Phase 7 (toggle persisted locally as preference)
- Feature flag toggles allow showing/hiding optional sections (e.g., Sticazzi ON/OFF, Eco del Giorno ON/OFF)
- All settings are persisted in IndexedDB (or localStorage) and survive app restart
- Settings page follows the existing glassmorphism card design pattern

---

### FAV-01 — Favorites System (Hearts on Oracle Cards and Aphorisms)

**Statement:** Users shall be able to mark oracle cards, aphorisms, and sticazzi phrases as favorites via a heart icon, with favorites persisted locally and browsable in a dedicated list.

**Acceptance criteria:**
- A heart icon is displayed on oracle card views, Eco del Giorno, and Sticazzi cards
- Tapping the heart toggles the favorite state with a brief animation feedback
- Favorites are stored in a new Dexie table (`favorites`) with fields: `id`, `type` (oracle|aphorism|sticazzi), `contentId`, `savedAt`
- A "Preferiti" view lists all favorited items grouped by type, sorted by most recently saved
- Removing a favorite (un-heart) deletes the record from the table
- The favorites view is accessible from the settings page or a dedicated navigation entry

---

## Phase 6: Content Expansion (v2)

### ANGEL-01 — Daily Angel Card with Image

**Statement:** The app shall present a daily Angel card with an angel name, Italian description, and associated image, selected from a bundled seed dataset using mood and lunar phase context.

**Acceptance criteria:**
- A bundled `angel_cards_seed.json` contains at least 20 angel cards with `id`, Italian `name`, Italian `description`, `moodRange`, `moonPhases`, and `imagePath`
- Angel card images are bundled as static assets under `public/images/angels/`
- Selection uses a weighted engine similar to oracle cards (mood range filter, moon phase bonus, randomness from top candidates)
- The Angel card is displayed in a dedicated section or card on the daily experience, with image, name, and description
- The angel card result is persisted in the daily MoodLog for deterministic replay

---

### TOTEM-01 — Daily Animal Totem with Image

**Statement:** The app shall present a daily Animal Totem with an animal name, Italian symbolic meaning, and associated image, selected from a bundled seed dataset with mood-aware logic.

**Acceptance criteria:**
- A bundled `animal_totem_seed.json` contains at least 20 animal totems with `id`, Italian `name`, Italian `meaning`, `moodRange`, and `imagePath`
- Totem images are bundled as static assets under `public/images/totems/`
- Selection uses mood range filtering with date-seeded randomness to ensure daily consistency
- The Animal Totem is displayed with image, name, and meaning in a dedicated section
- The totem result is persisted in the daily MoodLog for deterministic replay

---

### DREAM-01 — Dream Diary (Text)

**Statement:** Users shall be able to write daily dream diary entries as free text, stored in IndexedDB, with a dedicated browsable dream log view.

**Acceptance criteria:**
- A "Diario Sogni" entry point is accessible from the navigation or home page
- The dream entry form accepts free-text Italian input with no character limit (but UI shows a reasonable max of 2000 chars)
- Each dream entry is stored in a new Dexie table (`dreams`) with `id`, `date`, `text`, `createdAt`
- A dream log view lists past entries sorted newest-first with date headers
- Selecting a past dream entry opens a read-only detail view
- Empty state shows an Italian message encouraging dream journaling

---

### LUNA-01 — Visual Lunar Cycle Strip with Photos

**Statement:** The app shall display a visual strip showing the current month's moon phases with representative photos for each phase, highlighting today's phase.

**Acceptance criteria:**
- A horizontal scrollable strip displays all days of the current month with a small moon phase photo for each day
- Today's phase is highlighted visually (border, glow, or enlarged)
- Moon phase photos are bundled as static assets (8 photos, one per named phase)
- Phase computation reuses the existing `astronomia`-based lunar service
- The strip is accessible from the home page or a dedicated "Luna" section
- Tapping a day in the strip shows a tooltip or detail with the phase name in Italian

---

### SHARE-01 — Social Sharing via Canvas-Generated Image

**Statement:** Users shall be able to generate a shareable mood summary image (1:1 or 9:16 format) and share it via the Web Share API or download it.

**Acceptance criteria:**
- A "Condividi" button is available on the daily summary / oracle result view
- Tapping the button generates a canvas-rendered image containing: mood score, emoji, oracle card name, date, and Moonmood branding
- The user can choose between 1:1 (square, Instagram) and 9:16 (story) aspect ratios
- On devices supporting the Web Share API, the native share sheet opens with the generated image
- On unsupported devices, the image is downloaded as a PNG file
- The generated image follows the app's aurora gradient visual style

---

## Phase 7: Backend & Architecture (v2)

### AUTH-01 — User Authentication (Google/Apple OAuth + Guest)

**Statement:** Users shall be able to sign in via Google or Apple OAuth, or continue as guest, with authenticated sessions enabling cloud features.

**Acceptance criteria:**
- Sign-in options for Google OAuth and Apple Sign-In are presented on a login/welcome screen
- A "Continua come ospite" option allows using the app without authentication (local-only mode)
- Authenticated sessions persist across app restarts using secure token storage
- User profile information (name, email, avatar) is stored server-side in MongoDB
- The backend is built on .NET 8 with RESTful API endpoints for auth flows
- GDPR-compliant privacy policy is displayed and requires acceptance before first sign-in

---

### SYNC-01 — Cloud Backup and Sync

**Statement:** Authenticated users' mood logs, favorites, dreams, and settings shall sync to cloud storage (MongoDB) with automatic backup and multi-device consistency.

**Acceptance criteria:**
- All local Dexie data (dailyLogs, favorites, dreams, settings) syncs to the user's MongoDB collection on save
- Sync is bidirectional: changes on one device propagate to others on next app open
- Conflict resolution uses last-write-wins with timestamp comparison
- A "Backup" indicator in Settings shows the last successful sync time
- Guest users see a prompt to sign in to enable backup, but can continue without it
- Initial sign-in triggers a full upload of existing local data to cloud

---

### PUSH-01 — Push Notifications (Service Worker)

**Statement:** The app shall send push notifications to remind users to log their mood, with configurable schedule and content.

**Acceptance criteria:**
- Push notification permission is requested after first mood save (not on app open) with Italian copy explaining the value
- Default notification schedule: daily at 20:00 local time with the message "Come ti senti stasera?"
- Users can change notification time and disable notifications entirely in Settings
- Notifications are delivered via Service Worker push events, functional even when the app is closed
- Tapping a notification opens the app to the mood input page
- Backend sends push events via Web Push protocol to registered service workers

---

### AI-01 — AI-Powered Dream Interpretation and Insights

**Statement:** The app shall use AI to interpret dream diary entries and generate personalized emotional insights based on mood history patterns.

**Acceptance criteria:**
- After saving a dream diary entry, an AI interpretation is generated and displayed below the dream text
- Interpretations are in Italian, empathetic in tone, and reference symbols/themes from the dream text
- A weekly AI insight summary analyzes mood patterns, dream themes, and lunar correlations
- AI calls are made to a backend endpoint that proxies to an LLM service (e.g., OpenAI, Claude)
- AI features degrade gracefully for guest/offline users: a message explains that AI requires sign-in and connectivity
- AI-generated content is clearly labeled as AI-generated

---

### MULTI-01 — Multiple Mood Logs Per Day

**Statement:** Users shall be able to log mood multiple times per day, with all entries visible on an interactive sinusoidal chart showing intra-day emotional variation.

**Acceptance criteria:**
- The daily log schema is refactored: `date` is no longer a unique key; each log has a unique `id` + `datetime` timestamp
- The mood input page allows creating a new log even if one already exists for today
- All daily logs are listed chronologically on the home page's daily view
- An interactive sinusoidal chart (SVG or canvas) plots all mood scores for the selected day/period as a smooth curve
- Tapping a point on the sinusoidal chart opens the detail for that specific log entry
- Existing single-log data migrates cleanly: old entries get a `datetime` equal to `date + T12:00:00`

---

### MUSIC-01 — Adaptive Background Music

**Statement:** The app shall play ambient background music that dynamically adapts its mood/intensity based on the current mood score, toggleable in Settings.

**Acceptance criteria:**
- Background music begins playing (if enabled) when the user enters the mood input flow
- Music mood transitions smoothly as the mood slider value changes (low mood = calm/melancholic, high mood = uplifting/ethereal)
- Music is implemented via Web Audio API with crossfading between mood-mapped audio layers
- A music ON/OFF toggle is available in Settings (default: OFF)
- Audio assets are bundled locally (no streaming dependency) with at least 3 mood-mapped audio loops
- Music respects device silent/vibrate mode and pauses when the app goes to background
