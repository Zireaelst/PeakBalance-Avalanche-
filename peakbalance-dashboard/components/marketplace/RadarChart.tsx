'use client';
import { useEffect, useRef } from 'react';

interface RadarChartProps {
    values: [number, number, number, number, number, number]; // 0-100 each
    color: string;
    size?: number;
}

const AXES = ['RETURN', 'VOLUME', 'WIN%', 'RISK', 'CONSISTENCY', 'SCORE'];

export function RadarChart({ values, color, size = 200 }: RadarChartProps) {
    const cx = size / 2, cy = size / 2, r = size * 0.35;
    const n = 6;

    const getPoint = (axisIndex: number, fraction: number) => {
        const angle = (-Math.PI / 2) + (axisIndex / n) * 2 * Math.PI;
        return { x: cx + r * fraction * Math.cos(angle), y: cy + r * fraction * Math.sin(angle) };
    };

    const gridRings = [0.25, 0.5, 0.75, 1].map(f =>
        Array.from({ length: n }, (_, i) => getPoint(i, f))
    );

    const dataPoints = values.map((v, i) => getPoint(i, v / 100));
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

    return (
        <svg width={size} height={size} style={{ display: 'block' }}>
            {/* Grid rings */}
            {gridRings.map((pts, ri) => (
                <polygon
                    key={ri}
                    points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="1"
                />
            ))}
            {/* Axis lines */}
            {Array.from({ length: n }, (_, i) => {
                const end = getPoint(i, 1);
                return <line key={i} x1={cx} y1={cy} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)} stroke="#2a2a2a" strokeWidth="1" />;
            })}
            {/* Axis labels */}
            {AXES.map((label, i) => {
                const pos = getPoint(i, 1.22);
                return (
                    <text key={i} x={pos.x.toFixed(1)} y={(pos.y + 3).toFixed(1)} textAnchor="middle"
                        fill="#444" fontSize="7" fontFamily="JetBrains Mono,monospace">
                        {label}
                    </text>
                );
            })}
            {/* Data polygon */}
            <path d={dataPath} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />
            {/* Data dots */}
            {dataPoints.map((p, i) => (
                <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={color} />
            ))}
        </svg>
    );
}
