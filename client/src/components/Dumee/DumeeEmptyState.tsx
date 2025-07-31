import React from 'react';
import { MessageSquare, Search, Sparkles } from 'lucide-react';
import { DumeeButton } from './DumeeButton';

interface DumeeEmptyStateProps {
  type?: 'no-conversations' | 'no-results' | 'no-agents' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const DumeeEmptyState: React.FC<DumeeEmptyStateProps> = ({
  type = 'no-conversations',
  title,
  description,
  action,
  className,
}) => {
  const states = {
    'no-conversations': {
      icon: <MessageSquare className="w-16 h-16" />,
      emoji: 'ðŸ’¬',
      defaultTitle: 'No conversations yet',
      defaultDescription: 'Start a new chat to begin your learning adventure!',
    },
    'no-results': {
      icon: <Search className="w-16 h-16" />,
      emoji: 'ðŸ”',
      defaultTitle: 'No results found',
      defaultDescription: 'Try adjusting your search or explore different categories',
    },
    'no-agents': {
      icon: <Sparkles className="w-16 h-16" />,
      emoji: 'ðŸ¤–',
      defaultTitle: 'No agents available',
      defaultDescription: 'Check back soon for new AI personalities!',
    },
    'error': {
      icon: <MessageSquare className="w-16 h-16" />,
      emoji: 'ðŸ˜…',
      defaultTitle: 'Oops! Something went wrong',
      defaultDescription: "Don't worry, even AI makes mistakes sometimes!",
    },
  };

  const state = states[type];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="mb-6 relative">
        <div className="text-gray-300 dark:text-gray-600">
          {state.icon}
        </div>
        <span className="absolute -top-2 -right-2 text-3xl dumee-bounce">
          {state.emoji}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title || state.defaultTitle}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {description || state.defaultDescription}
      </p>
      
      {action && (
        <DumeeButton
          variant="primary"
          onClick={action.onClick}
          emoji="âœ¨"
        >
          {action.label}
        </DumeeButton>
      )}
    </div>
  );
};
