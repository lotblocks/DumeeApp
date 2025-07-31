import React from 'react';
import { cn } from '~/utils';

interface DumeeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  emoji?: string;
  children: React.ReactNode;
}

export const DumeeButton: React.FC<DumeeButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  emoji,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-[var(--dumee-transition-base)] rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dumee-hover-lift';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500',
    accent: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white focus:ring-orange-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    gradient: 'dumee-gradient-border bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const loadingSpinner = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && loadingSpinner}
      {emoji && !isLoading && (
        <span className="dumee-emoji-wave mr-2 text-lg">{emoji}</span>
      )}
      {children}
    </button>
  );
};
