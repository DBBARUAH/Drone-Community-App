"use client"

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts"

interface BookingChartProps {
  isLoading?: boolean
}

export function BookingChart({ isLoading = false }: BookingChartProps) {
  // Mock data for booking trends
  const data = [
    { date: "Apr 1", bookings: 1, conversionRate: 2.1 },
    { date: "Apr 5", bookings: 0, conversionRate: 0 },
    { date: "Apr 10", bookings: 2, conversionRate: 4.8 },
    { date: "Apr 15", bookings: 1, conversionRate: 2.6 },
    { date: "Apr 20", bookings: 3, conversionRate: 6.7 },
    { date: "Apr 25", bookings: 0, conversionRate: 0 },
    { date: "Apr 30", bookings: 1, conversionRate: 1.7 },
  ]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
          <YAxis yAxisId="left" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
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
          <Bar yAxisId="left" dataKey="bookings" fill="#0072F5" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversionRate"
            stroke="#FF8042"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
