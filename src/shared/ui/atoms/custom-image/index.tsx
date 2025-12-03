import { cn } from '@/core/utils/cn';
import React from 'react';
// Define the image data structure
export interface ImageData {
  src: string;
  id: string;
  alt: string;
  category: string;
  tags: string[];
}

// Define component props
export interface ImageAtomProps {
  src?: string; // Optional: if you want to pass a specific image URL
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadowPosition?: 'default' | 'br' | 'bl' | 'tr' | 'tl';
  shadowOpacity?: 'default' | 'full' | '50' | '25' | '10';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  backgroundColor?: 'light' | 'dark' | 'transparent' | 'default';
}

// Size configurations
const SIZE_CLASSES = {
  default: '',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
  full: 'md:w-[24rem] xl:w-full xl:h-full wide:w-[40rem]',
} as const;

// Shadow position configurations
const SHADOW_POSITION_CLASSES = {
  default: '',
  tl: 'left-[-.5rem] md:left-[-1rem] top-[-.5rem] md:top-[-1rem]',
  tr: 'right-[-.5rem] md:right-[-1rem] top-[-.5rem] md:top-[-1rem]',
  bl: 'left-[-.5rem] md:left-[-1rem] bottom-[-.5rem] md:bottom-[-1rem]',
  br: 'right-[-.5rem] md:right-[-1rem] bottom-[-.5rem] md:bottom-[-1rem]',
} as const;

// Shadow Opacity configurations
const SHADOW_OPACITY_CLASSES = {
  default: '',
  full: 'opacity-full',
  '50': 'opacity-50',
  '25': 'opacity-25',
  '10': 'opacity-10',
} as const;

// Rounded configurations
const ROUNDED_CLASSES = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

// Aspect ratio configurations
const ASPECT_RATIO_CLASSES = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4.5]',
  landscape: 'aspect-[4.5/3]',
  auto: '',
} as const;

// Object fit configurations
const OBJECT_FIT_CLASSES = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
} as const;

const BACKGROUND_COLOR_CLASSES = {
  default: '',
  light: 'bg-white',
  dark: 'bg-gray-800',
  transparent: 'bg-transparent',
} as const;

const CustomImageAtom: React.FC<ImageAtomProps> = ({
  src = '',
  size = 'md',
  shadowPosition = 'default',
  shadowOpacity = 'default',
  rounded = 'md',
  aspectRatio = 'auto',
  objectFit = 'cover',
  className = '',
  backgroundColor = 'default',
  onClick,
  loading = 'lazy',
}) => {
  // Combine all classes

  return (
    <div className="relative inline-block z-1">
      {shadowOpacity !== 'default' && (
        <div
          className={`w-[95%] h-full z-[-1] bg-primary absolute ${ROUNDED_CLASSES[rounded]} ${SHADOW_POSITION_CLASSES[shadowPosition]} ${SHADOW_OPACITY_CLASSES[shadowOpacity]} ${BACKGROUND_COLOR_CLASSES[backgroundColor]}`}
        ></div>
      )}
      <img
        src={src}
        className={cn(
          SIZE_CLASSES[size],
          ROUNDED_CLASSES[rounded],
          ASPECT_RATIO_CLASSES[aspectRatio],
          OBJECT_FIT_CLASSES[objectFit],
          'transition-all duration-300 ease-in-out',
          onClick ? 'cursor-pointer hover:scale-105' : '',
          className
        )}
        onClick={onClick}
        loading={loading}
      />

      {/* Optional overlay for interactive states */}
      {onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 rounded-inherit" />
      )}
    </div>
  );
};

export default CustomImageAtom;
