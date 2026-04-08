import { getMoodLevel } from "@/lib/moodConfig";
import type { MoodLog } from "@/types/mood";
import type { OracleCard } from "@/types/oracle";
import type { HistoryListItem, HistoryMonthGroup, MoodHistoryPageResult } from "@/types/history";

const FALLBACK_ORACLE_CARD_NAME = "Oracolo non disponibile";

function getMonthKey(date: string): string {
  return date.slice(0, 7);
}

function getMonthLabelIt(date: string): string {
  const asDate = new Date(`${date}T00:00:00`);
  return asDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

function toHistoryListItem(log: MoodLog, cardsById: Record<string, OracleCard>): HistoryListItem {
  const moodLevel = getMoodLevel(log.moodScore);
  const oracleCardName = log.oracleCardId ? (cardsById[log.oracleCardId]?.name ?? FALLBACK_ORACLE_CARD_NAME) : FALLBACK_ORACLE_CARD_NAME;

  return {
    date: log.date,
    moodScore: log.moodScore,
    scoreEmoji: moodLevel.emoji,
    scoreColorToken: moodLevel.color,
    oracleCardName,
  };
}

export function buildMoodHistoryPage(
  logs: MoodLog[],
  visibleCount: number,
  cardsById: Record<string, OracleCard>
): MoodHistoryPageResult {
  const safeVisibleCount = Math.max(0, visibleCount);
  const totalCount = logs.length;
  const actualVisibleCount = Math.min(safeVisibleCount, totalCount);
  const visibleLogs = logs.slice(0, actualVisibleCount);
  const groupsMap = new Map<string, HistoryMonthGroup>();
  const orderedGroups: HistoryMonthGroup[] = [];

  for (const log of visibleLogs) {
    const monthKey = getMonthKey(log.date);
    const item = toHistoryListItem(log, cardsById);
    const existing = groupsMap.get(monthKey);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    const group: HistoryMonthGroup = {
      monthKey,
      monthLabelIt: getMonthLabelIt(log.date),
      items: [item],
    };

    groupsMap.set(monthKey, group);
    orderedGroups.push(group);
  }

  return {
    groups: orderedGroups,
    hasMore: actualVisibleCount < totalCount,
    visibleCount: actualVisibleCount,
    totalCount,
  };
}
