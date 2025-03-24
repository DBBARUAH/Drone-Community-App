/* File: app/components/ui/image.tsx */
'use client';

import Image from 'next/image';
import { useState } from 'react';

// Path to a local fallback image in your public folder
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

  // Safely determine if the image source is from an external domain.
  // We check if 'window' is defined before accessing it.
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isExternalDomain = src.startsWith('http') && (hostname ? !src.includes(hostname) : true);
  const shouldUseUnoptimized = unoptimized || isExternalDomain;

  // Decide whether to use fill mode (if width/height are not provided)
  const useFill = !width || !height;
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