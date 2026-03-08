<p align="center">
  <h1 align="center">⛰️ PeakBalance</h1>
  <p align="center">
    <strong>Autonomous DeFi Portfolio Manager on Avalanche C-Chain</strong>
  </p>
  <p align="center">
    AI-powered • Safety-first • Immutable constraints • x402 micropayments
  </p>
</p>

<p align="center">
  <a href="#architecture">Architecture</a> •
  <a href="#smart-contracts">Contracts</a> •
  <a href="#dashboard">Dashboard</a> •
  <a href="#ai-agent">AI Agent</a> •
  <a href="#getting-started">Setup</a>
</p>

---

## What is PeakBalance?

PeakBalance is an **autonomous DeFi portfolio manager** that maintains a 50/50 AVAX/USDC allocation on Avalanche C-Chain. It combines:

- 🤖 **AI Agent** — LangGraph state machine powered by Claude Sonnet monitors portfolio drift 24/7
- 🔒 **Immutable Constraints** — On-chain safety rails that **cannot be overridden** by anyone (no admin keys)
- 💰 **x402 Micropayments** — Pays ~$0.01/query for oracle data with instant Avalanche settlement
- 🪪 **ERC-8004 Identity** — Each agent has an NFT with on-chain reputation tracking

### Safety Philosophy

> **The agent can trade, but it cannot steal.**

Every trade must pass through `ConstraintEngine.sol` which enforces:
- Max **5%** of portfolio per trade
- Max **10 trades** per day
- **10% stop-loss** — auto-exits all positions
- **Protocol whitelist** — only approved DEXs
- User-only withdrawals — the agent wallet **cannot** withdraw funds

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Next.js Dashboard (Wagmi/Viem)           │   │
│  │  Landing · Dashboard · Agent · Trades · Settings  │   │
│  └──────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │ RPC (Avalanche C-Chain)
┌─────────────────────────┼───────────────────────────────┐
│              SMART CONTRACTS (Solidity 0.8.24)            │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐   │
│  │ PeakVault    │ │ Constraint   │ │ AgentRegistry  │   │
│  │ (deposits)   │─│ Engine       │ │ (ERC-8004 NFT) │   │
│  └──────┬───────┘ │ (safety)     │ └────────────────┘   │
│         │         └──────────────┘                       │
│  ┌──────┴───────┐ ┌──────────────┐                      │
│  │ PeakControl  │ │ OracleConsume│                      │
│  │ (pause/resume│ │ (x402 oracle)│                      │
│  └──────────────┘ └──────────────┘                      │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│              PYTHON AI AGENT (LangGraph)                 │
│                                                          │
│  CHECK_PRICES → EVALUATE_DRIFT → VALIDATE_CONSTRAINTS   │
│       ↓ (drift < 5%)        ↓ (drift ≥ 5%)              │
│     SLEEP              EXECUTE_TRADE → RECORD_RESULT     │
│                                              ↓           │
│                                            SLEEP         │
└──────────────────────────────────────────────────────────┘
```

---

## Smart Contracts

| Contract | Description | Key Functions |
|----------|-------------|---------------|
| **ConstraintEngine** | Immutable safety rails | `validateTrade()`, `checkStopLoss()`, `isDriftExceeded()` |
| **PeakVault** | User deposit vault | `depositAVAX()`, `depositUSDC()`, `emergencyExit()`, `executeTrade()` |
| **AgentRegistry** | ERC-8004 identity NFT | `registerAgent()`, `recordTrade()`, `getReputation()` |
| **PeakController** | User controls | `pauseAgent()`, `resumeAgent()`, `forceCheck()` |
| **OracleConsumer** | x402 oracle consumer | `submitPriceWithPayment()`, `getPrice()` |

### Immutable Parameters (set at deployment)
```
MAX_TRADE_SIZE:    500 BPS (5%)
MAX_DAILY_TRADES:  10
STOP_LOSS:         1000 BPS (10%)
DRIFT_THRESHOLD:   500 BPS (5%)
```

---

## Dashboard

Brutalist terminal-aesthetic UI built with Next.js 15, TypeScript strict mode, and Tailwind CSS v4.

**Design System:**
- JetBrains Mono font throughout
- Zero border-radius on all elements
- Global crosshair cursor
- Scanline overlay effect
- Dithered hover patterns
- Monochrome + teal/green/red accent palette

**Pages:** Landing, Dashboard, Agent Activity, Trade History, Settings

---

## AI Agent

Python LangGraph state machine with 6 nodes:

1. **CHECK_PRICES** — Fetch AVAX/USD from Chainlink, fallback to Pyth
2. **EVALUATE_DRIFT** — Calculate allocation drift from 50% target
3. **VALIDATE_CONSTRAINTS** — Check on-chain ConstraintEngine
4. **EXECUTE_TRADE** — Swap via Trader Joe v2.1
5. **RECORD_RESULT** — Update AgentRegistry reputation
6. **SLEEP** — Wait for next check interval

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Frontend
```bash
cd peakbalance-dashboard
npm install
cp .env.example .env.local
npm run dev
```

### Contracts
```bash
cd contracts
forge build
forge test -vvv

# Deploy to Fuji
forge script script/Deploy.s.sol --rpc-url https://api.avax-test.network/ext/bc/C/rpc --broadcast
```

### Agent
```bash
cd agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python agent.py
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Wagmi, Viem, RainbowKit |
| Contracts | Solidity 0.8.24, Foundry |
| Agent | Python, LangGraph, web3.py, structlog |
| Chain | Avalanche C-Chain (Fuji testnet) |
| Oracles | Chainlink, Pyth Network |
| DEX | Trader Joe v2.1 Liquidity Book |
| Payments | x402 micropayments |
| Identity | ERC-8004 agent NFT |

---

## License

MIT — see [LICENSE](./LICENSE)