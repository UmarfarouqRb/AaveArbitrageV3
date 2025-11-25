import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import TopNav from './components/TopNav';
import LoginPagePrompt from './components/LoginPagePrompt';
import ThemeSwitcher from './components/ThemeSwitcher';
import SideNav from './components/SideNav';
import useOwner from './hooks/useOwner';

// Lazy load the pages
const ArbitrageBotPage = lazy(() => import('./pages/ArbitrageBotPage'));
const ManualTradePage = lazy(() => import('./pages/ManualTradePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

const App = () => {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const owner = useOwner();

  // A wrapper for the authenticated user's view
  const AuthenticatedLayout = () => (
    <div className="container">
        {user && owner && user.wallet.address === owner && <SideNav />}
        <main>
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
          <div className="controls">
            <ThemeSwitcher />
            {ready && authenticated ? (
              <button onClick={logout} className="button">Logout</button>
            ) : (
              <button onClick={login} className="button primary-action">Login</button>
            )}
          </div>
        </header>
        <TopNav />

        <ErrorBoundary>
          {ready ? (
            authenticated ? <AuthenticatedLayout /> : <LoginPagePrompt />
          ) : (
            <div className="loading-container"><h2>Loading Authentication...</h2></div>
          )}
        </ErrorBoundary>

        <footer>
          Powered by Forge Inc.
        </footer>
      </div>
    </Router>
  );
};

export default App;
