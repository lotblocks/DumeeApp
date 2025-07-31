import React from 'react';
import { cn } from '~/utils';

interface DumeeTypingIndicatorProps {
  agentName?: string;
  className?: string;
}

export const DumeeTypingIndicator: React.FC<DumeeTypingIndicatorProps> = ({
  agentName = 'Dumee',
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 text-gray-500 dark:text-gray-400', className)}>
      <div className="flex items-center gap-1">
        <span className="text-sm">{agentName} is thinking</span>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <span className="text-lg dumee-bounce">ðŸ¤”</span>
    </div>
  );
};
