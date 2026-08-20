import { Github, Scissors } from "lucide-react";
import { site } from "../config/site";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-foreground bg-background px-4 py-4 sm:px-6 sm:py-5 shadow-toy-sm text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-foreground bg-primary text-primary-foreground">
            <Scissors className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold">{site.name}</span>
          <span className="ml-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} · {site.license} License · The brilliant mind behind this
            is Piyush the Ai Developer!
          </span>
        </div>
        <a
          href={site.github.repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Made for people who just wanted the background gone.
      </p>
    </footer>
  );
}
