"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { getExercises, addCustomExercise, deleteCustomExercise } from "@/lib/db";
import { Exercise, ExerciseType, MuscleGroup, WorkoutCategory } from "@/lib/types";
import { generateId, CATEGORY_CONFIG } from "@/lib/utils";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "legs", "glutes", "core", "cardio",
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");

  // New exercise form
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ExerciseType>("strength");
  const [newMuscle, setNewMuscle] = useState<MuscleGroup>("chest");
  const [newCategory, setNewCategory] = useState<WorkoutCategory>("push");

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || ex.muscleGroup === filter;
    return matchesSearch && matchesFilter;
  });

  async function handleAdd() {
    if (!newName.trim()) return;
    const exercise: Exercise = {
      id: generateId(),
      name: newName.trim(),
      type: newType,
      muscleGroup: newMuscle,
      category: newType === "cardio" ? "cardio" : newCategory,
      isCustom: true,
    };
    await addCustomExercise(exercise);
    setExercises((prev) => [...prev, exercise]);
    setNewName("");
    setShowAdd(false);
  }

  async function handleDelete(id: string) {
    await deleteCustomExercise(id);
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Exercises</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {exercises.length} exercises available
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold active:opacity-80"
            style={{ background: "var(--accent)", color: "white" }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Search & filter */}
      <div className="px-5 mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl outline-none text-sm mb-3"
          style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter("all")}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
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
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap shrink-0"
              style={{
                background: filter === mg ? "var(--accent)" : "var(--bg-card)",
                color: filter === mg ? "white" : "var(--text-secondary)",
              }}
            >
              {mg}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="px-5 flex flex-col gap-1.5">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "var(--bg-card)" }}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{ex.name}</p>
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
              <p className="text-xs capitalize mt-0.5" style={{ color: "var(--text-muted)" }}>
                {ex.muscleGroup} &bull; {ex.type}
                {ex.isCustom ? " • Custom" : ""}
              </p>
            </div>
            {ex.isCustom && (
              <button
                onClick={() => handleDelete(ex.id)}
                className="p-1.5 rounded-lg"
                style={{ color: "var(--danger)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add exercise modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6" style={{ background: "var(--bg-secondary)" }}>
            <h2 className="text-lg font-bold mb-4">Add Custom Exercise</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>NAME</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Exercise name"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                  style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>TYPE</label>
                <div className="flex gap-2">
                  {(["strength", "cardio"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setNewType(t);
                        if (t === "cardio") setNewMuscle("cardio");
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize"
                      style={{
                        background: newType === t ? "var(--accent)" : "var(--bg-card)",
                        color: newType === t ? "white" : "var(--text-secondary)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {newType === "strength" && (
                <>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>MUSCLE GROUP</label>
                    <div className="flex flex-wrap gap-2">
                      {MUSCLE_GROUPS.filter((mg) => mg !== "cardio").map((mg) => (
                        <button
                          key={mg}
                          onClick={() => setNewMuscle(mg)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
                          style={{
                            background: newMuscle === mg ? "var(--accent)" : "var(--bg-card)",
                            color: newMuscle === mg ? "white" : "var(--text-secondary)",
                          }}
                        >
                          {mg}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>CATEGORY</label>
                    <div className="flex flex-wrap gap-2">
                      {(["push", "pull", "legs", "core"] as WorkoutCategory[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewCategory(cat)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: newCategory === cat ? CATEGORY_CONFIG[cat].bg : "var(--bg-card)",
                            color: newCategory === cat ? CATEGORY_CONFIG[cat].color : "var(--text-secondary)",
                            border: newCategory === cat ? `1px solid ${CATEGORY_CONFIG[cat].color}` : "1px solid transparent",
                          }}
                        >
                          {CATEGORY_CONFIG[cat].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: "var(--accent)" }}
                >
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
