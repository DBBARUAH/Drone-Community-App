"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

interface VisitorChartProps {
  isLoading?: boolean
}

export function VisitorChart({ isLoading = false }: VisitorChartProps) {
  const { theme } = useTheme();

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

  // Define theme-aware colors
  const axisColor = theme === 'dark' ? '#a1a1aa' : '#71717a';
  const gridColor = theme === 'dark' ? '#404040' : '#e5e5e5';
  const tooltipBg = theme === 'dark' ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const tooltipColor = theme === 'dark' ? '#e5e5e5' : '#3f3f46';
  const legendColor = theme === 'dark' ? '#d4d4d8' : '#52525b';
  const viewsColor = theme === 'dark' ? '#60a5fa' : '#2563eb';
  const visitorsColor = theme === 'dark' ? '#a78bfa' : '#7c3aed';

  if (isLoading) {
    return <div className="h-[250px] sm:h-[300px] bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke={axisColor} 
            fontSize={10}
            tickLine={false} 
            axisLine={false} 
            dy={5}
           />
          <YAxis 
             stroke={axisColor} 
             fontSize={10}
             tickLine={false} 
             axisLine={false} 
             dx={-5}
           />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${gridColor}`,
              borderRadius: "6px",
              fontSize: "12px",
              color: tooltipColor,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              padding: '8px 12px'
            }}
            itemStyle={{ padding: '2px 0'}}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconSize={10}
            formatter={(value) => <span style={{ color: legendColor }}>{value}</span>}
           />
          <Line 
             type="monotone" 
             dataKey="views" 
             stroke={viewsColor} 
             strokeWidth={2} 
             dot={{ r: 3, fill: viewsColor, strokeWidth: 0 }} 
             activeDot={{ r: 5, strokeWidth: 0 }}
           />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke={visitorsColor}
            strokeWidth={2}
            dot={{ r: 3, fill: visitorsColor, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
