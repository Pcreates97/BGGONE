"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, Sparkles, ArrowUpRight, ShieldCheck, Code2, UserX } from "lucide-react";

export interface CarouselCard {
  id: string;
  title: string;
  value: string;
  description?: string;
  tag?: string;
  color: string;
  icon: React.ElementType;
  actionText?: string;
  actionUrl?: string;
}

interface MinimalCarouselProps {
  cards: CarouselCard[];
  defaultActiveId?: string | null;
  onActionClick?: (card: CarouselCard) => void;
  className?: string;
}

export const MinimalCarousel: React.FC<MinimalCarouselProps> = ({
  cards,
  defaultActiveId = null,
  onActionClick,
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCard = cards.find((c) => c.id === activeId);
  const secondaryCards = cards.filter((c) => c.id !== activeId);

  const handleCopy = (card: CarouselCard, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(
      `${card.title} - ${card.value}${card.description ? ": " + card.description : ""}`,
    );
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div layout className="flex flex-col gap-4">
        {/* Expanded Spotlight Card */}
        <AnimatePresence mode="popLayout">
          {activeCard && (
            <motion.div
              key={activeCard.id}
              layoutId={activeCard.id}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              className={`relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-foreground p-6 sm:p-8 shadow-toy transition-shadow hover:shadow-toy-hover ${activeCard.color}`}
            >
              {/* Top Row: Icon badge + Tag + Action controls */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-foreground bg-background text-foreground shadow-toy-sm">
                    <activeCard.icon className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  {activeCard.tag && (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-background px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground shadow-toy-xs">
                      <Sparkles className="h-3 w-3" />
                      {activeCard.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={(e) => handleCopy(activeCard, e)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-toy-xs hover:bg-muted"
                  >
                    {copiedId === activeCard.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="inline-flex items-center rounded-xl border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-toy-xs hover:bg-muted"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Middle/Bottom Content */}
              <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                    {activeCard.title}
                  </h3>
                  <p className="mt-2 text-base sm:text-lg font-medium leading-relaxed opacity-95">
                    {activeCard.value}
                  </p>
                  {activeCard.description && (
                    <p className="mt-2 text-sm opacity-80 leading-relaxed">
                      {activeCard.description}
                    </p>
                  )}
                </div>

                {activeCard.actionText && (
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeCard.actionUrl) {
                        window.open(activeCard.actionUrl, "_blank", "noopener,noreferrer");
                      }
                      onActionClick?.(activeCard);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-background px-5 py-3 font-display text-sm font-bold text-foreground shadow-toy-sm hover:bg-muted self-start md:self-auto shrink-0"
                  >
                    <span>{activeCard.actionText}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Grid of Cards */}
        <motion.div
          layout
          className={`grid gap-4 sm:gap-6 transition-all duration-500 ${
            activeId ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {(activeId ? secondaryCards : cards).map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                layoutId={card.id}
                onClick={() => setActiveId(card.id)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-3xl border-2 border-foreground p-6 shadow-toy transition-all hover:shadow-toy-hover ${
                  card.color
                } ${activeId ? "min-h-[160px]" : "min-h-[220px]"}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-foreground bg-background text-foreground shadow-toy-sm transition-transform group-hover:scale-105">
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    {card.tag && (
                      <span className="rounded-full border border-foreground/30 bg-background/80 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase text-foreground shadow-toy-xs backdrop-blur-xs">
                        {card.tag}
                      </span>
                    )}
                  </div>

                  <h4 className="mt-4 font-display text-xl font-bold tracking-tight">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-sm font-medium opacity-90 line-clamp-3 leading-relaxed">
                    {card.value}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-75 group-hover:opacity-100">
                    Click to inspect
                  </span>
                  <div className="grid h-7 w-7 place-items-center rounded-xl border border-foreground/30 bg-background/80 text-foreground shadow-toy-xs transition-transform group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MinimalCarousel;
