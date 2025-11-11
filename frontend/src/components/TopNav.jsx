
import { Link } from 'react-router-dom';
import { FaHome, FaRobot, FaTools } from 'react-icons/fa';
import { useNetwork } from '../contexts/NetworkContext'; // Assuming you have this context

const TopNav = () => {
  const { network, setNetwork } = useNetwork();

  const handleNetworkChange = (e) => {
    const newNetwork = e.target.checked ? 'base-mainnet' : 'base-sepolia';
    setNetwork(newNetwork);
  };

  return (
    <nav className="top-nav">
      <div className="nav-links">
        <Link to="/"><FaHome /> Home</Link>
        <Link to="/arbitrage-bot"><FaRobot /> Arbitrage Bot</Link>
        <Link to="/manual-trade"><FaTools /> Manual Trade</Link>
      </div>
      <div className="network-toggle">
        <span>Base Sepolia</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={network === 'base-mainnet'}
            onChange={handleNetworkChange} 
          />
          <span className="slider round"></span>
        </label>
        <span>Base Mainnet</span>
      </div>
    </nav>
  );
};

export default TopNav;
