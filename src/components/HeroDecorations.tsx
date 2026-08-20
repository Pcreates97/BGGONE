import { motion } from "motion/react";
import { Sparkles, Scissors, ImageIcon, Star } from "lucide-react";

// Small decorative floating doodles that surround the hero.
// Purely visual; hidden from screen readers.
export function HeroDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute left-[2%] top-[10%] hidden sm:block sm:left-[6%] sm:top-[18%] rounded-2xl border-2 border-foreground bg-secondary p-3 shadow-toy-sm"
        style={{ "--r": "-8deg" } as React.CSSProperties}
        animate={{ y: [0, -12, 0], rotate: [-8, -4, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-5 w-5" />
      </motion.div>

      <motion.div
        className="absolute right-[2%] top-[12%] hidden sm:block sm:right-[8%] sm:top-[22%] rounded-full border-2 border-foreground bg-accent p-3 shadow-toy-sm"
        animate={{ y: [0, 10, 0], rotate: [10, 4, 10] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Scissors className="h-5 w-5" />
      </motion.div>

      <motion.div
        className="absolute left-[12%] bottom-[24%] hidden rounded-xl border-2 border-foreground bg-background p-2 shadow-toy-sm md:block"
        animate={{ y: [0, -8, 0], rotate: [-4, 2, -4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ImageIcon className="h-4 w-4" />
      </motion.div>

      <motion.div
        className="absolute right-[14%] bottom-[28%] hidden text-primary md:block"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <Star className="h-6 w-6 fill-current" />
      </motion.div>

      {/* organic blob */}
      <svg className="absolute -left-24 top-40 h-72 w-72 opacity-40" viewBox="0 0 200 200">
        <path
          fill="#C6F24E"
          d="M46.5,-59.3C58.9,-49.7,66.6,-33.4,68.8,-17.1C71,-0.8,67.7,15.5,59.6,29.2C51.5,42.9,38.6,54,23.6,60.6C8.7,67.2,-8.3,69.3,-23.9,64.4C-39.4,59.5,-53.6,47.5,-62.1,32.2C-70.6,16.9,-73.6,-1.7,-68.4,-17.4C-63.2,-33.1,-49.9,-45.9,-35.2,-55C-20.5,-64.1,-4.4,-69.4,10.6,-67.2C25.6,-65,34.1,-68.9,46.5,-59.3Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg className="absolute -right-20 bottom-10 h-64 w-64 opacity-30" viewBox="0 0 200 200">
        <path
          fill="#7C3AED"
          d="M38.6,-52.8C51.4,-43.9,64.3,-34.6,68.1,-22.1C71.9,-9.5,66.6,6.4,58.2,19.6C49.8,32.8,38.3,43.3,25.1,50.9C11.9,58.5,-3,63.3,-17.4,60.7C-31.8,58.1,-45.6,48.1,-54.4,35C-63.2,21.9,-66.9,5.7,-63.7,-8.6C-60.4,-22.9,-50.1,-35.4,-38,-45.1C-25.9,-54.8,-12.9,-61.8,-0.4,-61.3C12.2,-60.8,25.8,-61.7,38.6,-52.8Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
}
