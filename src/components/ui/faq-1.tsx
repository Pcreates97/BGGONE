"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus, HelpCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag?: string;
  date?: string;
}

export interface Faq1Props {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  faqs?: FaqItem[];
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  className?: string;
}

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "item-1",
    question: "Is Poof really 100% free with no hidden paywalls?",
    answer:
      "Yes, absolutely. There are no credit cards required, no trial expiration countdowns, and no low-res download traps. You get instant, full-resolution transparent PNG cutouts completely free.",
    tag: "Pricing",
  },
  {
    id: "item-2",
    question: "How does the privacy-first processing work? Are my photos uploaded or stored?",
    answer:
      "Your privacy is our priority. In-browser AI models process images directly on your device via WebAssembly/GPU acceleration. When cloud processing is utilized for ultra-high-definition passes, images are streamed in-memory and immediately discarded with zero persistent disk storage and zero AI model training.",
    tag: "Privacy & Security",
  },
  {
    id: "item-3",
    question: "What image formats and resolutions are supported?",
    answer:
      "Poof supports PNG, JPG, JPEG, WebP, and AVIF files. We preserve your native pixel dimensions and aspect ratio (supporting up to 4K resolutions and 35MB file sizes) without downsampling or compression artifacts.",
    tag: "Formats & Quality",
  },
  {
    id: "item-4",
    question: "How does Poof handle challenging details like hair, fur, and transparency?",
    answer:
      "Poof uses state-of-the-art sub-pixel alpha matting neural networks trained specifically on intricate boundaries — including fine strands of hair, animal fur, flying fabric, and semi-transparent glass — delivering razor-sharp edge contours without edge halos or dark fringing.",
    tag: "AI Matting",
  },
  {
    id: "item-5",
    question: "Can I replace the background with custom colors, gradients, or scenes?",
    answer:
      "Yes! After isolating your subject, you can download the clean transparent PNG, or switch to solid studio backdrops, aesthetic gradients, or custom uploaded scenes with customizable shadow and outline effects right inside the editor.",
    tag: "Editor Features",
  },
  {
    id: "item-6",
    question: "Is there an API or batch processing available for developers and businesses?",
    answer:
      "Yes. Poof includes a server API endpoint (`/api/remove-bg`) and open-source foundation modules that can be integrated into custom automated pipelines, e-commerce workflows, or CMS integrations.",
    tag: "Developers",
  },
];

export function Faq1({
  badge = "FREQUENTLY ASKED QUESTIONS",
  title = "Got questions? We've got answers.",
  subtitle = "Everything you need to know about Poof's AI background removal, privacy architecture, and supported formats.",
  faqs = DEFAULT_FAQS,
  footerText = "Still have questions?",
  footerLinkText = "Check the GitHub repository",
  footerLinkHref = "https://github.com",
  className,
}: Faq1Props) {
  return (
    <section id="faq" className={cn("mx-auto w-full max-w-5xl px-4 py-16 sm:py-24", className)}>
      {/* Header */}
      <div className="mb-12 flex flex-col items-center text-center">
        {badge && (
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-secondary px-3.5 py-1 text-xs font-display font-bold uppercase tracking-wider text-secondary-foreground shadow-toy-xs">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.1]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Accordion list with Neo-Brutalist styling */}
      <Accordion type="single" collapsible className="w-full space-y-3.5">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="group overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-toy transition-all duration-200 hover:shadow-toy-hover data-[state=open]:border-primary data-[state=open]:shadow-toy-hover"
          >
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-4.5 sm:px-6 sm:py-5 hover:no-underline text-left cursor-pointer [&>svg]:hidden">
              <div className="flex items-center gap-3 pr-4">
                {faq.tag && (
                  <span className="hidden sm:inline-flex rounded-md border border-foreground/30 bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {faq.tag}
                  </span>
                )}
                <span className="font-display text-base sm:text-lg font-bold text-foreground group-data-[state=open]:text-primary transition-colors">
                  {faq.question}
                </span>
              </div>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-secondary text-secondary-foreground shadow-toy-xs transition-transform duration-200 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:rotate-180">
                <Plus className="h-4 w-4 group-data-[state=open]:hidden" strokeWidth={2.5} />
                <Minus className="hidden h-4 w-4 group-data-[state=open]:block" strokeWidth={2.5} />
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1">
              <div className="border-t border-border/80 pt-3">
                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
                {faq.date && (
                  <div className="mt-3 text-xs font-semibold text-muted-foreground/70">
                    Updated {faq.date}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Footer CTA */}
      {(footerText || footerLinkText) && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-sm font-semibold text-muted-foreground">
          <span>{footerText}</span>
          {footerLinkText && (
            <a
              href={footerLinkHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:text-primary transition-colors"
            >
              <span>{footerLinkText}</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </section>
  );
}

export default Faq1;
