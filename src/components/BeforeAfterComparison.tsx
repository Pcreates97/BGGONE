import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  beforeUrl: string;
  afterUrl: string;
}

export function BeforeAfterComparison({ beforeUrl, afterUrl }: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    setContainerWidth(ref.current.clientWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const move = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-xl select-none overflow-hidden rounded-2xl border-2 border-foreground shadow-toy"
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* AFTER (base, checker + processed) */}
      <div className="relative w-full bg-checker">
        <img src={afterUrl} alt="after" className="block max-h-[380px] w-full object-contain" />
        <span className="absolute right-3 top-3 rounded-full border border-foreground bg-secondary px-3 py-1 text-xs font-bold uppercase">
          After ✨
        </span>
      </div>
      {/* BEFORE (clipped overlay) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={beforeUrl}
          alt="before"
          className="block h-full w-auto max-w-none object-contain"
          style={{ width: containerWidth ? `${containerWidth}px` : "100%" }}
        />
        <span className="absolute left-3 top-3 rounded-full border border-foreground bg-background px-3 py-1 text-xs font-bold uppercase">
          Before
        </span>
      </div>
      {/* handle */}
      <div
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
        onMouseDown={(e) => move(e.clientX)}
        className="absolute inset-y-0 z-10 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-foreground" />
        <div className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground shadow-toy-sm">
          <span className="text-xs font-bold">↔</span>
        </div>
      </div>
    </div>
  );
}
