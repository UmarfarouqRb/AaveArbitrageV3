import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';

const ArbitrageBotController = () => {
  const {
    isUnlocked,
    botWalletAddress,
    lockWallet,
    privateKey,
    setAndEncryptPrivateKey
  } = useWallet();

  // --- STATE ---
  const [infuraApiKey, setInfuraApiKey] = useState('');
  const [arbitrageBotAddress, setArbitrageBotAddress] = useState('');
  const [profitThreshold, setProfitThreshold] = useState('0.1');
  const [gasStrategy, setGasStrategy] = useState('medium');
  const [checkInterval, setCheckInterval] = useState(30);

  const [isBotRunning, setIsBotRunning] = useState(false);
  const [log, setLog] = useState('Bot is idle. Configure your settings and start the bot.\n');
  const [error, setError] = useState('');

  const intervalRef = useRef(null);
  const logRef = useRef(null);
  
  const [pkInput, setPkInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('botInfuraApiKey');
    if (storedApiKey) setInfuraApiKey(storedApiKey);

    const storedBotAddress = localStorage.getItem('arbitrageBotAddress');
    if (storedBotAddress) setArbitrageBotAddress(storedBotAddress);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const appendLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prevLog => `${prevLog}${timestamp}: ${message}\n`);
  };

  const runArbitrageCheck = useCallback(async () => {
    if (!privateKey) {
        appendLog("ERROR: Private key is not available. Stopping bot.");
        setIsBotRunning(false);
        return;
    }
    
    appendLog('Scanning for best arbitrage opportunity...');

    try {
      const opportunitiesResponse = await fetch('/.netlify/functions/get-arbitrage-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infuraProjectId: infuraApiKey }),
      });
      
      if (!opportunitiesResponse.ok) {
          const errorData = await opportunitiesResponse.json();
          throw new Error(errorData.message || `Failed to fetch opportunities: ${opportunitiesResponse.statusText}`);
      }
      const opportunitiesData = await opportunitiesResponse.json();
      const opportunities = opportunitiesData.opportunities || [];

      if (opportunities.length === 0) {
        appendLog('No arbitrage opportunities found in this cycle.');
        return;
      }

      let bestOpportunity = opportunities.reduce((prev, current) => (prev.profit > current.profit) ? prev : current);

      if (!bestOpportunity) {
        appendLog('No valid opportunities found to analyze.');
        return;
      }
      
      const bestProfitPercentage = (bestOpportunity.profit * 100).toFixed(4);
      appendLog(`Best opportunity found: ${bestOpportunity.path.join(' -> ')} on ${bestOpportunity.dexs.join(', ')} with ${bestProfitPercentage}% profit.`);

      if (bestOpportunity.profit * 100 < parseFloat(profitThreshold)) {
        appendLog(`Best opportunity profit (${bestProfitPercentage}%) is below threshold (${profitThreshold}%). Waiting for next cycle.`);
        return;
      }

      appendLog(`Profit meets threshold! Executing trade...`);

      const [tokenA, tokenB] = bestOpportunity.tokenAddresses;
      const [routerForSwap1, routerForSwap2] = bestOpportunity.routerAddresses;

      const executionResponse = await fetch('/.netlify/functions/arbitrage-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privateKey,
          infuraProjectId: infuraApiKey,
          tokenA,
          tokenB,
          dex1: routerForSwap1,
          dex2: routerForSwap2,
          arbitrageBotAddress,
          profitThreshold: '0', 
          useDynamicLoan: true, 
          gasStrategy
        }),
      });

      const executionData = await executionResponse.json();

      if (!executionResponse.ok) {
        throw new Error(executionData.message || `Execution server responded with status ${executionResponse.status}`);
      }

      if (executionData.tradeExecuted) {
        appendLog(`SUCCESS! Trade executed. TxHash: ${executionData.txHash}`);
        appendLog(`Gross Profit (before gas): ${executionData.grossProfit} ${bestOpportunity.path[0]}`);
      } else {
        appendLog(`Execution function did not trade. Reason: ${executionData.message}`);
      }
    } catch (err) {
      console.error("Arbitrage check failed:", err);
      appendLog(`ERROR: ${err.message}`);
      setIsBotRunning(false);
    }
  }, [
    privateKey, infuraApiKey, arbitrageBotAddress,
    profitThreshold, gasStrategy
  ]);

  const handleStartBot = () => {
    if (!infuraApiKey || !arbitrageBotAddress) {
      setError('Please save your Infura API Key and Arbitrage Contract Address before starting.');
      return;
    }
    setError('');
    setIsBotRunning(true);
    appendLog(`Bot started. Checking for trades every ${checkInterval} seconds.`);
    runArbitrageCheck();
    intervalRef.current = setInterval(runArbitrageCheck, checkInterval * 1000);
  };

  const handleStopBot = () => {
    setIsBotRunning(false);
    appendLog('Bot stopped by user.');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const handleLockWallet = () => {
      if (isBotRunning) handleStopBot();
      lockWallet();
      appendLog("Wallet locked. Bot stopped.");
  }

  const handleInfuraKeySave = () => {
    sessionStorage.setItem('botInfuraApiKey', infuraApiKey);
    appendLog('Infura API Key saved for this session.');
  };

  const handleBotAddressSave = () => {
    localStorage.setItem('arbitrageBotAddress', arbitrageBotAddress);
    appendLog('Arbitrage Balancer contract address saved.');
  };

  const handleKeyImport = async () => {
      if (!pkInput || !passwordInput) {
          setError("Please provide both a private key and a password.");
          return;
      }
      try {
        await setAndEncryptPrivateKey(pkInput, passwordInput);
      } catch (e) {
          console.error(e);
          setError("Failed to import key. Check console for details.");
      }
  }

  if (!isUnlocked) {
    return (
      <div className="arbitrage-bot-controller-centered">
        <div className="bot-container auth-form">
          <h3>Unlock or Import Wallet</h3>
          <p>Import a new private key or unlock your existing one.</p>
          <div className="form-section">
            <input type="password" value={pkInput} onChange={(e) => setPkInput(e.target.value)} placeholder="Enter Private Key" className="input-field" />
          </div>
          <div className="form-section">
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter a Strong Password" className="input-field" />
          </div>
          <button onClick={handleKeyImport} className="button button-primary">Import & Encrypt</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      );
  }

  return (
    <div className="arbitrage-bot-controller-centered">
      <div className="bot-container">
        <div className="controller-header">
          <h3>Bot Control Panel</h3>
          <p className="wallet-address">Wallet: {botWalletAddress}</p>
          <button onClick={handleLockWallet} className="button button-secondary">Lock Wallet & Stop Bot</button>
        </div>

        <div className="settings-grid">
          <div className="form-section">
              <label>Infura API Key</label>
              <div className="input-group">
                <input type="password" value={infuraApiKey} onChange={(e) => setInfuraApiKey(e.target.value)} placeholder="Your Infura API Key" className="input-field" />
                <button onClick={handleInfuraKeySave} className="button">Save</button>
              </div>
          </div>
          
          <div className="form-section">
              <label>Arbitrage Contract Address</label>
              <div className="input-group">
                  <input value={arbitrageBotAddress} onChange={(e) => setArbitrageBotAddress(e.target.value)} placeholder="0x..." className="input-field" />
                  <button onClick={handleBotAddressSave} className="button">Save</button>
              </div>
          </div>

          <div className="form-section">
            <label>Minimum Profit Threshold (%)</label>
            <input type="number" step="0.01" value={profitThreshold} onChange={(e) => setProfitThreshold(e.target.value)} className="input-field" />
          </div>

          <div className="form-section">
            <label>Gas Price Strategy</label>
            <select value={gasStrategy} onChange={(e) => setGasStrategy(e.target.value)} className="select-field">
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-section">
              <label>Check Interval (seconds)</label>
              <input type="number" value={checkInterval} onChange={(e) => setCheckInterval(Number(e.target.value))} className="input-field" />
          </div>
        </div>

        <h4>Bot Status & Logs</h4>
        <div className="controls">
          <button onClick={handleStartBot} disabled={isBotRunning} className="button button-primary">Start Bot</button>
          <button onClick={handleStopBot} disabled={!isBotRunning} className="button button-danger">Stop Bot</button>
        </div>
        <div className="log-box" ref={logRef}>
          <pre>{log}</pre>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ArbitrageBotController;
