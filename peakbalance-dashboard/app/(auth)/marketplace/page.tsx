'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { MarketplaceAgent, SortKey } from '@/types';
import { MOCK_AGENTS, TIER_CONFIG } from '@/lib/mock-data';
import { useMarketplace } from '@/hooks/useMarketplace';
import { LeaderboardTable } from '@/components/marketplace/LeaderboardTable';
import { AgentCard } from '@/components/marketplace/AgentCard';
import { SubscribeModal } from '@/components/marketplace/SubscribeModal';
import { RadarChart } from '@/components/marketplace/RadarChart';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'score', label: 'ERC-8004 SCORE' },
    { key: 'ret30', label: '30D RETURN' },
    { key: 'subs', label: 'SUBSCRIBERS' },
    { key: 'winrate', label: 'WIN RATE' },
    { key: 'drawdown', label: 'MIN DRAWDOWN' },
];

const FEATURED = MOCK_AGENTS.filter(a => a.tier === 'APEX' || a.tier === 'ELITE').slice(0, 8);

export default function MarketplacePage() {
    const { filtered, sortKey, setSortKey, minScore, setMinScore, search, setSearch, tiers, setTiers } = useMarketplace();
    const [view, setView] = useState<'table' | 'grid'>('table');
    const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null);

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: "'JetBrains Mono', monospace" }}>
            {selectedAgent && (
                <SubscribeModal agent={selectedAgent} tierConfig={TIER_CONFIG} onClose={() => setSelectedAgent(null)} />
            )}

            {/* Hero */}
            <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '52px 32px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 50% 80% at 80% 50%,rgba(34,211,238,.04) 0%,transparent 70%),radial-gradient(ellipse 30% 50% at 10% 50%,rgba(74,222,128,.03) 0%,transparent 60%)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(#2a2a2a 1px,transparent 1px),linear-gradient(90deg,#2a2a2a 1px,transparent 1px)', backgroundSize: '48px 48px', opacity: 0.18, maskImage: 'linear-gradient(to right,transparent,black 20%,black 80%,transparent)' }} />
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <span style={{ fontSize: 9, color: '#22d3ee', letterSpacing: '.2em', border: '1px solid #22d3ee', padding: '2px 8px' }}>// AGENT_MARKETPLACE</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#444' }}>
                                <span style={{ width: 5, height: 5, background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                                LIVE · ERC-8004 VERIFIED
                            </span>
                        </div>
                        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.02em', marginBottom: 10 }}>
                            Find your agent.<br />Let it <span style={{ color: '#4ade80' }}>earn for you.</span>
                        </h1>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, maxWidth: 520 }}>
                            Community-built, audited, and reputation-scored DeFi agents. Subscribe to any listed agent and let it manage your PeakVault — with the same hard-coded safety limits.
                        </p>
                        <div style={{ display: 'flex', gap: 0, marginTop: 28, border: '1px solid #2a2a2a', width: 'fit-content' }}>
                            {[
                                { n: '24', l: 'Listed Agents', c: '#4ade80' },
                                { n: '$1.4M', l: 'Total AUM', c: '#22d3ee' },
                                { n: '+11.2%', l: 'Avg 30D Return', c: '#fbbf24' },
                                { n: '847', l: 'Avg ERC-8004 Score', c: '#e8e8e8' },
                            ].map((s, i) => (
                                <div key={i} style={{ padding: '12px 24px', borderRight: i < 3 ? '1px solid #2a2a2a' : 'none', textAlign: 'center' }}>
                                    <span style={{ fontSize: 20, fontWeight: 700, display: 'block', lineHeight: 1, color: s.c }}>{s.n}</span>
                                    <span style={{ fontSize: 8, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{s.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220 }}>
                        <Link href="/deploy" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #4ade80', color: '#4ade80', background: 'transparent', textDecoration: 'none', textAlign: 'center' }}>
                            ⬆ DEPLOY YOUR AGENT
                        </Link>
                        <button style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                            📖 VIEW REQUIREMENTS
                        </button>
                        <button style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                            📊 COMPARE AGENTS
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ fontSize: 10, color: '#444', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.4, padding: '3px 0', background: '#0a0a0a' }}>═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════</div>

            {/* Featured Strip */}
            <div style={{ background: '#161616', borderBottom: '1px solid #2a2a2a', padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid #2a2a2a', padding: '2px 9px' }}>
                        <span style={{ fontSize: 9, color: '#444' }}>// </span>
                        <span style={{ fontSize: 9, color: '#888', letterSpacing: '.25em', textTransform: 'uppercase' }}>APEX &amp; ELITE AGENTS</span>
                    </div>
                    <span style={{ fontSize: 9, color: '#444', letterSpacing: '.12em' }}>SORTED BY ERC-8004 SCORE ↓</span>
                </div>
                <div style={{ display: 'flex', gap: 1, background: '#2a2a2a', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {FEATURED.map(a => {
                        const tc = TIER_CONFIG[a.tier];
                        return (
                            <div key={a.id} onClick={() => setSelectedAgent(a)}
                                style={{ background: '#0a0a0a', padding: '16px 18px', minWidth: 220, flexShrink: 0, transition: 'background .12s' }}
                                className="dh featured-card">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div style={{ fontSize: 18, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a' }}>{a.emoji}</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: tc.color }}>{a.score}</div>
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#e8e8e8', marginBottom: 3 }}>{a.name}</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80' }}>+{a.ret30}%</div>
                                <div style={{ fontSize: 8, color: '#444', marginTop: 4 }}>{a.subs} subscribers · {a.strategy}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main layout */}
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 1, background: '#2a2a2a', alignItems: 'start' }}>

                    {/* Sidebar */}
                    <div style={{ background: '#0a0a0a', position: 'sticky', top: 0 }}>

                        {/* Sort */}
                        <div style={{ borderBottom: '1px solid #2a2a2a', padding: 18 }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>SORT BY</div>
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.key} onClick={() => setSortKey(opt.key)}
                                    style={{ width: '100%', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${sortKey === opt.key ? '#22d3ee' : '#2a2a2a'}`, color: sortKey === opt.key ? '#22d3ee' : '#888', padding: '8px 12px', textAlign: 'left', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .1s', ...(sortKey === opt.key ? { background: '#0a2d33' } : {}) }}>
                                    {opt.label} <span>↓</span>
                                </button>
                            ))}
                        </div>

                        {/* Tier filter */}
                        <div style={{ borderBottom: '1px solid #2a2a2a', padding: 18 }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>TIER</div>
                            {([['APEX', '#fbbf24', '3'], ['ELITE', '#4ade80', '7'], ['TRUSTED', '#22d3ee', '11'], ['RISING', '#a78bfa', '3']] as const).map(([tier, color, count]) => (
                                <label key={tier} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #2a2a2a', cursor: 'pointer' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" checked={tiers[tier as keyof typeof tiers]} onChange={e => setTiers(prev => ({ ...prev, [tier]: e.target.checked }))}
                                            style={{ width: 12, height: 12, accentColor: color }} />
                                        <span style={{ fontSize: 10, color: '#888' }}>{tier}</span>
                                        <span style={{ width: 8, height: 8, background: color, display: 'inline-block' }} />
                                    </span>
                                    <span style={{ fontSize: 9, color: '#444', border: '1px solid #2a2a2a', padding: '1px 5px' }}>{count}</span>
                                </label>
                            ))}
                        </div>

                        {/* Min score */}
                        <div style={{ borderBottom: '1px solid #2a2a2a', padding: 18 }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>MIN ERC-8004 SCORE</div>
                            <input type="range" min={0} max={1000} value={minScore} onChange={e => setMinScore(Number(e.target.value))} style={{ width: '100%', height: 2, accentColor: '#22d3ee', background: '#2a2a2a', margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#444' }}>
                                <span>0</span>
                                <span style={{ color: '#22d3ee' }}>{minScore}+</span>
                                <span>1000</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ background: '#0a0a0a' }}>
                        {/* Topbar */}
                        <div style={{ borderBottom: '1px solid #2a2a2a', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161616' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {(['table', 'grid'] as const).map(v => (
                                    <button key={v} onClick={() => setView(v)}
                                        style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${view === v ? '#22d3ee' : '#2a2a2a'}`, color: view === v ? '#22d3ee' : '#888', padding: '5px 10px', transition: 'all .1s', ...(view === v ? { background: '#0a2d33' } : {}) }}>
                                        {v.toUpperCase()} VIEW
                                    </button>
                                ))}
                                <span style={{ fontSize: 9, color: '#444', marginLeft: 4 }}>
                                    SHOWING <span style={{ color: '#e8e8e8', fontWeight: 700 }}>{filtered.length}</span> AGENTS
                                </span>
                            </div>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: 8, fontSize: 10, color: '#444' }}>⌕</span>
                                <input type="text" placeholder="SEARCH AGENTS..." value={search} onChange={e => setSearch(e.target.value)}
                                    style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '5px 10px 5px 28px', outline: 'none', width: 200, letterSpacing: '.05em' }} />
                            </div>
                        </div>

                        {/* Views */}
                        {view === 'table' ? (
                            <LeaderboardTable agents={filtered} tierConfig={TIER_CONFIG} onSubscribe={setSelectedAgent} sortKey={sortKey} onSort={setSortKey} />
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 1, background: '#2a2a2a', padding: 1 }}>
                                {filtered.map(a => (
                                    <AgentCard key={a.id} agent={a} tierConfig={TIER_CONFIG[a.tier]} onSubscribe={setSelectedAgent} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ fontSize: 10, color: '#444', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.4, padding: '3px 0', background: '#111' }}>▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒</div>

            {/* Deploy/Apply Section */}
            <div id="apply" style={{ background: '#111', padding: 32, borderTop: '1px solid #2a2a2a' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid #2a2a2a', padding: '2px 9px', marginBottom: 14 }}>
                            <span style={{ fontSize: 9, color: '#444' }}>// </span>
                            <span style={{ fontSize: 9, color: '#888', letterSpacing: '.25em', textTransform: 'uppercase' }}>DEPLOY YOUR AGENT</span>
                        </div>
                        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 10 }}>
                            Build an agent.<br />Let others <span style={{ color: '#4ade80' }}>subscribe.</span><br />Earn <span style={{ color: '#fbbf24' }}>performance fees.</span>
                        </h2>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, maxWidth: 480, marginBottom: 24 }}>
                            Deploy your own DeFi rebalancing strategy as an ERC-8004 agent, list it on the marketplace, and earn fees from every subscriber. Curated listing ensures quality and safety.
                        </p>
                        {[
                            { n: '01', title: 'Submit Application', body: 'Fill out the agent details form — strategy type, fee structure, description. The PeakBalance team reviews within 48h.', c: '#22d3ee' },
                            { n: '02', title: 'Stake 10 AVAX', body: 'Deposit minimum 10 AVAX into StakingVault.sol. This is your skin-in-the-game. Slashed on failed/exploitative behavior.', c: '#fbbf24' },
                            { n: '03', title: 'Mint ERC-8004 NFT', body: 'AgentRegistry.sol mints your on-chain identity. Reputation score starts at 0 and builds with every successful trade.', c: '#4ade80' },
                            { n: '04', title: 'Go Live', body: 'Once approved and staked, your agent appears in the marketplace as RISING tier. Build reputation to unlock TRUSTED and beyond.', c: '#a78bfa' },
                        ].map(step => (
                            <div key={step.n} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 14, padding: '14px 0', borderBottom: '1px solid #2a2a2a', alignItems: 'start' }}>
                                <div style={{ width: 32, height: 32, border: `1px solid ${step.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: step.c }}>{step.n}</div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#e8e8e8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{step.title}</div>
                                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#888', lineHeight: 1.5 }}>{step.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#161616' }}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', paddingBottom: 12, borderBottom: '1px solid #2a2a2a', marginBottom: 14 }}>LISTING REQUIREMENTS</div>
                        {[
                            { icon: '⚡', title: 'MINIMUM STAKE', body: 'Must deposit to StakingVault.sol before listing. Returned when agent is de-listed (no active subscribers).', val: '10 AVAX', c: '#fbbf24' },
                            { icon: '🛡', title: 'CONSTRAINT COMPLIANCE', body: 'Agent must call ConstraintEngine.sol before every trade. No bypasses. Verified on-chain by PeakBalance team.', val: 'NON-NEGOTIABLE', c: '#22d3ee' },
                            { icon: '📝', title: 'OPEN-SOURCE STRATEGY', body: 'Strategy logic must be published and verified on Snowtrace. Users must be able to audit what the agent does.', val: 'GITHUB + SNOWTRACE', c: '#4ade80' },
                            { icon: '🔒', title: 'MAX PERFORMANCE FEE', body: 'Protocol enforces a hard cap. Agent owners cannot set performance fee above 5% regardless of strategy performance.', val: '≤ 5.00% MAX', c: '#f87171' },
                        ].map(req => (
                            <div key={req.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                                <div style={{ width: 24, height: 24, border: `1px solid ${req.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 2 }}>{req.icon}</div>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#e8e8e8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{req.title}</div>
                                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#888', lineHeight: 1.4 }}>{req.body}</p>
                                    <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10, fontWeight: 700, color: '#fbbf24' }}>{req.val}</span>
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Link href="/deploy" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #4ade80', color: '#4ade80', background: 'transparent', textDecoration: 'none', textAlign: 'center' }}>
                                SUBMIT APPLICATION →
                            </Link>
                            <button style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                                READ FULL REQUIREMENTS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ background: '#0a0a0a', borderTop: '1px solid #2a2a2a', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: '#444', letterSpacing: '.1em' }}>© 2026 PeakBalance Marketplace · All agents subject to ConstraintEngine.sol · ERC-8004 reputation is on-chain and immutable</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#444' }}>
                        <span style={{ width: 4, height: 4, background: '#4ade80', display: 'inline-block' }} />24 AGENTS LIVE
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#444', borderLeft: '1px solid #2a2a2a', paddingLeft: 16 }}>
                        <span style={{ width: 4, height: 4, background: '#22d3ee', display: 'inline-block' }} />AVALANCHE CONNECTED
                    </div>
                    <span style={{ fontSize: 9, color: '#444', borderLeft: '1px solid #2a2a2a', paddingLeft: 16 }}>BLOCK #37,241,082</span>
                </div>
            </div>
        </div>
    );
}
