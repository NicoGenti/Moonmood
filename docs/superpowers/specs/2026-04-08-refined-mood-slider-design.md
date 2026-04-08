# Refined Mood Slider Design

## Problem

The current `LiquidSlider` uses a morphing SVG blob as the drag thumb. While visually novel, it has UX issues:

- **No visible score**: The emoji and score only appear in a floating label during drag, not at rest
- **Imprecise on mobile**: The organic blob shape makes it unclear exactly where the drag target is
- **No spatial orientation**: No tick marks or landmarks — users can't quickly gauge where they are on the 0-10 scale
- **No keyboard support**: Missing `onKeyDown` handler despite having ARIA slider role

## Solution

Replace the SVG blob thumb with a **glassmorphic pill capsule** that always shows the current emoji + score. Add tick marks for orientation and a mood label below. Keep all existing drag mechanics, haptic feedback, and ARIA attributes.

## Visual Spec

### Layout (top to bottom within the component)

1. **Endpoint emojis**: Left-aligned `text-white/40 text-sm`, right-aligned `text-white/40 text-sm`
2. **Track + Pill thumb**: Horizontally centered between the endpoint emojis
3. **Tick marks**: 11 vertical lines below the track
4. **Mood label**: Centered text below ticks

Container height: `h-28` (~112px), up from current `h-20`.

### Track

- Base: 6px tall, `rounded-full`, `bg-white/10`
- Filled portion: left edge to thumb center, `linear-gradient(to right, #4682b4, <blobColor>)`, 75% opacity
- Reuses existing `blendHex()` for color interpolation

### Pill Thumb

- **Size**: 52x32px visible capsule
- **Touch target**: 44x44px invisible hit area (outer padding div)
- **Background**: `rgba(255,255,255,0.12)`, `backdrop-blur-md`, `border border-white/20`, `rounded-full`
- **Content**: `{emoji} {score}` — emoji at `text-sm`, score at `text-xs font-semibold`, white text
- **Glow**: `box-shadow: 0 0 12px <blobColor>` at 40% opacity
- **Idle animation**: Glow opacity pulses 0.3 -> 0.5 -> 0.3 over 2.5s (replaces blob scale breathing)
- **Drag state**: Scale 1.08 (spring), glow opacity increases to 50%
- **Cursor**: `cursor-grab`, `active:cursor-grabbing`

### Tick Marks

- 11 marks at positions 0-10, evenly distributed across track width
- Regular ticks: 1px wide x 6px tall, `bg-white/15`
- Landmark ticks (0, 5, 10): 1px wide x 10px tall, `bg-white/25`
- 4px gap below the track

### Endpoint Emojis

- Left: hardcoded content (lowest mood emoji from moodConfig), Right: hardcoded content (highest mood emoji from moodConfig)
- Vertically centered with the track
- `text-white/40 text-sm`

### Mood Label

- Shows `moodLevel.label` (e.g. "Abbastanza bene")
- `text-sm text-white/60 font-medium`
- Centered below tick marks
- `AnimatePresence` fade transition on label change (duration 0.2s)

### First-Visit Hint

- Unchanged: "scorri" text with fade in/out, localStorage persistence

## Keyboard Accessibility

Add `tabIndex={0}` and `onKeyDown` to the pill thumb:

| Key | Action |
|-----|--------|
| ArrowRight / ArrowUp | +1 score |
| ArrowLeft / ArrowDown | -1 score |
| Home | Set to 0 |
| End | Set to 10 |

Each key press triggers haptic feedback via `navigator.vibrate?.(8)`.

## page.tsx Changes

Remove the standalone emoji display block (current lines 70-82):
- The 7xl emoji with spring animation
- The mood label text
- The score text (e.g. "5/10")

These are now redundant — the slider pill shows the emoji+score, and the mood label sits below the slider.

Keep: greeting header, mood question, and all components below the slider (note input, save button, history).

## Files Modified

| File | Change |
|------|--------|
| `src/components/mood/LiquidSlider.tsx` | Full internal rewrite — remove SVG blob, add pill thumb + ticks + mood label + keyboard |
| `src/app/page.tsx` | Remove emoji display block (lines 70-82) |

## Unchanged

- `src/lib/moodConfig.ts` — mood levels, colors, labels
- `src/hooks/useMoodStore.ts` — state management
- `LiquidSliderProps` interface — same `{ value, onValueChange, className }` API
- Other mood components (SaveMoodButton, MoodNoteInput, MoodHistory, ReadOnlyView)

## Preserved Internals

These existing mechanisms carry over unchanged:

- `ResizeObserver` for dynamic `maxDragX` computation
- `useMotionValue(x)` + `useMotionValueEvent` for drag tracking
- `blendHex()` color interpolation
- `clampScore()` utility
- Haptic vibration on score changes
- `dragElastic={0}`, `dragMomentum={false}`
- ARIA: `role="slider"`, `aria-valuemin=0`, `aria-valuemax=10`, `aria-valuenow`
- localStorage hint persistence

## Verification

1. `npm run build` — no type errors
2. `npm run dev` — visual check at localhost
3. Drag slider end-to-end: pill shows correct emoji + score at each of the 11 positions
4. Resize browser: slider and ticks adapt
5. Mobile viewport (375px): pill thumb comfortably tappable, ticks readable
6. Keyboard: Tab to slider, use arrow keys to change score
7. `npm test` — existing tests pass
