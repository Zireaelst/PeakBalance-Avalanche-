'use client';
import Link from 'next/link';
import { Btn } from '@/components/ui/Btn';
import { PulseDot } from '@/components/ui/PulseDot';
import { Divider } from '@/components/ui/Divider';
const FEATURES = [
    { prefix: '01', text: 'AUTONOMOUS 50/50 AVAX/USDC REBALANCING', status: 'ACTIVE' },
    { prefix: '02', text: 'IMMUTABLE CONSTRAINT ENGINE — NO ADMIN OVERRIDE', status: 'DEPLOYED' },
    { prefix: '03', text: 'X402 MICROPAYMENTS FOR ORACLE DATA (~$0.01/QUERY)', status: 'ACTIVE' },
    { prefix: '04', text: 'ERC-8004 ON-CHAIN IDENTITY NFT WITH REPUTATION', status: 'MINTED' },
    { prefix: '05', text: 'TRADER JOE V2.1 LIQUIDITY BOOK INTEGRATION', status: 'VERIFIED' },
    { prefix: '06', text: 'CHAINLINK + PYTH DUAL ORACLE PRICE FEEDS', status: 'ACTIVE' },
    { prefix: '07', text: 'STOP-LOSS AT 10% DRAWDOWN — AUTO-EXIT ALL', status: 'ARMED' },
    { prefix: '08', text: 'MAX 5% TRADE SIZE — MAX 10 TRADES/DAY', status: 'ENFORCED' },
];
export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <pre style={{ fontSize: 8, lineHeight: 1.2, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', marginBottom: 24 }}>{`
╔═══════════════════════════════════════════╗
║  ██████╗ ███████╗ █████╗ ██╗  ██╗        ║
║  ██╔══██╗██╔════╝██╔══██╗██║ ██╔╝        ║
║  ██████╔╝█████╗  ███████║█████╔╝         ║
║  ██╔═══╝ ██╔══╝  ██╔══██║██╔═██╗        ║
║  ██║     ███████╗██║  ██║██║  ██╗        ║
║  ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝        ║
║  ██████╗  █████╗ ██╗      █████╗ ███╗   ██╗ ██████╗███████╗ ║
║  ██╔══██╗██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝██╔════╝ ║
║  ██████╔╝███████║██║     ███████║██╔██╗ ██║██║     █████╗   ║
║  ██╔══██╗██╔══██║██║     ██╔══██║██║╚██╗██║██║     ██╔══╝   ║
║  ██████╔╝██║  ██║███████╗██║  ██║██║ ╚████║╚██████╗███████╗ ║
║  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝ ║
╚═══════════════════════════════════════════╝`}</pre>
            <div style={{ fontSize: 11, color: '#888888', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', textAlign: 'center', marginBottom: 8 }}>AUTONOMOUS DEFI PORTFOLIO MANAGER</div>
            <div style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', textAlign: 'center', marginBottom: 32 }}>RUNNING ON AVALANCHE C-CHAIN · POWERED BY CLAUDE SONNET · CONSTRAINED BY IMMUTABLE CODE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                <PulseDot color="#4ade80" size={6} />
                <span style={{ fontSize: 9, color: '#4ade80', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>SYSTEM OPERATIONAL</span>
                <span style={{ width: 1, height: 12, background: '#2a2a2a' }} />
                <span style={{ fontSize: 9, color: '#888888', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace" }}>FUJI TESTNET</span>
            </div>
            <Link href="/dashboard" style={{ textDecoration: 'none', marginBottom: 40 }}><Btn variant="success">▶ CONNECT WALLET & ENTER DASHBOARD</Btn></Link>
            <Divider char="═" />
            <div style={{ maxWidth: 700, width: '100%', marginTop: 24 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #2a2a2a', padding: '2px 8px', marginBottom: 16 }}>
                    <span style={{ color: '#444444', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>{'// '}</span>
                    <span style={{ color: '#888888', fontSize: 9, letterSpacing: '0.25em', fontFamily: "'JetBrains Mono', monospace" }}>SYSTEM_CAPABILITIES</span>
                </div>
                {FEATURES.map(f => (
                    <div key={f.prefix} className="dither-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderBottom: '1px solid #2a2a2a' }}>
                        <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, minWidth: 20 }}>{f.prefix}</span>
                        <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", flex: 1 }}>{f.text}</span>
                        <span style={{ border: '1px solid #4ade80', padding: '1px 6px', fontSize: 8, letterSpacing: '0.15em', color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}>{f.status}</span>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 40, fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', textAlign: 'center', lineHeight: 2 }}>PEAKBALANCE v0.1.0 · AVALANCHE FUJI TESTNET · MIT LICENSE<br />SAFETY FIRST: IMMUTABLE CONSTRAINTS · NO ADMIN KEYS · USER-ONLY WITHDRAWALS</div>
        </div>
    );
}
