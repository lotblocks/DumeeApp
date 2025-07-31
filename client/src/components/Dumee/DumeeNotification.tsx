import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '~/utils';

interface DumeeNotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  emoji?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const DumeeNotification: React.FC<DumeeNotificationProps> = ({
  type = 'info',
  title,
  message,
  emoji,
  duration = 5000,
  onClose,
  className,
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      defaultEmoji: 'âœ…',
      colors: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5" />,
      defaultEmoji: 'âŒ',
      colors: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      defaultEmoji: 'âš ï¸',
      colors: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      defaultEmoji: 'ðŸ’¡',
      colors: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    },
  };

  const config = types[type];

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg border shadow-lg',
        'transform transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-top-2',
        config.colors,
        className
      )}
    >
      <div className="flex-shrink-0 mr-3">
        <span className="text-2xl dumee-emoji-wave">
          {emoji || config.defaultEmoji}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold">
          {title}
        </h4>
        {message && (
          <p className="mt-1 text-sm opacity-90">
            {message}
          </p>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
