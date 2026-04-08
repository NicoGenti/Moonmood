"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import oracleCardsRaw from "@/data/oracle_seed.json";
import remediesRaw from "@/data/remedies_seed.json";
import { getAllLogs } from "@/services/db";
import { MoodHistory } from "@/components/mood/MoodHistory";
import { HistoryDetailView } from "@/components/mood/HistoryDetailView";
import { resolveHistoryDetailState, type HistoryDetailResolvedState } from "@/app/history/historyDetailState";
import type { OracleCard, Remedy } from "@/types/oracle";
import type { MoonPhaseName } from "@/types/astrology";

const cards = oracleCardsRaw as OracleCard[];
const remedies = remediesRaw as Remedy[];

const MOON_PHASE_IT: Record<MoonPhaseName, string> = {
  "New Moon": "Luna Nuova",
  "Waxing Crescent": "Luna Crescente",
  "First Quarter": "Primo Quarto",
  "Waxing Gibbous": "Luna Gibbosa Crescente",
  "Full Moon": "Luna Piena",
  "Waning Gibbous": "Luna Gibbosa Calante",
  "Last Quarter": "Ultimo Quarto",
  "Waning Crescent": "Luna Calante",
};

export function HistoryPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = useMemo(() => searchParams.get("date") ?? "", [searchParams]);
  const [detailState, setDetailState] = useState<HistoryDetailResolvedState | null>(null);

  useEffect(() => {
    if (!dateParam) {
      setDetailState(null);
      return;
    }

    let active = true;

    void getAllLogs()
      .then((logs) => {
        if (!active) {
          return;
        }

        const selected = logs.find((log) => log.date === dateParam) ?? null;
        setDetailState(resolveHistoryDetailState(selected, cards, remedies, MOON_PHASE_IT));
      })
      .catch(() => {
        if (active) {
          setDetailState({ status: "not-found" });
        }
      });

    return () => {
      active = false;
    };
  }, [dateParam]);

  if (dateParam) {
    if (!detailState) {
      return null;
    }

    if (detailState.status === "not-found") {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-xl font-semibold text-white/85">Memoria non trovata</p>
          <p className="text-sm text-white/65">Questa data non è disponibile nello storico locale.</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/85 transition-colors hover:bg-white/20"
          >
            Torna indietro
          </button>
        </main>
      );
    }

    return <HistoryDetailView state={detailState} onBack={() => router.back()} />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-10 sm:px-6">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-xs uppercase tracking-wider text-white/45">Moonmood</p>
        <h1 className="font-display text-3xl font-bold text-white">Le tue memorie</h1>
        <p className="text-sm text-white/65">Rileggi il tuo cammino emotivo, una memoria alla volta.</p>
      </header>

      <MoodHistory />
    </main>
  );
}
