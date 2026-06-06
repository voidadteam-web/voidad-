"use client";

import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HorizontalScrollStripProps = {
  children: React.ReactNode;
  className?: string;
  scrollClassName?: string;
  hint?: string;
};

/** Horizontal scroll row with left/right controls */
export function HorizontalScrollStrip({
  children,
  className,
  scrollClassName,
  hint,
}: HorizontalScrollStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(280, el.clientWidth * 0.75);
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => scrollBy("left")}
        className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-void-green/40 bg-void-black/80 text-void-green shadow-[0_0_12px_rgba(0,255,153,0.2)] transition hover:border-void-green/70 hover:bg-void-black"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy("right")}
        className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-void-green/40 bg-void-black/80 text-void-green shadow-[0_0_12px_rgba(0,255,153,0.2)] transition hover:border-void-green/70 hover:bg-void-black"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute inset-y-0 left-10 z-10 w-10 bg-gradient-to-r from-void-black/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-10 z-10 w-10 bg-gradient-to-l from-void-black/90 to-transparent" />

      <div
        ref={scrollerRef}
        className={cn(
          "flex items-end gap-2 overflow-x-auto overflow-y-visible scroll-smooth px-11 py-4 pb-3 sm:gap-3",
          "snap-x snap-mandatory [scrollbar-width:thin]",
          scrollClassName,
        )}
      >
        {children}
      </div>

      {hint ? (
        <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-void-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
