import { useState, useContext, useCallback } from 'react';
import { Contract, isAddress } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkContext } from '../contexts/NetworkContext';
import { arbitrageBalancerABI } from '../utils/abi';
import './OwnerSection.css';

const OwnerSection = () => {
  const { user } = usePrivy();
  const { networkConfig } = useContext(NetworkContext);

  const [newOwner, setNewOwner] = useState('');
  const [withdrawToken, setWithdrawToken] = useState('');
  const [status, setStatus] = useState('');

  const getSignerAndContract = useCallback(async () => {
    const provider = await user.wallet.getEthersProvider();
    const signer = await provider.getSigner();
    return new Contract(networkConfig.arbitrageBalancerAddress, arbitrageBalancerABI, signer);
  }, [user, networkConfig]);

  const handlePause = useCallback(async () => {
    setStatus('Pausing contract...');
    try {
      const contract = await getSignerAndContract();
      const tx = await contract.pause();
      await tx.wait();
      setStatus('Contract paused successfully.');
    } catch (error) {
      console.error("Error pausing contract:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [getSignerAndContract]);

  const handleUnpause = useCallback(async () => {
    setStatus('Unpausing contract...');
    try {
      const contract = await getSignerAndContract();
      const tx = await contract.unpause();
      await tx.wait();
      setStatus('Contract unpaused successfully.');
    } catch (error) {
      console.error("Error unpausing contract:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [getSignerAndContract]);

  const handleChangeOwner = useCallback(async () => {
    if (!isAddress(newOwner)) {
      setStatus('Please enter a valid Ethereum address for the new owner.');
      return;
    }
    setStatus('Transferring ownership...');
    try {
      const contract = await getSignerAndContract();
      const tx = await contract.transferOwnership(newOwner);
      await tx.wait();
      setStatus('Ownership transferred successfully.');
      setNewOwner('');
    } catch (error) {
      console.error("Error transferring ownership:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [newOwner, getSignerAndContract]);

  const handleWithdraw = useCallback(async () => {
    if (!isAddress(withdrawToken)) {
      setStatus('Please enter a valid token address to withdraw.');
      return;
    }
    setStatus('Withdrawing profits...');
    try {
      const contract = await getSignerAndContract();
      const tx = await contract.withdraw(withdrawToken);
      await tx.wait();
      setStatus('Profits withdrawn successfully.');
      setWithdrawToken('');
    } catch (error) {
      console.error("Error withdrawing profits:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [withdrawToken, getSignerAndContract]);

  return (
    <div className="owner-section">
      <h2>Owner Section</h2>
      <div className="owner-actions">
        <div className="action-group">
          <button onClick={handlePause} className="button-danger">Pause Contract</button>
          <button onClick={handleUnpause} className="button-success">Unpause Contract</button>
        </div>
        <div className="action-group">
          <input
            type="text"
            placeholder="New Owner Address"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="input"
          />
          <button onClick={handleChangeOwner}>Change Owner</button>
        </div>
        <div className="action-group">
          <input
            type="text"
            placeholder="Token Address to Withdraw"
            value={withdrawToken}
            onChange={(e) => setWithdrawToken(e.target.value)}
            className="input"
          />
          <button onClick={handleWithdraw}>Withdraw Profits</button>
        </div>
      </div>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default OwnerSection;
