import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
            <pre style={{ fontSize: 10, lineHeight: 1.3, color: '#f87171', textAlign: 'center', marginBottom: 24 }}>{`
╔══════════════════════════════════════╗
║  ███████╗██████╗ ██████╗  ██████╗   ║
║  ██╔════╝██╔══██╗██╔══██╗██╔═══██╗  ║
║  █████╗  ██████╔╝██████╔╝██║   ██║  ║
║  ██╔══╝  ██╔══██╗██╔══██╗██║   ██║  ║
║  ███████╗██║  ██║██║  ██║╚██████╔╝  ║
║  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ║
╚══════════════════════════════════════╝`}</pre>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#f87171', letterSpacing: '0.3em' }}>404</div>
            <div style={{ fontSize: 11, color: '#888888', letterSpacing: '0.2em', marginTop: 8 }}>FILE NOT FOUND</div>
            <div style={{ fontSize: 9, color: '#444444', letterSpacing: '0.15em', marginTop: 4 }}>THE REQUESTED RESOURCE DOES NOT EXIST ON THIS NODE</div>
            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                <Link href="/" style={{ border: '1px solid #888888', padding: '6px 16px', fontSize: 10, letterSpacing: '0.15em', color: '#888888', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace" }}>← RETURN HOME</Link>
                <Link href="/dashboard" style={{ border: '1px solid #22d3ee', padding: '6px 16px', fontSize: 10, letterSpacing: '0.15em', color: '#22d3ee', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace" }}>DASHBOARD →</Link>
            </div>
            <div style={{ marginTop: 40, fontSize: 9, color: '#2a2a2a', letterSpacing: '0.1em' }}>PEAKBALANCE v0.1.0 · AVALANCHE C-CHAIN</div>
        </div>
    );
}
