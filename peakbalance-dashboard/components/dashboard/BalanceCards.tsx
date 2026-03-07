'use client';

import { StatCard } from '@/components/ui/StatCard';
import type { Portfolio } from '@/types';

interface BalanceCardsProps {
    portfolio: Portfolio;
}

export function BalanceCards({ portfolio }: BalanceCardsProps) {
    const pnlColor = portfolio.pnl24h >= 0 ? '#4ade80' : '#f87171';
    const pnlSign = portfolio.pnl24h >= 0 ? '+' : '';

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1px',
                background: '#2a2a2a',
            }}
        >
            <StatCard
                label="AVAX_BALANCE"
                value={`${portfolio.avaxBalance.toFixed(2)} AVAX`}
                subValue={`$${portfolio.avaxValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                accentColor="#22d3ee"
            />
            <StatCard
                label="USDC_BALANCE"
                value={`${portfolio.usdcBalance.toFixed(2)} USDC`}
                subValue={`$${portfolio.usdcValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            />
            <StatCard
                label="TOTAL_VALUE"
                value={`$${portfolio.totalValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                subValue={`PEAK: $${portfolio.peakValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                subColor="#444444"
            />
            <StatCard
                label="P&L_24H"
                value={`${pnlSign}$${Math.abs(portfolio.pnl24h).toFixed(2)}`}
                subValue={`${pnlSign}${portfolio.pnl24hPct.toFixed(2)}%`}
                accentColor={pnlColor}
                subColor={pnlColor}
            />
        </div>
    );
}
