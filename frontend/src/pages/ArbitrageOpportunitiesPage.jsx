
import { useState, useCallback } from 'react';
import { useArbitrageOpportunities } from '../hooks/useArbitrageOpportunities';
import ArbitrageOpportunities from '../components/ArbitrageOpportunities';
import TradeExecutor from '../components/TradeExecutor';
import OpportunitySkeleton from '../components/OpportunitySkeleton';
import EmptyState from '../components/EmptyState';

const ArbitrageOpportunitiesPage = () => {
  const [arbitrageParams, setArbitrageParams] = useState(null);
  const { opportunities, loading, error } = useArbitrageOpportunities(arbitrageParams);

  const handleFindOpportunities = useCallback((params) => {
    setArbitrageParams(params);
  }, []);

  // Render skeletons while loading
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => <OpportunitySkeleton key={index} />);
  };

  return (
    <div className="arbitrage-opportunities-container">
      <h2>Arbitrage Scanner</h2>
      
      {/* The executor is always visible to allow new searches */}
      <TradeExecutor onFindOpportunities={handleFindOpportunities} disabled={loading} />

      {/* Conditional rendering for loading, empty, and data states */}
      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          {renderSkeletons()}
        </div>
      ) : error ? (
        <p className="error-message">Error fetching opportunities: {error.message}</p>
      ) : opportunities.length > 0 ? (
        <ArbitrageOpportunities opportunities={opportunities} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ArbitrageOpportunitiesPage;
