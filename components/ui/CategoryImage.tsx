import { useState } from 'react';
import { getImageUrl } from '@/lib/api';

interface CategoryImageProps {
  imageUrl?: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export default function CategoryImage({ 
  imageUrl, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackIcon 
}: CategoryImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Default fallback icon
  const defaultFallbackIcon = (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="relative w-full h-full">
      {/* Loading state */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image or fallback */}
      {!imageError && imageUrl ? (
        <img
          src={getImageUrl(imageUrl)}
          alt={alt}
          className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {fallbackIcon || defaultFallbackIcon}
        </div>
      )}
    </div>
  );
}
