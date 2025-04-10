"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface RepeatCustomerChartProps {
  isLoading?: boolean
}

export function RepeatCustomerChart({ isLoading = false }: RepeatCustomerChartProps) {
  // Mock data for repeat customers
  const data = [
    { name: "First-time Clients", value: 60 },
    { name: "Repeat Clients", value: 40 },
  ]

  const COLORS = ["#0088FE", "#00C49F"]

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

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm font-medium">Repeat Booking Rate</p>
          <p className="text-2xl font-bold text-primary">40%</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Avg. Bookings per Client</p>
          <p className="text-2xl font-bold text-primary">1.8</p>
        </div>
      </div>
    </div>
  )
}
