// ═══ Contract Addresses & ABI Stubs ═══
// Replace with deployed addresses after Fuji deployment

export const CONTRACTS = {
    43113: {
        peakController: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        peakVault: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        constraintEngine: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        agentRegistry: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        oracleConsumer: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    },
    43114: {
        peakController: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        peakVault: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        constraintEngine: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        agentRegistry: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        oracleConsumer: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    },
} as const;

// ═══ ABI Stubs (minimal read functions for dashboard) ═══

export const PEAK_VAULT_ABI = [
    {
        name: 'getPortfolioValue',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [
            { name: 'avaxValue', type: 'uint256' },
            { name: 'usdcValue', type: 'uint256' },
            { name: 'totalUSD', type: 'uint256' },
        ],
    },
] as const;

export const CONSTRAINT_ENGINE_ABI = [
    {
        name: 'checkDailyLimit',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: 'withinLimit', type: 'bool' }],
    },
    {
        name: 'checkStopLoss',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'user', type: 'address' },
            { name: 'currentValue', type: 'uint256' },
            { name: 'peakValue', type: 'uint256' },
        ],
        outputs: [{ name: 'triggered', type: 'bool' }],
    },
] as const;

export const AGENT_REGISTRY_ABI = [
    {
        name: 'getReputation',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [
            { name: 'score', type: 'uint256' },
            { name: 'totalTrades', type: 'uint256' },
            { name: 'successRate', type: 'uint256' },
        ],
    },
] as const;

export function getContracts(chainId: number) {
    if (chainId in CONTRACTS) {
        return CONTRACTS[chainId as keyof typeof CONTRACTS];
    }
    return CONTRACTS[43113];
}
