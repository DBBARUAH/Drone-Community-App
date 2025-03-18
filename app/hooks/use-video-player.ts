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
      await videoEl.play();
      setIsPlaying(true);
      onPlay?.();
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

    try {
      videoEl.pause();
      setIsPlaying(false);
      onPause?.();
    } catch (err) {
      console.error('Video pause error:', err);
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