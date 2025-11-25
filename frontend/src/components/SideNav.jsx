import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaRobot, FaListAlt, FaTools } from 'react-icons/fa';

const SideNav = ({ isOwner }) => {
  return (
    <nav className="sidenav" style={{ display: 'none' }}>
      <ul>
        <li><Link to="/"><FaHome />Home</Link></li>
        <li><Link to="/finder"><FaSearch />Arbitrage Finder</Link></li>
        <li><Link to="/arbitrage-bot"><FaRobot />Arbitrage Bot</Link></li>
        <li><Link to="/opportunities"><FaListAlt />Arbitrage Opportunities</Link></li>
        {isOwner && <li><Link to="/owner"><FaTools />Owner Tools</Link></li>}
      </ul>
    </nav>
  );
};

export default SideNav;
