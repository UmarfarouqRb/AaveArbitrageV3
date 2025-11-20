
import React, { useState, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
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
  const [isStable, setIsStable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState(null);

  const getTokenSymbol = (address) => {
    const tokenEntries = Object.entries(TOKENS[network] || {});
    for (const [symbol, tokenAddress] of tokenEntries) {
      if (tokenAddress.toLowerCase() === address.toLowerCase()) {
        return symbol;
      }
    }
    return address.substring(0, 6);
  };

  const handleDex1Change = (e) => {
    const selectedDex = e.target.value;
    setDex1(selectedDex);
    setDex2(selectedDex === DEX_OPTIONS[0] ? DEX_OPTIONS[1] : DEX_OPTIONS[0]);
  };

  const handleSimulate = useCallback(async () => {
    if (!tokenA || !tokenB || !loanAmount) {
      setSimulationError('Please fill in all fields.');
      return;
    }
    setSimulating(true);
    setSimulationError(null);
    setSimulationResult(null);
    try {
      const tradeParams = { network, tokenA, tokenB, loanAmount, dex1, dex2, stable: isStable };
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
  }, [network, tokenA, tokenB, loanAmount, dex1, dex2, isStable]);

  const handleExecuteTrade = async () => {
    if (!simulationResult || !simulationResult.isProfitable) {
      setError("No profitable trade to execute.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const saveTradeHistory = async (tradeData) => {
        try {
            await fetch('/api/manual-trade-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tradeData),
            });
        } catch (error) {
            console.error("Failed to save manual trade history:", error);
        }
    };

    try {
        const wallet = wallets[0];
        if (!wallet) throw new Error("No wallet connected.");

        const tradeParams = { 
            network, 
            tokenA, 
            tokenB, 
            loanAmount, 
            userAddress: user.wallet.address, 
            dex1,
            dex2,
            bestFee1: simulationResult.bestFee1,
            bestFee2: simulationResult.bestFee2,
            stable: isStable
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

        await saveTradeHistory({
            timestamp: new Date().toISOString(),
            pair: `${getTokenSymbol(tokenA)} -> ${getTokenSymbol(tokenB)}`,
            route: `${dex1} -> ${dex2}`,
            loanAmount: `${loanAmount} ${getTokenSymbol(tokenA)}`,
            status: 'Success',
            actualProfit: simulationResult.estimatedProfit,
            txHash: tx.hash,
            error: null,
        });

    } catch (e) {
        console.error("Execution Error:", e);
        const errorMessage = e.message || "An unexpected error occurred.";
        setError(errorMessage);

        await saveTradeHistory({
            timestamp: new Date().toISOString(),
            pair: `${getTokenSymbol(tokenA)} -> ${getTokenSymbol(tokenB)}`,
            route: `${dex1} -> ${dex2}`,
            loanAmount: `${loanAmount} ${getTokenSymbol(tokenA)}`,
            status: 'Failed',
            actualProfit: 'N/A',
            txHash: null,
            error: errorMessage,
        });
    } finally {
        setLoading(false);
    }
  };

  const isTradeProfitable = simulationResult && simulationResult.isProfitable;
  const explorerBaseUrl = EXPLORER_URL[network] || 'https://basescan.org';

  return (
    <div className="max-w-lg mx-auto bg-card-background p-4 sm:p-6 rounded-2xl border border-border-color">
        <h2 className="text-xl font-bold mb-4 text-text-primary">Manual Arbitrage</h2>
        
        {/* Token Input Section */}
        <div className="bg-background p-4 rounded-xl mb-2">
            <label className="text-xs text-text-secondary">Loan Token</label>
            <input 
                type="text" 
                value={tokenA}
                onChange={(e) => setTokenA(e.target.value)} 
                className="w-full bg-transparent text-2xl font-mono text-text-primary focus:outline-none"
            />
        </div>

        <div className="bg-background p-4 rounded-xl mb-4">
            <label className="text-xs text-text-secondary">Target Token</label>
            <input 
                type="text" 
                value={tokenB}
                onChange={(e) => setTokenB(e.target.value)} 
                className="w-full bg-transparent text-2xl font-mono text-text-primary focus:outline-none"
            />
        </div>

        {/* Loan Amount */}
        <div className="bg-background p-4 rounded-xl mb-4">
            <label className="text-xs text-text-secondary">Loan Amount</label>
            <input 
                type="text" 
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)} 
                className="w-full bg-transparent text-2xl font-mono text-text-primary focus:outline-none"
            />
        </div>

        {/* DEX Selection */}
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-background p-3 rounded-xl">
                <label className="text-xs text-text-secondary">DEX 1</label>
                <select value={dex1} onChange={handleDex1Change} className="w-full bg-transparent text-text-primary focus:outline-none">
                    {DEX_OPTIONS.map(dex => <option key={dex} value={dex} className="bg-background">{dex}</option>)}
                </select>
            </div>
            <div className="bg-background p-3 rounded-xl">
                <label className="text-xs text-text-secondary">DEX 2</label>
                <select value={dex2} onChange={(e) => setDex2(e.target.value)} className="w-full bg-transparent text-text-primary focus:outline-none">
                    {DEX_OPTIONS.map(dex => <option key={dex} value={dex} className="bg-background">{dex}</option>)}
                </select>
            </div>
        </div>

        {/* Volatile Swap Checkbox */}
        <div className="flex items-center justify-center mb-6">
            <input 
                type="checkbox" 
                id="volatile-swap" 
                checked={!isStable} 
                onChange={(e) => setIsStable(!e.target.checked)} 
                className="h-4 w-4 rounded border-border-color text-primary-button-bg focus:ring-primary-button-bg"
            />
            <label htmlFor="volatile-swap" className="ml-2 text-sm text-text-secondary">Volatile Swap</label>
        </div>

        {/* Action Button */}
        <button onClick={handleSimulate} disabled={simulating} className="w-full font-bold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg bg-primary-button-bg text-primary-button-text hover:bg-primary-button-hover-bg">
            {simulating ? 'Simulating...' : 'Simulate Trade'}
        </button>

        {/* Simulation/Result Display */}
        {simulationError && <p className="text-error-color mt-4 text-center">Simulation Error: {simulationError}</p>}
        
        {simulationResult && (
            <div className="mt-6 p-4 bg-background rounded-xl">
                <h3 className="font-bold text-lg text-text-primary mb-2">Simulation Result</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">Estimated Profit:</span> <span className={simulationResult.isProfitable ? 'text-success-color' : 'text-error-color'}>{simulationResult.estimatedProfit}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Is Profitable:</span> <span className={simulationResult.isProfitable ? 'text-success-color' : 'text-error-color'}>{simulationResult.isProfitable ? 'Yes' : 'No'}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Fee (DEX 1):</span> <span>{simulationResult.bestFee1}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Fee (DEX 2):</span> <span>{simulationResult.bestFee2}</span></div>
                </div>
                {isTradeProfitable && (
                    <button onClick={handleExecuteTrade} disabled={loading} className="w-full font-bold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg bg-accent-bg text-accent-text hover:bg-accent-hover-bg mt-4">
                        {loading ? 'Executing...' : 'Execute Trade'}
                    </button>
                )}
            </div>
        )}

        {error && <p className="text-error-color mt-4 text-center">Execution Error: {error}</p>}
        
        {result && (
            <div className="mt-6 p-4 bg-background rounded-xl text-center">
                <p className="font-bold text-lg">Status: {result.status}</p>
                <a href={`${explorerBaseUrl}/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer" className="text-primary-button-bg hover:underline mt-2 inline-block">View on Explorer</a>
            </div>
        )}
    </div>
  );
};

export default ManualTrade;
