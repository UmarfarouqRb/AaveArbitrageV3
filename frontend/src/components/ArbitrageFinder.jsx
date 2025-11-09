import { useState, useCallback } from 'react';
import { useArbitrageOpportunities } from '../hooks/useArbitrageOpportunities';
import ArbitrageOpportunities from './ArbitrageOpportunities';
import TradeExecutor from './TradeExecutor';
import '../ArbitrageFinder.css';

const ArbitrageFinder = () => {
  const [arbitrageParams, setArbitrageParams] = useState(null);
  const { opportunities, loading, error } = useArbitrageOpportunities(arbitrageParams);

  const handleFindOpportunities = useCallback((params) => {
    setArbitrageParams(params);
  }, []);

  return (
    <div>
      <TradeExecutor onFindOpportunities={handleFindOpportunities} />
      <ArbitrageOpportunities opportunities={opportunities} loading={loading} error={error} />
    </div>
  );
};

export default ArbitrageFinder;
