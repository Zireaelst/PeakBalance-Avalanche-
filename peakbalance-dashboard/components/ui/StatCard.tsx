'use client';
import { SectionLabel } from './SectionLabel';
interface Props { label: string; value: string; subValue?: string; color?: string; }
export function StatCard({ label, value, subValue, color = '#e8e8e8' }: Props) {
    return (
        <div className="dither-hover" style={{ background: '#161616', padding: '14px 16px', borderBottom: '1px solid #2a2a2a' }}>
            <SectionLabel label={label} />
            <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>{value}</div>
            {subValue && <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{subValue}</div>}
        </div>
    );
}
