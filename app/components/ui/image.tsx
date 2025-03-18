'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ResponsiveImage({ src, alt, className = '' }: ResponsiveImageProps) {
  const [isError, setIsError] = useState(false);
  
  const fallbackImage = "/images/fallback.jpg"; // Use a local fallback image
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={isError ? fallbackImage : src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setIsError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ 
          objectFit: "cover",
          color: "transparent"
        }}
      />
    </div>
  );
} 