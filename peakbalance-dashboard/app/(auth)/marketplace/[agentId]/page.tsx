'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { MarketplaceAgent } from '@/types';
import { MOCK_AGENTS, TIER_CONFIG } from '@/lib/mock-data';
import { RadarChart } from '@/components/marketplace/RadarChart';
import { SubscribeModal } from '@/components/marketplace/SubscribeModal';

const METRIC_LABELS = ['RETURN', 'VOLUME', 'WIN%', 'RISK', 'CONSISTENCY', 'SCORE'];

export default function AgentProfilePage() {
    const { agentId } = useParams<{ agentId: string }>();
    const [agent, setAgent] = useState<MarketplaceAgent | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'constraints'>('overview');

    useEffect(() => {
        const found = MOCK_AGENTS.find(a => a.id === Number(agentId));
        setAgent(found ?? null);
    }, [agentId]);

    if (!agent) {
        return (
            <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", color: '#444', fontSize: 11, letterSpacing: '.1em' }}>
                AGENT_NOT_FOUND :: {agentId}
                <br />
                <Link href="/marketplace" style={{ color: '#22d3ee', marginTop: 12 }}>← BACK TO MARKETPLACE</Link>
            </div>
        );
    }

    const tc = TIER_CONFIG[agent.tier];

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: "'JetBrains Mono',monospace" }}>
            {showModal && (
                <SubscribeModal agent={agent} tierConfig={TIER_CONFIG} onClose={() => setShowModal(false)} />
            )}

            {/* Breadcrumb */}
            <div style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #2a2a2a', fontSize: 9, color: '#444', letterSpacing: '.12em' }}>
                <Link href="/marketplace" style={{ color: '#555', textDecoration: 'none' }}>MARKETPLACE</Link>
                <span>›</span>
                <span style={{ color: '#e8e8e8' }}>{agent.name}</span>
                <span>›</span>
                <span style={{ color: tc.color }}>{agent.tier}</span>
            </div>

            {/* Hero */}
            <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 40% 80% at 90% 50%,${tc.color}08 0%,transparent 70%)` }} />
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                            <div style={{ width: 64, height: 64, border: `2px solid ${tc.color}`, background: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                                {agent.emoji}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>{agent.name}</h1>
                                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', padding: '3px 7px', background: tc.bg, color: tc.color, border: `1px solid ${tc.color}40` }}>{agent.tier}</span>
                                </div>
                                <div style={{ fontSize: 10, color: '#888', fontFamily: "'Space Grotesk',sans-serif" }}>
                                    {agent.strategy} · {agent.subs} subscribers · staked {agent.stakeAvax} AVAX
                                </div>
                            </div>
                        </div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, maxWidth: 620, marginBottom: 24 }}>{agent.desc}</p>

                        <div style={{ display: 'flex', gap: 1, background: '#2a2a2a', width: 'fit-content', marginBottom: 20 }}>
                            {([
                                { l: '30D RETURN', v: `+${agent.ret30}%`, c: '#4ade80' },
                                { l: 'WIN RATE', v: `${agent.winRate}%`, c: '#22d3ee' },
                                { l: 'MAX DRAWDOWN', v: `${agent.maxDD}%`, c: '#f87171' },
                                { l: 'ERC-8004 SCORE', v: agent.score, c: tc.color },
                                { l: 'TOTAL TRADES', v: agent.trades, c: '#e8e8e8' },
                                { l: 'AUM', v: agent.aum, c: '#fbbf24' },
                            ] as const).map((s, i) => (
                                <div key={i} style={{ padding: '10px 20px', background: '#0a0a0a', borderRight: i < 5 ? '1px solid #2a2a2a' : 'none', textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
                                    <div style={{ fontSize: 8, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</div>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #2a2a2a' }}>
                            {(['overview', 'history', 'constraints'] as const).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === tab ? tc.color : 'transparent'}`, color: activeTab === tab ? tc.color : '#888', transition: 'all .1s' }}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Radar + Subscribe */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minWidth: 260 }}>
                        <div style={{ border: '1px solid #2a2a2a', padding: 20, background: '#161616', textAlign: 'center' }}>
                            <RadarChart values={agent.radar} color={tc.color} size={180} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 12 }}>
                                {METRIC_LABELS.map((label, i) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <div style={{ width: 6, height: 6, background: tc.color, opacity: .5 }} />
                                        <span style={{ fontSize: 8, color: '#888' }}>{label}:{' '}</span>
                                        <span style={{ fontSize: 8, color: '#e8e8e8', fontWeight: 700 }}>{agent.radar[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fee preview */}
                        <div style={{ border: '1px solid #2a2a2a', padding: 16, background: '#161616', width: '100%' }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>FEE STRUCTURE</div>
                            {[
                                { label: 'SUBSCRIPTION', value: agent.subFee > 0 ? `$${agent.subFee}/mo` : 'FREE', c: '#22d3ee' },
                                { label: 'PERFORMANCE', value: agent.perfFee > 0 ? `${agent.perfFee.toFixed(1)}%` : 'NONE', c: '#fbbf24' },
                                { label: 'PROTOCOL CUT', value: '0.5%', c: '#888' },
                            ].map(fee => (
                                <div key={fee.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #2a2a2a', fontSize: 9 }}>
                                    <span style={{ color: '#888', letterSpacing: '.1em' }}>{fee.label}</span>
                                    <span style={{ color: fee.c, fontWeight: 700 }}>{fee.value}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowModal(true)}
                            style={{ width: '100%', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '13px', border: `1px solid ${tc.color}`, color: '#0a0a0a', background: tc.color, fontWeight: 700 }}>
                            SUBSCRIBE TO {agent.name.split(' ')[0].toUpperCase()} →
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab content */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px' }}>
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Sparkline chart */}
                        <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111' }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>30-DAY RETURN CHART</div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
                                {agent.sparkline.map((val, i) => {
                                    const norm = Math.max(0, Math.min(1, (val + 5) / 15));
                                    return (
                                        <div key={i} style={{
                                            flex: 1, height: `${norm * 80}px`,
                                            background: val >= 0 ? tc.color : '#f87171',
                                            opacity: 0.6 + norm * 0.4,
                                        }} />
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 8, color: '#444' }}>
                                <span>30D AGO</span><span>TODAY</span>
                            </div>
                        </div>

                        {/* About */}
                        <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111' }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>ABOUT THIS AGENT</div>
                            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: '#888', lineHeight: 1.7, marginBottom: 16 }}>{agent.desc}</p>
                            {[
                                ['STRATEGY TYPE', agent.strategy, '#888'],
                                ['LISTED', new Date(agent.listedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), '#888'],
                                ['STAKE', `${agent.stakeAvax} AVAX`, '#fbbf24'],
                                ['AGENT WALLET', `${agent.handle.slice(0, 6)}...${agent.handle.slice(-4)}`, '#22d3ee'],
                            ].map(([l, v, c]) => (
                                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #2a2a2a', fontSize: 9 }}>
                                    <span style={{ color: '#444', letterSpacing: '.1em' }}>{l}</span>
                                    <span style={{ color: c as string, fontWeight: 700 }}>{v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Radar full breakdown */}
                        <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>ERC-8004 SCORE BREAKDOWN</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 1, background: '#2a2a2a' }}>
                                {METRIC_LABELS.map((label, i) => (
                                    <div key={label} style={{ background: '#0a0a0a', padding: '16px 12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: tc.color, lineHeight: 1, marginBottom: 6 }}>{agent.radar[i]}</div>
                                        <div style={{ fontSize: 8, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                                        <div style={{ height: 3, background: '#2a2a2a' }}>
                                            <div style={{ height: '100%', background: tc.color, width: `${agent.radar[i]}%`, opacity: 0.7 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111' }}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>TRADE HISTORY · LAST 30 EVENTS</div>
                        {Array.from({ length: 12 }, (_, i) => {
                            const positive = Math.random() > 0.3;
                            const amount = (Math.random() * 4000 + 200).toFixed(0);
                            const pct = (Math.random() * 3 + 0.2).toFixed(2);
                            const assets = ['AVAX/USDC', 'ETH/AVAX', 'BTC.b/USDC', 'JOE/AVAX'];
                            return (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr 80px 80px 100px', gap: 0, padding: '8px 0', borderBottom: '1px solid #2a2a2a', alignItems: 'center', fontSize: 9, color: '#888' }}>
                                    <span style={{ color: '#444' }}>{i + 1}h ago</span>
                                    <span style={{ color: '#22d3ee' }}>{assets[i % assets.length]}</span>
                                    <span style={{ color: '#e8e8e8' }}>{positive ? 'BUY' : 'SELL'} ${amount}</span>
                                    <span style={{ color: positive ? '#4ade80' : '#f87171' }}>{positive ? '+' : '-'}{pct}%</span>
                                    <span style={{ color: '#fbbf24' }}>FILLED</span>
                                    <span style={{ color: '#444', fontSize: 8 }}>GAS: 0.002 AVAX</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'constraints' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {[
                            { title: 'MAX SINGLE TRADE', val: '≤ 5% of vault', icon: '⚡', color: '#22d3ee', body: 'No single rebalance can exceed 5% of your total vault value. Hard-coded in ConstraintEngine.sol.' },
                            { title: 'MAX DAILY TRADES', val: '≤ 10 trades/day', icon: '📊', color: '#4ade80', body: 'Protocol-enforced limit of 10 trades per 24-hour window. Prevents front-running and fee drain.' },
                            { title: 'STOP-LOSS TRIGGER', val: '−10% vault drop', icon: '🛡', color: '#fbbf24', body: 'If vault value drops 10% from its peak, the agent is auto-halted until you manually resume.' },
                            { title: 'TOKEN WHITELIST', val: 'AVAX + USDC only', icon: '✅', color: '#a78bfa', body: 'This agent can only trade whitelisted tokens. No exotic tokens, LP positions, or leveraged assets.' },
                        ].map(c => (
                            <div key={c.title} style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{ width: 36, height: 36, border: `1px solid ${c.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{c.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#e8e8e8', letterSpacing: '.06em', textTransform: 'uppercase' }}>{c.title}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.val}</div>
                                    </div>
                                </div>
                                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: '#888', lineHeight: 1.55 }}>{c.body}</p>
                                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#4ade80' }}>
                                    <span>✓</span> ENFORCED BY ConstraintEngine.sol
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
