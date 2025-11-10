
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

import ErrorBoundary from './components/ErrorBoundary';
import NetworkSelector from './components/NetworkSelector'; 
import { WalletProvider } from './contexts/WalletContext';

// Lazy load the page components
const ArbitrageOpportunitiesPage = lazy(() => import('./pages/ArbitrageOpportunitiesPage'));
const ArbitrageBotPage = lazy(() => import('./pages/ArbitrageBotPage'));

const App = () => {
  const { login, logout, ready, authenticated } = usePrivy();

  return (
    <Router>
      <WalletProvider>
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">
              <Link to="/">FlashBot</Link>
            </h1>
            <div className="header-controls">
              <NetworkSelector />
              {ready && authenticated ? (
                <button onClick={logout} className="button button-secondary">Logout</button>
              ) : (
                <button onClick={login} className="button button-primary">Login</button>
              )}
            </div>
          </header>

          <div className="app-body">
            <main className="main-content">
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}><h2>Loading...</h2></div>}>
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary>
                      <ArbitrageOpportunitiesPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/arbitrage-bot" element={
                    <ErrorBoundary>
                      {/* Protect the bot page */}
                      {ready && authenticated ? <ArbitrageBotPage /> : <LoginPagePrompt />}
                    </ErrorBoundary>
                  } />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </WalletProvider>
    </Router>
  );
};

// A simple component to prompt users to log in
const LoginPagePrompt = () => {
  const { login } = usePrivy();
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Please Log In</h2>
      <p>You need to be logged in to access the Arbitrage Bot.</p>
      <button onClick={login} className="button button-primary" style={{ marginTop: '20px' }}>Log In</button>
    </div>
  );
};

export default App;
