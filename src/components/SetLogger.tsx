"use client";

import { useState } from "react";
import { StrengthSet, CardioEntry, WorkoutExercise } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface Props {
  exercise: WorkoutExercise;
  onUpdate: (exercise: WorkoutExercise) => void;
  onRemove: () => void;
}

export default function SetLogger({ exercise, onUpdate, onRemove }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const isStrength = exercise.exerciseType === "strength";

  function addSet() {
    const lastSet = exercise.sets?.[exercise.sets.length - 1];
    const newSet: StrengthSet = {
      id: generateId(),
      reps: lastSet?.reps ?? 10,
      weight: lastSet?.weight ?? 0,
      unit: lastSet?.unit ?? "lbs",
    };
    onUpdate({
      ...exercise,
      sets: [...(exercise.sets ?? []), newSet],
    });
  }

  function updateSet(setId: string, updates: Partial<StrengthSet>) {
    onUpdate({
      ...exercise,
      sets: exercise.sets?.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
    });
  }

  function removeSet(setId: string) {
    onUpdate({
      ...exercise,
      sets: exercise.sets?.filter((s) => s.id !== setId),
    });
  }

  function updateCardio(updates: Partial<CardioEntry>) {
    onUpdate({
      ...exercise,
      cardio: exercise.cardio ? { ...exercise.cardio, ...updates } : undefined,
    });
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer active:opacity-80"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              background: isStrength ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
              color: isStrength ? "var(--accent)" : "var(--success)",
            }}
          >
            {isStrength ? (exercise.sets?.length ?? 0) : "C"}
          </span>
          <div>
            <p className="font-semibold text-sm">{exercise.exerciseName}</p>
            {isStrength && exercise.sets && exercise.sets.length > 0 && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Best: {Math.max(...exercise.sets.map((s) => s.weight))} lbs × {exercise.sets.find((s) => s.weight === Math.max(...exercise.sets!.map((s2) => s2.weight)))?.reps}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--danger)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 transition-transform"
            style={{
              color: "var(--text-muted)",
              transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {isStrength ? (
            <>
              {/* Sets header */}
              {exercise.sets && exercise.sets.length > 0 && (
                <div className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 mb-2 px-1">
                  <span className="text-[10px] font-medium text-center" style={{ color: "var(--text-muted)" }}>SET</span>
                  <span className="text-[10px] font-medium text-center" style={{ color: "var(--text-muted)" }}>WEIGHT</span>
                  <span className="text-[10px] font-medium text-center" style={{ color: "var(--text-muted)" }}>REPS</span>
                  <span></span>
                </div>
              )}

              {/* Sets */}
              <div className="flex flex-col gap-2">
                {exercise.sets?.map((set, idx) => (
                  <div key={set.id} className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 items-center">
                    <span className="text-sm font-bold text-center" style={{ color: "var(--text-muted)" }}>{idx + 1}</span>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={set.weight || ""}
                        onChange={(e) => updateSet(set.id, { weight: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full px-3 py-2.5 rounded-xl text-center text-sm font-medium outline-none"
                        style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {set.unit}
                      </span>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps || ""}
                      onChange={(e) => updateSet(set.id, { reps: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-xl text-center text-sm font-medium outline-none"
                      style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                    />
                    <button
                      onClick={() => removeSet(set.id)}
                      className="p-1 rounded"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add set button */}
              <button
                onClick={addSet}
                className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition-colors active:opacity-80"
                style={{ background: "rgba(59,130,246,0.1)", color: "var(--accent)" }}
              >
                + Add Set
              </button>
            </>
          ) : (
            /* Cardio */
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>DURATION (min)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={exercise.cardio?.duration || ""}
                    onChange={(e) => updateCardio({ duration: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>DISTANCE (mi)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={exercise.cardio?.distance || ""}
                    onChange={(e) => updateCardio({ distance: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>CALORIES</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={exercise.cardio?.calories || ""}
                    onChange={(e) => updateCardio({ calories: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>AVG HR (bpm)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={exercise.cardio?.avgHeartRate || ""}
                    onChange={(e) => updateCardio({ avgHeartRate: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
