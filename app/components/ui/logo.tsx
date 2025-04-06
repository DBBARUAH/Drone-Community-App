import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/images/logo_color.jpg"
        alt="Travellers Beats Logo"
        width={30}
        height={40}
        priority
        className="w-auto h-auto"
      />
    </Link>
  )
}

