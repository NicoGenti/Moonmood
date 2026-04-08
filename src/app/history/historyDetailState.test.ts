import { describe, expect, it } from "@jest/globals";

import { resolveHistoryDetailState } from "@/app/history/historyDetailState";
import type { MoodLog } from "@/types/mood";
import type { OracleCard, Remedy } from "@/types/oracle";

const fallbackMessage = "Alcuni dettagli oracolari non erano ancora disponibili in questa memoria.";

const cards: OracleCard[] = [
  {
    id: "card-010",
    name: "L'Equilibrio dei Venti",
    description: "desc",
    moodRange: [2, 8],
    moonPhases: ["Waxing Gibbous"],
    tags: ["equilibrio"],
  },
];

const remedies: Remedy[] = [
  {
    id: "remedy-010",
    text: "respira",
    linkedCardId: "card-010",
    category: "respiro",
  },
];

const moonPhaseLabels = {
  "New Moon": "Luna Nuova",
  "Waxing Crescent": "Luna Crescente",
  "First Quarter": "Primo Quarto",
  "Waxing Gibbous": "Luna Gibbosa Crescente",
  "Full Moon": "Luna Piena",
  "Waning Gibbous": "Luna Gibbosa Calante",
  "Last Quarter": "Ultimo Quarto",
  "Waning Crescent": "Luna Calante",
};

describe("resolveHistoryDetailState", () => {
  it("returns ready with note, card, remedy and moon phase mapping", () => {
    const log: MoodLog = {
      id: "id-1",
      date: "2026-04-08",
      createdAt: 1,
      moodScore: 7 as MoodLog["moodScore"],
      note: "giornata intensa",
      moonPhase: "Waxing Gibbous",
      oracleCardId: "card-010",
      oracleRemedyId: "remedy-010",
    };

    const result = resolveHistoryDetailState(log, cards, remedies, moonPhaseLabels);

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.note).toBe("giornata intensa");
      expect(result.card.id).toBe("card-010");
      expect(result.remedy.id).toBe("remedy-010");
      expect(result.moonPhaseIt).toBe("Luna Gibbosa Crescente");
    }
  });

  it("returns partial with exact Italian fallback message when oracle details are missing", () => {
    const log: MoodLog = {
      id: "id-2",
      date: "2026-04-07",
      createdAt: 2,
      moodScore: 6 as MoodLog["moodScore"],
      note: "solo nota",
      moonPhase: "New Moon",
    };

    const result = resolveHistoryDetailState(log, cards, remedies, moonPhaseLabels);

    expect(result.status).toBe("partial");
    if (result.status === "partial") {
      expect(result.fallbackMessageIt).toBe(fallbackMessage);
      expect(result.note).toBe("solo nota");
      expect(result.moonPhaseIt).toBe("Luna Nuova");
    }
  });

  it("returns not-found when log is null", () => {
    const result = resolveHistoryDetailState(null, cards, remedies, moonPhaseLabels);
    expect(result).toEqual({ status: "not-found" });
  });
});
