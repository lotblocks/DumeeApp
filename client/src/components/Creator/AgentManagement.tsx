import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  TrendingUp,
  Users,
  Star,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { 
  DumeeCard, 
  DumeeButton, 
  DumeeBadge,
  DumeeAvatar,
  DumeeEmptyState
} from '../Dumee';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  isPublished: boolean;
  isVerified: boolean;
  category: string;
  price: number;
  subscribers: number;
  rating: number;
  revenue: number;
  views: number;
  createdAt: string;
  lastUpdated: string;
}

interface AgentManagementProps {
  userId: string;
}

export const AgentManagement: React.FC<AgentManagementProps> = ({ userId }) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Physics Meme Master',
      description: 'Explains complex physics with hilarious memes and animations',
      isPublished: true,
      isVerified: true,
      category: 'Education',
      price: 9.99,
      subscribers: 89,
      rating: 4.8,
      revenue: 1234.56,
      views: 5678,
      createdAt: '2024-01-15',
      lastUpdated: '2024-02-01'
    },
    {
      id: '2',
      name: 'Code Comedian',
      description: 'Programming concepts explained with humor and visual jokes',
      isPublished: true,
      isVerified: false,
      category: 'Technology',
      price: 14.99,
      subscribers: 67,
      rating: 4.9,
      revenue: 987.65,
      views: 4321,
      createdAt: '2024-01-20',
      lastUpdated: '2024-01-28'
    },
    {
      id: '3',
      name: 'History Jokester',
      description: 'Making history fun with memes and storytelling',
      isPublished: false,
      isVerified: false,
      category: 'Education',
      price: 0,
      subscribers: 0,
      rating: 0,
      revenue: 0,
      views: 123,
      createdAt: '2024-02-05',
      lastUpdated: '2024-02-05'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && agent.isPublished) ||
                         (filterStatus === 'draft' && !agent.isPublished);
    return matchesSearch && matchesFilter;
  });

  const handlePublishToggle = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, isPublished: !agent.isPublished }
        : agent
    ));
  };

  const handleDeleteAgent = (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      setAgents(agents.filter(agent => agent.id !== agentId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Agents
            <span className="ml-2 text-xl dumee-bounce">ðŸ¤–</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage your AI personalities
          </p>
        </div>
        <DumeeButton variant="gradient" emoji="âœ¨" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create New Agent
        </DumeeButton>
      </div>

      {/* Search and Filters */}
      <DumeeCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Agents</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </DumeeCard>

      {/* Agents List */}
      {filteredAgents.length === 0 ? (
        <DumeeEmptyState
          type="no-agents"
          title="No agents found"
          description="Create your first agent to start earning!"
          action={{
            label: "Create Agent",
            onClick: () => console.log('Create agent')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAgents.map((agent) => (
            <DumeeCard key={agent.id} variant="hover" className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <DumeeAvatar
                    name={agent.name}
                    src={agent.avatar}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {agent.name}
                          {agent.isVerified && (
                            <span className="ml-2 text-blue-500">âœ“</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {agent.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Status and Category */}
                    <div className="flex items-center space-x-2 mt-3">
                      <DumeeBadge
                        variant={agent.isPublished ? 'success' : 'default'}
                        size="sm"
                      >
                        {agent.isPublished ? 'Published' : 'Draft'}
                      </DumeeBadge>
                      <DumeeBadge variant="primary" size="sm">
                        {agent.category}
                      </DumeeBadge>
                      {agent.price > 0 && (
                        <DumeeBadge variant="accent" size="sm">
                          ${agent.price}/mo
                        </DumeeBadge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Subscribers</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {agent.subscribers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {agent.rating || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${agent.revenue}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {agent.views}
                        </p>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    {selectedAgent === agent.id && (
                      <div className="absolute right-4 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                        <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <Edit className="w-4 h-4" />
                          <span>Edit Agent</span>
                        </button>
                        <button
                          onClick={() => handlePublishToggle(agent.id)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        >
                          {agent.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>{agent.isPublished ? 'Unpublish' : 'Publish'}</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <TrendingUp className="w-4 h-4" />
                          <span>View Analytics</span>
                        </button>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DumeeCard>
          ))}
        </div>
      )}
    </div>
  );
};
