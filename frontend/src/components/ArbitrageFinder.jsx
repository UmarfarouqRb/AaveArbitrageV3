import { useState, useContext } from 'react';
import { Contract, parseUnits, AbiCoder } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkContext } from '../contexts/NetworkContext';
import { arbitrageBalancerABI } from '../utils/abi';
import styled, { css } from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 40px;
  max-width: 600px;
  margin: auto;
`;

const Header = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 25px;
  font-size: 0.9em;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  ${props => props.fullWidth && css`
    margin-bottom: 20px;
  `}
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
  }
`;

const MessageBox = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin: 20px 0;
  p {
    margin: 5px 0 0;
    word-break: break-all;
  }
`;

const MessageBoxError = styled(MessageBox)`
  color: red;
  background-color: #ffeded;
`;

const MessageBoxSuccess = styled(MessageBox)`
  color: green;
  background-color: #e6ffed;
`;

const ArbitrageFinder = () => {
  const { ready, authenticated, user, login } = usePrivy();
  const { networkConfig } = useContext(NetworkContext);
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [amount, setAmount] = useState('');
  const [router1, setRouter1] = useState('');
  const [router2, setRouter2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tradeStatus, setTradeStatus] = useState(null);
  const [txHash, setTxHash] = useState('');

  const handleExecuteTrade = async () => {
    if (!ready || !authenticated) {
      login();
      return;
    }
    
    if (!tokenA || !tokenB || !amount || !router1 || !router2) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setTradeStatus(null);
    setTxHash('');

    try {
      const provider = await user.wallet.getEthersProvider();
      const signer = provider.getSigner();

      const contract = new Contract(networkConfig.arbitrageBalancerAddress, arbitrageBalancerABI, signer);
      
      const parsedAmount = parseUnits(amount, 18);

      const path = [tokenA, tokenB];
      const routers = [router1, router2];
      const userData = AbiCoder.default.encode(
        ['address[]', 'address[]'],
        [path, routers]
      );

      setTradeStatus('Sending transaction...');
      
      const tx = await contract.arbitrage(tokenA, parsedAmount, userData);
      
      setTradeStatus('Transaction sent. Waiting for confirmation...');
      setTxHash(tx.hash);

      await tx.wait();

      setTradeStatus('Trade executed successfully!');

    } catch (err) {
      console.error('Error executing trade:', err);
      setError(err.reason || err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>Execute Arbitrage Trade</Header>
      <Description>
        This interface allows you to execute a flash loan arbitrage trade. You specify the token pair, the two DEX routers to trade on, and the amount to borrow.
      </Description>

      {error && (
        <MessageBoxError>
          <strong>Error:</strong> {error}
        </MessageBoxError>
      )}
      {tradeStatus && (
        <MessageBoxSuccess>
          <strong>Status:</strong> {tradeStatus}
          {txHash && (
            <p>Tx Hash: {txHash}</p>
          )}
        </MessageBoxSuccess>
      )}

      <InputGroup>
        <Input
          type="text"
          placeholder="Token A Address (to borrow)"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
          disabled={loading}
        />
        <Input
          type="text"
          placeholder="Token B Address"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
          disabled={loading}
        />
      </InputGroup>
      <InputGroup>
        <Input
          type="text"
          placeholder="Router 1 Address (for Token A -> Token B)"
          value={router1}
          onChange={(e) => setRouter1(e.target.value)}
          disabled={loading}
        />
        <Input
          type="text"
          placeholder="Router 2 Address (for Token B -> Token A)"
          value={router2}
          onChange={(e) => setRouter2(e.target.value)}
          disabled={loading}
        />
      </InputGroup>
      <Input
        type="text"
        placeholder="Amount of Token A to borrow"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        disabled={loading}
      />
      
      <Button onClick={handleExecuteTrade} disabled={loading}>
        {loading ? 'Executing...' : 'Execute Flash Loan Trade'}
      </Button>
    </Container>
  );
};

export default ArbitrageFinder;