import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import './components.css';
import ErrorBoundary from './components/ErrorBoundary';
import TopNav from './components/TopNav';
import LoginPagePrompt from './components/LoginPagePrompt';

// Lazy load the pages
const ArbitrageBotPage = lazy(() => import('./pages/ArbitrageBotPage'));
const ManualTradePage = lazy(() => import('./pages/ManualTradePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

const App = () => {
  const { login, logout, ready, authenticated } = usePrivy();

  return (
    <Router>
      {/* Main container with dark background */}
      <div id="app-container">
        {/* Header section */}
        <header>
          <h1>
            <Link to="/">FlashBot</Link>
          </h1>
          <div>
            {ready && authenticated ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <button onClick={login}>Login</button>
            )}
          </div>
        </header>
        
        {/* Navigation and main content area */}
        <div className="container">
          <TopNav />
          <main>
            <Suspense fallback={<div className="loading-container"><h2>Loading...</h2></div>}>
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
    </Router>
  );
};

export default App;
