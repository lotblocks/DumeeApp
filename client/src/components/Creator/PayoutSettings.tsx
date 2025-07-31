import React, { useState } from 'react';
import { 
  CreditCard,
  Building,
  DollarSign,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { 
  DumeeCard, 
  DumeeButton, 
  DumeeBadge,
  DumeeNotification 
} from '../Dumee';

interface PayoutSettingsProps {
  userId: string;
}

interface PayoutMethod {
  id: string;
  type: 'bank' | 'stripe';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
}

export const PayoutSettings: React.FC<PayoutSettingsProps> = ({ userId }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: 'success' as any,
    title: '',
    message: ''
  });

  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([
    {
      id: '1',
      type: 'stripe',
      name: 'Stripe Connect',
      details: 'acct_1234...ABCD',
      isDefault: true,
      isVerified: true
    },
    {
      id: '2',
      type: 'bank',
      name: 'Chase Bank',
      details: '****1234',
      isDefault: false,
      isVerified: true
    }
  ]);

  const [payoutSettings, setPayoutSettings] = useState({
    minimumPayout: 100,
    payoutSchedule: 'monthly',
    taxForm: 'W-9',
    taxFormSubmitted: true,
    autoPayoutEnabled: true
  });

  const showSuccessNotification = (title: string, message: string) => {
    setNotificationConfig({ type: 'success', title, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleSetDefaultMethod = (methodId: string) => {
    setPayoutMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
    showSuccessNotification('Default payment method updated', 'Your payouts will now be sent to this method.');
  };

  const handleSaveSettings = () => {
    showSuccessNotification('Settings saved', 'Your payout preferences have been updated.');
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <DumeeNotification
            type={notificationConfig.type}
            title={notificationConfig.title}
            message={notificationConfig.message}
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payout Settings
          <span className="ml-2 text-xl dumee-bounce">âš™ï¸</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your payment methods and payout preferences
        </p>
      </div>

      {/* Stripe Connect Status */}
      <DumeeCard variant="gradient">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Stripe Connect Status
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Your account is verified and ready to receive payouts
              </p>
              <div className="flex items-center space-x-3">
                <DumeeBadge variant="success" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </DumeeBadge>
                <DumeeBadge variant="primary" size="sm">
                  70% Revenue Share
                </DumeeBadge>
              </div>
            </div>
          </div>
          <DumeeButton variant="secondary" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Stripe Dashboard
          </DumeeButton>
        </div>
      </DumeeCard>

      {/* Payment Methods */}
      <DumeeCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h3>
          <DumeeButton variant="primary" size="sm">
            Add Method
          </DumeeButton>
        </div>

        <div className="space-y-3">
          {payoutMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-lg border ${
                method.isDefault
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    {method.type === 'stripe' ? (
                      <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {method.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {method.details}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isVerified && (
                    <DumeeBadge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </DumeeBadge>
                  )}
                  {method.isDefault ? (
                    <DumeeBadge variant="primary" size="sm">
                      Default
                    </DumeeBadge>
                  ) : (
                    <DumeeButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefaultMethod(method.id)}
                    >
                      Set as Default
                    </DumeeButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DumeeCard>

      {/* Payout Preferences */}
      <DumeeCard>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payout Preferences
        </h3>

        <div className="space-y-6">
          {/* Minimum Payout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Payout Amount
            </label>
            <select
              value={payoutSettings.minimumPayout}
              onChange={(e) => setPayoutSettings({ ...payoutSettings, minimumPayout: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={50}>$50</option>
              <option value={100}>$100 (Recommended)</option>
              <option value={250}>$250</option>
              <option value={500}>$500</option>
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Payouts are processed when your balance reaches this amount
            </p>
          </div>

          {/* Payout Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payout Schedule
            </label>
            <select
              value={payoutSettings.payoutSchedule}
              onChange={(e) => setPayoutSettings({ ...payoutSettings, payoutSchedule: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly (Every Monday)</option>
              <option value="monthly">Monthly (1st of each month)</option>
              <option value="manual">Manual only</option>
            </select>
          </div>

          {/* Auto Payout */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Automatic Payouts
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically send earnings when threshold is met
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={payoutSettings.autoPayoutEnabled}
                onChange={(e) => setPayoutSettings({ ...payoutSettings, autoPayoutEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <DumeeButton
            variant="primary"
            onClick={handleSaveSettings}
            className="w-full sm:w-auto"
          >
            Save Settings
          </DumeeButton>
        </div>
      </DumeeCard>

      {/* Tax Information */}
      <DumeeCard>
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tax Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {payoutSettings.taxFormSubmitted ? (
                <>Your {payoutSettings.taxForm} is on file. We'll send you a 1099 form at the end of the tax year.</>
              ) : (
                <>Please submit your tax information to receive payouts.</>
              )}
            </p>
            <DumeeButton 
              variant={payoutSettings.taxFormSubmitted ? 'secondary' : 'primary'} 
              size="sm"
            >
              {payoutSettings.taxFormSubmitted ? 'Update Tax Info' : 'Submit Tax Form'}
            </DumeeButton>
          </div>
        </div>
      </DumeeCard>

      {/* Help Section */}
      <DumeeCard variant="glass">
        <div className="text-center py-4">
          <span className="text-3xl dumee-bounce mb-3 inline-block">ðŸ’¡</span>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Need Help with Payouts?
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Check out our creator guide for payout tips and best practices
          </p>
          <DumeeButton variant="ghost">
            View Creator Guide
          </DumeeButton>
        </div>
      </DumeeCard>
    </div>
  );
};
