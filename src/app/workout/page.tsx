"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import ExercisePicker from "@/components/ExercisePicker";
import SetLogger from "@/components/SetLogger";
import WorkoutTimer from "@/components/WorkoutTimer";
import { Workout, WorkoutExercise, Exercise } from "@/lib/types";
import { saveWorkout, getWorkout } from "@/lib/db";
import { generateId, todayISO } from "@/lib/utils";

const ACTIVE_WORKOUT_KEY = "fittrack_active_workout";

export default function WorkoutPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  // Load or check for active workout
  useEffect(() => {
    const activeId = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (activeId) {
      getWorkout(activeId).then((w) => {
        if (w && !w.endTime) setWorkout(w);
        else localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      });
    }
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (workout) {
      saveWorkout(workout);
    }
  }, [workout]);

  function startWorkout() {
    const now = new Date().toISOString();
    const w: Workout = {
      id: generateId(),
      date: todayISO(),
      startTime: now,
      name: getDayName(),
      exercises: [],
    };
    setWorkout(w);
    localStorage.setItem(ACTIVE_WORKOUT_KEY, w.id);
  }

  function getDayName(): string {
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return `${day} Workout`;
  }

  function addExercise(exercise: Exercise) {
    if (!workout) return;
    const workoutExercise: WorkoutExercise = {
      id: generateId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseType: exercise.type,
      sets: exercise.type === "strength" ? [] : undefined,
      cardio: exercise.type === "cardio" ? { id: generateId(), duration: 0 } : undefined,
      order: workout.exercises.length,
    };
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, workoutExercise],
    });
    setShowPicker(false);
  }

  function updateExercise(updated: WorkoutExercise) {
    if (!workout) return;
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((e) => (e.id === updated.id ? updated : e)),
    });
  }

  function removeExercise(id: string) {
    if (!workout) return;
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter((e) => e.id !== id),
    });
  }

  async function finishWorkout() {
    if (!workout) return;
    const finished = { ...workout, endTime: new Date().toISOString() };
    await saveWorkout(finished);
    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    setWorkout(null);
    setShowFinish(false);
    router.push(`/history/${finished.id}`);
  }

  function discardWorkout() {
    if (!workout) return;
    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    setWorkout(null);
    setShowFinish(false);
  }

  // No active workout - show start screen
  if (!workout) {
    return (
      <div className="min-h-screen pb-20 flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5} className="w-10 h-10">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Ready to train?</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Start a new workout to begin tracking your exercises, sets, and reps.
          </p>
          <button
            onClick={startWorkout}
            className="px-8 py-3.5 rounded-2xl font-semibold text-white active:opacity-80"
            style={{ background: "var(--accent)" }}
          >
            Start Workout
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <input
              type="text"
              value={workout.name}
              onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
              className="text-xl font-bold bg-transparent outline-none w-full"
              style={{ color: "var(--text-primary)" }}
            />
            <div className="flex items-center gap-3 mt-1">
              <WorkoutTimer startTime={workout.startTime} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowFinish(true)}
            className="px-4 py-2 rounded-xl font-semibold text-sm active:opacity-80"
            style={{ background: "var(--success)", color: "white" }}
          >
            Finish
          </button>
        </div>
      </div>

      {/* Exercises */}
      <div className="px-5 flex flex-col gap-3">
        {workout.exercises.map((ex) => (
          <SetLogger
            key={ex.id}
            exercise={ex}
            onUpdate={updateExercise}
            onRemove={() => removeExercise(ex.id)}
          />
        ))}

        {/* Add exercise button */}
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-4 rounded-2xl font-semibold text-sm active:opacity-80 flex items-center justify-center gap-2"
          style={{ background: "var(--bg-card)", border: "2px dashed var(--border)", color: "var(--text-secondary)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Exercise
        </button>
      </div>

      {/* Exercise picker */}
      {showPicker && <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />}

      {/* Finish modal */}
      {showFinish && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div
            className="w-full max-w-lg rounded-t-3xl p-6"
            style={{ background: "var(--bg-secondary)" }}
          >
            <h2 className="text-lg font-bold mb-4">Finish Workout?</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              {workout.exercises.length} exercises &bull;{" "}
              {workout.exercises.reduce((sum, e) => sum + (e.sets?.length ?? 0), 0)} sets logged
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={finishWorkout}
                className="w-full py-3.5 rounded-2xl font-semibold text-white active:opacity-80"
                style={{ background: "var(--success)" }}
              >
                Save & Finish
              </button>
              <button
                onClick={discardWorkout}
                className="w-full py-3.5 rounded-2xl font-semibold active:opacity-80"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}
              >
                Discard Workout
              </button>
              <button
                onClick={() => setShowFinish(false)}
                className="w-full py-3.5 rounded-2xl font-semibold active:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                Keep Training
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
