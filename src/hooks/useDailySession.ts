"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useMoodScore, useSetMoodScore } from "@/hooks/useMoodStore";
import { getTodayLog, saveMoodLog, getAllLogs } from "@/services/db";
import { getMoonPhase } from "@/services/moonPhase";
import { calculateMoodTrend } from "@/services/moodTrend";
import { selectOracle } from "@/services/oracleEngine";
import oracleCardsRaw from "@/data/oracle_seed.json";
import remediesRaw from "@/data/remedies_seed.json";
import type { OracleCard, Remedy } from "@/types/oracle";
import type { MoodLog } from "@/types/mood";

const oracleCards = oracleCardsRaw as OracleCard[];
const remedies = remediesRaw as Remedy[];

export type DailySessionState =
  | { status: "loading" }
  | { status: "fresh" }
  | { status: "saved"; log: MoodLog }
  | { status: "editing"; log: MoodLog };

export interface UseDailySessionReturn {
  sessionState: DailySessionState;
  note: string;
  setNote: (note: string) => void;
  saveLog: () => Promise<void>;
  enterEditMode: () => void;
}

function getTodayDateString(): string {
  return new Date().toLocaleDateString("sv-SE");
}

export function useDailySession(): UseDailySessionReturn {
  const [sessionState, setSessionState] = useState<DailySessionState>({ status: "loading" });
  const [note, setNote] = useState("");

  const moodScore = useMoodScore();
  const setMoodScore = useSetMoodScore();
  const router = useRouter();

  useEffect(() => {
    void getTodayLog()
      .then((existingLog) => {
        if (existingLog) {
          setSessionState({ status: "saved", log: existingLog });
          setNote(existingLog.note ?? "");
          return;
        }

        setSessionState({ status: "fresh" });
      })
      .catch(() => {
        setSessionState({ status: "fresh" });
      });
  }, []);

  async function saveLog() {
    try {
      const today = getTodayDateString();

      // Step 1: Save the base mood log
      const savedLog = await saveMoodLog({
        date: today,
        moodScore,
        note: note.trim() || undefined,
      });

      setSessionState({ status: "saved", log: savedLog });
      setNote(savedLog.note ?? "");

      // Step 2: Run oracle engine and re-save with oracle data
      try {
        // Calculate moon phase for today
        const moonPhase = getMoonPhase(new Date());

        // Get all logs for trend calculation — filter out today to use only prior days
        const allLogs = await getAllLogs();
        const recentLogs = allLogs.filter((l) => l.date < today);

        // Calculate mood trend
        const trend = calculateMoodTrend(recentLogs, moodScore);

        // Select oracle card + remedy
        const result = selectOracle({ moodScore, moonPhase, trend }, oracleCards, remedies);

        // Re-save the log with oracle data attached
        await saveMoodLog({
          ...savedLog,
          moonPhase,
          oracleCardId: result.card.id,
          oracleRemedyId: result.remedy.id,
        });
      } catch (oracleError) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Errore durante la selezione dell'oracolo", oracleError);
        }
        // Non-fatal: navigate to oracle page anyway (it will show graceful fallback)
      }

      // Step 3: Navigate to oracle page
      router.push("/oracle");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Errore durante il salvataggio del mood log", error);
      }

      throw error;
    }
  }

  function enterEditMode() {
    if (sessionState.status !== "saved" && sessionState.status !== "editing") {
      return;
    }

    setMoodScore(sessionState.log.moodScore);
    setNote(sessionState.log.note ?? "");
    setSessionState({ status: "editing", log: sessionState.log });
  }

  return {
    sessionState,
    note,
    setNote,
    saveLog,
    enterEditMode,
  };
}
