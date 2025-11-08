import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const ArbitrageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const fetchAndRankOpportunities = async () => {
    if (!tokenAddress) {
      setOpportunities([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${tokenAddress}`);
      if (!response.ok) {
        throw new Error('API Error: Could not fetch arbitrage opportunities.');
      }
      const data = await response.json();

      if (data.pairs) {
        const pairsBySymbol = data.pairs.reduce((acc, pair) => {
          if (!pair.baseToken.symbol || !pair.quoteToken.symbol || !pair.priceNative) return acc;
          const key = `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(pair);
          return acc;
        }, {});

        const rankedOpportunities = Object.values(pairsBySymbol)
          .map(group => {
            if (group.length < 2) return null;

            let lowestPricePair = group[0];
            let highestPricePair = group[0];

            group.forEach(pair => {
              const price = parseFloat(pair.priceNative);
              if (price < parseFloat(lowestPricePair.priceNative)) lowestPricePair = pair;
              if (price > parseFloat(highestPricePair.priceNative)) highestPricePair = pair;
            });

            const minPrice = parseFloat(lowestPricePair.priceNative);
            const maxPrice = parseFloat(highestPricePair.priceNative);

            if (minPrice === 0) return null;

            const percentageDiff = ((maxPrice - minPrice) / minPrice) * 100;

            return {
              groupInfo: group[0],
              lowestPricePair,
              highestPricePair,
              percentageDiff,
            };
          })
          .filter(Boolean)
          .sort((a, b) => b.percentageDiff - a.percentageDiff);

        setOpportunities(rankedOpportunities.slice(0, 10));
        if (rankedOpportunities.length === 0) {
          setError('No significant arbitrage opportunities found for this token.');
        }
      }
    } catch (error) {
      console.error('Error fetching and ranking arbitrage opportunities:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if(entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    if(containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
        if(containerRef.current) {
            observer.unobserve(containerRef.current);
        }
    };
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  const isSmallScreen = containerWidth < 480;

  return (
    <Container ref={containerRef} isSmall={isSmallScreen}>
      <Header isSmall={isSmallScreen}>Top 10 Arbitrage Opportunities</Header>
      <SearchContainer>
        <TokenInput
          type="text"
          placeholder="Enter token contract address to find opportunities"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <SearchButton onClick={fetchAndRankOpportunities}>Search</SearchButton>
      </SearchContainer>
      {loading ? (
        <p style={{textAlign: 'center'}}>Finding the best opportunities...</p>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : opportunities.length > 0 ? (
        <Grid>
          {opportunities.map((opp, index) => (
            <Card key={index} isSmall={isSmallScreen}>
              <CardHeader>{opp.groupInfo.baseToken.symbol}/{opp.groupInfo.quoteToken.symbol}</CardHeader>
              <TokenContract>
                <span>{opp.groupInfo.baseToken.address}</span>
                <CopyButton onClick={() => copyToClipboard(opp.groupInfo.baseToken.address)}>Copy</CopyButton>
              </TokenContract>
              <OpportunityDetails>
                <BuyText><strong>Buy on {opp.lowestPricePair.dexId}:</strong> {parseFloat(opp.lowestPricePair.priceNative).toPrecision(5)}</BuyText>
                <SellText><strong>Sell on {opp.highestPricePair.dexId}:</strong> {parseFloat(opp.highestPricePair.priceNative).toPrecision(5)}</SellText>
              </OpportunityDetails>
              <ArbitrageInfo>
                <p><strong>Potential Profit:</strong> {opp.percentageDiff.toFixed(2)}%</p>
              </ArbitrageInfo>
            </Card>
          ))}
        </Grid>
      ) : (
        <p style={{textAlign: 'center'}}>Enter a token address to find opportunities.</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: #f4f6f8;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const Header = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
  font-size: ${props => props.isSmall ? '1.2em' : '1.5em'};
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
`;

const TokenInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
  border: 1px solid #ccc;
`;

const SearchButton = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e1e5eb;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  font-size: ${props => props.isSmall ? '0.85em' : '1em'};
`;

const CardHeader = styled.h4`
  margin-top: 0;
  margin-bottom: 8px;
  color: #34495e;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  font-size: 1.1em;
`;

const TokenContract = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.7em;
  word-break: break-all;
`;

const CopyButton = styled.button`
  margin-left: 8px;
  padding: 3px 7px;
  font-size: 0.8em;
  cursor: pointer;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background-color: #f8f9fa;
`;

const OpportunityDetails = styled.div`
  padding-top: 12px;
  margin-bottom: 12px;
`;

const BuyText = styled.p`
  color: #27ae60;
  margin: 4px 0;
  font-size: 0.95em;
`;

const SellText = styled.p`
  color: #c0392b;
  margin: 4px 0;
  font-size: 0.95em;
`;

const ArbitrageInfo = styled.div`
  background-color: #ecf0f1;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.9em;
  text-align: center;
  margin-top: auto;
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
  padding: 20px;
`;

export default ArbitrageOpportunities;
