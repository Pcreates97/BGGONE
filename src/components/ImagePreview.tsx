import { motion } from "motion/react";
import { Sparkles, RotateCcw } from "lucide-react";
import type { SelectedImage } from "../types/image";
import { formatBytes } from "../lib/imageUtils";

interface Props {
  image: SelectedImage;
  onProcess: () => void;
  onReset: () => void;
}

export function ImagePreview({ image, onProcess, onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 p-6"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-foreground bg-checker shadow-toy">
        <img
          src={image.url}
          alt={image.meta.name}
          className="mx-auto block max-h-[380px] w-full object-contain"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="rounded-full border border-foreground/20 bg-background px-3 py-1">
          {image.meta.name}
        </span>
        <span className="rounded-full border border-foreground/20 bg-background px-3 py-1">
          {image.meta.width} × {image.meta.height}
        </span>
        <span className="rounded-full border border-foreground/20 bg-background px-3 py-1">
          {formatBytes(image.meta.size)}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ y: 0 }}
          onClick={onProcess}
          className="group inline-flex items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-7 py-4 font-display text-lg font-bold uppercase tracking-tight text-primary-foreground shadow-toy transition-shadow hover:shadow-toy-lg"
        >
          Remove that background
          <motion.span
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.span>
        </motion.button>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-4 py-2 text-sm font-semibold shadow-toy-sm hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Choose another
        </button>
      </div>
    </motion.div>
  );
}
