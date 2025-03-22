import { useCallback, useEffect, useState, useContext } from 'react';
import { MediaPlayerContext } from './media-player-context';

interface UseMediaPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoSrc: string;
  onPlay?: () => void;
  onPause?: () => void;
}

export function useMediaPlayer({
  videoRef,
  videoSrc,
  onPlay,
  onPause,
}: UseMediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { currentlyPlaying, setCurrentlyPlaying } = useContext(MediaPlayerContext);

  const play = useCallback(async () => {
    try {
      if (videoRef.current) {
        if (currentlyPlaying && currentlyPlaying !== videoSrc) {
          const videos = document.querySelectorAll('video');
          videos.forEach(video => {
            if (video !== videoRef.current) {
              video.pause();
            }
          });
        }
        
        setIsPlaying(true);
        setCurrentlyPlaying(videoSrc);
        
        await videoRef.current.play();
        onPlay?.();
      }
    } catch (err) {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setError(err instanceof Error ? err : new Error('Failed to play video'));
    } finally {
      setIsLoading(false);
    }
  }, [videoRef, videoSrc, currentlyPlaying, setCurrentlyPlaying, onPlay]);

  const pause = useCallback(() => {
    if (videoRef.current) {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      videoRef.current.pause();
      onPause?.();
    }
  }, [videoRef, setCurrentlyPlaying, onPause]);

  useEffect(() => {
    if (currentlyPlaying && currentlyPlaying !== videoSrc && isPlaying) {
      pause();
    }
  }, [currentlyPlaying, videoSrc, isPlaying, pause]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoading(false);
    const handleError = (e: ErrorEvent) => setError(e.error);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoRef]);

  return { isPlaying, isLoading, error, play, pause };
}

export { MediaPlayerProvider } from './media-player-context'; 