import * as astronomia from "astronomia";

import type { MoonPhaseName } from "@/types/astrology";
import { MOON_PHASE_NAMES } from "@/types/astrology";

const { moonphase, julian } = astronomia;

/**
 * Phase boundaries in days from last new moon (0 to ~29.53).
 * Each entry: [minAge, phaseName]. Walk from 0 → highest matching boundary.
 */
const PHASE_BOUNDARIES: [number, MoonPhaseName][] = [
  [0, "New Moon"],
  [1.85, "Waxing Crescent"],
  [7.38, "First Quarter"],
  [9.22, "Waxing Gibbous"],
  [14.77, "Full Moon"],
  [16.61, "Waning Gibbous"],
  [22.15, "Last Quarter"],
  [24, "Waning Crescent"],
];

/**
 * Returns the current lunar phase name for the given date.
 * Uses astronomia to compute lunar age (days since last new moon) and maps
 * to one of the 8 standard phase names.
 *
 * Pure TypeScript — no React imports. Safe for React Native portability.
 */
export function getMoonPhase(date: Date): MoonPhaseName {
  const jde = julian.DateToJDE(date);

  // Decimal year: year + month fraction + day fraction
  const decimalYear =
    date.getFullYear() +
    date.getMonth() / 12 +
    date.getDate() / 365.25;

  // moonphase['new'](decimalYear) returns the JDE of the new moon nearest that year.
  // The function is named 'new' in the astronomia source (reserved word — use bracket notation).
  // If the returned new moon is in the future relative to our date, step back
  // one full lunar month to find the most recent new moon before the date.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newMoonFn = (moonphase as any)["new"] as (year: number) => number;
  let newMoonJDE = newMoonFn(decimalYear);
  if (newMoonJDE > jde) {
    newMoonJDE = newMoonFn(decimalYear - 29.53 / 365.25);
  }

  // Age in days within the current lunar cycle
  let age = jde - newMoonJDE;
  // Safety: ensure age is within [0, meanLunarMonth)
  if (age < 0) age += moonphase.meanLunarMonth;
  age = age % moonphase.meanLunarMonth;

  // Walk phase boundaries: keep assigning as long as age >= boundary
  let phase: MoonPhaseName = MOON_PHASE_NAMES[0]; // "New Moon" as default
  for (const [boundary, name] of PHASE_BOUNDARIES) {
    if (age >= boundary) {
      phase = name;
    }
  }

  return phase;
}
