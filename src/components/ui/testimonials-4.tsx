"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Quote,
  Star,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Palette,
  Camera,
  Code2,
} from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  category: "all" | "design" | "ecommerce" | "dev" | "photo";
  avatar: string;
  content: string;
  highlight: string;
  rating: number;
  tag: string;
  metric?: string;
}

const testimonials: Testimonial[] = [
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
      "We process over 400 catalog photos every week. The batch-ready transparent PNG export with full alpha channel has completely replaced our monthly paid background removal subscription.",
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
    category: "design",
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
];

const CATEGORIES = [
  { id: "all", label: "All Reviews", icon: Sparkles },
  { id: "design", label: "Designers", icon: Palette },
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingBag },
  { id: "photo", label: "Photographers", icon: Camera },
  { id: "dev", label: "Developers", icon: Code2 },
] as const;

export default function Testimonials4() {
  const [mounted, setMounted] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTestimonials = React.useMemo(() => {
    if (selectedCategory === "all") return testimonials;
    return testimonials.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const plugin = React.useMemo(() => {
    if (typeof window === "undefined") return undefined;
    try {
      return Autoplay({
        delay: 3200,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      });
    } catch {
      return undefined;
    }
  }, []);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollUp(api.canScrollPrev());
      setCanScrollDown(api.canScrollNext());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);
    onSelect();
  }, [api]);

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
          {/* Left Column: Heading, Metrics, Category Filter */}
          <div className="flex flex-col items-start space-y-6 lg:col-span-5 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-secondary px-3.5 py-1 text-xs font-display font-bold uppercase tracking-wider text-secondary-foreground shadow-toy-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>LOVED BY 250,000+ CREATORS</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.1]">
                Trusted by creators who move fast.
              </h2>
              <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed max-w-md">
                See why designers, e-commerce sellers, and developers rely on Poof for instant,
                clean, transparent background cutouts.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="rounded-2xl border-2 border-foreground bg-card p-3.5 shadow-toy-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>&lt; 0.5s Avg Speed</span>
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
            <div className="flex flex-wrap gap-2 pt-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      api?.scrollTo(0);
                    }}
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

            {/* Interactive Vertical Carousel Navigation Controls */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground">
                Scroll reviews:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  disabled={!canScrollUp}
                  aria-label="Previous testimonial"
                  className="grid h-9 w-9 place-items-center rounded-xl border-2 border-foreground bg-card shadow-toy-xs transition-transform hover:-translate-y-0.5 hover:bg-muted active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  disabled={!canScrollDown}
                  aria-label="Next testimonial"
                  className="grid h-9 w-9 place-items-center rounded-xl border-2 border-foreground bg-card shadow-toy-xs transition-transform hover:-translate-y-0.5 hover:bg-muted active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                {isHovered ? "Paused on hover" : "Auto-scrolling"}
              </span>
            </div>
          </div>

          {/* Right Column: Vertical Interactive Scrollable Carousel */}
          <div
            className="relative h-[480px] w-full rounded-3xl lg:col-span-7 lg:h-[540px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Top Fade Gradient */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 h-16 bg-gradient-to-b from-background via-background/80 to-transparent" />

            {/* Carousel Container */}
            {mounted ? (
              <Carousel
                setApi={setApi}
                orientation="vertical"
                opts={{
                  loop: true,
                  align: "start",
                }}
                plugins={plugin ? [plugin] : undefined}
                onMouseEnter={() => plugin?.stop()}
                onMouseLeave={() => plugin?.reset()}
                className="h-full w-full [&_[data-slot=carousel-content]]:h-[480px] lg:[&_[data-slot=carousel-content]]:h-[540px]"
              >
                <CarouselContent className="-mt-4 py-4">
                  {filteredTestimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="basis-auto pt-4 select-none">
                      <Card className="group relative overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-toy transition-all duration-300 hover:-translate-y-1 hover:shadow-toy-hover hover:border-primary">
                        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
                          {/* Header: Author Info + Highlight Tag + Quote Icon */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12 rounded-2xl border-2 border-foreground shadow-toy-xs">
                                  <AvatarImage
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="rounded-2xl bg-secondary font-display font-bold text-secondary-foreground">
                                    {testimonial.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {testimonial.metric && (
                                  <span className="absolute -bottom-1.5 -right-1.5 rounded-md border border-foreground bg-accent px-1.5 py-0.2 text-[9px] font-bold text-accent-foreground shadow-toy-xs">
                                    {testimonial.metric}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-display text-sm sm:text-base font-bold text-foreground">
                                    {testimonial.name}
                                  </span>
                                  <span className="rounded-md border border-foreground bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {testimonial.tag}
                                  </span>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {testimonial.role} • {testimonial.company}
                                </span>
                              </div>
                            </div>

                            <div className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-foreground bg-secondary text-secondary-foreground shadow-toy-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <Quote className="h-4 w-4 fill-current" />
                            </div>
                          </div>

                          {/* Star Rating & Highlight Bar */}
                          <div className="flex items-center justify-between border-y border-border py-2">
                            <div className="flex items-center gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                              ))}
                            </div>
                            <span className="font-display text-xs font-bold text-foreground">
                              "{testimonial.highlight}"
                            </span>
                          </div>

                          {/* Testimonial Quote Content */}
                          <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-relaxed">
                            "{testimonial.content}"
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="flex flex-col gap-4 py-4 h-full overflow-hidden">
                {filteredTestimonials.slice(0, 2).map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="relative overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-toy p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-2xl border-2 border-foreground bg-secondary font-display font-bold text-secondary-foreground grid place-items-center">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-foreground">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role} • {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90">"{testimonial.content}"</p>
                  </Card>
                ))}
              </div>
            )}

            {/* Bottom Fade Gradient */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-16 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
