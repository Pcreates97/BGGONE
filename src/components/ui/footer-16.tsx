"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Scissors,
  Sparkles,
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Zap,
} from "lucide-react";
import footer3dBg from "@/assets/images/footer_3d_bg_1787336648471.jpg";
import footer3dBadge from "@/assets/images/footer_3d_badge_1787336683198.jpg";

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  label: string;
  href: string;
  icon: "github" | "twitter" | "instagram" | "linkedin";
}

export interface Footer16Props {
  brandName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  legalLinks?: FooterLink[];
  socials?: FooterSocial[];
  copyright?: string;
  backgroundImage?: string;
  badgeImage?: string;
  className?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Tool & Features",
    links: [
      { label: "AI Background Remover", href: "/#remover" },
      { label: "Sub-pixel Alpha Matting", href: "/#how-it-works", badge: "Neural" },
      { label: "Transparent PNG Export", href: "/#remover" },
      { label: "Custom Studio Backdrops", href: "/#remover" },
      { label: "Batch API Processing", href: "/#faq" },
    ],
  },
  {
    title: "Ecosystem & Open Source",
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com",
        isExternal: true,
        badge: "MIT",
      },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Creator Testimonials", href: "/#testimonials" },
      { label: "Open Source Manifesto", href: "/#open" },
      { label: "Frequently Asked Questions", href: "/#faq" },
    ],
  },
  {
    title: "Privacy & Standards",
    links: [
      { label: "Zero-Storage Guarantee", href: "/#open", badge: "Safe" },
      { label: "Client-Side In-Browser AI", href: "/#open" },
      { label: "MIT Open Source License", href: "https://github.com", isExternal: true },
      { label: "Privacy Policy", href: "/#open" },
      { label: "Terms of Service", href: "/#open" },
    ],
  },
];

const defaultLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/#open" },
  { label: "Terms of Service", href: "/#open" },
  { label: "MIT License", href: "https://github.com", isExternal: true },
  { label: "System Status: Operational", href: "/#open" },
];

const defaultSocials: FooterSocial[] = [
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordmarkVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 1.1, bounce: 0 },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.65, bounce: 0 },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.42, bounce: 0 },
  },
};

const socialIcons = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

export function Footer16({
  brandName = "POOF",
  tagline = "The lightning-fast, privacy-first AI background remover.\nNo accounts. No credit cards. Just clean transparent cutouts in seconds.",
  columns = defaultColumns,
  legalLinks = defaultLegalLinks,
  socials = defaultSocials,
  copyright = `© ${new Date().getFullYear()} POOF. The brilliant mind behind this is Piyush the AI Developer!`,
  backgroundImage = footer3dBg,
  badgeImage = footer3dBadge,
  className = "",
}: Footer16Props) {
  return (
    <footer
      className={`relative w-full overflow-hidden border-t-2 border-foreground bg-zinc-950 font-sans text-zinc-100 antialiased ${className}`}
    >
      {/* 3D Rendered Background Canvas */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-45 sm:-translate-y-12 transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />

      {/* Atmospheric High-Contrast Vignette & Noise Gradients */}
      <div
        className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(9,10,14,0.4)_0%,rgba(9,10,14,0.15)_35%,rgba(9,10,14,0.75)_68%,rgba(9,10,14,0.96)_100%)]"
        aria-hidden="true"
      />

      {/* Decorative Neo-Brutalist Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-2 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 mx-auto flex min-h-[580px] flex-col justify-end pt-16 sm:min-h-[640px] lg:min-h-[740px]"
      >
        {/* Giant 3D Wordmark in the background */}
        <motion.div
          variants={wordmarkVariants}
          className="pointer-events-none absolute top-[28%] left-1/2 z-3 flex w-[120vw] -translate-x-1/2 justify-center overflow-hidden sm:top-[16%] lg:top-[10%]"
          aria-hidden="true"
        >
          <svg
            className="h-auto w-full select-none opacity-40 mix-blend-overlay"
            viewBox={`0 0 ${Math.max(brandName.length * 110, 420)} 160`}
            preserveAspectRatio="xMidYMid meet"
            aria-label={brandName}
          >
            <defs>
              <linearGradient id="brandGrad3D" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#ff5722" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="55%"
              dominantBaseline="alphabetic"
              textAnchor="middle"
              textLength="82%"
              lengthAdjust="spacing"
              className="font-display font-black tracking-tighter uppercase"
              fill="url(#brandGrad3D)"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.3"
              fontSize="120"
            >
              {brandName}
            </text>
          </svg>
        </motion.div>

        {/* Floating 3D Badge Icon & Quick CTA */}
        <div className="relative z-10 mx-auto mb-6 w-full max-w-6xl px-4 sm:px-8">
          <motion.div
            variants={riseVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border-2 border-foreground bg-background/90 p-5 backdrop-blur-md shadow-toy text-foreground"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-foreground bg-primary shadow-toy-sm">
                <img src={badgeImage} alt="Poof 3D Mascot" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-bold tracking-tight">
                    Start removing backgrounds instantly
                  </span>
                  <span className="hidden sm:inline-flex rounded-full border border-foreground bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow-toy-xs">
                    Free Forever
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Drop any PNG, JPG, or WebP to isolate subjects with crisp sub-pixel alpha.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-toy hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Scroll to Top</span>
            </button>
          </motion.div>
        </div>

        {/* Footer Navigation & Columns */}
        <div className="relative z-10 border-t-2 border-white/15 bg-zinc-950/80 px-4 pt-10 pb-8 shadow-[0_-24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md sm:px-12 sm:pt-12 sm:pb-10">
          <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[minmax(260px,1fr)_minmax(520px,1.2fr)] lg:gap-x-16">
            {/* Brand column */}
            <motion.div variants={riseVariants} className="max-w-xl space-y-4">
              <a
                href="/"
                className="group inline-flex items-center gap-2.5 text-zinc-50 transition-transform duration-200 hover:scale-105"
                aria-label={`${brandName} home`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-white bg-primary text-primary-foreground shadow-toy-xs">
                  <Scissors className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-white">
                  {brandName}
                </span>
                <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Open Source
                </span>
              </a>

              <p className="text-sm font-normal leading-relaxed text-zinc-300/85 whitespace-pre-line max-w-md">
                {tagline}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>100% Client Privacy</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sub-Pixel Alpha</span>
                </span>
              </div>
            </motion.div>

            {/* Navigation columns */}
            <motion.nav
              variants={sectionVariants}
              aria-label="Footer navigation"
              className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-x-8"
            >
              {columns.map((column) => (
                <motion.div variants={riseVariants} key={column.title} className="space-y-3.5">
                  <h3 className="font-display text-xs font-bold tracking-wider text-zinc-100 uppercase border-b border-white/10 pb-2">
                    {column.title}
                  </h3>
                  <motion.ul variants={listVariants} className="space-y-2.5">
                    {column.links.map((link) => (
                      <motion.li variants={linkVariants} key={link.label}>
                        <a
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          rel={link.isExternal ? "noreferrer" : undefined}
                          className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300/80 transition-colors duration-150 hover:text-white"
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {link.label}
                          </span>
                          {link.badge && (
                            <span className="rounded-md border border-primary/40 bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                              {link.badge}
                            </span>
                          )}
                          {link.isExternal && (
                            <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                          )}
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          {/* Bottom Bar: Copyright, Legal Links, Social Icons */}
          <motion.div
            variants={riseVariants}
            className="mx-auto max-w-6xl mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row text-center sm:text-left"
          >
            <p className="text-xs font-medium text-zinc-400/80 flex items-center gap-1.5">
              <span>{copyright}</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Legal links */}
              <motion.ul
                variants={listVariants}
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-400"
              >
                {legalLinks.map((link) => (
                  <motion.li variants={linkVariants} key={link.label}>
                    <a
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noreferrer" : undefined}
                      className="hover:text-zinc-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Social icons */}
              <motion.ul
                variants={listVariants}
                className="flex items-center gap-1.5"
                aria-label="Social links"
              >
                {socials.map((social) => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <motion.li variants={linkVariants} key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/5 text-zinc-300 transition-all hover:bg-white/15 hover:text-white hover:scale-110 active:scale-95"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer16;
