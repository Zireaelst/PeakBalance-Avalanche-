// ═══ Contract Addresses & ABI Stubs ═══
// Fuji testnet addresses — replace after deployment
export const CONTRACTS = {
    43113: {
        peakController: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        peakVault: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        constraintEngine: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        agentRegistry: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        oracleConsumer: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        usdc: '0x5425890298aed601595a70AB815c96711a31Bc65' as `0x${string}`, // Fuji USDC
        wavax: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c' as `0x${string}`, // Fuji WAVAX
    },
    43114: {
        peakController: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        peakVault: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        constraintEngine: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        agentRegistry: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        oracleConsumer: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' as `0x${string}`,
        wavax: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' as `0x${string}`,
    },
} as const;

export const PEAK_VAULT_ABI = [
    { name: 'deposit', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [] },
    { name: 'withdraw', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [] },
    { name: 'emergencyExit', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
    { name: 'getPortfolioValue', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: 'avaxValue', type: 'uint256' }, { name: 'usdcValue', type: 'uint256' }, { name: 'totalUSD', type: 'uint256' }] },
] as const;

export const CONSTRAINT_ENGINE_ABI = [
    { name: 'MAX_TRADE_SIZE_BPS', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'MAX_DAILY_TRADES', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'STOP_LOSS_BPS', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'validateTrade', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }, { name: 'tokenIn', type: 'address' }, { name: 'tokenOut', type: 'address' }, { name: 'amountIn', type: 'uint256' }, { name: 'portfolioValue', type: 'uint256' }], outputs: [{ name: 'valid', type: 'bool' }, { name: 'reason', type: 'string' }] },
    { name: 'checkDailyLimit', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
    { name: 'getDailyTradeCount', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
    { name: 'checkStopLoss', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }, { name: 'currentValue', type: 'uint256' }, { name: 'peakValue', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
] as const;

export const AGENT_REGISTRY_ABI = [
    { name: 'getReputation', type: 'function', stateMutability: 'view', inputs: [{ name: 'agentId', type: 'uint256' }], outputs: [{ name: 'score', type: 'uint256' }, { name: 'totalTrades', type: 'uint256' }, { name: 'successRate', type: 'uint256' }] },
    { name: 'registerAgent', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'agentWallet', type: 'address' }, { name: 'metadata', type: 'bytes' }], outputs: [{ name: 'tokenId', type: 'uint256' }] },
    { name: 'ownerOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ name: '', type: 'address' }] },
] as const;

export const PEAK_CONTROLLER_ABI = [
    { name: 'pauseAgent', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
    { name: 'resumeAgent', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
    { name: 'isPaused', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'bool' }] },
    { name: 'agentNFTId', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
] as const;

export function getContracts(chainId: number) {
    if (chainId in CONTRACTS) return CONTRACTS[chainId as keyof typeof CONTRACTS];
    return CONTRACTS[43113];
}
