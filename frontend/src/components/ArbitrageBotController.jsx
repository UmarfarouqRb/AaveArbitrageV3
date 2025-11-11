
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { EXECUTE_ARBITRAGE_URL } from '../config';

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
  const [gasStrategy, setGasStrategy] = useState('normal'); // Default to normal
  
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [log, setLog] = useState('Bot is idle. Configure your settings and start the bot.\n');
  const [error, setError] = useState('');

  const logRef = useRef(null);
  
  const [pkInput, setPkInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('botInfuraApiKey');
    if (storedApiKey) setInfuraApiKey(storedApiKey);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const appendLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prevLog => `${prevLog}${timestamp}: ${message}\n`);
  };

  const runArbitrageScan = useCallback(async () => {
    if (!privateKey) {
        appendLog("ERROR: Private key is not available. Please unlock your wallet.");
        setIsBotRunning(false);
        return;
    }
    
    appendLog(`Initiating new scan-and-execute cycle with ${gasStrategy} gas strategy...`);
    setIsBotRunning(true);
    setError('');

    try {
      const executionResponse = await fetch(EXECUTE_ARBITRAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privateKey,
          infuraProjectId: infuraApiKey,
          gasStrategy
        }),
      });

      const executionData = await executionResponse.json();

      if (!executionResponse.ok) {
        throw new Error(executionData.message || `Execution server responded with status ${executionResponse.status}`);
      }

      if (executionData.tradeExecuted) {
        appendLog(`SUCCESS! Trade executed. TxHash: ${executionData.txHash}`);
        appendLog(`Simulated Gross Profit (before gas): ${executionData.simulatedGrossProfit}`);
      } else {
        appendLog(`Scan complete. ${executionData.message}`);
      }
    } catch (err) {
      console.error("Arbitrage scan failed:", err);
      appendLog(`ERROR: ${err.message}`);
    } finally {
        setIsBotRunning(false);
        appendLog("Scan cycle finished. Ready for next run.");
    }
  }, [
    privateKey, infuraApiKey, gasStrategy
  ]);

  const handleStartBot = () => {
    if (!infuraApiKey) {
      setError('Please save your Infura API Key before starting.');
      return;
    }
    runArbitrageScan();
  };
  
  const handleLockWallet = () => {
      lockWallet();
      appendLog("Wallet locked.");
  }

  const handleInfuraKeySave = () => {
    sessionStorage.setItem('botInfuraApiKey', infuraApiKey);
    appendLog('Infura API Key saved for this session.');
  };

  const handleKeyImport = async () => {
      if (!pkInput || !passwordInput) {
          setError("Please provide both a private key and a password.");
          return;
      }
      try {
        await setAndEncryptPrivateKey(pkInput, passwordInput);
        // Clear inputs after import for security
        setPkInput('');
        setPasswordInput('');
        setError('');
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
          <p>Import a new private key or unlock your existing one to begin.</p>
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
          <button onClick={handleLockWallet} className="button button-secondary">Lock Wallet</button>
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
            <label>Gas Price Strategy</label>
            <select value={gasStrategy} onChange={(e) => setGasStrategy(e.target.value)} className="select-field">
              <option value="normal">Normal</option> {/* Changed from medium */}
              <option value="fast">Fast</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <h4>Bot Status & Logs</h4>
        <div className="controls">
          <button onClick={handleStartBot} disabled={isBotRunning} className="button button-primary">
            {isBotRunning ? 'Scanning...' : 'Start Scan-and-Execute'}
          </button>
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
