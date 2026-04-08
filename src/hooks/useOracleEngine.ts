"use client";

import { useMemo } from "react";
import oracleCards from "@/data/oracle_seed.json";
import remedies from "@/data/remedies_seed.json";
import { selectOracle } from "@/services/oracleEngine";
import { getMoonPhase } from "@/services/moonPhase";
import { calculateMoodTrend } from "@/services/moodTrend";
import type { OracleCard, Remedy, OracleSelectionResult } from "@/types/oracle";
import type { MoodLog } from "@/types/mood";

interface UseOracleEngineProps {
  moodScore: number;
  recentLogs: Pick<MoodLog, "moodScore">[];
}

/**
 * React hook that wires the oracle selection engine to live app context.
 *
 * Responsibilities:
 *   - Loads oracle cards and remedies from static seed data
 *   - Computes today's moon phase via getMoonPhase(new Date())
 *   - Computes the mood trend from recent logs via calculateMoodTrend()
 *   - Calls selectOracle() with all inputs and memoises the result
 *
 * The result is re-computed only when moodScore or recentLogs changes.
 *
 * @param moodScore   Today's mood score (0–10)
 * @param recentLogs  Recent mood logs used to compute the trend
 * @returns OracleSelectionResult with the selected card and remedy
 */
export function useOracleEngine({
  moodScore,
  recentLogs,
}: UseOracleEngineProps): OracleSelectionResult {
  return useMemo(() => {
    const moonPhase = getMoonPhase(new Date());
    const trend = calculateMoodTrend(recentLogs, moodScore);
    return selectOracle(
      { moodScore, moonPhase, trend },
      oracleCards as OracleCard[],
      remedies as Remedy[]
    );
  }, [moodScore, recentLogs]);
}
