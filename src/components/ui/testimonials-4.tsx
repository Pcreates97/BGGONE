"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Quote,
  Star,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  Pause,
  ShoppingBag,
  Palette,
  Camera,
  Code2,
  TrendingUp,
} from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  category: "design" | "ecommerce" | "dev" | "photo" | "marketing";
  avatar: string;
  content: string;
  highlight: string;
  rating: number;
  tag: string;
  metric?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Elena Rostova",
    role: "Lead Product Designer",
    company: "Studio Chroma",
    category: "design",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content:
      "Poof cut our asset preparation workflow by 80%. Intricate hair edges and transparent glasses used to require manual masking in Photoshop, but now it's instantaneous with zero edge halo.",
    highlight: "80% faster workflow",
    rating: 5,
    tag: "Design Studio",
    metric: "0.4s Cutout",
  },
  {
    id: "2",
    name: "Marcus Vance",
    role: "E-Commerce Director",
    company: "Nordic Goods Co.",
    category: "ecommerce",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content:
      "We process over 400 catalog photos every week. The transparent PNG export with full alpha channel has completely replaced our monthly paid background removal subscription.",
    highlight: "Saved $1,200/mo",
    rating: 5,
    tag: "E-Commerce",
    metric: "400+ items/wk",
  },
  {
    id: "3",
    name: "Aisha Chen",
    role: "Creative Technologist",
    company: "Voxel Labs",
    category: "dev",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    content:
      "Having an open-source, client-side first AI background remover that runs entirely in the browser is unbelievable. Complete data privacy for our confidential client photos.",
    highlight: "100% Client Privacy",
    rating: 5,
    tag: "Open Source",
    metric: "Zero Uploads",
  },
  {
    id: "4",
    name: "Liam O'Connor",
    role: "Commercial Photographer",
    company: "O'Connor Studios",
    category: "photo",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    content:
      "Sub-pixel alpha matting is flawless. I tested complex wedding portraits with flying veils and windy hair strands — Poof maintained every fine detail without pixelation.",
    highlight: "Lossless HD Matting",
    rating: 5,
    tag: "Photography",
    metric: "HD Alpha Matte",
  },
  {
    id: "5",
    name: "Sarah Jenkins",
    role: "Brand Strategist",
    company: "Hyperlink Creative",
    category: "marketing",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    content:
      "The UI is so playful and responsive! No spammy sign-up traps, no credit card paywalls, just instant drop-and-zap background removal with lossless transparent PNG output.",
    highlight: "No Hidden Paywalls",
    rating: 5,
    tag: "Marketing",
    metric: "100% Free",
  },
  {
    id: "6",
    name: "Devon Brooks",
    role: "Frontend Engineer",
    company: "StackCraft",
    category: "dev",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    content:
      "The neural model executes in WebAssembly right on the user's GPU. The speed is phenomenal, and the neobrutalist aesthetic makes the entire user experience genuinely delightful.",
    highlight: "GPU Accelerated",
    rating: 5,
    tag: "Engineering",
    metric: "60 FPS UI",
  },
  {
    id: "7",
    name: "Mateo Alvarez",
    role: "Editorial Retoucher",
    company: "Atelier Mode",
    category: "photo",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    content:
      "Precision on feather jewelry, sheer fabrics, and complex lighting highlights is better than most enterprise server tools. Saves hours on magazine spreads.",
    highlight: "Editorial Grade",
    rating: 5,
    tag: "Editorial",
    metric: "4K Resolution",
  },
  {
    id: "8",
    name: "Priya Sharma",
    role: "D2C Brand Founder",
    company: "Saffron & Silk",
    category: "ecommerce",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    content:
      "We build our entire Shopify storefront product imagery using Poof. The isolated objects pop cleanly on white or custom pastel backdrops without jagged edges.",
    highlight: "Clean Shopify Cutouts",
    rating: 5,
    tag: "D2C Brands",
    metric: "5x Listing Speed",
  },
  {
    id: "9",
    name: "Jordan Miller",
    role: "Game Artist & UI Lead",
    company: "PixelForge Interactive",
    category: "design",
    avatar:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
    content:
      "Isolating 3D character renders and game item props into clean sprites takes seconds. Exporting transparent alphas without dark color fringe is a game-changer.",
    highlight: "Fringe-Free Sprites",
    rating: 5,
    tag: "Game Dev",
    metric: "Alpha Crisp",
  },
  {
    id: "10",
    name: "Chloe Dubois",
    role: "Visual Content Creator",
    company: "Horizon Visuals",
    category: "marketing",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    content:
      "I make YouTube thumbnails and TikTok title cards every single day. Dropping a quick selfie and getting an ultra-crisp transparent cutout ready to paste into Figma is gold.",
    highlight: "Daily Creator Go-To",
    rating: 5,
    tag: "Content Creator",
    metric: "Instant Figma Flow",
  },
  {
    id: "11",
    name: "Kenji Takahashi",
    role: "Print Production Lead",
    company: "Tokyo NeoPrint",
    category: "design",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    content:
      "Full original resolution output retention is crucial for 300 DPI print. Poof preserves the exact source image pixel dimensions and color gamut without downsampling.",
    highlight: "100% Native Resolution",
    rating: 5,
    tag: "Print & Media",
    metric: "Zero Downsampling",
  },
  {
    id: "12",
    name: "Amara Okafor",
    role: "Growth Marketing Manager",
    company: "Pulse Media",
    category: "marketing",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    content:
      "Our social ads team turns around product promos twice as fast. Beautiful, snappy web experience with zero bloat and total reliability.",
    highlight: "2x Ad Production",
    rating: 5,
    tag: "Growth & Ads",
    metric: "2x Ad ROI",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Reviews", icon: Sparkles },
  { id: "design", label: "Designers", icon: Palette },
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingBag },
  { id: "photo", label: "Photographers", icon: Camera },
  { id: "dev", label: "Developers", icon: Code2 },
  { id: "marketing", label: "Marketing", icon: TrendingUp },
] as const;

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-toy transition-all duration-300 hover:-translate-y-1 hover:shadow-toy-hover hover:border-primary">
      <CardContent className="flex flex-col gap-3.5 p-5">
        {/* Header: Avatar, Name, Role & Quote Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-11 w-11 rounded-2xl border-2 border-foreground shadow-toy-xs">
                <AvatarImage
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-secondary font-display font-bold text-secondary-foreground text-xs">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {testimonial.metric && (
                <span className="absolute -bottom-1 -right-1 rounded-md border border-foreground bg-accent px-1.5 py-0.2 text-[8px] font-bold text-accent-foreground shadow-toy-xs">
                  {testimonial.metric}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-bold text-foreground">
                  {testimonial.name}
                </span>
                <span className="rounded-md border border-foreground bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  {testimonial.tag}
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground line-clamp-1">
                {testimonial.role} • {testimonial.company}
              </span>
            </div>
          </div>

          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-secondary text-secondary-foreground shadow-toy-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Quote className="h-3.5 w-3.5 fill-current" />
          </div>
        </div>

        {/* Rating & Highlight Pill */}
        <div className="flex items-center justify-between border-y border-border/80 py-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
            ))}
          </div>
          <span className="font-display text-[11px] font-bold text-foreground">
            "{testimonial.highlight}"
          </span>
        </div>

        {/* Quote Content */}
        <p className="text-xs font-medium text-foreground/90 leading-relaxed">
          "{testimonial.content}"
        </p>
      </CardContent>
    </Card>
  );
}

export default function Testimonials4() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [isPaused, setIsPaused] = React.useState(false);
  const [speed, setSpeed] = React.useState<"normal" | "slow" | "fast">("normal");

  const filteredTestimonials = React.useMemo(() => {
    if (selectedCategory === "all") return TESTIMONIALS;
    return TESTIMONIALS.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  // Split into two alternating columns for balanced continuous vertical sliding
  const column1 = React.useMemo(() => {
    const list = filteredTestimonials.filter((_, idx) => idx % 2 === 0);
    // Duplicate array for seamless infinite vertical looping
    return [...list, ...list, ...list];
  }, [filteredTestimonials]);

  const column2 = React.useMemo(() => {
    const list = filteredTestimonials.filter((_, idx) => idx % 2 === 1);
    const fallback = list.length > 0 ? list : filteredTestimonials;
    // Duplicate array for seamless infinite vertical looping
    return [...fallback, ...fallback, ...fallback];
  }, [filteredTestimonials]);

  const getDuration = (base: number) => {
    if (speed === "fast") return base * 0.6;
    if (speed === "slow") return base * 1.5;
    return base;
  };

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden border-t-2 border-foreground bg-background py-16 md:py-24"
    >
      {/* Background Subtle Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(#000 1.5px, transparent 1.5px), radial-gradient(#000 1.5px, #F7F5EF 1.5px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Headline, Metrics, Category Filters & Playback Controls */}
          <div className="flex flex-col items-start space-y-6 lg:col-span-5 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-secondary px-3.5 py-1 text-xs font-display font-bold uppercase tracking-wider text-secondary-foreground shadow-toy-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>LOVED BY 250,000+ CREATORS</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.1]">
                Loved by creators who demand perfection.
              </h2>
              <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed max-w-md">
                See why designers, e-commerce stores, photographers, and developers choose Poof for
                instant, flawless, full-resolution cutouts.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="rounded-2xl border-2 border-foreground bg-card p-3.5 shadow-toy-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>&lt; 0.4s AI Speed</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                  On-device neural inference
                </p>
              </div>

              <div className="rounded-2xl border-2 border-foreground bg-card p-3.5 shadow-toy-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-foreground px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-toy-xs scale-105"
                        : "bg-background text-foreground hover:bg-muted active:scale-95 shadow-toy-xs"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Loop Slider Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-foreground bg-card p-1 shadow-toy-xs">
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors hover:bg-muted cursor-pointer"
                  title={isPaused ? "Resume slide loop" : "Pause slide loop"}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current text-emerald-600" />
                      <span>Play Loop</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 fill-current text-primary" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              </div>

              {/* Speed Switcher */}
              <div className="inline-flex items-center gap-1 rounded-xl border-2 border-foreground bg-card p-1 text-xs font-bold shadow-toy-xs">
                <span className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Speed:
                </span>
                {(["slow", "normal", "fast"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`rounded-lg px-2 py-0.5 text-xs capitalize transition-colors cursor-pointer ${
                      speed === s
                        ? "bg-foreground text-background font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Seamless Loop Slide Down to Up Reviews Column */}
          <div
            className="relative h-[560px] w-full overflow-hidden rounded-3xl lg:col-span-7"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Fade Gradient */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 h-20 bg-gradient-to-b from-background via-background/90 to-transparent" />

            {/* Scrolling Track Container */}
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Column 1 (Sliding down to up loop) */}
              <div className="relative h-full overflow-hidden">
                <motion.div
                  className="flex flex-col gap-4"
                  animate={
                    isPaused
                      ? { y: undefined }
                      : {
                          y: ["0%", "-50%"],
                        }
                  }
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: getDuration(28),
                      ease: "linear",
                    },
                  }}
                >
                  {column1.map((item, idx) => (
                    <div key={`c1-${item.id}-${idx}`}>
                      <TestimonialCard testimonial={item} />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Column 2 (Sliding down to up loop with offset duration) */}
              <div className="relative hidden h-full overflow-hidden sm:block">
                <motion.div
                  className="flex flex-col gap-4"
                  animate={
                    isPaused
                      ? { y: undefined }
                      : {
                          y: ["0%", "-50%"],
                        }
                  }
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: getDuration(34),
                      ease: "linear",
                    },
                  }}
                >
                  {column2.map((item, idx) => (
                    <div key={`c2-${item.id}-${idx}`}>
                      <TestimonialCard testimonial={item} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom Fade Gradient */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-20 bg-gradient-to-t from-background via-background/90 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
