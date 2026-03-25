"use client";

import { useState } from "react";
import { StrengthSet, CardioEntry, WorkoutExercise } from "@/lib/types";
import { generateId } from "@/lib/utils";
import ScrollPicker from "./ScrollPicker";

interface Props {
  exercise: WorkoutExercise;
  onUpdate: (exercise: WorkoutExercise) => void;
  onRemove: () => void;
}

const WEIGHT_VALUES = Array.from({ length: 121 }, (_, i) => i * 5); // 0 to 600 in 5lb steps
const REP_VALUES = Array.from({ length: 31 }, (_, i) => i); // 0 to 30

export default function SetLogger({ exercise, onUpdate, onRemove }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const lastSet = exercise.sets?.[exercise.sets.length - 1];
  const [pickerWeight, setPickerWeight] = useState(lastSet?.weight ?? 135);
  const [pickerReps, setPickerReps] = useState(lastSet?.reps ?? 10);

  const isStrength = exercise.exerciseType === "strength";

  function addSetFromPicker() {
    const newSet: StrengthSet = {
      id: generateId(),
      reps: pickerReps,
      weight: pickerWeight,
      unit: lastSet?.unit ?? "lbs",
    };
    onUpdate({
      ...exercise,
      sets: [...(exercise.sets ?? []), newSet],
    });
    setShowPicker(false);
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

  // Group identical sets for compact display: "3 × 135 lbs × 10"
  function groupSets(sets: StrengthSet[]): { weight: number; reps: number; unit: string; count: number; ids: string[] }[] {
    const groups: { weight: number; reps: number; unit: string; count: number; ids: string[] }[] = [];
    for (const set of sets) {
      const last = groups[groups.length - 1];
      if (last && last.weight === set.weight && last.reps === set.reps && last.unit === set.unit) {
        last.count++;
        last.ids.push(set.id);
      } else {
        groups.push({ weight: set.weight, reps: set.reps, unit: set.unit, count: 1, ids: [set.id] });
      }
    }
    return groups;
  }

  const totalSets = exercise.sets?.length ?? 0;
  const bestWeight = exercise.sets && exercise.sets.length > 0
    ? Math.max(...exercise.sets.map((s) => s.weight))
    : 0;
  const bestSet = exercise.sets?.find((s) => s.weight === bestWeight);

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
            {isStrength ? totalSets : "C"}
          </span>
          <div>
            <p className="font-semibold text-sm">{exercise.exerciseName}</p>
            {isStrength && bestSet && bestWeight > 0 && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Best: {bestWeight} lbs × {bestSet.reps}
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
              {/* Compact set display */}
              {exercise.sets && exercise.sets.length > 0 && (
                <div className="flex flex-col gap-1.5 mb-3">
                  {groupSets(exercise.sets).map((group, gi) => (
                    <div
                      key={gi}
                      className="flex items-center justify-between px-3 py-2 rounded-xl"
                      style={{ background: "var(--bg-input)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: "var(--accent)", minWidth: 20 }}>
                          {group.count > 1 ? `${group.count}×` : `${exercise.sets!.indexOf(exercise.sets!.find(s => s.id === group.ids[0])!) + 1}.`}
                        </span>
                        <span className="text-sm font-semibold">
                          {group.weight} <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>{group.unit}</span>
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>×</span>
                        <span className="text-sm font-semibold">
                          {group.reps} <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>reps</span>
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          // Remove the last set in this group
                          removeSet(group.ids[group.ids.length - 1]);
                        }}
                        className="p-1 rounded"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Scroll picker for adding sets */}
              {showPicker ? (
                <div className="rounded-xl p-4" style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
                  <div className="flex justify-center gap-6 mb-4">
                    <ScrollPicker
                      values={WEIGHT_VALUES}
                      selected={pickerWeight}
                      onChange={setPickerWeight}
                      label="WEIGHT"
                      suffix="lbs"
                    />
                    <div className="flex items-center pt-5" style={{ color: "var(--text-muted)" }}>
                      <span className="text-xl font-bold">×</span>
                    </div>
                    <ScrollPicker
                      values={REP_VALUES}
                      selected={pickerReps}
                      onChange={setPickerReps}
                      label="REPS"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPicker(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold active:opacity-80"
                      style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addSetFromPicker}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white active:opacity-80"
                      style={{ background: "var(--accent)" }}
                    >
                      Add Set
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    // Pre-populate from last set
                    if (lastSet) {
                      setPickerWeight(lastSet.weight);
                      setPickerReps(lastSet.reps);
                    }
                    setShowPicker(true);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors active:opacity-80"
                  style={{ background: "rgba(59,130,246,0.1)", color: "var(--accent)" }}
                >
                  + Add Set
                </button>
              )}
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
