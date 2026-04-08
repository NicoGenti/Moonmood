import type { MoonPhaseName } from "@/types/astrology";
import type { MoodLog } from "@/types/mood";
import type { OracleCard, Remedy } from "@/types/oracle";

export type OraclePageResolvedState =
  | { status: "empty" }
  | { status: "ready"; card: OracleCard; remedy: Remedy; moonPhaseIt: string };

export function resolveOraclePageState(
  log: MoodLog | null,
  cards: OracleCard[],
  remedies: Remedy[],
  moonPhaseLabels: Record<MoonPhaseName, string>
): OraclePageResolvedState {
  if (!log || !log.oracleCardId || !log.oracleRemedyId) {
    return { status: "empty" };
  }

  const card = cards.find((candidate) => candidate.id === log.oracleCardId);
  const remedy = remedies.find((candidate) => candidate.id === log.oracleRemedyId);

  if (!card || !remedy) {
    return { status: "empty" };
  }

  const moonPhaseIt = log.moonPhase
    ? (moonPhaseLabels[log.moonPhase as MoonPhaseName] ?? log.moonPhase)
    : "";

  return {
    status: "ready",
    card,
    remedy,
    moonPhaseIt,
  };
}
