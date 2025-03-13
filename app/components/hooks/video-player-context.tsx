"use client"; // Must be a client component to use state, context, etc.

import React, { createContext, useContext, useRef, ReactNode } from "react";

interface VideoPlayerContextValue {
  currentlyPlayingRef: React.MutableRefObject<HTMLVideoElement | null>;
  setCurrentlyPlaying: (videoEl: HTMLVideoElement) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue>({
  currentlyPlayingRef: { current: null },
  setCurrentlyPlaying: () => {},
});

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  // We store the "current playing video" in a ref so we can pause it if a new one starts
  const currentlyPlayingRef = useRef<HTMLVideoElement | null>(null);

  function setCurrentlyPlaying(videoEl: HTMLVideoElement) {
    // If there's another video playing, pause it
    if (currentlyPlayingRef.current && currentlyPlayingRef.current !== videoEl) {
      currentlyPlayingRef.current.pause();
    }
    // Update the ref to the new video
    currentlyPlayingRef.current = videoEl;
  }

  return (
    <VideoPlayerContext.Provider value={{ currentlyPlayingRef, setCurrentlyPlaying }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

// A convenience hook to access our context
export function useVideoPlayer() {
  return useContext(VideoPlayerContext);
}