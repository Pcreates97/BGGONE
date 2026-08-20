import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import type { SelectedImage } from "../types/image";

const messages = [
  "Finding the subject...",
  "Convincing the background to leave...",
  "Cleaning up the edges...",
  "Almost there...",
];

interface Props {
  image: SelectedImage;
  progress?: number;
  progressMessage?: string;
}

export function ProcessingAnimation({ image, progress, progressMessage }: Props) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (progressMessage) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 1400);
    return () => clearInterval(t);
  }, [progressMessage]);

  const activeMessage = progressMessage || messages[idx];

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-foreground bg-checker shadow-toy">
        <img
          src={image.url}
          alt=""
          className="mx-auto block max-h-[380px] w-full object-contain opacity-90"
        />
        {/* scanning line */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_6px_rgba(124,58,237,0.6)]" />
        </div>
        {/* corner sparkles */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-3 top-3 h-2 w-2 rounded-full bg-secondary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-4 top-6 h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.7, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-4 left-8 h-2 w-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="min-h-[24px] font-display text-lg font-semibold text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {activeMessage}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* progress bar */}
      <div className="relative h-3 w-64 overflow-hidden rounded-full border-2 border-foreground bg-background">
        {progress && progress > 0 ? (
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary"
            style={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
        ) : (
          <motion.div
            className="absolute inset-y-0 w-1/3 rounded-full bg-primary"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}
