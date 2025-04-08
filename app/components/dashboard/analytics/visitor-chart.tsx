"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface VisitorChartProps {
  isLoading?: boolean
}

export function VisitorChart({ isLoading = false }: VisitorChartProps) {
  // Mock data for visitor trends
  const data = [
    { date: "Apr 1", views: 24, visitors: 18 },
    { date: "Apr 5", views: 35, visitors: 28 },
    { date: "Apr 10", views: 42, visitors: 32 },
    { date: "Apr 15", views: 38, visitors: 30 },
    { date: "Apr 20", views: 45, visitors: 35 },
    { date: "Apr 25", views: 52, visitors: 40 },
    { date: "Apr 30", views: 58, visitors: 45 },
  ]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
          <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
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
          <Line type="monotone" dataKey="views" stroke="#0072F5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
