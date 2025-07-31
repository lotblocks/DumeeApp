import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  recommended?: boolean;
  stripePriceId: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Dumee',
    price: 0,
    currency: 'USD',
    interval: 'month',
    stripePriceId: '',
    features: [
      { name: '10 AI conversations/month', included: true },
      { name: 'Basic AI models', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced AI models', included: false },
      { name: 'Custom agents', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Dumee',
    price: 1999, // $19.99
    currency: 'USD',
    interval: 'month',
    recommended: true,
    stripePriceId: process.env.VITE_STRIPE_PRO_PRICE_ID || '',
    features: [
      { name: 'Unlimited AI conversations', included: true },
      { name: 'All AI models (GPT-4, Claude, etc.)', included: true },
      { name: 'Custom AI agents', included: true },
      { name: 'File uploads & processing', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999, // $99.99
    currency: 'USD',
    interval: 'month',
    stripePriceId: process.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'API access with higher limits', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Analytics dashboard', included: true },
    ],
  },
];

interface SubscriptionPlansProps {
  currentPlan?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  currentPlan = 'free',
  onSelectPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Dumee Plan
        </h2>
        <p className="text-gray-300 text-lg">
          Unlock the full power of AI with meme-driven explanations!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 ${
              plan.recommended
                ? 'border-purple-500 shadow-purple-500/20 shadow-lg'
                : selectedPlan === plan.id
                ? 'border-blue-500'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(plan.price, plan.currency)}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-400 ml-1">/{plan.interval}</span>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span
                    className={`mr-3 text-lg ${
                      feature.included ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    {feature.included ? '✓' : '✗'}
                  </span>
                  <span
                    className={
                      feature.included ? 'text-gray-200' : 'text-gray-500'
                    }
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => {
                setSelectedPlan(plan.id);
                onSelectPlan(plan);
              }}
              disabled={currentPlan === plan.id}
              className={`w-full ${
                plan.recommended
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  : currentPlan === plan.id
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {currentPlan === plan.id
                ? 'Current Plan'
                : plan.price === 0
                ? 'Get Started'
                : 'Upgrade Now'}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>✨ All plans include access to our meme-driven AI explanations</p>
        <p>🔒 Secure payments powered by Stripe</p>
        <p>📞 Cancel anytime • No hidden fees</p>
      </div>
    </div>
  );
};