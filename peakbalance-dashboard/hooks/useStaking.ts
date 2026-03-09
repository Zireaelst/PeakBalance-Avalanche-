'use client';
import { useState } from 'react';

export function useStaking() {
    const [stakeBalance, setStakeBalance] = useState<number>(0); // AVAX
    const [isDepositing, setIsDepositing] = useState(false);

    const deposit = async (avaxAmount: number) => {
        setIsDepositing(true);
        // Wagmi write call placeholder — wired to StakingVault.deposit()
        await new Promise(r => setTimeout(r, 1500));
        setStakeBalance(prev => prev + avaxAmount);
        setIsDepositing(false);
    };

    return { stakeBalance, deposit, isDepositing };
}
