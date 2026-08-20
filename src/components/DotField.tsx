import { useEffect, useRef } from "react";

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  className?: string;
  dotColor?: string;
}

export function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  className = "",
  dotColor = "#000000",
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement || canvas;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resize();

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = dotColor;

      const cols = Math.floor(width / dotSpacing) + 2;
      const rows = Math.floor(height / dotSpacing) + 2;

      const startX = (width - (cols - 1) * dotSpacing) / 2;
      const startY = (height - (rows - 1) * dotSpacing) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = startX + i * dotSpacing;
          const originY = startY + j * dotSpacing;

          let renderX = originX;
          let renderY = originY;
          let currentRadius = dotRadius;
          let alpha = 0.25;

          if (waveAmplitude > 0) {
            renderY += Math.sin(time * 2 + originX * 0.05 + originY * 0.05) * waveAmplitude;
          }

          const dx = mouseX - originX;
          const dy = mouseY - originY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorRadius) {
            const factor = 1 - dist / cursorRadius;
            const easeFactor = Math.pow(factor, 2);

            if (bulgeOnly) {
              const angle = Math.atan2(dy, dx);
              const push = easeFactor * bulgeStrength * cursorForce * 3;
              renderX -= Math.cos(angle) * push;
              renderY -= Math.sin(angle) * push;
            }

            if (glowRadius > 0 && dist < glowRadius) {
              const glowFactor = 1 - dist / glowRadius;
              currentRadius = dotRadius + glowFactor * 1.5;
              alpha = 0.25 + glowFactor * 0.55;
            }
          }

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    glowRadius,
    sparkle,
    waveAmplitude,
    dotColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
