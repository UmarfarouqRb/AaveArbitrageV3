
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  return (
    <nav className="topnav-container">
        <NavLink 
            to="/arbitrage-bot" 
            className={({ isActive }) => `topnav-item ${isActive ? 'active' : ''}`}
        >
            Bot Status
        </NavLink>
        <NavLink 
            to="/" 
            end // Use 'end' to ensure this doesn't stay active for child routes
            className={({ isActive }) => `topnav-item ${isActive ? 'active' : ''}`}
        >
            Manual Trade
        </NavLink>
        <NavLink 
            to="/history" 
            className={({ isActive }) => `topnav-item ${isActive ? 'active' : ''}`}
        >
            Trade History
        </NavLink>
    </nav>
  );
};

export default TopNav;
