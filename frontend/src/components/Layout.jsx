import { useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkContext } from '../contexts/NetworkContext';
import { networks } from '../utils/networks';

export default function Layout({ children, isOwner }) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { selectedNetwork, setSelectedNetwork } = useContext(NetworkContext);

  const handleNetworkChange = useCallback((e) => {
    setSelectedNetwork(e.target.value);
  }, [setSelectedNetwork]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212', color: '#f0f0f0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0 }}><Link to="/" style={{ color: '#f0f0f0', textDecoration: 'none' }}>Arbitrage Finder</Link></h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/finder" style={{ color: '#f0f0f0', textDecoration: 'none', marginRight: '15px' }}>Finder</Link>
          <Link to="/arbitrage-bot" style={{ color: '#f0f0f0', textDecoration: 'none', marginRight: '15px' }}>Arbitrage Bot</Link>
          {isOwner && <Link to="/owner" style={{ color: '#f0f0f0', textDecoration: 'none', marginRight: '15px' }}>Owner</Link>}
          <select value={selectedNetwork} onChange={handleNetworkChange} style={{ marginRight: '15px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#f0f0f0' }}>
            {Object.keys(networks).map(networkKey => (
              <option key={networkKey} value={networkKey}>
                {networks[networkKey].name}
              </option>
            ))}
          </select>
          {ready && (authenticated ? (
            <button onClick={logout} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          ) : (
            <button onClick={login} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
          ))}
        </div>
      </header>
      <main style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <footer style={{ padding: '15px 20px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', textAlign: 'center', fontSize: '0.9em', color: '#888' }}>
        <p style={{ margin: 0 }}>powered by forge inc</p>
      </footer>
    </div>
  );
}
