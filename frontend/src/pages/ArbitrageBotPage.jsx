
import React, { useState, useEffect } from 'react';
import ArbitrageBotController from '../components/ArbitrageBotController';
import BotLogs from '../components/BotLogs';
import TradeHistory from '../components/TradeHistory';

const ArbitrageBotPage = () => {
  const [status, setStatus] = useState('Connecting...');
  const [logs, setLogs] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Use window.location.host to dynamically determine the WebSocket URL
    // This works for both local development and deployed environments like Render
    const wsUrl = `ws://${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setStatus('Online');
      setLogs(prev => [...prev, 'Connected to bot server.']);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'status':
          setStatus(message.data.isOnline ? 'Online' : 'Offline');
          break;
        case 'log':
          setLogs(prev => [...prev, message.data]);
          break;
        case 'trade':
          setTrades(prev => [message.data, ...prev]);
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      setStatus('Offline');
      setLogs(prev => [...prev, 'Disconnected from bot server.']);
    };

    ws.onerror = (error) => {
        setStatus('Error');
        setLogs(prev => [...prev, `WebSocket Error: ${error.message}`]);
    }

    // Clean up the connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="arbitrage-bot-container">
      <div className="controller-header">
        <h3>Arbitrage Bot</h3>
        <p className="page-description">
          Live status and activity of the automated arbitrage bot.
        </p>
      </div>
      <ArbitrageBotController status={status} />
      <BotLogs logs={logs} />
      <TradeHistory trades={trades} />
    </div>
  );
};

export default ArbitrageBotPage;
