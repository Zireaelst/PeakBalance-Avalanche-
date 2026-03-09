# PeakBalance — Hackathon Demo Video Script (~5 min)

Target: Avalanche hackathon judges
Tone: Technical, confident, concise. No filler.
Language: English

---

## [0:00 - 0:30] HOOK

**SCREEN:** Black screen → PeakBalance logo fade-in → quick montage of dashboard UI, Snowtrace verified contracts, agent executing a trade.

**VOICE:**
"Every autonomous DeFi agent today has one thing in common: unrestricted access to your funds. One bug, one exploit, and your wallet is drained. PeakBalance makes that impossible. We built an AI-powered portfolio rebalancer on Avalanche where the safety constraints are compiled into immutable bytecode. No admin key. No governance vote. No upgrade path. The agent can trade, but it cannot steal."

---

## [0:30 - 1:00] THE PROBLEM

**SCREEN:** Three bullet points appearing one by one, minimal dark UI.

**VOICE:**
"Three problems with autonomous DeFi agents today.

First — no safety rails. Agents operate with full wallet permissions. A single malicious update can drain everything.

Second — portfolio maintenance is manual. Rebalancing AVAX/USDC across volatile markets requires constant attention. Most users either over-trade and pay excessive fees, or they ignore drift and take unnecessary risk.

Third — no agent accountability. There is no on-chain track record. No way to compare agents before you trust them with your capital."

---

## [1:00 - 1:30] THE SOLUTION

**SCREEN:** Architecture diagram (from README). Highlight ConstraintEngine with a red border.

**VOICE:**
"PeakBalance solves all three. It is an autonomous portfolio rebalancer running on Avalanche C-Chain that maintains your target AVAX/USDC allocation. The core innovation is the ConstraintEngine — a Solidity contract where every safety parameter is an `immutable` variable. Max 5% per trade. Max 10 trades per day. 10% stop-loss. Protocol whitelist. These values are hardcoded at deployment. The deployer — that is me — cannot change them after deploy. Nobody can.

The AI agent uses Claude Sonnet to reason about when and how much to rebalance. But every trade must pass through the ConstraintEngine first. The contract has the final say, not the model."

---

## [1:30 - 3:00] LIVE DEMO

### [1:30 - 1:50] Connect Wallet

**SCREEN:** Open PeakBalance dashboard at Vercel URL. Click "Connect Wallet". Core Wallet / MetaMask popup → select Fuji testnet → connected.

**VOICE:**
"Let me show you the working product on Fuji testnet. I am connecting my wallet — we are on Avalanche Fuji, chain ID 43113."

### [1:50 - 2:10] Deposit

**SCREEN:** Navigate to Dashboard page. Click "Deposit AVAX". Enter 0.5 AVAX. Confirm transaction in wallet. Show balance update.

**VOICE:**
"I will deposit a small amount of test AVAX into the PeakVault. The vault tracks AVAX and USDC balances separately. The deposit transaction confirms in under one second — that is Avalanche finality."

### [2:10 - 2:30] Agent Monitoring

**SCREEN:** Navigate to Agent Activity page. Show the DecisionFeed component with real-time status. Show the constraint panel — remaining trades, current drift, stop-loss status.

**VOICE:**
"The agent is now monitoring my portfolio. You can see the decision feed here — it shows each cycle: price check, drift evaluation, constraint validation. Right now drift is below the 5% threshold, so the agent holds. It costs roughly one cent per oracle query through the x402 protocol."

### [2:30 - 2:50] Trade Execution

**SCREEN:** Show a trade being triggered (either wait for drift or explain the mechanism). Navigate to Trades page showing the executed swap. Click the transaction hash to open Snowtrace.

**VOICE:**
"When drift exceeds 5%, the agent proposes a rebalance. The trade passes through the ConstraintEngine on-chain — you can see the validateTrade call here on Snowtrace. The contract checked: is Trader Joe whitelisted? Is the trade under 5% of portfolio? Is the daily limit not exceeded? Is the stop-loss not breached? All four passed, so the swap executed."

### [2:50 - 3:00] Snowtrace Verification

**SCREEN:** Open Snowtrace for the ConstraintEngine contract. Show the verified source code. Scroll to the immutable variables.

**VOICE:**
"All contracts are verified on Snowtrace. Here is the ConstraintEngine source code — you can see the immutable keyword on every safety parameter. This is not upgradeable. This is not proxied. What you see is what you get."

---

## [3:00 - 4:00] AVALANCHE-NATIVE FEATURES

### [3:00 - 3:20] x402 Micropayments

**SCREEN:** Show OracleConsumer contract on Snowtrace. Show a submitPriceWithPayment transaction. Highlight the value field (~0.00027 AVAX).

**VOICE:**
"PeakBalance uses the x402 micropayment protocol — an Avalanche-native standard. The agent pays for its own oracle data. Each Chainlink price query costs approximately one cent in AVAX, paid in the same transaction. No subscription accounts, no billing APIs. The agent is self-funded."

### [3:20 - 3:40] ERC-8004 On-chain Identity

**SCREEN:** Show AgentRegistry on Snowtrace. Show the registerAgent transaction and the resulting NFT. Show the reputation score and trade history.

**VOICE:**
"Every agent has an ERC-8004 identity NFT — an Avalanche-native standard for on-chain AI agent identity. The NFT tracks total trades, win rate, and a reputation score from zero to one thousand. Users can verify an agent's full history before subscribing. The ReputationAggregator computes a weighted score across six dimensions and maintains a public leaderboard of the top twenty agents."

### [3:40 - 4:00] Marketplace and Staking

**SCREEN:** Show Marketplace page on the dashboard. Show agent cards with tier badges. Show the StakingVault contract — 10 AVAX minimum.

**VOICE:**
"The Agent Marketplace is a curated listing system. To list, an agent owner must stake a minimum of ten AVAX — skin in the game. If the agent misbehaves, the stake is slashed and the reputation score drops permanently. This creates real economic accountability for autonomous agents."

---

## [4:00 - 4:30] ARCHITECTURE OVERVIEW

**SCREEN:** Full-screen architecture diagram. Highlight each contract as mentioned.

**VOICE:**
"Quick architecture overview. Nine contracts total on Avalanche C-Chain.

The user interacts through PeakVault for deposits and PeakController for settings. The AI agent executes trades through the vault, but every trade must pass the ConstraintEngine — which is immutable. The OracleConsumer handles x402 price feeds. AgentRegistry manages ERC-8004 NFT identities. And the marketplace layer — ReputationAggregator, StakingVault, FeeDistributor, and AgentMarketplace — handles listing, scoring, staking, and fee distribution.

The key takeaway: ConstraintEngine is immutable. I deployed it. I cannot change it. That is the safety guarantee."

---

## [4:30 - 5:00] CLOSING

**SCREEN:** Split screen — GitHub repo on left, live Vercel dashboard on right. URLs displayed clearly at bottom.

**VOICE:**
"PeakBalance is live on Fuji testnet. All nine contracts are deployed and verified on Snowtrace. The frontend is on Vercel. The AI agent runs continuously.

We believe safety-first agents are the future of DeFi. Not agents that promise safety through governance votes or multisigs — but agents where safety is mathematically enforced in immutable bytecode.

The code is open source. Links are on screen. Thank you."

**SCREEN:** Hold for 3 seconds with:
- GitHub: github.com/[USERNAME]/PeakBalance-Avalanche-
- Live Demo: peakbalance.vercel.app
- Network: Avalanche Fuji Testnet (43113)

---

## Production Notes

- Record at 1080p minimum, 1440p preferred
- Use OBS or similar for screen capture + voiceover
- Keep dashboard in dark mode throughout
- Ensure Snowtrace tabs are pre-loaded (avoid loading delays on camera)
- Have 1-2 AVAX in wallet for live demo deposits
- Pre-trigger a drift scenario if possible (deposit unbalanced amounts)
- Keep voice pacing measured — aim for ~140 words per minute
- Total word count target: ~900-1000 words for 5 minutes
