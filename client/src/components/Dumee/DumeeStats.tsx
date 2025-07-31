import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '~/utils';

interface DumeeStatsProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const DumeeStats: React.FC<DumeeStatsProps> = ({
  label,
  value,
  change,
  icon,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'bg-gray-50 dark:bg-gray-800',
    primary: 'bg-blue-50 dark:bg-blue-900/20',
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
  };

  const iconColors = {
    default: 'text-gray-600 dark:text-gray-400',
    primary: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  };

  const getTrendIcon = () => {
    if (!change) return null;
    
    if (change.value === 0) {
      return <Minus className="w-4 h-4" />;
    }
    
    return change.isPositive ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const getTrendColor = () => {
    if (!change || change.value === 0) return 'text-gray-500';
    return change.isPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div
      className={cn(
        'p-6 rounded-xl transition-all duration-200',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <div className={cn('flex items-center mt-2 text-sm', getTrendColor())}>
              {getTrendIcon()}
              <span className="ml-1">
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-lg', iconColors[variant])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
