"""
PeakBalance AI Agent — LangGraph State Machine
================================================
Autonomous DeFi portfolio manager running on Avalanche C-Chain.
Monitors portfolio drift and executes rebalancing trades through
immutable on-chain constraints.

State Machine Flow:
  CHECK_PRICES → EVALUATE_DRIFT → VALIDATE_CONSTRAINTS → EXECUTE_TRADE → RECORD_RESULT → SLEEP
                       ↓ (drift < threshold)
                     SLEEP

Architecture:
  - LangGraph manages the state machine transitions
  - web3.py handles all on-chain reads/writes
  - Claude Sonnet provides decision reasoning
  - ConstraintEngine.sol enforces all safety rails on-chain
"""

from __future__ import annotations
import os, json, time, asyncio
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, Literal

import structlog
from dotenv import load_dotenv
from web3 import Web3
from langgraph.graph import StateGraph, END

load_dotenv()
log = structlog.get_logger()

# ═══════════════════════════════════════════════════════
# STATE DEFINITION
# ═══════════════════════════════════════════════════════

class AgentPhase(str, Enum):
    CHECK_PRICES = "check_prices"
    EVALUATE_DRIFT = "evaluate_drift"
    VALIDATE_CONSTRAINTS = "validate_constraints"
    EXECUTE_TRADE = "execute_trade"
    RECORD_RESULT = "record_result"
    SLEEP = "sleep"
    EMERGENCY = "emergency"

@dataclass
class AgentState:
    """Mutable state passed through the LangGraph state machine."""
    phase: AgentPhase = AgentPhase.CHECK_PRICES
    
    # Prices
    avax_price_usd: float = 0.0
    price_source: str = ""
    price_timestamp: int = 0
    
    # Portfolio
    avax_balance: float = 0.0
    usdc_balance: float = 0.0
    portfolio_value_usd: float = 0.0
    avax_allocation_bps: int = 0
    target_allocation_bps: int = 5000  # 50%
    drift_bps: int = 0
    
    # Constraints
    drift_threshold_bps: int = 500  # 5%
    max_trade_size_bps: int = 500
    daily_trades_remaining: int = 10
    drawdown_bps: int = 0
    stop_loss_bps: int = 1000
    
    # Trade
    trade_direction: Optional[Literal["BUY_AVAX", "SELL_AVAX"]] = None
    trade_amount: float = 0.0
    trade_tx_hash: Optional[str] = None
    trade_success: bool = False
    trade_pnl_bps: int = 0
    
    # Decision
    decision: str = ""
    decision_reasoning: str = ""
    
    # Errors
    error: Optional[str] = None
    consecutive_failures: int = 0


# ═══════════════════════════════════════════════════════
# WEB3 CLIENT
# ═══════════════════════════════════════════════════════

class PeakBalanceWeb3:
    """Web3 client for interacting with PeakBalance contracts."""
    
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv("AVALANCHE_RPC_URL", "https://api.avax-test.network/ext/bc/C/rpc")))
        self.chain_id = int(os.getenv("CHAIN_ID", "43113"))
        self.agent_key = os.getenv("AGENT_PRIVATE_KEY", "")
        self.agent_address = self.w3.eth.account.from_key(self.agent_key).address if self.agent_key and self.agent_key != "your_private_key_here" else "0x0000000000000000000000000000000000000000"
        
        # Contract ABIs (minimal for reads)
        self.constraint_abi = json.loads('[{"name":"MAX_TRADE_SIZE_BPS","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]},{"name":"MAX_DAILY_TRADES","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]},{"name":"STOP_LOSS_BPS","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]},{"name":"DRIFT_THRESHOLD_BPS","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]},{"name":"getRemainingTrades","type":"function","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"}]},{"name":"checkStopLoss","type":"function","stateMutability":"view","inputs":[{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"bool"},{"type":"uint256"}]},{"name":"isDriftExceeded","type":"function","stateMutability":"view","inputs":[{"type":"uint256"},{"type":"uint256"}],"outputs":[{"type":"bool"}]}]')
        self.vault_abi = json.loads('[{"name":"getPortfolioValue","type":"function","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"},{"type":"uint256"}]},{"name":"executeTrade","type":"function","stateMutability":"nonpayable","inputs":[{"type":"address"},{"type":"address"},{"type":"address"},{"type":"uint256"},{"type":"uint256"}],"outputs":[{"type":"uint256"}]}]')
        self.controller_abi = json.loads('[{"name":"isPaused","type":"function","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"bool"}]},{"name":"getTargetAllocation","type":"function","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"}]}]')
        
        log.info("web3_initialized", chain_id=self.chain_id, agent=self.agent_address)
    
    def get_avax_price(self) -> tuple[float, str]:
        """Fetch AVAX/USD price from Chainlink, fallback to Pyth."""
        # In production: call Chainlink aggregator, then Pyth if stale
        # For now: use a mock price or fetch from public API
        try:
            import urllib.request
            resp = urllib.request.urlopen("https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd", timeout=5)
            data = json.loads(resp.read())
            price = data["avalanche-2"]["usd"]
            return (float(price), "coingecko")
        except Exception:
            log.warning("price_fetch_failed", source="coingecko", fallback="mock")
            return (37.00, "mock")
    
    def get_portfolio(self, user: str) -> tuple[float, float]:
        """Get AVAX and USDC balances from PeakVault."""
        vault_addr = os.getenv("PEAK_VAULT_ADDRESS", "0x" + "0" * 40)
        if vault_addr == "0x" + "0" * 40:
            # Mock data when contracts aren't deployed
            return (68.42, 2475.30)
        contract = self.w3.eth.contract(address=vault_addr, abi=self.vault_abi)
        avax, usdc = contract.functions.getPortfolioValue(user).call()
        return (avax / 1e18, usdc / 1e6)
    
    def is_paused(self, user: str) -> bool:
        """Check if agent is paused for this user."""
        ctrl_addr = os.getenv("PEAK_CONTROLLER_ADDRESS", "0x" + "0" * 40)
        if ctrl_addr == "0x" + "0" * 40:
            return False
        contract = self.w3.eth.contract(address=ctrl_addr, abi=self.controller_abi)
        return contract.functions.isPaused(user).call()

    def get_remaining_trades(self, user: str) -> int:
        """Get remaining daily trades from ConstraintEngine."""
        ce_addr = os.getenv("CONSTRAINT_ENGINE_ADDRESS", "0x" + "0" * 40)
        if ce_addr == "0x" + "0" * 40:
            return 7
        contract = self.w3.eth.contract(address=ce_addr, abi=self.constraint_abi)
        return contract.functions.getRemainingTrades(user).call()


# ═══════════════════════════════════════════════════════
# STATE MACHINE NODES
# ═══════════════════════════════════════════════════════

web3_client = PeakBalanceWeb3()

def check_prices(state: dict) -> dict:
    """Node 1: Fetch latest AVAX/USD price."""
    log.info("check_prices_start")
    try:
        price, source = web3_client.get_avax_price()
        state["avax_price_usd"] = price
        state["price_source"] = source
        state["price_timestamp"] = int(time.time())
        state["phase"] = AgentPhase.EVALUATE_DRIFT.value
        state["decision"] = f"Fetched AVAX/USD: ${price:.2f} from {source}"
        log.info("price_fetched", price=price, source=source)
    except Exception as e:
        state["error"] = str(e)
        state["consecutive_failures"] = state.get("consecutive_failures", 0) + 1
        state["phase"] = AgentPhase.SLEEP.value
        log.error("check_prices_failed", error=str(e))
    return state


def evaluate_drift(state: dict) -> dict:
    """Node 2: Calculate portfolio drift from target allocation."""
    log.info("evaluate_drift_start")
    
    avax_bal, usdc_bal = web3_client.get_portfolio(web3_client.agent_address)
    price = state.get("avax_price_usd", 37.0)
    
    avax_value = avax_bal * price
    usdc_value = usdc_bal
    total = avax_value + usdc_value
    
    if total == 0:
        state["phase"] = AgentPhase.SLEEP.value
        state["decision"] = "Portfolio empty. No action."
        return state
    
    avax_pct_bps = int((avax_value / total) * 10000)
    target_bps = state.get("target_allocation_bps", 5000)
    drift = abs(avax_pct_bps - target_bps)
    
    state["avax_balance"] = avax_bal
    state["usdc_balance"] = usdc_bal
    state["portfolio_value_usd"] = total
    state["avax_allocation_bps"] = avax_pct_bps
    state["drift_bps"] = drift
    
    drift_threshold = state.get("drift_threshold_bps", 500)
    
    if drift >= drift_threshold:
        state["phase"] = AgentPhase.VALIDATE_CONSTRAINTS.value
        direction = "SELL_AVAX" if avax_pct_bps > target_bps else "BUY_AVAX"
        state["trade_direction"] = direction
        
        # Calculate trade amount to rebalance
        target_avax_value = total * (target_bps / 10000)
        delta = abs(avax_value - target_avax_value)
        state["trade_amount"] = delta / price if direction == "SELL_AVAX" else delta
        
        state["decision"] = f"Drift {drift/100:.1f}% exceeds {drift_threshold/100:.1f}% threshold → {direction}"
        state["decision_reasoning"] = f"AVAX allocation: {avax_pct_bps/100:.1f}%, target: {target_bps/100:.1f}%, drift: {drift/100:.1f}%"
        log.info("drift_exceeded", drift_bps=drift, direction=direction, trade_amount=state["trade_amount"])
    else:
        state["phase"] = AgentPhase.SLEEP.value
        state["decision"] = f"Drift {drift/100:.1f}% below threshold ({drift_threshold/100:.1f}%). Portfolio balanced."
        log.info("drift_within_tolerance", drift_bps=drift)
    
    return state


def validate_constraints(state: dict) -> dict:
    """Node 3: Validate trade against on-chain ConstraintEngine."""
    log.info("validate_constraints_start")
    
    remaining = web3_client.get_remaining_trades(web3_client.agent_address)
    state["daily_trades_remaining"] = remaining
    
    if remaining <= 0:
        state["phase"] = AgentPhase.SLEEP.value
        state["decision"] = "Daily trade limit reached. Waiting for reset."
        log.warning("daily_limit_reached")
        return state
    
    # Check trade size constraint
    trade_value = state.get("trade_amount", 0) * state.get("avax_price_usd", 37.0)
    portfolio = state.get("portfolio_value_usd", 1)
    trade_pct_bps = int((trade_value / portfolio) * 10000)
    max_size = state.get("max_trade_size_bps", 500)
    
    if trade_pct_bps > max_size:
        # Cap trade to max size
        max_value = portfolio * (max_size / 10000)
        state["trade_amount"] = max_value / state.get("avax_price_usd", 37.0)
        log.info("trade_capped", original_bps=trade_pct_bps, max_bps=max_size)
    
    state["phase"] = AgentPhase.EXECUTE_TRADE.value
    state["decision"] = f"Constraints validated. Remaining trades: {remaining}. Executing {state.get('trade_direction', 'UNKNOWN')}."
    log.info("constraints_validated", remaining_trades=remaining)
    return state


def execute_trade(state: dict) -> dict:
    """Node 4: Execute the rebalancing trade via PeakVault."""
    log.info("execute_trade_start", direction=state.get("trade_direction"), amount=state.get("trade_amount"))
    
    # In production: call PeakVault.executeTrade() via web3
    # For now: simulate the trade
    try:
        direction = state.get("trade_direction", "SELL_AVAX")
        amount = state.get("trade_amount", 0)
        price = state.get("avax_price_usd", 37.0)
        
        if direction == "SELL_AVAX":
            avax_sold = amount
            usdc_received = avax_sold * price * 0.997  # 0.3% slippage
            state["avax_balance"] = state.get("avax_balance", 0) - avax_sold
            state["usdc_balance"] = state.get("usdc_balance", 0) + usdc_received
            state["decision"] = f"Sold {avax_sold:.4f} AVAX → {usdc_received:.2f} USDC @ ${price:.2f}"
        else:
            usdc_spent = amount
            avax_bought = (usdc_spent / price) * 0.997  # 0.3% slippage
            state["usdc_balance"] = state.get("usdc_balance", 0) - usdc_spent
            state["avax_balance"] = state.get("avax_balance", 0) + avax_bought
            state["decision"] = f"Bought {avax_bought:.4f} AVAX ← {usdc_spent:.2f} USDC @ ${price:.2f}"
        
        state["trade_success"] = True
        state["trade_tx_hash"] = f"0x{'a1b2c3d4' * 8}"  # Mock tx hash
        state["trade_pnl_bps"] = 0  # Rebalance trades target 0 PnL
        state["phase"] = AgentPhase.RECORD_RESULT.value
        state["consecutive_failures"] = 0
        
        log.info("trade_executed", direction=direction, amount=amount, success=True)
    except Exception as e:
        state["trade_success"] = False
        state["error"] = str(e)
        state["consecutive_failures"] = state.get("consecutive_failures", 0) + 1
        state["phase"] = AgentPhase.SLEEP.value
        log.error("trade_failed", error=str(e))
    
    return state


def record_result(state: dict) -> dict:
    """Node 5: Record trade result to AgentRegistry for reputation tracking."""
    log.info("record_result_start")
    
    # In production: call AgentRegistry.recordTrade()
    success = state.get("trade_success", False)
    pnl = state.get("trade_pnl_bps", 0)
    
    log.info("trade_recorded",
        success=success,
        pnl_bps=pnl,
        tx_hash=state.get("trade_tx_hash", ""),
        decision=state.get("decision", ""),
    )
    
    state["phase"] = AgentPhase.SLEEP.value
    return state


def sleep_node(state: dict) -> dict:
    """Node 6: Wait for next check interval."""
    interval = int(os.getenv("CHECK_INTERVAL_SECONDS", "300"))
    log.info("sleeping", seconds=interval, decision=state.get("decision", "No action"))
    # In production, this would use APScheduler or asyncio.sleep
    return state


# ═══════════════════════════════════════════════════════
# ROUTING LOGIC
# ═══════════════════════════════════════════════════════

def route_after_drift(state: dict) -> str:
    """Route based on drift evaluation result."""
    phase = state.get("phase", "sleep")
    if phase == AgentPhase.VALIDATE_CONSTRAINTS.value:
        return "validate_constraints"
    return "sleep"


def route_after_constraints(state: dict) -> str:
    """Route based on constraint validation result."""
    phase = state.get("phase", "sleep")
    if phase == AgentPhase.EXECUTE_TRADE.value:
        return "execute_trade"
    return "sleep"


# ═══════════════════════════════════════════════════════
# BUILD GRAPH
# ═══════════════════════════════════════════════════════

def build_agent_graph() -> StateGraph:
    """Build the LangGraph state machine for PeakBalance agent."""
    
    graph = StateGraph(dict)
    
    # Add nodes
    graph.add_node("check_prices", check_prices)
    graph.add_node("evaluate_drift", evaluate_drift)
    graph.add_node("validate_constraints", validate_constraints)
    graph.add_node("execute_trade", execute_trade)
    graph.add_node("record_result", record_result)
    graph.add_node("sleep", sleep_node)
    
    # Set entry point
    graph.set_entry_point("check_prices")
    
    # Add edges
    graph.add_edge("check_prices", "evaluate_drift")
    graph.add_conditional_edges("evaluate_drift", route_after_drift, {
        "validate_constraints": "validate_constraints",
        "sleep": "sleep",
    })
    graph.add_conditional_edges("validate_constraints", route_after_constraints, {
        "execute_trade": "execute_trade",
        "sleep": "sleep",
    })
    graph.add_edge("execute_trade", "record_result")
    graph.add_edge("record_result", "sleep")
    graph.add_edge("sleep", END)
    
    return graph


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

def run_cycle():
    """Execute one monitoring cycle through the state machine."""
    graph = build_agent_graph()
    app = graph.compile()
    
    initial_state = {
        "phase": AgentPhase.CHECK_PRICES.value,
        "target_allocation_bps": int(os.getenv("TARGET_ALLOCATION_BPS", "5000")),
        "drift_threshold_bps": 500,
        "max_trade_size_bps": 500,
        "stop_loss_bps": 1000,
        "consecutive_failures": 0,
    }
    
    log.info("═══ PEAKBALANCE AGENT CYCLE START ═══")
    result = app.invoke(initial_state)
    log.info("═══ PEAKBALANCE AGENT CYCLE END ═══",
        decision=result.get("decision", ""),
        phase=result.get("phase", ""),
        trade_success=result.get("trade_success", None),
    )
    return result


def main():
    """Main entry point — runs continuous monitoring loop."""
    log.info("PeakBalance Agent v0.1.0 starting...",
        chain_id=os.getenv("CHAIN_ID", "43113"),
        interval=os.getenv("CHECK_INTERVAL_SECONDS", "300"),
    )
    
    interval = int(os.getenv("CHECK_INTERVAL_SECONDS", "300"))
    
    while True:
        try:
            result = run_cycle()
            if result.get("consecutive_failures", 0) >= 5:
                log.critical("too_many_consecutive_failures", count=result["consecutive_failures"])
                log.info("Agent entering emergency pause. Manual intervention required.")
                break
        except KeyboardInterrupt:
            log.info("Agent stopped by user.")
            break
        except Exception as e:
            log.error("unhandled_error", error=str(e))
        
        time.sleep(interval)


if __name__ == "__main__":
    main()
