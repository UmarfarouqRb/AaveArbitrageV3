
import React from 'react';

const ArbitrageBotController = ({ status }) => {
  const statusColor = status === 'Online' ? 'green' : status === 'Connecting...' || status === 'Error' ? 'gray' : 'red';

  return (
    <div className="arbitrage-bot-controller-centered">
      <div className="bot-container" style={{ textAlign: 'center' }}>
        <div className="controller-header">
          <h3>Automated Arbitrage Bot</h3>
        </div>

        <div className="status-section">
          <p>The automated arbitrage bot runs 24/7 on our secure backend server.</p>
          <p>You do not need to start, stop, or configure anything here.</p>
        </div>

        <div className="status-indicator">
          <h4>Backend Server Status: 
            <span style={{ color: statusColor, marginLeft: '10px' }}>
              {status}
            </span>
          </h4>
        </div>

        <div className="log-info">
          <p>
            All trading activity and profit reports are logged in real-time below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageBotController;
