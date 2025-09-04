import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import './index.css'
import { initSentry, captureException, captureMessage } from './lib/sentry'
import ErrorBoundary from './components/ErrorBoundary'

// Initialize Sentry before anything else
initSentry();

// Enhanced error handling with Sentry integration
const handleGlobalError = (error: ErrorEvent) => {
  console.error('Global error:', error.error);
  captureException(error.error || new Error(error.message), {
    extra: {
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno,
    },
    tags: {
      errorType: 'global',
    },
  });
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  const error = event.reason instanceof Error 
    ? event.reason 
    : new Error(String(event.reason));
    
  captureException(error, {
    extra: {
      rejectionReason: event.reason,
    },
    tags: {
      errorType: 'unhandledRejection',
    },
  });
  
  event.preventDefault();
};

window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(container);

// Register service worker for caching and offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Wrap the entire app with Sentry profiler and error boundary
try {
  root.render(
    <React.StrictMode>
      <Sentry.Profiler name="App">
        <ErrorBoundary showDetails={import.meta.env.DEV}>
          <App />
        </ErrorBoundary>
      </Sentry.Profiler>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Capture initialization error
  captureException(error instanceof Error ? error : new Error(String(error)), {
    tags: {
      errorType: 'initialization',
    },
  });
  
  // Fallback rendering
  container.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Failed to Load</h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">We're sorry, but something went wrong during initialization. Our team has been notified.</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}