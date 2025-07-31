import React from 'react';
import { cn } from '~/utils';
import { DumeeAvatar } from './DumeeAvatar';

interface DumeeChatBubbleProps {
  message: string;
  isUser?: boolean;
  avatar?: {
    src?: string;
    name: string;
  };
  timestamp?: string;
  reactions?: Array<{
    emoji: string;
    count: number;
  }>;
  className?: string;
}

export const DumeeChatBubble: React.FC<DumeeChatBubbleProps> = ({
  message,
  isUser = false,
  avatar,
  timestamp,
  reactions,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {avatar && (
        <DumeeAvatar
          src={avatar.src}
          name={avatar.name}
          size="sm"
          className="flex-shrink-0"
        />
      )}
      
      <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'max-w-xl px-4 py-3 rounded-2xl transition-all duration-200',
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm',
            'hover:shadow-md'
          )}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
        
        {timestamp && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
            {timestamp}
          </span>
        )}
        
        {reactions && reactions.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
              >
                <span className="dumee-emoji-wave">{reaction.emoji}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {reaction.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
