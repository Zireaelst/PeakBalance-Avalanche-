// ═══ PeakBalance Shared Types ═══

export interface Portfolio {
    avaxBalance: number;
    usdcBalance: number;
    avaxValueUSD: number;
    usdcValueUSD: number;
    totalValueUSD: number;
    avaxPct: number;
    usdcPct: number;
    pnl24h: number;
    pnl24hPct: number;
    peakValue: number;
}

export interface AgentDecision {
    id: string;
    timestamp: number;
    type: 'HOLD' | 'REBALANCE' | 'ORACLE' | 'ERROR' | 'PAUSE' | 'RESUME';
    message: string;
    price: number;
    txHash?: string;
}

export interface OraclePayment {
    id: string;
    timestamp: number;
    txHash: string;
    amountAVAX: number;
    amountUSD: number;
    endpoint: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface TradeRecord {
    id: string;
    timestamp: number;
    pair: string;
    side: 'BUY' | 'SELL';
    amountIn: number;
    amountOut: number;
    tokenIn: string;
    tokenOut: string;
    priceUSD: number;
    status: 'CONFIRMED' | 'FAILED' | 'PENDING';
    txHash: string;
    pnlBps: number;
}

export interface AgentStatus {
    isActive: boolean;
    isPaused: boolean;
    lastCheck: number;
    nextCheck: number;
    agentId: number;
    agentAddress: string;
    uptime: number;
    consecutiveFailures: number;
}

export interface Constraints {
    maxTradeSizePct: number;
    maxDailyTrades: number;
    currentDailyTrades: number;
    stopLossThreshold: number;
    currentDrawdown: number;
    driftThreshold: number;
    currentDrift: number;
    whitelistedProtocols: string[];
}

export interface ReputationData {
    score: number;
    maxScore: number;
    totalTrades: number;
    successRate: number;
    history: { timestamp: number; score: number }[];
}

export type TagColor = 'green' | 'red' | 'gold' | 'teal' | 'dim';

export interface TickerItem {
    label: string;
    value: string;
    color?: string;
}
