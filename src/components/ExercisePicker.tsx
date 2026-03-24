"use client";

import { useState, useEffect, useMemo } from "react";
import { Exercise, MuscleGroup, WorkoutCategory } from "@/lib/types";
import { getExercises } from "@/lib/db";
import { CATEGORY_CONFIG } from "@/lib/utils";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "legs", "glutes", "core", "cardio",
];

// "upper" means push + pull
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

  const activeLabels = categoryFilters?.map((c) => CATEGORY_CONFIG[c].label).join(" + ");

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={onClose}
          className="p-2 rounded-lg"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="flex-1 px-4 py-2.5 rounded-xl outline-none"
          style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
        />
      </div>

      {/* Category notice + show all toggle */}
      {categoryFilters && categoryFilters.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categoryFilters.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap shrink-0"
                style={{
                  background: CATEGORY_CONFIG[cat].bg,
                  color: CATEGORY_CONFIG[cat].color,
                }}
              >
                {CATEGORY_CONFIG[cat].label}
              </span>
            ))}
            <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
              {showAll ? "— showing all" : ""}
            </span>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium px-3 py-1 rounded-full shrink-0 ml-2"
            style={{
              background: showAll ? "var(--accent)" : "var(--bg-card)",
              color: showAll ? "white" : "var(--text-secondary)",
            }}
          >
            {showAll ? "Filter" : "Show All"}
          </button>
        </div>
      )}

      {/* Muscle group filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter("all")}
          className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0"
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
            className="px-3 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap shrink-0"
            style={{
              background: filter === mg ? "var(--accent)" : "var(--bg-card)",
              color: filter === mg ? "white" : "var(--text-secondary)",
            }}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
            No exercises found
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onSelect(ex)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors active:opacity-80"
                style={{ background: "var(--bg-card)" }}
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{ex.name}</p>
                  <p className="text-xs capitalize mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {ex.muscleGroup} {ex.isCustom ? "• Custom" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: CATEGORY_CONFIG[ex.category].bg,
                      color: CATEGORY_CONFIG[ex.category].color,
                    }}
                  >
                    {CATEGORY_CONFIG[ex.category].label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
