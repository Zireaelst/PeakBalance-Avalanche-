'use client';
import { BalanceCards } from '@/components/dashboard/BalanceCards';
import { AllocationRing } from '@/components/dashboard/AllocationRing';
import { AgentStatusWidget } from '@/components/dashboard/AgentStatus';
import { QuickControls } from '@/components/dashboard/QuickControls';
import { PortfolioChart } from '@/components/dashboard/PortfolioChart';
import { DecisionFeed } from '@/components/agent/DecisionFeed';
import { ConstraintBar } from '@/components/ui/ConstraintBar';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { MOCK_PORTFOLIO, MOCK_AGENT_STATUS, MOCK_CONSTRAINTS, MOCK_DECISIONS } from '@/lib/mock-data';

const NOW = Date.now();
const DAY = 86400_000;
const MOCK_CHART_DATA = [
    { timestamp: NOW - 7 * DAY, value: 4820 },
    { timestamp: NOW - 6 * DAY, value: 4785 },
    { timestamp: NOW - 5 * DAY, value: 4910 },
    { timestamp: NOW - 4 * DAY, value: 4875 },
    { timestamp: NOW - 3 * DAY, value: 4960 },
    { timestamp: NOW - 2 * DAY, value: 4930 },
    { timestamp: NOW - 1 * DAY, value: 5020 },
    { timestamp: NOW, value: 5007 },
];

export default function DashboardPage() {
    const p = MOCK_PORTFOLIO, s = MOCK_AGENT_STATUS, c = MOCK_CONSTRAINTS;
    return (
        <div>
            <BalanceCards portfolio={p} />
            <Divider char="═" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: '#2a2a2a' }}>
                <div style={{ background: '#161616', padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 8, alignSelf: 'flex-start' }}><SectionLabel label="ALLOCATION" /></div>
                    <AllocationRing avaxPct={p.avaxPct} usdcPct={p.usdcPct} />
                </div>
                <AgentStatusWidget status={s} />
                <div style={{ background: '#161616', padding: '14px 16px' }}>
                    <SectionLabel label="CONSTRAINT_ENGINE" />
                    <div style={{ marginTop: 8 }}>
                        <ConstraintBar label="DAILY_TRADES" current={c.currentDailyTrades} max={c.maxDailyTrades} />
                        <ConstraintBar label="DRAWDOWN" current={c.currentDrawdown} max={c.stopLossThreshold} unit="%" />
                        <ConstraintBar label="DRIFT" current={c.currentDrift} max={c.driftThreshold} unit="%" />
                        <ConstraintBar label="MAX_TRADE" current={c.maxTradeSizePct} max={c.maxTradeSizePct} unit="%" />
                    </div>
                </div>
            </div>
            <Divider char="═" />
            <PortfolioChart data={MOCK_CHART_DATA} />
            <Divider char="═" />
            <QuickControls />
            <Divider char="─" />
            <DecisionFeed decisions={MOCK_DECISIONS.slice(0, 5)} />
        </div>
    );
}
