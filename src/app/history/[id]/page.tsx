"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getWorkout } from "@/lib/db";
import { Workout } from "@/lib/types";
import { formatDate, formatDateTime, getDuration, getEstimated1RM } from "@/lib/utils";

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
          <p className="text-xl font-bold">
            {workout.exercises.reduce(
              (sum, e) => sum + (e.sets?.reduce((s, set) => s + set.weight * set.reps, 0) ?? 0),
              0
            ).toLocaleString()}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>VOLUME (lbs)</p>
        </div>
      </div>

      {/* Exercises */}
      <div className="px-5 flex flex-col gap-4">
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
              <p className="font-semibold">{ex.exerciseName}</p>
            </div>

            {ex.exerciseType === "strength" && ex.sets && ex.sets.length > 0 ? (
              <div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>SET</span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>WEIGHT</span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>REPS</span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>EST 1RM</span>
                </div>
                {ex.sets.map((set, si) => (
                  <div key={set.id} className="grid grid-cols-4 gap-2 py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{si + 1}</span>
                    <span className="text-sm font-medium">{set.weight} {set.unit}</span>
                    <span className="text-sm font-medium">{set.reps}</span>
                    <span className="text-sm" style={{ color: "var(--accent)" }}>
                      {set.weight > 0 ? getEstimated1RM(set.weight, set.reps) : "-"}
                    </span>
                  </div>
                ))}
              </div>
            ) : ex.cardio ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>DURATION</p>
                  <p className="text-sm font-medium">{ex.cardio.duration} min</p>
                </div>
                {ex.cardio.distance ? (
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>DISTANCE</p>
                    <p className="text-sm font-medium">{ex.cardio.distance} {ex.cardio.distanceUnit ?? "mi"}</p>
                  </div>
                ) : null}
                {ex.cardio.calories ? (
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>CALORIES</p>
                    <p className="text-sm font-medium">{ex.cardio.calories}</p>
                  </div>
                ) : null}
                {ex.cardio.avgHeartRate ? (
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>AVG HR</p>
                    <p className="text-sm font-medium">{ex.cardio.avgHeartRate} bpm</p>
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
