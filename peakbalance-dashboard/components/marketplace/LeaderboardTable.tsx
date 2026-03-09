'use client';
import type { MarketplaceAgent, TierConfig, SortKey } from '@/types';

interface LeaderboardTableProps {
    agents: MarketplaceAgent[];
    tierConfig: Record<string, TierConfig>;
    onSubscribe: (agent: MarketplaceAgent) => void;
    sortKey: SortKey;
    onSort: (key: SortKey) => void;
}

export function LeaderboardTable({ agents, tierConfig, onSubscribe, sortKey, onSort }: LeaderboardTableProps) {
    const cols: { key?: SortKey; label: string }[] = [
        { label: '#' },
        { label: 'AGENT' },
        { label: 'TIER' },
        { key: 'score', label: 'ERC-8004' },
        { key: 'ret30', label: '30D RET' },
        { key: 'winrate', label: 'WIN RATE' },
        { label: 'FEES' },
        { label: 'ACTION' },
    ];

    const gridCols = '48px 1fr 90px 90px 90px 90px 110px 120px';

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, background: '#161616', borderBottom: '1px solid #3d3d3d', padding: '8px 14px', gap: 8, alignItems: 'center' }}>
                {cols.map(c => (
                    <div key={c.label}
                        onClick={() => c.key && onSort(c.key)}
                        style={{ fontSize: 8, color: c.key === sortKey ? '#22d3ee' : '#444', letterSpacing: '.2em', textTransform: 'uppercase', cursor: c.key ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 3 }}>
                        {c.label}{c.key && c.key === sortKey && ' ↓'}
                    </div>
                ))}
            </div>

            {/* Rows */}
            {agents.map((a, i) => {
                const tc = tierConfig[a.tier];
                const scoreW = `${(a.score / 1000) * 100}%`;
                return (
                    <div key={a.id}
                        onClick={() => onSubscribe(a)}
                        style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1px solid #2a2a2a', padding: '0 14px', gap: 8, alignItems: 'center', minHeight: 72, transition: 'background .1s', animationDelay: `${i * 0.04}s` }}
                        className="dh lb-row"
                    >
                        {/* Rank */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: a.rank <= 3 ? (a.rank === 1 ? '#fbbf24' : a.rank === 2 ? '#e8e8e8' : '#22d3ee') : '#444', minWidth: 20, textAlign: 'center' }}>{a.rank}</span>
                            <span style={{ fontSize: 8, color: a.delta === 'up' ? '#4ade80' : a.delta === 'dn' ? '#f87171' : '#444' }}>
                                {a.delta === 'up' ? '▲' : a.delta === 'dn' ? '▼' : '—'}
                            </span>
                        </div>

                        {/* Agent */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                            <div style={{ width: 36, height: 36, flexShrink: 0, border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: '#161616', position: 'relative', overflow: 'hidden' }}>
                                {a.emoji}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: tc.color }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#e8e8e8', letterSpacing: '.04em' }}>{a.name}</div>
                                <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{a.handle}</div>
                                <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                                    <span style={{ fontSize: 7, border: '1px solid #2a2a2a', padding: '1px 4px', color: '#444', letterSpacing: '.1em', textTransform: 'uppercase' }}>{a.strategy}</span>
                                    <span style={{ fontSize: 7, border: '1px solid #2a2a2a', padding: '1px 4px', color: '#444' }}>{a.trades} trades</span>
                                </div>
                            </div>
                        </div>

                        {/* Tier */}
                        <div>
                            <span style={{ fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', padding: '3px 7px', border: `1px solid ${tc.color}`, color: tc.color, background: tc.bg, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                {tc.label}
                            </span>
                        </div>

                        {/* Score */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: tc.color }}>{a.score}</span>
                            <div style={{ height: 2, background: '#2a2a2a' }}>
                                <div style={{ height: '100%', width: scoreW, background: tc.color, transition: 'width .5s' }} />
                            </div>
                            <span style={{ fontSize: 8, color: '#444' }}>/1000</span>
                        </div>

                        {/* 30D return */}
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>+{a.ret30}%</div>
                            <div style={{ fontSize: 8, color: '#444', marginTop: 2 }}>30 DAYS</div>
                        </div>

                        {/* Win rate */}
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#e8e8e8' }}>{a.winRate}%</div>
                            <div style={{ fontSize: 8, color: '#444', marginTop: 2 }}>WIN RATE</div>
                        </div>

                        {/* Fees */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 8, color: '#444', letterSpacing: '.1em' }}>PERF</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: '#e8e8e8' }}>{a.perfFee}%</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 8, color: '#444', letterSpacing: '.1em' }}>SUB</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: '#e8e8e8' }}>{a.subFee > 0 ? `$${a.subFee}` : 'FREE'}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <button
                                onClick={e => { e.stopPropagation(); onSubscribe(a); }}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', padding: '6px 10px', border: `1px solid #4ade80`, color: '#4ade80', background: 'transparent', transition: 'background .12s', whiteSpace: 'nowrap' }}>
                                SUBSCRIBE
                            </button>
                            <div style={{ fontSize: 8, color: '#444', textAlign: 'center', letterSpacing: '.08em' }}>{a.subs} active subs</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
