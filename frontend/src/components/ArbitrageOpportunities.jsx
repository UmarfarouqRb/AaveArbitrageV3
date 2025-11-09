import { useState, useContext, useCallback } from 'react';
import { NetworkContext } from '../contexts/NetworkContext';
import { useArbitrageExecutor } from '../hooks/useArbitrageExecutor';
import './ArbitrageOpportunities.css';

const ArbitrageOpportunities = ({ opportunities, loading, error: fetchError }) => {
  const [amounts, setAmounts] = useState({});
  const [gasEstimates, setGasEstimates] = useState({});
  const { networkConfig } = useContext(NetworkContext);
  const { executeTrade, isExecuting, error: executionError, estimateGas } = useArbitrageExecutor();

  const handleAmountChange = useCallback(async (id, value) => {
    setAmounts(prev => ({ ...prev, [id]: value }));
    const opportunity = opportunities.find(op => op.id === id);
    if (value > 0 && opportunity) {
      const gasCostInEth = await estimateGas(opportunity, value);
      if (gasCostInEth) {
        const ethPrice = 3000; // In a real app, this would be fetched from a price oracle.
        const gasCostInUsd = (parseFloat(gasCostInEth) * ethPrice).toFixed(2);
        setGasEstimates(prev => ({ ...prev, [id]: gasCostInUsd }));
      } else {
        setGasEstimates(prev => ({ ...prev, [id]: 'N/A' }));
      }
    } else {
      setGasEstimates(prev => ({ ...prev, [id]: null }));
    }
  }, [opportunities, estimateGas]);

  const handleExecute = useCallback((opportunity) => {
    const amount = amounts[opportunity.id];
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    executeTrade(opportunity, amount);
  }, [amounts, executeTrade]);

  return (
    <div className="arbitrage-opportunities-container">
      <h2>Arbitrage Opportunities</h2>
      {fetchError && <p className="error-message">{fetchError}</p>}
      {executionError && <p className="error-message">Execution failed: {executionError}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Token Pair</th>
              <th>Exchanges</th>
              <th>Est. Gas Cost (USD)</th>
              <th>Net Profit (USD)</th>
              <th>ROI</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : opportunities && opportunities.length > 0 ? (
              opportunities.map((op) => {
                const amount = amounts[op.id] || 0;
                const gasCost = gasEstimates[op.id];
                const grossProfit = (op.profit * amount).toFixed(2);
                const netProfit = gasCost && gasCost !== 'N/A' ? (grossProfit - parseFloat(gasCost)).toFixed(2) : grossProfit;

                return (
                  <tr key={op.id}>
                    <td>{op.tokenA.substring(0, 6)}.../{op.tokenB.substring(0, 6)}...</td>
                    <td>{op.buyOn} vs {op.sellOn}</td>
                    <td>{gasCost ? `$${gasCost}` : '$0.00'}</td>
                    <td style={{ color: netProfit < 0 ? '#dc3545' : '#28a745' }}>
                      ${netProfit}
                    </td>
                    <td>{op.potentialGain}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="e.g., 1.0"
                        className="amount-input"
                        value={amounts[op.id] || ''}
                        onChange={(e) => handleAmountChange(op.id, e.target.value)}
                        disabled={isExecuting}
                      />
                    </td>
                    <td>
                      <button 
                        className="execute-button" 
                        onClick={() => handleExecute(op)}
                        disabled={isExecuting || !gasCost || netProfit < 0}
                      >
                        {isExecuting ? 'Executing...' : 'Execute'}
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No opportunities found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArbitrageOpportunities;
