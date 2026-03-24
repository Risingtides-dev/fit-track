"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getWorkouts, deleteWorkout } from "@/lib/db";
import { Workout } from "@/lib/types";
import { formatDate, getDuration } from "@/lib/utils";

export default function HistoryPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getWorkouts().then((w) => {
      setWorkouts(w);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    await deleteWorkout(id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    setDeleteId(null);
  }

  // Group workouts by month
  const grouped = workouts.reduce<Record<string, Workout[]>>((acc, w) => {
    const key = new Date(w.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(w);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {workouts.length} workout{workouts.length !== 1 ? "s" : ""} logged
        </p>
      </div>

      <div className="px-5">
        {loading ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : workouts.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No workouts yet. Go crush one!
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([month, monthWorkouts]) => (
            <div key={month} className="mb-6">
              <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                {month.toUpperCase()}
              </h2>
              <div className="flex flex-col gap-2">
                {monthWorkouts.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-2xl p-4 active:opacity-80"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <button
                      onClick={() => router.push(`/history/${w.id}`)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{w.name}</p>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {getDuration(w.startTime, w.endTime)}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {formatDate(w.date)} &bull; {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""} &bull;{" "}
                        {w.exercises.reduce((sum, e) => sum + (e.sets?.length ?? 0), 0)} sets
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {w.exercises.map((ex) => (
                          <span
                            key={ex.id}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: "var(--bg-input)", color: "var(--text-secondary)" }}
                          >
                            {ex.exerciseName}
                          </span>
                        ))}
                      </div>
                    </button>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => setDeleteId(w.id)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ color: "var(--danger)" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--bg-secondary)" }}>
            <h3 className="font-bold mb-2">Delete Workout?</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: "var(--danger)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
