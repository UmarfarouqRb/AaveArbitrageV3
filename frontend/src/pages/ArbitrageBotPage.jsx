
import ArbitrageBotController from '../components/ArbitrageBotController';

const ArbitrageBotPage = () => {
  return (
    // Use the main container class for consistent padding and layout
    <div className="arbitrage-bot-container">
      {/* Use the header style from the controller for a unified look */}
      <div className="controller-header">
        <h3>Arbitrage Bot</h3>
        <p className="text-color-muted" style={{ marginTop: '0.5rem' }}>
          Manually trigger the bot to find and execute arbitrage opportunities.
        </p>
      </div>
      <ArbitrageBotController />
    </div>
  );
};

export default ArbitrageBotPage;
