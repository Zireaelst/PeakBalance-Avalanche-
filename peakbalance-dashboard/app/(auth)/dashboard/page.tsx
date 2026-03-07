'use client';

import { BalanceCards } from '@/components/dashboard/BalanceCards';
import { AllocationRing } from '@/components/dashboard/AllocationRing';
import { AgentStatusWidget } from '@/components/dashboard/AgentStatus';
import { QuickControls } from '@/components/dashboard/QuickControls';
import { DecisionFeed } from '@/components/agent/DecisionFeed';
import { ConstraintBar } from '@/components/ui/ConstraintBar';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import {
    MOCK_PORTFOLIO,
    MOCK_AGENT_STATUS,
    MOCK_CONSTRAINTS,
    MOCK_DECISIONS,
} from '@/lib/mock-data';

export default function DashboardPage() {
    const portfolio = MOCK_PORTFOLIO;
    const agentStatus = MOCK_AGENT_STATUS;
    const constraints = MOCK_CONSTRAINTS;
    const recentDecisions = MOCK_DECISIONS.slice(0, 5);

    return (
        <div>
            {/* Row 1: Balance Cards */}
            <BalanceCards portfolio={portfolio} />

            <Divider char="═" />

            {/* Row 2: Allocation Ring + Agent Status + Constraints */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1px',
                    background: '#2a2a2a',
                }}
            >
                {/* Allocation Ring */}
                <div
                    style={{
                        background: '#161616',
                        padding: '20px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ marginBottom: 8, alignSelf: 'flex-start' }}>
                        <SectionLabel label="ALLOCATION" />
                    </div>
                    <AllocationRing avaxPct={portfolio.avaxPct} usdcPct={portfolio.usdcPct} />
                </div>

                {/* Agent Status */}
                <AgentStatusWidget status={agentStatus} />

                {/* Constraints Summary */}
                <div
                    style={{
                        background: '#161616',
                        padding: '14px 16px',
                    }}
                >
                    <SectionLabel label="CONSTRAINT_ENGINE" />
                    <div style={{ marginTop: 8 }}>
                        <ConstraintBar
                            label="DAILY_TRADES"
                            current={constraints.currentDailyTrades}
                            max={constraints.maxDailyTrades}
                        />
                        <ConstraintBar
                            label="DRAWDOWN"
                            current={constraints.currentDrawdown}
                            max={constraints.stopLossThreshold}
                            unit="%"
                        />
                        <ConstraintBar
                            label="DRIFT"
                            current={constraints.currentDrift}
                            max={constraints.driftThreshold}
                            unit="%"
                        />
                        <ConstraintBar
                            label="MAX_TRADE"
                            current={constraints.maxTradeSizePct}
                            max={constraints.maxTradeSizePct}
                            unit="%"
                        />
                    </div>
                </div>
            </div>

            <Divider char="═" />

            {/* Row 3: Quick Controls */}
            <QuickControls />

            <Divider char="─" />

            {/* Row 4: Recent Decisions */}
            <DecisionFeed decisions={recentDecisions} />
        </div>
    );
}
