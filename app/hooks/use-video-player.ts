import { RefObject, useState, useCallback } from 'react';

interface UseVideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  onPlay?: () => void;
  onPause?: () => void;
}

export function useVideoPlayer({ videoRef, onPlay, onPause }: UseVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const play = useCallback(async () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Store the play promise so we can check it before pausing
      const playPromise = videoEl.play();
      
      // Make sure we wait for the promise to resolve before considering the video as playing
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to play video'));
      console.error('Video play error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [videoRef, onPlay]);

  const pause = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Only pause if the video is actually playing
    if (!videoEl.paused) {
      try {
        videoEl.pause();
        setIsPlaying(false);
        onPause?.();
      } catch (err) {
        console.error('Video pause error:', err);
      }
    }
  }, [videoRef, onPause]);

  return {
    isPlaying,
    isLoading,
    error,
    play,
    pause,
  };
} 