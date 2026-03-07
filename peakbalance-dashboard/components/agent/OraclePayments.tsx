'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import type { OraclePayment } from '@/types';

interface OraclePaymentsProps {
    payments: OraclePayment[];
}

function formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

const STATUS_COLORS: Record<string, string> = {
    SUCCESS: '#4ade80',
    FAILED: '#f87171',
    PENDING: '#fbbf24',
};

export function OraclePayments({ payments }: OraclePaymentsProps) {
    return (
        <div style={{ background: '#161616' }}>
            <div style={{ padding: '14px 16px 0 16px' }}>
                <SectionLabel label="X402_PAYMENTS" />
            </div>

            {/* Header */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 140px 80px 80px 1fr 80px',
                    background: '#111111',
                    borderBottom: '1px solid #2a2a2a',
                    padding: '6px 16px',
                    gap: 12,
                }}
            >
                {['TIME', 'TX_HASH', 'AVAX', 'USD', 'ENDPOINT', 'STATUS'].map((col) => (
                    <span
                        key={col}
                        style={{
                            fontSize: 9,
                            color: '#444444',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        {col}
                    </span>
                ))}
            </div>

            {/* Rows */}
            {payments.map((payment) => (
                <div
                    key={payment.id}
                    className="dither-hover"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 140px 80px 80px 1fr 80px',
                        borderBottom: '1px solid #2a2a2a',
                        padding: '7px 16px',
                        gap: 12,
                        alignItems: 'center',
                    }}
                >
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatTime(payment.timestamp)}
                    </span>
                    <span style={{ fontSize: 10, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>
                        {payment.txHash}
                    </span>
                    <span style={{ fontSize: 10, color: '#e8e8e8', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        {payment.amountAVAX.toFixed(5)}
                    </span>
                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>
                        ${payment.amountUSD.toFixed(4)}
                    </span>
                    <span
                        style={{
                            fontSize: 10,
                            color: '#e8e8e8',
                            fontFamily: "'JetBrains Mono', monospace",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {payment.endpoint}
                    </span>
                    <div>
                        <Tag color={STATUS_COLORS[payment.status]}>{payment.status}</Tag>
                    </div>
                </div>
            ))}
        </div>
    );
}
