import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, TrendingUp, Crown } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { PaymentModal } from '../Payments/PaymentModal';

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

interface MarketplaceViewProps {
  onAgentSelect?: (agent: Agent) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAgentSelect }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);
  const [popularAgents, setPopularAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.downloads');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'popular'>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Fetch all agents, featured, and popular in parallel
      const [allResponse, featuredResponse, popularResponse] = await Promise.all([
        fetch('/api/agents/marketplace/browse?limit=20'),
        fetch('/api/agents/marketplace/featured?limit=6'),
        fetch('/api/agents/marketplace/popular?limit=10'),
      ]);

      const allData = await allResponse.json();
      const featuredData = await featuredResponse.json();
      const popularData = await popularResponse.json();

      setAgents(allData.agents || []);
      setFeaturedAgents(featuredData || []);
      setPopularAgents(popularData || []);
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchMarketplaceData();
      return;
    }

    try {
      const response = await fetch(`/api/agents/marketplace/search?q=${encodeURIComponent(query)}&category=${selectedCategory}`);
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAgentClick = (agent: Agent) => {
    if (agent.price.type !== 'free') {
      setSelectedAgent(agent);
      setShowPaymentModal(true);
    } else {
      onAgentSelect?.(agent);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (selectedAgent) {
      onAgentSelect?.(selectedAgent);
    }
  };

  const getDisplayAgents = () => {
    switch (activeTab) {
      case 'featured':
        return featuredAgents;
      case 'popular':
        return popularAgents;
      default:
        return agents;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ðŸ›’ Dumee Agent Marketplace
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Discover amazing AI personalities
            </div>
          </div>
          
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Search agents, categories, or creators..."
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            All Agents
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'featured'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Crown className="w-4 h-4 inline mr-2" />
            Featured
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'popular'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Popular
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'all' && (
          <div className="mb-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getDisplayAgents().map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => handleAgentClick(agent)}
            />
          ))}
        </div>

        {getDisplayAgents().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-lg">
              {searchQuery ? 'No agents found matching your search.' : 'No agents available.'}
            </div>
            <div className="text-gray-300 dark:text-gray-700 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search terms.' : 'Check back later for new agents!'}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedAgent && (
        <PaymentModal
          agent={selectedAgent}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
