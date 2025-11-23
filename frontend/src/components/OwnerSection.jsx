import { useState, useContext, useCallback } from 'react';
import { Contract, isAddress } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkContext } from '../contexts/NetworkContext';
import { arbitrageBalancerABI } from '../utils/abi';
import { OWNER_ADDRESS } from '../constants';
import { API_URL } from '../config';

const OwnerSection = () => {
  const { user } = usePrivy();
  const { network, networkConfig } = useContext(NetworkContext);

  const [newOwner, setNewOwner] = useState('');
  const [withdrawToken, setWithdrawToken] = useState('');
  const [status, setStatus] = useState('');

  if (!user || !user.wallet || user.wallet.address.toLowerCase() !== OWNER_ADDRESS.toLowerCase()) {
    return null;
  }

  const getGasPrice = async (strategy) => {
    const response = await fetch(`${API_URL}/gas-price?network=${network}&strategy=${strategy}`);
    const data = await response.json();
    return data.gasPrice;
  };

  const getSignerAndContract = useCallback(async () => {
    const provider = await user.wallet.getEthersProvider();
    const signer = await provider.getSigner();
    return new Contract(networkConfig.arbitrageBalancerAddress, arbitrageBalancerABI, signer);
  }, [user, networkConfig]);

  const handlePause = useCallback(async () => {
    setStatus('Pausing contract...');
    try {
      const contract = await getSignerAndContract();
      const gasPrice = await getGasPrice('fast');
      const tx = await contract.pause({ gasPrice });
      await tx.wait();
      setStatus('Contract paused successfully.');
    } catch (error) {
      console.error("Error pausing contract:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [getSignerAndContract, network]);

  const handleUnpause = useCallback(async () => {
    setStatus('Unpausing contract...');
    try {
      const contract = await getSignerAndContract();
      const gasPrice = await getGasPrice('fast');
      const tx = await contract.unpause({ gasPrice });
      await tx.wait();
      setStatus('Contract unpaused successfully.');
    } catch (error) {
      console.error("Error unpausing contract:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [getSignerAndContract, network]);

  const handleChangeOwner = useCallback(async () => {
    if (!isAddress(newOwner)) {
      setStatus('Please enter a valid Ethereum address for the new owner.');
      return;
    }
    setStatus('Transferring ownership...');
    try {
      const contract = await getSignerAndContract();
      const gasPrice = await getGasPrice('fast');
      const tx = await contract.transferOwnership(newOwner, { gasPrice });
      await tx.wait();
      setStatus('Ownership transferred successfully.');
      setNewOwner('');
    } catch (error) {
      console.error("Error transferring ownership:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [newOwner, getSignerAndContract, network]);

  const handleWithdraw = useCallback(async () => {
    if (!isAddress(withdrawToken)) {
      setStatus('Please enter a valid token address to withdraw.');
      return;
    }
    setStatus('Withdrawing profits...');
    try {
      const contract = await getSignerAndContract();
      const gasPrice = await getGasPrice('aggressive');
      const tx = await contract.withdraw(withdrawToken, { gasPrice });
      await tx.wait();
      setStatus('Profits withdrawn successfully.');
      setWithdrawToken('');
    } catch (error) {
      console.error("Error withdrawing profits:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  }, [withdrawToken, getSignerAndContract, network]);

  return (
    <div>
      <h2>Owner Section</h2>
      <div>
        <div>
          <button onClick={handlePause}>Pause Contract</button>
          <button onClick={handleUnpause}>Unpause Contract</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="New Owner Address"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <button onClick={handleChangeOwner}>Change Owner</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Token Address to Withdraw"
            value={withdrawToken}
            onChange={(e) => setWithdrawToken(e.target.value)}
          />
          <button onClick={handleWithdraw}>Withdraw Profits</button>
        </div>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
};

export default OwnerSection;
