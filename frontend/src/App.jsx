
import React, { useState } from 'react';
import ArbitrageFinder from './components/ArbitrageFinder';
import ArbitrageOpportunities from './components/ArbitrageOpportunities';
import { ConnectEmbed, useActiveAccount } from 'thirdweb/react';

export default function App() {
  const account = useActiveAccount();
  const address = account?.address;
  const activeChain = account?.chain;

  // State for ArbitrageFinder
  const [tokenAddress, setTokenAddress] = useState('');
  const [inputDex, setInputDex] = useState('');
  const [outputDex, setOutputDex] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState(''); // To be implemented if needed

  const handleCheckTrade = () => {
    // Logic to execute when "Check Trade" is clicked
    console.log("Checking trade for:", { tokenAddress, inputDex, outputDex });
    // You would typically trigger an API call or a smart contract interaction here
    alert(`Checking trade for ${tokenAddress} between ${inputDex} and ${outputDex}`);
  };

  const footerStyle = {
    textAlign: 'center',
    padding: '20px',
    marginTop: '40px',
    borderTop: '1px solid #ddd',
    color: '#666'
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <img src="/logo.png" alt="Forge Inc. Logo" style={{ height: '50px' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ConnectEmbed />
          </div>
        </header>

        <div style={{ marginTop: '20px' }}>
          {address && <p>Connected as: <strong>{address}</strong></p>}
          {activeChain && <p>Connected to: <strong>{activeChain.name}</strong></p>}
        </div>

        {/* Arbitrage Finder Section */}
        <ArbitrageFinder 
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress}
          inputDex={inputDex}
          setInputDex={setInputDex}
          outputDex={outputDex}
          setOutputDex={setOutputDex}
          onCheckTrade={handleCheckTrade}
          tokenSymbol={tokenSymbol}
        />

        {/* Arbitrage Opportunities Section */}
        <ArbitrageOpportunities />
      </div>

      <footer style={footerStyle}>
        Powered by forge.inc
      </footer>
    </div>
  );
}
