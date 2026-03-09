export interface Portfolio { avaxBalance: number; usdcBalance: number; avaxValueUSD: number; usdcValueUSD: number; totalValueUSD: number; avaxPct: number; usdcPct: number; pnl24h: number; pnl24hPct: number; peakValue: number; }
export interface AgentDecision { id: string; timestamp: number; type: 'HOLD' | 'REBALANCE' | 'ORACLE' | 'ERROR' | 'PAUSE' | 'RESUME'; message: string; price: number; txHash?: string; }
export interface OraclePayment { id: string; timestamp: number; txHash: string; amountAVAX: number; amountUSD: number; endpoint: string; status: 'SUCCESS' | 'FAILED' | 'PENDING'; }
export interface TradeRecord { id: string; timestamp: number; pair: string; side: 'BUY' | 'SELL'; amountIn: number; amountOut: number; tokenIn: string; tokenOut: string; priceUSD: number; status: 'CONFIRMED' | 'FAILED' | 'PENDING'; txHash: string; pnlBps: number; }
export interface AgentStatus { isActive: boolean; isPaused: boolean; lastCheck: number; nextCheck: number; agentId: number; agentAddress: string; uptime: number; consecutiveFailures: number; }
export interface Constraints { maxTradeSizePct: number; maxDailyTrades: number; currentDailyTrades: number; stopLossThreshold: number; currentDrawdown: number; driftThreshold: number; currentDrift: number; whitelistedProtocols: string[]; }
export interface ReputationData { score: number; maxScore: number; totalTrades: number; successRate: number; history: { timestamp: number; score: number }[]; }
export interface TickerItem { label: string; value: string; color?: string; }

// ── Marketplace types ──────────────────────────────────────────────────────
export type AgentTier = 'APEX' | 'ELITE' | 'TRUSTED' | 'RISING' | 'UNVERIFIED';
export type StrategyType = '50/50 BALANCED' | 'AVAX-HEAVY' | 'STABLECOIN-HEAVY' | 'MULTI-ASSET';
export type SortKey = 'score' | 'ret30' | 'subs' | 'winrate' | 'drawdown' | 'volume';

export interface MarketplaceAgent {
  id: number;
  rank: number;
  delta: 'up' | 'dn' | 'eq';
  emoji: string;
  name: string;
  handle: string;                // 0x... truncated
  tier: AgentTier;
  score: number;                 // ERC-8004 score 0-1000
  ret30: number;                 // 30-day return %
  winRate: number;               // win rate %
  trades: number;                // total trades
  subs: number;                  // active subscribers
  maxDD: number;                 // max drawdown % (negative)
  subFee: number;                // monthly USDC fee (0 = free)
  perfFee: number;               // performance fee %
  strategy: StrategyType;
  desc: string;
  sparkline: number[];           // 12 data points
  aum: string;                   // display string e.g. "$184k"
  vol: string;                   // total volume display
  radar: [number, number, number, number, number, number]; // 6-axis 0-100
  stakeAvax: number;             // AVAX staked
  listedAt: number;              // timestamp
}

export interface TierConfig {
  color: string;
  bg: string;
  label: string;
}

export interface MySubscription {
  agentId: number;
  agentName: string;
  agentEmoji: string;
  tier: AgentTier;
  score: number;
  subscribedAt: number;
  vaultAddress: string;
  feePaidThisMonth: number;
  perfFee: number;
  subFee: number;
}
