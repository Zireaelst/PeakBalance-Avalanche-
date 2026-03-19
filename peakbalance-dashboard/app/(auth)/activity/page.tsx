'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';

const NOW = Date.now();
const H = 3600_000;
const DAY = 86400_000;
const SNOWTRACE_BASE = 'https://testnet.snowtrace.io/tx/';

type ActivityType = 'ALL' | 'TRADE' | 'DEPOSIT' | 'WITHDRAW' | 'ORACLE' | 'CONTROL' | 'EMERGENCY';

interface ActivityItem {
    id: string;
    timestamp: number;
    type: ActivityType;
    title: string;
    description: string;
    txHash?: string;
    value?: string;
    valueColor?: string;
    status: 'CONFIRMED' | 'PENDING' | 'FAILED';
    icon: string;
    iconColor: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 'a1', timestamp: NOW - 8000, type: 'ORACLE', title: 'PRICE ORACLE QUERY', description: 'Fetched AVAX/USD ($37.00) via Chainlink. x402 payment: 0.00027 AVAX', txHash: '0x7f3a9bC4E21d8A5c6B0F2e7D9f4a1b3E8c6D5a2F1234567890abcdef', value: '-$0.01', valueColor: '#888888', status: 'CONFIRMED', icon: '◎', iconColor: '#22d3ee' },
    { id: 'a2', timestamp: NOW - 42000, type: 'CONTROL', title: 'DRIFT CHECK', description: 'Portfolio drift 0.56% — below 5% threshold. No rebalance needed.', value: '0.56%', valueColor: '#4ade80', status: 'CONFIRMED', icon: '◆', iconColor: '#4ade80' },
    { id: 'a3', timestamp: NOW - 1.2 * H, type: 'TRADE', title: 'REBALANCE: SELL AVAX', description: 'Sold 4.8 AVAX → 177.60 USDC via Trader Joe v2.1. Drift was 6.2%.', txHash: '0x7f3a9bC4E21d8A5c6B0F2e7D9f4a1b3E8c6D5a2F1234567890abcdef', value: '+42 bps', valueColor: '#4ade80', status: 'CONFIRMED', icon: '⇄', iconColor: '#fbbf24' },
    { id: 'a4', timestamp: NOW - 2.5 * H, type: 'ORACLE', title: 'PRICE ORACLE QUERY', description: 'Fetched AVAX/USD ($36.85) via Pyth Network. x402 payment settled.', txHash: '0xaB3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B', value: '-$0.01', valueColor: '#888888', status: 'CONFIRMED', icon: '◎', iconColor: '#22d3ee' },
    { id: 'a5', timestamp: NOW - 5 * H, type: 'TRADE', title: 'REBALANCE: BUY AVAX', description: 'Bought 3.2 AVAX with 116.48 USDC via Trader Joe v2.1. Drift was 5.8%.', txHash: '0xaB3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B', value: '-15 bps', valueColor: '#f87171', status: 'CONFIRMED', icon: '⇄', iconColor: '#fbbf24' },
    { id: 'a6', timestamp: NOW - 8 * H, type: 'ORACLE', title: 'ORACLE TIMEOUT', description: 'Chainlink feed stale (>120s). Retry triggered with Pyth Network fallback.', txHash: '0x4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B', value: 'RETRY', valueColor: '#f87171', status: 'FAILED', icon: '⚠', iconColor: '#f87171' },
    { id: 'a7', timestamp: NOW - 12 * H, type: 'CONTROL', title: 'DRIFT CHECK', description: 'Portfolio drift 1.1% — markets stable. No action required.', value: '1.1%', valueColor: '#4ade80', status: 'CONFIRMED', icon: '◆', iconColor: '#4ade80' },
    { id: 'a8', timestamp: NOW - 18 * H, type: 'TRADE', title: 'REBALANCE: SELL AVAX', description: 'Sold 2.1 AVAX → 75.81 USDC via Trader Joe v2.1. Drift was 5.3%.', txHash: '0x1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D', value: '+88 bps', valueColor: '#4ade80', status: 'CONFIRMED', icon: '⇄', iconColor: '#fbbf24' },
    { id: 'a9', timestamp: NOW - 24 * H, type: 'DEPOSIT', title: 'DEPOSIT AVAX', description: 'User deposited 25.00 AVAX into PeakVault. Balance updated.', txHash: '0x8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F', value: '+25 AVAX', valueColor: '#4ade80', status: 'CONFIRMED', icon: '↓', iconColor: '#4ade80' },
    { id: 'a10', timestamp: NOW - 36 * H, type: 'TRADE', title: 'REBALANCE: BUY AVAX', description: 'Bought 5.71 AVAX with 200.00 USDC via Trader Joe v2.1. Drift was 7.1%.', txHash: '0x4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B', value: '+120 bps', valueColor: '#4ade80', status: 'CONFIRMED', icon: '⇄', iconColor: '#fbbf24' },
    { id: 'a11', timestamp: NOW - 2 * DAY, type: 'DEPOSIT', title: 'DEPOSIT USDC', description: 'User deposited 1,000.00 USDC into PeakVault. Approval + deposit.', txHash: '0x2c8f9bC4E21d8A5c6B0F2e7D9f4a1b3E8c6D5a2F1234567890abcdef012345', value: '+1,000 USDC', valueColor: '#22d3ee', status: 'CONFIRMED', icon: '↓', iconColor: '#22d3ee' },
    { id: 'a12', timestamp: NOW - 2.5 * DAY, type: 'CONTROL', title: 'AGENT LINKED', description: 'Agent AlphaVault-7 (NFT #1) linked via PeakController. Authorized to trade.', txHash: '0x3d6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B', value: 'LINKED', valueColor: '#22d3ee', status: 'CONFIRMED', icon: '🔗', iconColor: '#22d3ee' },
    { id: 'a13', timestamp: NOW - 3 * DAY, type: 'CONTROL', title: 'SUBSCRIPTION STARTED', description: 'Subscribed to AlphaVault-7. Monthly fee: 9.99 USDC. Performance: 2%.', txHash: '0x5a8e2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F', value: '-9.99 USDC', valueColor: '#fbbf24', status: 'CONFIRMED', icon: '★', iconColor: '#fbbf24' },
    { id: 'a14', timestamp: NOW - 48 * H, type: 'TRADE', title: 'REBALANCE: SELL AVAX', description: 'Sold 6.5 AVAX → 227.50 USDC via Trader Joe v2.1. Drift was 5.1%.', txHash: '0x8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F', value: '-8 bps', valueColor: '#f87171', status: 'CONFIRMED', icon: '⇄', iconColor: '#fbbf24' },
];

const FILTER_BUTTONS: { type: ActivityType; label: string; color: string }[] = [
    { type: 'ALL', label: 'ALL', color: '#e8e8e8' },
    { type: 'TRADE', label: 'TRADES', color: '#fbbf24' },
    { type: 'DEPOSIT', label: 'DEPOSITS', color: '#4ade80' },
    { type: 'ORACLE', label: 'ORACLE', color: '#22d3ee' },
    { type: 'CONTROL', label: 'CONTROLS', color: '#a78bfa' },
];

export default function ActivityPage() {
    const [filter, setFilter] = useState<ActivityType>('ALL');

    const filtered = filter === 'ALL' ? MOCK_ACTIVITY : MOCK_ACTIVITY.filter(a => a.type === filter);

    const fmtTime = (ts: number) => {
        const diff = NOW - ts;
        if (diff < 60000) return 'JUST NOW';
        if (diff < H) return `${Math.floor(diff / 60000)}m AGO`;
        if (diff < DAY) return `${(diff / H).toFixed(1)}h AGO`;
        return `${(diff / DAY).toFixed(1)}d AGO`;
    };

    const fmtFull = (ts: number) => new Date(ts).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
    }).toUpperCase();

    const truncHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

    // Summary stats
    const trades = MOCK_ACTIVITY.filter(a => a.type === 'TRADE').length;
    const deposits = MOCK_ACTIVITY.filter(a => a.type === 'DEPOSIT').length;
    const oracles = MOCK_ACTIVITY.filter(a => a.type === 'ORACLE').length;
    const failed = MOCK_ACTIVITY.filter(a => a.status === 'FAILED').length;

    return (
        <div style={{ padding: '20px 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, background: '#fbbf24' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace" }}>ACTIVITY FEED</span>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>ALL TRANSACTIONS & EVENTS</span>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                {[
                    { label: 'TOTAL EVENTS', value: MOCK_ACTIVITY.length.toString(), color: '#e8e8e8' },
                    { label: 'TRADES', value: trades.toString(), color: '#fbbf24' },
                    { label: 'DEPOSITS', value: deposits.toString(), color: '#4ade80' },
                    { label: 'ORACLE QUERIES', value: oracles.toString(), color: '#22d3ee' },
                    { label: 'FAILED', value: failed.toString(), color: failed > 0 ? '#f87171' : '#4ade80' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#0d0d0d', padding: '12px 14px' }}>
                        <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <Divider char="═" />

            {/* Filters */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {FILTER_BUTTONS.map(f => (
                    <button
                        key={f.type}
                        onClick={() => setFilter(f.type)}
                        className="dh"
                        style={{
                            background: filter === f.type ? '#161616' : 'transparent',
                            border: `1px solid ${filter === f.type ? f.color : '#2a2a2a'}`,
                            color: filter === f.type ? f.color : '#444444',
                            padding: '4px 12px',
                            fontSize: 9,
                            letterSpacing: '0.15em',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: filter === f.type ? 700 : 400,
                            transition: 'all 0.15s',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", alignSelf: 'center' }}>
                    {filtered.length} EVENTS
                </div>
            </div>

            {/* Activity List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#2a2a2a' }}>
                {filtered.map((item, i) => (
                    <div key={item.id} className="dh" style={{
                        background: '#0d0d0d',
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: '24px 1fr auto',
                        gap: 14,
                        alignItems: 'start',
                        animation: `fadeIn 0.2s ease-out forwards`,
                        animationDelay: `${i * 0.03}s`,
                        opacity: 0,
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${item.iconColor}40`,
                            fontSize: 12,
                            color: item.iconColor,
                        }}>
                            {item.icon}
                        </div>

                        {/* Content */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>{item.title}</span>
                                <span style={{
                                    fontSize: 8, padding: '1px 6px',
                                    border: `1px solid ${item.status === 'CONFIRMED' ? '#4ade80' : item.status === 'FAILED' ? '#f87171' : '#fbbf24'}40`,
                                    color: item.status === 'CONFIRMED' ? '#4ade80' : item.status === 'FAILED' ? '#f87171' : '#fbbf24',
                                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em',
                                }}>
                                    {item.status}
                                </span>
                            </div>
                            <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, marginBottom: 4 }}>{item.description}</div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtFull(item.timestamp)}</span>
                                {item.txHash && (
                                    <a
                                        href={`${SNOWTRACE_BASE}${item.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 9, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none' }}
                                    >
                                        ↗ {truncHash(item.txHash)}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Value */}
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtTime(item.timestamp)}</span>
                            {item.value && (
                                <div style={{ fontSize: 11, fontWeight: 700, color: item.valueColor, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                                    {item.value}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
                    ALL TRANSACTIONS VERIFIABLE ON SNOWTRACE (FUJI TESTNET)
                </span>
            </div>
        </div>
    );
}
