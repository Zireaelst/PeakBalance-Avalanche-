'use client';
import { StatCard } from '@/components/ui/StatCard';
import type { Portfolio } from '@/types';
interface Props { portfolio: Portfolio; }
export function BalanceCards({ portfolio }: Props) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#2a2a2a' }}>
            <StatCard label="AVAX_BALANCE" value={`${portfolio.avaxBalance.toFixed(2)} AVAX`} subValue={`$${portfolio.avaxValueUSD.toFixed(2)}`} />
            <StatCard label="USDC_BALANCE" value={`${portfolio.usdcBalance.toFixed(2)} USDC`} subValue={`$${portfolio.usdcValueUSD.toFixed(2)}`} />
            <StatCard label="TOTAL_VALUE" value={`$${portfolio.totalValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} subValue={`PEAK: $${portfolio.peakValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
            <StatCard label="P&L_24H" value={`${portfolio.pnl24h >= 0 ? '+' : ''}$${portfolio.pnl24h.toFixed(2)}`} subValue={`${portfolio.pnl24hPct >= 0 ? '+' : ''}${portfolio.pnl24hPct.toFixed(2)}%`} color={portfolio.pnl24h >= 0 ? '#4ade80' : '#f87171'} />
        </div>
    );
}
