'use client';

import type { TickerItem } from '@/types';

interface LiveTickerProps {
    items: TickerItem[];
}

export function LiveTicker({ items }: LiveTickerProps) {
    const separator = '   ▓   ';

    const renderItems = () =>
        items.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                    style={{
                        color: '#444444',
                        fontSize: 10,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {item.label}
                </span>
                <span
                    style={{
                        color: item.color || '#e8e8e8',
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {item.value}
                </span>
                {i < items.length - 1 && (
                    <span style={{ color: '#2a2a2a', fontSize: 10, margin: '0 4px' }}>
                        {separator}
                    </span>
                )}
            </span>
        ));

    return (
        <div
            style={{
                height: 32,
                background: '#111111',
                borderBottom: '1px solid #2a2a2a',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <div
                className="animate-ticker"
                style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    paddingLeft: 16,
                }}
            >
                {/* Render twice for seamless loop */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {renderItems()}
                    <span style={{ color: '#2a2a2a', fontSize: 10, margin: '0 12px' }}>{separator}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {renderItems()}
                    <span style={{ color: '#2a2a2a', fontSize: 10, margin: '0 12px' }}>{separator}</span>
                </div>
            </div>
        </div>
    );
}
