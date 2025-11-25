
import React, { useReducer, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useNetwork } from '../contexts/NetworkContext';
import { SIMULATE_TRADE_URL, PREPARE_TRADE_URL } from '../config';
import { EXPLORER_URL, TOKENS } from '../constants';

const DEX_OPTIONS = ['Aerodrome', 'PancakeSwap'];
const TOKEN_OPTIONS = ['USDC', 'WETH'];

const initialState = {
  tokenA: TOKEN_OPTIONS[0],
  tokenB: '',
  loanAmount: '1000',
  dex1: DEX_OPTIONS[0],
  dex2: DEX_OPTIONS[1],
  isStable: true,
  loading: false,
  error: null,
  result: null,
  simulating: false,
  simulationResult: null,
  simulationError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_SIMULATION_STATE':
      return { ...state, simulating: true, simulationError: null, simulationResult: null };
    case 'SET_SIMULATION_SUCCESS':
      return { ...state, simulating: false, simulationResult: action.payload };
    case 'SET_SIMULATION_ERROR':
      return { ...state, simulating: false, simulationError: action.payload };
    case 'SET_EXECUTION_STATE':
      return { ...state, loading: true, error: null, result: null };
    case 'SET_EXECUTION_SUCCESS':
      return { ...state, loading: false, result: action.payload };
    case 'SET_EXECUTION_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const ManualTradeV2 = () => {
  const { network } = useNetwork();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    tokenA,
    tokenB,
    loanAmount,
    dex1,
    dex2,
    isStable,
    loading,
    error,
    result,
    simulating,
    simulationResult,
    simulationError,
  } = state;

  const getTokenAddress = (symbol) => TOKENS[network]?.[symbol] || '';

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleFieldChange('tokenB', text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleDex1Change = (e) => {
    const selectedDex = e.target.value;
    handleFieldChange('dex1', selectedDex);
    handleFieldChange('dex2', selectedDex === DEX_OPTIONS[0] ? DEX_OPTIONS[1] : DEX_OPTIONS[0]);
  };

  const handleSimulate = useCallback(async () => {
    dispatch({ type: 'SET_SIMULATION_STATE' });
    try {
      const tokenAAddress = getTokenAddress(tokenA);
      const response = await fetch(SIMULATE_TRADE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network,
          tokenA: tokenAAddress,
          tokenB,
          amount: loanAmount,
          dex1,
          dex2,
          isStable,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Simulation failed');
      }
      dispatch({ type: 'SET_SIMULATION_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_SIMULATION_ERROR', payload: err.message });
    }
  }, [network, tokenA, tokenB, loanAmount, dex1, dex2, isStable]);

  const handleExecuteTrade = async () => {
    dispatch({ type: 'SET_EXECUTION_STATE' });
    try {
      const wallet = wallets[0];
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const tokenAAddress = getTokenAddress(tokenA);
      
      // Step 1: Prepare the trade on the backend
      const prepareResponse = await fetch(PREPARE_TRADE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network,
          userAddress: user.wallet.address,
          tokenA: tokenAAddress,
          tokenB,
          amount: loanAmount,
          dex1,
          dex2,
          isStable,
          fee1: simulationResult.bestFee1,
          fee2: simulationResult.bestFee2,
        }),
      });

      const tradeData = await prepareResponse.json();
      if (!prepareResponse.ok) {
        throw new Error(tradeData.error || 'Failed to prepare trade');
      }
      
      // Step 2: Send the transaction from the frontend
      const { to, data: txData, value } = tradeData.tx;
      const tx = await wallet.sendTransaction({
          to,
          data: txData,
          value
      });

      const receipt = await tx.wait();
      
      dispatch({ type: 'SET_EXECUTION_SUCCESS', payload: { status: 'Completed', txHash: receipt.transactionHash } });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_EXECUTION_ERROR', payload: err.message });
    }
  };

  const isTradeProfitable = simulationResult && simulationResult.isProfitable;
  const explorerBaseUrl = EXPLORER_URL[network] || 'https://basescan.org';

  return (
    <div className="manual-trade-container">
      <h2 className="manual-trade-header">Manual Arbitrage V2</h2>

      <div className="form-section">
         <div className="form-row">
          <label>Loan Token</label>
          <select value={tokenA} onChange={(e) => handleFieldChange('tokenA', e.target.value)}>
            {TOKEN_OPTIONS.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row token-input-container">
          <label>Target Token</label>
          <input
            type="text"
            value={tokenB}
            onChange={(e) => handleFieldChange('tokenB', e.target.value)}
            placeholder="Enter token address"
          />
          <button onClick={handlePaste} className="paste-icon-button" title="Paste from clipboard">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
               <path d="M4 1.5H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h1v-1z"/>
               <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
             </svg>
           </button>
        </div>

        <div className="form-row">
          <label>Loan Amount</label>
          <input
            type="text"
            value={loanAmount}
            onChange={(e) => handleFieldChange('loanAmount', e.target.value)}
          />
        </div>

        <div className="form-row">
           <div className="volatile-swap-section">
            <input
              type="checkbox"
              id="volatile-swap"
              checked={!isStable}
              onChange={(e) => handleFieldChange('isStable', !e.target.checked)}
            />
            <label htmlFor="volatile-swap">Volatile Swap</label>
          </div>
          <div className="dex-selection-section">
            <div>
              <label>DEX 1</label>
              <select value={dex1} onChange={handleDex1Change}>
                {DEX_OPTIONS.map((dex) => (
                  <option key={dex} value={dex}>
                    {dex}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>DEX 2</label>
              <select value={dex2} onChange={(e) => handleFieldChange('dex2', e.target.value)}>
                {DEX_OPTIONS.map((dex) => (
                  <option key={dex} value={dex}>
                    {dex}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSimulate} disabled={simulating || !tokenA || !tokenB || !loanAmount}>
        {simulating ? 'Simulating...' : 'Simulate Trade'}
      </button>

      {simulationError && <p className="error-message">Simulation Error: {simulationError}</p>}

      {simulationResult && (
        <div className={`simulation-result-container ${isTradeProfitable ? 'profit-border' : 'loss-border'}`}>
          <h3>Simulation Result</h3>
          <div>
            <div>
              <span>Estimated Profit:</span>{' '}
              <span className={isTradeProfitable ? 'text-success' : 'text-error'}>
                {simulationResult.estimatedProfit}
              </span>
            </div>
            <div>
              <span>Is Profitable:</span>{' '}
              <span className={isTradeProfitable ? 'text-success' : 'text-error'}>
                {isTradeProfitable ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span>Fee (DEX 1):</span> <span>{simulationResult.bestFee1}</span>
            </div>
            <div>
              <span>Fee (DEX 2):</span> <span>{simulationResult.bestFee2}</span>
            </div>
          </div>
          {isTradeProfitable && (
            <button onClick={handleExecuteTrade} disabled={loading}>
              {loading ? 'Executing...' : 'Execute Trade'}
            </button>
          )}
        </div>
      )}

      {error && <p className="error-message">Execution Error: {error}</p>}

      {result && (
        <div className="result-container">
          <p>Status: {result.status}</p>
          <a href={`${explorerBaseUrl}/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer">
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default ManualTradeV2;
