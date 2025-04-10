"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface CompetitorBenchmarkChartProps {
  isLoading?: boolean
}

export function CompetitorBenchmarkChart({ isLoading = false }: CompetitorBenchmarkChartProps) {
  // Mock data for competitor benchmarking
  const data = [
    { subject: "Booking Rate", A: 120, B: 110, fullMark: 150 },
    { subject: "Avg Price", A: 98, B: 130, fullMark: 150 },
    { subject: "Response Time", A: 86, B: 130, fullMark: 150 },
    { subject: "Portfolio Quality", A: 99, B: 100, fullMark: 150 },
    { subject: "Client Satisfaction", A: 85, B: 90, fullMark: 150 },
    { subject: "Repeat Bookings", A: 65, B: 85, fullMark: 150 },
  ]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar name="You" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Platform Average" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(22, 22, 22, 0.8)",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#fff",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
