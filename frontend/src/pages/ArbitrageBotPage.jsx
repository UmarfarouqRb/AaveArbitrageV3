
import ArbitrageBotController from '../components/ArbitrageBotController';

const ArbitrageBotPage = () => {
  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Arbitrage Bot</h1>
      <p className="mb-8 text-gray-400">This tool allows you to manually trigger the arbitrage bot to check for opportunities. The bot will use the private key provided for a single run and will not store it.</p>
      <ArbitrageBotController />
    </div>
  );
};

export default ArbitrageBotPage;
