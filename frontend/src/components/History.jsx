
import React, { useState, useEffect } from 'react';

const TradeHistory = () => {
  const [botHistory, setBotHistory] = useState([]);
  const [manualHistory, setManualHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const [botResponse, manualResponse] = await Promise.all([
          fetch('/api/trade-history'),
          fetch('/api/manual-trade-history'),
        ]);

        if (!botResponse.ok) {
          throw new Error(`Failed to fetch bot history: ${botResponse.status} ${botResponse.statusText}`);
        }
        if (!manualResponse.ok) {
          throw new Error(`Failed to fetch manual history: ${manualResponse.status} ${manualResponse.statusText}`);
        }

        const botData = await botResponse.json();
        const manualData = await manualResponse.json();

        setBotHistory(botData);
        setManualHistory(manualData);
        setError('');
      } catch (err) {
        console.error("Error fetching trade history:", err);
        setError('Could not load trade history. The backend may be offline or starting up.');
      }
      finally {
        setLoading(false);
      }
    };

    fetchHistory();

    const intervalId = setInterval(fetchHistory, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const renderStatus = (status) => {
    const statusClassName = status === 'Success' ? 'status-success' : 'status-failed';
    return <span className={statusClassName}>{status}</span>;
  };

  const renderHistoryTable = (title, history) => (
    <div id="trade-history-section">
      <h3>{title}</h3>
      {history.length === 0 ? (
        <div id="empty-state">
          <p>No trade history found.</p>
        </div>
      ) : (
        <div id="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Pair</th>
                <th>Route</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {history.map((trade, index) => (
                <tr key={index}>
                  <td>{new Date(trade.timestamp).toLocaleString()}</td>
                  <td>{renderStatus(trade.status)}</td>
                  <td>{trade.pair}</td>
                  <td>{trade.route}</td>
                  <td>
                    {trade.status === 'Success' ? (
                      `Profit: ${trade.actualProfit}`
                    ) : (
                      `Error: ${trade.error || 'N/A'}`
                    )}
                    <br />
                    <small>Loan: {trade.loanAmount}</small>
                    {trade.txHash && <><br /><a href={`https://basescan.org/tx/${trade.txHash}`} target="_blank" rel="noopener noreferrer">View Tx</a></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div id="loading-message">Loading history...</div>;
  }

  if (error) {
    return <div id="error-message">{error}</div>;
  }

  return (
    <div id="trade-history-container">
      {renderHistoryTable('Automated Bot Trade History', botHistory)}
      {renderHistoryTable('Manual Trade History', manualHistory)}
    </div>
  );
};

export default TradeHistory;
