'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { ConstraintBar } from '@/components/ui/ConstraintBar';
import { PulseDot } from '@/components/ui/PulseDot';
import { Btn } from '@/components/ui/Btn';
import { Divider } from '@/components/ui/Divider';
import { MOCK_CONSTRAINTS, MOCK_AGENT_STATUS, MOCK_REPUTATION } from '@/lib/mock-data';

export function Sidebar() {
    const c = MOCK_CONSTRAINTS;
    const s = MOCK_AGENT_STATUS;
    const r = MOCK_REPUTATION;

    const dotColor = s.isPaused ? '#fbbf24' : s.isActive ? '#4ade80' : '#f87171';
    const statusLabel = s.isPaused ? 'PAUSED' : s.isActive ? 'ACTIVE' : 'OFFLINE';

    return (
        <aside
            style={{
                width: 240,
                background: '#111111',
                borderRight: '1px solid #2a2a2a',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                overflowY: 'auto',
                flexShrink: 0,
            }}
        >
            {/* Agent Status Mini */}
            <div style={{ marginBottom: 16 }}>
                <SectionLabel label="AGENT" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <PulseDot color={dotColor} size={6} />
                    <span
                        style={{
                            fontSize: 10,
                            color: dotColor,
                            letterSpacing: '0.15em',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        {statusLabel}
                    </span>
                </div>
            </div>

            <Divider char="─" />

            {/* Constraints */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <SectionLabel label="CONSTRAINTS" />
                <div style={{ marginTop: 8 }}>
                    <ConstraintBar label="DAILY_TRADES" current={c.currentDailyTrades} max={c.maxDailyTrades} />
                    <ConstraintBar label="MAX_TRADE" current={c.maxTradeSizePct} max={c.maxTradeSizePct} unit="%" />
                    <ConstraintBar label="STOP_LOSS" current={c.currentDrawdown} max={c.stopLossThreshold} unit="%" />
                    <ConstraintBar label="DRIFT" current={c.currentDrift} max={c.driftThreshold} unit="%" />
                </div>
            </div>

            <Divider char="─" />

            {/* Reputation mini */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <SectionLabel label="ERC-8004" />
                <div style={{ marginTop: 8 }}>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: '#4ade80',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        {r.score}
                        <span style={{ fontSize: 10, color: '#444444' }}> / {r.maxScore}</span>
                    </div>
                    <div style={{ height: 3, background: '#2a2a2a', marginTop: 6, position: 'relative' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${(r.score / r.maxScore) * 100}%`,
                                background: '#4ade80',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            fontSize: 9,
                            color: '#888888',
                            marginTop: 6,
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.1em',
                        }}
                    >
                        {r.totalTrades} TRADES · {r.successRate}% WIN
                    </div>
                </div>
            </div>

            <Divider char="─" />

            {/* Whitelisted protocols */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <SectionLabel label="WHITELISTED" />
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {c.whitelistedProtocols.map((p) => (
                        <div
                            key={p}
                            style={{
                                fontSize: 9,
                                color: '#888888',
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.1em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <span style={{ color: '#4ade80' }}>✓</span>
                            {p}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1 }} />

            <Divider char="─" />

            {/* Emergency */}
            <div style={{ marginTop: 16 }}>
                <Btn variant="danger">
                    ⚠ EMERGENCY EXIT
                </Btn>
            </div>
        </aside>
    );
}
