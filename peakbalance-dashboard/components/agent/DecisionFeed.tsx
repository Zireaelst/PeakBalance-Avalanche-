'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import type { AgentDecision } from '@/types';
interface Props { decisions: AgentDecision[]; }
const TYPE_COLORS: Record<string, string> = { HOLD: '#888888', REBALANCE: '#4ade80', ORACLE: '#22d3ee', ERROR: '#f87171', PAUSE: '#fbbf24', RESUME: '#4ade80' };
function fmt(ts: number) { const d = new Date(ts); return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); }
export function DecisionFeed({ decisions }: Props) {
    return (
        <div style={{ background: '#161616' }}>
            <div style={{ padding: '14px 16px 0 16px' }}><SectionLabel label="AGENT_DECISIONS" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 100px 1fr 70px', background: '#111111', borderBottom: '1px solid #2a2a2a', padding: '6px 16px', gap: 12, marginTop: 8 }}>
                {['TIME', 'DATE', 'TYPE', 'MESSAGE', 'PRICE'].map(h => <span key={h} style={{ fontSize: 9, color: '#444444', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>{h}</span>)}
            </div>
            {decisions.map(d => (
                <div key={d.id} className="dither-hover" style={{ display: 'grid', gridTemplateColumns: '80px 50px 100px 1fr 70px', borderBottom: '1px solid #2a2a2a', padding: '7px 16px', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(d.timestamp)}</span>
                    <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>TODAY</span>
                    <div><Tag color={TYPE_COLORS[d.type]}>{d.type}</Tag></div>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.message}</span>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", textAlign: 'right' }}>${d.price.toFixed(2)}</span>
                </div>
            ))}
        </div>
    );
}
