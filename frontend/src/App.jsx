
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

import ErrorBoundary from './components/ErrorBoundary';
import { WalletProvider } from './contexts/WalletContext';
import { NetworkProvider } from './contexts/NetworkContext';
import TopNav from './components/TopNav';

// Lazy load the pages
const ArbitrageBotPage = lazy(() => import('./pages/ArbitrageBotPage'));
const ManualTradePage = lazy(() => import('./pages/ManualTradePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

const App = () => {
  const { login, logout, ready, authenticated } = usePrivy();

  return (
    <Router>
      <WalletProvider>
        <NetworkProvider>
          <div className="app-container">
            <header className="app-header">
              <h1 className="app-title">
                <Link to="/">FlashBot</Link>
              </h1>
              <div className="header-controls">
                {ready && authenticated ? (
                  <button onClick={logout} className="button button-secondary">Logout</button>
                ) : (
                  <button onClick={login} className="button button-primary">Login</button>
                )}
              </div>
            </header>
            <TopNav />
            <div className="app-body">
              <main className="main-content">
                <Suspense fallback={<div className="loading-message"><h2>Loading...</h2></div>}>
                  <Routes>
                    <Route path="/" element={
                      <ErrorBoundary>
                        {ready && authenticated ? <ManualTradePage /> : <LoginPagePrompt />}
                      </ErrorBoundary>
                    } />
                     <Route path="/arbitrage-bot" element={
                      <ErrorBoundary>
                        {ready && authenticated ? <ArbitrageBotPage /> : <LoginPagePrompt />}
                      </ErrorBoundary>
                    } />
                    <Route path="/manual-trade" element={
                      <ErrorBoundary>
                        {ready && authenticated ? <ManualTradePage /> : <LoginPagePrompt />}
                      </ErrorBoundary>
                    } />
                    <Route path="/history" element={
                        <ErrorBoundary>
                            {ready && authenticated ? <HistoryPage /> : <LoginPagePrompt />}
                        </ErrorBoundary>
                    } />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </NetworkProvider>
      </WalletProvider>
    </Router>
  );
};

// A simple component to prompt users to log in
const LoginPagePrompt = () => {
  const { login } = usePrivy();
  return (
    <div className="login-prompt">
      <h2>Please Log In</h2>
      <p>You need to be logged in to access the application.</p>
      <button onClick={login} className="button button-primary">Log In</button>
    </div>
  );
};

export default App;
