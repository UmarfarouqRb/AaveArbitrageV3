
import React from 'react';

const TradeHistory = ({ trades }) => {
  return (
    <div className="trade-history-container">
      <h2>Trade History</h2>
      {trades.length > 0 ? (
        <ul className="trade-list">
          {trades.map((trade, index) => (
            <li key={index} className="trade-item">
              <p><strong>Profit:</strong> {trade.profit}</p>
              <p><strong>Route:</strong> {trade.route}</p>
              <p><strong>Transaction:</strong> <a href={trade.transactionUrl} target="_blank" rel="noopener noreferrer">View on Basescan</a></p>
              {trade.input && (
                <>
                  <strong>Input Data:</strong>
                  <pre className="input-data">{trade.input}</pre>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No trades recorded yet.</p>
      )}
    </div>
  );
};

export default TradeHistory;
