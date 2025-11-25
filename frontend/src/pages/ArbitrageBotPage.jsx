import React, { useState, useEffect, useRef } from 'react';

// Helper to format numbers with commas, handling potential non-numeric inputs gracefully.
const formatNumber = (num, decimals = 2) => {
    const value = typeof num === 'number' ? num : parseFloat(num);
    if (isNaN(value)) return '0.00';
    return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// --- Sub-components for the Dashboard ---

const MetricCard = ({ title, value, children }) => (
    <div className="metric-card">
        <div className="metric-card-title">{title}</div>
        <div className="metric-card-value">{children || value || '0'}</div>
    </div>
);

const BotStatus = ({ isOnline }) => (
    <div className="status-indicator">
        <div className={`status-dot ${isOnline ? 'online' : ''}`}></div>
        <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
);

const DashboardPanel = ({ metrics, status }) => (
    <div className="panel dashboard-panel">
        <MetricCard title="Bot Status">
            <BotStatus isOnline={status.isOnline} />
        </MetricCard>
        <MetricCard title="Current Block" value={metrics.currentBlock} />
        <MetricCard title="Total Profit (ETH)" value={`Ξ ${formatNumber(metrics.pnl, 5)}`} />
        <MetricCard title="Trades Executed" value={metrics.tradeCount} />
    </div>
);

const FeedsPanel = ({ opportunities, trades }) => (
    <div className="panel feeds-panel">
        <div className="panel-title">Activity Feed</div>
        {trades.length === 0 && opportunities.length === 0 && <div className="feed-item">No activity yet.</div>}
        {trades.map((trade, index) => (
            <div key={`trade-${trade.txHash || index}`} className="feed-item">
                <div className="feed-item-header">
                    <span>✅ Trade Executed</span>
                    <span className="feed-item-profit">+ {formatNumber(trade.estimatedProfit, 5)} {trade.loanToken}</span>
                </div>
                <div>Path: {trade.path}</div>
                <a href={`https://basescan.org/tx/${trade.txHash}`} target="_blank" rel="noopener noreferrer">View on Basescan</a>
            </div>
        ))}
        {opportunities.map((opp, index) => (
            <div key={`opportunity-${index}`} className="feed-item">
                <div className="feed-item-header">
                    <span>🔍 Opportunity Found</span>
                    <span className="feed-item-profit">+ {formatNumber(opp.estimatedProfit, 5)} {opp.loanToken}</span>
                </div>
                <div>Path: {opp.path} | Loan: {formatNumber(opp.loanAmount)} {opp.loanToken}</div>
            </div>
        ))}
    </div>
);

const LiveLogPanel = ({ logs }) => {
    const logContainerRef = useRef(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = 0;
        }
    }, [logs]);

    return (
        <div className="panel log-panel">
            <div className="panel-title">Live Logs</div>
            <div className="log-container" ref={logContainerRef}>
                {logs.length === 0 && <div className="log-entry">No logs yet. Waiting for new blocks...</div>}
                {logs.map((log, index) => (
                    <div key={`log-${index}`} className={`log-entry ${log.logLevel}`}>
                        <span className="timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Arbitrage Bot Page Component ---

const ArbitrageBotPage = () => {
    const [status, setStatus] = useState({ isOnline: false });
    const [botMetrics, setBotMetrics] = useState({ currentBlock: 0, pnl: 0, tradeCount: 0 });
    const [structuredLogs, setStructuredLogs] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [successfulTrades, setSuccessfulTrades] = useState([]);

    useEffect(() => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${wsProtocol}://${window.location.host.split(':')[0]}:3001`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => setStatus({ isOnline: true });
        ws.onclose = () => setStatus({ isOnline: false });
        ws.onerror = () => setStatus({ isOnline: false });

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'bot-update') {
                    const logEntry = message.data;
                    setStructuredLogs(prev => [logEntry, ...prev].slice(0, 200));

                    switch (logEntry.event) {
                        case 'BOT_STARTED':
                        case 'BLOCK_SCAN':
                            setBotMetrics(prev => ({ ...prev, currentBlock: logEntry.payload.blockNumber || prev.currentBlock }));
                            break;
                        case 'OPPORTUNITY_FOUND':
                            setOpportunities(prev => [logEntry.payload, ...prev].slice(0, 10));
                            break;
                        case 'TRADE_SUCCESS':
                            setSuccessfulTrades(prev => [logEntry.payload, ...prev]);
                            setBotMetrics(prev => ({
                                ...prev,
                                pnl: prev.pnl + parseFloat(logEntry.payload.estimatedProfit),
                                tradeCount: prev.tradeCount + 1
                            }));
                            setOpportunities([]);
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        return () => {
            if (ws.readyState === 1) { // 1 = OPEN
                ws.close();
            }
        };
    }, []);

    return (
        <div className="bot-page-container">
            <DashboardPanel metrics={botMetrics} status={status} />
            <FeedsPanel opportunities={opportunities} trades={successfulTrades} />
            <LiveLogPanel logs={structuredLogs} />
        </div>
    );
};

export default ArbitrageBotPage;
