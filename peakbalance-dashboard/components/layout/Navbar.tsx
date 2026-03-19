'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PulseDot } from '@/components/ui/PulseDot';

const PRIMARY_TABS = [
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/agent', label: 'AGENT' },
    { href: '/trades', label: 'TRADES' },
    { href: '/marketplace', label: 'MARKETPLACE' },
    { href: '/analytics', label: 'ANALYTICS' },
    { href: '/earnings', label: 'EARNINGS' },
    { href: '/settings', label: 'SETTINGS' },
];

const MORE_TABS = [
    { href: '/activity', label: 'ACTIVITY', icon: '⇄' },
    { href: '/leaderboard', label: 'LEADERBOARD', icon: '★' },
    { href: '/faucet', label: 'FAUCET', icon: '◎' },
];

const DEMO_ADDR = '0x6602...4aDD';

export function Navbar() {
    const path = usePathname();
    const [moreOpen, setMoreOpen] = useState(false);

    // Check if a MORE tab is the active one
    const moreActive = MORE_TABS.some(t => path === t.href);

    return (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 44, background: '#0a0a0a', borderBottom: '1px solid #2a2a2a' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>PEAK</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>BALANCE</span>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", marginLeft: 4 }}>v0.1.0-fuji</span>
            </Link>
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {PRIMARY_TABS.map(t => (
                    <Link key={t.href} href={t.href} style={{ textDecoration: 'none', padding: '6px 10px', fontSize: 10, letterSpacing: '0.12em', color: path === t.href ? '#e8e8e8' : '#444444', borderBottom: path === t.href ? '2px solid #22d3ee' : '2px solid transparent', fontFamily: "'JetBrains Mono', monospace", fontWeight: path === t.href ? 700 : 400 }}>{t.label}</Link>
                ))}
                {/* MORE dropdown */}
                <div
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setMoreOpen(true)}
                    onMouseLeave={() => setMoreOpen(false)}
                >
                    <button
                        style={{
                            background: 'none', border: 'none', padding: '6px 10px', fontSize: 10,
                            letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace",
                            color: moreActive ? '#e8e8e8' : '#444444',
                            fontWeight: moreActive ? 700 : 400,
                            borderBottom: moreActive ? '2px solid #22d3ee' : '2px solid transparent',
                            display: 'flex', alignItems: 'center', gap: 4,
                        }}
                    >
                        MORE <span style={{ fontSize: 7 }}>▾</span>
                    </button>
                    {moreOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0,
                            background: '#111111', border: '1px solid #2a2a2a',
                            minWidth: 160, zIndex: 100, padding: '4px 0',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        }}>
                            {MORE_TABS.map(t => (
                                <Link
                                    key={t.href}
                                    href={t.href}
                                    onClick={() => setMoreOpen(false)}
                                    className="dh"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 14px', textDecoration: 'none',
                                        fontSize: 10, letterSpacing: '0.1em',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        color: path === t.href ? '#22d3ee' : '#888888',
                                        fontWeight: path === t.href ? 700 : 400,
                                        background: path === t.href ? '#161616' : 'transparent',
                                    }}
                                >
                                    <span style={{ fontSize: 11, width: 16, textAlign: 'center', color: path === t.href ? '#22d3ee' : '#444444' }}>{t.icon}</span>
                                    {t.label}
                                </Link>
                            ))}
                            <div style={{ height: 1, background: '#2a2a2a', margin: '4px 0' }} />
                            <Link
                                href="/docs"
                                className="dh"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 14px', textDecoration: 'none',
                                    fontSize: 10, letterSpacing: '0.1em',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    color: '#22d3ee',
                                }}
                            >
                                <span style={{ fontSize: 11, width: 16, textAlign: 'center' }}>📖</span>
                                DOCS ↗
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PulseDot color="#4ade80" size={6} />
                <span style={{ fontSize: 9, color: '#4ade80', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace" }}>Fuji C-Chain</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #4ade80', padding: '4px 12px' }}>
                    <span style={{ width: 6, height: 6, background: '#4ade80', display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: '#4ade80', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{DEMO_ADDR}</span>
                </div>
            </div>
        </nav>
    );
}
