'use client';
const MAP: Record<string, string> = { '═': '═', '─': '─', '━': '━', '·': '·', '░': '░' };
interface Props { char?: string; }
export function Divider({ char = '═' }: Props) {
    const c = MAP[char] ?? '═';
    return <div style={{ width: '100%', padding: '4px 0', color: '#2a2a2a', fontSize: 10, overflow: 'hidden', letterSpacing: '0.1em', userSelect: 'none', fontFamily: "'JetBrains Mono', monospace" }}>{c.repeat(200)}</div>;
}
