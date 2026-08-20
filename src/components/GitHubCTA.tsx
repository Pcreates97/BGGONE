import { motion } from "motion/react";
import { Github, Bug } from "lucide-react";
import { site } from "../config/site";

export function GitHubCTA() {
  return (
    <section className="relative mx-3 my-12 overflow-hidden rounded-3xl border-2 border-foreground bg-foreground py-12 px-4 sm:py-20 text-background shadow-toy-lg md:mx-auto md:max-w-6xl">
      {/* animated code pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none opacity-[0.06]">
        <div className="animate-marquee font-mono text-xs leading-relaxed">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap">
                  {"{ } ".repeat(30)}
                  {"remove(bg) → transparent.png  "}
                  {"</> ".repeat(20)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-3 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-[0.95] tracking-tight"
        >
          LIKE THE TOOL?
          <br />
          <span className="inline-block -rotate-2 rounded-xl border-2 border-background bg-secondary px-3 text-secondary-foreground">
            STEAL THE CODE.
          </span>
        </motion.h2>
        <p className="mx-auto mt-6 max-w-xl text-background/70">
          Legally, of course. It's open source. Explore the source, report bugs, suggest ridiculous
          features, or contribute something brilliant.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            whileHover={{ y: -3, rotate: -1 }}
            whileTap={{ y: 0 }}
            href={site.github.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-background bg-background px-6 py-4 font-display text-lg font-bold uppercase tracking-tight text-foreground shadow-[6px_6px_0_0_#C6F24E] transition-shadow hover:shadow-[10px_10px_0_0_#C6F24E]"
          >
            <Github className="h-5 w-5" />
            View on GitHub
          </motion.a>
          <motion.a
            whileHover={{ y: -3, rotate: 1 }}
            whileTap={{ y: 0 }}
            href={site.github.issues}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-background bg-transparent px-6 py-4 font-display text-lg font-bold uppercase tracking-tight text-background transition-colors hover:bg-background/10"
          >
            <Bug className="h-5 w-5" />
            Report an issue
          </motion.a>
        </div>
      </div>
    </section>
  );
}
