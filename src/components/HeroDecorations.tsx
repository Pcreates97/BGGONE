import { motion } from "motion/react";
import { Sparkles, Scissors, Zap, ShieldCheck, Heart } from "lucide-react";
import heroMascotImg from "@/assets/images/hero_3d_cutout_1787336969848.jpg";

export function HeroDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-5 overflow-hidden">
      {/* 3D Mascot Character floating on the top right */}
      <motion.div
        className="absolute right-[2%] top-[6%] hidden sm:block md:right-[6%] md:top-[8%] z-10"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -14, 0],
          rotate: [3, -3, 3],
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.6 },
        }}
      >
        <div className="group relative flex items-center gap-2 rounded-2xl border-2 border-foreground bg-background/95 p-2 shadow-toy backdrop-blur-xs transition-transform hover:scale-105">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl border-2 border-foreground bg-secondary shadow-toy-xs">
            <img src={heroMascotImg} alt="Poof 3D Mascot" className="h-full w-full object-cover" />
          </div>
          <div className="pr-2 text-left">
            <div className="flex items-center gap-1">
              <span className="font-display text-xs font-bold text-foreground">AI Zap Engine</span>
              <span className="rounded-md border border-foreground bg-primary px-1.5 py-0.2 text-[8px] font-bold uppercase text-primary-foreground shadow-toy-xs">
                Active
              </span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-0.5">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              &lt; 0.4s Instant Cutout
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating Badge on Left: Sparkle sticker */}
      <motion.div
        className="absolute left-[3%] top-[8%] hidden sm:block sm:left-[5%] sm:top-[12%] z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -12, 0],
          rotate: [-6, 2, -6],
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="flex items-center gap-2 rounded-2xl border-2 border-foreground bg-secondary px-3.5 py-2 text-secondary-foreground shadow-toy">
          <div className="grid h-7 w-7 place-items-center rounded-xl border border-foreground bg-background text-foreground shadow-toy-xs">
            <Sparkles className="h-4 w-4 text-primary fill-primary" />
          </div>
          <span className="font-display text-xs font-bold uppercase tracking-wider">
            Sub-Pixel Alpha
          </span>
        </div>
      </motion.div>

      {/* Floating Badge Bottom Left: Zero storage guarantee */}
      <motion.div
        className="absolute left-[2%] bottom-[28%] hidden md:block md:left-[6%] z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 10, 0],
          rotate: [4, -4, 4],
        }}
        transition={{
          y: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="flex items-center gap-2 rounded-2xl border-2 border-foreground bg-background/95 px-3 py-1.5 text-foreground shadow-toy backdrop-blur-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-[11px] font-bold">100% In-Browser Privacy</span>
        </div>
      </motion.div>

      {/* Floating Badge Bottom Right: Scissors sticker */}
      <motion.div
        className="absolute right-[3%] bottom-[24%] hidden md:block md:right-[7%] z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -10, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          y: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="flex items-center gap-2 rounded-2xl border-2 border-foreground bg-accent px-3 py-1.5 text-accent-foreground shadow-toy">
          <Scissors className="h-4 w-4" strokeWidth={2.5} />
          <span className="font-display text-[11px] font-bold uppercase tracking-wider">
            Hair &amp; Fur Matting
          </span>
        </div>
      </motion.div>

      {/* Subtle floating rotating star */}
      <motion.div
        className="absolute left-[18%] top-[3%] hidden text-primary/70 lg:block"
        animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Sparkles className="h-6 w-6 fill-current" />
      </motion.div>

      <motion.div
        className="absolute right-[22%] top-[4%] hidden text-accent/80 lg:block"
        animate={{ rotate: [360, 0], y: [0, -6, 0] }}
        transition={{
          rotate: { duration: 18, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Heart className="h-5 w-5 fill-current" />
      </motion.div>
    </div>
  );
}
