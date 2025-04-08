"use client"

import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip } from "recharts"

interface EngagementFunnelChartProps {
  isLoading?: boolean
}

export function EngagementFunnelChart({ isLoading = false }: EngagementFunnelChartProps) {
  // Mock data for engagement funnel
  const data = [
    { name: "Profile Views", value: 243, fill: "#8884d8" },
    { name: "Portfolio Clicks", value: 178, fill: "#83a6ed" },
    { name: "Inquiries", value: 56, fill: "#8dd1e1" },
    { name: "Bookings", value: 12, fill: "#82ca9d" },
    { name: "Completed", value: 8, fill: "#a4de6c" },
  ]

  if (isLoading) {
    return <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(22, 22, 22, 0.8)",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#fff",
            }}
          />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  )
}
