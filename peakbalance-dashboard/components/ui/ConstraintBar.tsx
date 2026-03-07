'use client';

interface ConstraintBarProps {
    label: string;
    current: number;
    max: number;
    unit?: string;
}

export function ConstraintBar({ label, current, max, unit = '' }: ConstraintBarProps) {
    const pct = Math.min((current / max) * 100, 100);
    const fillColor = pct >= 100 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#22d3ee';
    const valueColor = pct >= 100 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#4ade80';

    return (
        <div style={{ marginBottom: 10 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                }}
            >
                <span
                    style={{
                        fontSize: 9,
                        color: '#888888',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {label}
                </span>
                <span
                    style={{
                        fontSize: 10,
                        color: valueColor,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {current}{unit}/{max}{unit}
                </span>
            </div>
            <div style={{ height: 3, background: '#2a2a2a', position: 'relative' }}>
                <div
                    style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: fillColor,
                        transition: 'width 0.3s, background 0.3s',
                    }}
                />
            </div>
        </div>
    );
}
