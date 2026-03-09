'use client';
import type { MarketplaceAgent, TierConfig } from '@/types';

interface AgentCardProps {
    agent: MarketplaceAgent;
    tierConfig: TierConfig;
    onSubscribe: (agent: MarketplaceAgent) => void;
}

export function AgentCard({ agent: a, tierConfig: tc, onSubscribe }: AgentCardProps) {
    const max = Math.max(...a.sparkline), min = Math.min(...a.sparkline);
    const heights = a.sparkline.map(v => Math.max(4, ((v - min) / (max - min || 1)) * 26));

    return (
        <div
            onClick={() => onSubscribe(a)}
            style={{ background: '#161616', overflow: 'hidden', transition: 'background .12s', position: 'relative' }}
            className="dh"
        >
            <div style={{ padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: '#0a0a0a', position: 'relative' }}>
                        {a.emoji}
                        <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, background: tc.color }} />
                    </div>
                    <div style={{ flex: 1, marginLeft: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#e8e8e8', letterSpacing: '.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {a.name}
                            <span style={{ fontSize: 7, color: tc.color, border: `1px solid ${tc.color}`, padding: '1px 5px', letterSpacing: '.12em' }}>{a.tier}</span>
                        </div>
                        <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{a.handle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: tc.color }}>{a.score}</div>
                        <div style={{ fontSize: 7, color: '#444', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 2 }}>ERC-8004</div>
                    </div>
                </div>
            </div>

            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#888', lineHeight: 1.55, margin: '0 0 14px', padding: '0 20px' }}>
                {a.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }}>
                {[
                    { n: `+${a.ret30}%`, l: '30D RET', c: '#4ade80' },
                    { n: `${a.winRate}%`, l: 'WIN RATE', c: '#e8e8e8' },
                    { n: `${a.subs}`, l: 'SUBS', c: '#888' },
                ].map((s, i) => (
                    <div key={i} style={{ padding: '10px 12px', borderRight: i < 2 ? '1px solid #2a2a2a' : 'none', textAlign: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, display: 'block', lineHeight: 1, color: s.c }}>{s.n}</span>
                        <span style={{ fontSize: 7, color: '#444', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 3, display: 'block' }}>{s.l}</span>
                    </div>
                ))}
            </div>

            {/* Sparkline */}
            <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'flex-end', gap: 2, height: 50, paddingTop: 10 }}>
                {heights.map((h, j) => {
                    const isPos = j > 0 && a.sparkline[j] >= a.sparkline[j - 1];
                    return <div key={j} style={{ flex: 1, height: h, background: isPos ? '#4ade80' : '#f87171', opacity: 0.7, minHeight: 2 }} />;
                })}
            </div>

            <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: '#444' }}>
                        PERF<span style={{ color: '#e8e8e8', fontWeight: 700, marginLeft: 3 }}>{a.perfFee}%</span>
                    </span>
                    <span style={{ fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: '#444' }}>
                        SUB<span style={{ color: '#e8e8e8', fontWeight: 700, marginLeft: 3 }}>{a.subFee > 0 ? `$${a.subFee}` : 'FREE'}</span>
                    </span>
                </div>
                <button
                    onClick={e => { e.stopPropagation(); onSubscribe(a); }}
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', padding: '7px 14px', border: `1px solid ${tc.color}`, color: tc.color, background: 'transparent', transition: 'background .12s', whiteSpace: 'nowrap' }}
                >
                    SUBSCRIBE →
                </button>
            </div>
        </div>
    );
}
