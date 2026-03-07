'use client';

interface SectionLabelProps {
    label: string;
    variant?: 'comment' | 'bracket' | 'box';
}

export function SectionLabel({ label, variant = 'comment' }: SectionLabelProps) {
    if (variant === 'bracket') {
        return (
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: 12,
                }}
            >
                <span style={{ color: '#444444', fontSize: 9, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>
                    {'[ '}
                </span>
                <span
                    style={{
                        color: '#888888',
                        fontSize: 9,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    {label}
                </span>
                <span style={{ color: '#444444', fontSize: 9, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>
                    {' ]'}
                </span>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #2a2a2a',
                padding: '2px 8px',
                marginBottom: 12,
            }}
        >
            <span style={{ color: '#444444', fontSize: 9, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>
                {'// '}
            </span>
            <span
                style={{
                    color: '#888888',
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                }}
            >
                {label}
            </span>
        </div>
    );
}
