import React from 'react';
import { cn } from '~/utils';

interface DumeeCardProps {
  variant?: 'default' | 'glass' | 'gradient' | 'hover';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const DumeeCard: React.FC<DumeeCardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  onClick,
}) => {
  const baseStyles = 'rounded-xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700',
    glass: 'dumee-glass shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border border-gray-200 dark:border-gray-700',
    hover: 'bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] cursor-pointer',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
