"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getNotePlaceholder } from "@/lib/moodConfig";

export interface MoodNoteInputProps {
  value: string;
  onChange: (note: string) => void;
  className?: string;
}

const NOTE_MAX_LENGTH = 280;
const COUNTER_VISIBLE_THRESHOLD = 240;
const COUNTER_WARNING_THRESHOLD = 270;

export function MoodNoteInput({ value, onChange, className }: MoodNoteInputProps) {
  const [expanded, setExpanded] = useState(false);
  const placeholder = getNotePlaceholder();

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {!expanded && (
          <motion.button
            key="button"
            type="button"
            onClick={() => setExpanded(true)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="h-12 w-full rounded-full border border-surface-15 bg-surface-10 px-4 text-left text-sm text-white/60 transition hover:bg-surface-15 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Aggiungi un pensiero"
          >
            Aggiungi un pensiero...
          </motion.button>
        )}

        {expanded && (
          <motion.div
            key="textarea-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value.slice(0, NOTE_MAX_LENGTH))}
              onBlur={() => !value && setExpanded(false)}
              placeholder={placeholder}
              maxLength={NOTE_MAX_LENGTH}
              className="min-h-[120px] w-full resize-none rounded-2xl border border-surface-20 bg-surface-10 p-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/35"
              autoFocus
            />

            {value.length >= COUNTER_VISIBLE_THRESHOLD && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-1 pr-1 text-right text-xs ${
                  value.length >= COUNTER_WARNING_THRESHOLD ? "text-red-400" : "text-white/50"
                }`}
              >
                {value.length}/{NOTE_MAX_LENGTH}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
