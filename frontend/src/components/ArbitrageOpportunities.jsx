import React from 'react';

// This component now receives props from a parent (like Dashboard)
const ArbitrageOpportunities = ({ opportunities, loading, error }) => {

  if (loading) {
    return <div className="text-center"><h2>Loading Opportunities...</h2></div>;
  }

  if (error) {
    return <div className="text-center text-danger"><h2>Error</h2><p>{error}</p></div>;
  }

  return (
    <div className="arbitrage-opportunities-container">
      <h2>Market Scanner</h2>
      {opportunities.length > 0 ? (
        <table className="opportunities-table">
          <thead>
            <tr>
              <th>Path</th>
              <th>Estimated Profit</th>
              <th>DEX Route</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map(op => (
              <tr key={op.id}>
                <td data-label="Path">{op.path.join(' -> ')}</td>
                <td data-label="Est. Profit" className={op.profit > 0 ? 'text-success' : 'text-danger'}>
                  {`${(op.profit * 100).toFixed(3)}%`}
                </td>
                <td data-label="DEXs">{op.dexs.join(' -> ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No arbitrage opportunities found at the moment.</p>
      )}
    </div>
  );
};

export default ArbitrageOpportunities;
