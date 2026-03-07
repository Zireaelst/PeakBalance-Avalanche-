'use client';

import { useState } from 'react';

interface BtnProps {
    children: React.ReactNode;
    variant?: 'default' | 'danger' | 'success';
    onClick?: () => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

const VARIANT_STYLES = {
    default: {
        border: '#2a2a2a',
        color: '#e8e8e8',
        hoverBg: '#111111',
        hoverBorder: '#3d3d3d',
    },
    danger: {
        border: '#f87171',
        color: '#f87171',
        hoverBg: '#3d1a1a',
        hoverBorder: '#f87171',
    },
    success: {
        border: '#4ade80',
        color: '#4ade80',
        hoverBg: '#1a3d2b',
        hoverBorder: '#4ade80',
    },
};

export function Btn({ children, variant = 'default', onClick, disabled = false, size = 'md' }: BtnProps) {
    const [hovered, setHovered] = useState(false);
    const v = VARIANT_STYLES[variant];

    const padding = size === 'sm' ? '4px 10px' : '6px 14px';
    const fontSize = size === 'sm' ? 9 : 10;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered && !disabled ? v.hoverBg : 'transparent',
                border: `1px solid ${hovered && !disabled ? v.hoverBorder : v.border}`,
                color: disabled ? '#444444' : v.color,
                padding,
                fontSize,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.1s',
                opacity: disabled ? 0.5 : 1,
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </button>
    );
}
