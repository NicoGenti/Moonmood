"use client";

import { useEffect, useState, useCallback } from "react";
import { getLogsPage, getLogsCount } from "@/services/db";
import oracleCards from "@/data/oracle_seed.json";
import { buildMoodHistoryPage } from "@/hooks/moodHistoryViewModel";
import type { HistoryMonthGroup } from "@/types/history";
import type { MoodLog } from "@/types/mood";
import type { OracleCard } from "@/types/oracle";

const PAGE_SIZE = 12;
const oracleCardsById: Record<string, OracleCard> = (oracleCards as OracleCard[]).reduce<Record<string, OracleCard>>(
  (acc, card) => {
    acc[card.id] = card;
    return acc;
  },
  {}
);

export interface UseMoodHistoryReturn {
  groups: HistoryMonthGroup[];
  hasMore: boolean;
  totalCount: number;
  isLoading: boolean;
  loadMore: () => void;
}

export function useMoodHistory(limit?: number): UseMoodHistoryReturn {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = limit ?? PAGE_SIZE;

  // Load total count once on mount
  useEffect(() => {
    void getLogsCount().then(setTotalCount);
  }, []);

  // Load a page of logs whenever offset changes
  const loadPage = useCallback(
    async (currentOffset: number) => {
      setIsLoading(true);
      try {
        const page = await getLogsPage(currentOffset, pageSize);
        setLogs((prev) => (currentOffset === 0 ? page : [...prev, ...page]));
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    void loadPage(offset);
  }, [offset, loadPage]);

  const page = buildMoodHistoryPage(logs, logs.length, oracleCardsById);

  function loadMore() {
    setOffset((prev) => prev + pageSize);
  }

  const hasMore = logs.length < totalCount;

  return {
    groups: page.groups,
    hasMore,
    totalCount,
    isLoading,
    loadMore,
  };
}
