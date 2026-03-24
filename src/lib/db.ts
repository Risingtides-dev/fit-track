import { Exercise, Workout } from "./types";
import { DEFAULT_EXERCISES } from "./exercises";

const DB_NAME = "fittrack";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("workouts")) {
        const workoutStore = db.createObjectStore("workouts", { keyPath: "id" });
        workoutStore.createIndex("date", "date", { unique: false });
      }
      if (!db.objectStoreNames.contains("exercises")) {
        db.createObjectStore("exercises", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txPromise<T>(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = fn(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Exercises
export async function getExercises(): Promise<Exercise[]> {
  const db = await openDB();
  const custom = await txPromise<Exercise[]>(db, "exercises", "readonly", (s) => s.getAll());
  db.close();
  return [...DEFAULT_EXERCISES, ...custom];
}

export async function addCustomExercise(exercise: Exercise): Promise<void> {
  const db = await openDB();
  await txPromise(db, "exercises", "readwrite", (s) => s.put(exercise));
  db.close();
}

export async function deleteCustomExercise(id: string): Promise<void> {
  const db = await openDB();
  await txPromise(db, "exercises", "readwrite", (s) => s.delete(id));
  db.close();
}

// Workouts
export async function getWorkouts(): Promise<Workout[]> {
  const db = await openDB();
  const workouts = await txPromise<Workout[]>(db, "workouts", "readonly", (s) => s.getAll());
  db.close();
  return workouts.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export async function getWorkout(id: string): Promise<Workout | undefined> {
  const db = await openDB();
  const workout = await txPromise<Workout | undefined>(db, "workouts", "readonly", (s) => s.get(id));
  db.close();
  return workout;
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const db = await openDB();
  await txPromise(db, "workouts", "readwrite", (s) => s.put(workout));
  db.close();
}

export async function deleteWorkout(id: string): Promise<void> {
  const db = await openDB();
  await txPromise(db, "workouts", "readwrite", (s) => s.delete(id));
  db.close();
}

// Stats helpers
export async function getExerciseHistory(exerciseId: string): Promise<
  { date: string; sets: { reps: number; weight: number }[]; cardio?: { duration: number; distance?: number } }[]
> {
  const workouts = await getWorkouts();
  const history: { date: string; sets: { reps: number; weight: number }[]; cardio?: { duration: number; distance?: number } }[] = [];

  for (const workout of workouts) {
    for (const ex of workout.exercises) {
      if (ex.exerciseId === exerciseId) {
        history.push({
          date: workout.date,
          sets: ex.sets?.map((s) => ({ reps: s.reps, weight: s.weight })) ?? [],
          cardio: ex.cardio ? { duration: ex.cardio.duration, distance: ex.cardio.distance } : undefined,
        });
      }
    }
  }

  return history.reverse(); // chronological order
}
