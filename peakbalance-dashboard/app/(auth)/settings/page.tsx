'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ConstraintBar } from '@/components/ui/ConstraintBar';
import { Tag } from '@/components/ui/Tag';
import { Btn } from '@/components/ui/Btn';
import { Divider } from '@/components/ui/Divider';
import { MOCK_CONSTRAINTS } from '@/lib/mock-data';
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
        </div>
    );
}
