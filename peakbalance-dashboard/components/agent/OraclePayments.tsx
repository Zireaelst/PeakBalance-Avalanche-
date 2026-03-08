'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import type { OraclePayment } from '@/types';
interface Props { payments: OraclePayment[]; }
function fmt(ts: number) { return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); }
const SC: Record<string, string> = { SUCCESS: '#4ade80', FAILED: '#f87171', PENDING: '#fbbf24' };
export function OraclePayments({ payments }: Props) {
    return (
        <div style={{ background: '#161616' }}>
            <div style={{ padding: '14px 16px 0 16px' }}><SectionLabel label="X402_PAYMENTS" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 180px 80px 70px 1fr 80px', background: '#111111', borderBottom: '1px solid #2a2a2a', padding: '6px 16px', gap: 12, marginTop: 8 }}>
                {['TIME', 'TX_HASH', 'AVAX', 'USD', 'ENDPOINT', 'STATUS'].map(h => <span key={h} style={{ fontSize: 9, color: '#444444', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>{h}</span>)}
            </div>
            {payments.map(p => (
                <div key={p.id} className="dither-hover" style={{ display: 'grid', gridTemplateColumns: '80px 180px 80px 70px 1fr 80px', borderBottom: '1px solid #2a2a2a', padding: '7px 16px', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(p.timestamp)}</span>
                    <span style={{ fontSize: 10, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>{p.txHash}</span>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{p.amountAVAX.toFixed(5)}</span>
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>${p.amountUSD.toFixed(4)}</span>
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{p.endpoint}</span>
                    <div style={{ textAlign: 'right' }}><Tag color={SC[p.status]}>{p.status}</Tag></div>
                </div>
            ))}
        </div>
    );
}
