'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import { Divider } from '@/components/ui/Divider';
import { MOCK_TRADES } from '@/lib/mock-data';

function formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

function truncateHash(hash: string): string {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: '#4ade80',
    FAILED: '#f87171',
    PENDING: '#fbbf24',
};

export default function TradesPage() {
    return (
        <div style={{ background: '#161616' }}>
            <div style={{ padding: '14px 16px 0 16px' }}>
                <SectionLabel label="TRADE_HISTORY" />
                <div
                    style={{
                        fontSize: 10,
                        color: '#888888',
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: 12,
                    }}
                >
                    All automated rebalance trades executed by the PeakBalance agent
                </div>
            </div>

            <Divider char="─" />

            {/* Header */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 50px 80px 60px 80px 80px 70px 70px 140px',
                    background: '#111111',
                    borderBottom: '1px solid #2a2a2a',
                    padding: '6px 16px',
                    gap: 12,
                }}
            >
                {['TIME', 'DATE', 'PAIR', 'SIDE', 'AMOUNT_IN', 'AMOUNT_OUT', 'PRICE', 'STATUS', 'TX_HASH'].map(
                    (col) => (
                        <span
                            key={col}
                            style={{
                                fontSize: 9,
                                color: '#444444',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            {col}
                        </span>
                    )
                )}
            </div>

            {/* Rows */}
            {MOCK_TRADES.map((trade) => {
                const sideColor = trade.side === 'BUY' ? '#4ade80' : '#f87171';
                const pnlColor = trade.pnlBps >= 0 ? '#4ade80' : '#f87171';
                const pnlSign = trade.pnlBps >= 0 ? '+' : '';

                return (
                    <div
                        key={trade.id}
                        className="dither-hover"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 50px 80px 60px 80px 80px 70px 70px 140px',
                            borderBottom: '1px solid #2a2a2a',
                            padding: '7px 16px',
                            gap: 12,
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>
                            {formatTime(trade.timestamp)}
                        </span>
                        <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>
                            {formatDate(trade.timestamp)}
                        </span>
                        <span style={{ fontSize: 10, color: '#e8e8e8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                            {trade.pair}
                        </span>
                        <div>
                            <Tag color={sideColor}>{trade.side}</Tag>
                        </div>
                        <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>
                            {trade.amountIn.toFixed(2)} {trade.tokenIn}
                        </span>
                        <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>
                            {trade.amountOut.toFixed(2)} {trade.tokenOut}
                        </span>
                        <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>
                            ${trade.priceUSD.toFixed(2)}
                        </span>
                        <div>
                            <Tag color={STATUS_COLORS[trade.status]}>{trade.status}</Tag>
                        </div>
                        <span style={{ fontSize: 10, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>
                            {truncateHash(trade.txHash)}
                        </span>
                    </div>
                );
            })}

            {/* Summary */}
            <div
                style={{
                    padding: '12px 16px',
                    display: 'flex',
                    gap: 24,
                    borderTop: '1px solid #2a2a2a',
                    background: '#111111',
                }}
            >
                <span
                    style={{
                        fontSize: 9,
                        color: '#888888',
                        letterSpacing: '0.1em',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    TOTAL: {MOCK_TRADES.length} TRADES
                </span>
                <span style={{ width: 1, background: '#2a2a2a', alignSelf: 'stretch' }} />
                <span
                    style={{
                        fontSize: 9,
                        color: '#4ade80',
                        letterSpacing: '0.1em',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    CONFIRMED: {MOCK_TRADES.filter((t) => t.status === 'CONFIRMED').length}
                </span>
            </div>
        </div>
    );
}
