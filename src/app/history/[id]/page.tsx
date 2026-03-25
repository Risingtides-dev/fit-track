"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getWorkout } from "@/lib/db";
import { Workout, StrengthSet } from "@/lib/types";
import { formatDate, formatDateTime, getDuration, getEstimated1RM } from "@/lib/utils";

// Group consecutive identical sets for compact display
function groupSets(sets: StrengthSet[]): { weight: number; reps: number; unit: string; count: number }[] {
  const groups: { weight: number; reps: number; unit: string; count: number }[] = [];
  for (const set of sets) {
    const last = groups[groups.length - 1];
    if (last && last.weight === set.weight && last.reps === set.reps && last.unit === set.unit) {
      last.count++;
    } else {
      groups.push({ weight: set.weight, reps: set.reps, unit: set.unit, count: 1 });
    }
  }
  return groups;
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (params.id) {
      getWorkout(params.id as string).then((w) => setWorkout(w ?? null));
    }
  }, [params.id]);

  if (!workout) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        <BottomNav />
      </div>
    );
  }

  const totalVolume = workout.exercises.reduce(
    (sum, e) => sum + (e.sets?.reduce((s, set) => s + set.weight * set.reps, 0) ?? 0),
    0
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <button
          onClick={() => router.push("/history")}
          className="flex items-center gap-1 mb-3 text-sm"
          style={{ color: "var(--accent)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{formatDate(workout.date)}</span>
          <span>&bull;</span>
          <span>{formatDateTime(workout.startTime)}{workout.endTime ? ` - ${formatDateTime(workout.endTime)}` : ""}</span>
          <span>&bull;</span>
          <span>{getDuration(workout.startTime, workout.endTime)}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 px-5 mb-6">
        <div className="rounded-2xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>{workout.exercises.length}</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>EXERCISES</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-xl font-bold" style={{ color: "var(--success)" }}>
            {workout.exercises.reduce((sum, e) => sum + (e.sets?.length ?? 0), 0)}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>SETS</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-xl font-bold">{totalVolume.toLocaleString()}</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>VOLUME (lbs)</p>
        </div>
      </div>

      {/* Exercises - compact display */}
      <div className="px-5 flex flex-col gap-3">
        {workout.exercises.map((ex, idx) => (
          <div
            key={ex.id}
            className="rounded-2xl p-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: ex.exerciseType === "strength" ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
                  color: ex.exerciseType === "strength" ? "var(--accent)" : "var(--success)",
                }}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{ex.exerciseName}</p>
                {ex.exerciseType === "strength" && ex.sets && ex.sets.length > 0 && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {ex.sets.length} set{ex.sets.length !== 1 ? "s" : ""} &bull; Best 1RM: {
                      Math.max(...ex.sets.filter(s => s.weight > 0).map(s => getEstimated1RM(s.weight, s.reps)))
                    || "-"} lbs
                  </p>
                )}
              </div>
            </div>

            {ex.exerciseType === "strength" && ex.sets && ex.sets.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {groupSets(ex.sets).map((group, gi) => (
                  <div
                    key={gi}
                    className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: "var(--accent)", minWidth: 28 }}>
                        {group.count > 1 ? `${group.count} sets` : `Set ${gi + 1}`}
                      </span>
                      <span className="text-sm font-semibold">
                        {group.weight} <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>{group.unit}</span>
                        <span className="text-xs mx-1.5" style={{ color: "var(--text-muted)" }}>&times;</span>
                        {group.reps} <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>reps</span>
                      </span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                      {group.weight > 0 ? `~${getEstimated1RM(group.weight, group.reps)} 1RM` : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : ex.cardio ? (
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Duration</span>
                  <span className="text-sm font-semibold">{ex.cardio.duration} min</span>
                </div>
                {ex.cardio.distance ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Distance</span>
                    <span className="text-sm font-semibold">{ex.cardio.distance} {ex.cardio.distanceUnit ?? "mi"}</span>
                  </div>
                ) : null}
                {ex.cardio.calories ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Calories</span>
                    <span className="text-sm font-semibold">{ex.cardio.calories}</span>
                  </div>
                ) : null}
                {ex.cardio.avgHeartRate ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Avg HR</span>
                    <span className="text-sm font-semibold">{ex.cardio.avgHeartRate} bpm</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No sets logged</p>
            )}
          </div>
        ))}
      </div>

      {workout.notes && (
        <div className="px-5 mt-4">
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>NOTES</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{workout.notes}</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
