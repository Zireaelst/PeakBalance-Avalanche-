'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { ReputationData } from '@/types';
interface Props { data: ReputationData; }
export function ReputationWidget({ data }: Props) {
    const pct = (data.score / data.maxScore) * 100;
    const pts = data.history.map((h, i) => {
        const x = (i / (data.history.length - 1)) * 300;
        const y = 60 - ((h.score - 750) / 300) * 60;
        return `${x},${y}`;
    }).join(' ');
    return (
        <div style={{ background: '#161616', padding: '14px 16px' }}>
            <SectionLabel label="ERC-8004_REPUTATION" />
            <div style={{ display: 'flex', gap: 32, marginTop: 12, alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: 36, fontWeight: 700, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>{data.score}</div>
                    <div style={{ fontSize: 10, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>/ {data.maxScore}</div>
                    <div style={{ height: 3, background: '#2a2a2a', width: 120, marginTop: 8 }}><div style={{ height: '100%', width: `${pct}%`, background: '#22d3ee' }} /></div>
                    <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>{data.totalTrades} TRADES · {data.successRate}% WIN</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>7D TREND</div>
                    <svg width="100%" height={60} viewBox="0 0 300 60" preserveAspectRatio="none">
                        <polyline points={pts} fill="none" stroke="#4ade80" strokeWidth={1.5} />
                    </svg>
                </div>
            </div>
        </div>
    );
}
