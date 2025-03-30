"use client"

import { useState, useEffect } from "react"
import { User, Camera, ChevronDown } from "lucide-react"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { PhotographerDashboard } from "@/components/dashboard/photographer-dashboard"

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState("client")
  const [isNewUser, setIsNewUser] = useState(true) // This would normally be determined by user data

  // Load saved role from localStorage on initial render
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole")
    if (savedRole) {
      setCurrentRole(savedRole)
    }
  }, [])

  // Save role to localStorage when it changes
  const handleRoleChange = (role: string) => {
    setCurrentRole(role)
    localStorage.setItem("userRole", role)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-foreground-600">
            {isNewUser
              ? "Welcome to Travellers Beats! Let's get you started."
              : "Welcome back! Here's an overview of your account."}
          </p>
        </div>

        {/* Role switcher dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="flat" 
              endContent={<ChevronDown className="h-4 w-4" />}
              className="w-full md:w-[200px] bg-default-100 text-foreground"
            >
              {currentRole === "client" ? (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Client View</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Photographer View</span>
                </div>
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="User role selection"
            onAction={(key) => handleRoleChange(key as string)}
            classNames={{
              base: "bg-background border border-default-100"
            }}
          >
            <DropdownItem 
              key="client" 
              startContent={<User className="h-4 w-4" />}
              className="text-foreground data-[hover=true]:bg-default-200"
            >
              Client View
            </DropdownItem>
            <DropdownItem 
              key="photographer" 
              startContent={<Camera className="h-4 w-4" />}
              className="text-foreground data-[hover=true]:bg-default-200"
            >
              Photographer View
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {currentRole === "client" ? <ClientDashboard /> : <PhotographerDashboard />}
    </div>
  )
}

