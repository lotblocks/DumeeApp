import React, { useState } from 'react';
import { Send, Sparkles, Image, Mic, Paperclip } from 'lucide-react';
import { 
  DumeeButton, 
  DumeeChatBubble, 
  DumeeTypingIndicator,
  DumeeCard,
  DumeeAvatar 
} from '../Dumee';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  avatar?: {
    src?: string;
    name: string;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
  }>;
}

interface DumeeChatInterfaceProps {
  agentName?: string;
  agentAvatar?: string;
  onSendMessage?: (message: string) => void;
}

export const DumeeChatInterface: React.FC<DumeeChatInterfaceProps> = ({
  agentName = 'Dumee',
  agentAvatar,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! I'm NO Dumee! ðŸŽ‰ What would you like to learn about today? I promise to make it fun with memes and visual explanations!",
      isUser: false,
      timestamp: '10:00 AM',
      avatar: { name: agentName, src: agentAvatar },
      reactions: [{ emoji: 'ðŸ˜„', count: 1 }]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: { name: 'You' }
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's a great question! Let me explain with a fun analogy... ðŸŽ¯",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: { name: agentName, src: agentAvatar }
      };
      setMessages(prev => [...prev, response]);
    }, 2000);

    onSendMessage?.(inputValue);
  };

  const quickActions = [
    { icon: <Sparkles className="w-4 h-4" />, label: 'Suggest topics', emoji: 'âœ¨' },
    { icon: <Image className="w-4 h-4" />, label: 'Add image', emoji: 'ðŸ–¼ï¸' },
    { icon: <Paperclip className="w-4 h-4" />, label: 'Attach file', emoji: 'ðŸ“Ž' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <DumeeAvatar
            name={agentName}
            src={agentAvatar}
            size="md"
            status="online"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {agentName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ready to make learning fun! ðŸŽ‰
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 dumee-scrollbar">
        {messages.map((message) => (
          <DumeeChatBubble
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            avatar={message.avatar}
            timestamp={message.timestamp}
            reactions={message.reactions}
          />
        ))}
        {isTyping && (
          <div className="pl-12">
            <DumeeTypingIndicator agentName={agentName} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {/* Quick Actions */}
        <div className="flex items-center space-x-2 px-4 pt-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {action.icon}
              <span>{action.label}</span>
              <span className="dumee-emoji-wave text-base">{action.emoji}</span>
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="p-4">
          <DumeeCard variant="glass" padding="none" className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything! I'll explain with memes... ðŸš€"
              className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
            <div className="flex items-center space-x-2 pr-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <DumeeButton
                variant="gradient"
                size="sm"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="rounded-full"
              >
                <Send className="w-4 h-4" />
              </DumeeButton>
            </div>
          </DumeeCard>
        </div>
      </div>
    </div>
  );
};
