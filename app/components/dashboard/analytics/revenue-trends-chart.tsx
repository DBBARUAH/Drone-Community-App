"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

interface RevenueTrendsChartProps {
  isLoading?: boolean
  timeRange?: string
}

export function RevenueTrendsChart({ isLoading = false, timeRange = "30days" }: RevenueTrendsChartProps) {
  // Mock data for revenue trends
  const data = [
    { date: "Apr 1", revenue: 350, avgBookingValue: 350, forecast: 380 },
    { date: "Apr 5", revenue: 0, avgBookingValue: 0, forecast: 400 },
    { date: "Apr 10", revenue: 800, avgBookingValue: 400, forecast: 420 },
    { date: "Apr 15", revenue: 450, avgBookingValue: 450, forecast: 440 },
    { date: "Apr 20", revenue: 1200, avgBookingValue: 400, forecast: 460 },
    { date: "Apr 25", revenue: 0, avgBookingValue: 0, forecast: 480 },
    { date: "Apr 30", revenue: 500, avgBookingValue: 500, forecast: 500 },
  ]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0072F5"
            fill="#0072F5"
            fillOpacity={0.2}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="avgBookingValue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
