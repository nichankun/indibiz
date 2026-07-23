"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Point = { date: string; count: number };

export function LeadsTrendChart({ data }: { data: Point[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data lead untuk ditampilkan.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-mist-200)" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#5b6478" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#5b6478" />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-mist-200)", fontSize: 12 }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="count"
          name="Lead baru"
          stroke="var(--color-signal-600)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
