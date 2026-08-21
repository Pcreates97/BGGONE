import { motion } from "motion/react";
import { Code2, ShieldCheck, UserX } from "lucide-react";
import { MinimalCarousel, type CarouselCard } from "./ui/minimal-carousel";

const CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: "open-source",
    title: "OPEN SOURCE",
    value: "Inspect the code, improve it, break it, fix it, and make it better.",
    description:
      "Built completely transparently on modern web standards with zero black-box magic.",
    tag: "100% Free",
    color: "bg-secondary text-secondary-foreground",
    icon: Code2,
    actionText: "Inspect Source",
  },
  {
    id: "privacy-focused",
    title: "PRIVACY FOCUSED",
    value: "Designed without unnecessary image storage or tracking.",
    description:
      "Images are processed securely on-demand and never stored on remote disks or used for training.",
    tag: "Zero Storage",
    color: "bg-primary text-primary-foreground",
    icon: ShieldCheck,
    actionText: "Security Details",
  },
  {
    id: "no-account",
    title: "NO ACCOUNT",
    value: "No email. No password. No 'verify your inbox.' Just use the tool.",
    description: "Instant access right in your browser. Upload, cut out, and download in seconds.",
    tag: "Instant Access",
    color: "bg-accent text-accent-foreground",
    icon: UserX,
    actionText: "Start Removing",
  },
];

export function OpenSourceSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="open" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="grid gap-8 md:grid-cols-2 md:items-end">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-[0.95] tracking-tight"
        >
          YOUR IMAGE.
          <br />
          <span className="inline-block -rotate-1 rounded-xl border-2 border-foreground bg-primary px-3 text-primary-foreground shadow-toy">
            YOUR BUSINESS.
          </span>
        </motion.h2>
        <p className="text-lg text-muted-foreground">
          No account walls. No unnecessary hoops. Just a simple open-source tool built to do one job
          well.
        </p>
      </div>

      <div className="mt-14">
        <MinimalCarousel
          cards={CAROUSEL_CARDS}
          onActionClick={(card) => {
            if (card.id === "no-account") {
              scrollToTop();
            }
          }}
        />
      </div>
    </section>
  );
}
