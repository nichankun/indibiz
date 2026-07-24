"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export type ChannelFunnelRow = {
  channel: string;
  totalLead: number;
  dihubungi: number;
  survey: number;
  pemasangan: number;
};

export function FunnelChart({ data }: { data: ChannelFunnelRow[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data lead untuk ditampilkan.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-mist-200)" />
        <XAxis dataKey="channel" tick={{ fontSize: 12 }} stroke="#5b6478" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#5b6478" />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-mist-200)", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="totalLead" name="Total Lead" fill="var(--color-navy-700)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="dihubungi" name="Sudah Dihubungi" fill="var(--color-navy-600)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="survey" name="Tahap Survey" fill="#f0575f" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pemasangan" name="Pemasangan/Selesai" fill="var(--color-signal-600)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
