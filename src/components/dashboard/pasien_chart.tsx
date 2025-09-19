"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Fisioterapi", value: 35.7 },
  { name: "Wicara", value: 28.6 },
  { name: "Okupasi", value: 21.4 },
  { name: "Paedagog", value: 14.3 },
];

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#facc15"];

export default function PasienChart() {
  return (
    <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4 text-[#36315B]">
      <h3 className="font-bold mb-3 text-lg">Kategori Pasien</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontFamily: "Playpen Sans, sans-serif",
                color: "#36315B",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
