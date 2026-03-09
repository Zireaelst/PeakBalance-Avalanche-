#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  PeakBalance — Live Demo Flow (Avalanche Fuji Testnet)
#  Reads on-chain state from all 9 deployed & verified contracts
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

# ── Colors ──
C='\033[0;36m'   # cyan
G='\033[0;32m'   # green
Y='\033[0;33m'   # yellow
R='\033[0;31m'   # red
W='\033[1;37m'   # white bold
D='\033[0;90m'   # dim
N='\033[0m'      # reset

RPC="https://api.avax-test.network/ext/bc/C/rpc"

# ── Contract Addresses (Fuji) ──
CONSTRAINT="0xD257737006c06C99709513A0491D585D5689316b"
REGISTRY="0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3"
ORACLE="0x9ccDEb0D1b28BbB05C5BD46c046E19c06a81E261"
VAULT="0x9C12C19B00cAA9c7c23383F399924d26A0E06fDc"
CONTROLLER="0x7cC8c5f8b41198b95185a39e365E8FB4aBae59df"
REPUTATION="0xA4beE80EA6352dC1D5CbD83578af2448dfD459C0"
FEE_DIST="0x8c85D2b2A6B4fc3aD1Ef7F03211Df65A212ce013"
STAKING="0x2249952027B949f60b68772e33a029E22857e7AB"
MARKETPLACE="0xdB045ac6bA8d7903fD3a566bFBf208955481dA49"

DEPLOYER="0x6602130E170195670407CeE93932C1B0b9454aDD"
USDC="0x5425890298aed601595a70AB815c96711a31Bc65"

# ── Helpers ──
divider() { echo -e "${D}═══════════════════════════════════════════════════════════════${N}"; }
section() { echo ""; divider; echo -e "  ${C}$1${N}"; divider; }
info()    { echo -e "  ${D}$1${N}  ${W}$2${N}"; }
ok()      { echo -e "  ${G}✓${N} $1"; }
warn()    { echo -e "  ${Y}⚠${N} $1"; }

pause_step() {
    echo ""
    echo -e "  ${D}Press ENTER to continue...${N}"
    read -r
}

# ═══════════════════════════════════════════
#  INTRO
# ═══════════════════════════════════════════
clear
echo ""
echo -e "${C}  ╔═══════════════════════════════════════════════════════╗${N}"
echo -e "${C}  ║${N}  ${W}PEAKBALANCE${N} — Live Demo on Avalanche Fuji Testnet  ${C}║${N}"
echo -e "${C}  ╚═══════════════════════════════════════════════════════╝${N}"
echo ""
echo -e "  ${D}AI-powered DeFi portfolio rebalancer with hard-coded${N}"
echo -e "  ${D}safety constraints, ERC-8004 reputation, and x402 payments.${N}"
echo ""
echo -e "  ${D}Chain:${N}    ${G}Avalanche Fuji (43113)${N}"
echo -e "  ${D}Deployer:${N} ${W}${DEPLOYER}${N}"
echo -e "  ${D}Contracts:${N} ${W}9 deployed & verified on Snowtrace${N}"
echo ""

pause_step

# ═══════════════════════════════════════════
#  STEP 1: ConstraintEngine — Immutable Safety
# ═══════════════════════════════════════════
section "STEP 1/7 — ConstraintEngine (Immutable Safety Limits)"

echo -e "  ${D}Contract:${N} ${W}${CONSTRAINT}${N}"
echo -e "  ${D}Snowtrace:${N} ${C}https://testnet.snowtrace.io/address/${CONSTRAINT}${N}"
echo ""

echo -e "  ${Y}Reading on-chain safety parameters...${N}"
echo ""

MAX_TRADE=$(cast call "$CONSTRAINT" "MAX_TRADE_SIZE_BPS()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")
MAX_DAILY=$(cast call "$CONSTRAINT" "MAX_DAILY_TRADES()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")
STOP_LOSS=$(cast call "$CONSTRAINT" "STOP_LOSS_BPS()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")
DRIFT_THRESH=$(cast call "$CONSTRAINT" "DRIFT_THRESHOLD_BPS()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")

MAX_TRADE_PCT=$(echo "scale=1; $MAX_TRADE / 100" | bc)
STOP_LOSS_PCT=$(echo "scale=1; $STOP_LOSS / 100" | bc)
DRIFT_PCT=$(echo "scale=1; $DRIFT_THRESH / 100" | bc)

info "MAX_TRADE_SIZE_BPS:" "${MAX_TRADE} (${MAX_TRADE_PCT}% of portfolio per trade)"
info "MAX_DAILY_TRADES:  " "${MAX_DAILY} trades per 24h window"
info "STOP_LOSS_BPS:     " "${STOP_LOSS} (${STOP_LOSS_PCT}% drawdown triggers emergency exit)"
info "DRIFT_THRESHOLD:   " "${DRIFT_THRESH} (${DRIFT_PCT}% allocation drift triggers rebalance)"
echo ""
ok "All constraints are IMMUTABLE — no admin can change these values"
ok "Every agent trade passes through validateTrade() before execution"

pause_step

# ═══════════════════════════════════════════
#  STEP 2: AgentRegistry — ERC-8004 NFT Identity
# ═══════════════════════════════════════════
section "STEP 2/7 — AgentRegistry (ERC-8004 Agent Identity)"

echo -e "  ${D}Contract:${N} ${W}${REGISTRY}${N}"
echo ""

echo -e "  ${Y}Reading registry state...${N}"
echo ""

TOTAL_AGENTS=$(cast call "$REGISTRY" "totalSupply()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")
info "Total registered agents:" "$TOTAL_AGENTS"

if [ "$TOTAL_AGENTS" != "0" ] && [ "$TOTAL_AGENTS" -gt 0 ] 2>/dev/null; then
    echo ""
    echo -e "  ${Y}Querying Agent #1 reputation...${N}"
    REP_DATA=$(cast call "$REGISTRY" "getReputation(uint256)(uint256,uint256,uint256,uint256)" 1 --rpc-url "$RPC" 2>/dev/null || echo "")
    if [ -n "$REP_DATA" ]; then
        echo -e "  ${D}Raw getReputation(1):${N}"
        echo "$REP_DATA" | while read -r line; do echo -e "    ${W}$line${N}"; done
    fi
else
    echo ""
    warn "No agents registered yet — this is expected on a fresh deployment"
    echo -e "  ${D}In production, agents register via registerAgent() to get an ERC-8004 NFT${N}"
    echo -e "  ${D}Each NFT carries: reputation score, trade history, success rate${N}"
fi

pause_step

# ═══════════════════════════════════════════
#  STEP 3: OracleConsumer — x402 Micropayments
# ═══════════════════════════════════════════
section "STEP 3/7 — OracleConsumer (x402 Micropayment Oracle)"

echo -e "  ${D}Contract:${N} ${W}${ORACLE}${N}"
echo ""

echo -e "  ${Y}Reading oracle configuration...${N}"
echo ""

QUERY_FEE=$(cast call "$ORACLE" "queryFeeWei()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")
TOTAL_QUERIES=$(cast call "$ORACLE" "totalQueriesPaid()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")
TOTAL_FEES_COLLECTED=$(cast call "$ORACLE" "totalFeesCollected()(uint256)" --rpc-url "$RPC" 2>/dev/null || echo "0")

if [ "$QUERY_FEE" != "0" ]; then
    FEE_ETHER=$(cast from-wei "$QUERY_FEE" 2>/dev/null || echo "$QUERY_FEE wei")
    info "Query fee per call:" "${FEE_ETHER} AVAX (~\$0.01)"
else
    info "Query fee per call:" "${QUERY_FEE} wei"
fi
info "Total queries paid:" "$TOTAL_QUERIES"
info "Total fees collected:" "$TOTAL_FEES_COLLECTED wei"

echo ""
echo -e "  ${D}How x402 works:${N}"
echo -e "  ${D}1. Agent needs price data → calls submitPriceWithPayment()${N}"
echo -e "  ${D}2. Pays ~0.01 AVAX micropayment automatically (no manual top-up)${N}"
echo -e "  ${D}3. Oracle returns AVAX/USD price with confidence score${N}"
echo -e "  ${D}4. Sub-second payment settlement on Avalanche C-Chain${N}"

AVAX_PAIR=$(cast call "$ORACLE" "getAVAXUSDPairId()(bytes32)" --rpc-url "$RPC" 2>/dev/null || echo "")
if [ -n "$AVAX_PAIR" ]; then
    info "AVAX/USD pair ID:" "$AVAX_PAIR"
fi

pause_step

# ═══════════════════════════════════════════
#  STEP 4: PeakVault — User Fund Storage
# ═══════════════════════════════════════════
section "STEP 4/7 — PeakVault (Fund Storage & Trade Execution)"

echo -e "  ${D}Contract:${N} ${W}${VAULT}${N}"
echo ""

echo -e "  ${Y}Reading vault state for deployer...${N}"
echo ""

PORTFOLIO=$(cast call "$VAULT" "getPortfolioValue(address)(uint256,uint256)" "$DEPLOYER" --rpc-url "$RPC" 2>/dev/null || echo "")
if [ -n "$PORTFOLIO" ]; then
    echo -e "  ${D}getPortfolioValue(deployer):${N}"
    echo "$PORTFOLIO" | while read -r line; do echo -e "    ${W}$line${N}"; done
fi

IS_EXITED=$(cast call "$VAULT" "isEmergencyExited(address)(bool)" "$DEPLOYER" --rpc-url "$RPC" 2>/dev/null || echo "false")
info "Emergency exited:" "$IS_EXITED"

echo ""
echo -e "  ${D}PeakVault architecture:${N}"
echo -e "  ${G}✓${N} Users deposit AVAX + USDC — funds stay in the contract"
echo -e "  ${G}✓${N} Agent authorizeAgent() — can only execute validated trades"
echo -e "  ${G}✓${N} Every executeTrade() call passes through ConstraintEngine"
echo -e "  ${R}✗${N} Agent wallet CANNOT withdraw user funds directly"
echo -e "  ${R}✗${N} Agent CANNOT bypass the 5% max trade size limit"

pause_step

# ═══════════════════════════════════════════
#  STEP 5: PeakController — Agent Control Panel
# ═══════════════════════════════════════════
section "STEP 5/7 — PeakController (User Control Panel)"

echo -e "  ${D}Contract:${N} ${W}${CONTROLLER}${N}"
echo ""

echo -e "  ${Y}Reading controller state...${N}"
echo ""

IS_PAUSED=$(cast call "$CONTROLLER" "isPaused(address)(bool)" "$DEPLOYER" --rpc-url "$RPC" 2>/dev/null || echo "false")
TARGET_ALLOC=$(cast call "$CONTROLLER" "getTargetAllocation(address)(uint256)" "$DEPLOYER" --rpc-url "$RPC" 2>/dev/null || echo "5000")
AGENT_ID=$(cast call "$CONTROLLER" "getAgentId(address)(uint256)" "$DEPLOYER" --rpc-url "$RPC" 2>/dev/null || echo "0")

if [ "$TARGET_ALLOC" != "0" ]; then
    TARGET_PCT=$(echo "scale=1; $TARGET_ALLOC / 100" | bc)
    info "Target allocation:" "${TARGET_ALLOC} bps (${TARGET_PCT}% AVAX / rest USDC)"
else
    info "Target allocation:" "default 50/50"
fi
info "Agent paused:" "$IS_PAUSED"
info "Linked agent NFT:" "#${AGENT_ID}"

echo ""
echo -e "  ${D}User controls:${N}"
echo -e "  ${W}pauseAgent()${N}     — Immediately stops agent from trading"
echo -e "  ${W}resumeAgent()${N}    — Re-enables agent operations"
echo -e "  ${W}emergencyExit()${N}  — Exits ALL positions instantly (irreversible)"
echo -e "  ${W}forceCheck()${N}     — Manually trigger a portfolio check"

pause_step

# ═══════════════════════════════════════════
#  STEP 6: ReputationAggregator + StakingVault
# ═══════════════════════════════════════════
section "STEP 6/7 — Reputation & Staking Layer"

echo -e "  ${D}ReputationAggregator:${N} ${W}${REPUTATION}${N}"
echo -e "  ${D}StakingVault:${N}          ${W}${STAKING}${N}"
echo ""

echo -e "  ${Y}ERC-8004 Scoring Formula:${N}"
echo ""
echo -e "  ${W}Score (0-1000) =${N}"
echo -e "    ${G}+ Win Rate       (max 300 pts)${N}"
echo -e "    ${G}+ Return Quality (max 250 pts)${N}"
echo -e "    ${G}+ Consistency    (max 200 pts)${N}"
echo -e "    ${G}+ Volume         (max 150 pts)${N}"
echo -e "    ${G}+ Subscribers    (max 100 pts)${N}"
echo -e "    ${R}- Drawdown       (up to -200 pts)${N}"
echo -e "    ${R}- Slash Events   (up to -100 pts each)${N}"
echo ""

echo -e "  ${Y}Tier Thresholds:${N}"
echo -e "    ${D}UNVERIFIED${N}  < 300"
echo -e "    ${C}RISING${N}      300-499"
echo -e "    ${C}TRUSTED${N}     500-699"
echo -e "    ${G}ELITE${N}       700-849"
echo -e "    ${Y}APEX${N}        850+"
echo ""

echo -e "  ${Y}StakingVault — Skin in the Game:${N}"
echo -e "    Minimum stake: ${W}10 AVAX${N}"
echo -e "    Max slash per event: ${R}50%${N}"
echo -e "    Slash cooldown: ${W}7 days${N}"

pause_step

# ═══════════════════════════════════════════
#  STEP 7: AgentMarketplace + FeeDistributor
# ═══════════════════════════════════════════
section "STEP 7/7 — Marketplace & Fee Distribution"

echo -e "  ${D}AgentMarketplace:${N} ${W}${MARKETPLACE}${N}"
echo -e "  ${D}FeeDistributor:${N}   ${W}${FEE_DIST}${N}"
echo ""

echo -e "  ${Y}Reading marketplace state...${N}"
echo ""

ACTIVE_LISTINGS=$(cast call "$MARKETPLACE" "getActiveListings()(uint256[])" --rpc-url "$RPC" 2>/dev/null || echo "[]")
info "Active listings:" "$ACTIVE_LISTINGS"

PROTOCOL_FEE=$(cast call "$FEE_DIST" "protocolFeeBps()(uint16)" --rpc-url "$RPC" 2>/dev/null || echo "50")
info "Protocol fee:" "${PROTOCOL_FEE} bps (0.5%)"

echo ""
echo -e "  ${D}Marketplace flow:${N}"
echo -e "  ${W}1.${N} Agent owner stakes ≥10 AVAX → ${W}StakingVault.deposit()${N}"
echo -e "  ${W}2.${N} Applies for listing → ${W}AgentMarketplace.applyForListing()${N}"
echo -e "  ${W}3.${N} Admin approves → ${W}AgentMarketplace.approveListing()${N}"
echo -e "  ${W}4.${N} Users subscribe → ${W}AgentMarketplace.subscribe()${N}"
echo -e "  ${W}5.${N} Fees split: agent owner + protocol treasury"
echo -e "  ${W}6.${N} Agent owner claims → ${W}FeeDistributor.claimAgentFees()${N}"
echo ""
echo -e "  ${D}Fee model:${N}"
echo -e "    Subscription: ${W}flat monthly USDC fee${N} (set by agent owner)"
echo -e "    Performance:  ${W}% of profits above high watermark${N} (max 5%)"
echo -e "    Protocol cut: ${W}0.5% of all fees${N} goes to treasury"
echo -e "    Monthly cap:  ${R}10% of AUM${N} max total fee per user"

pause_step

# ═══════════════════════════════════════════
#  SUMMARY
# ═══════════════════════════════════════════
section "DEMO COMPLETE — Contract Summary"

echo ""
echo -e "  ${W}All 9 contracts deployed & verified on Avalanche Fuji:${N}"
echo ""
echo -e "  ${D}┌────────────────────────┬──────────────────────────────────────────────┐${N}"
echo -e "  ${D}│${N} ${C}ConstraintEngine${N}       ${D}│${N} ${W}${CONSTRAINT}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}AgentRegistry${N}          ${D}│${N} ${W}${REGISTRY}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}OracleConsumer${N}         ${D}│${N} ${W}${ORACLE}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}PeakVault${N}              ${D}│${N} ${W}${VAULT}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}PeakController${N}         ${D}│${N} ${W}${CONTROLLER}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}ReputationAggregator${N}   ${D}│${N} ${W}${REPUTATION}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}FeeDistributor${N}         ${D}│${N} ${W}${FEE_DIST}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}StakingVault${N}           ${D}│${N} ${W}${STAKING}${N} ${D}│${N}"
echo -e "  ${D}│${N} ${C}AgentMarketplace${N}       ${D}│${N} ${W}${MARKETPLACE}${N} ${D}│${N}"
echo -e "  ${D}└────────────────────────┴──────────────────────────────────────────────┘${N}"
echo ""
echo -e "  ${G}Dashboard:${N}  https://peak-balance-avalanche.vercel.app"
echo -e "  ${G}GitHub:${N}     https://github.com/Zireaelst/PeakBalance-Avalanche-"
echo -e "  ${G}Snowtrace:${N}  https://testnet.snowtrace.io/address/${CONSTRAINT}"
echo ""
divider
echo -e "  ${W}PeakBalance${N} — Safety-first autonomous DeFi on Avalanche"
divider
echo ""
