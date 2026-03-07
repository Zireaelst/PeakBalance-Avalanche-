'use client';

interface TagProps {
    children: string;
    color?: string;
}

const TAG_COLORS: Record<string, string> = {
    green: '#4ade80',
    red: '#f87171',
    gold: '#fbbf24',
    teal: '#22d3ee',
    dim: '#888888',
};

export function Tag({ children, color = '#888888' }: TagProps) {
    const resolvedColor = TAG_COLORS[color] || color;
    return (
        <span
            style={{
                border: `1px solid ${resolvedColor}`,
                padding: '1px 6px',
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: resolvedColor,
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </span>
    );
}
