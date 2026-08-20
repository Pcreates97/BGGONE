import { useEffect, useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Download, GitCompare, RotateCcw } from "lucide-react";
import type { ProcessedResult, SelectedImage } from "../types/image";
import { downloadBlob, sanitizeFilename } from "../lib/imageUtils";
import { BeforeAfterComparison } from "./BeforeAfterComparison";

interface Props {
  image: SelectedImage;
  result: ProcessedResult;
  onReset: () => void;
}

export function ResultPreview({ image, result, onReset }: Props) {
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    // one-shot celebration
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#7C3AED", "#C6F24E", "#FF7A59", "#151515"],
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col items-center gap-6 p-6"
    >
      <div className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-toy-sm">
        Background = Gone ✨
      </div>

      {compare ? (
        <BeforeAfterComparison beforeUrl={image.url} afterUrl={result.url} />
      ) : (
        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-foreground bg-checker shadow-toy">
          <img
            src={result.url}
            alt="Background removed"
            className="mx-auto block max-h-[380px] w-full object-contain"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ y: 0 }}
          onClick={() =>
            downloadBlob(result.blob, `${sanitizeFilename(image.meta.name)}-background-removed.png`)
          }
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-7 py-4 font-display text-lg font-bold uppercase tracking-tight text-primary-foreground shadow-toy transition-shadow hover:shadow-toy-lg"
        >
          <Download className="h-5 w-5" />
          Download PNG
        </motion.button>

        <button
          onClick={() => setCompare((c) => !c)}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-4 py-2 text-sm font-semibold shadow-toy-sm hover:bg-muted"
        >
          <GitCompare className="h-4 w-4" />
          {compare ? "Hide compare" : "Compare"}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-4 py-2 text-sm font-semibold shadow-toy-sm hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Do another one
        </button>
      </div>
    </motion.div>
  );
}
