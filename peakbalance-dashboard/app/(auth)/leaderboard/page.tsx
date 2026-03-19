'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { MOCK_AGENTS, TIER_CONFIG } from '@/lib/mock-data';
import type { SortKey } from '@/types';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'score', label: 'SCORE' },
    { key: 'ret30', label: '30D RETURN' },
    { key: 'winrate', label: 'WIN RATE' },
    { key: 'subs', label: 'SUBSCRIBERS' },
    { key: 'drawdown', label: 'DRAWDOWN' },
    { key: 'volume', label: 'AUM' },
];

function MiniSparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points} fill="none" stroke={color} strokeWidth={1.2} />
        </svg>
    );
}

export default function LeaderboardPage() {
    const [sortBy, setSortBy] = useState<SortKey>('score');

    const sorted = [...MOCK_AGENTS].sort((a, b) => {
        switch (sortBy) {
            case 'score': return b.score - a.score;
            case 'ret30': return b.ret30 - a.ret30;
            case 'winrate': return b.winRate - a.winRate;
            case 'subs': return b.subs - a.subs;
            case 'drawdown': return a.maxDD - b.maxDD; // less negative = better
            case 'volume': return parseFloat(b.aum.replace(/[$k,M]/g, '')) - parseFloat(a.aum.replace(/[$k,M]/g, ''));
            default: return 0;
        }
    });

    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3);

    // Summary stats
    const totalAgents = MOCK_AGENTS.length;
    const totalSubs = MOCK_AGENTS.reduce((s, a) => s + a.subs, 0);
    const avgScore = Math.round(MOCK_AGENTS.reduce((s, a) => s + a.score, 0) / totalAgents);
    const topTier = MOCK_AGENTS.filter(a => a.tier === 'APEX').length;

    return (
        <div style={{ padding: '20px 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, background: '#fbbf24' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace" }}>LEADERBOARD</span>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>ERC-8004 AGENT RANKINGS</span>
            </div>
            <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 16, lineHeight: 1.6 }}>
                Top-performing agents ranked by on-chain reputation score. All scores computed on-chain from verified trade data.
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                {[
                    { label: 'TOTAL AGENTS', value: totalAgents.toString(), color: '#e8e8e8' },
                    { label: 'TOTAL SUBSCRIBERS', value: totalSubs.toString(), color: '#22d3ee' },
                    { label: 'AVG SCORE', value: avgScore.toString(), color: '#fbbf24' },
                    { label: 'APEX TIER', value: topTier.toString(), color: '#fbbf24' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#0d0d0d', padding: '12px 14px' }}>
                        <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <Divider char="═" />

            {/* Top 3 Podium */}
            <div style={{ marginBottom: 2 }}>
                <SectionLabel label="TOP_3" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '1px', background: '#2a2a2a', marginTop: 10 }}>
                    {[top3[1], top3[0], top3[2]].map((agent, i) => {
                        if (!agent) return null;
                        const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                        const medals = ['', '🥇', '🥈', '🥉'];
                        const tierConf = TIER_CONFIG[agent.tier];
                        const isCenter = rank === 1;

                        return (
                            <div key={agent.id} style={{
                                background: '#0d0d0d',
                                padding: isCenter ? '24px 18px' : '20px 16px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                borderTop: isCenter ? `2px solid #fbbf24` : '2px solid #2a2a2a',
                            }}>
                                {/* Medal & Rank */}
                                <div style={{ fontSize: isCenter ? 28 : 22, marginBottom: 6 }}>{medals[rank]}</div>
                                <div style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 8 }}>RANK #{rank}</div>

                                {/* Agent Icon */}
                                <div style={{
                                    width: isCenter ? 48 : 40, height: isCenter ? 48 : 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `2px solid ${tierConf.color}`,
                                    fontSize: isCenter ? 22 : 18, marginBottom: 8,
                                }}>
                                    {agent.emoji}
                                </div>

                                {/* Name */}
                                <div style={{ fontSize: isCenter ? 13 : 11, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{agent.name}</div>
                                <div style={{ fontSize: 8, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>{agent.handle}</div>

                                {/* Score */}
                                <div style={{ fontSize: isCenter ? 28 : 22, fontWeight: 700, color: tierConf.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{agent.score}</div>
                                <div style={{ fontSize: 8, color: tierConf.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 10 }}>
                                    {tierConf.label}
                                </div>

                                {/* Sparkline */}
                                <MiniSparkline data={agent.sparkline} color={tierConf.color} width={80} height={20} />

                                {/* Stats */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10, width: '100%' }}>
                                    {[
                                        { l: '30D', v: `+${agent.ret30}%`, c: '#4ade80' },
                                        { l: 'WIN', v: `${agent.winRate}%`, c: '#22d3ee' },
                                        { l: 'SUBS', v: agent.subs.toString(), c: '#e8e8e8' },
                                        { l: 'DD', v: `${agent.maxDD}%`, c: '#f87171' },
                                    ].map(s => (
                                        <div key={s.l} style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 7, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{s.l}</div>
                                            <div style={{ fontSize: 10, color: s.c, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{s.v}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Divider char="─" />

            {/* Sort Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>SORT BY:</span>
                {SORT_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => setSortBy(opt.key)}
                        className="dh"
                        style={{
                            background: sortBy === opt.key ? '#161616' : 'transparent',
                            border: `1px solid ${sortBy === opt.key ? '#22d3ee' : '#2a2a2a'}`,
                            color: sortBy === opt.key ? '#22d3ee' : '#444444',
                            padding: '3px 10px', fontSize: 8, letterSpacing: '0.15em',
                            fontFamily: "'JetBrains Mono', monospace", fontWeight: sortBy === opt.key ? 700 : 400,
                            transition: 'all 0.15s',
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Full Ranking Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#2a2a2a' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 36px 1fr 70px 70px 60px 60px 50px 80px 60px', gap: 0, background: '#111111', padding: '8px 12px' }}>
                    {['#', '', 'AGENT', 'SCORE', 'TIER', '30D', 'WIN%', 'SUBS', 'AUM', 'TREND'].map(h => (
                        <span key={h} style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>{h}</span>
                    ))}
                </div>

                {sorted.map((agent, i) => {
                    const tierConf = TIER_CONFIG[agent.tier];
                    const rank = i + 1;
                    const deltaIcon = agent.delta === 'up' ? '▲' : agent.delta === 'dn' ? '▼' : '—';
                    const deltaColor = agent.delta === 'up' ? '#4ade80' : agent.delta === 'dn' ? '#f87171' : '#444444';

                    return (
                        <div key={agent.id} className="dh" style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 36px 1fr 70px 70px 60px 60px 50px 80px 60px',
                            gap: 0, background: '#0d0d0d', padding: '10px 12px', alignItems: 'center',
                            animation: `fadeIn 0.2s ease-out forwards`,
                            animationDelay: `${i * 0.04}s`,
                            opacity: 0,
                            borderLeft: rank <= 3 ? `2px solid ${tierConf.color}` : '2px solid transparent',
                        }}>
                            {/* Rank */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: rank <= 3 ? '#fbbf24' : '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{rank}</span>
                                <span style={{ fontSize: 8, color: deltaColor }}>{deltaIcon}</span>
                            </div>

                            {/* Emoji */}
                            <span style={{ fontSize: 16 }}>{agent.emoji}</span>

                            {/* Name */}
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>{agent.name}</div>
                                <div style={{ fontSize: 8, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{agent.handle}</div>
                            </div>

                            {/* Score */}
                            <span style={{ fontSize: 13, fontWeight: 700, color: tierConf.color, fontFamily: "'JetBrains Mono', monospace" }}>{agent.score}</span>

                            {/* Tier Badge */}
                            <span style={{
                                fontSize: 8, padding: '2px 6px',
                                border: `1px solid ${tierConf.color}40`,
                                color: tierConf.color,
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.05em',
                                textAlign: 'center',
                                display: 'inline-block',
                                width: 'fit-content',
                            }}>
                                {agent.tier}
                            </span>

                            {/* 30d Return */}
                            <span style={{ fontSize: 10, color: agent.ret30 >= 0 ? '#4ade80' : '#f87171', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                                {agent.ret30 >= 0 ? '+' : ''}{agent.ret30}%
                            </span>

                            {/* Win Rate */}
                            <span style={{ fontSize: 10, color: agent.winRate >= 90 ? '#4ade80' : '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{agent.winRate}%</span>

                            {/* Subs */}
                            <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{agent.subs}</span>

                            {/* AUM */}
                            <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{agent.aum}</span>

                            {/* Sparkline */}
                            <MiniSparkline data={agent.sparkline} color={tierConf.color} width={56} height={18} />
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
                    SCORES COMPUTED ON-CHAIN VIA ReputationAggregator · TOP-20 MAINTAINED ON FIXED ARRAY
                </span>
            </div>
        </div>
    );
}
