import React from 'react';
export default function NetworkToggle({ network, onToggle }) {
  return (
    <button onClick={onToggle} style={{padding:8, background:'#0366d6', color:'#fff', borderRadius:6}}>
      {network === 'sepolia' ? 'Switch to Mainnet' : 'Switch to Sepolia'}
    </button>
  );
}
