'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PulseDot } from '@/components/ui/PulseDot';
const TABS = [{ href: '/dashboard', label: 'DASHBOARD' }, { href: '/agent', label: 'AGENT' }, { href: '/trades', label: 'TRADES' }, { href: '/marketplace', label: 'MARKETPLACE' }, { href: '/earnings', label: 'EARNINGS' }, { href: '/settings', label: 'SETTINGS' }];
const DEMO_ADDR = '0x6602...4aDD';
export function Navbar() {
    const path = usePathname();
    return (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 44, background: '#0a0a0a', borderBottom: '1px solid #2a2a2a' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>PEAK</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>BALANCE</span>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", marginLeft: 4 }}>v0.1.0-fuji</span>
            </Link>
            <div style={{ display: 'flex', gap: 4 }}>
                {TABS.map(t => (
                    <Link key={t.href} href={t.href} style={{ textDecoration: 'none', padding: '6px 12px', fontSize: 10, letterSpacing: '0.15em', color: path === t.href ? '#e8e8e8' : '#444444', borderBottom: path === t.href ? '2px solid #22d3ee' : '2px solid transparent', fontFamily: "'JetBrains Mono', monospace", fontWeight: path === t.href ? 700 : 400 }}>{t.label}</Link>
                ))}
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
