import React from 'react';
import { Sparkles, Zap, Heart, Rocket } from 'lucide-react';
import { DumeeButton } from './DumeeButton';
import { DumeeCard } from './DumeeCard';

interface DumeeWelcomeProps {
  onGetStarted?: () => void;
  userName?: string;
}

export const DumeeWelcome: React.FC<DumeeWelcomeProps> = ({ 
  onGetStarted,
  userName = 'friend' 
}) => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      emoji: 'âœ¨',
      title: 'Meme-Powered Learning',
      description: 'Complex topics explained with humor and visual fun!'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      emoji: 'âš¡',
      title: 'Instant Personality',
      description: 'Every agent has unique traits and conversation styles'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      emoji: 'â¤ï¸',
      title: 'Creator Community',
      description: 'Support creators and discover amazing AI personalities'
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      emoji: 'ðŸš€',
      title: 'Always Evolving',
      description: 'New agents and features added by the community daily'
    }
  ];

  const popularPrompts = [
    { emoji: 'ðŸŽ®', text: 'Explain quantum physics like a video game' },
    { emoji: 'ðŸ•', text: 'How does machine learning work? (Pizza analogy please!)' },
    { emoji: 'ðŸ¦„', text: 'Tell me about blockchain but make it magical' },
    { emoji: 'ðŸŽ¬', text: 'Describe climate change as a movie plot' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="dumee-gradient-text">Welcome to Dumee!</span>
          <span className="ml-2 inline-block dumee-bounce">ðŸŽ‰</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
          Hey {userName}! I'm NO Dumee! ðŸ˜„
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Let's make learning fun with memes, humor, and amazing AI personalities
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <DumeeCard
            key={index}
            variant="hover"
            className="flex items-start space-x-4"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                {feature.icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {feature.title} <span className="dumee-emoji-wave">{feature.emoji}</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </DumeeCard>
        ))}
      </div>

      {/* Quick Start Prompts */}
      <DumeeCard variant="gradient" className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          ðŸŽ¯ Try These Fun Prompts!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => console.log('Use prompt:', prompt.text)}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 text-left"
            >
              <span className="text-2xl dumee-bounce">{prompt.emoji}</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {prompt.text}
              </span>
            </button>
          ))}
        </div>
      </DumeeCard>

      {/* CTA Section */}
      <div className="text-center">
        <DumeeButton
          variant="gradient"
          size="lg"
          emoji="ðŸš€"
          onClick={onGetStarted}
          className="mx-auto shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          Let's Start Learning!
        </DumeeButton>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          No credit card required â€¢ Free agents available â€¢ Join thousands of learners
        </p>
      </div>

      {/* Fun Animation */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center justify-center space-x-2 text-4xl">
          <span className="dumee-bounce" style={{ animationDelay: '0ms' }}>ðŸŽ¨</span>
          <span className="dumee-bounce" style={{ animationDelay: '200ms' }}>ðŸŽ­</span>
          <span className="dumee-bounce" style={{ animationDelay: '400ms' }}>ðŸŽª</span>
          <span className="dumee-bounce" style={{ animationDelay: '600ms' }}>ðŸŽ¯</span>
          <span className="dumee-bounce" style={{ animationDelay: '800ms' }}>ðŸŽ‰</span>
        </div>
      </div>
    </div>
  );
};
