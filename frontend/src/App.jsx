
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
          {/* Main container with dark background */}
          <div className="min-h-screen bg-background font-sans text-text-primary">
            {/* Header section */}
            <header className="flex justify-between items-center p-4 border-b border-border-color">
              <h1 className="text-2xl font-bold text-text-primary">
                <Link to="/">FlashBot</Link>
              </h1>
              <div className="flex items-center gap-4">
                {ready && authenticated ? (
                  <button onClick={logout} className="w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-accent-bg text-accent-text hover:bg-accent-hover-bg">Logout</button>
                ) : (
                  <button onClick={login} className="w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-button-bg text-primary-button-text hover:bg-primary-button-hover-bg">Login</button>
                )}
              </div>
            </header>
            
            {/* Navigation and main content area */}
            <div className="container mx-auto px-4 md:px-6 mt-6">
              <TopNav />
              <main className="mt-6">
                <Suspense fallback={<div className="bg-card-background border border-border-color rounded-lg p-8 text-center text-text-secondary"><h2>Loading...</h2></div>}>
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

// A simple component to prompt users to log in, styled with the new theme
const LoginPagePrompt = () => {
  const { login } = usePrivy();
  return (
    <div className="bg-card-background border border-border-color rounded-lg max-w-md mx-auto mt-10 p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Please Log In</h2>
      <p className="text-text-secondary mb-6">You need to be logged in to access the application.</p>
      <button onClick={login} className="w-full font-bold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg bg-primary-button-bg text-primary-button-text hover:bg-primary-button-hover-bg">Log In</button>
    </div>
  );
};

export default App;
