export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(isoStr: string): string {
  const date = new Date(isoStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const mins = Math.round((end - start) / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return `${hours}h ${remaining}m`;
}

export function getBestSet(sets: { reps: number; weight: number }[]): { reps: number; weight: number } | null {
  if (!sets.length) return null;
  return sets.reduce((best, s) => (s.weight > best.weight ? s : best), sets[0]);
}

export function getEstimated1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  // Brzycki formula
  return Math.round(weight * (36 / (37 - reps)));
}

import { WorkoutCategory } from "./types";

export const CATEGORY_CONFIG: Record<WorkoutCategory, { label: string; color: string; bg: string }> = {
  push: { label: "Push", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  pull: { label: "Pull", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  legs: { label: "Legs", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  upper: { label: "Upper", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  core: { label: "Core", color: "#eab308", bg: "rgba(234,179,8,0.15)" },
  cardio: { label: "Cardio", color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
  custom: { label: "Custom", color: "#a0a0a0", bg: "rgba(160,160,160,0.15)" },
};
