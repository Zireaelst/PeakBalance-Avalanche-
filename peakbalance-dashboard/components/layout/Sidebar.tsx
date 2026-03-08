'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PulseDot } from '@/components/ui/PulseDot';
import { ConstraintBar } from '@/components/ui/ConstraintBar';
import { Btn } from '@/components/ui/Btn';
import { MOCK_AGENT_STATUS, MOCK_CONSTRAINTS, MOCK_REPUTATION } from '@/lib/mock-data';
export function Sidebar() {
    const s = MOCK_AGENT_STATUS, c = MOCK_CONSTRAINTS, r = MOCK_REPUTATION;
    return (
        <aside style={{ width: 260, minWidth: 260, background: '#0a0a0a', borderRight: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a2a' }}>
                <SectionLabel label="AGENT" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <PulseDot color={s.isActive ? '#4ade80' : '#f87171'} />
                    <span style={{ fontSize: 11, color: s.isActive ? '#4ade80' : '#f87171', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.isActive ? 'ACTIVE' : 'PAUSED'}</span>
                </div>
            </div>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a2a' }}>
                <SectionLabel label="CONSTRAINTS" />
                <div style={{ marginTop: 8 }}>
                    <ConstraintBar label="DAILY_TRADES" current={c.currentDailyTrades} max={c.maxDailyTrades} />
                    <ConstraintBar label="MAX_TRADE" current={c.maxTradeSizePct} max={c.maxTradeSizePct} unit="%" />
                    <ConstraintBar label="STOP_LOSS" current={c.currentDrawdown} max={c.stopLossThreshold} unit="%" />
                    <ConstraintBar label="DRIFT" current={c.currentDrift} max={c.driftThreshold} unit="%" />
                </div>
            </div>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a2a' }}>
                <SectionLabel label="ERC-8004" />
                <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>{r.score}</span>
                    <span style={{ fontSize: 10, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}> / {r.maxScore}</span>
                </div>
                <div style={{ height: 3, background: '#2a2a2a', marginTop: 4 }}><div style={{ height: '100%', width: `${(r.score / r.maxScore) * 100}%`, background: '#22d3ee' }} /></div>
                <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>{r.totalTrades} TRADES · {r.successRate}% WIN</div>
            </div>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a2a' }}>
                <SectionLabel label="WHITELISTED" />
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {c.whitelistedProtocols.map(p => (
                        <div key={p} style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>
                            <span style={{ color: '#4ade80', marginRight: 6 }}>✓</span>{p}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ padding: '12px 14px', marginTop: 'auto' }}>
                <Btn variant="danger" style={{ width: '100%' }}>⚠ EMERGENCY EXIT</Btn>
            </div>
        </aside>
    );
}
