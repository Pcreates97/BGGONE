import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { HeroDecorations } from "./HeroDecorations";
import { BackgroundRemover } from "./BackgroundRemover";
import { DotField } from "./DotField";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24">
      <HeroDecorations />

      <div className="relative mx-auto max-w-5xl px-3 sm:px-4 text-center">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly={true}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background px-3 py-1 text-[11px] sm:px-4 sm:py-1.5 sm:text-xs font-bold uppercase tracking-widest shadow-toy-sm"
        >
          <motion.span
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </motion.span>
          100% Free · Open Source · No sign-up
        </motion.div>

        <h1 className="font-display text-4xl sm:text-7xl md:text-8xl font-bold leading-[0.95] sm:leading-[0.9] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="block"
          >
            BYE BYE,
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-2 inline-block max-w-full"
          >
            <span className="relative inline-block -rotate-2 rounded-2xl border-2 border-foreground bg-primary px-3 py-1 text-primary-foreground shadow-toy sm:px-5">
              BACKGROUND
              <svg
                aria-hidden
                className="absolute -bottom-2.5 left-2 right-2 h-2.5 w-[calc(100%-1rem)] sm:-bottom-3 sm:left-4 sm:right-4 sm:h-3 sm:w-[calc(100%-2rem)]"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 6 Q 20 1 40 5 T 80 4 T 98 6"
                  stroke="#C6F24E"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>.</span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-muted-foreground"
        >
          Drop in an image. We'll handle the awkward background situation.
          <br />
          <span className="text-foreground font-semibold">
            No account. No nonsense. Just a clean transparent PNG.
          </span>
        </motion.p>

        <div className="mt-12">
          <BackgroundRemover />
        </div>
      </div>
    </section>
  );
}
