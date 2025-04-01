"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, User, Camera } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react"

import { cn } from "@/lib/utils"

const roles = [
  {
    value: "client",
    label: "Client View",
    icon: User,
  },
  {
    value: "photographer",
    label: "Photographer View",
    icon: Camera,
  },
]

interface RoleSwitcherProps {
  onRoleChange: (role: string) => void
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [value, setValue] = useState("client")

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="w-full justify-between md:w-[200px]"
          endContent={<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
        >
          <div className="flex items-center gap-2">
            {(() => {
              const selectedRole = roles.find((role) => role.value === value);
              if (selectedRole?.icon) {
                const IconComponent = selectedRole.icon;
                return <IconComponent className="h-4 w-4" />;
              }
              return null;
            })()}
            {roles.find((role) => role.value === value)?.label}
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Role selection"
        selectionMode="single"
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const selectedValue = Array.from(keys)[0]?.toString();
          if (selectedValue) {
            setValue(selectedValue);
            onRoleChange(selectedValue);
          }
        }}
      >
        {roles.map((role) => (
          <DropdownItem key={role.value} textValue={role.label}>
            <div className="flex items-center gap-2">
              {(() => {
                const IconComponent = role.icon;
                return <IconComponent className="h-4 w-4" />;
              })()}
              {role.label}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

