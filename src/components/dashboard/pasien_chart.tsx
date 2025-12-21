"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type CategoryItem = {
  name: string;
  value: number;
};

export default function PasienChart({ apiData }: { apiData: CategoryItem[] }) {
  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#facc15"];

  const hasData = apiData && apiData.length > 0;

  const dataToUse = hasData
    ? apiData
    : [{ name: "Tidak ada data", value: 1 }]; // fallback biar PieChart tetap render

  return (
    <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4 text-[#36315B]">
      <h3 className="font-bold mb-3 text-lg">Kategori Pasien</h3>

      {!hasData && (
        <p className="text-sm text-gray-400 mb-2">
          Belum ada data kategori pasien
        </p>
      )}

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataToUse}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {dataToUse.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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