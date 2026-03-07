'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import type { ReputationData } from '@/types';

interface ReputationWidgetProps {
    data: ReputationData;
}

export function ReputationWidget({ data }: ReputationWidgetProps) {
    const pct = (data.score / data.maxScore) * 100;
    const fillColor = data.score >= 800 ? '#4ade80' : data.score >= 500 ? '#fbbf24' : '#f87171';

    // Sparkline SVG
    const sparklineWidth = 200;
    const sparklineHeight = 40;
    const minScore = Math.min(...data.history.map((h) => h.score));
    const maxScore = Math.max(...data.history.map((h) => h.score));
    const range = maxScore - minScore || 1;

    const points = data.history
        .map((h, i) => {
            const x = (i / (data.history.length - 1)) * sparklineWidth;
            const y = sparklineHeight - ((h.score - minScore) / range) * (sparklineHeight - 4) - 2;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div
            className="dither-hover"
            style={{
                background: '#161616',
                padding: '14px 16px',
            }}
        >
            <SectionLabel label="ERC-8004_REPUTATION" />

            {/* Score display */}
            <div style={{ marginBottom: 12 }}>
                <span
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: fillColor,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {data.score}
                </span>
                <span
                    style={{
                        fontSize: 14,
                        color: '#444444',
                        fontFamily: "'JetBrains Mono', monospace",
                        marginLeft: 4,
                    }}
                >
                    / {data.maxScore}
                </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: '#2a2a2a', marginBottom: 12, position: 'relative' }}>
                <div
                    style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: fillColor,
                    }}
                />
            </div>

            {/* Stats row */}
            <div
                style={{
                    display: 'flex',
                    gap: 24,
                    marginBottom: 16,
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                }}
            >
                <span>
                    <span style={{ color: '#888888', letterSpacing: '0.1em' }}>TOTAL TRADES: </span>
                    <span style={{ color: '#e8e8e8', fontWeight: 700 }}>{data.totalTrades}</span>
                </span>
                <span style={{ width: 1, background: '#2a2a2a', alignSelf: 'stretch' }} />
                <span>
                    <span style={{ color: '#888888', letterSpacing: '0.1em' }}>SUCCESS RATE: </span>
                    <span style={{ color: '#4ade80', fontWeight: 700 }}>{data.successRate}%</span>
                </span>
            </div>

            {/* Sparkline */}
            <div>
                <span
                    style={{
                        fontSize: 9,
                        color: '#444444',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontFamily: "'JetBrains Mono', monospace",
                        display: 'block',
                        marginBottom: 6,
                    }}
                >
                    7-DAY TREND
                </span>
                <svg width={sparklineWidth} height={sparklineHeight} viewBox={`0 0 ${sparklineWidth} ${sparklineHeight}`}>
                    <polyline
                        points={points}
                        fill="none"
                        stroke={fillColor}
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                    />
                    {/* End dot */}
                    {data.history.length > 0 && (
                        <circle
                            cx={sparklineWidth}
                            cy={
                                sparklineHeight -
                                ((data.history[data.history.length - 1].score - minScore) / range) * (sparklineHeight - 4) -
                                2
                            }
                            r={2.5}
                            fill={fillColor}
                        />
                    )}
                </svg>
            </div>
        </div>
    );
}
