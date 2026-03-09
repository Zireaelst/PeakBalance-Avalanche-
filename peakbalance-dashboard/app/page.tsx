'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const TICK_DATA = [
    { l: "AVAX/USD", v: "$38.42", cls: "text-[#4ade80]" },
    { l: "USDC/USD", v: "$1.000", cls: "" },
    { l: "PORTFOLIO", v: "$4,821.33", cls: "text-[#4ade80]" },
    { l: "PEAK_AGENT", v: "ACTIVE", cls: "text-[#22d3ee]" },
    { l: "DRIFT", v: "2.34%", cls: "" },
    { l: "DAILY_TRADES", v: "3/10", cls: "" },
    { l: "ORACLE_FEE", v: "$0.010", cls: "" },
    { l: "ERC8004_SCORE", v: "847/1000", cls: "text-[#4ade80]" },
    { l: "LAST_REBALANCE", v: "14m ago", cls: "" },
    { l: "STOP_LOSS", v: "ARMED", cls: "text-[#22d3ee]" },
    { l: "CHAIN", v: "AVALANCHE", cls: "text-[#22d3ee]" },
    { l: "BLOCK", v: "#37,241,082", cls: "" },
    { l: "AVAX_ALLOC", v: "52.34%", cls: "" },
    { l: "USDC_ALLOC", v: "47.66%", cls: "" },
];

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [price, setPrice] = useState(38.42);

    // Intersection Observer for scroll reveal animations
    useEffect(() => {
        const revealEls = document.querySelectorAll('.obs-reveal');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    (e.target as HTMLElement).style.animation = `fadeUp 0.5s ease ${i * 0.04}s both`;
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        revealEls.forEach(el => {
            (el as HTMLElement).style.opacity = '0';
            obs.observe(el);
        });

        return () => obs.disconnect();
    }, []);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        const CHARS = '01アイウエオカキクケコサシスセソタチツテト{}<>[]//=+*&$#@!?';
        const fontSize = 13;
        let cols = Math.floor(W / fontSize);
        let drops = Array(cols).fill(1);
        ctx.font = fontSize + 'px "JetBrains Mono", monospace';

        const draw = () => {
            ctx.fillStyle = 'rgba(10,10,10,0.06)';
            ctx.fillRect(0, 0, W, H);
            for (let i = 0; i < drops.length; i++) {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)];
                const alpha = Math.random() > 0.5 ? 0.9 : 0.3;
                const isTeal = Math.random() > 0.85;
                ctx.fillStyle = isTeal
                    ? `rgba(34,211,238,${alpha})`
                    : `rgba(74,222,128,${alpha * 0.5})`;
                ctx.fillText(char, i * 13, drops[i] * 13);
                if (drops[i] * 13 > H && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        const handleResize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
            cols = Math.floor(W / fontSize);
            drops = Array(cols).fill(1);
            ctx.font = fontSize + 'px "JetBrains Mono", monospace';
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Live Price Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setPrice(p => {
                let newP = p + (Math.random() - 0.5) * 0.08;
                return Math.max(35, Math.min(42, newP));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Ticker content renderer
    const renderTickerItems = () => TICK_DATA.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-[6px] px-[20px]">
            <span className="text-[9px] text-[#444444] tracking-[0.18em] uppercase">
                {t.l}:
            </span>
            <span className={`text-[10px] font-bold ${t.cls || 'text-[#e8e8e8]'}`}>
                {t.l === 'AVAX/USD' ? `$${price.toFixed(2)}` : t.v}
            </span>
            <span className="text-[#444444] text-[10px] ml-[20px]">▓</span>
        </span>
    ));

    return (
        <div className="font-[var(--font-mono)] bg-[#0a0a0a] text-[#e8e8e8] min-h-screen">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.9)] border-b border-[#2a2a2a] flex items-center justify-between px-[40px] h-[52px]">
                <Link href="/" className="flex items-center gap-[10px] border border-[#2a2a2a] px-[12px] py-[5px] cursor-crosshair">
                    <span className="w-[5px] h-[5px] bg-[#4ade80] animate-pulse-dot"></span>
                    <span className="text-[12px] tracking-[0.2em] font-bold text-[#4ade80]">
                        PEAK<span className="text-[#e8e8e8]">BALANCE</span>
                    </span>
                </Link>
                <div className="hidden md:flex items-center h-full">
                    <a href="#solution" className="text-[10px] text-[#4ade80] tracking-[0.15em] uppercase pl-[0px] pr-[18px] h-full flex items-center border-l border-r border-[#2a2a2a] hover:bg-[#161616] pl-[18px]">PROTOCOL</a>
                    <a href="#how" className="text-[10px] text-[#888888] tracking-[0.15em] uppercase px-[18px] h-full flex items-center border-r border-[#2a2a2a] hover:bg-[#161616] hover:text-[#e8e8e8] transition-colors">HOW IT WORKS</a>
                    <a href="#safety" className="text-[10px] text-[#888888] tracking-[0.15em] uppercase px-[18px] h-full flex items-center border-r border-[#2a2a2a] hover:bg-[#161616] hover:text-[#e8e8e8] transition-colors">SAFETY</a>
                    <a href="#roadmap" className="text-[10px] text-[#888888] tracking-[0.15em] uppercase px-[18px] h-full flex items-center border-r border-[#2a2a2a] hover:bg-[#161616] hover:text-[#e8e8e8] transition-colors">ROADMAP</a>
                </div>
                <div className="flex items-center gap-[16px]">
                    <span className="text-[9px] text-[#444444] tracking-[0.1em] border border-[#2a2a2a] px-[7px] py-[2px] hidden sm:block">FUJI TESTNET</span>
                    <Link href="/dashboard" className="text-[10px] tracking-[0.15em] uppercase border border-[#e8e8e8] text-[#e8e8e8] bg-transparent px-[18px] py-[8px] flex items-center gap-[8px] hover:bg-[#e8e8e8] hover:text-[#0a0a0a] transition-all">
                        LAUNCH APP <span>→</span>
                    </Link>
                </div>
            </nav>

            {/* TICKER */}
            <div className="mt-[52px]">
                <div className="bg-[#161616] border-b border-[#2a2a2a] overflow-hidden py-[6px] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[80px] before:bg-gradient-to-r before:from-[#161616] before:to-transparent before:z-10 after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[80px] after:bg-gradient-to-l after:from-[#161616] after:to-transparent after:z-10">
                    <div className="flex whitespace-nowrap animate-[ticker_55s_linear_infinite]">
                        {renderTickerItems()}
                        {renderTickerItems()}
                    </div>
                </div>
            </div>

            {/* HERO SECTION */}
            <section className="min-h-[100vh] relative flex flex-col items-center justify-center overflow-hidden pt-[100px] pb-[60px] px-[40px]">
                <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1920&q=80&auto=format&fit=crop')] bg-cover bg-[center_40%] grayscale-[55%] brightness-[0.25] contrast-[1.15]"></div>
                <canvas id="matrix-canvas" ref={canvasRef} className="absolute inset-0 z-[1] opacity-20 mix-blend-screen"></canvas>
                <div className="absolute inset-0 z-[2] pointer-events-none" style={{
                    background: `
            radial-gradient(ellipse 70% 55% at 50% 55%, rgba(34,211,238,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 25% 35%, rgba(74,222,128,0.05) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, transparent 25%, rgba(10,10,10,0.65) 82%, rgba(10,10,10,1) 100%)
          `
                }}></div>
                <div className="absolute inset-0 z-[1] opacity-25 pointer-events-none" style={{
                    backgroundImage: `linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)'
                }}></div>
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(34,211,238,0.3)] to-transparent z-[3] pointer-events-none" style={{ animation: 'scanMove 8s linear infinite' }}></div>

                <div className="relative z-10 text-center max-w-[900px] animate-[fadeUp_0.8s_ease_both]">
                    <div className="inline-flex items-center gap-[8px] border border-[#2a2a2a] px-[14px] py-[5px] mb-[28px] animate-[fadeUp_0.6s_ease_both]">
                        <span className="w-[5px] h-[5px] bg-[#22d3ee] animate-pulse-dot"></span>
                        <span className="text-[9px] text-[#22d3ee] tracking-[0.25em] uppercase">Live on Avalanche Fuji Testnet</span>
                    </div>

                    <br />
                    <div className="inline-block border border-[#2a2a2a] px-[12px] py-[4px] text-[9px] text-[#888888] tracking-[0.2em] uppercase mb-[24px]">
            // AI-POWERED DEFI PORTFOLIO AGENT
                    </div>

                    <h1 className="font-[var(--font-sans)] text-[clamp(42px,7vw,84px)] font-bold leading-[1.04] text-[#e8e8e8] tracking-[-0.03em] mb-[12px] animate-[fadeUp_0.7s_ease_0.1s_both]">
                        Your Portfolio.<br />
                        <em className="not-italic text-[#4ade80]">Always</em> Balanced.<br />
                        <span className="text-[#22d3ee]">Never Rogue.</span>
                    </h1>

                    <p className="font-[var(--font-sans)] text-[clamp(15px,2vw,18px)] text-[#888888] leading-[1.6] max-w-[580px] mx-auto mb-[36px] font-light animate-[fadeUp_0.7s_ease_0.2s_both]">
                        Autonomous rebalancing, hard-coded safety limits, and self-funded oracle payments.
                        The first DeFi agent that earns trust through immutable code — not promises.
                    </p>

                    <div className="flex items-center justify-center gap-0 mb-[52px] animate-[fadeUp_0.7s_ease_0.3s_both]">
                        <Link href="/dashboard" className="font-[var(--font-mono)] text-[11px] tracking-[0.15em] uppercase bg-[#e8e8e8] text-[#0a0a0a] border border-[#e8e8e8] px-[28px] py-[13px] flex items-center gap-[10px] font-bold transition-all hover:bg-[#4ade80] hover:border-[#4ade80]">
                            LAUNCH APP →
                        </Link>
                        <a href="#how" className="font-[var(--font-mono)] text-[11px] tracking-[0.15em] uppercase bg-transparent text-[#888888] border border-l-0 border-[#2a2a2a] px-[28px] py-[13px] transition-all hover:text-[#e8e8e8] hover:border-[#3d3d3d] hover:bg-[#161616]">
                            VIEW DEMO
                        </a>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch justify-center border border-[#2a2a2a] bg-[rgba(22,22,22,0.8)] animate-[fadeUp_0.7s_ease_0.4s_both]">
                        <div className="dh px-[28px] py-[14px] text-center border-b md:border-b-0 md:border-r border-[#2a2a2a] min-w-[140px]">
                            <span className="text-[22px] font-bold text-[#4ade80] block tracking-[-0.02em] leading-none">$0</span>
                            <span className="text-[8px] text-[#444444] tracking-[0.2em] uppercase mt-[5px] block">Lost to Rogue Agents</span>
                        </div>
                        <div className="dh px-[28px] py-[14px] text-center border-b md:border-b-0 md:border-r border-[#2a2a2a] min-w-[140px]">
                            <span className="text-[22px] font-bold text-[#22d3ee] block tracking-[-0.02em] leading-none">&lt;1s</span>
                            <span className="text-[8px] text-[#444444] tracking-[0.2em] uppercase mt-[5px] block">Avalanche Finality</span>
                        </div>
                        <div className="dh px-[28px] py-[14px] text-center border-b md:border-b-0 md:border-r border-[#2a2a2a] min-w-[140px]">
                            <span className="text-[22px] font-bold text-[#fbbf24] block tracking-[-0.02em] leading-none">$0.01</span>
                            <span className="text-[8px] text-[#444444] tracking-[0.2em] uppercase mt-[5px] block">Per Oracle Query</span>
                        </div>
                        <div className="dh px-[28px] py-[14px] text-center border-b md:border-b-0 md:border-r border-[#2a2a2a] min-w-[140px]">
                            <span className="text-[22px] font-bold text-[#e8e8e8] block tracking-[-0.02em] leading-none">5%</span>
                            <span className="text-[8px] text-[#444444] tracking-[0.2em] uppercase mt-[5px] block">Max Trade Size</span>
                        </div>
                        <div className="dh px-[28px] py-[14px] text-center min-w-[140px]">
                            <span className="text-[22px] font-bold text-[#4ade80] block tracking-[-0.02em] leading-none">24/7</span>
                            <span className="text-[8px] text-[#444444] tracking-[0.2em] uppercase mt-[5px] block">Autonomous Monitoring</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-[6px] opacity-0 animate-[fadeIn_1s_ease_1.2s_forwards]">
                    <span className="text-[8px] text-[#444444] tracking-[0.2em]">SCROLL</span>
                    <div className="w-[1px] h-[40px] bg-gradient-to-b from-[#444444] to-transparent animate-[float_2s_ease-in-out_infinite]"></div>
                </div>
            </section>

            {/* DIVIDER */}
            <div className="text-[10px] text-[#444444] overflow-hidden whitespace-nowrap select-none leading-none opacity-50 bg-[#111111] py-[4px] border-t border-[#2a2a2a]">
                ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
            </div>

            {/* PROBLEM SECTION */}
            <section id="problem" className="py-[100px] px-[40px] border-t border-[#2a2a2a] bg-[#0a0a0a] relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto">
                    <div className="inline-flex items-center gap-[8px] border border-[#2a2a2a] px-[10px] py-[3px] mb-[16px]">
                        <span className="text-[9px] text-[#444444]">// </span>
                        <span className="text-[9px] text-[#888888] tracking-[0.25em] uppercase">THE PROBLEM</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-[40px] items-end mb-[48px]">
                        <h2 className="font-[var(--font-sans)] text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.02em]">
                            DeFi is powerful.<br />Managing it is <span className="text-[#f87171]">brutal.</span>
                        </h2>
                        <p className="font-[var(--font-sans)] text-[16px] text-[#888888] leading-[1.7] font-light">
                            89% of active DeFi wallets never rebalance. Not because they don't want to — because the tools are either too risky, too complex, or both.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-[1px] bg-[#2a2a2a]">
                        {/* Cards */}
                        <div className="obs-reveal dh bg-[#161616] p-[36px_32px] border-b border-[#2a2a2a]">
                            <div className="text-[9px] text-[#444444] tracking-[0.2em] mb-[20px] flex items-center gap-[8px] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#2a2a2a]">01</div>
                            <span className="text-[22px] mb-[14px] block">⏰</span>
                            <div className="font-[var(--font-sans)] text-[20px] font-semibold text-[#e8e8e8] mb-[10px] leading-[1.2]">24/7 Monitoring Required</div>
                            <p className="font-[var(--font-sans)] text-[14px] text-[#888888] leading-[1.65]">DeFi portfolios drift constantly. Missing a rebalance window during volatility means real, compounding losses. You'd need to watch screens around the clock.</p>
                            <span className="inline-block mt-[16px] border border-[#2a2a2a] px-[8px] py-[2px] text-[9px] text-[#f87171] tracking-[0.15em] uppercase">CRITICAL</span>
                        </div>
                        <div className="obs-reveal dh bg-[#161616] p-[36px_32px] border-b border-[#2a2a2a]">
                            <div className="text-[9px] text-[#444444] tracking-[0.2em] mb-[20px] flex items-center gap-[8px] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#2a2a2a]">02</div>
                            <span className="text-[22px] mb-[14px] block">🤖</span>
                            <div className="font-[var(--font-sans)] text-[20px] font-semibold text-[#e8e8e8] mb-[10px] leading-[1.2]">Existing Bots Have No Limits</div>
                            <p className="font-[var(--font-sans)] text-[14px] text-[#888888] leading-[1.65]">Every autonomous trading bot today operates without hard-coded constraints. One exploitable bug, one flash loan attack, one edge case — and your entire portfolio is drained.</p>
                            <span className="inline-block mt-[16px] border border-[#2a2a2a] px-[8px] py-[2px] text-[9px] text-[#f87171] tracking-[0.15em] uppercase">CRITICAL</span>
                        </div>
                        <div className="obs-reveal dh bg-[#161616] p-[36px_32px] md:border-b-0 border-b border-[#2a2a2a]">
                            <div className="text-[9px] text-[#444444] tracking-[0.2em] mb-[20px] flex items-center gap-[8px] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#2a2a2a]">03</div>
                            <span className="text-[22px] mb-[14px] block">💸</span>
                            <div className="font-[var(--font-sans)] text-[20px] font-semibold text-[#e8e8e8] mb-[10px] leading-[1.2]">Oracle Costs Kill Small Strategies</div>
                            <p className="font-[var(--font-sans)] text-[14px] text-[#888888] leading-[1.65]">Real-time price data requires constant wallet top-ups. For smaller portfolios, oracle costs make frequent rebalancing uneconomical — until now.</p>
                            <span className="inline-block mt-[16px] border border-[#2a2a2a] px-[8px] py-[2px] text-[9px] text-[#f87171] tracking-[0.15em] uppercase">HIGH</span>
                        </div>
                        <div className="obs-reveal dh bg-[#161616] p-[36px_32px]">
                            <div className="text-[9px] text-[#444444] tracking-[0.2em] mb-[20px] flex items-center gap-[8px] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#2a2a2a]">04</div>
                            <span className="text-[22px] mb-[14px] block">🔒</span>
                            <div className="font-[var(--font-sans)] text-[20px] font-semibold text-[#e8e8e8] mb-[10px] leading-[1.2]">Zero Verifiable Trust</div>
                            <p className="font-[var(--font-sans)] text-[14px] text-[#888888] leading-[1.65]">You're asked to trust closed-source bots with your life savings. No on-chain history, no reputation system, no way to verify the agent's track record before committing funds.</p>
                            <span className="inline-block mt-[16px] border border-[#2a2a2a] px-[8px] py-[2px] text-[9px] text-[#f87171] tracking-[0.15em] uppercase">HIGH</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUTION SECTION */}
            <section id="solution" className="py-[100px] px-[40px] bg-[#111111] border-t border-[#2a2a2a] relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid md:grid-cols-2 gap-[60px] items-end mb-[60px]">
                        <div>
                            <div className="inline-flex items-center gap-[8px] border border-[#2a2a2a] px-[10px] py-[3px] mb-[16px]">
                                <span className="text-[9px] text-[#444444]">// </span>
                                <span className="text-[9px] text-[#888888] tracking-[0.25em] uppercase">THE SOLUTION</span>
                            </div>
                            <h2 className="font-[var(--font-sans)] text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.02em]">
                                Safety baked into<br />the <span className="text-[#4ade80]">blockchain itself.</span>
                            </h2>
                        </div>
                        <p className="font-[var(--font-sans)] text-[16px] text-[#888888] leading-[1.7] font-light">
                            PeakBalance is the first DeFi agent where safety constraints live in an immutable smart contract — not in configurable settings that can be changed, hacked, or overridden.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-[1px] bg-[#2a2a2a]">
                        <div className="obs-reveal dh bg-[#161616] p-[28px_24px]">
                            <div className="w-full h-[2px] mb-[20px] bg-[#f87171]"></div>
                            <div className="w-[36px] h-[36px] border border-[#f87171] flex items-center justify-center mb-[14px] text-[15px]">🛡</div>
                            <div className="text-[12px] font-bold text-[#e8e8e8] tracking-[0.05em] mb-[10px] leading-[1.3]">HARD SAFETY LIMITS</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">ConstraintEngine.sol is fully immutable — no admin key, no proxy. Max 5% per trade, max 10 trades/day, 10% stop-loss. Enforced at the EVM level.</p>
                            <div className="mt-[16px] pt-[12px] border-t border-[#2a2a2a] text-[9px] text-[#444444] tracking-[0.15em] uppercase">NON-UPGRADEABLE</div>
                        </div>
                        <div className="obs-reveal dh bg-[#161616] p-[28px_24px]">
                            <div className="w-full h-[2px] mb-[20px] bg-[#22d3ee]"></div>
                            <div className="w-[36px] h-[36px] border border-[#22d3ee] flex items-center justify-center mb-[14px] text-[15px]">🤖</div>
                            <div className="text-[12px] font-bold text-[#e8e8e8] tracking-[0.05em] mb-[10px] leading-[1.3]">FULL AI AUTONOMY</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">Claude-powered agent monitors every 60 seconds. When your portfolio drifts beyond threshold, it calculates the optimal rebalance and executes on Trader Joe.</p>
                            <div className="mt-[16px] pt-[12px] border-t border-[#2a2a2a] text-[9px] text-[#444444] tracking-[0.15em] uppercase">CLAUDE SONNET 4.6</div>
                        </div>
                        <div className="obs-reveal dh bg-[#161616] p-[28px_24px]">
                            <div className="w-full h-[2px] mb-[20px] bg-[#fbbf24]"></div>
                            <div className="w-[36px] h-[36px] border border-[#fbbf24] flex items-center justify-center mb-[14px] text-[15px]">⚡</div>
                            <div className="text-[12px] font-bold text-[#e8e8e8] tracking-[0.05em] mb-[10px] leading-[1.3]">X402 SELF-PAYMENTS</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">Agent pays for oracle data autonomously via Avalanche's x402 micropayment protocol. ~$0.01/query, ~2s settlement. Zero manual top-ups ever.</p>
                            <div className="mt-[16px] pt-[12px] border-t border-[#2a2a2a] text-[9px] text-[#444444] tracking-[0.15em] uppercase">AVALANCHE NATIVE</div>
                        </div>
                        <div className="obs-reveal dh bg-[#161616] p-[28px_24px]">
                            <div className="w-full h-[2px] mb-[20px] bg-[#4ade80]"></div>
                            <div className="w-[36px] h-[36px] border border-[#4ade80] flex items-center justify-center mb-[14px] text-[15px]">🪪</div>
                            <div className="text-[12px] font-bold text-[#e8e8e8] tracking-[0.05em] mb-[10px] leading-[1.3]">ERC-8004 REPUTATION</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">Every agent holds an on-chain NFT identity. Reputation score updates after every trade. Inspect the full verifiable track record before trusting your funds.</p>
                            <div className="mt-[16px] pt-[12px] border-t border-[#2a2a2a] text-[9px] text-[#444444] tracking-[0.15em] uppercase">ON-CHAIN VERIFIED</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how" className="py-[100px] px-[40px] bg-[#0a0a0a] border-t border-[#2a2a2a] relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto">
                    <div className="inline-flex items-center gap-[8px] border border-[#2a2a2a] px-[10px] py-[3px] mb-[16px]">
                        <span className="text-[9px] text-[#444444]">// </span>
                        <span className="text-[9px] text-[#888888] tracking-[0.25em] uppercase">HOW IT WORKS</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-[40px] items-end">
                        <h2 className="font-[var(--font-sans)] text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.02em]">
                            Five steps.<br />Completely <span className="text-[#22d3ee]">transparent.</span>
                        </h2>
                        <p className="font-[var(--font-sans)] text-[16px] text-[#888888] leading-[1.7] font-light">
                            Every decision logged. Every payment on-chain. Every trade validated. You see exactly what the agent does — and why.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-[1px] bg-[#2a2a2a] mt-[52px]">
                        <div className="obs-reveal relative overflow-hidden bg-[#161616] p-[28px_22px] border-t-2 border-[#22d3ee]">
                            <div className="text-[32px] font-bold text-[#444444] leading-none mb-[16px] tracking-[-0.04em]">01</div>
                            <div className="text-[11px] font-bold text-[#e8e8e8] tracking-[0.08em] mb-[10px] uppercase">USER DEPOSITS</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">AVAX + USDC deposited into PeakVault.sol. Funds held in smart contract — the agent wallet has zero withdrawal rights.</p>
                            <span className="inline-block mt-[14px] text-[8px] text-[#22d3ee] border border-[#22d3ee] px-[6px] py-[2px] tracking-[0.15em] uppercase">PeakVault.sol</span>
                        </div>
                        <div className="obs-reveal relative overflow-hidden bg-[#161616] p-[28px_22px] border-t-2 border-[#fbbf24] delay-100">
                            <div className="text-[32px] font-bold text-[#444444] leading-none mb-[16px] tracking-[-0.04em]">02</div>
                            <div className="text-[11px] font-bold text-[#e8e8e8] tracking-[0.08em] mb-[10px] uppercase">AGENT MONITORS</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">Python agent checks allocation every 60s, fetching Chainlink price via OracleConsumer — paying the $0.01 fee automatically via x402.</p>
                            <span className="inline-block mt-[14px] text-[8px] text-[#fbbf24] border border-[#fbbf24] px-[6px] py-[2px] tracking-[0.15em] uppercase">x402 Protocol</span>
                        </div>
                        <div className="obs-reveal relative overflow-hidden bg-[#161616] p-[28px_22px] border-t-2 border-[#f87171] delay-200">
                            <div className="text-[32px] font-bold text-[#444444] leading-none mb-[16px] tracking-[-0.04em]">03</div>
                            <div className="text-[11px] font-bold text-[#e8e8e8] tracking-[0.08em] mb-[10px] uppercase">DRIFT DETECTED</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">When allocation drifts &gt;5% from target (e.g. 55% AVAX vs 50% target), Claude calculates the optimal corrective trade size.</p>
                            <span className="inline-block mt-[14px] text-[8px] text-[#f87171] border border-[#f87171] px-[6px] py-[2px] tracking-[0.15em] uppercase">Claude Sonnet</span>
                        </div>
                        <div className="obs-reveal relative overflow-hidden bg-[#161616] p-[28px_22px] border-t-2 border-[#4ade80] delay-300">
                            <div className="text-[32px] font-bold text-[#444444] leading-none mb-[16px] tracking-[-0.04em]">04</div>
                            <div className="text-[11px] font-bold text-[#e8e8e8] tracking-[0.08em] mb-[10px] uppercase">CONSTRAINTS CHECKED</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">ConstraintEngine validates every parameter. Too large? Daily limit hit? Wrong protocol? Transaction reverts. No exceptions. No bypasses.</p>
                            <span className="inline-block mt-[14px] text-[8px] text-[#4ade80] border border-[#4ade80] px-[6px] py-[2px] tracking-[0.15em] uppercase">ConstraintEngine.sol</span>
                        </div>
                        <div className="obs-reveal relative overflow-hidden bg-[#161616] p-[28px_22px] border-t-2 border-[#22d3ee] delay-400">
                            <div className="text-[32px] font-bold text-[#444444] leading-none mb-[16px] tracking-[-0.04em]">05</div>
                            <div className="text-[11px] font-bold text-[#e8e8e8] tracking-[0.08em] mb-[10px] uppercase">TRADE EXECUTES</div>
                            <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.6]">Approved swap runs on Trader Joe v2.1. ERC-8004 reputation updates. Dashboard shows live decision log and new allocation.</p>
                            <span className="inline-block mt-[14px] text-[8px] text-[#22d3ee] border border-[#22d3ee] px-[6px] py-[2px] tracking-[0.15em] uppercase">Trader Joe v2.1</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-[120px] px-[40px] bg-[#111111] border-t border-[#2a2a2a] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 80% at 50% 100%, rgba(74,222,128,0.05) 0%, transparent 70%)' }}></div>
                <div className="max-w-[800px] mx-auto text-center relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="border border-[#2a2a2a] px-[14px] py-[4px] text-[9px] text-[#444444] tracking-[0.2em]">
              // BEGIN_OBSERVATION
                        </div>
                    </div>
                    <h2 className="font-[var(--font-sans)] text-[clamp(32px,5vw,60px)] font-bold leading-[1.08] tracking-[-0.03em] mb-4 text-[#e8e8e8]">
                        Safety-first agents<br />are the <em className="not-italic text-[#4ade80]">future of DeFi.</em>
                    </h2>
                    <p className="font-[var(--font-sans)] text-[16px] text-[#888888] leading-[1.65] font-light mb-10">
                        PeakBalance is the first DeFi agent that earns trust through immutable code — not promises. Join the testnet and watch your portfolio manage itself.
                    </p>
                    <div className="flex items-center justify-center gap-0 mb-9">
                        <Link href="/dashboard" className="font-[var(--font-mono)] text-[12px] tracking-[0.15em] uppercase bg-[#e8e8e8] text-[#0a0a0a] border border-[#e8e8e8] px-[32px] py-[14px] flex items-center gap-[10px] font-bold transition-all hover:bg-[#4ade80] hover:border-[#4ade80]">
                            CONNECT WALLET →
                        </Link>
                        <a href="https://github.com/Zireaelst/PeakBalance-Avalanche-" target="_blank" className="font-[var(--font-mono)] text-[12px] tracking-[0.15em] uppercase bg-transparent text-[#888888] border border-l-0 border-[#2a2a2a] px-[24px] py-[14px] transition-all hover:text-[#e8e8e8] hover:bg-[#161616] hover:border-[#3d3d3d]">
                            VIEW DOCS
                        </a>
                    </div>
                    <p className="text-[9px] text-[#444444] tracking-[0.12em] leading-[1.8]">
                        Currently live on Avalanche Fuji Testnet · No real funds at risk · External audit before mainnet<br />
                        AVAX/USD feed via Chainlink · x402 payments via PayAI · ERC-8004 via AgentRegistry
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] pt-[52px] pb-[28px] px-10">
                <div className="max-w-[1200px] mx-auto grid md:grid-cols-[280px_1fr_1fr_1fr] gap-[40px] pb-[40px] mb-[28px] border-b border-[#2a2a2a]">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-[10px] border border-[#2a2a2a] px-[12px] py-[6px] mb-[18px]">
                            <span className="w-[5px] h-[5px] bg-[#4ade80] animate-pulse-dot"></span>
                            <span className="text-[12px] tracking-[0.2em] font-bold text-[#4ade80]">PEAK<span className="text-[#e8e8e8]">BALANCE</span></span>
                        </Link>
                        <p className="font-[var(--font-sans)] text-[13px] text-[#888888] leading-[1.7] mb-[18px]">
                            AI-powered DeFi portfolio rebalancer with hard-coded safety constraints. Built natively on Avalanche C-Chain.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="inline-flex items-center gap-2 border border-[#2a2a2a] px-[10px] py-[5px] text-[9px] text-[#444444] tracking-[0.15em] uppercase w-fit">
                                <div className="w-[4px] h-[4px] bg-[#22d3ee]"></div>AVALANCHE C-CHAIN
                            </div>
                            <div className="inline-flex items-center gap-2 border border-[#2a2a2a] px-[10px] py-[5px] text-[9px] text-[#444444] tracking-[0.15em] uppercase w-fit">
                                <div className="w-[4px] h-[4px] bg-[#fbbf24]"></div>x402 MICROPAYMENTS
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[9px] text-[#444444] tracking-[0.25em] uppercase mb-[18px] pb-[8px] border-b border-[#2a2a2a]">PROTOCOL</h4>
                        <ul className="flex flex-col gap-[10px]">
                            <li><a href="#" className="font-[var(--font-sans)] text-[13px] text-[#888888] flex items-center gap-[6px] hover:text-[#e8e8e8] transition-colors before:content-['—'] before:text-[#444444] before:text-[9px]">How it Works</a></li>
                            <li><a href="#" className="font-[var(--font-sans)] text-[13px] text-[#888888] flex items-center gap-[6px] hover:text-[#e8e8e8] transition-colors before:content-['—'] before:text-[#444444] before:text-[9px]">Safety Constraints</a></li>
                            <li><a href="#" className="font-[var(--font-sans)] text-[13px] text-[#888888] flex items-center gap-[6px] hover:text-[#e8e8e8] transition-colors before:content-['—'] before:text-[#444444] before:text-[9px]">x402 Payments</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[9px] text-[#444444] tracking-[0.25em] uppercase mb-[18px] pb-[8px] border-b border-[#2a2a2a]">DEVELOPERS</h4>
                        <ul className="flex flex-col gap-[10px]">
                            <li><a href="https://github.com/Zireaelst/PeakBalance-Avalanche-" target="_blank" className="font-[var(--font-sans)] text-[13px] text-[#888888] flex items-center gap-[6px] hover:text-[#e8e8e8] transition-colors before:content-['—'] before:text-[#444444] before:text-[9px]">GitHub Repo</a></li>
                            <li><a href="#" className="font-[var(--font-sans)] text-[13px] text-[#888888] flex items-center gap-[6px] hover:text-[#e8e8e8] transition-colors before:content-['—'] before:text-[#444444] before:text-[9px]">Smart Contracts</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-[9px] text-[#444444] tracking-[0.12em]">© 2026 PeakBalance · All systems nominal · Built on Avalanche</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-[6px] text-[9px] text-[#444444] tracking-[0.1em]">
                            <div className="w-[5px] h-[5px] bg-[#4ade80] animate-pulse-dot"></div>
                            AGENT ACTIVE
                        </div>
                        <div className="flex items-center gap-[6px] text-[9px] text-[#444444] tracking-[0.1em] border-l border-[#2a2a2a] pl-4">
                            <div className="w-[5px] h-[5px] bg-[#22d3ee] animate-[pulse-dot_2s_0.5s_infinite]"></div>
                            AVALANCHE CONNECTED
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
