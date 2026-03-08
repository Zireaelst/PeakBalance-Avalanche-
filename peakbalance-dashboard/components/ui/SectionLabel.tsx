'use client';
interface Props { label: string; variant?: 'comment' | 'bracket' | 'box'; }
export function SectionLabel({ label, variant = 'comment' }: Props) {
    const text = variant === 'comment' ? `// ${label}` : variant === 'bracket' ? `[ ${label} ]` : `┌ ${label} ┐`;
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #2a2a2a', padding: '2px 8px' }}>
            {variant === 'comment' && <span style={{ color: '#444444', fontSize: 9, letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>{'// '}</span>}
            <span style={{ color: '#888888', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        </div>
    );
}
