import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import './components.css';
import ErrorBoundary from './components/ErrorBoundary';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import LoginPagePrompt from './components/LoginPagePrompt';

// Lazy load the pages
const ArbitrageBotPage = lazy(() => import('./pages/ArbitrageBotPage'));
const ManualTradePage = lazy(() => import('./pages/ManualTradePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

const App = () => {
  const { login, logout, ready, authenticated } = usePrivy();

  // A wrapper for the authenticated user's view
  const AuthenticatedLayout = () => (
    <div className="container">
        <SideNav />
        <main>
            <TopNav />
            <Suspense fallback={<div className="loading-container"><h2>Loading...</h2></div>}>
              <Routes>
                <Route path="/" element={<ManualTradePage />} />
                <Route path="/arbitrage-bot" element={<ArbitrageBotPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </Suspense>
        </main>
    </div>
  );

  return (
    <Router>
      <div id="app-container">
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

        <ErrorBoundary>
          {ready ? (
            authenticated ? <AuthenticatedLayout /> : <LoginPagePrompt />
          ) : (
            <div className="loading-container"><h2>Loading Authentication...</h2></div>
          )}
        </ErrorBoundary>

      </div>
    </Router>
  );
};

export default App;
