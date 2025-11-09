import { useContext, useState, useCallback } from 'react';
import { Contract, formatEther, parseUnits } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkContext } from '../contexts/NetworkContext';
import { arbitrageBalancerABI } from '../utils/abi';

export const useArbitrageExecutor = () => {
  const { user } = usePrivy();
  const { networkConfig } = useContext(NetworkContext);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  const estimateGas = useCallback(async (opportunity, amount) => {
    if (!user || !networkConfig) {
      return null;
    }

    try {
      const provider = await user.wallet.getEthersProvider();
      const arbitrageBalancer = new Contract(networkConfig.arbitrageBalancerAddress, arbitrageBalancerABI, provider);
      const amountInWei = parseUnits(amount, 18);

      // Correct ethers.js v6 syntax for gas estimation
      const gasEstimate = await arbitrageBalancer.arbitrage.estimateGas(
        opportunity.tokenA,
        opportunity.tokenB,
        amountInWei,
        opportunity.routerA,
        opportunity.routerB
      );

      // Correct ethers.js v6 syntax for getting fee data
      const feeData = await provider.getFeeData();
      const gasCost = gasEstimate * feeData.gasPrice;
      
      return formatEther(gasCost);
    } catch (err) {
      console.error("Error estimating gas:", err);
      // It's better to propagate the error to the UI
      setError(err.message || "Error estimating gas.");
      return null;
    }
  }, [user, networkConfig]);

  const executeTrade = useCallback(async (opportunity, amount) => {
    if (!user || !networkConfig) {
      setError("User not authenticated or network not configured.");
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      const provider = await user.wallet.getEthersProvider();
      // Correct ethers.js v6 syntax for getting the signer
      const signer = await provider.getSigner();
      const arbitrageBalancer = new Contract(networkConfig.arbitrageBalancerAddress, arbitrageBalancerABI, signer);

      const amountInWei = parseUnits(amount, 18);

      const tx = await arbitrageBalancer.arbitrage(
        opportunity.tokenA,
        opportunity.tokenB,
        amountInWei,
        opportunity.routerA,
        opportunity.routerB
      );

      await tx.wait();
      console.log("Arbitrage executed successfully!");
    } catch (err) {
      console.error("Error executing arbitrage:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsExecuting(false);
    }
  }, [user, networkConfig]);

  return { executeTrade, isExecuting, error, estimateGas };
};
