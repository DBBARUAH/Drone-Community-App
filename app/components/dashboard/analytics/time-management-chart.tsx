"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TimeManagementChartProps {
  isLoading?: boolean
}

export function TimeManagementChart({ isLoading = false }: TimeManagementChartProps) {
  // Mock data for time management
  const data = [
    { day: "Mon", bookings: 2, hours: 4 },
    { day: "Tue", bookings: 1, hours: 2 },
    { day: "Wed", bookings: 3, hours: 6 },
    { day: "Thu", bookings: 2, hours: 5 },
    { day: "Fri", bookings: 4, hours: 8 },
    { day: "Sat", bookings: 5, hours: 10 },
    { day: "Sun", bookings: 1, hours: 3 },
  ]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
          <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
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
          <Bar dataKey="bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="hours" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
