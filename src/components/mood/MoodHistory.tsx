"use client";

import { motion } from "framer-motion";
import { getMoodLevel } from "@/lib/moodConfig";
import { useMoodHistory } from "@/hooks/useMoodHistory";

export function MoodHistory() {
  const { days, streak, isLoading } = useMoodHistory();

  if (isLoading) {
    return null;
  }

  const todayDate = new Date().toLocaleDateString("sv-SE");

  return (
    <div className="w-full rounded-2xl bg-surface-10 border border-surface-15 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Ultima settimana
        </span>
        {streak >= 2 && (
          <span className="text-xs text-white/70">
            🔥 {streak} giorni di fila!
          </span>
        )}
      </div>

      {/* Dots */}
      <div className="flex items-end justify-between gap-1">
        {days.map((day, index) => {
          const isToday = day.date === todayDate;
          const moodLevel = day.score !== null ? getMoodLevel(day.score) : null;

          return (
            <motion.div
              key={day.date}
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {/* Circle */}
              <div className="relative flex items-center justify-center">
                {isToday && day.score !== null && (
                  <motion.div
                    className="absolute h-5 w-5 rounded-full"
                    style={{ backgroundColor: moodLevel?.color ?? "#ffffff" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <div
                  className="h-4 w-4 rounded-full"
                  style={
                    moodLevel
                      ? { backgroundColor: moodLevel.color }
                      : {
                          backgroundColor: "transparent",
                          border: "1.5px dashed rgba(255,255,255,0.25)",
                        }
                  }
                  title={day.score !== null ? `${day.dayLabel}: ${day.score}/10` : `${day.dayLabel}: nessun log`}
                />
              </div>
              {/* Day label */}
              <span className="text-xs text-white/40">{day.dayLabel}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
