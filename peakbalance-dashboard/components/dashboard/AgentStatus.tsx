'use client';

import { PulseDot } from '@/components/ui/PulseDot';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import type { AgentStatus as AgentStatusType } from '@/types';

interface AgentStatusProps {
    status: AgentStatusType;
}

function formatTimeAgo(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
}

function formatCountdown(ms: number): string {
    if (ms <= 0) return 'NOW';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
}

function formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
}

function truncateAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function AgentStatusWidget({ status }: AgentStatusProps) {
    const now = Date.now();
    const lastCheckAgo = now - status.lastCheck;
    const nextCheckIn = status.nextCheck - now;

    const dotColor = status.isPaused ? '#fbbf24' : status.isActive ? '#4ade80' : '#f87171';
    const statusText = status.isPaused ? 'PAUSED' : status.isActive ? 'ACTIVE' : 'OFFLINE';
    const statusTagColor = status.isPaused ? '#fbbf24' : status.isActive ? '#4ade80' : '#f87171';

    return (
        <div
            className="dither-hover"
            style={{
                background: '#161616',
                padding: '14px 16px',
            }}
        >
            <SectionLabel label="AGENT_STATUS" />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <PulseDot color={dotColor} size={8} />
                <Tag color={statusTagColor}>{statusText}</Tag>
                <span
                    style={{
                        fontSize: 9,
                        color: '#444444',
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.1em',
                    }}
                >
                    ID#{status.agentId}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                        LAST_CHECK
                    </span>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatTimeAgo(lastCheckAgo)}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                        NEXT_CHECK
                    </span>
                    <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatCountdown(nextCheckIn)}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                        UPTIME
                    </span>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatUptime(status.uptime)}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                        WALLET
                    </span>
                    <span style={{ fontSize: 10, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>
                        {truncateAddress(status.agentAddress)}
                    </span>
                </div>
            </div>
        </div>
    );
}
