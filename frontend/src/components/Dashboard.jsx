import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  color: #333;
  text-align: center;
`;

const Header = styled.h1`
  font-size: 2em;
  color: #007bff;
  margin-bottom: 15px;
`;

const Paragraph = styled.p`
  font-size: 1.1em;
  line-height: 1.6;
  color: #555;
  max-width: 600px;
  margin: 0 auto 1em;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Header>Welcome to the Arbitrage Trading Platform</Header>
      <Paragraph>
        This application is designed to help you identify and analyze cryptocurrency arbitrage opportunities across various decentralized exchanges (DEXs).
      </Paragraph>
      <Paragraph>
        Use the navigation on the left to get started. The <strong>Arbitrage Finder</strong> lets you check for price differences on a specific token, while the <strong>Opportunities</strong> page shows a list of the top potential trades.
      </Paragraph>
    </DashboardContainer>
  );
};

export default Dashboard;
