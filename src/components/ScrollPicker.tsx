"use client";

import { useRef, useEffect, useCallback } from "react";

interface Props {
  values: number[];
  selected: number;
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

export default function ScrollPicker({ values, selected, onChange, label, suffix }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const velocityRef = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const animationRef = useRef<number>(0);
  const isUserScrolling = useRef(false);

  const selectedIndex = values.indexOf(selected);

  const snapToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clampedIndex = Math.max(0, Math.min(values.length - 1, index));
    const targetScroll = clampedIndex * ITEM_HEIGHT;
    container.scrollTo({ top: targetScroll, behavior: "smooth" });
    if (values[clampedIndex] !== selected) {
      onChange(values[clampedIndex]);
    }
  }, [values, selected, onChange]);

  // Initial scroll to selected value
  useEffect(() => {
    const container = containerRef.current;
    if (!container || selectedIndex < 0) return;
    container.scrollTop = selectedIndex * ITEM_HEIGHT;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, index));
    if (values[clampedIndex] !== selected) {
      onChange(values[clampedIndex]);
    }
  }, [values, selected, onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleScroll();
        // Snap after scroll ends
        const index = Math.round(container.scrollTop / ITEM_HEIGHT);
        const targetScroll = index * ITEM_HEIGHT;
        if (Math.abs(container.scrollTop - targetScroll) > 1) {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }, 80);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  const containerHeight = VISIBLE_ITEMS * ITEM_HEIGHT;
  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div className="flex flex-col items-center">
      {label && (
        <p className="text-[10px] font-semibold mb-1.5 tracking-wider" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      )}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          height: containerHeight,
          width: 100,
        }}
      >
        {/* Selection highlight */}
        <div
          className="absolute left-1 right-1 rounded-lg pointer-events-none z-10"
          style={{
            top: paddingItems * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
            background: "rgba(59,130,246,0.12)",
            border: "1.5px solid rgba(59,130,246,0.3)",
          }}
        />
        {/* Fade edges */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-20"
          style={{
            height: paddingItems * ITEM_HEIGHT,
            background: "linear-gradient(to bottom, var(--bg-card), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none z-20"
          style={{
            height: paddingItems * ITEM_HEIGHT,
            background: "linear-gradient(to top, var(--bg-card), transparent)",
          }}
        />
        {/* Scrollable list */}
        <div
          ref={containerRef}
          className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
          style={{
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Top padding */}
          <div style={{ height: paddingItems * ITEM_HEIGHT }} />
          {values.map((val, i) => {
            const isSelected = val === selected;
            return (
              <div
                key={i}
                className="flex items-center justify-center snap-center cursor-pointer"
                style={{
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: "center",
                }}
                onClick={() => snapToIndex(i)}
              >
                <span
                  className="text-lg font-bold transition-all"
                  style={{
                    color: isSelected ? "var(--text-primary)" : "var(--text-muted)",
                    opacity: isSelected ? 1 : 0.4,
                    fontSize: isSelected ? "20px" : "15px",
                  }}
                >
                  {val}{suffix ? <span className="text-xs font-medium ml-0.5">{suffix}</span> : null}
                </span>
              </div>
            );
          })}
          {/* Bottom padding */}
          <div style={{ height: paddingItems * ITEM_HEIGHT }} />
        </div>
      </div>
    </div>
  );
}
