
import React, { useState, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { FiSearch } from 'react-icons/fi';
import { useNetwork } from '../contexts/NetworkContext';
import { SIMULATE_TRADE_URL, PREPARE_TRADE_URL } from '../config';
import { EXPLORER_URL, TOKENS } from '../constants';

const DEX_OPTIONS = ['Aerodrome', 'PancakeSwap'];

const ManualTrade = () => {
  const { network } = useNetwork();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [tokenA, setTokenA] = useState(TOKENS[network]?.USDC || '');
  const [tokenB, setTokenB] = useState('');
  const [loanAmount, setLoanAmount] = useState('1000');
  const [dex1, setDex1] = useState(DEX_OPTIONS[0]);
  const [dex2, setDex2] = useState(DEX_OPTIONS[1]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState(null);

  const handleDex1Change = (e) => {
    const selectedDex = e.target.value;
    setDex1(selectedDex);
    setDex2(selectedDex === DEX_OPTIONS[0] ? DEX_OPTIONS[1] : DEX_OPTIONS[0]);
  };

  const handleSearch = useCallback(async () => {
    if (!tokenA || !tokenB || !loanAmount) {
      setSimulationError('Please fill in all fields.');
      return;
    }
    setSimulating(true);
    setSimulationError(null);
    setSimulationResult(null);
    try {
      const tradeParams = { network, tokenA, tokenB, loanAmount, dex1, dex2 };
      const response = await fetch(SIMULATE_TRADE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeParams),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Simulation failed');
      }
      const data = await response.json();
      setSimulationResult(data);
    } catch (err) {
      setSimulationError(err.message);
    } finally {
      setSimulating(false);
    }
  }, [network, tokenA, tokenB, loanAmount, dex1, dex2]);

  const handleExecuteTrade = async () => {
    if (!simulationResult || !simulationResult.isProfitable) {
      setError("No profitable trade to execute.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
        const wallet = wallets[0];
        if (!wallet) throw new Error("No wallet connected.");

        const tradeParams = { 
            network, 
            tokenA, 
            tokenB, 
            loanAmount, 
            userAddress: user.wallet.address, 
            dex1, // Use state for dex1
            dex2, // Use state for dex2
        };

        const prepareResponse = await fetch(PREPARE_TRADE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tradeParams)
        });

        if (!prepareResponse.ok) {
            const errorData = await prepareResponse.json();
            throw new Error(errorData.message || 'Failed to prepare trade');
        }

        const { unsignedTx } = await prepareResponse.json();

        const provider = await wallet.getEthersProvider();
        const signer = await provider.getSigner();
        
        if (unsignedTx.gasPrice) unsignedTx.gasPrice = BigInt(unsignedTx.gasPrice);
        if (unsignedTx.gasLimit) unsignedTx.gasLimit = BigInt(unsignedTx.gasLimit);

        const tx = await signer.sendTransaction(unsignedTx);
        setResult({ txHash: tx.hash, status: 'pending' });

        await tx.wait();
        setResult({ txHash: tx.hash, status: 'success', profit: 'View on explorer' });

    } catch (e) {
        console.error("Execution Error:", e);
        setError(e.message || "An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  const isTradeProfitable = simulationResult && simulationResult.isProfitable;
  const explorerBaseUrl = EXPLORER_URL[network] || 'https://basescan.org';

  return (
    <div className="manual-trade-container">
        <div className="manual-trade-header">
            <h3>Manual Arbitrage</h3>
            {user?.wallet && <p className="wallet-address">{user.wallet.address.substring(0, 6)}...{user.wallet.address.substring(user.wallet.address.length - 4)}</p>}
        </div>

        <div className="trade-form">
            <div className="input-group">
                <label>Borrow</label>
                <div className="token-input">
                    <select value={tokenA} onChange={(e) => setTokenA(e.target.value)}>
                        <option value={TOKENS[network]?.USDC}>USDC</option>
                        <option value={TOKENS[network]?.WETH}>WETH</option>
                    </select>
                    <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Amount" />
                </div>
            </div>

            <div className="input-group">
                <label>Target Token</label>
                <div className="token-input">
                    <input type="text" value={tokenB} onChange={(e) => setTokenB(e.target.value)} placeholder="Paste token address" />
                     <button onClick={handleSearch} disabled={simulating} className="search-button">
                        <FiSearch />
                    </button>
                </div>
            </div>

            <div className="dex-selection">
                <div className="input-group">
                    <label>Input DEX</label>
                    <select value={dex1} onChange={handleDex1Change}>
                        {DEX_OPTIONS.map(dex => <option key={dex} value={dex}>{dex}</option>)}
                    </select>
                </div>
                <div className="input-group">
                    <label>Output DEX</label>
                    <select value={dex2} disabled>
                        <option value={dex2}>{dex2}</option>
                    </select>
                </div>
            </div>
        </div>

        {simulating && <div className="loading-message">Scanning for opportunities...</div>}
        {simulationError && <div className="error-message">{simulationError}</div>}

        {simulationResult && (
            <div className="trade-info">
                <h4>Arbitrage Opportunity</h4>
                <p><span>Path:</span> <span>{simulationResult.bestDexPath}</span></p>
                <p><span>Estimated Profit:</span> <span className={isTradeProfitable ? 'text-success' : 'text-danger'}>{simulationResult.estimatedProfit}</span></p>
                <p><span>Gas Cost:</span> <span>{simulationResult.gasCost}</span></p>
                <p><span>Slippage:</span> <span>{simulationResult.slippage}</span></p>
                <button onClick={handleExecuteTrade} disabled={loading || !isTradeProfitable} className="trade-button">
                    {loading ? 'Executing...' : 'Execute Trade'}
                </button>
            </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {result && (
            <div className="trade-info">
                <h4>{result.status === 'pending' ? 'Transaction Sent!' : 'Trade Executed!'}</h4>
                <p><span>Transaction:</span> <a href={`${explorerBaseUrl}/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer">View on Explorer</a></p>
            </div>
        )}
    </div>
  );
};

export default ManualTrade;
