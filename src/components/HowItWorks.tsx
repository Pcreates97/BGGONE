import { motion } from "motion/react";
import { Upload, Wand2, Download } from "lucide-react";
import { ExpandableProfileCard } from "./ui/expandable-profile-card";
import dropStepImg from "../assets/images/card_step_drop_image_1787251301896.jpg";
import aiCutoutStepImg from "../assets/images/card_step_ai_cutout_1787251318357.jpg";
import pngExportStepImg from "../assets/images/card_step_png_export_1787251334429.jpg";

const steps = [
  {
    id: "drop-it",
    n: "01",
    title: "DROP IT",
    subtitle: "Step 01 • Instant Input",
    desc: "Choose your image or drag it straight into the tool. Supports PNG, JPG, and WebP up to 10MB.",
    image: dropStepImg,
    icon: Upload,
    color: "bg-secondary text-secondary-foreground",
    details: [
      {
        heading: "Drag & Drop Simplicity",
        text: "Just drop any photo directly onto the canvas or paste it from your clipboard.",
      },
      {
        heading: "Universal File Support",
        text: "Handles all standard photo formats including high-res camera captures and product shots.",
      },
    ],
    ctaText: "Drop an image now",
  },
  {
    id: "zap-background",
    n: "02",
    title: "ZAP BACKGROUND",
    subtitle: "Step 02 • AI Precision",
    desc: "The cloud AI engine detects edges, hair, and complex contours to separate your subject instantly.",
    image: aiCutoutStepImg,
    icon: Wand2,
    color: "bg-primary text-primary-foreground",
    details: [
      {
        heading: "Sub-Pixel Edge Detection",
        text: "High-precision neural algorithms isolate delicate hair strands, semi-translucent glass, and product edges.",
      },
      {
        heading: "Lightning Fast Speed",
        text: "Cloud-accelerated removal delivers results in 1-2 seconds with zero local device lag.",
      },
    ],
    ctaText: "See it in action",
  },
  {
    id: "grab-png",
    n: "03",
    title: "GRAB YOUR PNG",
    subtitle: "Step 03 • HD Export",
    desc: "Download your crisp transparent PNG and easily drop it into Figma, Canva, or marketing graphics.",
    image: pngExportStepImg,
    icon: Download,
    color: "bg-accent text-accent-foreground",
    details: [
      {
        heading: "Lossless Alpha Transparency",
        text: "Export high-resolution PNGs ready for e-commerce, avatars, banners, and vector composites.",
      },
      {
        heading: "100% Free & Unwatermarked",
        text: "No hidden watermarks or compression artifacts on your exports.",
      },
    ],
    ctaText: "Get started",
  },
];

export function HowItWorks() {
  const scrollToUploader = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
      >
        Seriously. It's{" "}
        <span className="underline decoration-primary decoration-[6px] underline-offset-4">
          this
        </span>{" "}
        easy.
      </motion.h2>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.12, type: "spring", stiffness: 120 }}
          >
            <ExpandableProfileCard
              id={s.id}
              imageSrc={s.image}
              stepNumber={s.n}
              title={s.title}
              subtitle={s.subtitle}
              description={s.desc}
              badgeColor={s.color}
              icon={s.icon}
              details={s.details}
              ctaText={s.ctaText}
              onCtaClick={scrollToUploader}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
