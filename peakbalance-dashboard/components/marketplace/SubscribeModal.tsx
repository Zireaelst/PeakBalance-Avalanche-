'use client';
import type { MarketplaceAgent, TierConfig } from '@/types';
import { RadarChart } from './RadarChart';

interface SubscribeModalProps {
    agent: MarketplaceAgent | null;
    tierConfig: Record<string, TierConfig>;
    onClose: () => void;
}

export function SubscribeModal({ agent: a, tierConfig, onClose }: SubscribeModalProps) {
    if (!a) return null;
    const tc = tierConfig[a.tier];
    const monthly = a.subFee + (5000 * (a.perfFee / 100) * a.ret30 / 100 / 12);

    return (
        <div
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,10,10,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{ background: '#111', border: '1px solid #2a2a2a', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#161616' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>// SUBSCRIBE_TO_AGENT</span>
                    <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#888', width: 28, height: 28, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>

                <div style={{ padding: 20 }}>
                    {/* Agent header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid #2a2a2a', marginBottom: 18 }}>
                        <div style={{ width: 52, height: 52, fontSize: 24, border: '1px solid #2a2a2a', background: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.emoji}</div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e8e8', letterSpacing: '.02em' }}>{a.name}</div>
                            <div style={{ fontSize: 10, color: '#444', marginTop: 3 }}>by {a.handle} · {a.aum} AUM</div>
                            <span style={{ fontSize: 8, color: tc.color, border: `1px solid ${tc.color}`, background: tc.bg, padding: '2px 7px', display: 'inline-block', marginTop: 6, letterSpacing: '.12em' }}>{tc.label}</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, marginLeft: 'auto', color: tc.color }}>{a.score}</div>
                    </div>

                    {/* Radar */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <RadarChart values={a.radar} color={tc.color} size={200} />
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#2a2a2a', marginBottom: 18 }}>
                        {[
                            { l: '30D RETURN', v: `+${a.ret30}%`, c: '#4ade80' },
                            { l: 'WIN RATE', v: `${a.winRate}%`, c: '#e8e8e8' },
                            { l: 'TOTAL TRADES', v: `${a.trades}`, c: '#e8e8e8' },
                            { l: 'MAX DRAWDOWN', v: `${a.maxDD}%`, c: '#fbbf24' },
                        ].map(s => (
                            <div key={s.l} style={{ background: '#161616', padding: 14 }}>
                                <div style={{ fontSize: 8, color: '#444', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 6 }}>{s.l}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
                            </div>
                        ))}
                    </div>

                    {/* Fee config */}
                    <div style={{ border: '1px solid #2a2a2a', padding: 16, marginBottom: 18 }}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>FEE BREAKDOWN</div>
                        {[
                            { l: 'MONTHLY SUBSCRIPTION', v: a.subFee > 0 ? `$${a.subFee} USDC / month` : 'FREE' },
                            { l: 'PERFORMANCE FEE', v: `${a.perfFee}%` },
                            { l: 'PROTOCOL FEE (fixed)', v: '0.50%' },
                            { l: 'ESTIMATED MONTHLY (on $5k portfolio)', v: `~$${monthly.toFixed(2)}/mo`, highlight: true },
                        ].map(row => (
                            <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #2a2a2a' }}>
                                <span style={{ fontSize: 9, color: '#888', letterSpacing: '.1em' }}>{row.l}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: row.highlight ? '#fbbf24' : '#e8e8e8' }}>{row.v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <div style={{ fontSize: 9, color: '#444', lineHeight: 1.7, border: '1px solid #2a2a2a', padding: 10, marginBottom: 18, letterSpacing: '.04em' }}>
                        ⚠ By subscribing, you authorize this agent to execute trades on your PeakVault. All trades are subject to ConstraintEngine.sol limits (max 5% per trade, max 10/day). The agent wallet cannot withdraw your funds. You can unsubscribe at any time.
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex' }}>
                        <button style={{ flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: 12, border: '1px solid #4ade80', color: '#4ade80', background: 'transparent', transition: 'background .12s' }}
                            onClick={onClose}>
                            CONFIRM SUBSCRIPTION →
                        </button>
                        <button style={{ flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: 12, border: '1px solid #2a2a2a', borderLeft: 'none', color: '#888', background: 'transparent' }}
                            onClick={onClose}>
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
