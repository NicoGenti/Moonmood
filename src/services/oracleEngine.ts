import type {
  OracleCard,
  Remedy,
  OracleSelectionInput,
  OracleSelectionResult,
  MoodTrend,
} from "@/types/oracle";

// ---------------------------------------------------------------------------
// Trend keyword map (D-12)
// ---------------------------------------------------------------------------

const TREND_TAGS: Record<MoodTrend, string[]> = {
  rising: ["rinascita", "luce", "coraggio", "gioia", "libertà", "forza"],
  falling: ["introspezione", "ombra", "silenzio", "vulnerabilità", "solitudine"],
  stable: ["equilibrio", "fluidità", "radici", "pace", "gratitudine"],
};

// ---------------------------------------------------------------------------
// scoreCard — pure scoring function (D-12)
// ---------------------------------------------------------------------------

/**
 * Scores a single OracleCard against the selection input.
 *
 * Scoring rules (D-12):
 *   +2  if current moon phase is in card.moonPhases
 *   +1  if any of the card's tags matches the trend keyword list
 *   +1  if moodScore is within ±1.5 of the card's range midpoint ("sweet spot")
 *
 * Pure TypeScript — no React imports. Safe for React Native portability.
 */
export function scoreCard(
  card: OracleCard,
  input: OracleSelectionInput
): number {
  let score = 0;

  // Lunar phase bonus (+2)
  if (card.moonPhases.includes(input.moonPhase)) score += 2;

  // Tag / trend relevance bonus (+1)
  const trendTags = TREND_TAGS[input.trend];
  if (card.tags.some((t) => trendTags.includes(t))) score += 1;

  // Mood score "sweet spot" bonus (+1) — mood is close to the center of the card's range
  const mid = (card.moodRange[0] + card.moodRange[1]) / 2;
  if (Math.abs(input.moodScore - mid) <= 1.5) score += 1;

  return score;
}

// ---------------------------------------------------------------------------
// selectOracle — main selection function (D-13, D-14)
// ---------------------------------------------------------------------------

/**
 * Selects an oracle card and remedy for the user's current emotional context.
 *
 * Algorithm (D-13):
 *   1. Hard filter: keep only cards where moodRange[0] <= moodScore <= moodRange[1]
 *   2. If no cards pass: fall back to the card with isDefault:true (D-14)
 *   3. Score each card in the pool using scoreCard()
 *   4. Sort by score descending, take top 5 (or fewer if pool is smaller)
 *   5. Pick one uniformly at random from the top-5 pool
 *   6. Find the remedy linked to the selected card
 *   7. Return { card, remedy }
 *
 * Pure TypeScript — no React imports. Safe for React Native portability.
 *
 * @param input  Today's mood score, moon phase, and trend
 * @param cards  Full array of OracleCard objects (loaded from seed data)
 * @param remedies  Full array of Remedy objects (loaded from seed data)
 * @throws Error if the selected card has no matching remedy (seed data integrity issue)
 */
export function selectOracle(
  input: OracleSelectionInput,
  cards: OracleCard[],
  remedies: Remedy[]
): OracleSelectionResult {
  // Step 1 — Hard filter (D-13)
  const eligible = cards.filter(
    (c) => input.moodScore >= c.moodRange[0] && input.moodScore <= c.moodRange[1]
  );

  // Step 2 — Fallback to default card (D-14)
  const pool = eligible.length > 0 ? eligible : cards.filter((c) => c.isDefault);

  // Step 3 — Score each card
  const scored = pool.map((c) => ({ card: c, score: scoreCard(c, input) }));

  // Step 4 — Sort descending, take top 5
  scored.sort((a, b) => b.score - a.score);
  const top5 = scored.slice(0, 5);

  // Step 5 — Uniform random pick from top-5
  const picked = top5[Math.floor(Math.random() * top5.length)].card;

  // Step 6 — Find linked remedy
  const remedy = remedies.find((r) => r.linkedCardId === picked.id);

  if (!remedy) {
    // Should never happen with correct seed data, but fail gracefully
    throw new Error(`No remedy found for card ${picked.id}`);
  }

  // Step 7 — Return result
  return { card: picked, remedy };
}
