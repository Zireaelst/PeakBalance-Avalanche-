'use client';

import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACTS, CONSTRAINT_ENGINE_ABI, PEAK_VAULT_ABI, PEAK_CONTROLLER_ABI, AGENT_REGISTRY_ABI } from '@/lib/contracts';
import { MOCK_PORTFOLIO, MOCK_AGENT_STATUS, MOCK_CONSTRAINTS, MOCK_REPUTATION } from '@/lib/mock-data';
import type { Portfolio, AgentStatus, Constraints, ReputationData } from '@/types';

const USE_MOCK = true; // Toggle to false when contracts are deployed

// ═══ Read Hooks ═══

export function usePortfolioOnChain(): { data: Portfolio; isLoading: boolean } {
    const { address, chainId } = useAccount();
    const contracts = CONTRACTS[chainId as keyof typeof CONTRACTS] ?? CONTRACTS[43113];

    const { data: vaultData, isLoading } = useReadContract({
        address: contracts.peakVault,
        abi: PEAK_VAULT_ABI,
        functionName: 'getPortfolioValue',
        args: address ? [address] : undefined,
        query: { enabled: !USE_MOCK && !!address },
    });

    if (USE_MOCK || !vaultData) return { data: MOCK_PORTFOLIO, isLoading: false };

    const [avaxValue, usdcValue, totalUSD] = vaultData as [bigint, bigint, bigint];
    return {
        data: {
            avaxBalance: Number(avaxValue) / 1e18,
            usdcBalance: Number(usdcValue) / 1e6,
            avaxValueUSD: Number(avaxValue) / 1e18 * 37, // TODO: use oracle price
            usdcValueUSD: Number(usdcValue) / 1e6,
            totalValueUSD: Number(totalUSD) / 1e8,
            avaxPct: Number(avaxValue) / (Number(avaxValue) + Number(usdcValue)) * 100,
            usdcPct: Number(usdcValue) / (Number(avaxValue) + Number(usdcValue)) * 100,
            pnl24h: 0,
            pnl24hPct: 0,
            peakValue: Number(totalUSD) / 1e8,
        },
        isLoading,
    };
}

export function useConstraintsOnChain(): { data: Constraints; isLoading: boolean } {
    const { address, chainId } = useAccount();
    const contracts = CONTRACTS[chainId as keyof typeof CONTRACTS] ?? CONTRACTS[43113];

    const { data: maxSize } = useReadContract({
        address: contracts.constraintEngine,
        abi: CONSTRAINT_ENGINE_ABI,
        functionName: 'MAX_TRADE_SIZE_BPS',
        query: { enabled: !USE_MOCK },
    });

    const { data: maxDaily } = useReadContract({
        address: contracts.constraintEngine,
        abi: CONSTRAINT_ENGINE_ABI,
        functionName: 'MAX_DAILY_TRADES',
        query: { enabled: !USE_MOCK },
    });

    const { data: stopLoss } = useReadContract({
        address: contracts.constraintEngine,
        abi: CONSTRAINT_ENGINE_ABI,
        functionName: 'STOP_LOSS_BPS',
        query: { enabled: !USE_MOCK },
    });

    const { data: dailyCount } = useReadContract({
        address: contracts.constraintEngine,
        abi: CONSTRAINT_ENGINE_ABI,
        functionName: 'getDailyTradeCount',
        args: address ? [address] : undefined,
        query: { enabled: !USE_MOCK && !!address },
    });

    if (USE_MOCK) return { data: MOCK_CONSTRAINTS, isLoading: false };

    return {
        data: {
            maxTradeSizePct: maxSize ? Number(maxSize) / 100 : 5,
            maxDailyTrades: maxDaily ? Number(maxDaily) : 10,
            currentDailyTrades: dailyCount ? Number(dailyCount) : 0,
            stopLossThreshold: stopLoss ? Number(stopLoss) / 100 : 10,
            currentDrawdown: 0,
            driftThreshold: 5,
            currentDrift: 0,
            whitelistedProtocols: ['Trader Joe v2.1', 'Aave V3', 'Benqi'],
        },
        isLoading: false,
    };
}

export function useReputationOnChain(agentId: number): { data: ReputationData; isLoading: boolean } {
    const { chainId } = useAccount();
    const contracts = CONTRACTS[chainId as keyof typeof CONTRACTS] ?? CONTRACTS[43113];

    const { data, isLoading } = useReadContract({
        address: contracts.agentRegistry,
        abi: AGENT_REGISTRY_ABI,
        functionName: 'getReputation',
        args: [BigInt(agentId)],
        query: { enabled: !USE_MOCK && agentId > 0 },
    });

    if (USE_MOCK || !data) return { data: MOCK_REPUTATION, isLoading: false };

    const [score, totalTrades, successRate] = data as [bigint, bigint, bigint];
    return {
        data: {
            score: Number(score),
            maxScore: 1000,
            totalTrades: Number(totalTrades),
            successRate: Number(successRate) / 100,
            history: MOCK_REPUTATION.history, // Need event indexer for real history
        },
        isLoading,
    };
}

// ═══ Write Hooks ═══

export function useAgentControls() {
    const { chainId } = useAccount();
    const contracts = CONTRACTS[chainId as keyof typeof CONTRACTS] ?? CONTRACTS[43113];
    const { writeContract } = useWriteContract();

    return {
        pauseAgent: () => writeContract({
            address: contracts.peakController,
            abi: PEAK_CONTROLLER_ABI,
            functionName: 'pauseAgent',
        }),
        resumeAgent: () => writeContract({
            address: contracts.peakController,
            abi: PEAK_CONTROLLER_ABI,
            functionName: 'resumeAgent',
        }),
        emergencyExit: () => writeContract({
            address: contracts.peakVault,
            abi: PEAK_VAULT_ABI,
            functionName: 'emergencyExit',
        }),
    };
}
