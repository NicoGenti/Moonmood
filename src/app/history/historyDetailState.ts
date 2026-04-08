import type { MoonPhaseName } from "@/types/astrology";
import type { MoodLog } from "@/types/mood";
import type { OracleCard, Remedy } from "@/types/oracle";

const PARTIAL_FALLBACK_MESSAGE = "Alcuni dettagli oracolari non erano ancora disponibili in questa memoria.";

export type HistoryDetailResolvedState =
  | { status: "not-found" }
  | {
      status: "partial";
      moodScore: MoodLog["moodScore"];
      date: string;
      note: string;
      moonPhaseIt: string;
      fallbackMessageIt: string;
      card: OracleCard | null;
      remedy: Remedy | null;
    }
  | {
      status: "ready";
      moodScore: MoodLog["moodScore"];
      date: string;
      note: string;
      moonPhaseIt: string;
      card: OracleCard;
      remedy: Remedy;
    };

export function resolveHistoryDetailState(
  log: MoodLog | null,
  cards: OracleCard[],
  remedies: Remedy[],
  moonPhaseLabels: Record<MoonPhaseName, string>
): HistoryDetailResolvedState {
  if (!log) {
    return { status: "not-found" };
  }

  const note = log.note ?? "";
  const moonPhaseIt = log.moonPhase
    ? (moonPhaseLabels[log.moonPhase as MoonPhaseName] ?? log.moonPhase)
    : "";

  const card = log.oracleCardId ? (cards.find((candidate) => candidate.id === log.oracleCardId) ?? null) : null;
  const remedy = log.oracleRemedyId ? (remedies.find((candidate) => candidate.id === log.oracleRemedyId) ?? null) : null;

  if (card && remedy) {
    return {
      status: "ready",
      moodScore: log.moodScore,
      date: log.date,
      note,
      moonPhaseIt,
      card,
      remedy,
    };
  }

  return {
    status: "partial",
    moodScore: log.moodScore,
    date: log.date,
    note,
    moonPhaseIt,
    fallbackMessageIt: PARTIAL_FALLBACK_MESSAGE,
    card,
    remedy,
  };
}
