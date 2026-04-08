import { describe, expect, it } from "@jest/globals";

import { resolveOraclePageState } from "@/app/oracle/oraclePageState";
import type { MoonPhaseName } from "@/types/astrology";
import type { MoodLog } from "@/types/mood";
import type { OracleCard, Remedy } from "@/types/oracle";

const cards: OracleCard[] = [
  {
    id: "card-1",
    name: "Carta Uno",
    description: "Descrizione",
    moodRange: [0, 10],
    moonPhases: ["Full Moon"],
    tags: ["equilibrio"],
  },
];

const remedies: Remedy[] = [
  {
    id: "remedy-1",
    text: "Respira lentamente.",
    linkedCardId: "card-1",
    category: "respiro",
  },
];

const moonPhaseIt: Record<MoonPhaseName, string> = {
  "New Moon": "Luna Nuova",
  "Waxing Crescent": "Luna Crescente",
  "First Quarter": "Primo Quarto",
  "Waxing Gibbous": "Luna Gibbosa Crescente",
  "Full Moon": "Luna Piena",
  "Waning Gibbous": "Luna Gibbosa Calante",
  "Last Quarter": "Ultimo Quarto",
  "Waning Crescent": "Luna Calante",
};

describe("resolveOraclePageState", () => {
  it("returns empty when log is missing or ids are missing", () => {
    expect(resolveOraclePageState(null, cards, remedies, moonPhaseIt)).toEqual({ status: "empty" });

    const missingIds = {
      id: "1",
      date: "2026-04-08",
      moodScore: 5,
      createdAt: 1,
    } as MoodLog;

    expect(resolveOraclePageState(missingIds, cards, remedies, moonPhaseIt)).toEqual({ status: "empty" });
  });

  it("returns ready with localized moon phase fallback path available", () => {
    const log = {
      id: "1",
      date: "2026-04-08",
      moodScore: 5,
      createdAt: 1,
      moonPhase: "Full Moon",
      oracleCardId: "card-1",
      oracleRemedyId: "remedy-1",
    } as MoodLog;

    expect(resolveOraclePageState(log, cards, remedies, moonPhaseIt)).toEqual({
      status: "ready",
      card: cards[0],
      remedy: remedies[0],
      moonPhaseIt: "Luna Piena",
    });
  });

  it("falls back to original moon phase string when unknown", () => {
    const log = {
      id: "1",
      date: "2026-04-08",
      moodScore: 5,
      createdAt: 1,
      moonPhase: "Misteriosa" as MoonPhaseName,
      oracleCardId: "card-1",
      oracleRemedyId: "remedy-1",
    } as MoodLog;

    expect(resolveOraclePageState(log, cards, remedies, moonPhaseIt)).toEqual({
      status: "ready",
      card: cards[0],
      remedy: remedies[0],
      moonPhaseIt: "Misteriosa",
    });
  });
});
