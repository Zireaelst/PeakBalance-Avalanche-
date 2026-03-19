'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';

const NOW = Date.now();
const H = 3600_000;
const DAY = 86400_000;

/* ─── Mock Data ─── */
const TVL_DATA = Array.from({ length: 30 }, (_, i) => ({
    timestamp: NOW - (29 - i) * DAY,
    value: 3200 + Math.sin(i * 0.3) * 400 + i * 60 + (Math.random() - 0.5) * 200,
}));

const PNL_DATA = Array.from({ length: 30 }, (_, i) => ({
    timestamp: NOW - (29 - i) * DAY,
    value: -50 + i * 8 + Math.sin(i * 0.5) * 60 + (Math.random() - 0.5) * 40,
}));

const ALLOCATION_HISTORY = Array.from({ length: 14 }, (_, i) => ({
    timestamp: NOW - (13 - i) * DAY,
    avax: 46 + Math.sin(i * 0.4) * 4 + (Math.random() - 0.5) * 2,
    usdc: 0,
})).map(d => ({ ...d, usdc: 100 - d.avax }));

const DAILY_TRADES = Array.from({ length: 14 }, (_, i) => ({
    timestamp: NOW - (13 - i) * DAY,
    count: Math.floor(Math.random() * 8) + 1,
    volume: Math.floor(Math.random() * 800) + 100,
}));

const PERFORMANCE_METRICS = [
    { label: 'TOTAL VALUE LOCKED', value: '$5,006.84', change: '+12.4%', changeColor: '#4ade80' },
    { label: 'CUMULATIVE PNL', value: '+$627.43', change: '+14.3%', changeColor: '#4ade80' },
    { label: '30D RETURN', value: '+14.2%', change: '+2.1%', changeColor: '#4ade80' },
    { label: 'WIN RATE', value: '96.5%', change: '+0.8%', changeColor: '#4ade80' },
    { label: 'MAX DRAWDOWN', value: '-2.78%', change: 'IMPROVED', changeColor: '#22d3ee' },
    { label: 'SHARPE RATIO', value: '2.41', change: '+0.12', changeColor: '#4ade80' },
];

const ASSET_BREAKDOWN = [
    { token: 'AVAX', balance: '68.42', value: '$2,531.54', pct: 50.56, color: '#f87171' },
    { token: 'USDC', balance: '2,475.30', value: '$2,475.30', pct: 49.44, color: '#22d3ee' },
];

const RECENT_REBALANCES = [
    { timestamp: NOW - 1.2 * H, drift: '6.2%', action: 'SELL 4.8 AVAX → 177.60 USDC', pnl: '+42 bps', color: '#4ade80' },
    { timestamp: NOW - 5 * H, drift: '5.8%', action: 'BUY 3.2 AVAX ← 116.48 USDC', pnl: '-15 bps', color: '#f87171' },
    { timestamp: NOW - 18 * H, drift: '5.3%', action: 'SELL 2.1 AVAX → 75.81 USDC', pnl: '+88 bps', color: '#4ade80' },
    { timestamp: NOW - 36 * H, drift: '7.1%', action: 'BUY 5.71 AVAX ← 200.00 USDC', pnl: '+120 bps', color: '#4ade80' },
    { timestamp: NOW - 48 * H, drift: '5.1%', action: 'SELL 6.5 AVAX → 227.50 USDC', pnl: '-8 bps', color: '#f87171' },
];

/* ─── SVG Chart Component ─── */
function MiniChart({ data, color = '#22d3ee', height = 140, label, showArea = true, showGrid = true }: {
    data: { timestamp: number; value: number }[];
    color?: string; height?: number; label: string; showArea?: boolean; showGrid?: boolean;
}) {
    if (data.length < 2) return null;
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const W = 600;

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * W,
        y: height - ((d.value - min) / range) * (height - 24) - 12,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L${W},${height} L0,${height} Z`;
    const gradId = `grad-${label.replace(/\s/g, '')}`;

    const current = values[values.length - 1];
    const first = values[0];
    const pnl = current - first;
    const pnlPct = (pnl / Math.abs(first)) * 100;
    const pnlColor = pnl >= 0 ? '#4ade80' : '#f87171';

    const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    const fmtVal = (v: number) => v >= 0 ? `$${v.toLocaleString('en-US', { minimumFractionDigits: 0 })}` : `-$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

    return (
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SectionLabel label={label} />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#e8e8e8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmtVal(current)}
                    </span>
                    <span style={{ fontSize: 10, color: pnlColor, fontFamily: "'JetBrains Mono', monospace" }}>
                        {pnl >= 0 ? '+' : ''}{fmtVal(pnl)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
                    </span>
                </div>
            </div>
            <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
                {showGrid && [0.25, 0.5, 0.75].map(pct => {
                    const y = height - pct * (height - 24) - 12;
                    return <line key={pct} x1={0} y1={y} x2={W} y2={y} stroke="#1a1a1a" strokeWidth={1} />;
                })}
                {/* Zero line for PnL */}
                {min < 0 && max > 0 && (() => {
                    const zeroY = height - ((0 - min) / range) * (height - 24) - 12;
                    return <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke="#2a2a2a" strokeWidth={1} strokeDasharray="4,4" />;
                })()}
                {showArea && (
                    <>
                        <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <path d={areaPath} fill={`url(#${gradId})`} />
                    </>
                )}
                <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />
                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={color} />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[0].timestamp)}</span>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[Math.floor(data.length / 2)].timestamp)}</span>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[data.length - 1].timestamp)}</span>
            </div>
        </div>
    );
}

/* ─── Bar Chart ─── */
function BarChart({ data, label, color = '#22d3ee', height = 100 }: {
    data: { timestamp: number; count: number }[];
    label: string; color?: string; height?: number;
}) {
    const maxVal = Math.max(...data.map(d => d.count));
    const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { day: 'numeric' });

    return (
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SectionLabel label={label} />
                <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>
                    AVG: {(data.reduce((s, d) => s + d.count, 0) / data.length).toFixed(1)} / day
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
                {data.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 8, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{d.count}</span>
                        <div className="dh" style={{
                            width: '100%',
                            height: `${(d.count / maxVal) * (height - 24)}px`,
                            background: color,
                            opacity: 0.7,
                            transition: 'opacity 0.15s',
                            minHeight: 2,
                        }} />
                        <span style={{ fontSize: 7, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(d.timestamp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Allocation Stacked Area ─── */
function AllocationChart({ data, height = 100 }: {
    data: { timestamp: number; avax: number; usdc: number }[];
    height?: number;
}) {
    const W = 600;
    const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

    // AVAX area (bottom) + USDC area (top) — stacked to 100%
    const avaxPoints = data.map((d, i) => ({
        x: (i / (data.length - 1)) * W,
        y: height - (d.avax / 100) * (height - 20) - 10,
    }));

    const avaxLine = avaxPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const target50Y = height - (50 / 100) * (height - 20) - 10;

    return (
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SectionLabel label="ALLOCATION_DRIFT_14D" />
                <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 9, color: '#f87171', fontFamily: "'JetBrains Mono', monospace" }}>■ AVAX {data[data.length - 1].avax.toFixed(1)}%</span>
                    <span style={{ fontSize: 9, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>■ USDC {data[data.length - 1].usdc.toFixed(1)}%</span>
                </div>
            </div>
            <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
                {/* Target 50% line */}
                <line x1={0} y1={target50Y} x2={W} y2={target50Y} stroke="#fbbf24" strokeWidth={1} strokeDasharray="6,4" />
                <text x={W - 4} y={target50Y - 4} fill="#fbbf24" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="end">TARGET 50%</text>

                {/* AVAX allocation line */}
                <defs>
                    <linearGradient id="allocGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f87171" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#f87171" stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <path d={`${avaxLine} L${W},${height} L0,${height} Z`} fill="url(#allocGrad)" />
                <path d={avaxLine} fill="none" stroke="#f87171" strokeWidth={1.5} />
                <circle cx={avaxPoints[avaxPoints.length - 1].x} cy={avaxPoints[avaxPoints.length - 1].y} r={3} fill="#f87171" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[0].timestamp)}</span>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[data.length - 1].timestamp)}</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
    const fmtTime = (ts: number) => {
        const diff = NOW - ts;
        if (diff < H) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < DAY) return `${(diff / H).toFixed(1)}h ago`;
        return `${Math.floor(diff / DAY)}d ago`;
    };

    return (
        <div style={{ padding: '20px 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, background: '#22d3ee' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace" }}>PORTFOLIO ANALYTICS</span>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>30-DAY WINDOW</span>
            </div>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                {PERFORMANCE_METRICS.map(m => (
                    <div key={m.label} className="dh" style={{ background: '#0d0d0d', padding: '14px 12px' }}>
                        <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 6 }}>{m.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                        <div style={{ fontSize: 9, color: m.changeColor, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{m.change}</div>
                    </div>
                ))}
            </div>

            <Divider char="═" />

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                <MiniChart data={TVL_DATA} label="TOTAL_VALUE_LOCKED_30D" color="#22d3ee" height={160} />
                <MiniChart data={PNL_DATA} label="CUMULATIVE_PNL_30D" color="#4ade80" height={160} />
            </div>

            <Divider char="─" />

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                <AllocationChart data={ALLOCATION_HISTORY} height={120} />
                <BarChart data={DAILY_TRADES} label="DAILY_TRADE_COUNT_14D" color="#fbbf24" height={120} />
            </div>

            <Divider char="═" />

            {/* Asset Breakdown + Recent Rebalances */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1px', background: '#2a2a2a' }}>
                {/* Asset Breakdown */}
                <div style={{ background: '#111111', padding: '14px 16px' }}>
                    <SectionLabel label="ASSET_BREAKDOWN" />
                    <div style={{ marginTop: 12 }}>
                        {ASSET_BREAKDOWN.map(a => (
                            <div key={a.token} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ width: 8, height: 8, background: a.color, display: 'inline-block' }} />
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>{a.token}</span>
                                    </div>
                                    <span style={{ fontSize: 11, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{a.value}</span>
                                </div>
                                <div style={{ height: 4, background: '#2a2a2a' }}>
                                    <div style={{ height: '100%', width: `${a.pct}%`, background: a.color, transition: 'width 0.3s' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{a.balance} {a.token}</span>
                                    <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{a.pct.toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                        {/* Drift indicator */}
                        <div style={{ border: '1px solid #2a2a2a', padding: '8px 10px', marginTop: 8 }}>
                            <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>CURRENT DRIFT</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                                <span style={{ fontSize: 20, fontWeight: 700, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}>0.56%</span>
                                <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>/ 5% max</span>
                            </div>
                            <div style={{ height: 3, background: '#2a2a2a', marginTop: 6 }}>
                                <div style={{ height: '100%', width: '11.2%', background: '#4ade80' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Rebalances */}
                <div style={{ background: '#111111', padding: '14px 16px' }}>
                    <SectionLabel label="RECENT_REBALANCES" />
                    <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr 80px', gap: 0, marginBottom: 6 }}>
                            {['TIME', 'DRIFT', 'ACTION', 'PNL'].map(h => (
                                <span key={h} style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', padding: '4px 0', borderBottom: '1px solid #2a2a2a' }}>{h}</span>
                            ))}
                        </div>
                        {RECENT_REBALANCES.map((r, i) => (
                            <div key={i} className="dh" style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr 80px', gap: 0, padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                                <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{fmtTime(r.timestamp)}</span>
                                <span style={{ fontSize: 10, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace" }}>{r.drift}</span>
                                <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>{r.action}</span>
                                <span style={{ fontSize: 10, color: r.color, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right' }}>{r.pnl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
