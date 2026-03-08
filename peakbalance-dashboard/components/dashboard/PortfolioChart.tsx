'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';

interface DataPoint { timestamp: number; value: number; }

interface Props { data: DataPoint[]; label?: string; color?: string; height?: number; }

export function PortfolioChart({ data, label = 'PORTFOLIO_VALUE_7D', color = '#22d3ee', height = 120 }: Props) {
    if (data.length < 2) return null;

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const W = 600;

    // Build SVG path
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = height - ((d.value - min) / range) * (height - 20) - 10;
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L${W},${height} L0,${height} Z`;

    // Format axis labels
    const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    const fmtVal = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

    const pnl = values[values.length - 1] - values[0];
    const pnlPct = ((pnl / values[0]) * 100);
    const pnlColor = pnl >= 0 ? '#4ade80' : '#f87171';

    return (
        <div style={{ background: '#161616', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <SectionLabel label={label} />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmtVal(values[values.length - 1])}
                    </span>
                    <span style={{ fontSize: 10, color: pnlColor, fontFamily: "'JetBrains Mono', monospace" }}>
                        {pnl >= 0 ? '+' : ''}{fmtVal(pnl)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                    </span>
                </div>
            </div>

            <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(pct => {
                    const y = height - pct * (height - 20) - 10;
                    return <line key={pct} x1={0} y1={y} x2={W} y2={y} stroke="#1a1a1a" strokeWidth={1} />;
                })}

                {/* Gradient fill */}
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#chartGrad)" />

                {/* Line */}
                <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />

                {/* End dot */}
                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={color} />
            </svg>

            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[0].timestamp)}</span>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[Math.floor(data.length / 2)].timestamp)}</span>
                <span style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(data[data.length - 1].timestamp)}</span>
            </div>
        </div>
    );
}
