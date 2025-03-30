"use client"

import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { LogOut, Settings, User, Calendar } from "lucide-react"

export function UserNav() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          className="transition-transform"
          color="primary"
          name="TB"
          size="sm"
          src="/placeholder-user.jpg"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-foreground-500">john.doe@example.com</span>
          </div>
        </DropdownItem>
        <DropdownItem key="profile-page" startContent={<User className="h-4 w-4" />}>
          Profile
        </DropdownItem>
        <DropdownItem key="bookings" as="a" href="/dashboard/bookings" startContent={<Calendar className="h-4 w-4" />}>
          My Bookings
        </DropdownItem>
        <DropdownItem key="settings" startContent={<Settings className="h-4 w-4" />}>
          Settings
        </DropdownItem>
        <DropdownItem key="logout" startContent={<LogOut className="h-4 w-4" />} color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

