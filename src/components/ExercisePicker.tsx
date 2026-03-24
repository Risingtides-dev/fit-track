"use client";

import { useState, useEffect, useMemo } from "react";
import { Exercise, MuscleGroup } from "@/lib/types";
import { getExercises } from "@/lib/db";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "legs", "glutes", "core", "cardio",
];

interface Props {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

export default function ExercisePicker({ onSelect, onClose }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || ex.muscleGroup === filter;
      return matchesSearch && matchesFilter;
    });
  }, [exercises, search, filter]);

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
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase"
                  style={{
                    background: ex.type === "strength" ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
                    color: ex.type === "strength" ? "var(--accent)" : "var(--success)",
                  }}
                >
                  {ex.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
