import React from 'react';
import { cn } from '~/utils';

interface DumeeLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bounce';
  text?: string;
  className?: string;
}

export const DumeeLoader: React.FC<DumeeLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  className,
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn('dumee-spinner', sizes[size])} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-gradient-to-r from-blue-500 to-purple-600',
                  size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3',
                  'animate-bounce'
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn(
            'rounded-full bg-gradient-to-r from-blue-500 to-purple-600',
            sizes[size],
            'animate-pulse'
          )} />
        );
      
      case 'bounce':
        return (
          <div className="flex flex-col items-center">
            <span className={cn('text-4xl dumee-bounce', size === 'xl' && 'text-6xl')}>
              ðŸ¤”
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {renderLoader()}
      {text && (
        <p className={cn(
          'text-gray-600 dark:text-gray-400 font-medium animate-pulse',
          textSizes[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};
