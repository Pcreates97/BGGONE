import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Github, Scissors, User as UserIcon, LogIn } from "lucide-react";
import { site } from "../config/site";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-3 z-40 mx-3 sm:mx-auto flex max-w-6xl items-center justify-between rounded-2xl border-2 border-foreground bg-background/90 px-3 py-2.5 sm:px-4 sm:py-3 shadow-toy-sm backdrop-blur">
      <Link to="/" className="flex items-center gap-2 group">
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
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
        <a href="/#how" className="hover:text-primary transition-colors">
          How it works
        </a>
        <a href="/#testimonials" className="hover:text-primary transition-colors">
          Reviews
        </a>
        <a href="/#open" className="hover:text-primary transition-colors">
          Open Source
        </a>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        {isAuthenticated && user ? (
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-secondary px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold text-secondary-foreground shadow-toy-xs hover:shadow-toy-sm transition-all"
          >
            <div className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-background text-[10px]">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="max-w-[90px] sm:max-w-[120px] truncate">{user.name}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log in</span>
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-foreground bg-primary px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-toy-xs hover:shadow-toy-sm transition-all"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign up</span>
            </Link>
          </div>
        )}

        <motion.a
          whileHover={{ y: -2, rotate: -1 }}
          whileTap={{ y: 0 }}
          href={site.github.repo}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-foreground bg-foreground px-3.5 py-2 text-xs sm:text-sm font-bold text-background shadow-toy-xs transition-shadow hover:shadow-toy"
        >
          <Github className="h-4 w-4" />
          GitHub
        </motion.a>
      </div>
    </header>
  );
}
