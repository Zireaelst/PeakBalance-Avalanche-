'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStaking } from '@/hooks/useStaking';

type Step = 'stake' | 'config' | 'constraints' | 'mint' | 'done';

const STEPS: Step[] = ['stake', 'config', 'constraints', 'mint', 'done'];
const STEP_LABELS: Record<Step, string> = {
    stake: '01 · DEPOSIT STAKE',
    config: '02 · AGENT CONFIG',
    constraints: '03 · REVIEW CONSTRAINTS',
    mint: '04 · MINT ERC-8004 NFT',
    done: '05 · SUBMITTED',
};

const STRATEGY_OPTIONS = ['MOMENTUM', 'MEAN_REVERSION', 'DCA', 'VOLATILITY_ARB', 'MULTI_FACTOR', 'YIELD_OPTIMIZER'];

export default function DeployPage() {
    const { deposit, isDepositing } = useStaking();
    const [step, setStep] = useState<Step>('stake');

    // Stake
    const [stakeAmt, setStakeAmt] = useState('10');

    // Config
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [strategy, setStrategy] = useState('MOMENTUM');
    const [subFee, setSubFee] = useState('0');
    const [perfFee, setPerfFee] = useState('0.5');
    const [repoUrl, setRepoUrl] = useState('');

    const stepIndex = STEPS.indexOf(step);
    const canAdvance: Record<Step, boolean> = {
        stake: parseFloat(stakeAmt) >= 10,
        config: name.length >= 3 && description.length >= 20 && repoUrl.startsWith('https://'),
        constraints: true,
        mint: true,
        done: false,
    };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: "'JetBrains Mono',monospace" }}>

            {/* Topbar */}
            <div style={{ borderBottom: '1px solid #2a2a2a', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 16, background: '#111' }}>
                <Link href="/marketplace" style={{ color: '#444', fontSize: 9, letterSpacing: '.12em', textDecoration: 'none' }}>← MARKETPLACE</Link>
                <span style={{ color: '#2a2a2a' }}>›</span>
                <span style={{ color: '#4ade80', fontSize: 9, letterSpacing: '.12em' }}>DEPLOY YOUR AGENT</span>
            </div>

            {/* Step progress */}
            <div style={{ background: '#161616', borderBottom: '1px solid #2a2a2a', padding: '0 32px' }}>
                <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex' }}>
                    {STEPS.filter(s => s !== 'done').map((s, i) => {
                        const si = STEPS.indexOf(s);
                        const active = stepIndex === si;
                        const done = stepIndex > si;
                        return (
                            <div key={s} style={{ flex: 1, padding: '14px 0', borderBottom: `2px solid ${done ? '#4ade80' : active ? '#22d3ee' : '#2a2a2a'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 18, height: 18, border: `1px solid ${done ? '#4ade80' : active ? '#22d3ee' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: done ? '#4ade80' : active ? '#22d3ee' : '#444', background: done ? '#4ade8022' : 'transparent', flexShrink: 0 }}>
                                    {done ? '✓' : `0${i + 1}`}
                                </div>
                                <span style={{ fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: done ? '#4ade80' : active ? '#22d3ee' : '#444' }}>
                                    {STEP_LABELS[s].split('·')[1].trim()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Body */}
            <div style={{ maxWidth: 960, margin: '48px auto', padding: '0 32px' }}>

                {step === 'stake' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
                        <div>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 8 }}>STEP 01 / 04</div>
                            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, lineHeight: 1.1 }}>
                                Deposit <span style={{ color: '#fbbf24' }}>skin-in-the-game</span> stake
                            </h2>
                            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, marginBottom: 28 }}>
                                To list your agent on the marketplace, you must deposit a minimum of 10 AVAX into the StakingVault contract. This stake is at risk — it can be slashed by the protocol in the event of misuse, constraint violations, or poor agent behavior.
                            </p>

                            <div style={{ border: '1px solid #2a2a2a', padding: 24, background: '#111', marginBottom: 24 }}>
                                <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>STAKE DEPOSIT</div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: 9, color: '#888', letterSpacing: '.12em', display: 'block', marginBottom: 6 }}>AMOUNT (AVAX)</label>
                                        <input type="number" min={10} value={stakeAmt} onChange={e => setStakeAmt(e.target.value)}
                                            style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${parseFloat(stakeAmt) >= 10 ? '#4ade80' : '#f87171'}`, color: '#e8e8e8', fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                    <span style={{ fontSize: 9, color: '#888', paddingBottom: 12 }}>AVAX</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {['10', '25', '50', '100'].map(preset => (
                                        <button key={preset} onClick={() => setStakeAmt(preset)}
                                            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: '5px 12px', border: `1px solid ${stakeAmt === preset ? '#22d3ee' : '#2a2a2a'}`, color: stakeAmt === preset ? '#22d3ee' : '#888', background: 'transparent', letterSpacing: '.1em' }}>
                                            {preset} AVAX
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {[
                                { icon: '⚠', c: '#f87171', title: 'SLASH CONDITIONS', body: 'Oracle failure: −10%. Constraint violation: −25%. Subscriber loss report: −25%. Unauthorized withdrawal attempt: −50% (max 50% per slash event).' },
                                { icon: '⏳', c: '#fbbf24', title: 'COOLDOWN ON WITHDRAWAL', body: 'There is a 7-day cooldown after withdrawal request. You cannot withdraw while you have active subscribers.' },
                            ].map(w => (
                                <div key={w.title} style={{ border: `1px solid ${w.c}44`, padding: '12px 16px', background: `${w.c}08`, marginBottom: 8, display: 'flex', gap: 10 }}>
                                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>{w.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: w.c, letterSpacing: '.08em', marginBottom: 3 }}>{w.title}</div>
                                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#888', lineHeight: 1.5 }}>{w.body}</p>
                                    </div>
                                </div>
                            ))}

                            <button onClick={() => deposit(parseFloat(stakeAmt))} disabled={!canAdvance.stake || isDepositing}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '14px 28px', border: `1px solid ${canAdvance.stake ? '#4ade80' : '#2a2a2a'}`, color: canAdvance.stake ? '#0a0a0a' : '#444', background: canAdvance.stake ? '#4ade80' : 'transparent', marginTop: 20, fontWeight: 700, opacity: isDepositing ? 0.7 : 1 }}>
                                {isDepositing ? 'DEPOSITING...' : `DEPOSIT ${stakeAmt} AVAX →`}
                            </button>
                            <button onClick={() => setStep('config')} disabled={!canAdvance.stake}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '14px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent', marginTop: 8, marginLeft: 8 }}>
                                CONTINUE WITHOUT DEPOSITING (DEMO)
                            </button>
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ border: '1px solid #2a2a2a', padding: 20, background: '#111' }}>
                                <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12 }}>STAKE SUMMARY</div>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#fbbf24', marginBottom: 4 }}>{stakeAmt} AVAX</div>
                                <div style={{ fontSize: 9, color: '#888' }}>≈ ${(parseFloat(stakeAmt || '0') * 28.4).toFixed(0)} USD at $28.40/AVAX</div>
                                <div style={{ height: 1, background: '#2a2a2a', margin: '12px 0' }} />
                                <div style={{ fontSize: 9, color: '#888', lineHeight: 1.6 }}>
                                    Minimum: <span style={{ color: '#e8e8e8' }}>10 AVAX</span><br />
                                    Lock-up: <span style={{ color: '#e8e8e8' }}>Until de-listed</span><br />
                                    Cooldown: <span style={{ color: '#e8e8e8' }}>7 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'config' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
                        <div>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 8 }}>STEP 02 / 04</div>
                            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 24, lineHeight: 1.1 }}>
                                Configure your <span style={{ color: '#22d3ee' }}>agent listing</span>
                            </h2>

                            {[
                                { label: 'AGENT NAME', help: 'Public display name. 3–40 chars.', node: <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Apex Momentum V2" style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${name.length >= 3 ? '#4ade80' : '#2a2a2a'}`, color: '#e8e8e8', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} /> },
                                { label: 'STRATEGY DESCRIPTION', help: 'Public description. Min 20 characters.', narrow: false, node: <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your agent's rebalancing strategy, edge, and risk management approach..." rows={4} style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${description.length >= 20 ? '#4ade80' : '#2a2a2a'}`, color: '#e8e8e8', fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, padding: '10px 14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.55 }} /> },
                            ].map(f => (
                                <div key={f.label} style={{ marginBottom: 20 }}>
                                    <label style={{ fontSize: 9, color: '#888', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label} <span style={{ color: '#444', marginLeft: 4 }}>{f.help}</span></label>
                                    {f.node}
                                </div>
                            ))}

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 9, color: '#888', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>STRATEGY TYPE</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {STRATEGY_OPTIONS.map(s => (
                                        <button key={s} onClick={() => setStrategy(s)}
                                            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: '6px 12px', border: `1px solid ${strategy === s ? '#22d3ee' : '#2a2a2a'}`, color: strategy === s ? '#22d3ee' : '#888', background: strategy === s ? '#0a2d33' : 'transparent', letterSpacing: '.1em' }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={{ fontSize: 9, color: '#888', letterSpacing: '.12em', display: 'block', marginBottom: 6 }}>MONTHLY SUB FEE (USD) <span style={{ color: '#444' }}>· 0 = FREE</span></label>
                                    <input type="number" min={0} max={100} value={subFee} onChange={e => setSubFee(e.target.value)}
                                        style={{ width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 9, color: '#888', letterSpacing: '.12em', display: 'block', marginBottom: 6 }}>PERFORMANCE FEE (%) <span style={{ color: '#444' }}>· max 5.00%</span></label>
                                    <input type="number" min={0} max={5} step={0.1} value={perfFee} onChange={e => setPerfFee(Math.min(5, parseFloat(e.target.value) || 0).toString())}
                                        style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${parseFloat(perfFee) > 5 ? '#f87171' : '#2a2a2a'}`, color: '#e8e8e8', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 28 }}>
                                <label style={{ fontSize: 9, color: '#888', letterSpacing: '.12em', display: 'block', marginBottom: 6 }}>GITHUB / SNOWTRACE URL <span style={{ color: '#444' }}>· must start with https://</span></label>
                                <input type="url" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="https://github.com/youraccount/your-agent"
                                    style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${repoUrl.startsWith('https://') ? '#4ade80' : '#2a2a2a'}`, color: '#e8e8e8', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => setStep('stake')}
                                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                                    ← BACK
                                </button>
                                <button onClick={() => setStep('constraints')} disabled={!canAdvance.config}
                                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '12px 24px', border: `1px solid ${canAdvance.config ? '#22d3ee' : '#2a2a2a'}`, color: canAdvance.config ? '#0a0a0a' : '#444', background: canAdvance.config ? '#22d3ee' : 'transparent', fontWeight: 700 }}>
                                    CONTINUE →
                                </button>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #2a2a2a', padding: 20, background: '#111', alignSelf: 'start' }}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #2a2a2a' }}>CONFIG PREVIEW</div>
                            {[
                                { l: 'NAME', v: name || '—' },
                                { l: 'STRATEGY', v: strategy },
                                { l: 'SUB FEE', v: parseFloat(subFee) > 0 ? `$${subFee}/mo` : 'FREE' },
                                { l: 'PERF FEE', v: `${perfFee}%` },
                                { l: 'REPO', v: repoUrl ? '✓ LINKED' : '—' },
                            ].map(r => (
                                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #2a2a2a', fontSize: 9 }}>
                                    <span style={{ color: '#444' }}>{r.l}</span>
                                    <span style={{ color: '#e8e8e8' }}>{r.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'constraints' && (
                    <div>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 8 }}>STEP 03 / 04</div>
                        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, lineHeight: 1.1 }}>
                            Review <span style={{ color: '#a78bfa' }}>mandatory constraints</span>
                        </h2>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, maxWidth: 680, marginBottom: 28 }}>
                            These constraints are hard-coded in ConstraintEngine.sol and cannot be changed by the agent owner or the user. Your agent must call the engine before every trade.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1, background: '#2a2a2a', marginBottom: 28 }}>
                            {[
                                { icon: '⚡', c: '#22d3ee', name: 'MAX_TRADE_SIZE', val: '5% per trade', body: 'No single rebalance can exceed 5% of vault value. Prevents large slippage and sudden exposure changes.' },
                                { icon: '📊', c: '#4ade80', name: 'MAX_DAILY_TRADES', val: '10 trades/24h', body: 'Maximum 10 trade executions per 24-hour window. Resets based on block timestamp.' },
                                { icon: '🛡', c: '#fbbf24', name: 'STOP_LOSS_TRIGGER', val: '−10% from peak', body: 'If vault drops 10% from its peak value, the agent auto-pauses. User must manually resume.' },
                                { icon: '✅', c: '#a78bfa', name: 'TOKEN_WHITELIST', val: 'AVAX · USDC only', body: 'Only tokens in the whitelisted set can be traded. No LP tokens, leveraged positions, or memecoins.' },
                            ].map(c => (
                                <div key={c.name} style={{ background: '#0a0a0a', padding: 20 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <div style={{ width: 32, height: 32, border: `1px solid ${c.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{c.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: c.c, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em' }}>{c.name}</div>
                                            <div style={{ fontSize: 11, color: '#e8e8e8', fontWeight: 700 }}>{c.val}</div>
                                        </div>
                                    </div>
                                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#888', lineHeight: 1.5 }}>{c.body}</p>
                                    <div style={{ marginTop: 8, fontSize: 9, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span>✓</span> CANNOT BE DISABLED
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ border: '1px solid #4ade8044', padding: '12px 16px', background: '#4ade8008', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <span>✓</span>
                            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: '#888' }}>
                                By continuing, you acknowledge that your agent <strong style={{ color: '#e8e8e8' }}>must</strong> call <code style={{ color: '#4ade80', fontSize: 11 }}>ConstraintEngine.checkTrade()</code> before every execution, and violations will result in your stake being slashed.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setStep('config')}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                                ← BACK
                            </button>
                            <button onClick={() => setStep('mint')}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '12px 24px', border: '1px solid #a78bfa', color: '#0a0a0a', background: '#a78bfa', fontWeight: 700 }}>
                                ACCEPT & CONTINUE →
                            </button>
                        </div>
                    </div>
                )}

                {step === 'mint' && (
                    <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 8 }}>STEP 04 / 04</div>
                        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, lineHeight: 1.1 }}>
                            Mint your <span style={{ color: '#4ade80' }}>ERC-8004 NFT</span>
                        </h2>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, marginBottom: 32 }}>
                            AgentRegistry.sol will mint an on-chain identity token for your agent. This is your permanent registry entry — reputation, tier, and trading history are all tied to this NFT and cannot be reset.
                        </p>

                        <div style={{ border: '1px solid #4ade80', padding: 32, background: '#0a0a0a', marginBottom: 24 }}>
                            <div style={{ fontSize: 64, marginBottom: 12 }}>🤖</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#e8e8e8', marginBottom: 4 }}>{name || 'UNNAMED AGENT'}</div>
                            <div style={{ fontSize: 10, color: '#888', marginBottom: 16 }}>{strategy} · Starting tier: <span style={{ color: '#a78bfa' }}>RISING</span></div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 9, color: '#888' }}>
                                <span>ERC-8004 SCORE: <span style={{ color: '#e8e8e8', fontWeight: 700 }}>0</span></span>
                                <span>REPUTATION: <span style={{ color: '#a78bfa', fontWeight: 700 }}>BUILDING</span></span>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #fbbf2444', padding: '10px 16px', background: '#fbbf2408', marginBottom: 24, fontSize: 11, color: '#fbbf24', fontFamily: "'Space Grotesk',sans-serif" }}>
                            ⚠ After minting, your application will be reviewed by the PeakBalance team within 48 hours. You will be notified by wallet signature request once approved.
                        </div>

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button onClick={() => setStep('constraints')}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}>
                                ← BACK
                            </button>
                            <button onClick={() => setStep('done')}
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', padding: '14px 32px', border: '1px solid #4ade80', color: '#0a0a0a', background: '#4ade80', fontWeight: 700 }}>
                                MINT & SUBMIT APPLICATION →
                            </button>
                        </div>
                    </div>
                )}

                {step === 'done' && (
                    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, color: '#4ade80' }}>Application Submitted</h2>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#888', lineHeight: 1.65, marginBottom: 28 }}>
                            Your ERC-8004 token has been minted. The PeakBalance team will review your application within 48 hours. Once approved, your agent will appear in the marketplace as <strong style={{ color: '#a78bfa' }}>RISING</strong> tier.
                        </p>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <Link href="/earnings" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #22d3ee', color: '#22d3ee', textDecoration: 'none' }}>
                                VIEW EARNINGS DASHBOARD
                            </Link>
                            <Link href="/marketplace" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid #2a2a2a', color: '#888', textDecoration: 'none' }}>
                                BACK TO MARKETPLACE
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
