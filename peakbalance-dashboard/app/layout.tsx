import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'PeakBalance — Autonomous DeFi Portfolio Manager', description: 'AI-powered portfolio rebalancer on Avalanche C-Chain. 50/50 AVAX/USDC with immutable safety constraints.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" /></head>
            <body style={{ margin: 0, padding: 0, minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>{children}</body>
        </html>
    );
}
