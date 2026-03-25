// Suggested workout routines organized by workout day type
// Each program is a curated list of exercises that pair well together

import { WorkoutCategory } from "./types";

export interface SuggestedProgram {
  name: string;
  description: string;
  exerciseIds: string[];
}

export const WORKOUT_PROGRAMS: Record<Exclude<WorkoutCategory, "custom">, SuggestedProgram[]> = {
  push: [
    {
      name: "Push Strength",
      description: "Heavy compound pressing with isolation finishers",
      exerciseIds: ["bench-press", "ohp", "incline-db-press", "lateral-raise", "tricep-pushdown", "overhead-extension"],
    },
    {
      name: "Push Hypertrophy",
      description: "Higher volume with more isolation for muscle growth",
      exerciseIds: ["incline-bench", "dumbbell-press", "cable-crossover", "db-shoulder-press", "lateral-raise", "skull-crushers", "push-ups"],
    },
    {
      name: "Chest Focus",
      description: "Chest-dominant push day with tricep accessories",
      exerciseIds: ["bench-press", "incline-db-press", "chest-fly", "cable-crossover", "dips-chest", "tricep-pushdown"],
    },
    {
      name: "Shoulders & Arms",
      description: "Shoulder pressing with tricep work",
      exerciseIds: ["ohp", "arnold-press", "lateral-raise", "front-raise", "skull-crushers", "dips-triceps", "kickbacks"],
    },
  ],
  pull: [
    {
      name: "Pull Strength",
      description: "Heavy pulls and rows for back thickness and width",
      exerciseIds: ["deadlift", "barbell-row", "pull-ups", "face-pull", "barbell-curl", "hammer-curl"],
    },
    {
      name: "Pull Hypertrophy",
      description: "Higher volume back and biceps for growth",
      exerciseIds: ["lat-pulldown", "seated-row", "dumbbell-row", "face-pull", "rear-delt-fly", "dumbbell-curl", "preacher-curl"],
    },
    {
      name: "Back Width",
      description: "Vertical pulls and wide grips for lat development",
      exerciseIds: ["pull-ups", "lat-pulldown", "dumbbell-row", "t-bar-row", "face-pull", "cable-curl"],
    },
    {
      name: "Back Thickness",
      description: "Rows and heavy pulls for a thick back",
      exerciseIds: ["deadlift", "barbell-row", "t-bar-row", "seated-row", "shrugs", "hammer-curl"],
    },
  ],
  legs: [
    {
      name: "Leg Strength",
      description: "Squat and deadlift focused for maximal strength",
      exerciseIds: ["squat", "romanian-deadlift", "leg-press", "leg-curl", "calf-raise"],
    },
    {
      name: "Leg Hypertrophy",
      description: "High volume quads, hamstrings, and glutes",
      exerciseIds: ["squat", "leg-press", "leg-extension", "leg-curl", "bulgarian-split-squat", "hip-thrust", "calf-raise"],
    },
    {
      name: "Quad Dominant",
      description: "Front squats and quad-focused accessories",
      exerciseIds: ["front-squat", "hack-squat", "leg-extension", "lunges", "bulgarian-split-squat", "calf-raise"],
    },
    {
      name: "Posterior Chain",
      description: "Hamstrings, glutes, and lower back focus",
      exerciseIds: ["romanian-deadlift", "hip-thrust", "leg-curl", "glute-bridge", "cable-kickback", "lunges"],
    },
  ],
  upper: [
    {
      name: "Upper Strength",
      description: "Balanced pressing and pulling with heavy compounds",
      exerciseIds: ["bench-press", "barbell-row", "ohp", "pull-ups", "barbell-curl", "tricep-pushdown"],
    },
    {
      name: "Upper Hypertrophy",
      description: "Volume-focused upper body for balanced growth",
      exerciseIds: ["incline-db-press", "dumbbell-row", "db-shoulder-press", "lat-pulldown", "lateral-raise", "dumbbell-curl", "skull-crushers"],
    },
    {
      name: "Push-Pull Superset",
      description: "Pair pushing and pulling exercises for efficiency",
      exerciseIds: ["bench-press", "barbell-row", "ohp", "chin-ups", "chest-fly", "face-pull", "hammer-curl", "tricep-pushdown"],
    },
  ],
  core: [
    {
      name: "Core Strength",
      description: "Build a strong, stable core",
      exerciseIds: ["plank", "hanging-leg-raise", "cable-crunch", "ab-wheel"],
    },
    {
      name: "Core Endurance",
      description: "Higher rep core work for endurance and definition",
      exerciseIds: ["crunches", "russian-twist", "plank", "hanging-leg-raise", "cable-crunch"],
    },
    {
      name: "Abs & Obliques",
      description: "Target abs and obliques for a defined midsection",
      exerciseIds: ["hanging-leg-raise", "cable-crunch", "russian-twist", "ab-wheel", "crunches"],
    },
  ],
  cardio: [
    {
      name: "Steady State",
      description: "Low to moderate intensity for endurance and fat burn",
      exerciseIds: ["running", "cycling", "walking"],
    },
    {
      name: "HIIT Session",
      description: "High-intensity intervals for max calorie burn",
      exerciseIds: ["jump-rope", "rowing-machine", "stationary-bike"],
    },
    {
      name: "Machine Cardio",
      description: "Indoor cardio using gym machines",
      exerciseIds: ["treadmill", "elliptical", "stairmaster", "stationary-bike"],
    },
    {
      name: "Low Impact",
      description: "Easy on the joints, great for recovery days",
      exerciseIds: ["swimming", "elliptical", "walking", "stationary-bike"],
    },
  ],
};
