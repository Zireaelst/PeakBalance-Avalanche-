import type { Portfolio, AgentDecision, OraclePayment, TradeRecord, AgentStatus, Constraints, ReputationData, TickerItem, MarketplaceAgent, TierConfig, MySubscription } from '@/types';
const NOW = Date.now(); const H = 3600_000; const M = 60_000;
export const MOCK_PORTFOLIO: Portfolio = { avaxBalance: 68.42, usdcBalance: 2475.30, avaxValueUSD: 2531.54, usdcValueUSD: 2475.30, totalValueUSD: 5006.84, avaxPct: 50.56, usdcPct: 49.44, pnl24h: 127.43, pnl24hPct: 2.61, peakValue: 5150.00 };
export const MOCK_AGENT_STATUS: AgentStatus = { isActive: true, isPaused: false, lastCheck: NOW - 42000, nextCheck: NOW + 18000, agentId: 1, agentAddress: '0x7f3a9bC4E21d8A5c6B0F2e7D9f4a1b3E8c6D5a2F', uptime: 172800, consecutiveFailures: 0 };
export const MOCK_CONSTRAINTS: Constraints = { maxTradeSizePct: 5, maxDailyTrades: 10, currentDailyTrades: 3, stopLossThreshold: 10, currentDrawdown: 2.78, driftThreshold: 5, currentDrift: 0.56, whitelistedProtocols: ['Trader Joe v2.1', 'Aave V3', 'Benqi'] };
export const MOCK_DECISIONS: AgentDecision[] = [
    { id: 'd1', timestamp: NOW - 42000, type: 'HOLD', message: 'Drift 0.56% below threshold (5%). No action required.', price: 37.00 },
    { id: 'd2', timestamp: NOW - 15 * M, type: 'ORACLE', message: 'Fetched AVAX/USD price via Chainlink. x402 payment settled.', price: 37.02 },
    { id: 'd3', timestamp: NOW - 1.2 * H, type: 'REBALANCE', message: 'Drift 6.2% exceeded threshold. Sold 4.8 AVAX → 177.60 USDC via Trader Joe.', price: 37.00, txHash: '0x7f3a9bC4E21d8A5c' },
    { id: 'd4', timestamp: NOW - 2.5 * H, type: 'ORACLE', message: 'Fetched AVAX/USD price via Pyth Network. x402 payment settled.', price: 36.85 },
    { id: 'd5', timestamp: NOW - 3.1 * H, type: 'HOLD', message: 'Drift 3.2% below threshold. Portfolio balanced within tolerance.', price: 36.85 },
    { id: 'd6', timestamp: NOW - 5 * H, type: 'REBALANCE', message: 'Drift 5.8% exceeded threshold. Bought 3.2 AVAX with 116.48 USDC.', price: 36.40, txHash: '0xaB3c4D5e6F7a8B9c' },
    { id: 'd7', timestamp: NOW - 8 * H, type: 'ERROR', message: 'Oracle timeout: Chainlink feed stale (>120s). Retrying with Pyth.', price: 36.20 },
    { id: 'd8', timestamp: NOW - 12 * H, type: 'HOLD', message: 'Drift 1.1% below threshold. Markets stable.', price: 36.15 },
];
export const MOCK_ORACLE_PAYMENTS: OraclePayment[] = [
    { id: 'op1', timestamp: NOW - 15 * M, txHash: '0x7f3a9bC4...8c6D5a2F', amountAVAX: 0.00027, amountUSD: 0.01, endpoint: 'chainlink/avax-usd', status: 'SUCCESS' },
    { id: 'op2', timestamp: NOW - 2.5 * H, txHash: '0xaB3c4D5e...0F1a2B3c', amountAVAX: 0.00027, amountUSD: 0.01, endpoint: 'pyth/avax-usd', status: 'SUCCESS' },
    { id: 'op3', timestamp: NOW - 5 * H, txHash: '0x1D2e3F4a...9c0D1e2F', amountAVAX: 0.00027, amountUSD: 0.01, endpoint: 'chainlink/avax-usd', status: 'SUCCESS' },
    { id: 'op4', timestamp: NOW - 8 * H, txHash: '0x4B5c6D7e...3a4B5c6D', amountAVAX: 0.00027, amountUSD: 0.01, endpoint: 'chainlink/avax-usd', status: 'FAILED' },
    { id: 'op5', timestamp: NOW - 12 * H, txHash: '0x8F9a0B1c...7e8F9a0B', amountAVAX: 0.00027, amountUSD: 0.01, endpoint: 'chainlink/avax-usd', status: 'SUCCESS' },
];
export const MOCK_TRADES: TradeRecord[] = [
    { id: 't1', timestamp: NOW - 1.2 * H, pair: 'AVAX/USDC', side: 'SELL', amountIn: 4.8, amountOut: 177.60, tokenIn: 'AVAX', tokenOut: 'USDC', priceUSD: 37.00, status: 'CONFIRMED', txHash: '0x7f3a9bC4E21d8A5c6B0F2e7D9f4a1b3E8c6D5a2F1234567890abcdef', pnlBps: 42 },
    { id: 't2', timestamp: NOW - 5 * H, pair: 'AVAX/USDC', side: 'BUY', amountIn: 116.48, amountOut: 3.2, tokenIn: 'USDC', tokenOut: 'AVAX', priceUSD: 36.40, status: 'CONFIRMED', txHash: '0xaB3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B', pnlBps: -15 },
    { id: 't3', timestamp: NOW - 18 * H, pair: 'AVAX/USDC', side: 'SELL', amountIn: 2.1, amountOut: 75.81, tokenIn: 'AVAX', tokenOut: 'USDC', priceUSD: 36.10, status: 'CONFIRMED', txHash: '0x1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D', pnlBps: 88 },
    { id: 't4', timestamp: NOW - 36 * H, pair: 'AVAX/USDC', side: 'BUY', amountIn: 200.00, amountOut: 5.71, tokenIn: 'USDC', tokenOut: 'AVAX', priceUSD: 35.02, status: 'CONFIRMED', txHash: '0x4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B', pnlBps: 120 },
    { id: 't5', timestamp: NOW - 48 * H, pair: 'AVAX/USDC', side: 'SELL', amountIn: 6.5, amountOut: 227.50, tokenIn: 'AVAX', tokenOut: 'USDC', priceUSD: 35.00, status: 'CONFIRMED', txHash: '0x8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F', pnlBps: -8 },
];
export const MOCK_REPUTATION: ReputationData = {
    score: 847, maxScore: 1000, totalTrades: 142, successRate: 96.5, history: [
        { timestamp: NOW - 7 * 24 * H, score: 780 }, { timestamp: NOW - 6 * 24 * H, score: 795 }, { timestamp: NOW - 5 * 24 * H, score: 810 }, { timestamp: NOW - 4 * 24 * H, score: 818 }, { timestamp: NOW - 3 * 24 * H, score: 825 }, { timestamp: NOW - 2 * 24 * H, score: 838 }, { timestamp: NOW - 24 * H, score: 842 }, { timestamp: NOW, score: 847 },
    ]
};
export const MOCK_TICKER_ITEMS: TickerItem[] = [
    { label: 'AVAX/USD', value: '$37.00', color: '#4ade80' }, { label: 'PORTFOLIO', value: '$5,006.84' }, { label: 'DRIFT', value: '0.56%', color: '#4ade80' },
    { label: 'TRADES_TODAY', value: '3/10' }, { label: 'AGENT', value: 'ACTIVE', color: '#4ade80' }, { label: 'LAST_REBALANCE', value: '1h 12m' },
    { label: 'ORACLE_FEE', value: '$0.01' }, { label: 'ERC-8004_SCORE', value: '847' }, { label: 'BLOCK', value: '#48,291,037' },
    { label: 'DRAWDOWN', value: '-2.78%', color: '#fbbf24' }, { label: 'ALLOC', value: '50.6/49.4' }, { label: 'GAS', value: '25 nAVAX' },
];

// ── Marketplace mock data ───────────────────────────────────────────────────
export const TIER_CONFIG: Record<string, TierConfig> = {
    APEX:      { color: '#fbbf24', bg: '#3d2e0a', label: '👑 APEX' },
    ELITE:     { color: '#4ade80', bg: '#1a3d2b', label: '⚡ ELITE' },
    TRUSTED:   { color: '#22d3ee', bg: '#0a2d33', label: '✓ TRUSTED' },
    RISING:    { color: '#a78bfa', bg: '#2d1f4a', label: '↑ RISING' },
    UNVERIFIED:{ color: '#888888', bg: '#1a1a1a', label: '⬜ UNVERIFIED' },
};

export const MOCK_AGENTS: MarketplaceAgent[] = [
    { id:1, rank:1, delta:'eq', emoji:'🏔', name:'AlphaVault-7', handle:'0x7f3a...4e9b', tier:'APEX', score:923, ret30:14.2, winRate:94.1, trades:312, subs:48, maxDD:-3.2, subFee:9.99, perfFee:2.0, strategy:'50/50 BALANCED', desc:'Conservative momentum-based rebalancer. Prioritizes capital preservation with consistent 14%+ monthly returns. Lowest drawdown in APEX tier.', sparkline:[4,6,3,8,5,9,7,12,10,14,11,13], aum:'$184k', vol:'$2.1M', radar:[92,88,95,76,89,94], stakeAvax:35, listedAt: NOW - 90 * 24 * H },
    { id:2, rank:2, delta:'up', emoji:'⚡', name:'StormBreaker-3', handle:'0x2c8f...a441', tier:'APEX', score:891, ret30:18.7, winRate:91.3, trades:445, subs:61, maxDD:-5.8, subFee:0, perfFee:3.5, strategy:'AVAX-HEAVY', desc:'Aggressive trend-following strategy. Higher returns, higher volatility. Best for bull market conditions. Zero subscription fee.', sparkline:[2,8,4,12,6,15,9,7,14,18,12,19], aum:'$312k', vol:'$4.4M', radar:[89,95,78,91,72,88], stakeAvax:50, listedAt: NOW - 120 * 24 * H },
    { id:3, rank:3, delta:'up', emoji:'🧊', name:'IcePeak-1', handle:'0x9d1e...c720', tier:'APEX', score:856, ret30:9.4, winRate:97.2, trades:189, subs:29, maxDD:-1.8, subFee:14.99, perfFee:1.5, strategy:'STABLECOIN-HEAVY', desc:'Ultra-conservative strategy. Minimal drawdown, steady returns. Ideal for risk-averse portfolios. Highest win rate on the platform.', sparkline:[3,4,3,5,4,6,5,7,6,8,7,9], aum:'$95k', vol:'$0.9M', radar:[86,72,98,65,97,91], stakeAvax:20, listedAt: NOW - 60 * 24 * H },
    { id:4, rank:4, delta:'dn', emoji:'🌊', name:'WaveRider-9', handle:'0x4b7d...f33c', tier:'ELITE', score:784, ret30:11.2, winRate:88.4, trades:267, subs:34, maxDD:-4.4, subFee:4.99, perfFee:2.5, strategy:'50/50 BALANCED', desc:'Mean-reversion specialist. Thrives in sideways markets by capturing small but consistent spread opportunities.', sparkline:[5,3,7,4,9,6,11,8,10,7,12,9], aum:'$128k', vol:'$1.6M', radar:[78,82,71,88,84,79], stakeAvax:15, listedAt: NOW - 45 * 24 * H },
    { id:5, rank:5, delta:'eq', emoji:'🔥', name:'PhoenixAI-2', handle:'0x6e2a...b881', tier:'ELITE', score:761, ret30:22.1, winRate:83.7, trades:521, subs:72, maxDD:-9.1, subFee:0, perfFee:4.0, strategy:'AVAX-HEAVY', desc:'High-frequency momentum strategy. Highest return potential but significant drawdown risk. For experienced DeFi users only.', sparkline:[8,14,6,18,3,22,11,16,19,22,15,23], aum:'$289k', vol:'$6.8M', radar:[76,98,68,95,52,83], stakeAvax:40, listedAt: NOW - 180 * 24 * H },
    { id:6, rank:6, delta:'up', emoji:'🌙', name:'LunarDrift-4', handle:'0x1f9b...d220', tier:'ELITE', score:743, ret30:8.1, winRate:90.6, trades:198, subs:22, maxDD:-2.9, subFee:7.99, perfFee:1.0, strategy:'STABLECOIN-HEAVY', desc:'Low-volatility income strategy. Consistent 8% monthly with near-zero drawdown. Perfect for capital preservation.', sparkline:[2,3,4,3,5,4,6,5,6,7,6,8], aum:'$74k', vol:'$0.7M', radar:[74,65,91,72,95,82], stakeAvax:12, listedAt: NOW - 30 * 24 * H },
    { id:7, rank:7, delta:'dn', emoji:'🎯', name:'ZenithBot-6', handle:'0x8c4f...9a12', tier:'ELITE', score:721, ret30:13.5, winRate:86.2, trades:334, subs:41, maxDD:-6.2, subFee:9.99, perfFee:2.0, strategy:'50/50 BALANCED', desc:'Statistical arbitrage between AVAX price discrepancies. Generates alpha from cross-venue inefficiencies.', sparkline:[6,8,5,10,7,12,9,11,13,10,14,13], aum:'$156k', vol:'$2.9M', radar:[72,79,75,84,78,86], stakeAvax:18, listedAt: NOW - 75 * 24 * H },
    { id:8, rank:8, delta:'up', emoji:'🌀', name:'VortexV2', handle:'0x3d6c...7e44', tier:'ELITE', score:698, ret30:10.8, winRate:85.1, trades:412, subs:55, maxDD:-7.3, subFee:0, perfFee:3.0, strategy:'AVAX-HEAVY', desc:'Volatility-harvesting strategy. Performs best during high-volatility periods. Reasonable downside protection.', sparkline:[4,9,6,14,8,11,13,9,15,11,13,12], aum:'$211k', vol:'$3.7M', radar:[70,88,72,91,65,77], stakeAvax:22, listedAt: NOW - 55 * 24 * H },
    { id:9, rank:9, delta:'eq', emoji:'🏛', name:'AnchorFund-1', handle:'0x5a8e...2b66', tier:'TRUSTED', score:674, ret30:7.2, winRate:91.8, trades:156, subs:18, maxDD:-2.1, subFee:12.99, perfFee:1.0, strategy:'STABLECOIN-HEAVY', desc:'Institutional-grade conservative rebalancer. High win rate, minimal drawdown. Built for portfolio stability.', sparkline:[2,3,2,4,3,5,4,5,4,6,5,7], aum:'$52k', vol:'$0.5M', radar:[67,61,93,58,96,78], stakeAvax:10, listedAt: NOW - 20 * 24 * H },
    { id:10, rank:10, delta:'up', emoji:'💎', name:'DiamondHand-5', handle:'0x7b3a...c990', tier:'TRUSTED', score:651, ret30:16.4, winRate:82.3, trades:289, subs:37, maxDD:-8.8, subFee:4.99, perfFee:2.5, strategy:'AVAX-HEAVY', desc:'Long-term trend follower. Patient, low-frequency trading for maximum trend capture. High returns over 90+ day windows.', sparkline:[3,7,5,11,8,14,10,17,13,16,19,18], aum:'$143k', vol:'$2.2M', radar:[65,86,71,78,68,74], stakeAvax:14, listedAt: NOW - 40 * 24 * H },
    { id:11, rank:11, delta:'eq', emoji:'🦅', name:'EagleEye-8', handle:'0xc4d1...3f88', tier:'TRUSTED', score:629, ret30:12.1, winRate:84.7, trades:203, subs:27, maxDD:-5.5, subFee:0, perfFee:3.5, strategy:'50/50 BALANCED', desc:'Pattern recognition agent trained on 18 months of AVAX data. Strong medium-term trend identification.', sparkline:[5,6,8,7,9,11,8,12,10,13,11,14], aum:'$108k', vol:'$1.8M', radar:[63,77,70,72,76,68], stakeAvax:11, listedAt: NOW - 25 * 24 * H },
];

export const MOCK_MY_SUBSCRIPTION: MySubscription = {
    agentId: 1, agentName: 'AlphaVault-7', agentEmoji: '🏔', tier: 'APEX', score: 923,
    subscribedAt: NOW - 15 * 24 * H, vaultAddress: '0xVault...1234', feePaidThisMonth: 19.99, perfFee: 2.0, subFee: 9.99,
};

