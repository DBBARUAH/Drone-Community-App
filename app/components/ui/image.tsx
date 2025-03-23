'use client';

import Image from 'next/image';
import { useState } from 'react';

// Make sure this path exists in your public folder
const fallbackImage = '/images/placeholder.jpg';

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  unoptimized?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  unoptimized = false,
}: ResponsiveImageProps) {
  const [isError, setIsError] = useState(false);

  // Always use unoptimized for external domains to bypass domain configuration issues
  const isExternalDomain = src.startsWith('http') && !src.includes(window.location.hostname);
  const shouldUseUnoptimized = unoptimized || isExternalDomain;

  // Check if we need to use fill or explicit dimensions
  const useFill = !width || !height;

  // Use a local fallback if there's an error
  const imageSrc = isError ? fallbackImage : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {useFill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          unoptimized={shouldUseUnoptimized}
          onError={() => setIsError(true)}
          className="object-cover"
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized={shouldUseUnoptimized}
          onError={() => setIsError(true)}
          className="object-cover"
        />
      )}
    </div>
  );
} 