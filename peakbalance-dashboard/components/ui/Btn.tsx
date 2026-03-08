'use client';
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default' | 'danger' | 'success'; children: React.ReactNode; }
const COLORS = { default: '#888888', danger: '#f87171', success: '#4ade80' };
export function Btn({ variant = 'default', children, style, ...rest }: Props) {
    const c = COLORS[variant];
    return (
        <button className="dither-hover" style={{ background: 'transparent', border: `1px solid ${c}`, color: c, padding: '6px 16px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.15s', ...style }} {...rest}>{children}</button>
    );
}
