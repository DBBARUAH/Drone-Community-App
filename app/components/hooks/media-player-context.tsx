"use client";

import React, { createContext, useState } from 'react';

interface MediaPlayerContextType {
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (src: string | null) => void;
}

export const MediaPlayerContext = createContext<MediaPlayerContextType>({
  currentlyPlaying: null,
  setCurrentlyPlaying: () => {},
});

export const MediaPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  return (
    <MediaPlayerContext.Provider value={{ currentlyPlaying, setCurrentlyPlaying }}>
      {children}
    </MediaPlayerContext.Provider>
  );
}; 