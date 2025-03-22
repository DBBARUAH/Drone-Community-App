"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMediaPlayer } from "@hooks/use-media-player";
import { useIntersectionObserver } from "@hooks/use-intersection-observer";
import styles from "@/styles/capturedStories.module.css";
import type { ClientData } from "@/types/client";

interface ClientCardProps extends Partial<ClientData> {
  logoSrc: string;
  logoAlt: string;
  videoSrc: string;
  overlayClassName?: string;
}

export function ClientCard({
  logoSrc,
  logoAlt,
  videoSrc,
  overlayClassName,
}: ClientCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState("");
  const [hasInteracted, setHasInteracted] = useState(() => {
    // Check if user has interacted before
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasInteractedWithCard') === 'true';
    }
    return false;
  });

  const { isPlaying, isLoading, error, play, pause } = useMediaPlayer({
    videoRef,
    videoSrc,
    onPlay: () => console.log("Video started playing"),
    onPause: () => console.log("Video paused"),
  });

  const entry = useIntersectionObserver(cardRef, {
    threshold: 0.5,
    freezeOnceVisible: false,
  });

  const isInView = entry?.isIntersecting;

  // Mobile detection with debounced resize handler
  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load video when in view
  useEffect(() => {
    if (isInView && !loadedSrc) {
      setLoadedSrc(videoSrc);
    }
  }, [isInView, loadedSrc, videoSrc]);

  // Auto-pause when out of view on mobile
  useEffect(() => {
    if (isMobile && !isInView && isPlaying) {
      pause();
    }
  }, [isMobile, isInView, isPlaying, pause]);

  const handleMouseEnter = () => !isMobile && play();
  const handleMouseLeave = () => !isMobile && isPlaying && setTimeout(pause, 50);
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem('hasInteractedWithCard', 'true');
    }
  };

  const handleClick = () => {
    if (isMobile) {
      handleFirstInteraction();
      isPlaying ? pause() : play();
    }
  };

  return (
    <div className={styles["client-card"]} ref={cardRef}>
      <div
        className={cn(styles["card-inner"], {
          [styles["loading"]]: isLoading,
          [styles["error"]]: error,
          [styles["not-interacted"]]: !hasInteracted && isMobile,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className={cn(styles["client-logo"], {
            [styles["hidden"]]: isPlaying
          })}
        >
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={200}
            height={200}
            className="object-contain w-auto h-auto"
            priority
          />
        </div>

        <div
          className={cn(styles["client-video"], {
            [styles["visible"]]: isPlaying,
          })}
        >
          <video
            ref={videoRef}
            src={loadedSrc || undefined}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {isPlaying && (
          <div 
            className={cn(
              styles["logo-overlay"], 
              overlayClassName,
              {
                [styles["mobile-overlay"]]: isMobile,
                [styles["desktop-overlay"]]: !isMobile
              }
            )}
          >
            <Image
              src={logoSrc}
              alt={`${logoAlt} Overlay`}
              width={100}
              height={100}
              className="object-contain w-auto h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function for resize debouncing
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
