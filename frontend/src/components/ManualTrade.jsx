
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { DEX_CHOICES } from '../constants';
import { useNetwork } from '../contexts/NetworkContext'; // Import the useNetwork hook

const ManualTrade = () => {
  const { network } = useNetwork(); // Get the current network
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [dex1, setDex1] = useState('');
  const [dex2, setDex2] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState(null);

  const executeTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/.netlify/functions/execute-manual-trade', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ network, tokenA, tokenB, dex1, dex2, loanAmount })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error("Failed to execute trade:", e);
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSimulate = useCallback(
    debounce(async (tradeParams) => {
      if (!tradeParams.tokenA || !tradeParams.tokenB || !tradeParams.dex1 || !tradeParams.dex2 || !tradeParams.loanAmount) {
        setSimulationResult(null);
        return;
      }
      setSimulating(true);
      setSimulationError(null);
      try {
        const response = await fetch('/.netlify/functions/simulate-manual-trade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tradeParams),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Simulation failed');
        }
        const data = await response.json();
        setSimulationResult(data);
      } catch (err) {
        setSimulationError(err.message);
        setSimulationResult(null);
      } finally {
        setSimulating(false);
      }
    }, 500), 
    []
  );

  useEffect(() => {
    // Pass the network with other params
    const tradeParams = { network, tokenA, tokenB, dex1, dex2, loanAmount };
    debouncedSimulate(tradeParams);
  }, [network, tokenA, tokenB, dex1, dex2, loanAmount, debouncedSimulate]);

  const isTradeProfitable = simulationResult && simulationResult.isProfitable;

  return (
    <div className="manual-trade-container">
      <h2 className="text-2xl font-bold text-center mb-6">Manual Trade Executor</h2>
      <form onSubmit={executeTrade} className="trade-form bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input type="text" value={tokenA} onChange={(e) => setTokenA(e.target.value)} placeholder="Token to Borrow (e.g., WETH)" className="input input-bordered w-full" required />
          <input type="text" value={tokenB} onChange={(e) => setTokenB(e.target.value)} placeholder="Token to Swap For (e.g., USDC)" className="input input-bordered w-full" required />
          <select value={dex1} onChange={(e) => setDex1(e.target.value)} className="select select-bordered w-full" required>
            <option value="" disabled>Source DEX</option>
            {Object.entries(DEX_CHOICES).map(([key, name]) => (<option key={key} value={key}>{name}</option>))}
          </select>
          <select value={dex2} onChange={(e) => setDex2(e.target.value)} className="select select-bordered w-full" required>
            <option value="" disabled>Destination DEX</option>
            {Object.entries(DEX_CHOICES).map(([key, name]) => (<option key={key} value={key}>{name}</option>))}
          </select>
          <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Loan Amount" className="input input-bordered w-full md:col-span-2" required />
        </div>
        
        <div className="simulation-results-container bg-gray-900 p-4 rounded-md mb-4">
          <h4 className="text-lg font-semibold text-center mb-2">Pre-Trade Simulation</h4>
          {simulating && <p className='text-center text-gray-400'>Simulating...</p>}
          {simulationError && <p className='text-center text-red-500'>{simulationError}</p>}
          {simulationResult && (
            <div className={`text-center font-bold ${isTradeProfitable ? 'text-green-500' : 'text-red-500'}`}>
              <p>Estimated Profit: {simulationResult.estimatedProfit} {simulationResult.profitToken}</p>
              <p>{isTradeProfitable ? "Trade appears profitable." : "Trade does not appear profitable."}</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || simulating || !isTradeProfitable} className="btn btn-primary w-full">{loading ? 'Executing...' : 'Execute Trade'}</button>
      </form>
      
      {error && <div className="text-center text-red-500 mt-4"><p>{error}</p></div>}

      {result && (
        <div className="results-container mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-center mb-4">Trade Result</h3>
          {result.isProfitable ? (
            <div className="text-green-500 text-center">
              <h4 className="text-lg font-semibold">Trade Executed Successfully!</h4>
              <p>Profit: {result.profit} {result.profitToken}</p>
            </div>
          ) : (
            <p className="text-center">Trade was not profitable or failed to execute.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManualTrade;
