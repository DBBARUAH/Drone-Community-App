"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface VideoPlayerContextValue {
  currentlyPlayingRef: React.MutableRefObject<HTMLVideoElement | null>;
  setCurrentlyPlaying: (videoEl: HTMLVideoElement) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const currentlyPlayingRef = React.useRef<HTMLVideoElement | null>(null);

  const setCurrentlyPlaying = (videoEl: HTMLVideoElement) => {
    if (currentlyPlayingRef.current && currentlyPlayingRef.current !== videoEl) {
      currentlyPlayingRef.current.pause();
    }
    currentlyPlayingRef.current = videoEl;
  };

  return (
    <VideoPlayerContext.Provider value={{ currentlyPlayingRef, setCurrentlyPlaying }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayerContext() {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayerContext must be used within a VideoPlayerProvider');
  }
  return context;
} 