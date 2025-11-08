import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { NetworkProvider } from './contexts/NetworkContext';

// Lazy load the components
const Dashboard = lazy(() => import('./components/Dashboard'));
const ArbitrageFinder = lazy(() => import('./components/ArbitrageFinder'));
const ArbitrageOpportunities = lazy(() => import('./components/ArbitrageOpportunities'));
const TradeHistory = lazy(() => import('./components/TradeHistory'));

export default function App() {
  return (
    <NetworkProvider>
      <Router>
        <Layout>
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}><h2>Loading Page...</h2></div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/finder" element={<ErrorBoundary><ArbitrageFinder /></ErrorBoundary>} />
              <Route path="/opportunities" element={<ErrorBoundary><ArbitrageOpportunities /></ErrorBoundary>} />
              <Route path="/history" element={<ErrorBoundary><TradeHistory /></ErrorBoundary>} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </NetworkProvider>
  );
}
