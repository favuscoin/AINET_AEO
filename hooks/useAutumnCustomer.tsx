'use client';

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import { useCustomer as useAutumnCustomer, UseCustomerParams } from 'autumn-js/react';

// Create a context for the refetch function
interface AutumnCustomerContextType {
  refetchCustomer: () => Promise<void>;
}

const AutumnCustomerContext = createContext<AutumnCustomerContextType | null>(null);

// Provider component
export function AutumnCustomerProvider({ children }: { children: ReactNode }) {
  const { refetch } = useAutumnCustomer({ skip: true });

  const refetchCustomer = useCallback(async () => {
    try {
      await refetch();
    } catch (e) {
      console.log('Refetch failed, likely due to missing AUTUMN_SECRET_KEY. Ignoring for local dev.');
    }
  }, [refetch]);

  return (
    <AutumnCustomerContext.Provider value={{ refetchCustomer }}>
      {children}
    </AutumnCustomerContext.Provider>
  );
}

// Hook to use the customer data with global refetch
export function useCustomer(params?: UseCustomerParams) {
  const autumnCustomer = useAutumnCustomer(params);
  const context = useContext(AutumnCustomerContext);

  // Create a wrapped refetch that can be used globally
  const globalRefetch = useCallback(async () => {
    // Refetch the local instance
    try {
      const result = await autumnCustomer.refetch();

      // Also trigger any global refetch if in context
      if (context?.refetchCustomer) {
        await context.refetchCustomer();
      }

      return result;
    } catch (e) {
      console.log('Global refetch failed. Ignoring for local dev.');
      return null;
    }
  }, [autumnCustomer, context]);

  // Bypass logic for local development
  const isDev = process.env.NODE_ENV === 'development';

  const bypassedData = useMemo(() => {
    const data = { ...autumnCustomer };

    if (isDev) {
      // Mock customer data if it's missing or has no credits
      if (!data.customer || !data.customer.features || Object.keys(data.customer.features).length === 0) {
        data.customer = {
          ...(data.customer || {}),
          features: {
            messages: {
              balance: 1000,
              usage: 0,
              featureId: 'messages',
            }
          }
        };
      }

      // Override allowed function to always return true for existing features in dev
      const originalAllowed = data.allowed;
      data.allowed = (params: any) => {
        console.log('[DEV] Bypassing credit check for:', params.featureId);
        return true;
      };
    }

    return data;
  }, [autumnCustomer, isDev]);

  return {
    ...bypassedData,
    refetch: globalRefetch,
  };
}

// Hook to trigger a global customer data refresh from anywhere
export function useRefreshCustomer() {
  const context = useContext(AutumnCustomerContext);

  if (!context) {
    // Return a no-op function if not in provider
    return async () => {
      console.warn('useRefreshCustomer called outside of AutumnCustomerProvider');
    };
  }

  return context.refetchCustomer;
}