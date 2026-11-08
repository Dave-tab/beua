import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#eeeae0] ${containerClassName}`}>
      {/* Shimmer / Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-[#eeeae0] via-[#f7f5ef] to-[#eeeae0] animate-pulse">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-8 h-8 rounded-full border-2 border-[#16382c]/30 border-t-[#16382c] animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#717b75]">
              Loading asset...
            </span>
          </div>
        </div>
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-105 blur-xs'
        } ${className}`}
        {...props}
      />

      {/* Fallback if network fails */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#eae5d8] text-xs font-mono text-[#717b75] p-4 text-center">
          <span>Curated Asset Preview</span>
        </div>
      )}
    </div>
  );
};
