'use client';
import type { TickerItem } from '@/types';
interface Props { items: TickerItem[]; }
export function LiveTicker({ items }: Props) {
    const renderItem = (item: TickerItem, i: number) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 16px', whiteSpace: 'nowrap', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: '#444444', letterSpacing: '0.1em' }}>■</span>
            <span style={{ color: '#888888', letterSpacing: '0.1em' }}>{item.label}</span>
            <span style={{ color: item.color || '#e8e8e8', fontWeight: 700 }}>{item.value}</span>
        </span>
    );
    return (
        <div style={{ overflow: 'hidden', background: '#111111', borderBottom: '1px solid #2a2a2a', height: 28, display: 'flex', alignItems: 'center' }}>
            <div className="animate-ticker" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                {items.map((item, i) => renderItem(item, i))}
                {items.map((item, i) => renderItem(item, i + items.length))}
            </div>
        </div>
    );
}
