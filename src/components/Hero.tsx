import { motion } from "motion/react";
import { Sparkles, Zap, Shield, Image as ImageIcon } from "lucide-react";
import { HeroDecorations } from "./HeroDecorations";
import { BackgroundRemover } from "./BackgroundRemover";
import hero3dBg from "@/assets/images/hero_3d_bg_1787336952777.jpg";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 min-h-[85vh] flex flex-col justify-center"
    >
      {/* Full 3D Background Image Canvas with Soft Downside (Bottom) Fade-Out */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* The 3D Render Image */}
        <div
          className="absolute inset-0 bg-cover bg-top sm:bg-center opacity-40 sm:opacity-50 transition-all duration-700 scale-105"
          style={{
            backgroundImage: `url(${hero3dBg})`,
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Ambient Top Light Highlight & Bottom Background Fade Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent via-55% to-background" />

        {/* Subtle Neo-Brutalist Dot Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Floating 3D Stickers & Mascot Decorations */}
      <HeroDecorations />

      <div className="relative z-10 mx-auto max-w-5xl px-3 sm:px-4 text-center">
        {/* Top Fun Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mx-auto mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border-2 border-foreground bg-background/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-toy-sm backdrop-blur-xs hover:shadow-toy transition-all"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <motion.span
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </motion.span>
          <span>Instant AI Background Remover</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground border border-foreground/30 shadow-toy-xs">
            100% Free
          </span>
        </motion.div>

        {/* Giant Playful Headline */}
        <h1 className="font-display text-4xl sm:text-7xl md:text-8xl font-bold leading-[0.95] sm:leading-[0.9] tracking-tight text-foreground">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6, type: "spring" }}
            className="block"
          >
            BYE BYE,
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, type: "spring" }}
            className="mt-2 inline-block max-w-full"
          >
            <span className="relative inline-block -rotate-2 rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-foreground bg-primary px-4 py-1 sm:px-7 sm:py-2 text-primary-foreground shadow-toy hover:rotate-0 transition-transform duration-300">
              BACKGROUND
              <svg
                aria-hidden
                className="absolute -bottom-2.5 left-2 right-2 h-2.5 w-[calc(100%-1rem)] sm:-bottom-3.5 sm:left-4 sm:right-4 sm:h-3.5 sm:w-[calc(100%-2rem)]"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 6 Q 20 1 40 5 T 80 4 T 98 6"
                  stroke="#C6F24E"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-foreground">.</span>
          </motion.span>
        </h1>

        {/* Subtitle / Value Pitch */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mx-auto mt-6 sm:mt-8 max-w-xl text-base sm:text-lg font-medium text-muted-foreground leading-relaxed"
        >
          Drop in any image. Isolate your subject with crisp sub-pixel alpha matting in under 0.4
          seconds.
          <br className="hidden sm:inline" />
          <span className="text-foreground font-bold mt-1 inline-block">
            No account. No credit cards. Just clean transparent cutouts.
          </span>
        </motion.p>

        {/* Quick Feature Badges Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-foreground"
        >
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/30 bg-background/80 px-3 py-1 shadow-toy-xs backdrop-blur-xs">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>&lt; 0.4s AI Inference</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/30 bg-background/80 px-3 py-1 shadow-toy-xs backdrop-blur-xs">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Client Privacy</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/30 bg-background/80 px-3 py-1 shadow-toy-xs backdrop-blur-xs">
            <ImageIcon className="h-3.5 w-3.5 text-accent" />
            <span>Full 4K HD Output</span>
          </span>
        </motion.div>

        {/* The Main Interactive Background Remover Component */}
        <div className="mt-10 sm:mt-12">
          <BackgroundRemover />
        </div>
      </div>
    </section>
  );
}

export default Hero;
