"use client";

import { useState, useEffect } from "react";
import { StrengthSet, CardioEntry, WorkoutExercise } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface Props {
  exercise: WorkoutExercise;
  onUpdate: (exercise: WorkoutExercise) => void;
  onRemove: () => void;
}

export default function SetLogger({ exercise, onUpdate, onRemove }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [justLogged, setJustLogged] = useState(false);
  const isStrength = exercise.exerciseType === "strength";
  const lastSet = exercise.sets?.[exercise.sets.length - 1];
  const [weight, setWeight] = useState(lastSet?.weight ?? 135);
  const [reps, setReps] = useState(lastSet?.reps ?? 10);

  // Sync weight/reps when new sets are added externally
  useEffect(() => {
    if (lastSet) {
      setWeight(lastSet.weight);
      setReps(lastSet.reps);
    }
  }, [exercise.sets?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function logSet() {
    const newSet: StrengthSet = {
      id: generateId(),
      reps,
      weight,
      unit: lastSet?.unit ?? "lbs",
    };
    onUpdate({
      ...exercise,
      sets: [...(exercise.sets ?? []), newSet],
    });
    // Flash feedback
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 400);
  }

  function removeLastSet() {
    if (!exercise.sets?.length) return;
    onUpdate({
      ...exercise,
      sets: exercise.sets.slice(0, -1),
    });
  }

  function updateCardio(updates: Partial<CardioEntry>) {
    onUpdate({
      ...exercise,
      cardio: exercise.cardio ? { ...exercise.cardio, ...updates } : undefined,
    });
  }

  const totalSets = exercise.sets?.length ?? 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: justLogged ? "1.5px solid var(--success)" : "1px solid var(--border)",
        transition: "border-color 0.3s",
      }}
    >
      {/* Header - tap to collapse */}
      <div
        className="flex items-center justify-between px-4 py-3 active:opacity-70"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
            style={{
              background: isStrength ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
              color: isStrength ? "var(--accent)" : "var(--success)",
            }}
          >
            {isStrength ? totalSets : "C"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base truncate">{exercise.exerciseName}</p>
            {isStrength && totalSets > 0 && (
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {exercise.sets!.map((s, i) => (
                  <span
                    key={s.id}
                    className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(59,130,246,0.12)", color: "var(--accent)" }}
                  >
                    {s.weight}×{s.reps}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="w-5 h-5 shrink-0 ml-2 transition-transform"
          style={{
            color: "var(--text-muted)",
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
          }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Control panel */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {isStrength ? (
            <div className="flex flex-col gap-3">
              {/* Weight + Reps steppers side by side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Weight stepper */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>WEIGHT</span>
                  <button
                    onClick={() => setWeight((w) => Math.min(w + 5, 995))}
                    className="w-full h-14 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ background: "rgba(59,130,246,0.1)", color: "var(--accent)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-7 h-7">
                      <path d="M12 19V5m-7 7h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="flex items-baseline gap-1 py-3">
                    <span className="text-4xl font-black tabular-nums">{weight}</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>lbs</span>
                  </div>
                  <button
                    onClick={() => setWeight((w) => Math.max(w - 5, 0))}
                    className="w-full h-14 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-7 h-7">
                      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Reps stepper */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>REPS</span>
                  <button
                    onClick={() => setReps((r) => Math.min(r + 1, 99))}
                    className="w-full h-14 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ background: "rgba(59,130,246,0.1)", color: "var(--accent)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-7 h-7">
                      <path d="M12 19V5m-7 7h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="flex items-baseline gap-1 py-3">
                    <span className="text-4xl font-black tabular-nums">{reps}</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>reps</span>
                  </div>
                  <button
                    onClick={() => setReps((r) => Math.max(r - 1, 0))}
                    className="w-full h-14 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-7 h-7">
                      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* LOG SET button */}
              <button
                onClick={logSet}
                className="w-full h-14 rounded-xl font-black text-lg text-white active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
                style={{ background: "var(--accent)" }}
              >
                LOG SET
                {totalSets > 0 && (
                  <span className="text-sm font-semibold opacity-70">#{totalSets + 1}</span>
                )}
              </button>

              {/* Undo / Remove row */}
              <div className="flex items-center justify-between">
                {totalSets > 0 ? (
                  <button
                    onClick={removeLastSet}
                    className="text-xs font-semibold px-3 py-2 rounded-lg active:scale-95 transition-transform"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Undo last set
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={onRemove}
                  className="text-xs font-semibold px-3 py-2 rounded-lg active:scale-95 transition-transform"
                  style={{ color: "var(--danger)" }}
                >
                  Remove exercise
                </button>
              </div>
            </div>
          ) : (
            /* Cardio — big input tiles */
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>DURATION</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={exercise.cardio?.duration || ""}
                      onChange={(e) => updateCardio({ duration: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-4 py-4 rounded-xl text-2xl font-bold text-center outline-none"
                      style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                    />
                    <span className="absolute right-3 bottom-2 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>min</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>DISTANCE</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={exercise.cardio?.distance || ""}
                      onChange={(e) => updateCardio({ distance: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-4 py-4 rounded-xl text-2xl font-bold text-center outline-none"
                      style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                    />
                    <span className="absolute right-3 bottom-2 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>mi</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>CALORIES</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={exercise.cardio?.calories || ""}
                    onChange={(e) => updateCardio({ calories: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-4 rounded-xl text-2xl font-bold text-center outline-none"
                    style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>AVG HR</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={exercise.cardio?.avgHeartRate || ""}
                      onChange={(e) => updateCardio({ avgHeartRate: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-4 py-4 rounded-xl text-2xl font-bold text-center outline-none"
                      style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                    />
                    <span className="absolute right-3 bottom-2 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>bpm</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onRemove}
                className="text-xs font-semibold px-3 py-2 rounded-lg active:scale-95 transition-transform self-end"
                style={{ color: "var(--danger)" }}
              >
                Remove exercise
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
