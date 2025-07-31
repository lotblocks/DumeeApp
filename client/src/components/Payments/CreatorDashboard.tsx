import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Calendar, ExternalLink, CreditCard } from 'lucide-react';

interface EarningsData {
  summary: {
    totalEarnings: number;
    monthlyEarnings: number;
    totalSubscriptions: number;
    agentCount: number;
  };
  agents: Array<{
    id: string;
    name: string;
    earnings: number;
    monthlyEarnings: number;
    subscriptions: number;
    downloads: number;
    rating: number;
    createdAt: string;
  }>;
}

export const CreatorDashboard: React.FC = () => {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(false);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const response = await fetch('/api/payments/creator/earnings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEarningsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupStripeAccount = async () => {
    try {
      const response = await fetch('/api/payments/connect/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/creator/dashboard?connected=true`,
          refreshUrl: `${window.location.origin}/creator/dashboard?refresh=true`,
        }),
      });

      if (response.ok) {
        const { accountLink } = await response.json();
        window.location.href = accountLink;
      }
    } catch (error) {
      console.error('Failed to setup Stripe account:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stripeConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Set up payments to start earning
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Connect your Stripe account to receive payments from your premium agents.
          </p>
          <button
            onClick={setupStripeAccount}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect Stripe Account
          </button>
        </div>
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Failed to load earnings data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ðŸ’° Creator Earnings Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your agent performance and earnings
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(earningsData.summary.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                This Month
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(earningsData.summary.monthlyEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Subscribers
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {earningsData.summary.totalSubscriptions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Published Agents
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {earningsData.summary.agentCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Agent Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subscribers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {earningsData.agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {agent.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(agent.earnings)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(agent.monthlyEarnings)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {agent.subscriptions}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {agent.downloads.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400">â˜…</span>
                      <span className="ml-1 text-sm text-gray-900 dark:text-white">
                        {agent.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {earningsData.agents.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No published agents yet. Create and publish your first agent to start earning!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
