"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import { getMoodLevel, getEncouragingMessage } from "@/lib/moodConfig";
import type { MoodLog } from "@/types/mood";
import { MoodHistory } from "@/components/mood/MoodHistory";
import { useGradientIntensity } from "@/context/GradientIntensityContext";

export interface ReadOnlyViewProps {
  log: MoodLog;
  onEdit: () => void;
}

const easeSmooth: [number, number, number, number] = [0.4, 0, 0.2, 1];

const itemTransition: Transition = {
  duration: 0.35,
  ease: easeSmooth,
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: itemTransition },
};

export function ReadOnlyView({ log, onEdit }: ReadOnlyViewProps) {
  const moodLevel = getMoodLevel(log.moodScore);
  const encouragingMessage = getEncouragingMessage();
  const { setIntensity } = useGradientIntensity();

  useEffect(() => {
    setIntensity(0.6);
    return () => setIntensity(1);
  }, [setIntensity]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-sm flex-col items-center gap-5"
      >
        {/* Emoji grande con breathing animation */}
        <motion.div variants={item} className="flex flex-col items-center gap-2">
          <motion.span
            className="text-7xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            {moodLevel.emoji}
          </motion.span>
          <span className="text-xl font-semibold text-white">{moodLevel.label}</span>
          <span className="text-sm text-white/50">{encouragingMessage}</span>
        </motion.div>

        {/* Glass card con glow colorato */}
        <motion.div
          variants={item}
          className="w-full space-y-3 rounded-2xl bg-surface-10 p-6 border"
          style={{
            boxShadow: `0 0 32px ${moodLevel.color}33`,
            borderColor: `${moodLevel.color}40`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Umore</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white">{moodLevel.emoji}</span>
              <span className="text-sm text-white/50">{log.moodScore}/10</span>
            </div>
          </div>

          {log.note && (
            <div>
              <span className="mb-1 block text-sm text-white/50">Nota</span>
              <p className="text-sm text-white/80">{log.note}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Salvato</span>
            <span className="text-sm text-white/60">
              {new Date(log.createdAt).toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </motion.div>

        {/* Bottone modifica */}
        <motion.button
          variants={item}
          type="button"
          onClick={onEdit}
          className="rounded-full bg-surface-10 px-6 py-3 text-sm text-white/70 transition-colors hover:bg-surface-20 hover:text-white border border-surface-15"
        >
          Modifica
        </motion.button>

        <motion.div variants={item}>
          <Link
            href="/history"
            className="inline-flex rounded-full border border-surface-20 bg-surface-10 px-5 py-2.5 text-sm text-white/75 transition-colors hover:bg-surface-20 hover:text-white"
          >
            Rivedi lo storico
          </Link>
        </motion.div>

        {/* Storia completa */}
        <motion.div variants={item} className="w-full">
          <MoodHistory />
        </motion.div>
      </motion.div>
    </main>
  );
}
