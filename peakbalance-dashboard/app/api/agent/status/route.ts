import { NextResponse } from 'next/server';
import { MOCK_AGENT_STATUS, MOCK_CONSTRAINTS, MOCK_PORTFOLIO, MOCK_REPUTATION } from '@/lib/mock-data';

export async function GET() {
    const status = MOCK_AGENT_STATUS;
    const constraints = MOCK_CONSTRAINTS;
    const portfolio = MOCK_PORTFOLIO;
    const reputation = MOCK_REPUTATION;

    return NextResponse.json({
        agent: {
            id: status.agentId,
            address: status.agentAddress,
            isActive: status.isActive,
            isPaused: status.isPaused,
            uptime: status.uptime,
            consecutiveFailures: status.consecutiveFailures,
            lastCheck: new Date(status.lastCheck).toISOString(),
            nextCheck: new Date(status.nextCheck).toISOString(),
        },
        portfolio: {
            totalValueUSD: portfolio.totalValueUSD,
            avaxBalance: portfolio.avaxBalance,
            usdcBalance: portfolio.usdcBalance,
            allocationPct: { avax: portfolio.avaxPct, usdc: portfolio.usdcPct },
            pnl24h: portfolio.pnl24h,
            pnl24hPct: portfolio.pnl24hPct,
        },
        constraints: {
            drift: { current: constraints.currentDrift, threshold: constraints.driftThreshold },
            dailyTrades: { used: constraints.currentDailyTrades, max: constraints.maxDailyTrades },
            drawdown: { current: constraints.currentDrawdown, stopLoss: constraints.stopLossThreshold },
        },
        reputation: {
            score: reputation.score,
            maxScore: reputation.maxScore,
            totalTrades: reputation.totalTrades,
            successRate: reputation.successRate,
        },
        timestamp: new Date().toISOString(),
    });
}
