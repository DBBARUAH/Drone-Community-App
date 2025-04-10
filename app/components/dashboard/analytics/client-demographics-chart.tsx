"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ClientDemographicsChartProps {
  isLoading?: boolean
}

export function ClientDemographicsChart({ isLoading = false }: ClientDemographicsChartProps) {
  // Mock data for client demographics
  const data = [
    { name: "Real Estate", value: 45 },
    { name: "Events", value: 25 },
    { name: "Tourism", value: 15 },
    { name: "Construction", value: 10 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(22, 22, 22, 0.8)",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#fff",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
