'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFees } from '@/hooks/useFees';

const MOCK_EARNINGS = {
    accrued: 847.32,
    paid: 4203.18,
    subscribers: 47,
    agentName: 'Apex Momentum V2',
    agentId: 'apex-momentum-v2',
    tier: 'ELITE' as const,
    perfFee: 1.5,
    subFee: 9,
    thisMonth: 320.14,
    lastMonth: 527.18,
    history: [
        { month: 'JUN 25', sub: 423, perf: 104.18, total: 527.18 },
        { month: 'MAY 25', sub: 387, perf: 213.44, total: 600.44 },
        { month: 'APR 25', sub: 351, perf: 88.60, total: 439.60 },
        { month: 'MAR 25', sub: 315, perf: 0, total: 315 },
        { month: 'FEB 25', sub: 279, perf: 167.30, total: 446.30 },
        { month: 'JAN 25', sub: 198, perf: 77.40, total: 275.40 },
    ],
};

export default function EarningsPage() {
    const { claimFees, isClaiming } = useFees();
    const [showClaimConfirm, setShowClaimConfirm] = useState(false);
    const max = Math.max(...MOCK_EARNINGS.history.map(h => h.total));

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: "'JetBrains Mono',monospace" }}>

            {/* Topbar */}
            <div style={{ borderBottom: '1px solid #2a2a2a', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 16, background: '#111', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: '#444', fontSize: 9, letterSpacing: '.12em' }}>AGENT OWNER</span>
                    <span style={{ color: '#2a2a2a' }}>›</span>
                    <span style={{ color: '#fbbf24', fontSize: 9, letterSpacing: '.12em' }}>EARNINGS DASHBOARD</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: '#888' }}>
                    <span style={{ width: 5, height: 5, background: '#4ade80', display: 'inline-block' }} />
                    LIVE · AUTO-UPDATES
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

                {/* Agent header */}
                <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111', marginBottom: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 6 }}>YOUR LISTED AGENT</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ fontSize: 24 }}>⚡</div>
                            <div>
                                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1 }}>{MOCK_EARNINGS.agentName}</div>
                                <div style={{ fontSize: 9, color: '#4ade80', letterSpacing: '.12em', marginTop: 3 }}>ELITE TIER · {MOCK_EARNINGS.subscribers} ACTIVE SUBSCRIBERS</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/marketplace/${MOCK_EARNINGS.agentId}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '9px 16px', border: '1px solid #2a2a2a', color: '#888', textDecoration: 'none' }}>
                            VIEW LISTING
                        </Link>
                        <button style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '9px 16px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                            PAUSE AGENT
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#2a2a2a', marginBottom: 24 }}>
                    {[
                        { label: 'ACCRUED (CLAIMABLE)', value: `$${MOCK_EARNINGS.accrued.toFixed(2)}`, color: '#4ade80', big: true },
                        { label: 'TOTAL EARNED (LIFETIME)', value: `$${(MOCK_EARNINGS.paid + MOCK_EARNINGS.accrued).toLocaleString('en', { minimumFractionDigits: 2 })}`, color: '#fbbf24', big: false },
                        { label: 'THIS MONTH', value: `$${MOCK_EARNINGS.thisMonth.toFixed(2)}`, color: '#22d3ee', big: false },
                        { label: 'LAST MONTH', value: `$${MOCK_EARNINGS.lastMonth.toFixed(2)}`, color: '#e8e8e8', big: false },
                    ].map(s => (
                        <div key={s.label} style={{ background: '#0a0a0a', padding: 24 }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
                            <div style={{ fontSize: s.big ? 32 : 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 1, background: '#2a2a2a' }}>

                    {/* Left: chart + history */}
                    <div style={{ background: '#0a0a0a', padding: 24 }}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>MONTHLY EARNINGS BREAKDOWN</div>

                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, marginBottom: 12 }}>
                            {MOCK_EARNINGS.history.map((h, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                                    <div title={`Performance: $${h.perf}`} style={{ background: '#22d3ee', height: `${(h.perf / max) * 100}px`, opacity: 0.7, transition: 'height .3s' }} />
                                    <div title={`Subscription: $${h.sub}`} style={{ background: '#4ade80', height: `${(h.sub / max) * 100}px`, opacity: 0.7, transition: 'height .3s' }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 16 }}>
                            {MOCK_EARNINGS.history.map((h, i) => (
                                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: 8, color: '#444', letterSpacing: '.1em' }}>{h.month}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 9, paddingTop: 8, borderTop: '1px solid #2a2a2a' }}>
                            <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: '#4ade80', display: 'inline-block' }} />SUBSCRIPTION FEES</span>
                            <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: '#22d3ee', display: 'inline-block' }} />PERFORMANCE FEES</span>
                        </div>

                        {/* History table */}
                        <div style={{ marginTop: 24, borderTop: '1px solid #2a2a2a', paddingTop: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 100px 100px 100px auto', gap: 0, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #2a2a2a', marginBottom: 4 }}>
                                {['MONTH', 'SUB FEES', 'PERF FEES', 'TOTAL', 'STATUS'].map(h => (
                                    <span key={h} style={{ fontSize: 8, color: '#444', letterSpacing: '.18em', textTransform: 'uppercase' }}>{h}</span>
                                ))}
                            </div>
                            {MOCK_EARNINGS.history.map((h, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 100px 100px 100px auto', gap: 0, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #2a2a2a' }}>
                                    <span style={{ fontSize: 9, color: '#888' }}>{h.month}</span>
                                    <span style={{ fontSize: 9, color: '#4ade80' }}>${h.sub.toFixed(2)}</span>
                                    <span style={{ fontSize: 9, color: '#22d3ee' }}>{h.perf > 0 ? `$${h.perf.toFixed(2)}` : '—'}</span>
                                    <span style={{ fontSize: 10, color: '#e8e8e8', fontWeight: 700 }}>${h.total.toFixed(2)}</span>
                                    <span style={{ fontSize: 8, color: '#4ade80', letterSpacing: '.1em' }}>PAID ✓</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: claim panel */}
                    <div style={{ background: '#0a0a0a', padding: 24, borderLeft: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: 1 }}>

                        {/* Claimable */}
                        <div style={{ border: '1px solid #4ade8066', padding: 20, background: '#4ade8008', marginBottom: 16 }}>
                            <div style={{ fontSize: 9, color: '#4ade80', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 8 }}>CLAIMABLE NOW</div>
                            <div style={{ fontSize: 36, fontWeight: 700, color: '#4ade80', lineHeight: 1, marginBottom: 4 }}>${MOCK_EARNINGS.accrued.toFixed(2)}</div>
                            <div style={{ fontSize: 9, color: '#888', marginBottom: 16 }}>USDC · FeeDistributor.sol · Pull pattern</div>
                            {!showClaimConfirm ? (
                                <button onClick={() => setShowClaimConfirm(true)}
                                    style={{ width: '100%', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '12px', border: '1px solid #4ade80', color: '#0a0a0a', background: '#4ade80', fontWeight: 700 }}>
                                    CLAIM ${MOCK_EARNINGS.accrued.toFixed(2)} USDC
                                </button>
                            ) : (
                                <div>
                                    <div style={{ fontSize: 10, color: '#fbbf24', marginBottom: 10 }}>⚠ CONFIRM CLAIM TRANSACTION</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => { claimFees(); setShowClaimConfirm(false); }} disabled={isClaiming}
                                            style={{ flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', padding: '10px', border: '1px solid #4ade80', color: '#0a0a0a', background: '#4ade80', fontWeight: 700, opacity: isClaiming ? 0.7 : 1 }}>
                                            {isClaiming ? 'CLAIMING...' : 'CONFIRM'}
                                        </button>
                                        <button onClick={() => setShowClaimConfirm(false)}
                                            style={{ flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', padding: '10px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fee structure */}
                        <div style={{ border: '1px solid #2a2a2a', padding: 16, background: '#111' }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>YOUR FEE STRUCTURE</div>
                            {[
                                { l: 'SUBSCRIPTION', v: `$${MOCK_EARNINGS.subFee}/mo per user`, c: '#22d3ee' },
                                { l: 'PERFORMANCE', v: `${MOCK_EARNINGS.perfFee}% high watermark`, c: '#fbbf24' },
                                { l: 'PROTOCOL CUT', v: '0.5% taken by protocol', c: '#888' },
                                { l: 'MONTHLY CAP', v: '10% AUM max', c: '#f87171' },
                            ].map(f => (
                                <div key={f.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #2a2a2a', fontSize: 9 }}>
                                    <span style={{ color: '#444', letterSpacing: '.1em' }}>{f.l}</span>
                                    <span style={{ color: f.c }}>{f.v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Subscriber stats */}
                        <div style={{ border: '1px solid #2a2a2a', padding: 16, background: '#111', marginTop: 16 }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>SUBSCRIBER STATS</div>
                            {[
                                { l: 'ACTIVE', v: '47', c: '#4ade80' },
                                { l: 'NEW (30D)', v: '+12', c: '#22d3ee' },
                                { l: 'CHURNED (30D)', v: '−3', c: '#f87171' },
                                { l: 'AVG AUM/USER', v: '$2,847', c: '#fbbf24' },
                            ].map(s => (
                                <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #2a2a2a', fontSize: 9 }}>
                                    <span style={{ color: '#444', letterSpacing: '.1em' }}>{s.l}</span>
                                    <span style={{ color: s.c, fontWeight: 700 }}>{s.v}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 16, marginTop: 8 }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.12em', lineHeight: 1.6 }}>
                                Fees accumulate in FeeDistributor.sol and are available to claim anytime. Performance fees only accrue on net new profits above the high watermark.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
