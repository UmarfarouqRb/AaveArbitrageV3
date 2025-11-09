import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', textAlign: 'center', color: '#f0f0f0' }}>
      <h2 style={{ color: '#f0f0f0' }}>Welcome to the Arbitrage Bot Dashboard</h2>
      <p>This is your central hub for managing and monitoring arbitrage opportunities.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/finder" style={{ color: '#007bff', textDecoration: 'none', fontSize: '1.2em' }}>Go to Arbitrage Finder</Link>
      </div>
    </div>
  );
};

export default Dashboard;
