'use client';
interface Props { color?: string; size?: number; }
export function PulseDot({ color = '#4ade80', size = 8 }: Props) {
    return <span className="animate-pulse-dot" style={{ display: 'inline-block', width: size, height: size, background: color, flexShrink: 0 }} />;
}
