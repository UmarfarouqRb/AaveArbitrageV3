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

const PlaceholderText = styled.p`
  text-align: center;
  color: #666;
`;

const TradeHistory = () => {
  return (
    <Container>
      <Header>Trade History</Header>
      <PlaceholderText>Trade history will be displayed here.</PlaceholderText>
    </Container>
  );
};

export default TradeHistory;
