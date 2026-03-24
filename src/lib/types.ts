export type ExerciseType = "strength" | "cardio";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "core"
  | "glutes"
  | "full body"
  | "cardio";

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscleGroup: MuscleGroup;
  isCustom: boolean;
}

export interface StrengthSet {
  id: string;
  reps: number;
  weight: number;
  unit: "lbs" | "kg";
  rpe?: number; // Rate of perceived exertion 1-10
  notes?: string;
}

export interface CardioEntry {
  id: string;
  duration: number; // minutes
  distance?: number;
  distanceUnit?: "mi" | "km";
  calories?: number;
  avgHeartRate?: number;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  sets?: StrengthSet[];
  cardio?: CardioEntry;
  order: number;
}

export interface Workout {
  id: string;
  date: string; // ISO date string
  startTime: string; // ISO datetime
  endTime?: string;
  name: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}
