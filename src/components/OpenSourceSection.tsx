import { motion } from "motion/react";
import { Code2, ShieldCheck, UserX } from "lucide-react";

const blocks = [
  {
    icon: Code2,
    title: "OPEN SOURCE",
    desc: "Inspect the code, improve it, break it, fix it, and make it better.",
    color: "bg-secondary",
  },
  {
    icon: ShieldCheck,
    title: "PRIVACY FOCUSED",
    desc: "Designed without unnecessary image storage or tracking.",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: UserX,
    title: "NO ACCOUNT",
    desc: "No email. No password. No 'verify your inbox.' Just use the tool.",
    color: "bg-accent",
  },
];

export function OpenSourceSection() {
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

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {blocks.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border-2 border-foreground bg-background p-6 shadow-toy"
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl border-2 border-foreground shadow-toy-sm ${b.color}`}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
