"use client";

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  unit: string;
  color?: string;
}

export default function ProgressChart({ data, unit, color = "var(--accent)" }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
        No data yet. Start logging workouts!
      </p>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  // SVG chart
  const width = 300;
  const height = 150;
  const padding = { top: 10, right: 10, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
    y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = linePath + ` L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: "200px" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + chartH - pct * chartH;
          const val = Math.round(minVal + pct * range);
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--border)" strokeWidth={0.5} />
              <text x={padding.left - 5} y={y + 3} textAnchor="end" fill="var(--text-muted)" fontSize={8}>
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={color} opacity={0.1} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}

        {/* X-axis labels (show first, middle, last) */}
        {data.length > 0 && (
          <>
            <text x={points[0].x} y={height - 5} textAnchor="start" fill="var(--text-muted)" fontSize={7}>
              {data[0].label}
            </text>
            {data.length > 2 && (
              <text x={points[Math.floor(points.length / 2)].x} y={height - 5} textAnchor="middle" fill="var(--text-muted)" fontSize={7}>
                {data[Math.floor(data.length / 2)].label}
              </text>
            )}
            {data.length > 1 && (
              <text x={points[points.length - 1].x} y={height - 5} textAnchor="end" fill="var(--text-muted)" fontSize={7}>
                {data[data.length - 1].label}
              </text>
            )}
          </>
        )}
      </svg>
      <p className="text-center text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{unit}</p>
    </div>
  );
}
