import React from 'react';

const TokenDisplay = ({ token, amount }) => {
  return (
    <div className="token-display">
      <p>Token: {token}</p>
      <p>Amount: {amount}</p>
    </div>
  );
};

export default TokenDisplay;
