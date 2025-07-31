import React, { useState } from 'react';
import { 
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Star,
  Download,
  Filter
} from 'lucide-react';
import { DumeeCard, DumeeButton, DumeeBadge } from '../Dumee';

interface AnalyticsViewProps {
  userId: string;
}

interface ChartData {
  label: string;
  value: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ userId }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'subscribers' | 'revenue' | 'views' | 'ratings'>('subscribers');

  // Mock data for charts
  const chartData: ChartData[] = [
    { label: 'Jan 1', value: 45 },
    { label: 'Jan 7', value: 52 },
    { label: 'Jan 14', value: 67 },
    { label: 'Jan 21', value: 89 },
    { label: 'Jan 28', value: 95 },
    { label: 'Feb 4', value: 112 },
    { label: 'Feb 11', value: 134 }
  ];

  const agentPerformance = [
    { name: 'Physics Meme Master', subscribers: 89, growth: 23, rating: 4.8, revenue: 1234.56 },
    { name: 'Code Comedian', subscribers: 67, growth: 15, rating: 4.9, revenue: 987.65 },
    { name: 'History Jokester', subscribers: 45, growth: -5, rating: 4.6, revenue: 654.32 },
    { name: 'Math Wizard', subscribers: 34, growth: 8, rating: 4.7, revenue: 456.78 }
  ];

  const topCountries = [
    { country: 'United States', percentage: 35 },
    { country: 'United Kingdom', percentage: 18 },
    { country: 'Canada', percentage: 12 },
    { country: 'Australia', percentage: 8 },
    { country: 'Germany', percentage: 7 }
  ];

  const getMaxValue = () => Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
            <span className="ml-2 text-xl dumee-bounce">ðŸ“Š</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your agents' performance and growth
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <DumeeButton variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </DumeeButton>
        </div>
      </div>

      {/* Metrics Selector */}
      <div className="flex flex-wrap gap-2">
        {(['subscribers', 'revenue', 'views', 'ratings'] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === metric
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <DumeeCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Over Time
          </h3>
          <DumeeBadge variant="success" size="sm">
            <TrendingUp className="w-3 h-3 mr-1" />
            +23.5%
          </DumeeBadge>
        </div>
        
        {/* Simple Bar Chart */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ 
                    height: `${(data.value / getMaxValue()) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {data.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DumeeCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <DumeeCard>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Agent Performance
          </h3>
          <div className="space-y-3">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {agent.subscribers} subs
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {agent.rating}
                    </span>
                    <span>${agent.revenue}</span>
                  </div>
                </div>
                <DumeeBadge
                  variant={agent.growth > 0 ? 'success' : 'error'}
                  size="sm"
                >
                  {agent.growth > 0 ? '+' : ''}{agent.growth}%
                </DumeeBadge>
              </div>
            ))}
          </div>
        </DumeeCard>

        {/* Geographic Distribution */}
        <DumeeCard>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Countries
          </h3>
          <div className="space-y-3">
            {topCountries.map((country, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {country.country}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {country.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DumeeCard>
      </div>

      {/* Insights */}
      <DumeeCard variant="gradient">
        <div className="flex items-start space-x-3">
          <span className="text-2xl dumee-bounce">ðŸ’¡</span>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Performance Insight
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Your "Physics Meme Master" agent is performing exceptionally well with a 23% growth in subscribers this month. 
              Consider creating similar educational content with humor to replicate this success!
            </p>
          </div>
        </div>
      </DumeeCard>
    </div>
  );
};
