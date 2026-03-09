#!/bin/bash
# ═══════════════════════════════════════════════════════════
# PeakBalance — Snowtrace Contract Verification Script
# Run from: contracts/ directory
# Prerequisites: 
#   1. Contracts deployed via DeployFuji.s.sol
#   2. Fill in addresses from deployments/fuji.json below
#   3. Set ROUTESCAN_API_KEY in .env (or pass via --etherscan-api-key)
# ═══════════════════════════════════════════════════════════

set -e

# Load env
source .env 2>/dev/null || true

# ── Verifier config ─────────────────────────────────────────
VERIFIER_URL="https://api.routescan.io/v2/network/testnet/evm/43113/etherscan"
CHAIN_ID=43113

# ── Deployed addresses (FILL AFTER DEPLOY) ──────────────────
CONSTRAINT_ENGINE="0xD257737006c06C99709513A0491D585D5689316b"
AGENT_REGISTRY="0xab8Fa229B57513d3EB11549AC4641FF1F4f469a3"
ORACLE_CONSUMER="0x9ccDEb0D1b28BbB05C5BD46c046E19c06a81E261"
PEAK_VAULT="0x9C12C19B00cAA9c7c23383F399924d26A0E06fDc"
PEAK_CONTROLLER="0x7cC8c5f8b41198b95185a39e365E8FB4aBae59df"
REPUTATION_AGGREGATOR="0xA4beE80EA6352dC1D5CbD83578af2448dfD459C0"
FEE_DISTRIBUTOR="0x8c85D2b2A6B4fc3aD1Ef7F03211Df65A212ce013"
STAKING_VAULT="0x2249952027B949f60b68772e33a029E22857e7AB"
AGENT_MARKETPLACE="0xdB045ac6bA8d7903fD3a566bFBf208955481dA49"

# ── External addresses ──────────────────────────────────────
USDC_FUJI="0x5425890298aed601595a70AB815c96711a31Bc65"
WAVAX_FUJI="0xd00ae08403B9bbb9124bB305C09058E32C39A48c"
TRADER_JOE_FUJI="0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30"
DEPLOYER="0x6602130E170195670407CeE93932C1B0b9454aDD" # deployer address

echo "=== PeakBalance Snowtrace Verification ==="
echo ""

# ─────────────────────────────────────────────────────────────
# 1. ConstraintEngine
# Constructor: (uint256, uint256, uint256, uint256, address[])
# ─────────────────────────────────────────────────────────────
echo "[1/9] Verifying ConstraintEngine..."
CONSTRAINT_ARGS=$(cast abi-encode "constructor(uint256,uint256,uint256,uint256,address[])" 500 10 1000 500 "[$TRADER_JOE_FUJI]")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$CONSTRAINT_ARGS" \
  "$CONSTRAINT_ENGINE" \
  src/ConstraintEngine.sol:ConstraintEngine

echo ""

# ─────────────────────────────────────────────────────────────
# 2. AgentRegistry
# Constructor: () — no args
# ─────────────────────────────────────────────────────────────
echo "[2/9] Verifying AgentRegistry..."
forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  "$AGENT_REGISTRY" \
  src/AgentRegistry.sol:AgentRegistry

echo ""

# ─────────────────────────────────────────────────────────────
# 3. OracleConsumer
# Constructor: (uint256 _queryFeeWei)
# ─────────────────────────────────────────────────────────────
echo "[3/9] Verifying OracleConsumer..."
ORACLE_ARGS=$(cast abi-encode "constructor(uint256)" 270000000000000)

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$ORACLE_ARGS" \
  "$ORACLE_CONSUMER" \
  src/OracleConsumer.sol:OracleConsumer

echo ""

# ─────────────────────────────────────────────────────────────
# 4. PeakVault
# Constructor: (address _constraintEngine, address _usdc, address _wavax)
# ─────────────────────────────────────────────────────────────
echo "[4/9] Verifying PeakVault..."
VAULT_ARGS=$(cast abi-encode "constructor(address,address,address)" "$CONSTRAINT_ENGINE" "$USDC_FUJI" "$WAVAX_FUJI")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$VAULT_ARGS" \
  "$PEAK_VAULT" \
  src/PeakVault.sol:PeakVault

echo ""

# ─────────────────────────────────────────────────────────────
# 5. PeakController
# Constructor: (address _vault, address _registry)
# ─────────────────────────────────────────────────────────────
echo "[5/9] Verifying PeakController..."
CONTROLLER_ARGS=$(cast abi-encode "constructor(address,address)" "$PEAK_VAULT" "$AGENT_REGISTRY")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$CONTROLLER_ARGS" \
  "$PEAK_CONTROLLER" \
  src/PeakController.sol:PeakController

echo ""

# ─────────────────────────────────────────────────────────────
# 6. ReputationAggregator
# Constructor: (address _registry)
# ─────────────────────────────────────────────────────────────
echo "[6/9] Verifying ReputationAggregator..."
REPAGG_ARGS=$(cast abi-encode "constructor(address)" "$AGENT_REGISTRY")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$REPAGG_ARGS" \
  "$REPUTATION_AGGREGATOR" \
  src/ReputationAggregator.sol:ReputationAggregator

echo ""

# ─────────────────────────────────────────────────────────────
# 7. FeeDistributor
# Constructor: (address _usdc, address _registry, address _protocolTreasury)
# ─────────────────────────────────────────────────────────────
echo "[7/9] Verifying FeeDistributor..."
FEEDIST_ARGS=$(cast abi-encode "constructor(address,address,address)" "$USDC_FUJI" "$AGENT_REGISTRY" "$DEPLOYER")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$FEEDIST_ARGS" \
  "$FEE_DISTRIBUTOR" \
  src/FeeDistributor.sol:FeeDistributor

echo ""

# ─────────────────────────────────────────────────────────────
# 8. StakingVault
# Constructor: (address _registry, address _marketplace, address _slashTreasury)
# Note: _marketplace was set to deployer address during initial deploy
# ─────────────────────────────────────────────────────────────
echo "[8/9] Verifying StakingVault..."
STAKING_ARGS=$(cast abi-encode "constructor(address,address,address)" "$AGENT_REGISTRY" "$DEPLOYER" "$DEPLOYER")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$STAKING_ARGS" \
  "$STAKING_VAULT" \
  src/StakingVault.sol:StakingVault

echo ""

# ─────────────────────────────────────────────────────────────
# 9. AgentMarketplace
# Constructor: (address _registry, address _stakingVault, address _usdc)
# ─────────────────────────────────────────────────────────────
echo "[9/9] Verifying AgentMarketplace..."
MARKETPLACE_ARGS=$(cast abi-encode "constructor(address,address,address)" "$AGENT_REGISTRY" "$STAKING_VAULT" "$USDC_FUJI")

forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --verifier-url $VERIFIER_URL \
  --etherscan-api-key "${ROUTESCAN_API_KEY}" \
  --constructor-args "$MARKETPLACE_ARGS" \
  "$AGENT_MARKETPLACE" \
  src/AgentMarketplace.sol:AgentMarketplace

echo ""
echo "=== All 9 contracts verification submitted ==="
echo "Check status at: https://testnet.snowtrace.io"
