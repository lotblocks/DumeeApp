import React from 'react';
import { cn } from '~/utils';

interface DumeeAvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export const DumeeAvatar: React.FC<DumeeAvatarProps> = ({
  src,
  name,
  size = 'md',
  variant = 'circle',
  status,
  className,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const variants = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const gradientColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-pink-600',
  ];

  const getGradient = () => {
    const index = name.charCodeAt(0) % gradientColors.length;
    return gradientColors[index];
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          aria-label={`Avatar for ${name}`}
          className={cn(
            sizes[size],
            variants[variant],
            'object-cover',
            className
          )}
        />
      ) : (
        <div
          className={cn(
            sizes[size],
            variants[variant],
            `bg-gradient-to-br ${getGradient()}`,
            'flex items-center justify-center text-white font-semibold',
            className
          )}
        >
          {getInitials(name)}
        </div>
      )}
      
      {status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 border-2 border-white dark:border-gray-800 rounded-full',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};
