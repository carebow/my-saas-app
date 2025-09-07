import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initSentry } from './lib/sentry'
import './index.css'

console.log('Starting React app...');

// Initialize Sentry early
initSentry();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

console.log('Container found:', container);

try {
  console.log('Rendering React app...');
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app rendered successfully!');
} catch (error) {
  console.error('Failed to render app:', error);
  
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