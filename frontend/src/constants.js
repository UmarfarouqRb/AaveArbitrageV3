
import ArbitrageBalancer from './ArbitrageBalancer.json';
import MockERC20 from './MockERC20.json';

export const ArbitrageBalancerAddress = import.meta.env.VITE_ARBITRAGE_BALANCER_ADDRESS;
export const ArbitrageBalancerABI = ArbitrageBalancer.abi;

export const TokenAAddress = import.meta.env.VITE_TOKEN_A_ADDRESS;
export const TokenAABI = MockERC20.abi;

export const TokenBAddress = import.meta.env.VITE_TOKEN_B_ADDRESS;
export const TokenBABI = MockERC20.abi;
