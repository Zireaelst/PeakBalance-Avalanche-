# PeakBalance

**Autonomous DeFi portfolio rebalancer on Avalanche C-Chain with hard-coded safety constraints, AI reasoning, and on-chain agent identity.**

![Fuji Testnet](https://img.shields.io/badge/Network-Fuji%20Testnet-E84142?style=flat-square)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat-square)
![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C?style=flat-square)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=flat-square)
![Claude](https://img.shields.io/badge/AI-Claude%20Sonnet-D97706?style=flat-square)

---

## The Problem

1. **Autonomous agents can drain wallets.** Every DeFi agent today operates with unrestricted access to user funds. One bug, one exploit, one malicious update -- and everything is gone.
2. **Portfolio maintenance is manual and expensive.** Rebalancing across volatile pairs like AVAX/USDC requires constant monitoring. Most users either over-trade (fees) or under-trade (drift).
3. **No accountability for AI agents.** There is no on-chain record of an agent's track record, no skin-in-the-game, and no way to compare agent performance before subscribing.

---

## Solution

### 1. Hard-coded ConstraintEngine (Immutable, No Admin Key)

All safety parameters are set at deployment and compiled into immutable bytecode. No multisig, no governance, no upgrade path. The deployer cannot change them. Nobody can.

### 2. Claude Sonnet AI Reasoning

A LangGraph state machine powered by Claude Sonnet evaluates portfolio drift, market conditions, and constraint feasibility before every trade decision. The agent reasons -- it does not blindly execute signals.

### 3. x402 Self-funded Oracle Payments (~$0.01/query)

The agent pays for its own oracle data using the x402 micropayment protocol native to Avalanche. Each Chainlink/Pyth price query costs approximately $0.01 in AVAX, settled in the same transaction. No subscriptions, no billing accounts.

### 4. ERC-8004 On-chain Agent Identity and Reputation

Every agent mints an ERC-8004 NFT at registration. Trade outcomes, win rates, drawdowns, and slash events are recorded on-chain. Users can verify an agent's full history before subscribing. A weighted scoring formula (0-1000) drives tiered reputation: UNVERIFIED, RISING, TRUSTED, ELITE, APEX.

---

## Safety Constraints

These values are compiled into `ConstraintEngine.sol` as `immutable` variables. They cannot be changed after deployment.

```
MAX_TRADE_SIZE    = 5% of portfolio per trade  (500 BPS)
MAX_DAILY_TRADES  = 10 trades per 24h window
STOP_LOSS         = 10% drawdown from peak     (1000 BPS)
DRIFT_THRESHOLD   = 5% before rebalance        (500 BPS)

WHITELISTED PROTOCOLS:
  - Trader Joe v2.1 LB Router (Fuji)
  - Aave V3 (planned)
  - Benqi (planned)
```

Additional safety guarantees:
- **User-only withdrawals** -- the agent wallet cannot call `withdraw` or `emergencyExit`
- **Emergency exit** -- users can withdraw all funds instantly, irreversibly revoking agent access
- **Global pause** -- contract owner can halt all trading in an emergency
- **10 AVAX minimum stake** -- agents must stake before listing on the marketplace
- **Slash mechanism** -- misbehaving agents lose stake and reputation permanently

---

## Architecture

```
                        +---------------------+
                        |   USER (Browser)    |
                        |  Next.js Dashboard  |
                        |  Wagmi / Viem / RK  |
                        +----------+----------+
                                   |
                          RPC (Avalanche C-Chain)
                                   |
         +-------------------------+-------------------------+
         |                                                   |
+--------v---------+    +------------------+    +------------v---------+
|    PeakVault     |    | ConstraintEngine |    |   AgentRegistry      |
|  User deposits   |--->| Immutable safety |    |  ERC-8004 NFT ID     |
|  Agent execution |    | Trade validation |    |  Reputation tracking |
+--------+---------+    +------------------+    +----------+-----------+
         |                                                 |
+--------v---------+    +------------------+    +----------v-----------+
|  PeakController  |    | OracleConsumer   |    | ReputationAggregator |
|  Pause / Resume  |    | x402 micropayment|    | Weighted scoring     |
|  Target alloc    |    | Price feeds      |    | Leaderboard (top 20) |
+------------------+    +------------------+    +----------------------+
         |
+--------v---------+    +------------------+    +----------------------+
| AgentMarketplace |    |  StakingVault    |    |   FeeDistributor     |
| Curated listings |<-->| 10 AVAX min stake|    | Sub + perf fees      |
| Subscribe/unsub  |    | Slash mechanism  |    | High watermark       |
+------------------+    +------------------+    +----------------------+
         |
         |              +------------------+
         +------------->| Python AI Agent  |
                        | LangGraph + Claude|
                        | 6-node state machine|
                        +------------------+
                          CHECK_PRICES
                               |
                        EVALUATE_DRIFT
                         /           \
                   drift < 5%    drift >= 5%
                        |              |
                      SLEEP    VALIDATE_CONSTRAINTS
                                       |
                                EXECUTE_TRADE
                                       |
                                RECORD_RESULT
                                       |
                                     SLEEP
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Smart Contracts** | Solidity 0.8.24, Foundry | 9 contracts: vault, safety, registry, marketplace |
| **AI Agent** | Python, LangGraph, Claude Sonnet | 6-node state machine for portfolio decisions |
| **Frontend** | Next.js 15, TypeScript, Tailwind v4, Wagmi, Viem, RainbowKit | Terminal-aesthetic dashboard |
| **Avalanche-Native** | x402 micropayments, ERC-8004 agent identity | Self-funded oracles, on-chain reputation |
| **DEX** | Trader Joe v2.1 Liquidity Book | AVAX/USDC swaps |
| **Oracles** | Chainlink, Pyth Network | Price feeds with automatic fallback |

---

## Contract Addresses (Fuji Testnet)

| Contract | Address | Snowtrace |
|----------|---------|----------|
| ConstraintEngine | `0xD257737006c06C99709513A0491D585D5689316b` | [View](https://testnet.snowtrace.io/address/0xD257737006c06C99709513A0491D585D5689316b) |
| AgentRegistry | `0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3` | [View](https://testnet.snowtrace.io/address/0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3) |
| OracleConsumer | `0x9ccDEb0D1b28BbB05C5BD46c046E19c06a81E261` | [View](https://testnet.snowtrace.io/address/0x9ccDEb0D1b28BbB05C5BD46c046E19c06a81E261) |
| PeakVault | `0x9C12C19B00cAA9c7c23383F399924d26A0E06fDc` | [View](https://testnet.snowtrace.io/address/0x9C12C19B00cAA9c7c23383F399924d26A0E06fDc) |
| PeakController | `0x7cC8c5f8b41198b95185a39e365E8FB4aBae59df` | [View](https://testnet.snowtrace.io/address/0x7cC8c5f8b41198b95185a39e365E8FB4aBae59df) |
| ReputationAggregator | `0xA4beE80EA6352dC1D5CbD83578af2448dfD459C0` | [View](https://testnet.snowtrace.io/address/0xA4beE80EA6352dC1D5CbD83578af2448dfD459C0) |
| FeeDistributor | `0x8c85D2b2A6B4fc3aD1Ef7F03211Df65A212ce013` | [View](https://testnet.snowtrace.io/address/0x8c85D2b2A6B4fc3aD1Ef7F03211Df65A212ce013) |
| StakingVault | `0x2249952027B949f60b68772e33a029E22857e7AB` | [View](https://testnet.snowtrace.io/address/0x2249952027B949f60b68772e33a029E22857e7AB) |
| AgentMarketplace | `0xdB045ac6bA8d7903fD3a566bFBf208955481dA49` | [View](https://testnet.snowtrace.io/address/0xdB045ac6bA8d7903fD3a566bFBf208955481dA49) |

External addresses used:
- USDC (Fuji): `0x5425890298aed601595a70AB815c96711a31Bc65`
- WAVAX (Fuji): `0xd00ae08403B9bbb9124bB305C09058E32C39A48c`
- Trader Joe LB Router v2.1 (Fuji): `0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30`

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/PeakBalance-Avalanche-.git
cd PeakBalance-Avalanche-

# --- Smart Contracts ---
cd contracts
cp .env.example .env          # Add your PRIVATE_KEY
forge install && forge build
forge test -vvv

# Deploy to Fuji testnet
forge script script/DeployFuji.s.sol \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --broadcast -vvvv

# --- Frontend ---
cd ../peakbalance-dashboard
npm install
cp .env.production.example .env.local   # Add contract addresses after deploy
npm run dev

# --- AI Agent ---
cd ../agent
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env           # Add keys and contract addresses
python agent.py
```

---

## How It Works

1. **User deposits AVAX/USDC** into `PeakVault` and authorizes an agent wallet via `PeakController.linkAgent()`.

2. **Agent monitors drift** every cycle. The Python LangGraph agent fetches prices via `OracleConsumer` (paying ~$0.01 per query through x402), calculates current AVAX/USDC allocation, and compares against the user's target (default 50/50).

3. **Constraint validation** happens on-chain. Before any trade, `ConstraintEngine.validateTrade()` checks: is the protocol whitelisted? Is trade size under 5%? Has the daily limit of 10 trades been reached? Is stop-loss breached? All four checks must pass.

4. **Trade execution** routes through Trader Joe v2.1 Liquidity Book. The vault swaps the minimum amount needed to restore target allocation. Every outcome (success, PnL) is recorded on-chain in `AgentRegistry`, updating the agent's ERC-8004 reputation score.

5. **Reputation accrues transparently.** `ReputationAggregator` computes a weighted score from win rate (300 pts), returns (250), consistency (200), volume (150), and subscribers (100), minus drawdown and slash penalties. The top 20 agents populate a public leaderboard.

---

## Why Avalanche

- **x402 micropayments** -- Native protocol for agent-to-service payments. The agent pays $0.01 per oracle query in the same transaction, no external billing.
- **ERC-8004 agent identity** -- Avalanche-native standard for on-chain AI agent identity and reputation tracking.
- **Sub-second finality** -- Trades confirm in <1 second on C-Chain. Critical for rebalancing during volatile markets.
- **Low gas costs** -- Full rebalance cycle (oracle query + constraint check + swap + reputation update) costs <$0.10 in gas.
- **Trader Joe v2.1 Liquidity Book** -- Deep AVAX/USDC liquidity with concentrated liquidity bins for minimal slippage.

---

## Project Structure

```
PeakBalance-Avalanche-/
|-- contracts/               # Foundry project
|   |-- src/                 # 9 Solidity contracts
|   |-- script/              # Deploy scripts (DeployFuji.s.sol)
|   |-- test/                # Foundry tests
|   +-- foundry.toml
|-- peakbalance-dashboard/   # Next.js 15 frontend
|   |-- app/                 # App Router pages
|   |-- components/          # React components
|   |-- hooks/               # Custom hooks (useWeb3, usePortfolio, etc.)
|   +-- lib/                 # Contract addresses, ABIs, chain config
|-- agent/                   # Python AI agent
|   |-- agent.py             # LangGraph state machine
|   +-- requirements.txt
+-- deployments/             # Deployed contract addresses
    +-- fuji.json
```

---

## License

MIT -- see [LICENSE](./LICENSE)