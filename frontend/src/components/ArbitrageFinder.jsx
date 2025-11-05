import React, { useState, useEffect } from 'react';

const ArbitrageFinder = ({ tokenAddress, setTokenAddress, inputDex, setInputDex, outputDex, setOutputDex, onCheckTrade, tokenSymbol }) => {
  const [dexOptions, setDexOptions] = useState([]);
  const [loadingDexs, setLoadingDexs] = useState(false);

  useEffect(() => {
    const fetchDexsForToken = async () => {
      if (!tokenAddress) {
        setDexOptions([]);
        return;
      }
      setLoadingDexs(true);
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${tokenAddress}`);
        const data = await response.json();
        if (data.pairs) {
          const availableDexs = [...new Set(data.pairs.map(p => p.dexId).filter(Boolean))];
          setDexOptions(availableDexs);
          // Automatically select the first two DEXs if available
          if (availableDexs.length > 1) {
            setInputDex(availableDexs[0]);
            setOutputDex(availableDexs[1]);
          }
        }
      } catch (error) {
        console.error('Error fetching DEXs for token:', error);
        setDexOptions([]);
      } finally {
        setLoadingDexs(false);
      }
    };

    // Debounce the fetch request to avoid spamming the API on every keystroke
    const handler = setTimeout(() => {
      fetchDexsForToken();
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [tokenAddress, setInputDex, setOutputDex]);

  return (
    <div style={styles.container}>
        <h2 style={styles.header}>Find Arbitrage for a Specific Token</h2>
        <div style={styles.inputContainer}>
            <input
            type="text"
            placeholder="Enter token contract address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            style={styles.tokenInput}
            />
            {tokenSymbol && <span style={styles.tokenSymbol}>{tokenSymbol}</span>}
        </div>
        {loadingDexs ? <p>Loading available exchanges...</p> : (
            <div style={styles.dexSelectors}>
                <div style={styles.selectWrapper}>
                    <label htmlFor="input-dex-finder">Input DEX</label>
                    <select id="input-dex-finder" value={inputDex} onChange={e => setInputDex(e.target.value)} style={styles.select}>
                        <option value="" disabled>Select Input DEX</option>
                        {dexOptions.map(dex => <option key={`in-${dex}`} value={dex}>{dex}</option>)}
                    </select>
                </div>
                <div style={styles.selectWrapper}>
                    <label htmlFor="output-dex-finder">Output DEX</label>
                    <select id="output-dex-finder" value={outputDex} onChange={e => setOutputDex(e.target.value)} style={styles.select}>
                        <option value="" disabled>Select Output DEX</option>
                        {dexOptions.map(dex => <option key={`out-${dex}`} value={dex}>{dex}</option>)}
                    </select>
                </div>
            </div>
        )}
         <button onClick={onCheckTrade} style={styles.button} disabled={!inputDex || !outputDex || loadingDexs}>
            Check Trade
        </button>
    </div>
  );
};

const styles = {
    container: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '40px' },
    header: { color: '#333', textAlign: 'center', marginBottom: '20px' },
    inputContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    tokenInput: { flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
    tokenSymbol: { fontWeight: 'bold', fontSize: '16px' },
    dexSelectors: { display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px' },
    selectWrapper: { display: 'flex', flexDirection: 'column', flex: 1 },
    select: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' },
    button: { width: '100%', padding: '12px', fontSize: '18px', fontWeight: 'bold', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default ArbitrageFinder;
