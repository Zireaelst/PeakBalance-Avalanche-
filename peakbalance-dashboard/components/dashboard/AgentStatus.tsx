'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PulseDot } from '@/components/ui/PulseDot';
import { Tag } from '@/components/ui/Tag';
import type { AgentStatus } from '@/types';
interface Props { status: AgentStatus; }
export function AgentStatusWidget({ status }: Props) {
    const color = status.isActive ? '#4ade80' : status.isPaused ? '#fbbf24' : '#f87171';
    const label = status.isActive ? 'ACTIVE' : status.isPaused ? 'PAUSED' : 'OFFLINE';
    const elapsed = Math.max(0, Date.now() - status.lastCheck);
    const remaining = Math.max(0, status.nextCheck - Date.now());
    const uptimeH = Math.floor(status.uptime / 3600);
    const uptimeD = Math.floor(uptimeH / 24);
    const addr = status.agentAddress ? `${status.agentAddress.slice(0, 6)}...${status.agentAddress.slice(-4)}` : '—';
    return (
        <div style={{ background: '#161616', padding: '14px 16px' }}>
            <SectionLabel label="AGENT_STATUS" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <PulseDot color={color} /><Tag color={color}>{label}</Tag>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>ID#{status.agentId}</span>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['LAST_CHECK', `${Math.round(elapsed / 1000)}s ago`, '#888888'], ['NEXT_CHECK', `${Math.round(remaining / 1000)}s`, '#4ade80'], ['UPTIME', `${uptimeD}d ${uptimeH % 24}h`, '#888888'], ['WALLET', addr, '#22d3ee']].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
                        <span style={{ fontSize: 10, color: c, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
