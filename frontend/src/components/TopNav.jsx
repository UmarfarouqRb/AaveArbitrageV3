
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  return (
    <nav className="top-nav">
        <NavLink to="/arbitrage-bot" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Bot Status
        </NavLink>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Manual Trade
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Trade History
        </NavLink>
    </nav>
  );
};

export default TopNav;
