"use client"

import { Calendar } from "@/components/ui/calendar"

export function DashboardCalendar() {
  return <Calendar mode="single" selected={new Date()} className="rounded-md border" />
}

