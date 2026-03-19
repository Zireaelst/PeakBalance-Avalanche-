'use client';

import Link from 'next/link';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0a' }}>
            {/* Docs-specific header */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 24px', height: 48,
                background: '#0a0a0a', borderBottom: '1px solid #2a2a2a',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>PEAK</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>BALANCE</span>
                    </Link>
                    <span style={{ color: '#2a2a2a', fontSize: 14 }}>│</span>
                    <span style={{ fontSize: 11, color: '#888888', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>DOCUMENTATION</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>v0.1.0-fuji</span>
                    <Link
                        href="/dashboard"
                        className="dh"
                        style={{
                            textDecoration: 'none', border: '1px solid #2a2a2a',
                            padding: '4px 14px', fontSize: 9, letterSpacing: '0.12em',
                            fontFamily: "'JetBrains Mono', monospace", color: '#888888',
                            transition: 'all 0.15s',
                        }}
                    >
                        ← BACK TO DASHBOARD
                    </Link>
                </div>
            </header>
            {/* Content */}
            <div style={{ flex: 1, display: 'flex' }}>
                {children}
            </div>
        </div>
    );
}
