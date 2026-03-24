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
