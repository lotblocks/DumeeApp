import React from 'react';
import { cn } from '~/utils';

interface DumeeBadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const DumeeBadge: React.FC<DumeeBadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  className,
  children,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    accent: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-orange-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};
