'use client';

import { SectionLabel } from './SectionLabel';

interface StatCardProps {
    label: string;
    value: string;
    subValue?: string;
    subColor?: string;
    accentColor?: string;
}

export function StatCard({ label, value, subValue, subColor = '#888888', accentColor }: StatCardProps) {
    return (
        <div
            className="dither-hover"
            style={{
                background: '#161616',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minWidth: 0,
            }}
        >
            <SectionLabel label={label} />
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: accentColor || '#e8e8e8',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.02em',
                }}
            >
                {value}
            </div>
            {subValue && (
                <div
                    style={{
                        fontSize: 10,
                        color: subColor,
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.05em',
                    }}
                >
                    {subValue}
                </div>
            )}
        </div>
    );
}
