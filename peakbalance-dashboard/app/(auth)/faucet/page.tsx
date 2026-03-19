'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Btn } from '@/components/ui/Btn';
import { Divider } from '@/components/ui/Divider';
import { PulseDot } from '@/components/ui/PulseDot';

const DEMO_ADDR = '0x6602...4aDD';

interface FaucetToken {
    symbol: string;
    name: string;
    icon: string;
    amount: string;
    color: string;
    description: string;
    cooldown: string;
}

const FAUCET_TOKENS: FaucetToken[] = [
    { symbol: 'AVAX', name: 'Avalanche', icon: '◆', amount: '2.0', color: '#f87171', description: 'Native gas token for Fuji C-Chain. Used for transactions and deposits.', cooldown: '24h' },
    { symbol: 'USDC', name: 'USD Coin (Mock)', icon: '◎', amount: '100.0', color: '#22d3ee', description: 'Mock USDC for testing. Used for deposits and portfolio allocation.', cooldown: '24h' },
    { symbol: 'WAVAX', name: 'Wrapped AVAX', icon: '◇', amount: '1.0', color: '#fbbf24', description: 'Wrapped AVAX for DEX interactions on Trader Joe.', cooldown: '24h' },
];

const FAUCET_LINKS = [
    { name: 'Avalanche Fuji Faucet', url: 'https://faucet.avax.network/', description: 'Official Avalanche faucet — 2 AVAX per request' },
    { name: 'Chainlink Faucet', url: 'https://faucets.chain.link/fuji', description: 'Chainlink faucet for Fuji testnet AVAX' },
    { name: 'Core Faucet', url: 'https://core.app/tools/testnet-faucet/', description: 'Core wallet\'s integrated Fuji faucet' },
];

interface TxRecord {
    id: string;
    token: string;
    amount: string;
    time: string;
    status: 'CONFIRMED' | 'PENDING';
    hash: string;
}

export default function FaucetPage() {
    const [claimingToken, setClaimingToken] = useState<string | null>(null);
    const [claimed, setClaimed] = useState<Set<string>>(new Set());
    const [txHistory, setTxHistory] = useState<TxRecord[]>([]);

    const handleClaim = (token: FaucetToken) => {
        if (claimed.has(token.symbol)) return;
        setClaimingToken(token.symbol);

        // Simulate claiming
        setTimeout(() => {
            setClaimingToken(null);
            setClaimed(prev => new Set(prev).add(token.symbol));
            setTxHistory(prev => [{
                id: `tx-${Date.now()}`,
                token: token.symbol,
                amount: token.amount,
                time: 'JUST NOW',
                status: 'CONFIRMED',
                hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
            }, ...prev]);
        }, 2000);
    };

    return (
        <div style={{ padding: '20px 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, background: '#4ade80' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace" }}>TESTNET FAUCET</span>
                <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>FUJI C-CHAIN (43113)</span>
            </div>
            <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 16, lineHeight: 1.6, maxWidth: 600 }}>
                Request testnet tokens to interact with PeakBalance on Avalanche Fuji.
                These tokens have no real value and are for testing purposes only.
            </div>

            {/* Network Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                {[
                    { label: 'NETWORK', value: 'FUJI TESTNET', color: '#4ade80' },
                    { label: 'CHAIN ID', value: '43113', color: '#22d3ee' },
                    { label: 'WALLET', value: DEMO_ADDR, color: '#e8e8e8' },
                    { label: 'STATUS', value: 'CONNECTED', color: '#4ade80', dot: true },
                ].map(s => (
                    <div key={s.label} style={{ background: '#0d0d0d', padding: '12px 14px' }}>
                        <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {s.dot && <PulseDot color={s.color} size={6} />}
                            <span style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Divider char="═" />

            {/* Token Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#2a2a2a', marginBottom: 1 }}>
                {FAUCET_TOKENS.map(token => {
                    const isClaiming = claimingToken === token.symbol;
                    const isClaimed = claimed.has(token.symbol);

                    return (
                        <div key={token.symbol} style={{ background: '#0d0d0d', padding: '20px 18px', display: 'flex', flexDirection: 'column' }}>
                            {/* Token info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 36, height: 36,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid ${token.color}40`,
                                    fontSize: 18, color: token.color,
                                }}>
                                    {token.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>{token.symbol}</div>
                                    <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{token.name}</div>
                                </div>
                            </div>

                            {/* Amount */}
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 4 }}>AMOUNT PER REQUEST</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: token.color, fontFamily: "'JetBrains Mono', monospace" }}>
                                    {token.amount} <span style={{ fontSize: 12, color: '#888888' }}>{token.symbol}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, marginBottom: 16, flex: 1 }}>
                                {token.description}
                            </div>

                            {/* Cooldown */}
                            <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>
                                COOLDOWN: {token.cooldown}
                            </div>

                            {/* Claim Button */}
                            {isClaimed ? (
                                <div style={{
                                    border: '1px solid #4ade80', padding: '8px 16px',
                                    textAlign: 'center', fontSize: 10, color: '#4ade80',
                                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.15em',
                                }}>
                                    ✅ CLAIMED
                                </div>
                            ) : isClaiming ? (
                                <div style={{
                                    border: '1px solid #fbbf24', padding: '8px 16px',
                                    textAlign: 'center', fontSize: 10, color: '#fbbf24',
                                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.15em',
                                    animation: 'pulse-dot 1.5s ease-in-out infinite',
                                }}>
                                    ⏳ REQUESTING...
                                </div>
                            ) : (
                                <Btn variant="success" style={{ width: '100%' }} onClick={() => handleClaim(token)}>
                                    REQUEST {token.amount} {token.symbol}
                                </Btn>
                            )}
                        </div>
                    );
                })}
            </div>

            <Divider char="─" />

            {/* Transaction History + External Faucets */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1px', background: '#2a2a2a' }}>
                {/* Transaction History */}
                <div style={{ background: '#0d0d0d', padding: '14px 16px' }}>
                    <SectionLabel label="CLAIM_HISTORY" />
                    {txHistory.length === 0 ? (
                        <div style={{ padding: '30px 0', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>NO CLAIMS YET</div>
                            <div style={{ fontSize: 9, color: '#2a2a2a', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>Request tokens above to get started</div>
                        </div>
                    ) : (
                        <div style={{ marginTop: 10 }}>
                            {txHistory.map(tx => (
                                <div key={tx.id} className="dh" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}>✓</span>
                                        <span style={{ fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                                            +{tx.amount} {tx.token}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}>{tx.time}</span>
                                        <span style={{ fontSize: 9, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>{tx.hash}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* External Faucets */}
                <div style={{ background: '#0d0d0d', padding: '14px 16px' }}>
                    <SectionLabel label="EXTERNAL_FAUCETS" />
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {FAUCET_LINKS.map(link => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dh"
                                style={{
                                    display: 'block',
                                    border: '1px solid #2a2a2a',
                                    padding: '10px 12px',
                                    textDecoration: 'none',
                                    transition: 'border-color 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 10, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{link.name}</span>
                                    <span style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>↗</span>
                                </div>
                                <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{link.description}</div>
                            </a>
                        ))}
                    </div>

                    {/* Info box */}
                    <div style={{ border: '1px solid #fbbf2440', padding: '10px 12px', marginTop: 12 }}>
                        <div style={{ fontSize: 9, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 4 }}>⚠ TESTNET ONLY</div>
                        <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
                            These are Fuji testnet tokens with no real value. For mainnet AVAX, use an exchange or bridge.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
