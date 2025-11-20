// API Configuration
// =================
// This file centralizes the API endpoints for the application.
// It uses Vite's environment variables to switch between development and production URLs.

// In development (when you run `npm run dev`), `import.meta.env.PROD` is false.
// In production (after `npm run build`), `import.meta.env.PROD` is true.

// VITE_API_URL should be set in your Render environment variables for the frontend service.
// For example: https://your-backend-service-name.onrender.com
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:3001';

// This check provides a clear error during the build process if the production environment variable is missing.
if (import.meta.env.PROD && !API_BASE_URL) {
  throw new Error("Fatal Error: VITE_API_URL is not set in the production environment.");
}

export const GET_ARBITRAGE_OPPORTUNITIES_URL = `${API_BASE_URL}/api/trade-history`;
export const EXECUTE_TRADE_URL = `${API_BASE_URL}/api/execute-trade`;
export const SIMULATE_TRADE_URL = `${API_BASE_URL}/api/simulate-trade`;
export const PREPARE_TRADE_URL = `${API_BASE_URL}/api/prepare-trade`;