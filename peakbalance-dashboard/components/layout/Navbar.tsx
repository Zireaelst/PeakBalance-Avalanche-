'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PulseDot } from '@/components/ui/PulseDot';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/agent', label: 'AGENT' },
    { href: '/trades', label: 'TRADES' },
    { href: '/settings', label: 'SETTINGS' },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                height: 44,
                background: '#111111',
                borderBottom: '1px solid #2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
            }}
        >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#e8e8e8',
                        letterSpacing: '0.15em',
                        fontFamily: "'JetBrains Mono', monospace",
                        textTransform: 'uppercase',
                    }}
                >
                    PEAK<span style={{ color: '#22d3ee' }}>BALANCE</span>
                </span>
                <span style={{ width: 1, height: 20, background: '#2a2a2a' }} />
                <span
                    style={{
                        fontSize: 9,
                        color: '#444444',
                        letterSpacing: '0.1em',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    v0.1.0-fuji
                </span>
            </div>

            {/* Nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                fontSize: 10,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                fontFamily: "'JetBrains Mono', monospace",
                                color: isActive ? '#e8e8e8' : '#888888',
                                padding: '0 16px',
                                height: 44,
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: isActive ? '1px solid #22d3ee' : '1px solid transparent',
                                textDecoration: 'none',
                                transition: 'color 0.1s',
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <PulseDot color="#4ade80" size={6} />
                <span
                    style={{
                        fontSize: 9,
                        color: '#888888',
                        letterSpacing: '0.1em',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    C-CHAIN
                </span>
                <div
                    style={{
                        border: '1px solid #2a2a2a',
                        padding: '4px 10px',
                        fontSize: 9,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#888888',
                    }}
                >
                    CONNECT WALLET
                </div>
            </div>
        </nav>
    );
}
