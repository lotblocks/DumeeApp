import React, { useState } from 'react';
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  DumeeCard, 
  DumeeButton, 
  DumeeBadge,
  DumeeStats,
  DumeeNotification
} from '../Dumee';

interface EarningsOverviewProps {
  userId: string;
}

interface Transaction {
  id: string;
  type: 'subscription' | 'purchase' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  agentName?: string;
  userName?: string;
}

export const EarningsOverview: React.FC<EarningsOverviewProps> = ({ userId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous' | 'all'>('current');
  const [showNotification, setShowNotification] = useState(false);

  // Mock earnings data
  const earningsData = {
    currentBalance: 2345.67,
    pendingBalance: 456.78,
    totalEarned: 15678.90,
    lastPayout: 1500.00,
    nextPayoutDate: '2024-03-01',
    currentMonthEarnings: 3456.78,
    previousMonthEarnings: 2890.34,
    growthPercentage: 19.6
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'subscription',
      amount: 9.99,
      status: 'completed',
      description: 'New subscription',
      date: '2024-02-15',
      agentName: 'Physics Meme Master',
      userName: 'John D.'
    },
    {
      id: '2',
      type: 'purchase',
      amount: 14.99,
      status: 'completed',
      description: 'One-time purchase',
      date: '2024-02-14',
      agentName: 'Code Comedian',
      userName: 'Sarah M.'
    },
    {
      id: '3',
      type: 'payout',
      amount: -1500.00,
      status: 'completed',
      description: 'Monthly payout',
      date: '2024-02-01'
    },
    {
      id: '4',
      type: 'subscription',
      amount: 9.99,
      status: 'pending',
      description: 'Pending subscription',
      date: '2024-02-13',
      agentName: 'History Jokester',
      userName: 'Mike R.'
    }
  ];

  const handleRequestPayout = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <DumeeNotification
            type="success"
            title="Payout requested!"
            message="Your earnings will be transferred within 2-3 business days."
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Earnings
          <span className="ml-2 text-xl dumee-bounce">ðŸ’°</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your revenue and manage payouts
        </p>
      </div>

      {/* Earnings Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DumeeStats
          label="Available Balance"
          value={`$${earningsData.currentBalance.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          variant="success"
        />
        <DumeeStats
          label="Pending Earnings"
          value={`$${earningsData.pendingBalance.toLocaleString()}`}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
        />
        <DumeeStats
          label="This Month"
          value={`$${earningsData.currentMonthEarnings.toLocaleString()}`}
          change={{ value: earningsData.growthPercentage, isPositive: true }}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="primary"
        />
        <DumeeStats
          label="Total Earned"
          value={`$${earningsData.totalEarned.toLocaleString()}`}
          icon={<CreditCard className="w-6 h-6" />}
          variant="default"
        />
      </div>

      {/* Payout Section */}
      <DumeeCard variant="gradient">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Ready for Payout
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You have ${earningsData.currentBalance.toLocaleString()} available for withdrawal
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Next automatic payout: {new Date(earningsData.nextPayoutDate).toLocaleDateString()}
            </p>
          </div>
          <DumeeButton
            variant="primary"
            onClick={handleRequestPayout}
            disabled={earningsData.currentBalance < 100}
            emoji="ðŸ’¸"
          >
            Request Payout
          </DumeeButton>
        </div>
      </DumeeCard>

      {/* Earnings Chart */}
      <DumeeCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Earnings Breakdown
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedPeriod('current')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedPeriod === 'current'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Current Month
            </button>
            <button
              onClick={() => setSelectedPeriod('previous')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedPeriod === 'previous'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Previous Month
            </button>
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedPeriod === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Subscriptions</span>
              <span className="text-xs text-blue-700 dark:text-blue-400">70%</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              $2,419.67
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900 dark:text-purple-300">One-time</span>
              <span className="text-xs text-purple-700 dark:text-purple-400">25%</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              $864.17
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900 dark:text-green-300">Tips</span>
              <span className="text-xs text-green-700 dark:text-green-400">5%</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              $172.94
            </p>
          </div>
        </div>
      </DumeeCard>

      {/* Transaction History */}
      <DumeeCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <DumeeButton variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </DumeeButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      {transaction.agentName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.agentName} â€¢ {transaction.userName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${
                      transaction.amount > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DumeeCard>
    </div>
  );
};
