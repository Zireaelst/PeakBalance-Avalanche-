'use client';
interface Props { label: string; current: number; max: number; unit?: string; }
export function ConstraintBar({ label, current, max, unit = '' }: Props) {
    const pct = Math.min((current / max) * 100, 100);
    const color = pct < 60 ? '#22d3ee' : pct < 85 ? '#fbbf24' : '#f87171';
    return (
        <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
                <span style={{ fontSize: 9, color, fontFamily: "'JetBrains Mono', monospace" }}>{current}{unit}/{max}{unit}</span>
            </div>
            <div style={{ height: 3, background: '#2a2a2a' }}><div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.5s' }} /></div>
        </div>
    );
}
