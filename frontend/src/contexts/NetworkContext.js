import React, { createContext, useState, useMemo } from 'react';
import { networks } from '../utils/networks';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('base-sepolia');

  const networkConfig = useMemo(() => networks[selectedNetwork], [selectedNetwork]);

  return (
    <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork, networkConfig }}>
      {children}
    </NetworkContext.Provider>
  );
};
