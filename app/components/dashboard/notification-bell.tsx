"use client"

import React from "react"
import { Button, Badge } from "@heroui/react"
import { Bell } from "lucide-react"

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  return (
    <div className="relative">
      <Badge 
        content={count > 0 ? count : null} 
        color="primary" 
        shape="circle" 
        size="sm"
        classNames={{
          badge: "text-[10px] font-medium text-white"
        }}
      >
        <Button
          isIconOnly
          variant="light"
          radius="full"
          size="sm"
          aria-label="Notifications"
          onClick={onClick}
          className="text-foreground/80 hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </Badge>
    </div>
  )
} 