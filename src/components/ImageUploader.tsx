import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, ImagePlus, Sparkles } from "lucide-react";
import { ACCEPTED_EXT, ACCEPTED_TYPES } from "../lib/imageValidation";

interface Props {
  onFile: (file: File) => void;
}

export function ImageUploader({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <motion.div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      animate={{
        scale: dragOver ? 1.02 : 1,
        backgroundColor: dragOver ? "#F0E9FF" : "rgba(240, 233, 255, 0)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative flex min-h-[320px] sm:min-h-[420px] cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed p-6 sm:p-10 outline-none transition-colors ${
        dragOver ? "border-primary" : "border-foreground/30 hover:border-primary"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      {/* stacked image illustration */}
      <motion.div
        animate={dragOver ? { y: -6, rotate: -6 } : { y: [0, -6, 0] }}
        transition={
          dragOver
            ? { type: "spring", stiffness: 300 }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative mb-6"
      >
        <div className="absolute -left-4 top-2 h-24 w-24 rotate-[-10deg] rounded-xl border-2 border-foreground bg-secondary shadow-toy-sm" />
        <div className="absolute -right-4 top-2 h-24 w-24 rotate-[10deg] rounded-xl border-2 border-foreground bg-accent shadow-toy-sm" />
        <div className="relative grid h-28 w-28 place-items-center rounded-xl border-2 border-foreground bg-background shadow-toy">
          <ImagePlus className="h-10 w-10 text-primary" strokeWidth={2.5} />
        </div>
      </motion.div>

      <p className="font-display text-3xl font-bold uppercase tracking-tight">
        {dragOver ? "YES! DROP IT HERE!" : "Drop your image here"}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">or give this button a little click</p>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-toy-sm transition-shadow hover:shadow-toy"
      >
        <Upload className="h-4 w-4" />
        Choose an image
      </motion.button>

      <p className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        {ACCEPTED_EXT}
      </p>
    </motion.div>
  );
}
