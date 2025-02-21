// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Polyfill for Symbol.asyncIterator
if (typeof Symbol !== 'undefined' && typeof Symbol.asyncIterator === 'undefined') {
  // Define Symbol.asyncIterator if it doesn't exist
  Object.defineProperty(Symbol, 'asyncIterator', {
    value: Symbol('asyncIterator'),
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

// Create a custom error boundary handler
if (typeof ErrorEvent !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Only handle DataCloneError
    if (event.error && event.error.name === 'DataCloneError') {
      console.warn('DataCloneError caught and prevented:', event.error.message);
      // Prevent the error from propagating
      event.preventDefault();
      return true;
    }
    return false;
  });
}

// Create QueryClient with serialization safety
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Ensure query state is serializable
      structuralSharing: false,
      // Add retry logic for failed queries
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    // Add global error handling
    const errorHandler = (error: Error) => {
      console.warn('Global error caught:', error);
      // Can add custom handling here
    };

    // Set up error handler
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler(event.reason);
    });

    // Ready signal
    window.frameworkReady?.();

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', (event) => {
        errorHandler(event.reason);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}