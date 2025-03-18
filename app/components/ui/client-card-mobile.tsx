"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ClientData } from "@/types/client";

interface ClientCardMobileProps extends React.HTMLAttributes<HTMLDivElement> {
  clients: ClientData[];
  onVideoPlay?: (videoSrc: string) => void;
  currentIndex?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

export const ClientCardMobile = React.forwardRef<HTMLDivElement, ClientCardMobileProps>(
  ({ 
    className, 
    clients, 
    onVideoPlay, 
    currentIndex = 0,
    showArrows = true,
    showDots = true,
    ...props 
  }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(currentIndex);
    const [exitX, setExitX] = React.useState<number>(0);

    const handleDragEnd = (
      event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (Math.abs(info.offset.x) > 100) {
        setExitX(info.offset.x);
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % clients.length);
          setExitX(0);
        }, 200);
      }
    };

    if (!clients?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "h-72 w-full flex items-center justify-center md:hidden",
          className
        )}
        {...props}
      >
        <div className="relative w-80 h-64">
          {clients.map((client, index) => {
            const isCurrentCard = index === activeIndex;
            const isPrevCard = index === (activeIndex + 1) % clients.length;
            const isNextCard = index === (activeIndex + 2) % clients.length;

            if (!isCurrentCard && !isPrevCard && !isNextCard) return null;

            return (
              <motion.div
                key={client.id}
                className={cn(
                  "absolute w-full h-full rounded-2xl cursor-grab active:cursor-grabbing",
                  "bg-white shadow-xl",
                  "dark:bg-card dark:shadow-[2px_2px_4px_rgba(0,0,0,0.4),-1px_-1px_3px_rgba(255,255,255,0.1)]",
                )}
                style={{
                  zIndex: isCurrentCard ? 3 : isPrevCard ? 2 : 1,
                }}
                drag={isCurrentCard ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={isCurrentCard ? handleDragEnd : undefined}
                initial={{
                  scale: 0.95,
                  opacity: 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 8 : 16,
                  rotate: isCurrentCard ? 0 : isPrevCard ? -2 : -4,
                }}
                animate={{
                  scale: isCurrentCard ? 1 : 0.95,
                  opacity: isCurrentCard ? 1 : isPrevCard ? 0.6 : 0.3,
                  x: isCurrentCard ? exitX : 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 8 : 16,
                  rotate: isCurrentCard ? exitX / 20 : isPrevCard ? -2 : -4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                onClick={() => isCurrentCard && onVideoPlay?.(client.videoSrc)}
              >
                {showArrows && isCurrentCard && (
                  <div className="absolute inset-x-0 top-2 flex justify-between px-4">
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex((prev) => (prev - 1 + clients.length) % clients.length);
                      }}
                      className="text-2xl select-none cursor-pointer text-gray-300 hover:text-gray-400 dark:text-muted-foreground dark:hover:text-primary"
                    >
                      &larr;
                    </span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex((prev) => (prev + 1) % clients.length);
                      }}
                      className="text-2xl select-none cursor-pointer text-gray-300 hover:text-gray-400 dark:text-muted-foreground dark:hover:text-primary"
                    >
                      &rarr;
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={client.logoSrc}
                      alt={client.logoAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground">
                    {client.title}
                  </h3>
                  <p className="text-center text-sm text-gray-600 dark:text-muted-foreground">
                    {client.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
          {showDots && (
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
              {clients.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === activeIndex
                      ? "bg-blue-500 dark:bg-primary"
                      : "bg-gray-300 dark:bg-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ClientCardMobile.displayName = "ClientCardMobile"; 