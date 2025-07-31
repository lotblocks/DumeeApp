import React from 'react';
import { Star, Download, Crown, Heart, Tag } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: { filepath: string; source: string };
  author: { name: string; avatar?: string };
  marketplaceCategory: string;
  tags: string[];
  price: {
    type: 'free' | 'premium' | 'subscription';
    amount?: number;
    currency?: string;
  };
  popularity: {
    downloads: number;
    rating: number;
    reviewCount: number;
    favorites: number;
  };
  isVerified: boolean;
  marketplace: {
    shortDescription: string;
    screenshots?: string[];
  };
}

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPriceDisplay = () => {
    switch (agent.price.type) {
      case 'free':
        return <span className="text-green-600 font-semibold">Free</span>;
      case 'premium':
        return (
          <span className="text-blue-600 font-semibold">
            ${(agent.price.amount! / 100).toFixed(2)}
          </span>
        );
      case 'subscription':
        return (
          <span className="text-purple-600 font-semibold">
            ${(agent.price.amount! / 100).toFixed(2)}/month
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Agent Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {agent.avatar?.filepath ? (
                <img
                  src={agent.avatar.filepath}
                  alt={agent.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                agent.name.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {agent.name}
                </h3>
                {agent.isVerified && (
                  <Crown className="w-4 h-4 text-yellow-500" title="Verified Agent" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                by {agent.author.name}
              </p>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right">
            {getPriceDisplay()}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {agent.marketplace.shortDescription || agent.description}
        </p>

        {/* Tags */}
        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {agent.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {agent.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{agent.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">{agent.popularity.rating.toFixed(1)}</span>
              <span className="text-gray-400 dark:text-gray-500">
                ({formatNumber(agent.popularity.reviewCount)})
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <Download className="w-4 h-4" />
              <span>{formatNumber(agent.popularity.downloads)}</span>
            </div>
          </div>

          {/* Category */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
            {agent.marketplaceCategory}
          </div>
        </div>
      </div>
    </div>
  );
};
