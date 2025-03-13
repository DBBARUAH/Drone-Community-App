"use client";

import React, { useRef, useState, useEffect } from "react";
import { useVideoPlayer } from "@hooks/video-player-context";
import { useIntersectionObserver } from "@hooks/user-interaction-observer";
import styles from "@styles/capturedStories.module.css";

interface ClientCardProps {
  logoSrc: string;
  logoAlt: string;
  videoSrc: string;          // The real URL to the video
  overlayClassName: string;  // Additional overlay styling
}

/**
 * A single "client card" that lazy loads and auto-plays on hover/click.
 */
const ClientCard: React.FC<ClientCardProps> = ({
  logoSrc,
  logoAlt,
  videoSrc,
  overlayClassName,
}) => {
  const { setCurrentlyPlaying } = useVideoPlayer();

  // Refs to the video and the overlay DOM elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Intersection Observer: watch the card or the video element (whichever you prefer).
  // We'll watch the video element so we only load it when that element is in view.
  const intersectionEntry = useIntersectionObserver(videoRef, {
    threshold: 0.5, // 50% of the video in view
  });
  const isInView = !!intersectionEntry?.isIntersecting;

  // We'll store the "loadedSrc" in state, so once we've loaded it, it stays set.
  const [loadedSrc, setLoadedSrc] = useState<string>("");

  // For toggling overlay (could also do this purely in CSS if you like)
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  // 1) Lazy-load the video src once it’s in view
  useEffect(() => {
    if (!loadedSrc && isInView) {
      // The user "data-src" concept was to store videoSrc in an attribute.
      // In React, we can just do it in state.
      setLoadedSrc(videoSrc);
    }
  }, [isInView, loadedSrc, videoSrc]);

  // 2) Function to actually play the video
  const playVideo = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Pause any other playing video
    setCurrentlyPlaying(videoEl);

    // Attempt to play
    videoEl
      .play()
      .then(() => setShowOverlay(true))
      .catch((err) => console.error("Video play error:", err));
  };

  // 3) Function to pause the video
  const pauseVideo = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.pause();
    setShowOverlay(false);
  };

  // 4) Mouse/touch events
  const handleMouseEnter = () => {
    // Only do hover play if desktop
    if (window.innerWidth > 768) {
      playVideo();
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      pauseVideo();
    }
  };

  const handleClick = () => {
    // On mobile, user taps to play
    if (window.innerWidth <= 768) {
      playVideo();
    }
  };

  return (
    <div
      className={styles["client-card"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={styles["client-logo"]}>
        <img src={logoSrc} alt={logoAlt} />
      </div>

      <div className={styles["client-video"]}>
        <video
          ref={videoRef}
          // Only set src once we decide to lazy-load it
          src={loadedSrc || undefined}
          muted
          loop
          playsInline
        />
      </div>

      {/* The overlay that shows when video is playing */}
      <div
        ref={overlayRef}
        className={`${styles["logo-overlay"]} ${overlayClassName}`}
        style={{ display: showOverlay ? "flex" : "none" }}
      >
        <img src={logoSrc} alt={`${logoAlt} Overlay`} />
      </div>
    </div>
  );
};

export default ClientCard;