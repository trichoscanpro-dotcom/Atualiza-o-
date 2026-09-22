import React, { useState } from 'react';
import { beverageImages } from '../assets/beverageImages';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  category?: string;
  fallbackSrc?: string;
  className?: string;
}

// Highly reliable, verified local fallbacks per beverage category (100% beverage authentic)
const CATEGORY_FALLBACKS: Record<string, string> = {
  cervejas: beverageImages.beerHeinekenCold,
  combos: beverageImages.comboBlackRedBull,
  destilados: beverageImages.whiskyBlackLabel,
  vinhos: beverageImages.wineCabernetBottle,
  gelo_essenciais: beverageImages.iceBagCubes,
  sem_alcool: beverageImages.redBullCanChilled,
  snacks: beverageImages.beerSpatenMunich,
  default: beverageImages.beerColdFreezer,
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  category = 'default',
  fallbackSrc,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If the src prop changes dynamically, reset state
  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      // First attempt: try category fallback or custom fallback
      const secondary = fallbackSrc || CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;
      if (imgSrc !== secondary) {
        setImgSrc(secondary);
        setHasError(true);
      }
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={handleError}
      className={`${className} ${!isLoaded ? 'opacity-90' : 'opacity-100'} transition-opacity duration-300`}
      {...props}
    />
  );
};
