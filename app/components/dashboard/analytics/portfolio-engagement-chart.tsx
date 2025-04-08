"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PortfolioEngagementChartProps {
  isLoading?: boolean
}

export function PortfolioEngagementChart({ isLoading = false }: PortfolioEngagementChartProps) {
  // Mock data for portfolio engagement
  const data = [
    { name: "Coastal Drone Photography", views: 78, clicks: 45, inquiries: 12 },
    { name: "Real Estate Package", views: 65, clicks: 38, inquiries: 8 },
    { name: "Wedding Venue Aerial", views: 42, clicks: 30, inquiries: 15 },
    { name: "Construction Progress", views: 38, clicks: 25, inquiries: 10 },
    { name: "Event Coverage", views: 25, clicks: 18, inquiries: 5 },
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
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
          <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
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
          <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="clicks" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inquiries" fill="#ffc658" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
