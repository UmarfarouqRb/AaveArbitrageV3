
const { Wallet, JsonRpcProvider, Contract, AbiCoder, isAddress, parseUnits, formatUnits } = require('ethers');

// Correct ABI for the ArbitrageBalancer contract, matching the source code
const ARBITRAGE_BALANCER_ABI = [
    "constructor(address _vault, address _multiSig)",
    "event FlashLoanExecuted(address indexed token, uint256 loanAmount, int256 netProfit)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event Paused(address account)",
    "event ProfitWithdrawal(address indexed token, uint256 amount)",
    "event RouterAdded(address indexed router)",
    "event RouterRemoved(address indexed router)",
    "event Unpaused(address account)",
    "function addRouter(address router) external",
    "function multiSig() external view returns (address)",
    "function pause() external",
    "function paused() external view returns (bool)",
    "function receiveFlashLoan(address[] calldata tokens, uint256[] calldata amounts, uint256[] calldata feeAmounts, bytes calldata userData) external",
    "function removeRouter(address router) external",
    "function startFlashloan(address token, uint256 amount, bytes calldata userData) external",
    "function transferOwnership(address newMultiSig) external",
    "function unpause() external",
    "function vault() external view returns (address)",
    "function whitelistedRouters(address) external view returns (bool)",
    "function withdraw(address tokenAddress) external"
];

// ABIs for interacting with DEXs and tokens
const ERC20_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];
const PAIR_ABI = [
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)'
];
const ROUTER_ABI = [
    'function factory() external pure returns (address)',
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'
];
const FACTORY_ABI = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

// Constants
const ORACLE_ADDRESS = "0x2CE95bcEdf92bb5de4bDb5DCCDa0e92e8daD653B";
const GAS_LIMIT = 800000; // Increased gas limit for flash loan + swaps
const SLIPPAGE_BPS = 50; // 0.5% slippage protection
const DYNAMIC_LOAN_PERCENTAGE = 5; // Use 0.5% of the shallowest pool's liquidity

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const {
            privateKey,
            infuraProjectId,
            tokenA,
            tokenB,
            dex1: router1Address,
            dex2: router2Address,
            arbitrageBotAddress,
            profitThreshold,
            gasStrategy
        } = JSON.parse(event.body);

        // --- Input Validation ---
        if (!infuraProjectId) throw new Error('Missing Infura Project ID.');
        if (!privateKey || !(privateKey.startsWith('0x') && privateKey.length === 66)) throw new Error('Missing or invalid private key.');
        for (const addr of [tokenA, tokenB, router1Address, router2Address, arbitrageBotAddress]) {
            if (!addr || !isAddress(addr)) throw new Error(`Invalid or missing address: ${addr}`);
        }

        const provider = new JsonRpcProvider(`https://base-mainnet.infura.io/v3/${infuraProjectId}`);
        const wallet = new Wallet(privateKey, provider);
        const arbitrageBot = new Contract(arbitrageBotAddress, ARBITRAGE_BALANCER_ABI, wallet);
        const tokenAContract = new Contract(tokenA, ERC20_ABI, wallet);
        
        // --- Get DEX Factory Address from Router ---
        const router1 = new Contract(router1Address, ROUTER_ABI, provider);
        const factory1Address = await router1.factory();

        // --- Dynamic Loan Calculation ---
        const tokenADecimals = await tokenAContract.decimals();
        const factory = new Contract(factory1Address, FACTORY_ABI, provider);
        const pairAddress = await factory.getPair(tokenA, tokenB);
        if (pairAddress === '0x0000000000000000000000000000000000000000') throw new Error("No direct pair found for the tokens on the first DEX.");

        const pairContract = new Contract(pairAddress, PAIR_ABI, provider);
        const reserves = await pairContract.getReserves();
        const token0 = await pairContract.token0();
        const reserve = (tokenA.toLowerCase() === token0.toLowerCase()) ? reserves[0] : reserves[1];
        const loanAmount = (reserve * BigInt(DYNAMIC_LOAN_PERCENTAGE)) / 1000n; // 0.5% of reserve

        if (loanAmount <= 0) {
            return { statusCode: 200, body: JSON.stringify({ tradeExecuted: false, message: 'Calculated loan amount is zero.' }) };
        }

        console.log(`Calculated loan amount: ${formatUnits(loanAmount, tokenADecimals)} ${tokenA}`);

        // --- Pre-computation for Slippage and Profit Check ---
        const amountsOut1 = await router1.getAmountsOut(loanAmount, [tokenA, tokenB]);
        const amountOutFromFirstSwap = amountsOut1[1];
        const minAmountOutFromFirstSwap = (amountOutFromFirstSwap * (10000n - BigInt(SLIPPAGE_BPS))) / 10000n;

        const router2 = new Contract(router2Address, ROUTER_ABI, provider);
        const finalAmountsOut = await router2.getAmountsOut(amountOutFromFirstSwap, [tokenB, tokenA]);
        const simulatedFinalAmount = finalAmountsOut[1];

        // --- Profitability Check (Simulation) ---
        const simulatedProfit = simulatedFinalAmount - loanAmount;
        const profitThresholdAmount = parseUnits(profitThreshold || '0', tokenADecimals);

        console.log(`Simulated gross profit: ${formatUnits(simulatedProfit, tokenADecimals)} ${tokenA}`);

        if (simulatedProfit <= profitThresholdAmount) {
            return { statusCode: 200, body: JSON.stringify({ tradeExecuted: false, message: `Simulated profit of ${formatUnits(simulatedProfit, tokenADecimals)} does not meet threshold of ${formatUnits(profitThresholdAmount, tokenADecimals)}.` }) };
        }
        
        console.log("Profitable trade simulated. Proceeding with flash loan.");

        // --- Construct FlashLoanData ---
        const flashLoanData = {
            inputToken: tokenA,
            middleToken: tokenB,
            routers: [router1Address, router2Address],
            paths: [[tokenA, tokenB], [tokenB, tokenA]],
            minProfit: profitThresholdAmount, // Use the user's threshold as minProfit
            minAmountOutFromFirstSwap: minAmountOutFromFirstSwap,
            twapMaxDeviationBps: 0, // TWAP check disabled for simplicity
            oracleAddress: ORACLE_ADDRESS,
            factory: factory1Address
        };

        const userData = AbiCoder.default.encode(
            ['(address,address,address[],address[][],uint256,uint256,uint256,address,address)'],
            [flashLoanData]
        );

        // --- Set Gas Price ---
        const feeData = await provider.getFeeData();
        let gasPrice;
        switch(gasStrategy) {
            case 'fast': gasPrice = feeData.maxFeePerGas * 12n / 10n; break; // 1.2x
            case 'urgent': gasPrice = feeData.maxFeePerGas * 15n / 10n; break; // 1.5x
            default: gasPrice = feeData.maxFeePerGas;
        }
        
        // --- Execute Flash Loan ---
        const tx = await arbitrageBot.startFlashloan(tokenA, loanAmount, userData, {
            gasLimit: GAS_LIMIT,
            gasPrice: gasPrice
        });
        
        console.log("Flash loan transaction sent. Waiting for confirmation...");
        // Do not wait for the transaction to be mined here to provide a faster response to the user.
        // The frontend can track the transaction hash.

        return {
            statusCode: 200,
            body: JSON.stringify({
                tradeExecuted: true,
                txHash: tx.hash,
                message: "Flash loan initiated successfully.",
                simulatedGrossProfit: formatUnits(simulatedProfit, tokenADecimals)
            })
        };

    } catch (err) {
        console.error('Bot execution error:', err);
        const errorMessage = err.reason || err.message || "An internal error occurred.";
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: errorMessage, error: err.toString() }) 
        };
    }
};
