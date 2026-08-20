import { motion } from "motion/react";
import { Github, Scissors } from "lucide-react";
import { site } from "../config/site";

export function Header() {
  return (
    <header className="sticky top-3 z-40 mx-3 sm:mx-auto flex max-w-6xl items-center justify-between rounded-2xl border-2 border-foreground bg-background/90 px-3 py-2.5 sm:px-4 sm:py-3 shadow-toy-sm backdrop-blur">
      <a href="#top" className="flex items-center gap-2 group">
        <motion.span
          whileHover={{ rotate: -12, scale: 1.05 }}
          className="grid h-9 w-9 place-items-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground shadow-toy-sm"
        >
          <Scissors className="h-4 w-4" strokeWidth={2.5} />
        </motion.span>
        <span className="font-display text-xl font-bold">{site.name}</span>
        <span className="ml-1 hidden rounded-full border border-foreground bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground sm:inline">
          open src
        </span>
      </a>

      <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
        <a href="#how" className="hover:text-primary transition-colors">
          How it works
        </a>
        <a href="#open" className="hover:text-primary transition-colors">
          Open Source
        </a>
      </nav>

      <motion.a
        whileHover={{ y: -2, rotate: -1 }}
        whileTap={{ y: 0 }}
        href={site.github.repo}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-foreground px-4 py-2 text-sm font-bold text-background shadow-toy-sm transition-shadow hover:shadow-toy"
      >
        <Github className="h-4 w-4" />
        GitHub
      </motion.a>
    </header>
  );
}
