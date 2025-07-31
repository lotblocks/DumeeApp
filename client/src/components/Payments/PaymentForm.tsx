import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  amount: number;
  currency?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  onSuccess,
  onError,
  amount,
  currency = 'USD'
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'An unexpected error occurred.');
        onError?.(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setMessage(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Complete Payment
        </h3>
        <p className="text-gray-300">
          Amount: <span className="font-bold text-green-400">
            {formatAmount(amount, currency)}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
          
          <AddressElement 
            options={{
              mode: 'billing',
              allowedCountries: ['US', 'CA', 'GB', 'AU'],
            }}
          />
        </div>

        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes('succeeded') 
              ? 'bg-green-900 text-green-200 border border-green-700'
              : 'bg-red-900 text-red-200 border border-red-700'
          }`}>
            {message}
          </div>
        )}

        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatAmount(amount, currency)}`
          )}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
};