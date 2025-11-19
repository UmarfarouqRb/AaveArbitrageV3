
import React, { useRef, useEffect } from 'react';

const BotLogs = ({ logs }) => {
  const logsEndRef = useRef(null);

  // Auto-scroll to the bottom of the logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bot-logs-container">
      <h4 className="logs-header">Live Bot Logs</h4>
      <div className="logs-content">
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            <span className="log-timestamp">{new Date().toLocaleTimeString()}:</span>
            <span className="log-message">{log}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default BotLogs;
