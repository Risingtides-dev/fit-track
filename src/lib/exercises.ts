import { Exercise } from "./types";

export const DEFAULT_EXERCISES: Exercise[] = [
  // Chest
  { id: "bench-press", name: "Bench Press", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "incline-bench", name: "Incline Bench Press", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "decline-bench", name: "Decline Bench Press", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "dumbbell-press", name: "Dumbbell Press", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "incline-db-press", name: "Incline Dumbbell Press", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "chest-fly", name: "Chest Fly", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "cable-crossover", name: "Cable Crossover", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "push-ups", name: "Push-Ups", type: "strength", muscleGroup: "chest", isCustom: false },
  { id: "dips-chest", name: "Dips (Chest)", type: "strength", muscleGroup: "chest", isCustom: false },

  // Back
  { id: "deadlift", name: "Deadlift", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "barbell-row", name: "Barbell Row", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "dumbbell-row", name: "Dumbbell Row", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "pull-ups", name: "Pull-Ups", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "chin-ups", name: "Chin-Ups", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "lat-pulldown", name: "Lat Pulldown", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "seated-row", name: "Seated Cable Row", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "t-bar-row", name: "T-Bar Row", type: "strength", muscleGroup: "back", isCustom: false },
  { id: "face-pull", name: "Face Pull", type: "strength", muscleGroup: "back", isCustom: false },

  // Shoulders
  { id: "ohp", name: "Overhead Press", type: "strength", muscleGroup: "shoulders", isCustom: false },
  { id: "db-shoulder-press", name: "Dumbbell Shoulder Press", type: "strength", muscleGroup: "shoulders", isCustom: false },
  { id: "lateral-raise", name: "Lateral Raise", type: "strength", muscleGroup: "shoulders", isCustom: false },
  { id: "front-raise", name: "Front Raise", type: "strength", muscleGroup: "shoulders", isCustom: false },
  { id: "rear-delt-fly", name: "Rear Delt Fly", type: "strength", muscleGroup: "shoulders", isCustom: false },
  { id: "arnold-press", name: "Arnold Press", type: "strength", muscleGroup: "shoulders", isCustom: false },
  { id: "shrugs", name: "Shrugs", type: "strength", muscleGroup: "shoulders", isCustom: false },

  // Biceps
  { id: "barbell-curl", name: "Barbell Curl", type: "strength", muscleGroup: "biceps", isCustom: false },
  { id: "dumbbell-curl", name: "Dumbbell Curl", type: "strength", muscleGroup: "biceps", isCustom: false },
  { id: "hammer-curl", name: "Hammer Curl", type: "strength", muscleGroup: "biceps", isCustom: false },
  { id: "preacher-curl", name: "Preacher Curl", type: "strength", muscleGroup: "biceps", isCustom: false },
  { id: "cable-curl", name: "Cable Curl", type: "strength", muscleGroup: "biceps", isCustom: false },
  { id: "concentration-curl", name: "Concentration Curl", type: "strength", muscleGroup: "biceps", isCustom: false },

  // Triceps
  { id: "tricep-pushdown", name: "Tricep Pushdown", type: "strength", muscleGroup: "triceps", isCustom: false },
  { id: "overhead-extension", name: "Overhead Tricep Extension", type: "strength", muscleGroup: "triceps", isCustom: false },
  { id: "skull-crushers", name: "Skull Crushers", type: "strength", muscleGroup: "triceps", isCustom: false },
  { id: "close-grip-bench", name: "Close-Grip Bench Press", type: "strength", muscleGroup: "triceps", isCustom: false },
  { id: "dips-triceps", name: "Dips (Triceps)", type: "strength", muscleGroup: "triceps", isCustom: false },
  { id: "kickbacks", name: "Tricep Kickbacks", type: "strength", muscleGroup: "triceps", isCustom: false },

  // Legs
  { id: "squat", name: "Barbell Squat", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "front-squat", name: "Front Squat", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "leg-press", name: "Leg Press", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "leg-extension", name: "Leg Extension", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "leg-curl", name: "Leg Curl", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "romanian-deadlift", name: "Romanian Deadlift", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "lunges", name: "Lunges", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "calf-raise", name: "Calf Raise", type: "strength", muscleGroup: "legs", isCustom: false },
  { id: "hack-squat", name: "Hack Squat", type: "strength", muscleGroup: "legs", isCustom: false },

  // Glutes
  { id: "hip-thrust", name: "Hip Thrust", type: "strength", muscleGroup: "glutes", isCustom: false },
  { id: "glute-bridge", name: "Glute Bridge", type: "strength", muscleGroup: "glutes", isCustom: false },
  { id: "cable-kickback", name: "Cable Kickback", type: "strength", muscleGroup: "glutes", isCustom: false },

  // Core
  { id: "plank", name: "Plank", type: "strength", muscleGroup: "core", isCustom: false },
  { id: "crunches", name: "Crunches", type: "strength", muscleGroup: "core", isCustom: false },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", type: "strength", muscleGroup: "core", isCustom: false },
  { id: "cable-crunch", name: "Cable Crunch", type: "strength", muscleGroup: "core", isCustom: false },
  { id: "russian-twist", name: "Russian Twist", type: "strength", muscleGroup: "core", isCustom: false },
  { id: "ab-wheel", name: "Ab Wheel Rollout", type: "strength", muscleGroup: "core", isCustom: false },

  // Cardio
  { id: "running", name: "Running", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "treadmill", name: "Treadmill", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "cycling", name: "Cycling", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "stationary-bike", name: "Stationary Bike", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "elliptical", name: "Elliptical", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "rowing-machine", name: "Rowing Machine", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "stairmaster", name: "Stairmaster", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "jump-rope", name: "Jump Rope", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "swimming", name: "Swimming", type: "cardio", muscleGroup: "cardio", isCustom: false },
  { id: "walking", name: "Walking", type: "cardio", muscleGroup: "cardio", isCustom: false },
];
