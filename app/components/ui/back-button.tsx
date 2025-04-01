'use client';

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group fixed left-5 bottom-8 z-10 -translate-y-1/2 flex items-center gap-0 
        rounded-full bg-gradient-to-r from-gray-800/90 to-gray-700/80 px-3 py-2.5 
        backdrop-blur-sm transition-all duration-300 shadow-lg
        hover:from-gray-700/90 hover:to-gray-600/80 hover:gap-2 hover:px-5"
    >
      <ChevronLeft 
        className="h-5 w-5 text-white/90 transition-transform duration-300
          group-hover:text-white group-hover:-translate-x-1" 
      />
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-playfair text-base 
        text-white/80 transition-all duration-300 group-hover:max-w-[200px] group-hover:text-white">
        Back to Blog
      </span>
    </button>
  );
} 