'use client';
interface Props { children: React.ReactNode; color?: string; }
export function Tag({ children, color = '#888888' }: Props) {
    return <span style={{ border: `1px solid ${color}`, padding: '1px 6px', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>{children}</span>;
}
