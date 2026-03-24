"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import ProgressChart from "@/components/ProgressChart";
import { getExercises, getExerciseHistory } from "@/lib/db";
import { Exercise } from "@/lib/types";
import { getBestSet, formatDate, getEstimated1RM } from "@/lib/utils";

export default function ProgressPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [metric, setMetric] = useState<"weight" | "volume" | "e1rm">("weight");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getExercises().then((exs) => {
      const strengthExs = exs.filter((e) => e.type === "strength");
      setExercises(strengthExs);
      if (strengthExs.length > 0 && !selectedId) {
        setSelectedId(strengthExs[0].id);
      }
    });
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    getExerciseHistory(selectedId).then((history) => {
      const data = history
        .filter((h) => h.sets.length > 0)
        .map((h) => {
          const best = getBestSet(h.sets);
          let value = 0;
          if (metric === "weight") {
            value = best?.weight ?? 0;
          } else if (metric === "volume") {
            value = h.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
          } else {
            value = best ? getEstimated1RM(best.weight, best.reps) : 0;
          }
          return { label: formatDate(h.date), value };
        });
      setChartData(data);
    });
  }, [selectedId, metric]);

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedExercise = exercises.find((e) => e.id === selectedId);

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Track your strength gains over time
        </p>
      </div>

      {/* Exercise selector */}
      <div className="px-5 mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl outline-none text-sm mb-3"
          style={{ background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filteredExercises.slice(0, 20).map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
              style={{
                background: selectedId === ex.id ? "var(--accent)" : "var(--bg-card)",
                color: selectedId === ex.id ? "white" : "var(--text-secondary)",
              }}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Metric toggle */}
      <div className="px-5 mb-4">
        <div className="flex rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {(["weight", "volume", "e1rm"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className="flex-1 py-2.5 text-xs font-semibold uppercase"
              style={{
                background: metric === m ? "var(--accent)" : "transparent",
                color: metric === m ? "white" : "var(--text-muted)",
              }}
            >
              {m === "e1rm" ? "Est. 1RM" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 mb-6">
        <div className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold mb-3">
            {selectedExercise?.name ?? "Select an exercise"}
          </h3>
          <ProgressChart
            data={chartData}
            unit={metric === "weight" ? "Best Weight (lbs)" : metric === "volume" ? "Total Volume (lbs)" : "Estimated 1RM (lbs)"}
          />
        </div>
      </div>

      {/* Stats summary */}
      {chartData.length > 0 && (
        <div className="px-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                {Math.max(...chartData.map((d) => d.value))}
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>BEST</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-lg font-bold" style={{ color: "var(--success)" }}>
                {chartData[chartData.length - 1]?.value ?? 0}
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>LATEST</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-lg font-bold">{chartData.length}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>SESSIONS</p>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
