'use client';
import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ConstraintBar } from '@/components/ui/ConstraintBar';
import { Tag } from '@/components/ui/Tag';
import { Btn } from '@/components/ui/Btn';
import { Divider } from '@/components/ui/Divider';
import { MOCK_CONSTRAINTS, MOCK_MY_SUBSCRIPTION, TIER_CONFIG } from '@/lib/mock-data';
export default function SettingsPage() {
    const c = MOCK_CONSTRAINTS;
    return (
        <div>
            <div style={{ background: '#161616', padding: '14px 16px' }}>
                <SectionLabel label="IMMUTABLE_CONSTRAINTS" />
                <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>These constraints are enforced by ConstraintEngine.sol — they cannot be modified by the agent or any admin. They are hardcoded at deployment.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#2a2a2a', marginBottom: 16 }}>
                    {[{ l: 'MAX_TRADE_SIZE', v: `${c.maxTradeSizePct}%`, d: 'of portfolio value per trade', t: 'IMMUTABLE', tc: '#f87171', vc: '#e8e8e8' },
                    { l: 'MAX_DAILY_TRADES', v: `${c.maxDailyTrades}`, d: 'trades per 24h rolling window', t: 'IMMUTABLE', tc: '#f87171', vc: '#e8e8e8' },
                    { l: 'STOP_LOSS', v: `${c.stopLossThreshold}%`, d: 'drawdown triggers auto-exit all positions', t: 'IMMUTABLE', tc: '#f87171', vc: '#f87171' },
                    { l: 'DRIFT_THRESHOLD', v: `${c.driftThreshold}%`, d: 'allocation drift before rebalance triggers', t: 'CONFIGURABLE', tc: '#fbbf24', vc: '#e8e8e8' },
                    ].map(item => (
                        <div key={item.l} className="dither-hover" style={{ background: '#161616', padding: '12px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>{item.l}</span>
                                <Tag color={item.tc}>{item.t}</Tag>
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: item.vc, fontFamily: "'JetBrains Mono', monospace" }}>{item.v}</div>
                            <div style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{item.d}</div>
                        </div>
                    ))}
                </div>
            </div>
            <Divider char="═" />
            <div style={{ background: '#161616', padding: '14px 16px' }}>
                <SectionLabel label="CURRENT_STATUS" />
                <div style={{ marginTop: 8 }}><ConstraintBar label="DAILY_TRADES" current={c.currentDailyTrades} max={c.maxDailyTrades} /><ConstraintBar label="DRAWDOWN" current={c.currentDrawdown} max={c.stopLossThreshold} unit="%" /><ConstraintBar label="DRIFT" current={c.currentDrift} max={c.driftThreshold} unit="%" /></div>
            </div>
            <Divider char="═" />
            <div style={{ background: '#161616', padding: '14px 16px' }}>
                <SectionLabel label="WHITELISTED_PROTOCOLS" />
                <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>Agent can only interact with these protocols. Adding new protocols requires contract upgrade with 24h timelock.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {c.whitelistedProtocols.map(p => (<div key={p} className="dither-hover" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid #2a2a2a' }}><span style={{ color: '#4ade80', fontSize: 10 }}>✓</span><span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', flex: 1 }}>{p}</span><Tag color="#4ade80">ACTIVE</Tag></div>))}
                </div>
            </div>
            <Divider char="═" />
            <div style={{ background: '#161616', padding: '14px 16px' }}>
                <SectionLabel label="AGENT_CONTROLS" />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn>▮▮ PAUSE AGENT</Btn><Btn variant="success">▶ RESUME AGENT</Btn><Btn variant="danger">⚠ EMERGENCY EXIT</Btn></div>
                <div style={{ marginTop: 12, fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>PAUSE: Agent stops monitoring. Can resume anytime.<br />EMERGENCY EXIT: Immediately exits all positions. Cannot be undone.</div>
            </div>
            <Divider char="═" />
            <MySubscriptionPanel />
        </div>
    );
}

function MySubscriptionPanel() {
    const sub = MOCK_MY_SUBSCRIPTION;
    if (!sub) {
        return (
            <div style={{ background: '#161616', padding: '14px 16px' }}>
                <SectionLabel label="MARKETPLACE_SUBSCRIPTION" />
                <div style={{ marginTop: 12, fontSize: 10, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>
                    No active marketplace subscription.{' '}
                    <Link href="/marketplace" style={{ color: '#22d3ee' }}>Browse agents →</Link>
                </div>
            </div>
        );
    }
    const tc = TIER_CONFIG[sub.tier];
    return (
        <div style={{ background: '#161616', padding: '14px 16px' }}>
            <SectionLabel label="MARKETPLACE_SUBSCRIPTION" />
            <div style={{ marginTop: 12, border: '1px solid #2a2a2a', background: '#0a0a0a' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 20 }}>{sub.agentEmoji}</div>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>{sub.agentName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.15em', padding: '2px 5px', background: tc.bg, color: tc.color, border: `1px solid ${tc.color}40` }}>{sub.tier}</span>
                                <span style={{ fontSize: 9, color: '#4ade80' }}>ACTIVE</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/marketplace/${sub.agentId}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', padding: '6px 10px', border: '1px solid #2a2a2a', color: '#888', textDecoration: 'none' }}>VIEW AGENT</Link>
                        <button style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', padding: '6px 10px', border: '1px solid #f8717144', color: '#f87171', background: 'transparent' }}>UNSUBSCRIBE</button>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#2a2a2a' }}>
                    {[
                        { l: 'ERC-8004 SCORE', v: `${sub.score}`, c: tc.color },
                        { l: 'SUB FEE', v: sub.subFee > 0 ? `$${sub.subFee}/mo` : 'FREE', c: '#22d3ee' },
                        { l: 'PERF FEE', v: sub.perfFee > 0 ? `${sub.perfFee.toFixed(1)}%` : 'NONE', c: '#fbbf24' },
                        { l: 'SUBSCRIBED', v: new Date(sub.subscribedAt).toLocaleDateString(), c: '#888' },
                    ].map(s => (
                        <div key={s.l} style={{ background: '#0a0a0a', padding: '10px 12px' }}>
                            <div style={{ fontSize: 8, color: '#444', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>{s.l}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: s.c, fontFamily: "'JetBrains Mono', monospace" }}>{s.v}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
