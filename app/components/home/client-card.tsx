"use client";

import React, { useState } from "react";

interface ClientCardProps {
  logoSrc: string;
  logoAlt: string;
  videoSrc: string;
  overlayClassName?: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  logoSrc,
  logoAlt,
  videoSrc,
  overlayClassName
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className="client-card relative overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`logo-overlay absolute inset-0 z-10 flex items-center justify-center ${overlayClassName}`}>
        <img src={logoSrc} alt={logoAlt} className="max-w-[70%] max-h-[70%] object-contain" />
      </div>
      <video
        src={videoSrc}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        autoPlay={isPlaying}
      />
    </div>
  );
}; 