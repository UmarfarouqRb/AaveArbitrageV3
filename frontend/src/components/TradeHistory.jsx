
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const Header = styled.h2`
  color: #333;
  text-align: center;
`;

const TradeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TradeItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const InputData = styled.pre`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85em;
  margin-top: 10px;
`;

const TradeHistory = ({ trades }) => {
  return (
    <Container>
      <Header>Trade History</Header>
      {trades.length > 0 ? (
        <TradeList>
          {trades.map((trade, index) => (
            <TradeItem key={index}>
              <p><strong>Profit:</strong> {trade.profit}</p>
              <p><strong>Route:</strong> {trade.route}</p>
              <p><strong>Transaction:</strong> <a href={trade.transactionUrl} target="_blank" rel="noopener noreferrer">View on Basescan</a></p>
              {trade.input && (
                <>
                  <strong>Input Data:</strong>
                  <InputData>{trade.input}</InputData>
                </>
              )}
            </TradeItem>
          ))}
        </TradeList>
      ) : (
        <p>No trades recorded yet.</p>
      )}
    </Container>
  );
};

export default TradeHistory;
