import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Scissors,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Download,
  Layers,
  Sparkle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { site } from "../../config/site";
import authHeroImg from "../../assets/images/auth_hero_showcase_1787253497556.jpg";
import stepDropImg from "../../assets/images/card_step_drop_image_1787251301896.jpg";
import stepAiCutoutImg from "../../assets/images/card_step_ai_cutout_1787251318357.jpg";
import stepPngExportImg from "../../assets/images/card_step_png_export_1787251334429.jpg";

const SHOWCASE_SLIDES = [
  {
    id: "hero",
    image: authHeroImg,
    badge: "POOF • BACKGROUND ENGINE",
    title: site.tagline,
    description:
      "Instant AI background separation with sub-pixel edge precision, pure alpha transparency, and zero watermarks.",
    pill1: { icon: Zap, label: "Sub-second AI cutout" },
    pill2: { icon: Download, label: "Lossless HD transparent PNG" },
  },
  {
    id: "drop",
    image: stepDropImg,
    badge: "STEP 1 • INSTANT DRAG & DROP",
    title: "Upload Any Photo in Seconds",
    description:
      "Drop portraits, products, animals, and graphics up to 25MB with zero browser lag or compression loss.",
    pill1: { icon: Sparkles, label: "Smart Format Detection" },
    pill2: { icon: ShieldCheck, label: "100% Client-Side Safe" },
  },
  {
    id: "cutout",
    image: stepAiCutoutImg,
    badge: "STEP 2 • NEURAL ALPHA MATTE",
    title: "Sub-Pixel Hair & Detail Cutouts",
    description:
      "Multi-stage segmentation models detect individual hair strands, transparent glass, fur, and intricate contours.",
    pill1: { icon: Layers, label: "Multi-layer Neural Net" },
    pill2: { icon: Sparkle, label: "Crisp Clean Contours" },
  },
  {
    id: "export",
    image: stepPngExportImg,
    badge: "STEP 3 • EXPORT FREEDOM",
    title: "Download Pure Transparent PNG",
    description:
      "Instant 1-click download with full alpha channel transparency ready for Canva, Photoshop, Figma, and print.",
    pill1: { icon: Download, label: "Full Resolution Export" },
    pill2: { icon: CheckCircle2, label: "Always 100% Free" },
  },
];

// Custom Google SVG Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Custom Apple SVG Icon
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z" />
  </svg>
);

interface Auth11Props {
  initialMode?: "login" | "signup";
}

export default function Auth11({ initialMode = "signup" }: Auth11Props) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const { login, signup, loginWithSocial } = useAuth();
  const router = useRouter();

  // Automatically advance images and showcase content every 3.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SHOWCASE_SLIDES[activeSlide];
  const PillIcon1 = currentSlide.pill1.icon;
  const PillIcon2 = currentSlide.pill2.icon;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const res = await signup(name, email, password);
        if (!res.success) {
          setError(res.error || "Failed to create account.");
          setIsSubmitting(false);
          return;
        }

        if (res.confirmationRequired) {
          setSuccess(
            "Account created! Please check your email inbox to confirm your email before logging in.",
          );
          setIsSubmitting(false);
          return;
        }

        setSuccess("Account created successfully! Redirecting...");
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Invalid login credentials. Please check your email and password.");
          setIsSubmitting(false);
          return;
        }
        setSuccess("Welcome back! Redirecting...");
      }

      setTimeout(() => {
        router.navigate({ to: "/account" });
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address above to receive a password reset link.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/account`,
      });
      if (resetErr) {
        setError(resetErr.message);
      } else {
        setSuccess("Password reset instructions have been sent to your email.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to request password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocial = async (provider: "google" | "apple") => {
    setError(null);
    setIsSubmitting(true);
    const res = await loginWithSocial(provider);
    if (res.success) {
      setSuccess(`Connecting to ${provider === "google" ? "Google" : "Apple"}...`);
    } else {
      setError(res.error || "Social authentication failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground lg:flex-row">
      {/* Left Image & Brand Showcase Panel */}
      <div className="relative hidden w-full flex-col justify-end p-4 sm:p-6 lg:flex lg:min-h-screen lg:w-1/2">
        {/* Card Frame */}
        <div className="relative h-full w-full overflow-hidden rounded-[32px] border-2 border-foreground bg-card shadow-toy-lg">
          {/* Automatic Animated Showcase Images */}
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Neobrutalist Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 pointer-events-none" />

          {/* Top Brand & Open Source Pill */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-2xl border-2 border-foreground bg-background px-3.5 py-2 shadow-toy-xs transition-transform hover:scale-105 active:scale-95"
            >
              <div className="grid h-8 w-8 place-items-center rounded-xl border border-foreground bg-primary text-primary-foreground">
                <Scissors className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-bold text-foreground tracking-tight">
                {site.name}
              </span>
            </Link>

            <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground shadow-toy-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Free Open Source
            </span>
          </div>

          {/* Floating Highlight Feature Pills */}
          <div className="absolute top-24 left-6 z-10 flex flex-col gap-2.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSlide.id}-pill1`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-toy-xs backdrop-blur-sm"
              >
                <PillIcon1 className="h-3.5 w-3.5 text-primary" />
                <span>{currentSlide.pill1.label}</span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSlide.id}-pill2`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-toy-xs"
              >
                <PillIcon2 className="h-3.5 w-3.5" />
                <span>{currentSlide.pill2.label}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Showcase Content */}
          <div className="absolute right-0 bottom-0 left-0 z-10 flex w-full flex-col items-start p-8 sm:p-10 text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                className="w-full"
              >
                <span className="mb-2 inline-block font-display text-xs font-bold tracking-widest uppercase text-secondary">
                  {currentSlide.badge}
                </span>
                <h1 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-sm md:text-4xl">
                  {currentSlide.title}
                </h1>
                <p className="mt-2.5 max-w-md text-sm font-medium text-zinc-200/90 leading-relaxed">
                  {currentSlide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Interactive Indicator Dots / Tabs */}
            <div className="mt-6 flex items-center gap-2">
              {SHOWCASE_SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full border border-foreground transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "w-8 bg-secondary shadow-toy-xs"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="relative flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-1/2">
        {/* Back Link to Home */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-background px-3.5 py-1.5 text-xs font-bold text-foreground shadow-toy-xs transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {site.name}</span>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px] mt-12 sm:mt-10 lg:mt-0"
        >
          {/* Card Wrapper for Form */}
          <div className="rounded-3xl border-2 border-foreground bg-card p-6 sm:p-8 shadow-toy">
            {/* Header / Titles */}
            <motion.div variants={itemVariants} className="mb-6 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border-2 border-foreground bg-primary text-primary-foreground shadow-toy-xs">
                <Scissors className="h-6 w-6" strokeWidth={2.5} />
              </div>

              {mode === "signup" ? (
                <>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    JOIN POOF CREATORS
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                    Zap backgrounds & save your transparent PNG library.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    WELCOME BACK
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                    Log in to your {site.name} workspace.
                  </p>
                </>
              )}
            </motion.div>

            {/* Social Buttons */}
            <motion.div
              variants={itemVariants}
              className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <button
                type="button"
                onClick={() => handleSocial("google")}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-background py-2.5 px-3 text-xs font-bold text-foreground shadow-toy-xs transition-transform hover:-translate-y-0.5 hover:bg-muted active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <GoogleIcon className="text-base shrink-0" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocial("apple")}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-background py-2.5 px-3 text-xs font-bold text-foreground shadow-toy-xs transition-transform hover:-translate-y-0.5 hover:bg-muted active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <AppleIcon className="text-base shrink-0" />
                <span>Apple</span>
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative mb-6 flex items-center">
              <div className="grow border-t-2 border-border"></div>
              <span className="px-3 font-display text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Or with email
              </span>
              <div className="grow border-t-2 border-border"></div>
            </motion.div>

            {/* Feedback Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-destructive bg-destructive/10 p-3 text-xs font-bold text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-foreground bg-secondary p-3 text-xs font-bold text-secondary-foreground shadow-toy-xs"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name for Sign Up */}
              {mode === "signup" && (
                <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="font-display text-xs font-bold tracking-wide uppercase text-foreground"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-2xl border-2 border-foreground bg-background px-4 py-3 text-sm font-medium text-foreground shadow-toy-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </motion.div>
              )}

              {/* Email */}
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="font-display text-xs font-bold tracking-wide uppercase text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-2xl border-2 border-foreground bg-background px-4 py-3 text-sm font-medium text-foreground shadow-toy-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-display text-xs font-bold tracking-wide uppercase text-foreground"
                  >
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-2 border-foreground bg-background px-4 py-3 text-sm font-medium text-foreground shadow-toy-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </motion.div>

              {/* Submit Action Button */}
              <motion.div variants={itemVariants} className="mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border-2 border-foreground bg-primary py-3.5 text-sm font-display font-bold text-primary-foreground shadow-toy transition-transform hover:-translate-y-0.5 hover:shadow-toy-hover active:translate-y-0 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : mode === "signup" ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Create Free Account</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Log In to Poof</span>
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Toggle Mode */}
            <motion.div
              variants={itemVariants}
              className="mt-6 border-t-2 border-border pt-4 text-center text-xs text-muted-foreground font-medium"
            >
              {mode === "signup" ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                      setSuccess(null);
                    }}
                    className="font-bold text-foreground underline hover:text-primary transition-colors cursor-pointer ml-1"
                  >
                    Log in
                  </button>
                </span>
              ) : (
                <span>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setSuccess(null);
                    }}
                    className="font-bold text-foreground underline hover:text-primary transition-colors cursor-pointer ml-1"
                  >
                    Sign up free
                  </button>
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
