import { useState, useEffect, useRef, useCallback } from 'react';
import { Wallet } from 'ethers';
import './ArbitrageBotController.css';

const ArbitrageBotController = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [botWalletAddress, setBotWalletAddress] = useState('');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [log, setLog] = useState('Bot is idle. Enter a private key and start the bot to check for opportunities.');

  const intervalRef = useRef(null);
  const logRef = useRef(null);

  const handlePrivateKeyChange = useCallback((pk) => {
    setPrivateKey(pk);
    try {
      if (pk.startsWith('0x') && pk.length === 66) {
        const wallet = new Wallet(pk);
        setBotWalletAddress(wallet.address);
        sessionStorage.setItem('botPrivateKey', pk);
      } else {
        setBotWalletAddress('');
      }
    } catch (error) {
      setBotWalletAddress('Invalid Private Key');
    }
  }, []);

  useEffect(() => {
    const storedPrivateKey = sessionStorage.getItem('botPrivateKey');
    if (storedPrivateKey) {
      handlePrivateKeyChange(storedPrivateKey);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [handlePrivateKeyChange]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const handleResetPrivateKey = () => {
    if (isBotRunning) {
      setLog(prev => `${prev}\n[${new Date().toLocaleTimeString()}] Error: Please stop the bot before resetting the private key.`);
      return;
    }
    setPrivateKey('');
    setBotWalletAddress('');
    sessionStorage.removeItem('botPrivateKey');
    setLog('Private key has been reset. The bot is now idle.');
  };

  const runArbitrageCheck = useCallback(async () => {
    setLog(prev => `${prev}\n[${new Date().toLocaleTimeString()}] Checking for opportunities...`);
    try {
      const response = await fetch('/.netlify/functions/arbitrage-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP error! status: ${response.status}`);
      setLog(prev => `${prev}\n[${new Date().toLocaleTimeString()}] ${result.message}`);
    } catch (error) {
      console.error('Error during arbitrage check:', error);
      setLog(prev => `${prev}\n[${new Date().toLocaleTimeString()}] Error: ${error.message}`);
    }
  }, [privateKey]);

  const handleToggleBot = () => {
    if (isBotRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsBotRunning(false);
      setLog(prev => `${prev}\n[${new Date().toLocaleTimeString()}] Bot has been stopped.`);
    } else {
      if (!privateKey || !botWalletAddress || botWalletAddress === 'Invalid Private Key') {
        setLog('Error: Please enter a valid private key before starting the bot.');
        return;
      }
      setIsBotRunning(true);
      setLog(`[${new Date().toLocaleTimeString()}] Bot started! It will check for opportunities every 15 seconds.`);
      runArbitrageCheck();
      intervalRef.current = setInterval(runArbitrageCheck, 15000);
    }
  };

  return (
    <div className="bot-controller-container">
      <h2 className="bot-controller-title">Arbitrage Bot Controller</h2>
      
      <div className="input-group">
        <label htmlFor="privateKey">Bot Private Key (persists in session)</label>
        <div className="input-with-button">
          <input
            type="password"
            id="privateKey"
            value={privateKey}
            onChange={(e) => handlePrivateKeyChange(e.target.value)}
            className="input"
            placeholder="Enter EOA private key (0x...)"
            disabled={isBotRunning}
          />
          <button
            onClick={handleResetPrivateKey}
            disabled={isBotRunning}
            className="button-reset"
            title="Reset Private Key"
          >
            Reset
          </button>
        </div>
      </div>

      {botWalletAddress && (
        <div className="wallet-address-info">
          <p>Bot Wallet Address:</p>
          <p className="font-mono">{botWalletAddress}</p>
        </div>
      )}

      <button
        onClick={handleToggleBot}
        disabled={!botWalletAddress || botWalletAddress === 'Invalid Private Key'}
        className={`button-toggle ${isBotRunning ? 'stop' : 'start'}`}
      >
        {isBotRunning ? 'Stop Bot' : 'Start Bot'}
      </button>

      <div className="log-container">
          <h3>Bot Logs:</h3>
          <pre className="log-content" ref={logRef}>{log}</pre>
      </div>
    </div>
  );
};

export default ArbitrageBotController;
