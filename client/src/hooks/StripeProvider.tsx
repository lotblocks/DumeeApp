import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

interface StripeContextType {
  stripe: Stripe | null;
  isLoaded: boolean;
}

const StripeContext = createContext<StripeContextType>({
  stripe: null,
  isLoaded: false,
});

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: React.ReactNode;
  publishableKey?: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ 
  children, 
  publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeStripe = async () => {
      if (!publishableKey) {
        console.warn('Stripe publishable key not found');
        setIsLoaded(true);
        return;
      }

      try {
        const stripeInstance = await loadStripe(publishableKey);
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeStripe();
  }, [publishableKey]);

  const stripeOptions = {
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#667eea',
        colorBackground: '#0d0d0d',
        colorText: '#ffffff',
        colorDanger: '#df1b41',
        borderRadius: '8px',
      },
    },
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <StripeContext.Provider value={{ stripe, isLoaded }}>
      {stripe ? (
        <Elements stripe={stripe} options={stripeOptions}>
          {children}
        </Elements>
      ) : (
        children
      )}
    </StripeContext.Provider>
  );
};