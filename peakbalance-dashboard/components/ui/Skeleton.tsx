'use client';

interface Props { lines?: number; style?: React.CSSProperties; }

export function Skeleton({ lines = 3, style }: Props) {
    return (
        <div style={{ padding: '14px 16px', ...style }}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        height: i === 0 ? 20 : 12,
                        background: '#2a2a2a',
                        marginBottom: 8,
                        width: i === 0 ? '40%' : i === lines - 1 ? '60%' : '85%',
                        animation: 'pulse-dot 1.5s ease-in-out infinite',
                        animationDelay: `${i * 0.15}s`,
                    }}
                />
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div style={{ background: '#161616', padding: '14px 16px', borderBottom: '1px solid #2a2a2a' }}>
            <div style={{ height: 10, width: 80, background: '#2a2a2a', marginBottom: 8, animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
            <div style={{ height: 28, width: 140, background: '#2a2a2a', marginBottom: 4, animation: 'pulse-dot 1.5s ease-in-out infinite', animationDelay: '0.15s' }} />
            <div style={{ height: 10, width: 100, background: '#2a2a2a', animation: 'pulse-dot 1.5s ease-in-out infinite', animationDelay: '0.3s' }} />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', gap: 12, padding: '6px 16px', background: '#111111', borderBottom: '1px solid #2a2a2a' }}>
                {[60, 40, 70, 50, 80, 60].map((w, i) => (
                    <div key={i} style={{ height: 8, width: w, background: '#2a2a2a', animation: 'pulse-dot 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, row) => (
                <div key={row} style={{ display: 'flex', gap: 12, padding: '7px 16px', borderBottom: '1px solid #2a2a2a' }}>
                    {[60, 40, 70, 50, 80, 60].map((w, i) => (
                        <div key={i} style={{ height: 10, width: w, background: '#1a1a1a', animation: 'pulse-dot 1.5s ease-in-out infinite', animationDelay: `${(row + i) * 0.08}s` }} />
                    ))}
                </div>
            ))}
        </div>
    );
}
