"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import ExercisePicker from "@/components/ExercisePicker";
import SetLogger from "@/components/SetLogger";
import WorkoutTimer from "@/components/WorkoutTimer";
import { Workout, WorkoutExercise, Exercise, WorkoutCategory } from "@/lib/types";
import { saveWorkout, getWorkout, getExercises } from "@/lib/db";
import { generateId, todayISO, CATEGORY_CONFIG } from "@/lib/utils";
import { WORKOUT_PROGRAMS, SuggestedProgram } from "@/lib/workoutPrograms";

const ACTIVE_WORKOUT_KEY = "fittrack_active_workout";

const CATEGORY_OPTIONS: { value: WorkoutCategory; label: string; icon: string }[] = [
  { value: "push", label: "Push", icon: "PUSH" },
  { value: "pull", label: "Pull", icon: "PULL" },
  { value: "legs", label: "Legs", icon: "LEGS" },
  { value: "upper", label: "Upper", icon: "UPPR" },
  { value: "core", label: "Core", icon: "CORE" },
  { value: "cardio", label: "Cardio", icon: "CRDO" },
];

export default function WorkoutPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<WorkoutCategory[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<SuggestedProgram | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const activeId = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (activeId) {
      getWorkout(activeId).then((w) => {
        if (w && !w.endTime) setWorkout(w);
        else localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      });
    }
    getExercises().then(setAllExercises);
  }, []);

  useEffect(() => {
    if (workout) {
      saveWorkout(workout);
    }
  }, [workout]);

  function toggleCategory(cat: WorkoutCategory) {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (cat === "upper") return [...prev.filter((c) => c !== "push" && c !== "pull"), cat];
      if ((cat === "push" || cat === "pull") && prev.includes("upper")) {
        const other = cat === "push" ? "pull" : "push";
        return [...prev.filter((c) => c !== "upper"), other, cat];
      }
      return [...prev, cat];
    });
    setSelectedProgram(null);
  }

  function getWorkoutName(): string {
    if (selectedProgram) return selectedProgram.name;
    if (selectedCategories.length === 0) {
      const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
      return `${day} Workout`;
    }
    const labels = selectedCategories.map((c) => CATEGORY_CONFIG[c].label);
    return labels.join(" + ") + " Day";
  }

  function startWorkout() {
    const now = new Date().toISOString();
    const exercises: WorkoutExercise[] = [];

    if (selectedProgram && allExercises.length > 0) {
      selectedProgram.exerciseIds.forEach((exId, idx) => {
        const exercise = allExercises.find((e) => e.id === exId);
        if (exercise) {
          exercises.push({
            id: generateId() + idx,
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            exerciseType: exercise.type,
            sets: exercise.type === "strength" ? [] : undefined,
            cardio: exercise.type === "cardio" ? { id: generateId(), duration: 0 } : undefined,
            order: idx,
          });
        }
      });
    }

    const w: Workout = {
      id: generateId(),
      date: todayISO(),
      startTime: now,
      name: getWorkoutName(),
      category: selectedCategories.length === 1 ? selectedCategories[0] : "custom",
      exercises,
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

  // Get available programs for selected categories
  const availablePrograms: SuggestedProgram[] = [];
  if (selectedCategories.length > 0) {
    for (const cat of selectedCategories) {
      if (cat !== "custom" && WORKOUT_PROGRAMS[cat]) {
        availablePrograms.push(...WORKOUT_PROGRAMS[cat]);
      }
    }
  }

  // ==========================================
  // START SCREEN — no active workout
  // ==========================================
  if (!workout) {
    return (
      <div className="min-h-screen pb-20">
        <div className="px-5 pt-14 pb-8">
          <h1 className="text-3xl font-black">Start Training</h1>
        </div>

        {/* Category selector — big tactile buttons */}
        <div className="px-5 mb-8">
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORY_OPTIONS.map((opt) => {
              const isSelected = selectedCategories.includes(opt.value);
              const cfg = CATEGORY_CONFIG[opt.value];
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleCategory(opt.value)}
                  className="rounded-2xl py-5 flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                  style={{
                    background: isSelected ? cfg.bg : "var(--bg-card)",
                    border: isSelected ? `2px solid ${cfg.color}` : "2px solid var(--border)",
                  }}
                >
                  <span
                    className="text-xs font-black tracking-wider"
                    style={{ color: isSelected ? cfg.color : "var(--text-muted)" }}
                  >
                    {opt.icon}
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ color: isSelected ? cfg.color : "var(--text-primary)" }}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Programs — horizontal scroll cards */}
        {availablePrograms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-black tracking-widest mb-3 px-5" style={{ color: "var(--text-muted)" }}>SUGGESTED ROUTINES</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
              {availablePrograms.map((program, i) => {
                const isSelected = selectedProgram?.name === program.name;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedProgram(isSelected ? null : program)}
                    className="rounded-2xl p-4 text-left active:scale-[0.97] transition-all shrink-0"
                    style={{
                      width: 220,
                      background: isSelected ? "rgba(59,130,246,0.1)" : "var(--bg-card)",
                      border: isSelected ? "2px solid var(--accent)" : "1.5px solid var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-bold text-sm" style={{ color: isSelected ? "var(--accent)" : "var(--text-primary)" }}>
                        {program.name}
                      </p>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] mb-2.5" style={{ color: "var(--text-muted)" }}>
                      {program.description}
                    </p>
                    <p className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {program.exerciseIds.length} exercises
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GO button — massive, unmistakable */}
        <div className="px-5">
          <button
            onClick={startWorkout}
            className="w-full py-5 rounded-2xl font-black text-white text-xl active:scale-[0.97] transition-transform"
            style={{ background: "var(--accent)" }}
          >
            {selectedProgram ? "GO" : "START"}
          </button>
          {selectedProgram && (
            <p className="text-center text-xs mt-3 font-semibold" style={{ color: "var(--text-muted)" }}>
              {selectedProgram.name} — {selectedProgram.exerciseIds.length} exercises pre-loaded
            </p>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // ==========================================
  // ACTIVE WORKOUT — no bottom nav, full screen gym mode
  // ==========================================
  const pickerCategories = workout.category === "custom"
    ? selectedCategories.length > 0 ? selectedCategories : undefined
    : workout.category ? [workout.category] : undefined;

  const totalSets = workout.exercises.reduce((sum, e) => sum + (e.sets?.length ?? 0), 0);

  return (
    <div className="min-h-screen pb-6">
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-40 px-5 pt-3 pb-3 flex items-center justify-between"
        style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <WorkoutTimer startTime={workout.startTime} />
          <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
            {workout.exercises.length} ex &bull; {totalSets} sets
          </span>
        </div>
        <button
          onClick={() => setShowFinish(true)}
          className="px-5 py-2.5 rounded-xl font-black text-sm active:scale-95 transition-transform shrink-0"
          style={{ background: "var(--success)", color: "white" }}
        >
          FINISH
        </button>
      </div>

      {/* Workout name */}
      <div className="px-5 pt-4 pb-2">
        <input
          type="text"
          value={workout.name}
          onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
          className="text-xl font-black bg-transparent outline-none w-full"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Exercise cards */}
      <div className="px-4 flex flex-col gap-3 pb-4">
        {workout.exercises.map((ex) => (
          <SetLogger
            key={ex.id}
            exercise={ex}
            onUpdate={updateExercise}
            onRemove={() => removeExercise(ex.id)}
          />
        ))}

        {/* Add exercise — big dashed button */}
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-5 rounded-2xl font-bold text-base active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
          style={{ border: "2.5px dashed var(--border)", color: "var(--text-muted)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ADD EXERCISE
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
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div
            className="w-full max-w-lg rounded-t-3xl p-6 pb-10"
            style={{ background: "var(--bg-secondary)" }}
          >
            <h2 className="text-xl font-black mb-2">Done?</h2>
            <p className="text-sm font-semibold mb-6" style={{ color: "var(--text-muted)" }}>
              {workout.exercises.length} exercises &bull; {totalSets} sets logged
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={finishWorkout}
                className="w-full py-4 rounded-2xl font-black text-white text-lg active:scale-[0.97] transition-transform"
                style={{ background: "var(--success)" }}
              >
                SAVE & FINISH
              </button>
              <button
                onClick={discardWorkout}
                className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-transform"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}
              >
                Discard
              </button>
              <button
                onClick={() => setShowFinish(false)}
                className="w-full py-3 rounded-2xl font-bold active:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Keep Going
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
