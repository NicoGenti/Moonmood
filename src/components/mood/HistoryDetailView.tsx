"use client";

import type { HistoryDetailResolvedState } from "@/app/history/historyDetailState";

interface HistoryDetailViewProps {
  state: Exclude<HistoryDetailResolvedState, { status: "not-found" }>;
  onBack: () => void;
}

export function HistoryDetailView({ state, onBack }: HistoryDetailViewProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-10 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/20"
      >
        ← Torna alla lista
      </button>

      <section className="space-y-2 rounded-2xl border border-surface-15 bg-surface-10 p-5">
        <p className="text-xs uppercase tracking-wider text-white/45">Memoria</p>
        <h1 className="font-display text-2xl font-bold text-white">{state.date}</h1>
        <p className="text-sm text-white/70">Umore: {state.moodScore}/10</p>
        {state.moonPhaseIt && <p className="text-sm text-white/65">Fase lunare: {state.moonPhaseIt}</p>}
      </section>

      {state.status === "partial" && (
        <section className="rounded-xl border border-white/15 bg-white/5 p-4">
          <p className="text-sm text-white/75">{state.fallbackMessageIt}</p>
        </section>
      )}

      <section className="space-y-2 rounded-2xl border border-surface-15 bg-surface-10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Nota</h2>
        <p className="text-sm leading-relaxed text-white/85">{state.note || "Nessuna nota salvata per questa memoria."}</p>
      </section>

      <section className="space-y-2 rounded-2xl border border-surface-15 bg-surface-10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Carta oracolo</h2>
        {state.card ? (
          <>
            <p className="text-base font-semibold text-white/90">{state.card.name}</p>
            <p className="text-sm leading-relaxed text-white/80">{state.card.description}</p>
          </>
        ) : (
          <p className="text-sm text-white/70">Dettaglio carta non disponibile.</p>
        )}
      </section>

      <section className="space-y-2 rounded-2xl border border-surface-15 bg-surface-10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Rimedio</h2>
        {state.remedy ? (
          <p className="text-sm leading-relaxed text-white/85">{state.remedy.text}</p>
        ) : (
          <p className="text-sm text-white/70">Dettaglio rimedio non disponibile.</p>
        )}
      </section>
    </main>
  );
}
