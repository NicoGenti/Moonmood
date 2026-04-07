"use client";

import { useEffect, useState } from "react";
import { getAllLogs } from "@/services/db";

export interface DayEntry {
  date: string;
  dayLabel: string;
  score: number | null;
}

const DAY_LABELS = ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"];

function formatDate(d: Date): string {
  return d.toLocaleDateString("sv-SE");
}

export interface UseMoodHistoryReturn {
  days: DayEntry[];
  streak: number;
  isLoading: boolean;
}

export function useMoodHistory(): UseMoodHistoryReturn {
  const [days, setDays] = useState<DayEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void getAllLogs().then((logs) => {
      const logMap = new Map<string, number>();
      for (const log of logs) {
        logMap.set(log.date, log.moodScore);
      }

      const result: DayEntry[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatDate(d);
        result.push({
          date: dateStr,
          dayLabel: DAY_LABELS[d.getDay()],
          score: logMap.has(dateStr) ? (logMap.get(dateStr) ?? null) : null,
        });
      }
      setDays(result);

      // Calcola streak: giorni consecutivi partendo da oggi verso il passato
      let consecutiveDays = 0;
      for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].score !== null) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      setStreak(consecutiveDays);
      setIsLoading(false);
    });
  }, []);

  return { days, streak, isLoading };
}
