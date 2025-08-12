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

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Generate blur placeholder if not provided
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const imageProps = {
    src,
    alt,
    quality,
    sizes,
    priority,
    loading: (priority ? 'eager' : loading) as 'lazy' | 'eager',
    placeholder: placeholder, 
    blurDataURL: defaultBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    style: { objectFit },
    fetchPriority: (priority ? 'high' : 'auto') as 'auto' | 'low' | 'high',
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
  };

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        isLoading && 'animate-pulse',
        className
      )}
      style={{ width, height }}
    >
      {hasError ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
          <span className="text-sm">Failed to load image</span>
        </div>
      ) : isInView ? (
        width && height ? (
          <Image
            {...imageProps}
            width={width}
            height={height}
            fill={false}
          />
        ) : (
          <Image
            {...imageProps}
            fill
          />
        )
      ) : (
        <div className="w-full h-full bg-gray-100" />
      )}
      
      {/* Loading spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
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