'use client';

interface DividerProps {
    char?: '═' | '─' | '▒' | '·';
}

export function Divider({ char = '═' }: DividerProps) {
    return (
        <div
            style={{
                color: '#444444',
                fontSize: 10,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                letterSpacing: 0,
                userSelect: 'none',
                lineHeight: 1,
            }}
        >
            {char.repeat(300)}
        </div>
    );
}
