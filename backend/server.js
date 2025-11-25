require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const WebSocket = require('ws');
const { prepareTrade } = require('./prepare-trade');
const { simulateTrade } = require('./simulate-trade');
const { getProvider, getGasPrice } = require('./utils');
const { NETWORKS } = require('./config');

const app = express();
const port = process.env.PORT || 3001;
const host = '0.0.0.0';

// --- CORS Configuration ---
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not permitted by CORS policy.'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Serve Frontend ---
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));


// --- File Paths ---
const MANUAL_TRADE_HISTORY_FILE = path.join(__dirname, 'manual_trade_history.json');
const BOT_LOG_FILE = path.join(__dirname, 'bot.log');

// --- Bot Process Management ---
let botProcess = null;
let isBotStopping = false; // To prevent restart on intentional stop
let isRestarting = false;


function broadcast(message) {
    if (!wss || !wss.clients) return;
    const serializedMessage = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(serializedMessage);
        }
    });
}

function startBot() {
    if (botProcess) { // Ensure no multiple instances are running
        console.log('Bot process is already running.');
        return;
    }
    console.log('Starting the arbitrage bot process...');
    isBotStopping = false;
    isRestarting = false;

    botProcess = fork(path.join(__dirname, 'bot.js'), [], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        env: { ...process.env }
    });

    const logStream = fs.createWriteStream(BOT_LOG_FILE, { flags: 'a' });
    botProcess.stdout.pipe(logStream);
    botProcess.stderr.pipe(logStream);

    botProcess.on('message', (message) => {
        broadcast(message);
    });

    botProcess.on('exit', (code) => {
        botProcess = null; // Clear the process handle
        if (isBotStopping) {
            console.log(`Bot process stopped intentionally.`);
        } else {
            console.error(`Bot process terminated unexpectedly with code: ${code}.`);
            if (!isRestarting) {
                isRestarting = true;
                console.log('Attempting to restart bot in 5 seconds...');
                setTimeout(startBot, 5000);
            }
        }
    });

    botProcess.on('error', (err) => {
        console.error('Failed to start bot process:', err);
    });
}

function stopBot() {
    if (botProcess) {
        console.log('Gracefully stopping the arbitrage bot...');
        isBotStopping = true;
        botProcess.kill('SIGTERM'); // Send termination signal
    }
}

// --- API Endpoints ---
app.get('/api/status', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

app.post('/api/manual-trade-history', async (req, res) => {
    try {
        const newTrade = req.body;
        let tradeHistory = [];
        if (fs.existsSync(MANUAL_TRADE_HISTORY_FILE)) {
            const data = await fs.promises.readFile(MANUAL_TRADE_HISTORY_FILE, 'utf8');
            tradeHistory = JSON.parse(data);
        }
        tradeHistory.push(newTrade);
        await fs.promises.writeFile(MANUAL_TRADE_HISTORY_FILE, JSON.stringify(tradeHistory, null, 2));
        res.status(201).json({ message: 'Trade saved successfully.' });
    } catch (error) {
        console.error('Error saving manual trade:', error);
        res.status(500).json({ message: 'Failed to save manual trade.' });
    }
});

app.post('/api/simulate-trade', async (req, res) => {
    try {
        const result = await simulateTrade(req.body);
        res.json(result);
    } catch (error) {
        console.error('Trade Simulation Error:', error);
        res.status(500).json({ message: error.message || 'An unexpected error occurred during simulation.' });
    }
});

app.post('/api/prepare-trade', async (req, res) => {
    try {
        const unsignedTx = await prepareTrade(req.body);
        res.json({ unsignedTx });
    } catch (error) {
        console.error('Trade Preparation Error:', error);
        res.status(500).json({ message: error.message || 'An unexpected error occurred during preparation.' });
    }
});

// --- Fallback for SPA ---
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});


// --- WebSocket Server ---
const server = app.listen(port, host, () => {
    console.log(`Backend server is live at http://${host}:${port}`);
    startBot();
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A new client has connected via WebSocket.');
    ws.send(JSON.stringify({ type: 'status', data: { isOnline: botProcess !== null, message: 'Successfully connected to the server.' } }));
});

// --- Graceful Shutdown Handling ---
const cleanup = () => {
    console.log('Initiating graceful shutdown...');
    stopBot();
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Could not close connections in time, forcing shutdown.');
        process.exit(1);
    }, 10000); // Force exit after 10s
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
