import { AnimatePresence, motion } from "motion/react";
import { useBackgroundRemoval } from "../hooks/useBackgroundRemoval";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { ProcessingAnimation } from "./ProcessingAnimation";
import { ResultPreview } from "./ResultPreview";
import { ErrorState } from "./ErrorState";

export function BackgroundRemover() {
  const { status, image, result, error, progress, progressMessage, selectFile, process, reset } =
    useBackgroundRemoval();

  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-3xl border-2 border-foreground bg-background p-2 shadow-toy-lg">
      <div className="rounded-2xl bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {status === "idle" && <ImageUploader onFile={selectFile} />}
            {status === "selected" && image && (
              <ImagePreview image={image} onProcess={process} onReset={reset} />
            )}
            {status === "processing" && image && (
              <ProcessingAnimation
                image={image}
                progress={progress}
                progressMessage={progressMessage}
              />
            )}
            {status === "success" && image && result && (
              <ResultPreview image={image} result={result} onReset={reset} />
            )}
            {status === "error" && (
              <ErrorState message={error ?? "Something went wrong."} onReset={reset} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
