
const { ethers } = require('ethers');

const MULTICALL_ABI = [
    'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)'
];

const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'; // Standard multicall3 address on most chains

async function multicall(provider, calls) {
    const multicall = new ethers.Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
    const [blockNumber, returnData] = await multicall.aggregate(calls);
    return returnData;
}

module.exports = { multicall };
