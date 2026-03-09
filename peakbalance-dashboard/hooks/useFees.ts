'use client';
import { useState } from 'react';

export function useFees(agentId?: number) {
    const [accrued, setAccrued] = useState(142.50); // mock USDC
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const claimFees = async () => {
        setIsClaiming(true);
        // Wagmi write call placeholder — wired to FeeDistributor.claimAgentFees()
        await new Promise(r => setTimeout(r, 1500));
        setAccrued(0);
        setClaimed(true);
        setIsClaiming(false);
    };

    return { accrued, claimFees, isClaiming, claimed };
}
