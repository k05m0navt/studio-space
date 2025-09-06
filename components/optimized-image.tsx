"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({ src, alt, width, height, className, priority = false, sizes, quality = 75 }: OptimizedImageProps) {
  // Simple, reliable wrapper for Next.js Image — preserves existing props used throughout the app.
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image src={src} alt={alt} fill quality={quality} sizes={sizes} priority={priority} className={className} />
  );
}

// Gallery component with optimized images
interface GalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  className?: string;
}

export function OptimizedGallery({ images, columns = 3, className }: GalleryProps) {
  return (
    <div 
      className={cn(
        'grid gap-4',
        {
          'grid-cols-1': columns === 1,
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
        },
        className
      )}
    >
      {images.map((image, index) => (
        <div key={index} className="group relative">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={400}
            height={300}
            className="w-full h-48 rounded-lg group-hover:scale-105 transition-transform duration-300"
            priority={index < 3} // Prioritize first 3 images
          />
          {image.caption && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// Responsive image sizes helper
export const imageSizes = {
  hero: '100vw',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
  gallery: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
  profile: '(max-width: 768px) 30vw, 10vw',
  full: '100vw',
}; 