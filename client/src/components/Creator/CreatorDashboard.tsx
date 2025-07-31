import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Eye,
  Download,
  Settings,
  BarChart3,
  Calendar,
  CreditCard
} from 'lucide-react';
import { 
  DumeeCard, 
  DumeeStats, 
  DumeeButton,
  DumeeLoader,
  DumeeBadge
} from '../Dumee';
import { AgentManagement } from './AgentManagement';
import { EarningsOverview } from './EarningsOverview';
import { AnalyticsView } from './AnalyticsView';
import { PayoutSettings } from './PayoutSettings';

interface CreatorDashboardProps {
  userId: string;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'analytics' | 'earnings' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalAgents: 0,
    totalSubscribers: 0,
    totalViews: 0,
    revenueGrowth: 0,
    subscriberGrowth: 0,
    topAgents: [],
    recentActivity: []
  });

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData({
        totalRevenue: 4567.89,
        totalAgents: 12,
        totalSubscribers: 234,
        totalViews: 15678,
        revenueGrowth: 23.5,
        subscriberGrowth: 15.2,
        topAgents: [
          { id: '1', name: 'Physics Meme Master', subscribers: 89, revenue: 1234.56 },
          { id: '2', name: 'Code Comedian', subscribers: 67, revenue: 987.65 },
          { id: '3', name: 'History Jokester', subscribers: 45, revenue: 654.32 }
        ],
        recentActivity: [
          { type: 'subscription', agent: 'Physics Meme Master', user: 'John D.', time: '2 hours ago' },
          { type: 'purchase', agent: 'Code Comedian', user: 'Sarah M.', time: '5 hours ago' },
          { type: 'review', agent: 'History Jokester', rating: 5, time: '1 day ago' }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'agents', label: 'My Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DumeeLoader size="lg" variant="bounce" text="Loading your creator dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Creator Dashboard
              <span className="ml-2 text-2xl dumee-bounce">ðŸŽ¨</span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your agents, track performance, and grow your earnings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-t border-gray-200 dark:border-gray-700 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DumeeStats
                label="Total Revenue"
                value={`$${dashboardData.totalRevenue.toLocaleString()}`}
                change={{ value: dashboardData.revenueGrowth, isPositive: true }}
                icon={<DollarSign className="w-6 h-6" />}
                variant="success"
              />
              <DumeeStats
                label="Active Agents"
                value={dashboardData.totalAgents}
                icon={<Users className="w-6 h-6" />}
                variant="primary"
              />
              <DumeeStats
                label="Total Subscribers"
                value={dashboardData.totalSubscribers}
                change={{ value: dashboardData.subscriberGrowth, isPositive: true }}
                icon={<Star className="w-6 h-6" />}
                variant="warning"
              />
              <DumeeStats
                label="Total Views"
                value={dashboardData.totalViews.toLocaleString()}
                icon={<Eye className="w-6 h-6" />}
                variant="default"
              />
            </div>

            {/* Top Agents and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Agents */}
              <DumeeCard>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  ðŸ† Top Performing Agents
                </h2>
                <div className="space-y-4">
                  {dashboardData.topAgents.map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{index === 0 ? 'ðŸ¥‡' : index === 1 ? 'ðŸ¥ˆ' : 'ðŸ¥‰'}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {agent.subscribers} subscribers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${agent.revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DumeeCard>

              {/* Recent Activity */}
              <DumeeCard>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  âš¡ Recent Activity
                </h2>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'subscription' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                        )}
                        {activity.type === 'purchase' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        {activity.type === 'review' && (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.type === 'subscription' && `${activity.user} subscribed to ${activity.agent}`}
                          {activity.type === 'purchase' && `${activity.user} purchased ${activity.agent}`}
                          {activity.type === 'review' && `New ${activity.rating}-star review for ${activity.agent}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DumeeCard>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <DumeeCard variant="gradient">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ready to create your next hit agent? ðŸš€
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Join thousands of creators making learning fun with AI
                    </p>
                  </div>
                  <DumeeButton variant="primary" emoji="âœ¨">
                    Create New Agent
                  </DumeeButton>
                </div>
              </DumeeCard>
            </div>
          </>
        )}

        {activeTab === 'agents' && <AgentManagement userId={userId} />}
        {activeTab === 'analytics' && <AnalyticsView userId={userId} />}
        {activeTab === 'earnings' && <EarningsOverview userId={userId} />}
        {activeTab === 'settings' && <PayoutSettings userId={userId} />}
      </div>
    </div>
  );
};
