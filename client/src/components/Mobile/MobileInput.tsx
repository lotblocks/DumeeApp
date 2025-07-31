import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';

interface MobileInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
  maxLength = 4000,
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Haptic feedback function
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[style]);
    }
  };

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      triggerHaptic('medium');
      onSubmit(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 
      bg-gray-900 border-t border-gray-700
      transition-all duration-200
      ${isFocused ? 'pb-2' : 'pb-safe'}
    `}>
      <div className="flex items-end gap-2 p-3 max-w-4xl mx-auto">
        {/* Attachment button */}
        <Button
          onClick={() => triggerHaptic('light')}
          className="mb-2 p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          disabled={disabled}
          aria-label="Add attachment"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </Button>

        {/* Input field */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              triggerHaptic('light');
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={1}
            className="
              w-full px-4 py-3 pr-12
              bg-gray-800 text-white placeholder-gray-400
              rounded-2xl resize-none
              focus:outline-none focus:ring-2 focus:ring-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
              max-h-32 overflow-y-auto
              text-base leading-relaxed
            "
            style={{
              paddingBottom: '12px',
              paddingTop: '12px',
            }}
          />
          
          {/* Character count */}
          {message.length > maxLength * 0.8 && (
            <span className="absolute bottom-1 right-12 text-xs text-gray-500">
              {message.length}/{maxLength}
            </span>
          )}
        </div>

        {/* Send button */}
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className={`
            mb-2 p-3 rounded-full transition-all duration-200
            ${message.trim() 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
              : 'bg-gray-800 cursor-not-allowed'
            }
          `}
          aria-label="Send message"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${
              message.trim() ? 'text-white' : 'text-gray-500'
            }`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>

      {/* Quick actions */}
      {isFocused && (
        <div className="px-3 pb-2 flex gap-2 overflow-x-auto hide-scrollbar">
          {['👍', '❤️', '😂', '🤔', '👏', '🔥'].map((emoji) => (
            <Button
              key={emoji}
              onClick={() => {
                setMessage(message + emoji);
                triggerHaptic('light');
              }}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-lg whitespace-nowrap"
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};