import { useEffect, useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Download, GitCompare, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";
import type { ProcessedResult, SelectedImage } from "../types/image";
import { downloadBlob, formatBytes, sanitizeFilename } from "../lib/imageUtils";
import { BeforeAfterComparison } from "./BeforeAfterComparison";

interface Props {
  image: SelectedImage;
  result: ProcessedResult;
  onReset: () => void;
}

type BackdropType = "checker" | "white" | "dark" | "cream";

export function ResultPreview({ image, result, onReset }: Props) {
  const [compare, setCompare] = useState(false);
  const [backdrop, setBackdrop] = useState<BackdropType>("checker");

  useEffect(() => {
    // One-shot celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#7C3AED", "#C6F24E", "#FF7A59", "#151515"],
    });
  }, []);

  const getBackdropClass = () => {
    switch (backdrop) {
      case "white":
        return "bg-white";
      case "dark":
        return "bg-slate-950";
      case "cream":
        return "bg-amber-50";
      case "checker":
      default:
        return "bg-checker";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col items-center gap-5 p-4 sm:p-6"
    >
      {/* Status Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-secondary px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-toy-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Background Removed ✨
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-foreground/30 bg-background px-3 py-1 text-xs font-semibold text-foreground/80 shadow-toy-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Original Size: {image.meta.width} × {image.meta.height} px
        </div>
      </div>

      {/* Main Image Canvas Preview */}
      {compare ? (
        <BeforeAfterComparison beforeUrl={image.url} afterUrl={result.url} />
      ) : (
        <div
          className={`relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-foreground shadow-toy transition-colors duration-200 ${getBackdropClass()}`}
        >
          <img
            src={result.url}
            alt="Background removed"
            className="mx-auto block max-h-[400px] w-full object-contain"
          />

          {/* Backdrop Color Switcher (top right) */}
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-xl border border-foreground/30 bg-background/90 p-1 shadow-toy-sm backdrop-blur-sm">
            <button
              title="Transparent Grid"
              onClick={() => setBackdrop("checker")}
              className={`h-5 w-5 rounded-md border border-foreground/20 bg-checker transition-transform ${backdrop === "checker" ? "scale-110 ring-2 ring-foreground" : "opacity-60 hover:opacity-100"}`}
            />
            <button
              title="Studio White"
              onClick={() => setBackdrop("white")}
              className={`h-5 w-5 rounded-md border border-foreground/30 bg-white transition-transform ${backdrop === "white" ? "scale-110 ring-2 ring-foreground" : "opacity-60 hover:opacity-100"}`}
            />
            <button
              title="Dark Background"
              onClick={() => setBackdrop("dark")}
              className={`h-5 w-5 rounded-md border border-foreground/20 bg-slate-950 transition-transform ${backdrop === "dark" ? "scale-110 ring-2 ring-foreground" : "opacity-60 hover:opacity-100"}`}
            />
            <button
              title="Soft Cream"
              onClick={() => setBackdrop("cream")}
              className={`h-5 w-5 rounded-md border border-foreground/20 bg-amber-50 transition-transform ${backdrop === "cream" ? "scale-110 ring-2 ring-foreground" : "opacity-60 hover:opacity-100"}`}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ y: 0 }}
          onClick={() =>
            downloadBlob(result.blob, `${sanitizeFilename(image.meta.name)}-transparent.png`)
          }
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-7 py-4 font-display text-lg font-bold uppercase tracking-tight text-primary-foreground shadow-toy transition-shadow hover:shadow-toy-lg"
        >
          <Download className="h-5 w-5" />
          Download PNG ({formatBytes(result.blob.size)})
        </motion.button>

        <button
          onClick={() => setCompare((c) => !c)}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-4 py-3 text-sm font-semibold shadow-toy-sm hover:bg-muted"
        >
          <GitCompare className="h-4 w-4" />
          {compare ? "Hide comparison" : "Compare with original"}
        </button>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-4 py-3 text-sm font-semibold shadow-toy-sm hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Do another image
        </button>
      </div>
    </motion.div>
  );
}
