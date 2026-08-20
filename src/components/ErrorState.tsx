import { motion } from "motion/react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  message: string;
  onReset: () => void;
}

export function ErrorState({ message, onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 p-10 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-foreground bg-accent shadow-toy-sm">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl font-bold">Well, that didn't work.</h3>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-4 py-2 text-sm font-semibold shadow-toy-sm hover:bg-muted"
      >
        <RotateCcw className="h-4 w-4" />
        Start over
      </button>
    </motion.div>
  );
}
