"use client";

import { useState, useEffect, useMemo } from "react";
import { Exercise, MuscleGroup, WorkoutCategory } from "@/lib/types";
import { getExercises } from "@/lib/db";
import { CATEGORY_CONFIG } from "@/lib/utils";
import { EXERCISE_GUIDES } from "@/lib/exerciseGuides";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "legs", "glutes", "core", "cardio",
];

function expandCategories(cats: WorkoutCategory[]): WorkoutCategory[] {
  const expanded = new Set(cats);
  if (expanded.has("upper")) {
    expanded.add("push");
    expanded.add("pull");
  }
  return Array.from(expanded);
}

interface Props {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  categoryFilters?: WorkoutCategory[];
}

export default function ExercisePicker({ onSelect, onClose, categoryFilters }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

  const expandedFilters = categoryFilters ? expandCategories(categoryFilters) : undefined;

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || ex.muscleGroup === filter;
      const matchesCategory = !expandedFilters || showAll || expandedFilters.includes(ex.category);
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [exercises, search, filter, expandedFilters, showAll]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header - close button + search */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="flex-1 px-4 py-3 rounded-xl outline-none text-base font-medium"
          style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
        />
      </div>

      {/* Category filter + show all */}
      {categoryFilters && categoryFilters.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categoryFilters.map((cat) => (
              <span
                key={cat}
                className="text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap shrink-0"
                style={{ background: CATEGORY_CONFIG[cat].bg, color: CATEGORY_CONFIG[cat].color }}
              >
                {CATEGORY_CONFIG[cat].label}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold px-4 py-1.5 rounded-full shrink-0 ml-2 active:scale-95 transition-transform"
            style={{
              background: showAll ? "var(--accent)" : "var(--bg-card)",
              color: showAll ? "white" : "var(--text-secondary)",
            }}
          >
            {showAll ? "Filter" : "Show All"}
          </button>
        </div>
      )}

      {/* Muscle group pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter("all")}
          className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 active:scale-95 transition-transform"
          style={{
            background: filter === "all" ? "var(--accent)" : "var(--bg-card)",
            color: filter === "all" ? "white" : "var(--text-secondary)",
          }}
        >
          All
        </button>
        {MUSCLE_GROUPS.map((mg) => (
          <button
            key={mg}
            onClick={() => setFilter(mg)}
            className="px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap shrink-0 active:scale-95 transition-transform"
            style={{
              background: filter === mg ? "var(--accent)" : "var(--bg-card)",
              color: filter === mg ? "white" : "var(--text-secondary)",
            }}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Exercise list - big touch targets */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <p className="text-center py-12 font-semibold" style={{ color: "var(--text-muted)" }}>
            No exercises found
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((ex) => {
              const guide = EXERCISE_GUIDES[ex.id];
              const isExpanded = expandedGuide === ex.id;

              return (
                <div key={ex.id} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)" }}>
                  <div className="flex items-center gap-3 px-4 py-4">
                    {/* Info button */}
                    {guide && (
                      <button
                        onClick={() => setExpandedGuide(isExpanded ? null : ex.id)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                        style={{
                          background: isExpanded ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                          color: isExpanded ? "var(--accent)" : "var(--text-muted)",
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4m0-4h.01" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}

                    {/* Exercise name - tap to select */}
                    <button
                      onClick={() => onSelect(ex)}
                      className="flex-1 text-left min-h-[44px] flex flex-col justify-center active:opacity-70"
                    >
                      <p className="font-bold text-base">{ex.name}</p>
                      <p className="text-xs capitalize mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {guide ? guide.primaryMuscles.slice(0, 3).join(" / ") : ex.muscleGroup}
                      </p>
                    </button>

                    {/* Category badge */}
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0"
                      style={{ background: CATEGORY_CONFIG[ex.category].bg, color: CATEGORY_CONFIG[ex.category].color }}
                    >
                      {CATEGORY_CONFIG[ex.category].label}
                    </span>
                  </div>

                  {/* Expandable guide */}
                  {isExpanded && guide && (
                    <div className="px-4 pb-4">
                      <div className="rounded-xl p-3.5" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
                        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                          {guide.description}
                        </p>
                        <p className="text-[10px] font-black tracking-widest mb-2" style={{ color: "var(--accent)" }}>HOW TO</p>
                        <div className="flex flex-col gap-2">
                          {guide.steps.map((step, i) => (
                            <div key={i} className="flex gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                              <span className="font-bold shrink-0" style={{ color: "var(--accent)" }}>{i + 1}</span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
