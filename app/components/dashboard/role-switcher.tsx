"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, User, Camera } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("client")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-[200px]"
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
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search role..." />
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.value}
                  value={role.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    onRoleChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    {(() => {
                      const selectedRole = roles.find((r) => r.value === role.value);
                      if (selectedRole?.icon) {
                        const IconComponent = selectedRole.icon;
                        return <IconComponent className="h-4 w-4" />;
                      }
                      return null;
                    })()}
                    {role.label}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === role.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

