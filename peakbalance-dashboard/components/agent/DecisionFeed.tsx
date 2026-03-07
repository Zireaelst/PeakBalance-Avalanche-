'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import type { AgentDecision } from '@/types';

interface DecisionFeedProps {
    decisions: AgentDecision[];
}

const TYPE_COLORS: Record<AgentDecision['type'], string> = {
    HOLD: '#888888',
    REBALANCE: '#4ade80',
    ORACLE: '#22d3ee',
    ERROR: '#f87171',
    PAUSE: '#fbbf24',
    RESUME: '#4ade80',
};

function formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDate(ts: number): string {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'TODAY';
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export function DecisionFeed({ decisions }: DecisionFeedProps) {
    return (
        <div style={{ background: '#161616' }}>
            <div style={{ padding: '14px 16px 0 16px' }}>
                <SectionLabel label="AGENT_DECISIONS" />
            </div>

            {/* Header */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 40px 90px 1fr 70px',
                    background: '#111111',
                    borderBottom: '1px solid #2a2a2a',
                    padding: '6px 16px',
                    gap: 12,
                }}
            >
                {['TIME', 'DATE', 'TYPE', 'MESSAGE', 'PRICE'].map((col) => (
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
                ))}
            </div>

            {/* Rows */}
            {decisions.map((decision, i) => (
                <div
                    key={decision.id}
                    className="dither-hover"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '90px 40px 90px 1fr 70px',
                        borderBottom: '1px solid #2a2a2a',
                        padding: '7px 16px',
                        gap: 12,
                        alignItems: 'center',
                        animation: i === 0 ? 'fadeIn 0.3s ease-out forwards' : undefined,
                    }}
                >
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatTime(decision.timestamp)}
                    </span>
                    <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatDate(decision.timestamp)}
                    </span>
                    <div>
                        <Tag color={TYPE_COLORS[decision.type]}>{decision.type}</Tag>
                    </div>
                    <span
                        style={{
                            fontSize: 10,
                            color: '#e8e8e8',
                            fontFamily: "'JetBrains Mono', monospace",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {decision.message}
                    </span>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        ${decision.price.toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
    );
}
