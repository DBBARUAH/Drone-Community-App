"use client";

import React, { useRef, useState, useEffect } from "react";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { useIntersectionObserver } from "@/hooks/user-interaction-observer";
import { cn } from "@/lib/utils";
import styles from "@styles/capturedStories.module.css";
import Image from "next/image";

interface ClientCardProps {
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

  // Improved video player hook usage
  const { isPlaying, isLoading, error, play, pause } = useVideoPlayer({
    videoRef,
    onPlay: () => console.log("Video started playing"),
    onPause: () => console.log("Video paused"),
  });

  // Improved intersection observer usage
  const entry = useIntersectionObserver(cardRef, {
    threshold: 0.5,
    freezeOnceVisible: false,
  });

  const isInView = entry?.isIntersecting;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      // Add a small delay before pausing to avoid race conditions
      const timeoutId = setTimeout(() => {
        pause();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isMobile, isInView, isPlaying, pause]);

  // Event handlers
  const handleMouseEnter = () => {
    if (!isMobile) play();
  };

  const handleMouseLeave = () => {
    if (!isMobile && isPlaying) {
      // Add a small delay before pausing
      setTimeout(() => {
        pause();
      }, 50);
    }
  };

  const handleClick = () => {
    if (!isMobile) return;
    isPlaying ? pause() : play();
  };

  return (
    <div className={styles["client-card"]} ref={cardRef}>
      <div
        className={cn(styles["card-inner"], {
          [styles["loading"]]: isLoading,
          [styles["error"]]: error,
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
          {isMobile && !isPlaying && (
            <div className={styles["play-indicator"]}>
              <span className={styles["play-icon"]} />
            </div>
          )}
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
