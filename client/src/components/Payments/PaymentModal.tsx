import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { X, CreditCard, Shield, Crown } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: { filepath: string; source: string };
  author: { name: string; avatar?: string };
  price: {
    type: 'free' | 'premium' | 'subscription';
    amount?: number;
    currency?: string;
    subscriptionPlan?: 'monthly' | 'yearly';
  };
  popularity: {
    downloads: number;
    rating: number;
    reviewCount: number;
  };
}

interface PaymentModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const PaymentModal: React.FC<PaymentModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatPrice = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = agent.price.type === 'subscription' 
        ? `/api/payments/subscribe/${agent.id}`
        : `/api/payments/purchase/${agent.id}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const { clientSecret } = await response.json();

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/marketplace/success`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseButtonText = () => {
    if (loading) return 'Processing...';
    
    switch (agent.price.type) {
      case 'subscription':
        return `Subscribe ${formatPrice(agent.price.amount!, agent.price.currency)}/${agent.price.subscriptionPlan}`;
      case 'premium':
        return `Purchase ${formatPrice(agent.price.amount!, agent.price.currency)}`;
      default:
        return 'Get Agent';
    }
  };

  const getFeatures = () => {
    const features = [
      'Unlimited conversations',
      'Premium personality traits',
      'Priority support',
      'Advanced capabilities'
    ];

    if (agent.price.type === 'subscription') {
      features.push('Monthly updates', 'Cancel anytime');
    } else {
      features.push('Lifetime access', 'One-time payment');
    }

    return features;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Get Premium Access
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Agent Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
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
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {agent.name}
                </h3>
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by {agent.author.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-yellow-500">
                  â˜… {agent.popularity.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({agent.popularity.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {agent.description}
          </p>
        </div>

        {/* Features */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            What's included:
          </h4>
          <ul className="space-y-2">
            {getFeatures().map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(agent.price.amount!, agent.price.currency)}
                {agent.price.type === 'subscription' && (
                  <span className="text-lg font-normal text-gray-500">
                    /{agent.price.subscriptionPlan}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {agent.price.type === 'subscription' ? 'Recurring billing' : 'One-time payment'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium">
                70% goes to creator
              </div>
              <div className="text-xs text-gray-500">
                Support independent developers
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>{getPurchaseButtonText()}</span>
          </button>
          
          <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            <Shield className="w-4 h-4 inline mr-1" />
            Secure payment powered by Stripe. Cancel anytime.
          </div>
        </div>
      </div>
    </div>
  );
};
