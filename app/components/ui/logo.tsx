import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
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

