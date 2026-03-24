"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import ExercisePicker from "@/components/ExercisePicker";
import SetLogger from "@/components/SetLogger";
import WorkoutTimer from "@/components/WorkoutTimer";
import { Workout, WorkoutExercise, Exercise, WorkoutCategory } from "@/lib/types";
import { saveWorkout, getWorkout } from "@/lib/db";
import { generateId, todayISO, CATEGORY_CONFIG } from "@/lib/utils";

const ACTIVE_WORKOUT_KEY = "fittrack_active_workout";

const CATEGORY_OPTIONS: { value: WorkoutCategory; label: string; description: string }[] = [
  { value: "push", label: "Push", description: "Chest, shoulders, triceps" },
  { value: "pull", label: "Pull", description: "Back, biceps, rear delts" },
  { value: "legs", label: "Legs", description: "Quads, hamstrings, glutes, calves" },
  { value: "upper", label: "Upper", description: "Push + Pull combined" },
  { value: "core", label: "Core", description: "Abs, obliques" },
  { value: "cardio", label: "Cardio", description: "Running, cycling, etc." },
];

export default function WorkoutPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<WorkoutCategory[]>([]);

  useEffect(() => {
    const activeId = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (activeId) {
      getWorkout(activeId).then((w) => {
        if (w && !w.endTime) setWorkout(w);
        else localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      });
    }
  }, []);

  useEffect(() => {
    if (workout) {
      saveWorkout(workout);
    }
  }, [workout]);

  function toggleCategory(cat: WorkoutCategory) {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      // If selecting "upper", remove push/pull since upper includes them
      if (cat === "upper") return [...prev.filter((c) => c !== "push" && c !== "pull"), cat];
      // If selecting push or pull while upper is selected, remove upper and add both individually
      if ((cat === "push" || cat === "pull") && prev.includes("upper")) {
        const other = cat === "push" ? "pull" : "push";
        return [...prev.filter((c) => c !== "upper"), other, cat];
      }
      return [...prev, cat];
    });
  }

  function getWorkoutName(): string {
    if (selectedCategories.length === 0) {
      const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
      return `${day} Workout`;
    }
    const labels = selectedCategories.map((c) => CATEGORY_CONFIG[c].label);
    return labels.join(" + ") + " Day";
  }

  function startWorkout() {
    const now = new Date().toISOString();
    const w: Workout = {
      id: generateId(),
      date: todayISO(),
      startTime: now,
      name: getWorkoutName(),
      category: selectedCategories.length === 1 ? selectedCategories[0] : "custom",
      exercises: [],
    };
    setWorkout(w);
    localStorage.setItem(ACTIVE_WORKOUT_KEY, w.id);
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

  // No active workout — show category picker + start screen
  if (!workout) {
    return (
      <div className="min-h-screen pb-20">
        <div className="px-5 pt-12 pb-6">
          <h1 className="text-2xl font-bold">New Workout</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Pick your focus, or just start and add any exercises
          </p>
        </div>

        {/* Category selector */}
        <div className="px-5 mb-6">
          <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>WORKOUT TYPE</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORY_OPTIONS.map((opt) => {
              const isSelected = selectedCategories.includes(opt.value);
              const cfg = CATEGORY_CONFIG[opt.value];
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleCategory(opt.value)}
                  className="rounded-2xl p-4 text-left active:opacity-80 transition-all"
                  style={{
                    background: isSelected ? cfg.bg : "var(--bg-card)",
                    border: isSelected ? `2px solid ${cfg.color}` : "2px solid var(--border)",
                  }}
                >
                  <p className="font-semibold text-sm" style={{ color: isSelected ? cfg.color : "var(--text-primary)" }}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        {selectedCategories.length > 0 && (
          <div className="px-5 mb-6">
            <div className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>SESSION NAME</p>
              <p className="font-semibold">{getWorkoutName()}</p>
              <div className="flex gap-1.5 mt-2">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: CATEGORY_CONFIG[cat].bg, color: CATEGORY_CONFIG[cat].color }}
                  >
                    {CATEGORY_CONFIG[cat].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        <div className="px-5">
          <button
            onClick={startWorkout}
            className="w-full py-4 rounded-2xl font-semibold text-white text-lg active:opacity-80"
            style={{ background: "var(--accent)" }}
          >
            Start Workout
          </button>
          <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            {selectedCategories.length === 0
              ? "No filter — all exercises available"
              : "Exercise picker will be pre-filtered. You can still add any exercise."}
          </p>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Determine category filters for the exercise picker based on workout
  const pickerCategories = workout.category === "custom"
    ? selectedCategories.length > 0 ? selectedCategories : undefined
    : workout.category ? [workout.category] : undefined;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
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
            className="px-4 py-2 rounded-xl font-semibold text-sm active:opacity-80 shrink-0 ml-3"
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

      {showPicker && (
        <ExercisePicker
          onSelect={addExercise}
          onClose={() => setShowPicker(false)}
          categoryFilters={pickerCategories}
        />
      )}

      {showFinish && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6" style={{ background: "var(--bg-secondary)" }}>
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
