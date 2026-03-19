'use client';

/* ═══════════════════════════════════════════════════════════════════════
   DocsContent — All documentation sections rendered as styled components
   Matches the brutalist terminal aesthetic of PeakBalance
   ═══════════════════════════════════════════════════════════════════════ */

function SectionHeader({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
    return (
        <div id={id} style={{ scrollMarginTop: 90, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, background: '#22d3ee' }} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace", margin: 0, textTransform: 'uppercase' }}>{title}</h2>
            </div>
            {subtitle && <p style={{ fontSize: 11, color: '#888888', fontFamily: "'JetBrains Mono', monospace", margin: '4px 0 0 18px' }}>{subtitle}</p>}
            <div style={{ height: 1, background: '#2a2a2a', marginTop: 12 }} />
        </div>
    );
}

function Badge({ label, color = '#4ade80' }: { label: string; color?: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 9, color, border: `1px solid ${color}40`, padding: '2px 8px',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em',
        }}>
            <span style={{ width: 4, height: 4, background: color, display: 'inline-block' }} />
            {label}
        </span>
    );
}

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #22d3ee', color: '#22d3ee', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr key={ri} className="dh" style={{ borderBottom: '1px solid #1a1a1a' }}>
                            {row.map((cell, ci) => (
                                <td key={ci} style={{ padding: '8px 12px', color: ci === 0 ? '#e8e8e8' : '#888888', fontWeight: ci === 0 ? 600 : 400 }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CodeBlock({ children }: { children: string }) {
    return (
        <pre style={{
            background: '#111111', border: '1px solid #2a2a2a', padding: '16px 20px',
            fontSize: 10, lineHeight: 1.8, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace",
            overflowX: 'auto', marginBottom: 20, whiteSpace: 'pre',
        }}>
            {children}
        </pre>
    );
}

function InlineCode({ children }: { children: React.ReactNode }) {
    return (
        <code style={{
            background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '1px 6px',
            fontSize: 10, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace",
        }}>
            {children}
        </code>
    );
}

function Paragraph({ children }: { children: React.ReactNode }) {
    return <p style={{ fontSize: 12, lineHeight: 1.8, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{children}</p>;
}

function KeyDecision({ title, decision, rationale }: { title: string; decision: string; rationale: string }) {
    return (
        <div style={{ border: '1px solid #2a2a2a', marginBottom: 12, background: '#0d0d0d' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#22d3ee', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>▸</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{title}</span>
            </div>
            <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>DECISION
                </div>
                <div style={{ fontSize: 11, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", marginBottom: 10, lineHeight: 1.6 }}>{decision}</div>
                <div style={{ fontSize: 10, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>RATIONALE
                </div>
                <div style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>{rationale}</div>
            </div>
        </div>
    );
}

export function DocsContent() {
    return (
        <div style={{ flex: 1, padding: '24px 40px 60px', maxWidth: 920, overflow: 'auto' }}>

            {/* ─── OVERVIEW ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.05s', opacity: 0 }}>
                <SectionHeader id="overview" title="Overview" subtitle="Safety-first autonomous DeFi portfolio management on Avalanche" />
                <Paragraph>
                    <strong style={{ color: '#e8e8e8' }}>PeakBalance</strong> is an AI-powered autonomous portfolio manager deployed on <strong style={{ color: '#e8e8e8' }}>Avalanche C-Chain (Fuji Testnet)</strong>.
                    It maintains a 50/50 AVAX/USDC allocation using an AI agent constrained by immutable on-chain safety rails.
                </Paragraph>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                    {[
                        { label: 'CONTRACTS', value: '9', sub: 'Deployed & Verified' },
                        { label: 'SAFETY RAILS', value: 'IMMUTABLE', sub: 'Cannot be modified' },
                        { label: 'NETWORK', value: 'FUJI', sub: 'Chain ID: 43113' },
                    ].map(s => (
                        <div key={s.label} style={{ border: '1px solid #2a2a2a', padding: '14px 16px', background: '#0d0d0d' }}>
                            <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', marginBottom: 6 }}>{s.label}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                            <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{s.sub}</div>
                        </div>
                    ))}
                </div>
                <Paragraph>
                    The AI agent operates within strict boundaries: <InlineCode>5% max trade size</InlineCode>, <InlineCode>10 daily trades max</InlineCode>,
                    <InlineCode>10% stop-loss</InlineCode>, and <InlineCode>5% drift threshold</InlineCode>. These constraints are baked into the smart contract
                    bytecode at deployment — no admin, no governance, and no upgrade can ever modify them.
                </Paragraph>
            </div>

            {/* ─── TECH STACK ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.15s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="tech-stack" title="Tech Stack" subtitle="Full technology breakdown across blockchain, frontend, and AI layers" />

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>BLOCKCHAIN LAYER
                </div>
                <DocTable
                    headers={['Technology', 'Version', 'Purpose']}
                    rows={[
                        ['Avalanche C-Chain', 'Fuji (43113)', 'EVM L1 with sub-second finality, low gas costs'],
                        ['Solidity', '^0.8.19', 'Smart contract language — 9 contracts (~2,500 lines)'],
                        ['Foundry (Forge)', 'Latest', 'Build, test, deploy, and verify contracts'],
                        ['OpenZeppelin', '—', 'CEI pattern, reentrancy guards, pull-over-push'],
                    ]}
                />

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>FRONTEND LAYER
                </div>
                <DocTable
                    headers={['Technology', 'Version', 'Purpose']}
                    rows={[
                        ['Next.js', '15', 'App Router, SSR, API routes'],
                        ['TypeScript', 'Strict', 'Full type safety'],
                        ['Tailwind CSS', 'v4', 'Terminal-aesthetic theme'],
                        ['Wagmi', '2.19.5', 'React hooks for Ethereum'],
                        ['Viem', '2.31.1', 'Low-level EVM client library'],
                        ['RainbowKit', '2.2.10', 'Wallet connection modal'],
                        ['TanStack Query', '5.74.4', 'Auto-caching, stale-while-revalidate'],
                        ['Zustand', '5.0.5', 'Lightweight global state'],
                        ['Framer Motion', '12.7.4', 'Animations & micro-interactions'],
                    ]}
                />

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>AI AGENT LAYER
                </div>
                <DocTable
                    headers={['Technology', 'Version', 'Purpose']}
                    rows={[
                        ['Python', '3.11+', 'Agent runtime'],
                        ['LangGraph', '0.3.21', 'State machine orchestration'],
                        ['LangChain', '0.3.19', 'LLM integration framework'],
                        ['Claude (Anthropic)', '—', 'AI decision reasoning'],
                        ['Web3.py', '7.6.0', 'On-chain interactions'],
                        ['structlog', '25.1.0', 'Structured JSON logging'],
                        ['APScheduler', '3.11.0', 'Check intervals (300s)'],
                    ]}
                />
            </div>

            {/* ─── ARCHITECTURE ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.25s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="architecture" title="Architecture" subtitle="Three-layer system: User → Blockchain → AI Agent" />

                <CodeBlock>{`┌──────────────────────────────────────────────────────────────────┐
│                         USER LAYER                                │
│                                                                    │
│   Web Browser ◄──► MetaMask Wallet ◄──► Vercel (CDN)              │
│   (Next.js)        (Fuji Testnet)       Hosting                   │
│                                                                    │
│   ────────── Wagmi + RainbowKit + Viem ──────────                 │
│              (Contract Reads / Writes / Events)                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                  AVALANCHE C-CHAIN (FUJI)                         │
│                                                                    │
│   ┌── CORE ───────────────────────────────────────────┐           │
│   │  ConstraintEngine ◄ PeakVault ◄ PeakController    │           │
│   │  (Immutable Rails)  (Custody)    (User Controls)   │           │
│   │  AgentRegistry ◄── OracleConsumer                  │           │
│   │  (ERC-8004 NFT)     (x402 Oracle)                  │           │
│   └───────────────────────────────────────────────────┘           │
│   ┌── MARKETPLACE ────────────────────────────────────┐           │
│   │  ReputationAgg ◄► AgentMarketplace                 │           │
│   │  StakingVault       FeeDistributor                 │           │
│   └───────────────────────────────────────────────────┘           │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                        AI AGENT LAYER                              │
│                                                                    │
│   CHECK_PRICES ──► EVALUATE_DRIFT ──► VALIDATE_CONSTRAINTS        │
│        ▲                                       │                   │
│        │                                       ▼                   │
│     SLEEP ◄──── RECORD_RESULT ◄──── EXECUTE_TRADE                 │
│                                                                    │
│   Web3.py · Claude (Anthropic) · structlog · 300s interval        │
└──────────────────────────────────────────────────────────────────┘`}</CodeBlock>
            </div>

            {/* ─── SMART CONTRACTS ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.35s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="smart-contracts" title="Smart Contracts" subtitle="9 deployed and verified contracts on Fuji testnet" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {[
                        { name: 'ConstraintEngine', role: 'Immutable safety rails', detail: 'All parameters set at deployment — no admin can modify', status: 'DEPLOYED' },
                        { name: 'PeakVault', role: 'User fund custody', detail: 'Agent can only executeTrade() — cannot withdraw funds', status: 'DEPLOYED' },
                        { name: 'AgentRegistry', role: 'ERC-8004 NFT identity', detail: 'On-chain reputation (0–1000), trade history, success rate', status: 'DEPLOYED' },
                        { name: 'PeakController', role: 'User control panel', detail: 'Pause, resume, force check, target allocation', status: 'DEPLOYED' },
                        { name: 'OracleConsumer', role: 'x402 micropayment oracle', detail: '$0.01/query — Chainlink + Pyth fallback', status: 'DEPLOYED' },
                        { name: 'ReputationAggregator', role: 'Weighted scoring', detail: '7-component formula: max 1000 points across 5 tiers', status: 'DEPLOYED' },
                        { name: 'FeeDistributor', role: 'Revenue split', detail: 'Subscription + performance fees, high-watermark, 0.5% protocol', status: 'DEPLOYED' },
                        { name: 'StakingVault', role: 'Agent skin-in-the-game', detail: '10 AVAX min stake, slashable up to 50%, 7-day cooldown', status: 'DEPLOYED' },
                        { name: 'AgentMarketplace', role: 'Listings & subscriptions', detail: 'Application → approval → listing → subscription lifecycle', status: 'DEPLOYED' },
                    ].map(c => (
                        <div key={c.name} className="dh" style={{ display: 'flex', alignItems: 'center', border: '1px solid #2a2a2a', padding: '10px 14px', gap: 16 }}>
                            <div style={{ minWidth: 180 }}>
                                <InlineCode>{c.name}</InlineCode>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{c.role}</div>
                                <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{c.detail}</div>
                            </div>
                            <Badge label={`✅ ${c.status}`} />
                        </div>
                    ))}
                </div>

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>CONTRACT INTERACTION FLOW
                </div>
                <CodeBlock>{`User deposits AVAX/USDC          Agent executes a trade
        │                                │
        ▼                                ▼
   PeakVault.deposit()          PeakVault.executeTrade()
        │                                │
        │                                ▼
        │                   ConstraintEngine.validateTrade()
        │                        │              │
        │                    ✅ PASS         ❌ FAIL
        │                        │              │
        │                        ▼              ▼
        │                  Execute Swap    Revert TX
        │                        │
        │                        ▼
        │               AgentRegistry.recordTrade()
        │                        │
        │                        ▼
        │           ReputationAggregator.updateScore()
        │
        ▼
  User controls via PeakController
  (pause / resume / emergency exit)`}</CodeBlock>
            </div>

            {/* ─── USER JOURNEY ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.45s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="user-journey" title="User Journey" subtitle="Complete lifecycle from discovery to autonomous trading" />

                {[
                    {
                        phase: 'PHASE 1', title: 'Discovery & Connection', steps: [
                            'Visit PeakBalance website',
                            'Read landing page: problem, solution, how it works',
                            'Click "LAUNCH APP" → redirected to /dashboard',
                            'RainbowKit prompts wallet connection (MetaMask / WalletConnect)',
                            'Switch to Avalanche Fuji Testnet (Chain ID: 43113)',
                        ]
                    },
                    {
                        phase: 'PHASE 2', title: 'Dashboard Overview', steps: [
                            'Portfolio value & AVAX/USDC allocation ring loads',
                            'Agent status: active/paused, uptime, linked NFT ID',
                            'Constraint Engine: max trade 5%, daily 3/10, drawdown 1.2%/10%',
                            'Portfolio chart: historical performance',
                            'Decision feed: agent\'s recent actions with reasoning',
                        ]
                    },
                    {
                        phase: 'PHASE 3', title: 'Deposit & Link Agent', steps: [
                            'Deposit AVAX via PeakVault.depositAVAX()',
                            'Or approve USDC → PeakVault.depositUSDC(amount)',
                            'Browse /marketplace → filter by tier, sort by score',
                            'Subscribe to agent → monthly fee → agent authorized',
                            'PeakController.linkAgent(agentNFTId)',
                        ]
                    },
                    {
                        phase: 'PHASE 4', title: 'Autonomous Operation', steps: [
                            'Agent runs LangGraph state machine every 5 minutes',
                            'CHECK_PRICES → EVALUATE_DRIFT → VALIDATE_CONSTRAINTS',
                            'If drift > 5%: EXECUTE_TRADE → RECORD_RESULT → SLEEP',
                            'If drift ≤ 5%: SLEEP (no action needed)',
                            'Every decision logged with reasoning via structlog',
                        ]
                    },
                ].map((p, pi) => (
                    <div key={p.phase} style={{ border: '1px solid #2a2a2a', marginBottom: 12, background: '#0d0d0d' }}>
                        <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 9, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.15em' }}>{p.phase}</span>
                            <span style={{ fontSize: 11, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{p.title}</span>
                        </div>
                        <div style={{ padding: '10px 14px' }}>
                            {p.steps.map((step, si) => (
                                <div key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontSize: 9, color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", minWidth: 20, textAlign: 'right' }}>{String(si + 1).padStart(2, '0')}</span>
                                    <span style={{ fontSize: 10, color: '#888888', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── SAFETY & CONSTRAINTS ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.55s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="safety" title="Safety & Constraints" subtitle="Key architectural decisions that make PeakBalance trustless" />

                <KeyDecision
                    title="Immutable Constraint Engine"
                    decision="All safety parameters are set once at deployment and can never be modified — not by the deployer, not by the agent, not by anyone."
                    rationale="In DeFi, admin keys are the #1 attack vector. Immutable storage eliminates this entire class of risk at the bytecode level."
                />
                <KeyDecision
                    title="Agent Cannot Withdraw — Only Trade"
                    decision="The authorized agent can only call executeTrade(), which passes through the ConstraintEngine. Zero withdrawal capability."
                    rationale="Even if the agent's key is compromised, the attacker can only make trades within the 5% per-trade limit, 10 per day — cannot drain funds."
                />
                <KeyDecision
                    title="LangGraph State Machine (Not Freeform LLM)"
                    decision="The agent uses a deterministic state machine with fixed phases, not an open-ended LLM conversation."
                    rationale="A freeform LLM might hallucinate a trade or skip constraint validation. LangGraph enforces the exact sequence with logged phase transitions."
                />
                <KeyDecision
                    title="x402 Micropayment Oracle"
                    decision="Agent pays ~$0.01 per query for verified price data instead of free but manipulable feeds."
                    rationale="Free oracles are often stale or manipulated. Economic cost prevents spam and every payment is on-chain for transparency."
                />
                <KeyDecision
                    title="Emergency Exit — Atomic & Irreversible"
                    decision="Users can call emergencyExit() to atomically withdraw all AVAX and USDC in one transaction."
                    rationale="In a crisis, users need a one-click panic button. Atomic = no partial failures. Irreversible = no gaming."
                />
            </div>

            {/* ─── MARKETPLACE ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.65s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="marketplace" title="Marketplace" subtitle="ERC-8004 reputation-based agent marketplace" />

                <Paragraph>
                    The Agent Marketplace allows users to discover, compare, and subscribe to community-built AI trading agents.
                    Each agent carries an <InlineCode>ERC-8004</InlineCode> NFT with a fully on-chain reputation score computed from 7 weighted components.
                </Paragraph>

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>REPUTATION SCORING (MAX 1000)
                </div>
                <DocTable
                    headers={['Component', 'Max Points', 'Type']}
                    rows={[
                        ['Win Rate', '300', 'Positive'],
                        ['Return', '250', 'Positive'],
                        ['Consistency', '200', 'Positive'],
                        ['Volume', '150', 'Positive'],
                        ['Subscribers', '100', 'Positive'],
                        ['Drawdown', '−200', 'Penalty'],
                        ['Slash', '−100/slash', 'Penalty'],
                    ]}
                />

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>TIER SYSTEM
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 24 }}>
                    {[
                        { tier: 'APEX', min: '≥850', color: '#22d3ee' },
                        { tier: 'ELITE', min: '≥700', color: '#4ade80' },
                        { tier: 'TRUSTED', min: '≥500', color: '#fbbf24' },
                        { tier: 'RISING', min: '≥300', color: '#f97316' },
                        { tier: 'UNVERIFIED', min: '<300', color: '#888888' },
                    ].map(t => (
                        <div key={t.tier} style={{ border: `1px solid ${t.color}40`, padding: '10px 12px', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: t.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{t.tier}</div>
                            <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{t.min}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── FEE MODEL ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.75s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="fees" title="Fee Model" subtitle="Pull-based fee distribution with high-watermark protection" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                    {[
                        { label: 'SUBSCRIPTION FEE', value: 'Monthly USDC', detail: 'Set by each agent' },
                        { label: 'PERFORMANCE FEE', value: '≤ 5%', detail: 'Only above high watermark' },
                        { label: 'MONTHLY CAP', value: '10%', detail: 'Max % of AUM per user/month' },
                        { label: 'PROTOCOL CUT', value: '0.5%', detail: 'Of all fees' },
                    ].map(f => (
                        <div key={f.label} style={{ border: '1px solid #2a2a2a', padding: '14px 16px', background: '#0d0d0d' }}>
                            <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', marginBottom: 6 }}>{f.label}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace" }}>{f.value}</div>
                            <div style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{f.detail}</div>
                        </div>
                    ))}
                </div>

                <Paragraph>
                    Fees use the <strong style={{ color: '#e8e8e8' }}>pull pattern</strong> (CEI): balance is zeroed before transfer, eliminating reentrancy.
                    Performance fees use a <strong style={{ color: '#e8e8e8' }}>high watermark</strong> — fees are only charged on new all-time highs, preventing double-charging after drawdowns.
                </Paragraph>
            </div>

            {/* ─── ROADMAP ─── */}
            <div style={{ animation: 'fadeUp 0.4s ease-out forwards', animationDelay: '0.85s', opacity: 0, marginTop: 40 }}>
                <SectionHeader id="roadmap" title="Roadmap" subtitle="Current status and future development plans" />

                <div style={{ fontSize: 10, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>COMPLETION STATUS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                    {[
                        { label: 'MUST HAVE', count: '10/10', color: '#4ade80' },
                        { label: 'SHOULD HAVE', count: '8/8', color: '#22d3ee' },
                        { label: 'COULD HAVE', count: '10/10', color: '#fbbf24' },
                    ].map(s => (
                        <div key={s.label} style={{ border: `1px solid ${s.color}40`, padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: 8, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', marginBottom: 6 }}>{s.label}</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.count}</div>
                            <div style={{ fontSize: 9, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>✅ COMPLETE</div>
                        </div>
                    ))}
                </div>

                <div style={{ fontSize: 10, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                    <span style={{ color: '#444444' }}>{'// '}</span>FUTURE ROADMAP
                </div>
                <DocTable
                    headers={['Feature', 'Status', 'Plan']}
                    rows={[
                        ['Mainnet Deployment', 'FUTURE', 'Post-audit with Gnosis Safe multi-sig'],
                        ['Multi-Asset Portfolios', 'FUTURE', 'WETH, WBTC, stablecoin pairs'],
                        ['Subnet / L1', 'FUTURE', 'Dedicated PeakBalance Subnet'],
                        ['Cross-Chain Rebalancing', 'FUTURE', 'Chainlink CCIP integration'],
                        ['Governance DAO', 'FUTURE', 'Progressive decentralization'],
                        ['Mobile App', 'FUTURE', 'React Native with push notifications'],
                        ['Advanced ML Models', 'RESEARCH', 'RL agents on historical DEX data'],
                    ]}
                />
            </div>

            {/* Footer */}
            <div style={{ marginTop: 60, borderTop: '1px solid #2a2a2a', paddingTop: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#444444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em' }}>
                    PEAKBALANCE v0.1.0-fuji · Safety-First Autonomous DeFi on Avalanche
                </div>
                <div style={{ fontSize: 9, color: '#2a2a2a', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
                    All 9 contracts deployed & verified on Fuji testnet
                </div>
            </div>
        </div>
    );
}
