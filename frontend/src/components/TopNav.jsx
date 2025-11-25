
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  const activeLinkClass = "bg-card-background text-text-primary";
  const inactiveLinkClass = "text-text-secondary hover:bg-card-background hover:text-text-primary";

  return (
    <nav className="flex justify-center items-center gap-2 md:gap-4 bg-background rounded-lg p-2">
        <NavLink 
            to="/arbitrage-bot" 
            className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
        >
            Bot Status
        </NavLink>
        <NavLink 
            to="/" 
            className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
        >
            Manual Trade
        </NavLink>
        <NavLink 
            to="/history" 
            className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
        >
            Trade History
        </NavLink>
    </nav>
  );
};

export default TopNav;
