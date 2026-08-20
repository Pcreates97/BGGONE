import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";

export interface ExpandableCardProps {
  id?: string;
  imageSrc: string;
  stepNumber?: string;
  title: string;
  subtitle?: string;
  description?: string;
  details?: {
    heading: string;
    text: string;
  }[];
  badgeColor?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function ExpandableProfileCard({
  id,
  imageSrc,
  stepNumber,
  title,
  subtitle,
  description,
  details,
  badgeColor = "bg-primary text-primary-foreground",
  icon: Icon,
  ctaText,
  onCtaClick,
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = `expandable-step-card-${id || title.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        className="group relative h-96 w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-foreground bg-background shadow-toy transition-shadow duration-300 hover:shadow-toy-hover"
        whileHover="hover"
      >
        {/* Background Image with Hover Scale */}
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageSrc}
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
          variants={{
            hover: { scale: 1.06 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

        {/* Step Badge */}
        {stepNumber && (
          <div
            className={`absolute top-4 left-4 z-10 grid h-14 w-14 -rotate-6 place-items-center rounded-2xl border-2 border-foreground font-display text-2xl font-bold shadow-toy-sm transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105 ${badgeColor}`}
          >
            {stepNumber}
          </div>
        )}

        {/* Icon Floating Badge */}
        {Icon && (
          <div className="absolute top-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-xl border-2 border-foreground bg-background/90 text-foreground backdrop-blur-sm shadow-toy-xs transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-5 w-5" strokeWidth={2.5} />
          </div>
        )}

        {/* Card Bottom Meta */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white transition-transform duration-300 group-hover:-translate-y-1">
          {subtitle && (
            <motion.p
              layoutId={`subtitle-${layoutId}`}
              className="mb-1.5 font-display text-xs font-bold tracking-widest uppercase text-primary-foreground/90"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.h3
            layoutId={`title-${layoutId}`}
            className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl"
          >
            {title}
          </motion.h3>
          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-200/90 font-medium leading-relaxed">
              {description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white/90 group-hover:text-white">
            <span>Explore step</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>

      {/* Expanded Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              layoutId={layoutId}
              className="relative z-10 flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-toy-lg md:flex-row"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-background text-foreground shadow-toy-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>

              {/* Left/Top Image Panel */}
              <div className="relative h-64 w-full shrink-0 overflow-hidden md:h-full md:w-1/2">
                <motion.img
                  layoutId={`image-${layoutId}`}
                  src={imageSrc}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:hidden" />
                {stepNumber && (
                  <div
                    className={`absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-2xl border-2 border-foreground font-display text-2xl font-bold shadow-toy-sm ${badgeColor}`}
                  >
                    {stepNumber}
                  </div>
                )}
              </div>

              {/* Right/Bottom Content Panel */}
              <div className="flex h-full w-full flex-col overflow-y-auto p-6 sm:p-8 md:w-1/2">
                {subtitle && (
                  <motion.p
                    layoutId={`subtitle-${layoutId}`}
                    className="mb-2 font-display text-xs font-bold tracking-widest uppercase text-muted-foreground"
                  >
                    {subtitle}
                  </motion.p>
                )}
                <motion.h3
                  layoutId={`title-${layoutId}`}
                  className="mb-4 border-b-2 border-border pb-4 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                >
                  {title}
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground grow"
                >
                  {description && (
                    <p className="text-base font-medium text-foreground">{description}</p>
                  )}

                  {details && details.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {details.map((item, idx) => (
                        <div key={idx} className="rounded-2xl border border-border bg-muted/40 p-4">
                          <h4 className="font-display text-sm font-bold text-foreground mb-1">
                            {item.heading}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onCtaClick?.();
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-6 py-3 font-display text-sm font-bold text-primary-foreground shadow-toy-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{ctaText || "Try this step"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
