"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getWorkouts } from "@/lib/db";
import { Workout } from "@/lib/types";
import { formatDate, getDuration, todayISO, CATEGORY_CONFIG } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkouts().then((w) => {
      setWorkouts(w);
      setLoading(false);
    });
  }, []);

  const today = todayISO();
  const todayWorkouts = workouts.filter((w) => w.date === today);
  const recentWorkouts = workouts.slice(0, 5);
  const thisWeek = workouts.filter((w) => {
    const d = new Date(w.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const totalSetsThisWeek = thisWeek.reduce(
    (sum, w) => sum + w.exercises.reduce((s, e) => s + (e.sets?.length ?? 0), 0),
    0
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-2xl font-bold">FitTrack</h1>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 px-5 mb-6">
        <div className="rounded-2xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{thisWeek.length}</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>THIS WEEK</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>{totalSetsThisWeek}</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>SETS</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-bold">{workouts.length}</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>TOTAL</p>
        </div>
      </div>

      {/* Today */}
      <div className="px-5 mb-6">
        {todayWorkouts.length > 0 ? (
          <div className="rounded-2xl p-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>
              You worked out today!
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {todayWorkouts.length} workout{todayWorkouts.length > 1 ? "s" : ""} &bull;{" "}
              {todayWorkouts.reduce((sum, w) => sum + w.exercises.length, 0)} exercises
            </p>
          </div>
        ) : (
          <button
            onClick={() => router.push("/workout")}
            className="w-full rounded-2xl p-4 text-left active:opacity-80"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              Start today&apos;s workout
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              Tap here to begin logging
            </p>
          </button>
        )}
      </div>

      {/* Recent workouts */}
      <div className="px-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>RECENT WORKOUTS</h2>
        {loading ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : recentWorkouts.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No workouts yet. Hit the + button to get started!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentWorkouts.map((w) => (
              <button
                key={w.id}
                onClick={() => router.push(`/history/${w.id}`)}
                className="rounded-2xl p-4 text-left active:opacity-80"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{w.name}</p>
                    {w.category && w.category !== "custom" && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: CATEGORY_CONFIG[w.category].bg,
                          color: CATEGORY_CONFIG[w.category].color,
                        }}
                      >
                        {CATEGORY_CONFIG[w.category].label}
                      </span>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {getDuration(w.startTime, w.endTime)}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {formatDate(w.date)} &bull; {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""} &bull;{" "}
                  {w.exercises.reduce((sum, e) => sum + (e.sets?.length ?? 0), 0)} sets
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
